<template>
  <div class="flex flex-col items-center justify-center">
    <!-- <line-graph />
      <div class="my-24">
        <data-map />
      </div><div class="my-24 text-center ">
        <h2 class="font-bold uppercase tracking-1 uppercase text-sm">
          % Final Vote Margin as a % of County Population
        </h2>
        <p class="text-grey tracking-1 uppercase mb-6 text-sm">
          Buttigieg: Yellow, Sanders: Blue, Warren: Red, Klobuchar: Green,
          Biden: Purple
        </p>

      </div>
      <div class="my-24 text-center ">
        <h2 class="font-bold uppercase tracking-1 uppercase">
          % Final Vote Margin vs County Population
        </h2>
        <p class="text-grey tracking-1 uppercase mb-6 text-sm">
          Buttigieg: Yellow, Sanders: Blue, Warren: Red, Klobuchar: Green,
          Biden: Purple
        </p>
        <scatter-plot metric="alignfinal" />
      </div>
      <div class="my-24 text-center ">
        <h2 class="font-bold uppercase tracking-1 uppercase">
          % First Vote Margin as a % of County Population
        </h2>
        <p class="text-grey tracking-1 uppercase mb-6 text-sm">
          Buttigieg: Yellow, Sanders: Blue, Warren: Red, Klobuchar: Green,
          Biden: Purple
        </p>
        <data-map-nytdata metric="align1" />
      </div>
      <div class="my-24 text-center ">
        <h2 class="font-bold uppercase tracking-1 uppercase">
          % First Vote Margin vs County Population
        </h2>
        <p class="text-grey tracking-1 uppercase mb-6 text-sm">
          Buttigieg: Yellow, Sanders: Blue, Warren: Red, Klobuchar: Green,
          Biden: Purple
        </p>
        <scatter-plot metric="align1" />
      </div> -->
    <!-- <data-map-nytdata
      title="Vote Margins by Precinct"
      width="md"
      metric="alignfinal"
    /> -->
    <data-map-nytdata-precinct
      title="Vote Margins by Precinct"
      width="md"
      metric="alignfinal"
      mapname="us_counties"
      dataname="nv_precincts-3"
      projection="geoAlbers"
      :rotate="115"
    />
    <!-- <data-map-nytdata-county
      title="Vote Margins by County"
      width="md"
      metric="alignfinal"
      dataname="nv_democrat-1"
      mapname="nv_counties"
      :rotate="115"
    /> -->

    <!-- <map-us-donations
      title="Donor Margins by County"
      width="lg"
      metric="amount"
    /> -->
    <!-- <div class="mb-12 w-full">
      <scatter-plot-precincts
        title="Candidate Delegate Impact By Precinct"
        ylabel="Delegate Impact"
        xlabel="precincts"
        background="bg-white-100"
        width="md"
      />
    </div> -->
    <container>
      <table-iowa />
    </container>
  </div>
</template>

<script>
export default {};
</script>
