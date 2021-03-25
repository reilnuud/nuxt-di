<template>
  <div ref="chart" class="min-h-1/2-screen w-full" />
</template>

<script>
import * as d3 from 'd3';
const { theme } = process.env.TAILWIND;

export default {
  data() {
    return {
      chart: null,
      colors: [
        theme.extend.colors.blue.default,
        theme.extend.colors.red.default
      ],
      years: [
        2019,
        2018,
        2017,
        2016,
        2015,
        2014,
        2013,
        2012,
        2011,
        2010,
        2009,
        2008,
        2007,
        2006,
        2005,
        2004,
        2003,
        2002,
        2001,
        2000
      ],
      chartData: [
        {
          title: 'taPay',
          data: [
            2435,
            2364,
            2295,
            2228,
            2142,
            2060,
            1962,
            1962,
            1923,
            1849,
            1849,
            1849,
            1821,
            1735,
            1676,
            1619,
            1595,
            1572,
            1572,
            1564
          ]
        },
        {
          title: 'rent',
          data: [2456, 2567, 2513, 2444, 2246, 2031, 1826, 1722, 1675, 1852]
        }
      ]
    };
  },
  mounted() {
    this.renderGraph();
  },
  methods: {
    renderGraph() {
      // access vue iinstance in anonymous funcs
      const _this = this;

      // declare vars
      const margin = { top: 10, right: 30, bottom: 30, left: 60 };
      const width = this.$refs.chart.clientWidth - margin.left - margin.right;
      const height = this.$refs.chart.clientHeight - margin.top - margin.bottom;

      // add the chart
      _this.chart = d3
        .select(_this.$refs.chart)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // Add X axis --> it is a date format
      const x = d3
        .scaleLinear()
        .domain(d3.extent(_this.years))
        .range([0, width]);
      _this.chart
        .append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(
          d3
            .axisBottom(x)
            .ticks(_this.years.length / 2)
            .tickFormat(d3.format('d'))
        );

      let largestNumber = null;
      let smallestNumber = null;

      _this.chartData.map(line => {
        const lineMax = d3.max(line.data);
        const lineMin = d3.min(line.data);
        if (largestNumber === null || lineMax > largestNumber) {
          largestNumber = lineMax;
        }
        if (smallestNumber === null || lineMin < smallestNumber) {
          smallestNumber = lineMin;
        }
      });

      // add y axis based on data
      const y = d3
        .scaleLinear()
        .domain([smallestNumber - 100, largestNumber + 100])
        .range([height, 0]);
      _this.chart.append('g').call(d3.axisLeft(y));

      const yearsAsc = _this.years.sort((b, a) => {
        return a - b;
      });

      // draw the lines
      _this.chartData.map((line, i) => {
        _this.chart
          .append('path')
          .datum(line.data)
          .attr('fill', 'none')
          .attr('stroke', _this.colors[i])
          .attr('stroke-width', 2)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('opacity', 0.8)
          .attr(
            'd',
            d3
              .line()
              .x((d, i) => {
                return x(yearsAsc[i]);
              })
              .y(function(d) {
                return y(d);
              })
          );
      });
    }
  }
};
</script>
