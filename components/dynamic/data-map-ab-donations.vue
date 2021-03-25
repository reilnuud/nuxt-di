<template>
  <div
    ref="graphContainer"
    class="relative w-full py-12"
    :class="{
      [background]: background
    }"
    style="font-variant-numeric: tabular-nums;"
  >
    <!-- title -->
    <container variant="copy" class="mb-6">
      <div class="text-center text-lg font-bold">{{ title }}</div>
      <prismic-rich-text
        v-if="subtitle !== null"
        class="leading-normal text-center text-sm rich-text mt-1"
        :richtext="subtitle"
      />
    </container>

    <!-- map container -->
    <container class="relative z-0 w-full py-6" :variant="chartSize">
      <!-- map -->
      <div ref="map" class="min-h-1/2-screen w-full opacity-0" />
      <!-- tooltip -->
      <div
        v-if="currentShape != null && Object.keys(currentShape).length > 1"
        ref="tooltip"
        class="absolute text-xs bg-white p-3 border top-0 right-0 pointer-events-none"
      >
        <div>
          <div class="w-full">
            <div class="text-lg font-bold flex justify-between -mx-2">
              <div class="px-2">{{ currentShape.geoid }}</div>
            </div>
            <!-- <div
              v-for="(key, i) in Object.keys(currentShape.candidates)
                .filter(key => currentShape.candidates[key][metric] > 0)
                .sort(key => currentShape.candidates[key][metric])"
              :key="currentShape.fips + key"
              class="flex -mx-1 py-1 border-b"
              :class="{
                'border-t': i === 0,
                'font-bold': currentShape[`winner_${metric}`] === key
              }"
            >
              <div class="px-1 font-semi-bold uppercase">
                {{ key }}
              </div>
              <div class="px-1 ml-auto">
                {{ currentShape.candidates[key][metric].toLocaleString() }}
              </div>
              <div class="px-1 w-8 text-right">
                {{
                  (
                    (currentShape.candidates[key][metric] /
                      currentShape[metric]) *
                    100
                  ).toFixed(0)
                }}%
              </div>
            </div> -->
            <!-- <div class="mt-2 text-xxs font-bold tracking-1 uppercase">
              {{
                (
                  (currentShape.reporting / currentShape.precincts) *
                  100
                ).toFixed(0)
              }}% {{ currentShape.reporting }}/{{ currentShape.precincts
              }}<br />
              Precincts Reporting
            </div> -->
            <div>{{ currentShape.m_count }} {{ currentShape.d_count }}</div>
          </div>
        </div>
      </div>
    </container>
    <!-- legend -->
    <container>
      <legend-colors :values="colors" class="justify-center" />
    </container>
    <!-- download button -->
    <container
      ref="saveButton"
      variant="copy"
      class="hidden justify-center items-center text-center"
    >
      <button
        class="p-2 flex-inline text-grey hover:text-black text-xs font-semibold items-center transition uppercase tracking-1"
      >
        Save Image <i class="material-icons">save_alt</i>
      </button>
    </container>
  </div>
</template>

<script>
import Color from 'color';
import gsap from 'gsap';

import * as topojson from 'topojson-client';
import * as d3 from 'd3';
const { theme } = process.env.TAILWIND;

const colors = d3.schemeCategory10.map(color =>
  String(
    Color(color)
      .lighten(0.125)
      .hex()
  ).replace('0x', '#')
);

