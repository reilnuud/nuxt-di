<template>
  <div
    :class="{
      [background]: background,
      'overflow-x-scroll': width === 'lg' || width === 'xl'
    }"
    style="font-variant-numeric: tabular-nums;"
  >
    <div class="absolute left-0 right-0 z-10">
      <container v-if="currentShape != null" class="relative">
        <!-- tooltip -->
        <div
          ref="tooltip"
          class="absolute top-0 right-0 p-6 pointer-evens-none w-64"
        >
          <div class="p-3 bg-white">
            <div class="w-full">
              <div>
                <div class="font-bold">{{ currentShape.county }}</div>
                <div class="absolute text-xs text-grey top-0 right-0 p-10">
                  <div>{{ currentShape.pid }}</div>
                  <div>
                    {{ currentShape.time }}
                  </div>
                </div>
                <div class="text-grey uppercase text-xs">
                  {{ currentShape.name }}
                </div>
              </div>
              <div class="border-t py-2 mt-2">
                <div class="flex flex-wrap text-xs uppercase">
                  <div class="w-1/2 mb-2 px-2">
                    <div class="text-xxs">Final Votes</div>
                    <div class="font-bold">
                      {{ currentShape.final }}
                    </div>
                  </div>
                  <div class="w-1/2 px-2 mb-2">
                    <div class="text-xxs">SDEs</div>
                    <div class="font-bold">
                      {{ currentShape.sde.toFixed(2) }}
                    </div>
                  </div>
                  <div class="w-1/2 mb-2 px-2">
                    <div class="text-xxs">Winner</div>
                    <div class="font-bold">
                      {{ currentShape.winner_final }}
                    </div>
                  </div>
                  <div class="w-1/2 mb-2 px-2">
                    <div class="text-xxs">SDEs Won</div>
                    <div class="font-bold">
                      {{
                        currentShape.winner_final !== 'tie'
                          ? currentShape.results[currentShape.winner_final].sde
                          : 'N/A'
                      }}
                    </div>
                  </div>
                </div>
              </div>
              <ul>
                <li
                  v-for="(key, i) in Object.keys(currentShape.results)
                    .filter(key => currentShape.results[key].first > 0)
                    .sort(key => currentShape.results[key].sde)"
                  :key="key"
                  class="flex text-xxs py-1 border-b"
                  :class="i === 0 ? 'border-t' : ''"
                >
                  <div
                    class="pr-1 w-1/4 font-semi-bold uppercase"
                    style="width: 40%;"
                  >
                    {{ key }}
                  </div>
                  <div
                    class="px-1 w-1/8 text-right ml-auto"
                    style="width: 10%;"
                  >
                    {{ currentShape.results[key].first }}
                  </div>
                  <div
                    class="px-1 w-1/8 text-right ml-auto"
                    style="width: 10%;"
                  >
                    {{ currentShape.results[key].final }}
                  </div>
                  <div
                    class="px-1 w-1/8 text-right ml-auto"
                    style="width: 20%;"
                  >
                    {{ currentShape.results[key].sde.toFixed(2) }}
                  </div>
                  <div class="pl-1 w-1/8 w-8 text-right" style="width: 20%;">
                    {{
                      (
                        (currentShape.results[key].sde / currentShape.sde) *
                        100
                      ).toFixed(0)
                    }}%
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </container>
    </div>
    <container class="relative z-0 pt-6 w-full" :variant="chartSize">
      <!-- chart -->
      <div class="sticky left-0">
        <container variant="copy" class="mb-12">
          <div class="text-center text-lg font-bold">{{ title }}</div>
        </container>
      </div>
      <div ref="chart" class="min-h-1/2-screen w-full pl-8 pb-8">
        <div class="absolute inset-0 pointer-events-none">
          <div
            class="absolute top-0 left-0 bottom-0 flex flex-col items-center justify-center"
          >
            <div>
              <div
                class="transform text-center font-bold text-sm uppercase -rotate-90 leading-none"
              >
                {{ ylabel }}
              </div>
            </div>
          </div>
          <div
            class="absolute bottom-0 text-center font-bold text-sm uppercase left-0 right-0"
          >
            <div class="-mt-8 leading-none">
              {{ xlabel }}
            </div>
          </div>
        </div>
      </div>
    </container>
    <div class="sticky left-0">
      <container class="pb-12">
        <legend-colors :values="colors" class="justify-center" />
      </container>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
