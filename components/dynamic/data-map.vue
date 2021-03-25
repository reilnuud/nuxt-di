<template>
  <div ref="map" class="min-h-1/2-screen w-full" />
</template>

<script>
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
const { theme } = process.env.TAILWIND;

export default {
  props: {
    mapname: {
      type: String,
      default: 'ca_congress'
    },
    rotate: {
      type: Number,
      default: 93
    },
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      colors: {
        blue: theme.extend.colors.blue.default,
        red: theme.extend.colors.red.default,
        green: theme.extend.colors.green.default,
        yellow: theme.extend.colors.yellow.default
      }
    };
  },
  mounted() {
    this.loadMap();
  },
  methods: {
    loadMap() {
      const _this = this;
      const url = `/topojson/${_this.mapname}-topo.json`;
      d3.json(url)
        .then(topology => {
          // parse topojson
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
            .attr('fill', theme.extend.colors.grey.light)
            .attr('stroke', theme.extend.colors.white.default)
            .attr('stroke-width', '0.5')
            .attr('stroke-linejoin', 'round')
            .on('mouseover', (d, i, nodes) => {
              d3.select(nodes[i]).attr('fill', theme.extend.colors.red.default);
            })
            .on('mouseout', (d, i, nodes) => {
              d3.select(nodes[i]).attr('fill', theme.extend.colors.grey.light);
            });
        })
        .catch(e => {
          throw e;
        });
    }
  }
};
</script>