export default {
  props: {
    title: {
      type: String,
      default: 'Scatter Plot'
    },
    subtitle: {
      type: Array,
      default: null
    },
    background: {
      type: String,
      default: null
    },
    projection: {
      type: String,
      default: null
    },
    width: {
      type: String,
      default: 'container'
    },
    features: {
      type: String,
      default: 'iowa_counties'
    },
    datafiles: {
      type: Array,
      default: null
    },
    rotate: {
      type: Number,
      default: 93
    }
  },
  data() {
    return {
      force: null,
      data: null,
      metric: 'first',
      nodes: null,
      centroids: {},
      currentShape: null,
      colors: {
        sanders: colors[0],
        warren: colors[1],
        klobuchar: colors[2],
        buttigieg: colors[3],
        biden: colors[4],
        other: theme.extend.colors.gray.default,
        tie: theme.extend.colors.black.default
      }
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
    // totals() {
    //   const _this = this
    //   // const totals = { first: 0, final: 0, viable: 0, sde: 0 }
    //   const countyTotals = {}
    //   _this.data.forEach(county => {

    //   })
    //   return countyTotals
    // },
    // stateTotals() {
    //   if (this.totals != null && Object.keys(this.totals).length > 2) {
    //     const _this = this
    //     const sTotals = { first: 0, final: 0, sde: 0 }
    //     const totals = _this.totals
    //     Object.keys(totals).forEach(total => {
    //       const county = _this.totals[total]
    //       sTotals.candidates = {}
    //       Object.keys(county.candidates).forEach(c => {
    //         sTotals.candidates[c] = { first: 0, final: 0, sde: 0 }
    //       })
    //       Object.keys(county.candidates).forEach(c => {
    //         sTotals.candidates[c].first += county.candidates[c].first
    //         sTotals.candidates[c].final += county.candidates[c].final
    //         sTotals.candidates[c].sde += county.candidates[c].sde
    //       })
    //       // sort candidates
    //       const firstSorted = Object.keys(sTotals.candidates).sort(
    //         (a, b) => b.first - a.first
    //       )
    //       const finalSorted = Object.keys(sTotals.candidates).sort(
    //         (a, b) => b.final - a.final
    //       )
    //       const sdeSorted = Object.keys(sTotals.candidates).sort(
    //         (a, b) => b.sde - a.sde
    //       )
    //       // assign winners
    //       sTotals.winner_first = firstSorted[0]
    //       sTotals.winner_final = finalSorted[0]
    //       sTotals.winner_sde = sdeSorted[0]
    //       // get totals
    //       sTotals.first += county.first
    //       sTotals.final += county.final
    //       sTotals.sde += county.sde
    //     })
    //     return sTotals
    //   }
    //   return null
    // }
  },
  watch: {
    metric() {
      const _this = this;
      this.nodes = this.nodes.map(node => {
        // node.label = `+${_this.totals[node.fips][
        //   `margin_${_this.metric}`
        // ].toLocaleString()}`
        node.radius = _this.getRadius(node);
        node.dasharray = 2 * node.radius * Math.PI;
        node.dashoffset =
          2 * node.radius * Math.PI -
          2 * node.radius * Math.PI * (node.reporting / node.precincts);
        return node;
      });
      this.force
        .force('collision')
        .radius(d => d.radius + 1)
        .strength(1);
      this.force.alpha(1).restart();
    }
  },
  mounted() {
    const _this = this;
    _this.loadData();
  },
  methods: {
    getRadius(p) {
      return p.d_count / 1000 > 0.5 ? p.d_count / 1000 : 0.5;
    },
    getTotals(county, metric) {
      const totals = {};
      let votes = 0;
      totals.candidates = {};
      Object.keys(county[metric]).forEach(c => {
        const cName = c.substring(0, c.length - 1);
        totals.candidates[cName] = county[metric][c];
        votes += county[metric][c];
      });
      const sorted = Object.keys(county[metric]).sort(
        (a, b) => county[metric][b] - county[metric][a]
      );
      totals.margin = county[metric][sorted[0]] - county[metric][sorted[1]];
      if (totals.margin > 0) {
        totals.winner = sorted[0].substring(0, sorted[0].length - 1);
      } else {
        totals.winner = 'tie';
      }
      totals.votes = votes;
      totals.reporting = county.reporting;
      totals.precincts = county.precincts;
      totals.fips = county.fips;
      totals.name = county.name;
      return totals;
    },
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
      const dataFiles = _this.datafiles.map(file => d3.json(file.data.url));
      Promise.all(dataFiles)
        .then(files => {
          _this.data = {};
          files.forEach(file => {
            _this.data = { ..._this.data, ...file };
          });
          _this.loadMap();
        })
        .catch(err => {
          console.log(err);
        });
    },
    createImage() {
      const html2canvas = require('html2canvas');
      html2canvas(this.$refs.graphContainer).then(image =>
        document.body.appendChild(image)
      );
    },
    loadMap() {
      const _this = this;
      d3.json(_this.features)
        .then(topology => {
          // create object with county values
          const countyData = {};
          const pops = [];
          Object.keys(_this.data).forEach(key => {
            const county = _this.data[key];
            pops.push(parseInt(county.Population));
            countyData[county.fips] = county;
          });
          // const maxPop = Math.max(...pops)
          // parse topojson
          const geojson = topojson.feature(
            topology,
            topology.objects[Object.keys(topology.objects)[0]]
          );
          // add svg
          const svg = d3
            .select(_this.$refs.map)
            .append('svg')
            .attr('class', 'overflow-visible')
            .attr('width', _this.$refs.map.clientWidth)
            .attr('height', _this.$refs.map.clientHeight);
          const svgWidth = svg.node().getBoundingClientRect().width;
          const svgHeight = svg.node().getBoundingClientRect().height;

          // configure projection
          let dProjection;
          if (_this.projection === 'geoAlbersUsa') {
            dProjection = d3.geoAlbersUsa();
          } else if (_this.projection === 'geoAlbers') {
            dProjection = d3.geoAlbers();
          } else if (_this.projection === 'geoConicEqualArea') {
            dProjection = d3.geoConicEqualArea().parallels([29.5, 45.5]);
          } else {
            dProjection = d3.geoIdentity();
          }
          dProjection.fitExtent(
            [
              [0, 0],
              [svgWidth, svgHeight]
            ],
            geojson
          );

          // project the features
          const path = d3
            .geoPath() // path generator that will convert GeoJSON to SVG paths
            .projection(dProjection);

          gsap.to(_this.$refs.map, {
            opacity: 1,
            duration: 0.333,
            ease: 'power1.in'
          });

          const getColor = w => {
            switch (w.replace('_count', '')) {
              case 's':
                return 'sanders';
              case 'b':
                return 'biden';
              case 'k':
                return 'klobuchar';
              case 'w':
                return 'warren';
              case 'p':
                return 'buttigieg';
              default:
                return 'other';
            }
          };

          // add features
          // eslint-disable-next-line no-unused-vars
          const counties = svg
            .selectAll('path')
            .data(geojson.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('data-geoid', d => d.properties.GEOID)
            .attr('style', 'transition:.25s ease all;')
            .attr('fill', d => {
              return theme.extend.colors.white.default;
            })
            .attr('stroke', theme.extend.colors.black['100'])
            .attr('stroke-width', '.25')
            .attr('stroke-linejoin', 'round')
            .on('mouseover', (d, i, nodes) => {
              _this.currentShape = _this.data[d.geoid];
              d3.select(nodes[i]).attr(
                'fill',
                theme.extend.colors.white['400']
              );
            })
            .on('mouseout', (d, i, nodes) => {
              _this.currentShape = null;
              d3.select(nodes[i]).attr(
                'fill',
                theme.extend.colors.white.default
              );
            });

          // get centroids
          geojson.features.forEach(f => {
            _this.centroids[f.properties.GEOID] = path.centroid(f);
          });

          _this.nodes = Object.keys(_this.data)
            .filter(fips => Object.keys(_this.centroids).includes(fips))
            .map(fips => {
              const county = _this.data[fips];
              const countyNode = county;
              countyNode.x = _this.centroids[fips]
                ? _this.centroids[fips][0]
                : // polk county in case is satellite
                  _this.centroids[19153][0];
              countyNode.y = _this.centroids[fips]
                ? _this.centroids[fips][1]
                : // polk county in case is satellite
                  _this.centroids[19153][1];
              // countyNode.label = `+${_this.totals[county.fips][
              //   `margin_${_this.metric}`
              // ].toLocaleString()}`
              countyNode.opacity = 0.75;
              countyNode.radius = _this.getRadius(county);
              countyNode.dasharray = 2 * countyNode.radius * Math.PI;
              countyNode.dashoffset =
                2 * countyNode.radius * Math.PI -
                2 *
                  countyNode.radius *
                  Math.PI *
                  (countyNode.reporting / countyNode.precincts);
              return countyNode;
            });

          const node = svg
            .append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(_this.nodes)
            .enter()
            .append('g')
            .on('mouseover', (d, i, nodes) => {
              _this.currentShape = d;
              // d3.selectAll(counties)
              //   .filter(c => {
              //     return d.fips === c.property.GEOID
              //   })
              //   .attr('fill', theme.extend.colors.white['400'])
              d3.select(nodes[i]).attr('fill-opacity', 0.9);
            })
            .on('mouseout', (d, i, nodes) => {
              _this.currentShape = null;
              d3.select(counties[i]).attr(
                'fill',
                theme.extend.colors.white['400']
              );
              d3.select(nodes[i]).attr('fill-opacity', d => d.opacity);
            });

          node
            .append('circle')
            .attr('data-fips', d => d.fips)
            .attr('style', 'transition:.25s ease fill-opacity;')
            .attr('r', d => d.radius)
            .attr('fill', d => _this.colors[getColor(d.m_count)])
            .attr('fill-opacity', d => d.opacity)
            .attr('stroke', d => {
              return _this.colors[getColor(d.m_count)];
            })
            .attr('stroke-width', 0.5)
            .attr('stroke-dasharray', d => d.dasharray)
            .attr('stroke-dashoffset', d => d.dashoffset)
            .attr('stroke-opacity', 1);

          // node
          //   .append('text')
          //   .attr(
          //     'class',
          //     'absolute inset-0 flex items-center justify-center font-bold text-xs'
          //   )
          //   .attr('text-anchor', 'middle')
          //   .attr(
          //     'stroke',
          //     d => _this.colors[_this.totals[d.fips][`winner_${_this.metric}`]]
          //   )
          //   .attr('stroke-width', 3)
          //   .attr('x', 0)
          //   .attr('y', 4)
          //   .text(d => d.label)

          // node
          //   .append('text')
          //   .attr(
          //     'class',
          //     'absolute inset-0 flex items-center justify-center font-bold text-xs'
          //   )
          //   .attr('text-anchor', 'middle')
          //   .attr('fill', 'white')
          //   .attr('x', 0)
          //   .attr('y', 4)
          //   .text(d => d.label)

          const updateNode = node => {
            node
              .selectAll('circle')
              .attr('r', d => d.radius)
              .attr('stroke-dasharray', d => d.dasharray)
              .attr('stroke-dashoffset', d => d.dashoffset);
            // node.selectAll('text').text(d => d.label)

            node.attr('transform', d => {
              return 'translate(' + d.x + ', ' + d.y + ')';
            });
          };

          // perform simulation
          const ticked = () => {
            // eslint-disable-next-line no-undef
            node.call(updateNode);
          };

          // force layout
          // eslint-disable-next-line no-unused-vars
          _this.force = d3
            .forceSimulation(_this.nodes)
            .force(
              'collision',
              d3
                .forceCollide()
                .radius(d => d.radius + 1)
                .strength(1)
            )
            .force('xForce', d3.forceX(d => d.x).strength(0.05))
            .force('yForce', d3.forceY(d => d.y).strength(0.05))
            .on('tick', ticked);

          const ticksPerRender = 3;

          requestAnimationFrame(function render() {
            for (let i = 0; i < ticksPerRender; i++) {
              _this.force.tick();
            }

            // UPDATE NODE AND LINK POSITIONS HERE

            if (_this.force.alpha() > 0) {
              requestAnimationFrame(render);
            }
          });
        })
        .catch(e => {
          throw e;
        });
    }
  }
};
</script>
