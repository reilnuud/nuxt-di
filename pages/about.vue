<template>
  <div
    class="flex-grow pt-48 bg-purple text-white w-full overflow-hidden relative"
  >
    <container class="py-12">
      <prismic-rich-text
        v-if="lead !== null"
        class="font-light text-xl sm:text-2xl md:text-3xl"
        :richtext="lead"
      />
      <div class="border-b-2 my-6 border-white" />
      <prismic-rich-text
        v-if="supporting_copy !== null"
        class="leading-tight font-light rich-text text-lg sm:text-xl md:text-2xl"
        :richtext="supporting_copy"
      />
      <div class="mt-6">
        <btn color="white" size="lg" :to="button.link">{{ button.text }}</btn>
      </div>
    </container>
    <div class="bg-gray text-black py-6">
      <container>
        <ul>
          <li
            v-for="(message, i) in core_messaging"
            :key="message.uid"
            class="flex flex-wrap max-w-4xl xl:max-w-5xl sm:flex-nowrap -mx-3 py-8"
            :class="{
              'border-b border-purple': i !== core_messaging.length - 1,
            }"
          >
            <div
              class="w-full mb-4 font-bold text-lg sm:mb-0 leading-tight pt-1 sm:w-1/4 md:w-1/3 flex-shrink-0 px-3"
            >
              <div style="max-width: 300px">
                {{ message.label }}
              </div>
            </div>
            <div class="px-3">
              <prismic-rich-text
                v-if="supporting_copy !== null"
                class="leading-normal rich-text"
                :richtext="message.copy"
              />
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
      const res = await $prismic.api.getSingle('about');
      const document = res.data;
      delete res.data;
      return {
        ...res,
        document,
        lead: document.lead,
        supporting_copy: document.supporting_copy,
        button: {
          url: document.button_link,
          text: document.button_text,
        },
        core_messaging: document.core_messaging.map(message => {
          return {
            uid: message.uid,
            label: message.label,
            copy: message.descriptor,
          };
        }),
        title: document.title,
        meta: {
          title: document.meta_title,
          description: document.meta_description,
          image: document.meta_image,
        },
      };
    } catch (e) {
      error({ statusCode: 404, message: 'Page not found' });
    }
  },
  data() {
    return {};
  },
  head() {
    // return this.$processMeta(this.title, this.meta, this.$route.path);
  },
  mounted() {
    this.$store.commit('setTheme', { header: 'dark', footer: 'light' });
  },
};
</script>
