<template>
  <div class="flex-grow pt-36 w-full overflow-hidden relative">
    <container class="py-12">
      <div>
        <app-link to="/insights" class="text-xs inline-flex group flex-col">
          <span>Back to Insights</span>
          <span
                    class="-mr-2 border-b-white border-b mt-1 opacity-0 w-0 group-hover:w-full group-hover:opacity-100 transition-all duration-200"
                  />
        </app-link>
      </div>
      <h1 class="font-light text-xl sm:text-2xl md:text-3xl">{{ title }}</h1>
      <div v-if="meta.image && meta.image.url" class="my-6 max-w-xl">
      <imgix
        :image="meta.image"
      />
      </div>
      <p class="leading-tight font-light rich-text text-lg sm:text-xl md:text-2xl">{{summary}}</p>
      <div class="border-b-2 my-6 border-white" />
    </container>
    <container>
      <ul>
        <li
          v-for="(detail, i) in details"
          :key="detail.uid"
          class="flex flex-wrap text-white sm:flex-nowrap -mx-3 py-8"
          :class="{
            'border-t border-white': i > 0 && detail.heading && !detail.image
          }"
        >
        <div class="w-full ml-auto max-w-3xl" v-if="detail.image && detail.image.url">
          <imgix
            :image="detail.image"
          />
        </div>
          <div
          v-if="detail.heading || detail.copy"
            class="w-full mb-4 text-lg sm:text-base sm:mb-0 leading-normal sm:w-1/4 md:w-1/3 flex-shrink-0 px-3"
          >
            {{ detail.heading }}
          </div>
          <div v-if="detail.heading || detail.copy" class="px-3">
            <prismic-rich-text
              class="leading-normal rich-text-inverse"
              :richtext="detail.copy"
            />
          </div>
        </li>
      </ul>
    </container>
  </div>
</template>

<script>
// import gsap from 'gsap';
export default {
  async asyncData({ $prismic, error, params }) {
    try {
      const uid = params.id;
      const res = await $prismic.api.getByUID('article', uid);
      const document = res.data;
      delete res.data;
      return {
        ...res,
        document,
        title: document.title,
        summary: document.summary,
        details: document.body.map(item => {
          return {
            heading: item.primary.heading1,
            copy: item.primary.description,
            image:item.primary.image,
            caption:item.primary.caption,
          };
        }),
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
