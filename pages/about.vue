<template>
  <div
    class="flex-grow pt-48 bg-purple text-white w-full overflow-hidden relative"
  >
    <container class="py-12">
      <prismic-rich-text
        v-if="lead !== null"
        class="leading-medium font-light rich-text text-xl sm:text-2xl md:text-3xl"
        :richtext="lead"
      />
      <prismic-rich-text
        v-if="supporting_copy !== null"
        class="leading-tight font-light rich-text text-lg sm:text-xl my-6"
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
              'border-b border-purple': i !== core_messaging.length - 1
            }"
          >
            <div
              class="w-full mb-4 text-lg sm:text-base sm:mb-0 leading-normal sm:w-1/4 md:w-1/3 flex-shrink-0 px-3"
            >
              {{ message.label }}
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
          text: document.button_text
        },
        core_messaging: document.core_messaging.map(message => {
          return {
            uid: message.uid,
            label: message.label,
            copy: message.descriptor
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
    this.$store.commit('setTheme', { header: 'dark', footer: 'light' });
  }
};
</script>
