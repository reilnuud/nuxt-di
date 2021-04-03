<template>
  <div class="flex-grow pt-48 w-full text-white overflow-hidden relative">
    <container class="py-12">
      <h1
        class="leading-none font-light rich-text text-2xl sm:text-3xl md:text-4xl"
      >
        {{ heading }}
      </h1>
      <div class="max-w-3xl">
        <ul class="-mx-3">
          <li
            v-for="member in members"
            :key="member.uid"
            class="w-1/2 px-3 my-6"
          >
            <div class="w-full relative" style="padding-bottom:100%;">
              <imgix v-if="member.image" :image="member.image" fit-container />
            </div>
            <div class="mt-6">{{ member.name }}</div>
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
        fetchLinks: ['team_member.title', 'team_member.image']
      });
      const document = res.data;
      delete res.data;
      return {
        ...res,
        document,
        heading: document.heading,
        members: document.team.map(tm => {
          console.log(tm);
          return {
            name: tm.team_member.data.title,
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
    this.$store.commit('setTheme', 'dark');
  }
};
</script>
