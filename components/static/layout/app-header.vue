<template>
  <header
    class="py-3 absolute z-10 top-0 left-0 right-0 transition duration-200"
    :class="{
      'text-purple': theme.header === 'light',
      'text-white': theme.header === 'dark'
    }"
  >
    <div
      class=" bg-gradient-to-b from-purple to-transparent absolute top-0 right-0 left-0 h-36 z-0 transition duration-200"
      :class="{
        'opacity-0': theme.header === 'light',
        'opacity-50': theme.header === 'dark'
      }"
    />
    <container class="relative z-10">
      <div class="-mx-3 md:-mx-6 flex items-center justify-between">
        <nuxt-link to="/" class="block px-3 md:px-6 flex items-center">
          <logo class="fill-current w-36 sm:w-48" />
        </nuxt-link>
        <div class="px-3 lg:px-6">
          <nav
            ref="nav"
            class="hidden md:flex relative items-center ml-auto font-medium text-sm -mx-3"
            @mouseenter="mouseInNav(true)"
            @mouseleave="mouseInNav(false)"
          >
            <!-- links -->
            <div
              v-for="item in resolvedLinks"
              :key="`${item.link}-header-nav`"
              class="px-3"
            >
              <app-link
                class="app-header__link flex py-1 transition duration-200"
                :link="item.link"
                @mouseenter.native="hover"
                @click.native="setActive"
                >{{ item.label }}</app-link
              >
            </div>
            <div
              ref="underline"
              class="absolute bottom-0 h-px"
              :class="{
                'bg-black': theme.header === 'light',
                'bg-gray': theme.header === 'dark'
              }"
            />
            <!-- button -->
            <!-- <div v-if="button && button.link.length" class="px-3">
              <btn
                class="app-header__link transition duration-200"
                :link="button.link"
                size="sm"
                color="black"
                >{{ button.label }}</btn
              >
            </div> -->
          </nav>
          <button
            type="button"
            class="flex md:hidden items-center justify-center p-2 text-xl cursor-pointer"
            @click="toggleNav"
          >
            <i class="material-icons">menu</i>
          </button>
        </div>
      </div>
    </container>
  </header>
</template>

<script>
import gsap from 'gsap';
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
      }),
      isMouseInNav: false
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    }
  },
  methods: {
    toggleNav() {
      this.$store.commit('setNavOpen', !this.$store.state.navOpen);
    },
    hover(e) {
      gsap.to(this.$refs.underline, {
        x: e.target.offsetLeft,
        scale: 1,
        width: e.target.clientWidth,
        duration: 0.1
      });
    },
    setActive(e) {
      // do stuff
    },
    mouseInNav(state) {
      this.isMouseInNav = state;
      if (!state) {
        gsap.to(this.$refs.underline, {
          scale: 0,
          duration: 0.1
        });
      }
    }
  }
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
