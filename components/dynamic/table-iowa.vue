<template>
  <div>
    <ul v-if="data" class="border-t mb-12">
      <li
        class="sticky top-0 bg-white flex uppercase text-xs py-2 border-b -mx-2 font-bold"
      >
        <div class="px-2 w-1/8">
          Candidate
        </div>
        <div class="px-2 w-1/8 text-right">
          First Votes
        </div>
        <div class="px-2 w-1/8 text-right">
          First Vote %
        </div>
        <div class="px-2 w-1/8 text-right">
          Final Votes
        </div>
        <div class="px-2 w-1/8 text-right">
          Final Vote %
        </div>
        <div class="px-2 w-1/8 text-right">
          Viability %
        </div>
        <div class="px-2 w-1/8 text-right">
          SDE Total
        </div>
        <div class="px-2 w-1/8 text-right">
          SDE / hundred first votes
        </div>
      </li>
      <li
        v-for="total in Object.keys(ctotals).sort(
          (a, b) => ctotals[b].first - ctotals[a].final
        )"
        :key="total"
        class="flex uppercase text-xs py-2 border-b -mx-2"
      >
        <div class="px-2 w-1/8">
          {{ total }}
        </div>
        <div class="px-2 w-1/8 text-right">
          {{ ctotals[total].first.toLocaleString() }}
        </div>
        <div class="px-2 w-1/8 text-right">
          {{ ((ctotals[total].first / totals.first) * 100).toFixed(2) }}%
        </div>
        <div class="px-2 w-1/8 text-right">
          {{ ctotals[total].final.toLocaleString() }}
        </div>
        <div class="px-2 w-1/8 text-right">
          {{ ((ctotals[total].final / totals.final) * 100).toFixed(2) }}%
        </div>
        <div class="px-2 w-1/8 text-right">
          {{ ((ctotals[total].viable / totals.precincts) * 100).toFixed(2) }}%
        </div>
        <div class="px-2 w-1/8 text-right">
          {{ ctotals[total].sde.toFixed(2) }}
        </div>
        <div class="px-2 w-1/8 text-right">
          {{ ((ctotals[total].sde / ctotals[total].first) * 100).toFixed(2) }}
        </div>
      </li>
      <li class="flex uppercase font-bold text-xs py-2 border-b -mx-2">
        <div class="px-2 w-1/8">
          total
        </div>
        <div class="px-2 w-1/8 text-right">
          {{ totals.first.toLocaleString() }}
        </div>
        <div class="px-2 w-1/8 text-right">
          {{ ((totals.first / totals.first) * 100).toFixed(2) }}%
        </div>
        <div class="px-2 w-1/8 text-right">
          {{ totals.final.toLocaleString() }}
        </div>
        <div class="px-2 w-1/8 text-right">
          {{ ((totals.final / totals.final) * 100).toFixed(2) }}%
        </div>
        <div class="px-2 w-1/8 text-right"></div>
        <div class="px-2 w-1/8 text-right">
          {{ totals.sde.toFixed(2) }}
        </div>
        <div class="px-2 w-1/8 text-right">
          {{ ((totals.sde / totals.first) * 100).toFixed(2) }}
        </div>
      </li>
    </ul>
    <ul v-if="data">
      <li
        class="sticky top-0 bg-white flex uppercase text-xs py-2 border-b -mx-2 font-bold"
      >
        <div class="px-2 w-1/4">
          Precinct
        </div>
        <div class="px-2 w-1/8">
          First Votes
        </div>
        <div class="px-2 w-1/8">
          Final Votes
        </div>
        <div class="px-2 w-1/8">
          SDE Total
        </div>
        <div class="px-2 w-1/8">
          First Winner
        </div>
        <div class="px-2 w-1/8">
          Final Winner
        </div>
        <!-- <div class="px-2 w-1/8">
          SDE per hundred votes
        </div> -->
        <div class="px-2 w-1/8">
          SDE Winner
        </div>
      </li>
      <li
        v-for="key in Object.keys(data)
          .filter(key => {
            const obj = data[key];
            return obj.votes_first + 1 < obj.votes_final || obj.sdeMath;
          })
          .sort()"
        :key="key"
        class="uppercase text-xs py-2 border-b"
        :class="{
          'text-primary': data[key].votes_first < data[key].votes_final
        }"
      >
        <ul>
          <li class="flex -mx-2 py-2">
            <div class="px-2 font-bold w-1/4">
              {{ key }}
            </div>
            <div class="px-2 w-1/8">
              {{ data[key].votes_first }}
            </div>
            <div class="px-2 w-1/8">
              {{ data[key].votes_final }}
            </div>
            <div class="px-2 w-1/8">
              {{ data[key].sde_total.toFixed(4) }}
            </div>
            <div class="px-2 w-1/8">
              {{ data[key].winner_first }}
            </div>
            <div class="px-2 w-1/8">
              {{ data[key].winner_final }}
            </div>
            <!-- <div class="px-2 w-1/8">
              {{ ((data[key].sde_total / data[key].votes_final) * 100).toFixed(2) }}
            </div> -->
            <div class="px-2 w-1/8">
              {{ data[key].winner_sde }}
            </div>
          </li>
          <li
            v-for="c in Object.keys(data[key].results)"
            :key="key + c"
            class="flex py-1 border-t border-white-600"
          >
            <div class="pr-2 w-1/4">
              {{ c }}
            </div>
            <div class="px-2 w-1/8">
              {{ data[key].results[c].first }}
            </div>
            <div class="px-2 w-1/8">
              {{ data[key].results[c].final }}
            </div>
            <div class="pl-2 w-1/8">
              {{ data[key].results[c].sde.toFixed(4) }}
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import * as d3 from 'd3';
import Color from 'color';
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
      default: 'iowa_precinct_votes_2'
    }
  },
  data() {
    return {
      chart: null,
      currentPrecinct: null,
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
      const totals = { first: 0, final: 0, viable: 0, sde: 0 };
      Object.keys(this.ctotals).forEach(c => {
        totals.first += _this.ctotals[c].first;
        totals.final += _this.ctotals[c].final;
        totals.sde += _this.ctotals[c].sde;
      });
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
      // ctotals.final =
      // ctotals.first =
      // ctotals.sde =
      // ctotals.precincts = Object.keys(this.data).length
      return ctotals;
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
      });
    }
  }
};
</script>
