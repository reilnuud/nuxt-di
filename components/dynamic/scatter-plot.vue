<template>
  <div class="relative">
    <div ref="chart" class="min-h-1/2-screen w-full" />
    <div
      v-if="currentCounty != null"
      ref="tooltip"
      class="absolute text-xs bg-white p-3 border top-0 right-0 pointer-events-none"
    >
      <div>
        <div class="w-full">
          <div class="text-lg font-bold flex justify-between -mx-2">
            <div class="px-2">{{ currentCounty.name }}</div>
            <div class="px-2">
              {{
                (
                  (currentCounty.reporting / currentCounty.precincts) *
                  100
                ).toFixed(0)
              }}%
            </div>
          </div>
          <div
            v-for="(key, i) in Object.keys(currentCounty[`results_${metric}`])
              .filter(key => currentCounty[`results_${metric}`][key] > 0)
              .sort(key => currentCounty[`results_${metric}`][key])"
            :key="currentCounty.fips + key"
            class="flex -mx-1 py-1 border-b"
            :class="i === 0 ? 'border-t' : ''"
          >
            <div class="px-1 font-semi-bold uppercase">
              {{ key.substring(0, key.length - 1) }}
            </div>
            <div class="px-1 ml-auto">
              {{ currentCounty[`results_${metric}`][key] }}
            </div>
            <div class="px-1 w-8 text-right">
              {{
                (
                  (currentCounty[`results_${metric}`][key] /
                    currentCounty[`votes_${metric}`]) *
                  100
                ).toFixed(0)
              }}%
            </div>
          </div>
          <div class="mt-2 text-xxs font-bold tracking-1 uppercase">
            {{ currentCounty.reporting }}/{{ currentCounty.precincts }}
            Precincts Reporting
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
const { theme } = process.env.TAILWIND;

export default {
  props: {
    metric: {
      type: String,
      default: 'results_alignfinal'
    },
    x: {
      type: Array,
      default: null
    },
    y: {
      type: Array,
      default: null
    },
    dataname: {
      type: String,
      default: 'democrat_again'
    }
  },
  data() {
    return {
      chart: null,
      currentCounty: null,
      counties: null,
      colors: {
        white: theme.extend.colors.white.default,
        blue: theme.extend.colors.blue.default,
        red: theme.extend.colors.red.default,
        green: theme.extend.colors.green.default,
        yellow: theme.extend.colors.yellow.default,
        purple: theme.extend.colors.purple.default,
        gray: theme.extend.colors.gray.default
      },
      data: null
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      const _this = this;
      const url = `/json/${_this.dataname}.json`;
      const url2 = `/json/iowa_county_population_2018.json`;
      Promise.all([d3.json(url), d3.json(url2)]).then(files => {
        // load data
        // build results
        const results = {};
        files[0].data.races[0].counties.forEach(county => {
          const sorted = Object.keys(county[`results_${_this.metric}`])
            .filter(key => county[`results_${_this.metric}`][key] > 0)
            .sort(key => county[`results_${_this.metric}`][key]);
          const winner =
            county[`results_${_this.metric}`][sorted[0]] !==
            county[`results_${_this.metric}`][sorted[1]]
              ? sorted[0]
              : 'tie';
          results[county.fips] = county;
          results[county.fips].winner = winner;
          results[county.fips].margin =
            (county[`results_${_this.metric}`][sorted[0]] -
              county[`results_${_this.metric}`][sorted[1]]) /
            county[`votes_${_this.metric}`];
        });
        // build counties
        const counties = files[1].map(county => {
          return {
            ...county,
            ...results[county.FIPS]
          };
        });
        // set county data
        _this.data = counties;
        // then load map
        _this.renderGraph();
      });
      // d3.json(url).then(res => {
      //   // load data
      //   const counties = {}
      //   res.data.races[0].counties.forEach(
      //     county => (counties[county.fips] = county)
      //   )
      //   _this.counties = counties
      //   _this.data = res.data.races[0].counties.map(county => {
      //     const sorted = Object.keys(county[`results_${_this.metric}`])
      //       .filter(key => county[`results_${_this.metric}`][key] > 0)
      //       .sort(key => county[`results_${_this.metric}`][key])
      //     return {
      //       id: county.fips,
      //       winner:
      //         county[`results_${_this.metric}`][sorted[0]] !==
      //         county[`results_${_this.metric}`][sorted[1]]
      //           ? sorted[0]
      //           : 'tie',
      //       margin:
      //         (county[`results_${_this.metric}`][sorted[0]] -
      //           county[`results_${_this.metric}`][sorted[1]]) /
      //         county[`votes_${_this.metric}`],
      //       countedPrecincts: county.reporting / county.precincts
      //     }
      //   })
      // then load map
      // })
    },
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
        .domain([0, 500000])
        .range([0, width]);
      _this.chart
        .append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).ticks(10));

      // add y axis based on data
      const y = d3
        .scaleLinear()
        .domain([0, 0.5])
        .range([height, 0]);
      _this.chart.append('g').call(d3.axisLeft(y));

      _this.chart
        .append('g')
        .selectAll('dot')
        .data(_this.data)
        .enter()
        .append('circle')
        .attr('cx', function(d) {
          return x(d.Population);
        })
        .attr('cy', function(d) {
          return y(d.margin);
        })
        .attr('r', 4)
        .style('fill', d => {
          switch (d.winner) {
            case 'sandersb':
              d.color = _this.colors.blue;
              break;
            case 'buttigiegp':
              d.color = _this.colors.yellow;
              break;
            case 'klobuchara':
              d.color = _this.colors.green;
              break;
            case 'bidenj':
              d.color = _this.colors.purple;
              break;
            case 'warrene':
              d.color = _this.colors.red;
              break;
            default:
              d.color = _this.colors.gray;
          }
          return d.color;
        })
        .on('mouseover', (d, i, nodes) => {
          _this.currentCounty = _this.counties[d.id];
        })
        .on('mouseout', (d, i, nodes) => {
          _this.currentCounty = null;
        });

      // draw the lines
      //   _this.data.map((line, i) => {
      //     _this.chart
      //       .append('path')
      //       .datum(line.data)
      //       .attr('fill', 'none')
      //       .attr('stroke', _this.colors[i])
      //       .attr('stroke-width', 2)
      //       .attr('stroke-linejoin', 'round')
      //       .attr('stroke-linecap', 'round')
      //       .attr('opacity', 0.8)
      //       .attr(
      //         'd',
      //         d3
      //           .line()
      //           .x((d, i) => {
      //             return x(yearsAsc[i])
      //           })
      //           .y(function(d) {
      //             return y(d)
      //           })
      //       )
      //   })
    }
  }
};
</script>
