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
    </container>
    <!-- options -->
    <container variant="copy">
      <div class="flex justify-center">
        <button
          class="py-2 px-4 border transition"
          :class="{ 'bg-grey-light': metric === 'first' }"
          @click="metric = 'first'"
        >
          First Vote
        </button>
        <button
          class="py-2 px-4 border-t border-b transition"
          :class="{ 'bg-grey-light': metric === 'final' }"
          @click="metric = 'final'"
        >
          Final Vote
        </button>
        <button
          class="py-2 px-4 border transition"
          :class="{ 'bg-grey-light': metric === 'sde' }"
          @click="metric = 'sde'"
        >
          SDEs
        </button>
      </div>
    </container>
    <!-- totals -->
    <!-- <container v-if="totals && Object.keys(totals).length > 1" variant="copy">
      <div class="flex text-center uppercase font-bold text-sm -mx-2">
        {{ totals[`winner_${metric}`] }}
      </div>
    </container> -->
    <container class="relative z-0 w-full py-6" :variant="chartSize">
      <!-- map -->
      <div ref="map" class="min-h-1/2-screen w-full" />
      <!-- tooltip -->
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
    title: {
      type: String,
      default: 'Scatter Plot'
    },
    background: {
      type: String,
      default: null
    },
    width: {
      type: String,
      default: 'container'
    },
    mapname: {
      type: String,
      default: 'iowa_counties'
    },
    rotate: {
      type: Number,
      default: 93
    },
    dataname: {
      type: String,
      default: 'iowa_precinct_votes_2'
    }
  },
  data() {
    return {
      force: null,
      data: null,
      metric: 'first',
      nodes: null,
      currentShape: null,
      colors: {
        sanders: colors[0],
        warren: colors[1],
        klobuchar: colors[2],
        buttigieg: colors[3],
        biden: colors[4],
        other: theme.extend.colors.gray.default
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
    },
    totals() {
      const _this = this;
      const totals = { first: 0, final: 0, viable: 0, sde: 0 };
      const firstSorted = Object.keys(this.ctotals).sort(
        (a, b) => _this.ctotals[b].first - _this.ctotals[a].first
      );
      const finalSorted = Object.keys(this.ctotals).sort(
        (a, b) => _this.ctotals[b].final - _this.ctotals[a].final
      );
      const sdeSorted = Object.keys(this.ctotals).sort(
        (a, b) => _this.ctotals[b].sde - _this.ctotals[a].sde
      );
      Object.keys(this.ctotals).forEach(c => {
        totals.first += _this.ctotals[c].first;
        totals.final += _this.ctotals[c].final;
        totals.sde += _this.ctotals[c].sde;
      });
      totals.winner_first = firstSorted[0];
      totals.winner_final = finalSorted[0];
      totals.winner_sde = sdeSorted[0];
      totals.margin_first = firstSorted[0] - firstSorted[1];
      totals.margin_final = finalSorted[0] - finalSorted[1];
      totals.margin_sde = sdeSorted[0] - sdeSorted[1];
      totals.precincts = Object.keys(this.data).length;
      return totals;
    },
    ctotals() {
      const _this = this;
      // const data = this.data
      const ctotals = {};
      Object.keys(this.data[Object.keys(this.data)[0]].results).forEach(c => {
        ctotals[c] = {
          first: 0,
          final: 0,
          viable: 0,
          sde: 0
        };
      });
      Object.keys(this.data).forEach(key => {
        const precinct = _this.data[key];
        Object.keys(precinct.results).forEach(key => {
          ctotals[key] = {
            first: ctotals[key].first + precinct.results[key].first,
            final: ctotals[key].final + precinct.results[key].final,
            viable:
              ctotals[key].viable + (precinct.results[key].final > 0 ? 1 : 0),
            sde: ctotals[key].sde + precinct.results[key].sde
          };
        });
      });
      return ctotals;
    }
  },
  watch: {
    metric() {
      const _this = this;
      this.nodes = this.nodes.map(node => {
        const r =
          node[`margin_${_this.metric}`] * (_this.metric === 'sde' ? 10 : 0.2);
        node.radius = r;
        return node;
      });
      this.force
        .force('collision')
        .radius(d => d.radius + 2)
        .strength(1);
      this.force.alpha(1).restart();
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
    // loadData() {
    //   const _this = this
    //   const url = `/json/${_this.dataname}.json`
    //   const url2 = `/json/iowa_county_population_2018.json`
    //   Promise.all([d3.json(url), d3.json(url2)]).then(files => {
    //     // load data
    //     // build results
    //     const results = {}
    //     files[0].data.races[0].counties.forEach(county => {
    //       results[county.fips] = county
    //     })
    //     // build counties
    //     const counties = {}
    //     files[1].forEach(county => {
    //       counties[county.FIPS] = { ...county, ...results[county.FIPS] }
    //     })
    //     // set county data
    //     _this.data = counties
    //     // then load map
    //     _this.loadMap()
    //   })
    // },
    loadData() {
      const _this = this;
      const url = `/json/${_this.dataname}.json`;
      d3.json(url).then(res => {
        const precincts = _this.$processPrecincts(res);
        // const countyPrecincts = {}
        // Object.keys(precincts).forEach(key => {
        //   countyPrecincts[precincts[key].county][precincts[key].pid] =
        //     precincts[key]
        // })
        // set county data
        _this.data = precincts;
        // then load map
        _this.loadMap();
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
      const url = `/topojson/${_this.mapname}-topo.json`;
      d3.json(url)
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
              return 'none';
            })
            .attr('stroke', theme.extend.colors.black.light)
            .attr('stroke-width', '.5')
            .attr('stroke-linejoin', 'round');
          // .on('mouseover', (d, i, nodes) => {
          //   _this.currentShape = countyData[d.properties.GEOID]
          //   d3.select(nodes[i]).attr('fill-opacity', 1)
          // })
          // .on('mouseout', (d, i, nodes) => {
          //   _this.currentShape = null
          //   d3.select(nodes[i]).attr('fill-opacity', d.difference)
          // })

          // get centroids
          const centroids = {};
          geojson.features.forEach(f => {
            return (centroids[f.properties.NAME] = path.centroid(f));
          });

          Object.keys(_this.data).forEach(key => {
            _this.data[key].coordinates = centroids[_this.data[key].county] || [
              svgWidth + 25,
              svgHeight - 150
            ];
            _this.data[key].x = _this.data[key].coordinates[0];
            _this.data[key].y = _this.data[key].coordinates[1];
            _this.data[key].radius =
              _this.data[key][`margin_${_this.metric}`] /
              (_this.metric === 'sde' ? 1 : 5);
          });

          _this.nodes = Object.keys(_this.data).map(key => _this.data[key]);

          const node = svg
            .append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(_this.nodes)
            .enter()
            .append('circle')
            .attr('r', d => d.radius)
            .attr(
              'fill',
              d =>
                _this.colors[d[`winner_${_this.metric}`]] || _this.colors.other
            )
            .attr('fill-opacity', 0.55)
            .attr(
              'stroke',
              d =>
                _this.colors[d[`winner_${_this.metric}`]] || _this.colors.other
            )
            .attr('stroke-opacity', 0.95);

          const updateNode = node => {
            node.attr('r', d => d.radius);
            node.radius = node.attr('transform', d => {
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
                .radius(d => d.radius + 2)
                .strength(1)
            )
            .force('xForce', d3.forceX(d => d.coordinates[0]).strength(0.05))
            .force('yForce', d3.forceY(d => d.coordinates[1]).strength(0.05))
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

          // svg
          //   .selectAll('.centroid')
          //   .data(centroids)
          //   .enter()
          //   .append('circle')
          //   .attr('class', 'centroid')
          //   .attr('fill', 'rgba(0,0,0,.25)')
          //   .attr('stroke', 'rgba(0,0,0,.75)')
          //   .attr('stroke-width', 1)
          //   .attr('r', 2)
          //   .attr('cx', d => {
          //     return d[0]
          //   })
          //   .attr('cy', d => {
          //     return d[1]
          //   })
        })
        .catch(e => {
          throw e;
        });
    }
  }
};
</script>
