<template>
  <div class="flex-grow pt-32 w-full overflow-hidden relative">
    <container class="py-12 text-black">
      <h1
        class="leading-none font-light rich-text text-2xl sm:text-3xl md:text-4xl"
      >
        {{ heading }}
      </h1>
      <div class="border-b-2 my-6 border-black" />
      <div class="leading-tight font-light rich-text text-base sm:text-lg">
        {{ lead }}
      </div>
    </container>
    <div class="text-black py-6">
      <container>
        <ul>
          <li
            v-for="(area, i) in areas"
            :key="area.uid"
            class="flex flex-wrap sm:flex-nowrap -mx-3 py-8"
            :class="{
              'border-b border-black': i !== areas.length - 1
            }"
          >
            <div
              class="w-full mb-4 text-lg sm:text-base sm:mb-0 leading-normal sm:w-1/4 md:w-1/3 flex-shrink-0 px-3"
            >
              {{ area.heading }}
            </div>
            <div class="px-3">
              <prismic-rich-text
                class="leading-normal rich-text"
                :richtext="area.descriptor"
              />
              <ul class="py-2 mt-8">
                <li
                  v-for="example in area.cases"
                  :key="example.uid"
                  class="py-2"
                >
                  <app-link :to="example.text">{{ example.text }}</app-link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </container>
    </div>
  </div>
</template>

<script>
// import gsap from 'gsap';
export default {
  async asyncData({ $prismic, error, params }) {
    try {
      const uid = params.pathMatch;
      const res = await $prismic.api.getByUID('page', uid);

      const document = res.data;
      delete res.data;
      return {
        ...res,
        document,
        title: document.title,
        meta: {
          title: document.meta_title,
          description: document.meta_description,
          image: document.meta_image
        },
        lead: document.summary,
        heading: document.heading,
        areas: document.body.map(slice => {
          return {
            heading: slice.primary.heading1,
            descriptor: slice.primary.description,
            cases: slice.items.map(item => {
              return { text: item.case_title, url: item.case_link.url };
            })
          };
        })
      };
    } catch (e) {
      console.log(e);
      error({ statusCode: 404, message: 'Page not found' });
    }
  },
  data() {
    return {};
  },
  head() {
    return this.$processMeta(this.title, this.meta, this.$route.path);
  },
  mounted() {
    this.$store.commit('setTheme', { header: 'light', footer: 'light' });
  }
};
</script>