// const colors = [...Array(10)].map((v, i) =>
//   d3.interpolateSpectral((i + 1) / 10)
// )
import Color from 'color';
const colors = d3.schemeCategory10.map(color =>
  String(
    Color(color)
      .lighten(0.125)
      .hex()
  ).replace('0x', '#')
);
const { theme } = process.env.TAILWIND;

export default {
  props: {
    background: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: 'Scatter Plot'
    },
    width: {
      type: String,
      default: 'container'
    },
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
    xlabel: {
      type: String,
      default: 'X Axis'
    },
    ylabel: {
      type: String,
      default: 'Y Axis'
    },
    dataname: {
      type: String,
      default: 'iowa_precinct_votes_2'
    }
  },
  data() {
    return {
      chart: null,
      currentShape: null,
      counties: null,
      filter: ['warren'],
      colors: {
        sanders: colors[0],
        warren: colors[1],
        klobuchar: colors[2],
        buttigieg: colors[3],
        biden: colors[4],
        other: theme.extend.colors.gray.default
      },
      data: null
    };
  },
  computed: {
    chartSize() {
      const sizes = {
        sm: 'copy',
        md: 'site',
        lg: 'full',
        xl: 'full'
      };
      return sizes[this.width];
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      const _this = this;
      const url = `/json/${_this.dataname}.json`;
      d3.json(url).then(res => {
        const precincts = _this.$processPrecincts(res);
        // set county data
        _this.data = precincts;
        // then load map
        _this.renderGraph();
      });
    },
    renderGraph() {
      // access vue iinstance in anonymous funcs
      const _this = this;

      const sizes = {
        width: {
          sm: 1,
          md: 1,
          lg: 2,
          xl: 3
        },
        height: { sm: 1, md: 1, lg: 1.25, xl: 1.5 }
      };

      // declare vars
      const margin = { top: 20, right: 20, bottom: 20, left: 20 };
      const width =
        this.$refs.chart.clientWidth * sizes.width[_this.width] -
        margin.left -
        margin.right;
      const height =
        this.$refs.chart.clientHeight * sizes.height[_this.width] -
        margin.top -
        margin.bottom;

      // add the chart
      _this.chart = d3
        .select(_this.$refs.chart)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // Add X axis
      const x = d3
        .scalePow()
        .exponent(1)
        .domain([0, 1800])
        .range([0, width]);
      _this.chart
        .append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x).ticks(10));

      // add y axis
      const y = d3
        .scalePow()
        .exponent(1)
        .domain([0, 10])
        .range([height, 0]);

      _this.chart.append('g').call(d3.axisLeft(y));

      // const xscale = d3
      //   .scaleLinear()
      //   .domain([0, 1800])
      //   .range([0, width])

      // const yscale = d3
      //   .scaleLinear()
      //   .domain([0, 10])
      //   .range([height, 0])

      // const line = d3
      //   .line()
      //   .x((d, i) => {
      //     return xscale(i)
      //   }) // set the x values for the line generator
      //   .y(d => {
      //     if (
      //       !isNaN(
      //         _this.data[d].results.sanders.final / _this.data[d].final
      //       )
      //     ) {
      //       return yscale(
      //         (_this.data[d].results.sanders.final /
      //           _this.data[d].final) *
      //           5 +
      //           2
      //       )
      //     }
      //     console.log(_this.data[d])
      //     return yscale(0)
      //   })

      // _this.chart
      //   .append('path')
      //   .datum(Object.keys(_this.data))
      //   .attr('fill', 'none')
      //   .attr('stroke-width', 1)
      //   .attr('stroke', _this.colors.sanders)
      //   .attr('stroke-linejoin', 'round')
      //   .attr('stroke-linecap', 'round')
      //   .attr('stroke-opacity', 0.5)
      //   .attr('d', line)

      // _this.chart
      //   .append('g')
      //   .selectAll('dot')
      //   .data(
      //     Object.keys(_this.data).filter(key => {
      //       return _this.data[key].winner_final === 'buttigieg'
      //     })
      //   )
      //   .enter()
      //   .append('circle')
      //   .attr('cx', d => {
      //     return x(_this.data[d].final - _this.data[d].first)
      //   })
      //   .attr('cy', d => {
      //     return y(_this.data[d].sde.toFixed(2))
      //   })
      //   .attr('r', 2)
      //   .style('fill', d => {
      //     const color = _this.colors.yellow
      //     // switch (_this.data[d].winner_final) {
      //     //   case 'sanders':
      //     //     color = _this.colors.blue
      //     //     break
      //     //   case 'buttigieg':
      //     //     color = _this.colors.yellow
      //     //     break
      //     //   case 'klobuchar':
      //     //     color = _this.colors.green
      //     //     break
      //     //   case 'biden':
      //     //     color = _this.colors.purple
      //     //     break
      //     //   case 'warren':
      //     //     color = _this.colors.red
      //     //     break
      //     //   default:
      //     //     color = _this.colors.gray
      //     // }
      //     return color
      //   })

      // _this.chart
      //   .append('g')
      //   .selectAll('dot')
      //   .data(
      //     Object.keys(_this.data).filter(key => {
      //       return _this.data[key].winner_final === 'sanders'
      //     })
      //   )
      //   .enter()
      //   .append('circle')
      //   .attr('cx', d => {
      //     return x(_this.data[d].final - _this.data[d].first)
      //   })
      //   .attr('cy', d => {
      //     return y(_this.data[d].sde.toFixed(2))
      //   })
      //   .attr('r', 2)
      //   .style('fill', d => {
      //     const color = _this.colors.blue
      //     // switch (_this.data[d].winner_final) {
      //     //   case 'sanders':
      //     //     color = _this.colors.blue
      //     //     break
      //     //   case 'buttigieg':
      //     //     color = _this.colors.yellow
      //     //     break
      //     //   case 'klobuchar':
      //     //     color = _this.colors.green
      //     //     break
      //     //   case 'biden':
      //     //     color = _this.colors.purple
      //     //     break
      //     //   case 'warren':
      //     //     color = _this.colors.red
      //     //     break
      //     //   default:
      //     //     color = _this.colors.gray
      //     // }
      //     return color
      //   })
      const filter = _this.filter;

      let i = 0;
      Object.keys(_this.data).forEach(key => {
        i += 1;
        _this.chart
          .append('g')
          .selectAll('dot')
          .data(
            Object.keys(_this.data[key].results).filter(
              d =>
                _this.data[key].results[d].sde !== 0 &&
                _this.data[key].results[d].final !== 0 &&
                filter.includes(d) &&
                key !== 'uncomitted'
            )
          )
          .enter()
          .append('circle')
          .attr('cx', d => {
            return x(i);
            // return x(_this.data[key].final)
          })
          .attr('cy', d => {
            return y(
              (
                _this.data[key].results[d].sde /
                _this.data[key].results[d].final
              ).toFixed(8) *
                _this.data[key].results[d].sde *
                100
            );
          })
          .attr('r', 1.5)
          .attr('stroke-width', 6)
          .attr('stroke-opacity', 0.1)
          .attr('fill-opacity', 1)
          .attr('stroke', d => {
            return _this.colors[d] || _this.colors.other;
          })
          .style('fill', d => {
            return _this.colors[d] || _this.colors.other;
          })
          .on('mouseover', (d, i, nodes) => {
            _this.currentShape = _this.data[key];
          })
          .on('mouseout', (d, i, nodes) => {
            _this.currentShape = null;
          });
      });
    }
  }
};
</script>
