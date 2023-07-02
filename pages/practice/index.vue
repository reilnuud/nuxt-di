<template>
  <div class="flex-grow pt-32 w-full text-black overflow-hidden relative">
    <container class="py-12">
      <h1 class="font-light text-xl sm:text-2xl md:text-3xl">
        {{ heading }}
      </h1>
      <div class="border-b-2 my-6 border-black" />
      <prismic-rich-text
        v-if="lead !== null"
        class="leading-tight font-light rich-text text-lg sm:text-xl md:text-2xl"
        :richtext="lead"
      />
      <ul v-if="images && images.length">
        <!-- <li v-for="image in images">x</li> -->
      </ul>
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
              class="w-full mb-4 font-bold text-lg sm:mb-0 leading-tight pt-1 sm:w-1/4 md:w-1/3 flex-shrink-0 px-3"
            >
              <div style="max-width:300px;">
                {{ area.heading }}
              </div>
              <ul class="grid grid-cols-1 pr-3 gap-3 mt-4" v-if="area.images && area.images.length">
                <li v-for="image in area.images">
                  <div class="max-w-64">
                  <imgix v-if="image" :image="image" />
                  </div>
                </li>
              </ul>
            </div>
            <div class="px-3">
              <prismic-rich-text
                class="leading-normal rich-text"
                :richtext="area.descriptor"
              />
              <!-- <ul class="py-2 mt-8">
                <li
                  v-for="example in area.cases"
                  :key="example.uid"
                  class="py-2"
                >
                  <app-link :to="example.text">{{ example.text }}</app-link>
                </li>
              </ul> -->
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
      const res = await $prismic.api.getByUID('practices', 'practice');
      const document = res.data;
      delete res.data;
      return {
        ...res,
        document,
        images:document?.images?.map(({image})=>image),
        lead: document.descriptor,
        heading: document.heading,
        areas: document.body.map(slice => {
          return {
            heading: slice.primary.heading1,
            descriptor: slice.primary.description,
            images: slice.items.map(({sidebar_image})=>sidebar_image)
          };
        }),
        title: document.title,
        meta: {
          title: document.meta_title,
          description: document.meta_description,
          image: document.meta_image
        }
      };
    } catch (e) {
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
    console.log(this.areas)
  }
};
</script>
