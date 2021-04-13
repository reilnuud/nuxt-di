<template>
  <div
    class="pt-12"
    :class="{
      'text-black': theme.footer === 'light',
      'text-gray': theme.footer === 'dark'
    }"
  >
    <container>
      <!-- <div
        class="border-t-2"
        :class="{
          'border-black': theme === 'light',
          'border-white': theme === 'dark'
        }"
      /> -->
      <div class="div font-normal text-sm py-6 -mx-3 lg:-mx-6">
        <div class="px-3 lg:px-6 mb-6">
          <nuxt-link to="/" class="block flex items-center">
            <logo class="w-40 fill-current" />
          </nuxt-link>
          <div class="flex flex -mx-6">
            <div class="mt-6 text-xs px-6">
              <div>{{ copyright }}</div>
              <prismic-rich-text
                v-if="address !== null"
                class="leading-normal
              rich-text"
                :richtext="address"
              />
            </div>
            <div class="mt-6 text-xs px-6">
              <app-link :href="`tel:+${telephone}`">{{
                formattedNumber
              }}</app-link>
            </div>
          </div>
        </div>
        <div class="w-full px-3 lg:px-6">
          <nav
            class="grid gap-2 grid-cols-1 max-w-md text-xs sm:grid-cols-2 md:grid-cols-3 items-center -mx-3"
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
const globalSettings = process.env.SITE_SETTINGS;
export default {
  data() {
    return {
      telephone: globalSettings.telephone,
      address: globalSettings.address,
      copyright: globalSettings.copyright_text,
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
    },
    formattedNumber() {
      // Filter only numbers from the input
      const cleaned = ('' + this.telephone).replace(/\D/g, '');

      // Check if the input is of correct
      const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

      if (match) {
        // Remove the matched extension code
        // Change this to format for any country code.
        const intlCode = match[1] ? '+1 ' : '';
        return [intlCode, ' ', match[2], '.', match[3], '.', match[4]].join('');
      }

      return null;
    }
  }
};
</script>
