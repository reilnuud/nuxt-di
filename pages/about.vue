<template>
  <div class="flex-grow pt-48 w-full overflow-hidden relative">
    <container>
      <prismic-rich-text
        v-if="lead !== null"
        class="leading-tight font-light rich-text text-2xl sm:text-3xl md:text-4xl"
        :richtext="lead"
      />
      <prismic-rich-text
        v-if="supporting_copy !== null"
        class="leading-tight font-light rich-text text-xl"
        :richtext="supporting_copy"
      />
      <btn color="gray" :to="button.link">{{ button.text }}</btn>
    </container>
    <div class="bg-gray">
      <container>
        <ul>
          <li
            v-for="message in core_messaging"
            :key="message.uid"
            class="flex"
          ></li>
        </ul>
      </container>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap';
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
    this.$store.commit('setTheme', 'dark');
    setTimeout(() => {
      gsap.to(this.$refs.logomark, { y: 0, opacity: 1, duration: 0.5 });
    }, 500);
  }
};
</script>
