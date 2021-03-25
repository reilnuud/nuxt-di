<template>
  <div class="py-12">
    <container>
      <div class="border-t-2 border-black" />
      <div
        class="flex flex-wrap font-semibold uppercase tracking-1 text-xs py-3 -mx-3 lg:-mx-6"
      >
        <div class="px-3 lg:px-6">
          <nuxt-link to="/" class="block flex items-center">
            <span class="font-bold">nuxt-rude</span>
          </nuxt-link>
          <div class="font-normal text-xxs">&copy; {{ copyright }}</div>
        </div>
        <div class="ml-auto px-3 lg:px-6">
          <nav class="flex items-center font-bold uppercase tracking-1 -mx-3">
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
  }
};
</script>
