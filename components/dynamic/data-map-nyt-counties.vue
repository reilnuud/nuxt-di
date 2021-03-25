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
      <div v-if="totals" class="mt-2 uppercase font-semibold text-sm">
        <div class="flex items-center justify-center">
          <div class="px-1">{{ totals.reporting }}/{{ totals.precincts }}</div>
          <div class="px-1">
            {{ ((totals.reporting / totals.precincts) * 100).toFixed(2) }}%
          </div>
          <div class="px-1">Precincts Reporting</div>
        </div>
      </div>
      <div
        v-if="totals && totals.winner !== 'tie'"
        class="flex flex-wrap -mx-2 uppercase items-center justify-center text-sm"
        :style="`color:${colors[totals.winner]};`"
      >
        <div class="px-2 mt-2 font-bold">{{ totals.winner }}</div>
        <div class="px-2 flex items-center justify-center text-right mt-2">
          <div class="px-1 font-semibold">Lead</div>
          <div class="px-1">+{{ totals.margin.toLocaleString() }}</div>
          <div class="px-1">
            +{{ ((totals.margin / totals.votes) * 100).toFixed(2) }}%
          </div>
        </div>
        <div class="px-2 flex items-center justify-center text-right mt-2">
          <div class="px-1 font-semibold">Total</div>

          <div class="px-1">
            {{ totals.candidates[totals.winner].toLocaleString() }}
          </div>
          <div class="px-1">
            {{
              ((totals.candidates[totals.winner] / totals.votes) * 100).toFixed(
                2
              )
            }}%
          </div>
        </div>
      </div>
    </container>

    <!-- map container -->
    <container class="relative z-0 w-full py-6" :variant="chartSize">
      <!-- map -->
      <div ref="map" class="min-h-1/2-screen w-full opacity-0" />
      <!-- tooltip -->
      <div class="absolute leading-none h-0 w-0 top-0 left-0">
        <div
          v-if="currentShape != null && Object.keys(currentShape).length > 1"
          ref="tooltip"
          class="text-xs bg-white p-3 border absolute pointer-events-none"
          :class="{
            'right-0': mouse[0] > width / 2,
            'left-0': mouse[0] < width / 2,
            'top-0': mouse[1] < height / 2,
            'bottom-0': mouse[1] > height / 2
          }"
          :style="`transform:translate(${mouse[0]}px,${mouse[1] + 24}px);`"
        >
          <div>
            <div class="w-full">
              <div
                class="font-bold text-sm flex flex-col justify-between -mx-2"
              >
                <div class="px-2 mb-1">{{ currentShape.name }}</div>
                <div class="px-2 mb-2 text-xxs uppercase text-grey">
                  {{ states[currentShape.fips.substring(0, 2)] }}
                </div>
              </div>
              <div
                v-for="(key, i) in Object.keys(currentShape.candidates)
                  .filter(
                    key =>
                      (
                        (currentShape.candidates[key] / currentShape.votes) *
                        100
                      ).toFixed(0) > 0
                  )
                  .sort(
                    (a, b) =>
                      currentShape.candidates[b] - currentShape.candidates[a]
                  )"
                :key="currentShape.fips + '-' + key"
                class="flex -mx-1 py-1 text-xxs border-b"
                :class="{
                  'border-t': i === 0,
                  'font-bold': key === currentShape.winner
                }"
                :style="`color:${colors[key] || colors.other};`"
              >
                <div class="px-1 uppercase">
                  {{ key }}
                </div>
                <div class="px-1 ml-auto">
                  {{ currentShape.candidates[key].toLocaleString() }}
                </div>
                <div class="px-1 w-8 text-right">
                  {{
                    (
                      (currentShape.candidates[key] / currentShape.votes) *
                      100
                    ).toFixed(0)
                  }}%
                </div>
              </div>
              <div class="mt-2 leading-tight text-xxs uppercase">
                {{
                  (
                    (currentShape.reporting / currentShape.precincts) *
                    100
                  ).toFixed(0)
                }}% {{ currentShape.reporting }}/{{ currentShape.precincts
                }}<br />
                Precincts Reporting
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
    <!-- table -->
    <container variant="copy" class="mb-6">
      <div v-if="totals" class="mt-2 uppercase border-t font-semibold text-sm">
        <div
          v-for="c in Object.keys(totals.candidates)
            .filter(
              c => totals.candidates[c] > 0 && !isNaN(totals.candidates[c])
            )
            .sort((a, b) => totals.candidates[b] - totals.candidates[a])"
          :key="c"
          class="flex items-center py-1 border-b justify-center uppercase"
          :style="`color:${colors[c] || colors.other};`"
        >
          <div class="px-2 mr-auto">{{ c }}</div>
          <div class="px-2 w-1/4 text-right">
            {{ totals.candidates[c].toLocaleString() }}
          </div>
          <div class="px-2 w-1/4 text-rig ht">
            {{ ((totals.candidates[c] / totals.votes) * 100).toFixed(2) }}%
          </div>
        </div>
      </div>
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
import gsap from 'gsap';

