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
      <div v-if="totals && Object.keys(totals).length > 1" class="text-center">
        {{ ((totals.reporting / totals.precincts) * 100).toFixed(2) }}%
        Precincts Reporting
      </div>
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
          CCDs
        </button>
      </div>
    </container>
    <!-- totals -->
    <container
      v-if="totals && Object.keys(totals).length > 1"
      variant="copy"
      class="mt-3 -mb-3"
    >
      <div
        class="flex text-center items-center justify-center uppercase font-bold py-2 -mx-2"
        :style="`color:${colors[totals[`winner_${metric}`]]}`"
      >
        <div class="px-2">{{ totals[`winner_${metric}`] }}</div>
        <div class="px-2">
          +{{ totals[`margin_${metric}`].toLocaleString() }}
        </div>
        <div class="px-2">
          +{{ (totals[`margin_${metric}`] / totals[metric]).toFixed(2) * 100 }}%
        </div>
      </div>
    </container>
    <!-- the map -->
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
              <div class="px-2">{{ currentShape.precinct_id }}</div>
            </div>
            <div
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
    projection: {
      type: String,
      default: 'geoConicEqualArea'
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
      centroids: {},
      colors: {
        sanders: colors[0],
        warren: colors[1],
        klobuchar: colors[2],
        buttigieg: colors[3],
        biden: colors[4],
        other: theme.extend.colors.black.default,
        tie: theme.extend.colors.gray.default
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
      if (this.ctotals) {
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
        totals.margin_first =
          this.ctotals[firstSorted[0]].first -
          this.ctotals[firstSorted[1]].first;
        totals.margin_final =
          this.ctotals[finalSorted[0]].final -
          this.ctotals[finalSorted[1]].final;
        totals.margin_sde =
          this.ctotals[sdeSorted[0]].sde - this.ctotals[sdeSorted[1]].sde;
        totals.precincts = Object.keys(this.data).length;
        totals.reporting = Object.keys(
          this.data.filter(p => p.is_complete)
        ).length;
        return totals;
      }
      return null;
    },
    ctotals() {
      if (this.data) {
        // const data = this.data
        const ctotals = {};
        Object.keys(this.data[0].candidates).forEach(c => {
          ctotals[c] = {
            first: 0,
            final: 0,
            sde: 0
          };
        });
        this.data.forEach(p => {
          const precinct = p;
          Object.keys(precinct.candidates).forEach(c => {
            ctotals[c] = {
              first: ctotals[c].first + precinct.candidates[c].first,
              final: ctotals[c].final + precinct.candidates[c].final,
              sde: ctotals[c].sde + precinct.candidates[c].sde
            };
          });
        });
        return ctotals;
      }
      return null;
    }
  },
  watch: {
    metric() {
      const _this = this;
      this.nodes = this.nodes.map(node => {
        node.radius = _this.getRadius(node);
        return node;
      });
      this.force
        .force('collision')
        .radius(d => d.radius + 1.5)
        .strength(1);
      this.force.alpha(1).restart();
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    getRadius(p) {
      const _this = this;
      return p[`margin_${_this.metric}`] / (_this.metric === 'sde' ? 2.5 : 5) >
        0.5
        ? p[`margin_${_this.metric}`] / (_this.metric === 'sde' ? 2.5 : 5)
        : 0.5;
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
      const url = `/json/${_this.dataname}.json`;
      d3.json(url).then(res => {
        const precincts = res.precincts.map(precinct => {
          return { ...precinct, fips: precinct.locality_fips };
        });

        // set county data
        _this.data = precincts.map(precinct => {
          const totals = precinct;
          const firstSorted = Object.keys(precinct.results_align1).sort(
            (a, b) => precinct.results_align1[b] - precinct.results_align1[a]
          );
          const finalSorted = Object.keys(precinct.results_alignfinal).sort(
            (a, b) =>
              precinct.results_alignfinal[b] - precinct.results_alignfinal[a]
          );
          const sdeSorted = Object.keys(precinct.results).sort(
            (a, b) => precinct.results[b] - precinct.results[a]
          );
          totals.candidates = {};
          Object.keys(precinct.results).forEach(c => {
            const cName = c.substring(0, c.length - 1);
            totals.candidates[cName] = {};
            totals.candidates[cName].first = precinct.results_align1[c];
            totals.candidates[cName].final = precinct.results_alignfinal[c];
            totals.candidates[cName].sde = precinct.results[c];
          });
          totals.first = precinct.votes_align1;
          totals.final = precinct.votes_alignfinal;
          totals.sde = precinct.votes;
          totals.winner_first = firstSorted[0].substring(
            0,
            firstSorted[0].length - 1
          );
          totals.winner_final = finalSorted[0].substring(
            0,
            finalSorted[0].length - 1
          );
          totals.winner_sde = sdeSorted[0].substring(
            0,
            sdeSorted[0].length - 1
          );
          totals.margin_first =
            precinct.results_align1[firstSorted[0]] -
            precinct.results_align1[firstSorted[1]];
          totals.margin_final =
            precinct.results_alignfinal[finalSorted[0]] -
            precinct.results_alignfinal[finalSorted[1]];
          totals.margin_sde =
            precinct.results[sdeSorted[0]] - precinct.results[sdeSorted[1]];
          // totals.reporting = precinct.reporting
          // totals.precincts = precinct.precincts
          // totals.name = precinct.name
          return totals;
        });
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

          let dProjection;

          if (_this.projection === 'geoAlbersUsa') {
            dProjection = d3.geoAlbersUsa();
          } else if (_this.projection === 'geoAlbers') {
            dProjection = d3.geoAlbers();
          } else {
            // configure projection
            dProjection = d3.geoConicEqualArea().parallels([29.5, 45.5]);
          }

          dProjection.rotate([_this.rotate, 0, 0]).fitExtent(
            [
              [0, 0],
              [svgWidth, svgHeight]
            ],
            geojson
          );

          // construct path
          const path = d3
            .geoPath() // path generator that will convert GeoJSON to SVG paths
            .projection(dProjection);

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

          // get centroids
          geojson.features.forEach(f => {
            _this.centroids[f.properties.GEOID] = path.centroid(f);
          });

          // Object.keys(_this.data).forEach(key => {
          //   _this.data[key].coordinates = centroids[_this.data[key].county] || [
          //     svgWidth + 25,
          //     svgHeight - 150
          //   ]
          //   _this.data[key].x = _this.data[key].coordinates[0]
          //   _this.data[key].y = _this.data[key].coordinates[1]
          //   _this.data[key].radius =
          //     _this.data[key][`margin_${_this.metric}`] /
          //     (_this.metric === 'sde' ? 1 : 5)
          // })

          _this.nodes = _this.data
            .filter(p => p.is_complete)
            .map(p => {
              const node = p;
              node.coordinates = _this.centroids[p.fips] || [0, 0];
              node.radius = _this.getRadius(p);
              node.x = node.coordinates[0];
              node.y = node.coordinates[1];
              return node;
            });

          const node = svg
            .append('g')
            .attr('class', 'nodes')
            .selectAll('g')
            .data(_this.nodes)
            .enter()
            .append('circle')
            .attr('r', d => d.radius)
            .attr('fill', d =>
              d[`margin_${_this.metric}`] > 0
                ? _this.colors[d[`winner_${_this.metric}`]] ||
                  _this.colors.other
                : _this.colors.tie
            )
            .attr('fill-opacity', 0.55)
            .attr('stroke', d =>
              d[`margin_${_this.metric}`] > 0
                ? _this.colors[d[`winner_${_this.metric}`]] ||
                  _this.colors.other
                : _this.colors.tie
            )
            .attr('stroke-opacity', 0.95)
            .on('mouseover', (d, i, nodes) => {
              _this.currentShape = d;
            })
            .on('mouseout', (d, i, nodes) => {
              _this.currentShape = null;
            });

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
                .radius(d => d.radius + 1.5)
                .strength(1)
            )
            .force('xForce', d3.forceX(d => d.coordinates[0]).strength(0.03))
            .force('yForce', d3.forceY(d => d.coordinates[1]).strength(0.03))
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
