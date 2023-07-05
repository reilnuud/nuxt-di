<template>
  <div class="flex-grow pt-48 w-full text-white overflow-hidden relative">
    <container class="py-12">
      <h1
        class="leading-none font-light rich-text text-xl sm:text-2xl md:text-3xl mb-6"
      >
        Insights
      </h1>
      <ul class="-mx-6 flex flex-wrap">
        <li
          v-for="article in insights"
          class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-6 my-6"
        >
          <app-link
            :to="`/insights/${article.slug}`"
            class="flex flex-col items-start w-full group"
          >
            <div class="w-full relative bg-white" style="padding-bottom:100%;">
              <imgix
                v-if="article.meta_image && article.meta_image.url"
                :image="article.meta_image"
                fit-container
                class="z-10"
              />
              <div class="flex items-center z-0 justify-center absolute inset-0">
                <logomark class="w-20 fill-purple h-20"/>
              </div>
            </div>
            <div class="mt-6">
              <div class="font-bold">{{ article.title }}</div>
              <div
                class="-mr-2 border-b-white border-b mt-1 opacity-0 w-0 group-hover:w-full group-hover:opacity-100 transition-all duration-200"
              />
            </div>
            <div class="mt-1 text-sm">{{ article.summary }}</div>
          </app-link>
        </li>
      </ul>
    </container>
  </div>
</template>

<script>
// import gsap from 'gsap';
export default {
  async asyncData({ $prismic, error }) {
    try {
      const res = await $prismic.api.getByUID('insights', 'insights');
      const {results:insights} = await $prismic.api.query($prismic.predicates.at(
        'document.type', 'article'
      ))
      console.log(insights)
      const document = res.data;
      delete res.data;
      return {
        ...res,
        insights:insights.map(({data,uid})=>({...data, slug:uid})),
        document,
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
    this.$store.commit('setTheme', { header: 'dark', footer: 'dark' });
  }
};
</script>