import * as topojson from 'topojson-client';
import * as d3 from 'd3';
const { theme } = process.env.TAILWIND;

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
    scale: {
      type: Number,
      default: 1000
    },
    size: {
      type: String,
      default: 'lg'
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
      mouse: [0, 0],
      metric: 'first',
      nodes: null,
      centroids: {},
      currentKey: null,
      width: 0,
      height: 0,
      states: {
        '01': 'Alabama',
        '02': 'Alaska',
        '04': 'Arizona',
        '05': 'Arkansas',
        '06': 'California',
        '08': 'Colorado',
        '09': 'Connecticut',
        '10': 'Delaware',
        '12': 'Florida',
        '13': 'Georgia',
        '15': 'Hawaii',
        '16': 'Idaho',
        '17': 'Illinois',
        '18': 'Indiana',
        '19': 'Iowa',
        '20': 'Kansas',
        '21': 'Kentucky',
        '22': 'Louisiana',
        '23': 'Maine',
        '24': 'Maryland',
        '25': 'Massachusetts',
        '26': 'Michigan',
        '27': 'Minnesota',
        '28': 'Mississippi',
        '29': 'Missouri',
        '30': 'Montana',
        '31': 'Nebraska',
        '32': 'Nevada',
        '33': 'New Hampshire',
        '34': 'New Jersey',
        '35': 'New Mexico',
        '36': 'New York',
        '37': 'North Carolina',
        '38': 'North Dakota',
        '39': 'Ohio',
        '40': 'Oklahoma',
        '41': 'Oregon',
        '42': 'Pennsylvania',
        '44': 'Rhode Island',
        '45': 'South Carolina',
        '46': 'South Dakota',
        '47': 'Tennessee',
        '48': 'Texas',
        '49': 'Utah',
        '50': 'Vermont',
        '51': 'Virginia',
        '53': 'Washington',
        '54': 'West Virginia',
        '55': 'Wisconsin',
        '56': 'Wyoming',
        '60': 'American Samoa',
        '66': 'Guam',
        '69': 'Northern Mariana Islands',
        '72': 'Puerto Rico',
        '78': 'Virgin Islands'
      },
      colors: {
        sanders: theme.extend.colors.blue.default,
        biden: theme.extend.colors.red.default,
        other: theme.extend.colors.gray.default,
        tie: theme.extend.colors.black.default
      }
    };
  },
  computed: {
    currentShape() {
      return this.data ? this.data[this.currentKey] : null;
    },
    chartSize() {
      const sizes = {
        sm: 'copy',
        md: 'site',
        lg: 'full',
        xl: 'full'
      };
      return sizes[this.size];
    },
    totals() {
      if (this.data && Object.keys(this.data).length > 0) {
        const _this = this;
        const totals = {
          votes: 0,
          margin: 0,
          precincts: 0,
          reporting: 0,
          winner: 'tie',
          candidates: {}
        };
        Object.keys(_this.data[Object.keys(_this.data)[0]].candidates).forEach(
          k => (totals.candidates[k] = 0)
        );
        Object.keys(_this.data).forEach(key => {
          const county = _this.data[key];
          Object.keys(county.candidates).forEach(c => {
            totals.candidates[c] += county.candidates[c];
          });
          totals.votes += county.votes;
          totals.precincts += county.precincts;
          totals.reporting += county.reporting;
        });
        const sorted = Object.keys(totals.candidates).sort((a, b) => {
          return totals.candidates[b] - totals.candidates[a];
        });
        totals.margin =
          totals.candidates[sorted[0]] - totals.candidates[sorted[1]];
        if (totals.margin > 0) {
          totals.winner = sorted[0];
        }
        return totals;
      }
      return null;
    }
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
        .radius(d => d.radius + 2)
        .strength(1);
      this.force.alpha(1).restart();
    }
  },
  mounted() {
    const _this = this;
    _this.loadData();
  },
  methods: {
    // handleHighlight(id) {
    //   const _this = this
    //   _this.currentShape = _this.data[id]
    // },
    getRadius(p) {
      return p.margin / this.scale > 0.75 ? p.margin / this.scale : 0.75;
    },
    getTotals(county, metric) {
      const totals = {};
      let votes = 0;
      totals.candidates = {};
      Object.keys(county[metric]).forEach(c => {
        const cName = c !== 'other' ? c.substring(0, c.length - 1) : c;
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
    // get largest number
    getBiggestNumber(obj) {
      return Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b));
    },
    // load the data
    loadData() {
      const _this = this;
      const dataFiles = _this.datafiles.map(file => d3.json(file.data.url));
      Promise.all(dataFiles)
        .then(files => {
          _this.data = {};
          files.forEach(file => {
            file.data.races[0].counties.forEach(county => {
              if (Object.keys(county).includes('results_align1')) {
                _this.data[county.fips] = _this.getTotals(
                  county,
                  'results_align1'
                );
              } else {
                _this.data[county.fips] = _this.getTotals(county, 'results');
              }
            });
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
          _this.width = svgWidth;
          _this.height = svgHeight;

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
            .attr('stroke', theme.extend.colors.grey['400'])
            .attr('stroke-width', '.25')
            .attr('stroke-linejoin', 'round')
            .on('mouseover', (d, i, nodes) => {
              if (_this.currentKey !== d.properties.GEOID) {
                _this.currentKey = d.properties.GEOID;
                _this.mouse = d3.pointer(nodes[i]);
              }
              // _this.handleHighlight()
            })
            .on('mouseout', (d, i, nodes) => {
              _this.currentKey = null;
            });

          // get centroids
          geojson.features.forEach(f => {
            _this.centroids[f.properties.GEOID] = path.centroid(f);
          });

          _this.nodes = Object.keys(_this.data).map(fips => {
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
            countyNode.opacity =
              0.1 + 0.65 * (countyNode.reporting / countyNode.precincts);
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
              if (_this.currentKey !== d.fips) {
                _this.mouse = [d.x, d.y];
                _this.currentKey = d.fips;
              }
            })
            .on('mouseout', (d, i, nodes) => {
              _this.currentKey = null;
            });

          node
            .append('circle')
            .attr('data-fips', d => d.fips)
            .attr('style', 'transition:.25s ease fill-opacity;')
            .attr('r', d => d.radius)
            .attr('fill', d => _this.colors[d.winner] || _this.colors.other)
            .attr('fill-opacity', d => d.opacity)
            .attr('stroke', d => {
              return _this.colors[d.winner] || _this.colors.other;
            })
            .attr('stroke-width', d => 1)
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
                .radius(d => d.radius + 1.5)
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
