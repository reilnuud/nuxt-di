<template>
  <header class="py-3">
    <container>
      <div class="-mx-3 md:-mx-6 flex items-center justify-between">
        <nuxt-link to="/" class="block px-3 md:px-6 flex items-center">
          <rm-treemark class="fill-white p-2 rounded-full bg-black w-16 h-16" />
          <span class="ml-2 font-bold">nuxt-rude</span>
        </nuxt-link>
        <div class="px-3 lg:px-6">
          <nav
            class="flex items-center ml-auto font-bold uppercase text-sm tracking-1 -mx-3"
          >
            <!-- links -->
            <div
              v-for="item in resolvedLinks"
              :key="`${item.link}-header-nav`"
              class="px-3"
            >
              <app-link
                class="app-header__link p-1 transition duration-200"
                :link="item.link"
                >{{ item.label }}</app-link
              >
            </div>
            <!-- button -->
            <div v-if="button" class="px-3">
              <btn
                class="app-header__link transition duration-200"
                :link="button.link"
                size="sm"
                color="black"
                >{{ button.label }}</btn
              >
            </div>
          </nav>
        </div>
      </div>
    </container>
  </header>
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
