<template>
  <div class="flex-grow pt-48 w-full overflow-hidden relative">
    <container class="py-12">
      <h1
        class="leading-tight font-light rich-text text-xl sm:text-2xl md:text-3xl"
      >
        {{ heading }}
      </h1>
      <prismic-rich-text
        v-if="lead !== null"
        class="leading-tight font-light rich-text text-xl sm:text-2xl md:text-3xl"
        :richtext="lead"
      />
      <prismic-rich-text
        v-if="supporting_copy !== null"
        class="leading-tight font-light rich-text text-lg sm:text-xl my-6"
        :richtext="supporting_copy"
      />
      <!-- <div class="mt-6">
        <btn color="white" size="lg" :to="button.link">{{ button.text }}</btn>
      </div> -->
    </container>
    <div class="text-black py-6">
      <container>
        <ul>
          <li
            v-for="(area, i) in areas"
            :key="area.uid"
            class="flex flex-wrap max-w-4xl xl:max-w-5xl sm:flex-nowrap -mx-3 py-8"
            :class="{
              'border-b border-purple': i !== core_messaging.length - 1
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
              <ul>
                <li v-for="example in area.cases" :key="example.uid">
                  {{ example.title }}
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
  async asyncData({ $prismic, error }) {
    try {
      const res = await $prismic.api.getSingle('practice');
      const document = res.data;
      delete res.data;
      return {
        ...res,
        document,
        lead: document.descriptor,
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
      error({ statusCode: 404, message: 'Page not found' });
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.$store.commit('setTheme', 'light');
  }
};
</script>
