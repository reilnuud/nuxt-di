<template>
  <div
    class="flex-grow pt-48 bg-purple text-white w-full overflow-hidden relative"
  >
    <container class="py-12">
      <h1 class="font-light text-xl sm:text-2xl md:text-3xl" :richtext="lead">
        {{ heading }}
      </h1>
    </container>
    <div class="bg-gray py-12 text-black py-6">
      <container>
        <div class="flex flex-wrap -mx-6">
          <div class="w-full px-6 md:w-1/2">
            <prismic-rich-text
              class="leading-normal rich-text"
              :richtext="description"
            />
          </div>
          <div class="w-full px-6 md:w-1/2">
            <form class="mt-6 md:mt-0">
              <div class="-mx-2 flex flex-wrap">
                <div class="px-2 w-full mb-1">Name</div>
                <div class="px-2 w-full sm:w-1/2 flex flex-col mb-4">
                  <input class="order-1 px-2 py-1" />
                  <label class="order-2 mt-1 text-sm ">First</label>
                </div>
                <div class="px-2 w-full sm:w-1/2 flex flex-col mb-4">
                  <input class="order-1 px-2 py-1" />
                  <label class="order-2 mt-1 text-sm ">Last</label>
                </div>
              </div>
              <div class="flex flex-col md:-mt-2 mb-4">
                <input class="order-2 px-2 py-1" />
                <label class="order-1 mb-1">Email</label>
              </div>
              <div class="flex flex-col mb-4">
                <textarea class="order-2 px-2 py-1" style="min-height:120px;" />
                <label class="order-1 mb-1">Message</label>
              </div>
              <div class="mt-6">
                <btn color="black" type="submit">Send</btn>
              </div>
            </form>
          </div>
        </div>
        <!-- stuff -->
      </container>
    </div>
  </div>
</template>

<script>
// import gsap from 'gsap';
export default {
  async asyncData({ $prismic, error }) {
    try {
      const res = await $prismic.api.getSingle('contact');
      const document = res.data;
      delete res.data;
      return {
        ...res,
        document,
        heading: document.heading,
        description: document.description
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
