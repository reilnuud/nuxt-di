<template>
  <div class="relative" style="font-variant-numeric: tabular-nums;">
    <div ref="map" class="min-h-1/2-screen w-full" />
    <div
      v-if="currentShape != null"
      ref="tooltip"
      class="absolute text-xs bg-white p-3 border top-0 right-0 pointer-events-none"
    >
      <div>
        <div class="w-full">
          <div class="text-lg font-bold flex justify-between -mx-2">
            <div class="px-2">{{ currentShape.name }}</div>
            <div class="px-2">
              {{
                (
                  (currentShape.reporting / currentShape.precincts) *
                  100
                ).toFixed(0)
              }}%
            </div>
          </div>
          <div
            v-for="(key, i) in Object.keys(currentShape[`results_${metric}`])
              .filter(key => currentShape[`results_${metric}`][key] > 0)
              .sort(key => currentShape[`results_${metric}`][key])"
            :key="currentShape.fips + key"
            class="flex -mx-1 py-1 border-b"
            :class="i === 0 ? 'border-t' : ''"
          >
            <div class="px-1 font-semi-bold uppercase">
              {{ key.substring(0, key.length - 1) }}
            </div>
            <div class="px-1 ml-auto">
              {{ currentShape[`results_${metric}`][key] }}
            </div>
            <div class="px-1 w-8 text-right">
              {{
                (
                  (currentShape[`results_${metric}`][key] /
                    currentShape[`votes_${metric}`]) *
                  100
                ).toFixed(0)
              }}%
            </div>
          </div>
          <div class="mt-2 text-xxs font-bold tracking-1 uppercase">
            {{ currentShape.reporting }}/{{ currentShape.precincts }}
            Precincts Reporting
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
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
    mapname: {
      type: String,
      default: 'IA'
    },
    rotate: {
      type: Number,
      default: 93
    },
    dataname: {
      type: String,
      default: 'precinct_votes_iowa'
    }
  },
  data() {
    return {
      chart: null,
      currentShape: null,
      counties: null,
      colors: {
        white: theme.extend.colors.white.default,
        sanders: colors[0],
        warren: colors[1],
        klobuchar: colors[2],
        buttigieg: colors[3],
        biden: colors[4],
        gabbard: colors[5],
        steyer: colors[6],
        yang: colors[7],
        default: theme.extend.colors.gray.default,
        error: theme.extend.colors.black.default
      },
      data: null
    };
  },
  computed: {
    totals() {
      const _this = this;
      // const data = this.data
      const totals = {
        bennett: {
          first: 0,
          final: 0,
          sde: 0
        },
        biden: {
          first: 0,
          final: 0,
          sde: 0
        },
        bloomberg: {
          first: 0,
          final: 0,
          sde: 0
        },
        buttigieg: {
          first: 0,
          final: 0,
          sde: 0
        },
        delaney: {
          first: 0,
          final: 0,
          sde: 0
        },
        gabbard: {
          first: 0,
          final: 0,
          sde: 0
        },
        klobuchar: {
          first: 0,
          final: 0,
          sde: 0
        },
        patrick: {
          first: 0,
          final: 0,
          sde: 0
        },
        sanders: {
          first: 0,
          final: 0,
          sde: 0
        },
        steyer: {
          first: 0,
          final: 0,
          sde: 0
        },
        warren: {
          first: 0,
          final: 0,
          sde: 0
        },
        yang: {
          first: 0,
          final: 0,
          sde: 0
        },
        other: {
          first: 0,
          final: 0,
          sde: 0
        },
        uncomitted: {
          first: 0,
          final: 0,
          sde: 0
        }
      };
      Object.keys(this.data).forEach(key => {
        const precinct = _this.data[key];
        Object.keys(precinct.results).forEach(key => {
          totals[key] = {
            first: totals[key].first + precinct.results[key].first,
            final: totals[key].final + precinct.results[key].final,
            sde: totals[key].sde + precinct.results[key].sde
          };
        });
      });
      return totals;
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    getBiggestNumber(obj) {
      return Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b));
    },
    processCounty(county) {
      const _this = this;
      return Object.keys(county[`results_${_this.metric}`])
        .filter(key => county[`results_${_this.metric}`][key] > 0)
        .sort(key => county[`results_${_this.metric}`][key]);
    },
    loadData() {
      const _this = this;
      const url = `/json/${_this.dataname}.json`;
      d3.json(url).then(res => {
        const precincts = _this.processPrecincts(res);
        // set county data
        _this.data = precincts;
        // then load map
        _this.loadMap();
      });
    },
    processPrecincts(data) {
      const pObj = array => {
        return {
          county: array[0],
          pid: array[2],
          results: {
            bennett: {
              first: array[10],
              final: array[11],
              sde: array[12]
            },
            biden: {
              first: array[13],
              final: array[14],
              sde: array[15]
            },
            bloomberg: {
              first: array[16],
              final: array[17],
              sde: array[18]
            },
            buttigieg: {
              first: array[19],
              final: array[20],
              sde: array[21]
            },
            delaney: {
              first: array[7],
              final: array[8],
              sde: array[9]
            },
            gabbard: {
              first: array[22],
              final: array[23],
              sde: array[24]
            },
            klobuchar: {
              first: array[25],
              final: array[26],
              sde: array[27]
            },
            patrick: {
              first: array[31],
              final: array[32],
              sde: array[33]
            },
            sanders: {
              first: array[34],
              final: array[35],
              sde: array[36]
            },
            steyer: {
              first: array[37],
              final: array[38],
              sde: array[39]
            },
            warren: {
              first: array[43],
              final: array[44],
              sde: array[45]
            },
            yang: {
              first: array[46],
              final: array[47],
              sde: array[48]
            },
            other: {
              first: array[28],
              final: array[29],
              sde: array[30]
            },
            uncomitted: {
              first: array[40],
              final: array[41],
              sde: array[42]
            }
          }
        };
      };
      const precincts = {};
      data.forEach(precinct => {
        precincts[`${precinct[0]} - ${precinct[3]}`] = pObj(precinct);
      });

      Object.keys(precincts).forEach(key => {
        const precinct = precincts[key];
        const sortedFirst = Object.keys(precinct.results).sort((a, b) => {
          return precinct.results[b].first - precinct.results[a].first;
        });
        const sortedFinal = Object.keys(precinct.results).sort(
          (a, b) => precinct.results[b].final - precinct.results[a].final
        );
        let totalFirstVotes = 0;
        let totalFinalVotes = 0;
        let totalSDE = 0;
        Object.keys(precinct.results).forEach(candidate => {
          totalFirstVotes += precinct.results[candidate].first;
          totalFinalVotes += precinct.results[candidate].final;
          totalSDE += precinct.results[candidate].sde;
        });
        // precincts[key].winner_first = ;
        // precincts[key].winner_final = ;
        precincts[key].votes_first = totalFirstVotes;
        precincts[key].votes_final = totalFinalVotes;
        precincts[key].sde_total = totalSDE;
        precincts[key].winner_first =
          precinct.results[sortedFirst[0]].first ===
          precinct.results[sortedFirst[1]].first
            ? 'tie'
            : sortedFirst[0];
        precincts[key].winner_final =
          precinct.results[sortedFinal[0]].final ===
          precinct.results[sortedFinal[1]].final
            ? 'tie'
            : sortedFinal[0];
      });
      return precincts;
    },
    loadMap() {
      const _this = this;
      const url = `/topojson/${_this.mapname}-topo.json`;
      d3.json(url)
        .then(topology => {
          const geojson = topojson.feature(
            topology,
            topology.objects[Object.keys(topology.objects)[0]]
          );
          // add svg
          const svg = d3
            .select(_this.$refs.map)
            .append('svg')
            .attr('width', _this.$refs.map.clientWidth)
            .attr('height', _this.$refs.map.clientHeight);
          const svgWidth = svg.node().getBoundingClientRect().width;
          const svgHeight = svg.node().getBoundingClientRect().height;
          const projection = d3
            .geoConicEqualArea()
            .parallels([29.5, 45.5])
            .rotate([_this.rotate, 0, 0])
            .fitExtent(
              [
                [0, 0],
                [svgWidth, svgHeight]
              ],
              geojson
            );
          const path = d3
            .geoPath() // path generator that will convert GeoJSON to SVG paths
            .projection(projection);
          // add features
          svg
            .selectAll('path')
            .data(geojson.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('style', 'transition:.25s ease all;')
            .attr('fill', d => {
              const precinctID = Object.keys(_this.data).find(
                key => key === d.properties.COUNTY_NAME + ' ' + d.properties.ID
              );
              d.precinct = _this.data[precinctID];
              if (d.precinct) {
                // const results =
                //   countyData[d.properties.GEOID][`results_${_this.metric}`]
                // d.percentReporting =
                //   countyData[d.properties.GEOID].reporting /
                //   countyData[d.properties.GEOID].precincts
                // const sortedCounty = _this.processCounty(
                //   countyData[d.properties.GEOID]
                // )
                // if (results[sortedCounty[0]] === results[sortedCounty[1]]) {
                //   d.color = _this.colors.white.default
                //   d.difference = 0
                //   return d.color
                // }
                // switch (sortedCounty[0]) {
                //   case 'sandersb':
                //     d.color = _this.colors.blue
                //     break
                //   case 'buttigiegp':
                //     d.color = _this.colors.yellow
                //     break
                //   case 'klobuchara':
                //     d.color = _this.colors.green
                //     break
                //   case 'bidenj':
                //     d.color = _this.colors.purple
                //     break
                //   case 'warrene':
                //     d.color = _this.colors.red
                //     break
                //   default:
                //     d.color = _this.colors.gray
                // }
                // d.difference = 1
                // (((d.county.Population / maxPop) *
                //   (results[sortedCounty[0]] - results[sortedCounty[1]])) /
                //   d.county[`votes_${_this.metric}`]) *
                // 100
                // const county = (d.difference =
                //   0.5(
                //     (results[sortedCounty[0]] - results[sortedCounty[1]]) /
                //       countyData[d.properties.GEOID][`votes_${_this.metric}`]
                //   ) *
                //   (_this.counties[d.properties.GEOID].Population / maxPop))
                // console.log(d.properties.GEOID)
                // d.difference =
                //   countyData[d.properties.GEOID].precincts -
                //   countyData[d.properties.GEOID].reporting -
                //   3
                // d.difference =
                //   d.county.votes_align1 < d.county.votes_alignfinal ? 1 : 0
              } else {
                d.color = _this.colors.gray;
              }
              return d.color;
            });
          // .attr('fill-opacity', d => d.difference)
          // .attr('stroke', theme.extend.colors.white.default)
          // .attr('stroke-width', '0.5')
          // .attr('stroke-linejoin', 'round')
          // .on('mouseover', (d, i, nodes) => {
          //   _this.currentShape = countyData[d.properties.GEOID]
          //   d3.select(nodes[i]).attr('fill-opacity', 1)
          // })
          // .on('mouseout', (d, i, nodes) => {
          //   _this.currentShape = null
          //   d3.select(nodes[i]).attr('fill-opacity', d.difference)
          // })
        })
        .catch(e => {
          throw e;
        });
    }
  }
};
</script>
