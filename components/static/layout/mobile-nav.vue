<template>
  <div
    class="py-6 fixed z-20 inset-0 transform transition duration-200 md:hidden"
    :class="{
      'text-black bg-white': theme === 'light',
      'text-white bg-purple': theme === 'dark',
      'opacity-0 pointer-events-none translate-y-4': !navOpen
    }"
  >
    <button
      type="button"
      class="absolute flex top-0 right-0 items-center justify-center py-6 px-8 text-xl cursor-pointer"
      @click="toggleNav"
    >
      <i class="material-icons">close</i>
    </button>
    <container>
      <nav class="flex flex-col ml-auto font-medium text-xl -mx-3">
        <!-- logo -->
        <nuxt-link to="/" class="block mb-12 flex items-center">
          <logo class="fill-current w-48" />
        </nuxt-link>
        <!-- links -->
        <div
          v-for="item in resolvedLinks"
          :key="`${item.link}-header-nav`"
          class="mb-6 mt-auto"
        >
          <app-link
            class="app-header__link p-1 transition duration-200"
            :link="item.link"
            @click.native="toggleNav"
            >{{ item.label }}</app-link
          >
        </div>
      </nav>
    </container>
  </div>
</template>

<script>
const globalSettings = process.env.SITE_SETTINGS;
export default {
  data() {
    return {
      globalSettings,
      button: {
        label: globalSettings.button_label,
        link: globalSettings.button_link
      },
      resolvedLinks: globalSettings.body.map(link => {
        return {
          label: link.primary.label,
          link: link.primary.link
        };
      })
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    navOpen() {
      return this.$store.state.navOpen;
    }
  },
  methods: {
    toggleNav() {
      this.$store.commit('setNavOpen', !this.$store.state.navOpen);
    }
  }
  // mounted() {
  //   console.log(this.globalSettings);
  // }
};
</script>

<style scoped>
.app-header__link {
  transition-property: all;
  box-shadow: inset 0 -2px 0 transparent;
}

.app-header__link.nuxt-link-active {
  box-shadow: inset 0 -2px 0 currentColor;
}
</style>
