<template>
  <div class="pt-12 bg-purple">
    <container>
      <div class="border-t-2 border-white text-white" />
      <div
        class="flex flex-wrap font-medium text-white tracking-1 text-xs py-6 -mx-3 lg:-mx-6"
      >
        <div class="px-3 lg:px-6">
          <nuxt-link to="/" class="block flex items-center">
            <logo class="w-48 fill-white" />
          </nuxt-link>
          <div class="font-normal mt-6 text-xs">&copy; {{ copyright }}</div>
        </div>
        <div class="ml-auto px-3 lg:px-6">
          <nav class="flex items-center font-medium -mx-3">
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
