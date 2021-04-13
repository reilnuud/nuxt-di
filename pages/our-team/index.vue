<template>
  <div class="flex-grow pt-48 w-full text-white overflow-hidden relative">
    <container class="py-12">
      <h1
        class="leading-none font-light rich-text text-xl sm:text-2xl md:text-3xl mb-6"
      >
        {{ heading }}
      </h1>
      <div class="max-w-xl">
        <ul class="-mx-6 md:-mx-8 lg:-mx-12 flex flex-wrap">
          <li
            v-for="member in members"
            :key="member.uid"
            class="w-1/2 px-6 md:px-8 lg:px-12 my-6"
          >
            <app-link
              :to="`/our-team/${member.slug}`"
              class="flex flex-col items-start w-full"
            >
              <div class="w-full relative" style="padding-bottom:100%;">
                <imgix
                  v-if="member.image"
                  :image="member.image"
                  fit-container
                />
              </div>
              <div class="mt-6">
                <div class="font-bold">{{ member.name }}</div>
                <div class="-mr-2 border-b-white border-b mt-3" />
              </div>
              <div class="mt-3 uppercase">{{ member.title }}</div>
            </app-link>
          </li>
        </ul>
      </div>
    </container>
  </div>
</template>

<script>
// import gsap from 'gsap';
export default {
  async asyncData({ $prismic, error }) {
    try {
      const res = await $prismic.api.getByUID('lawyers', 'our-team', {
        fetchLinks: [
          'team_member.title',
          'team_member.image',
          'team_member.title1'
        ]
      });
      const document = res.data;
      delete res.data;
      return {
        ...res,
        document,
        heading: document.heading,
        members: document.team.map(tm => {
          return {
            slug: tm.team_member.uid,
            name: tm.team_member.data.title,
            title: tm.team_member.data.title1,
            image: tm.team_member.data.image
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
    this.$store.commit('setTheme', { header: 'dark', footer: 'dark' });
  }
};
</script>
