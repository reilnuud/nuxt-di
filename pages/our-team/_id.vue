<template>
  <div class="flex-grow pt-48 w-full overflow-hidden relative">
    <container class="py-12">
      <div class="flex">
        <div class="sm:w-1/4 md:w-1/3 flex-shrink-0"></div>
        <div class="max-w-xs md:px-2 w-full">
          <div class="w-full relative" style="padding-bottom:100%;">
            <imgix v-if="image" :image="image" fit-container />
          </div>
          <div class="mt-6">
            <div class="font-bold">{{ name }}</div>
            <div class="-mr-2 border-b-white border-b mt-3" />
          </div>
          <div class="mt-3 uppercase">{{ title }}</div>
          <div v-if="email" class="mt-4 text-base">
            <a :href="`mailto:${email}`">{{ email }}</a>
          </div>
          <div v-if="phone" class="mt-2 text-base">
            <a :href="`tel:+1${phone.replace(/[^0-9\.]/g, '')}`">
              {{ phone.replace(/-/g, '.').replace(/[^0-9\.]/g, '') }}
            </a>
          </div>
        </div>
      </div>
    </container>
    <container>
      <ul>
        <li
          v-for="(detail, i) in details"
          :key="detail.uid"
          class="flex flex-wrap text-white sm:flex-nowrap -mx-3 py-8"
          :class="{
            'border-b border-white': i !== details.length - 1
          }"
        >
          <div
            class="w-full mb-4 text-lg sm:text-base sm:mb-0 leading-normal sm:w-1/4 md:w-1/3 flex-shrink-0 px-3"
          >
            {{ detail.heading }}
          </div>
          <div class="px-3">
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
      const res = await $prismic.api.getByUID('team_member', uid);
      const document = res.data;
      delete res.data;
      return {
        ...res,
        document,
        name: document.title,
        title: document.title1,
        image: document.image,
        email: document.email,
        phone: document.phone,
        details: document.body.map(item => {
          return {
            heading: item.primary.section_heading,
            copy: item.primary.copy
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
