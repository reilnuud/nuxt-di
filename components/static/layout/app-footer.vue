<template>
  <div
    class="pt-12"
    :class="{
      'text-purple': theme === 'light',
      'text-white': theme === 'dark'
    }"
  >
    <container>
      <div
        class="border-t-2 border-white"
        :class="{
          'border-purple': theme === 'light',
          'border-white': theme === 'dark'
        }"
      />
      <div
        class="div sm:flex flex-wrap md:flex-nowrap font-medium tracking-1 text-xs py-6 -mx-3 lg:-mx-6"
      >
        <div class="px-3 lg:px-6 mb-6">
          <nuxt-link to="/" class="block flex items-center">
            <logo class="w-48 fill-current" />
          </nuxt-link>
          <div class="font-normal mt-6 text-xs">&copy; {{ copyright }}</div>
        </div>
        <div class="ml-auto px-3 lg:px-6">
          <nav
            class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center font-medium -mx-3"
          >
            <div
              v-for="item in resolvedLinks"
              :key="`${item.link}-header-nav`"
              class="px-3"
            >
              <app-link
                class="app-header__link transition duration-200"
                :link="item.link"
                >{{ item.label }}</app-link
              >
            </div>
          </nav>
        </div>
      </div>
    </container>
  </div>
</template>

<script>
import moment from 'moment';
const globalSettings = process.env.SITE_SETTINGS;
export default {
  data() {
    return {
      copyright: moment().format('YYYY') + ' ' + globalSettings.copyright_text,
      resolvedLinks: globalSettings.body1.map(link => {
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
    }
  }
};
</script>
