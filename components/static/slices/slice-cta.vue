<template>
  <div>
    <container>
      <div class="bg-black rounded text-white p-6 md:p-12 text-center">
        <h2 class="text-4xl">{{ primary.heading[0].text }}</h2>
        <div
          v-if="primary.copy.length > 0"
          class="mt-4 max-w-md text-lg mx-auto"
        >
          <prismic-rich-text
            v-if="primary.copy !== null"
            class="leading-normala rich-text"
            :richtext="primary.copy"
          />
        </div>
        <div class="flex items-center justify-center mt-8">
          <btn :link="primary.button_link">{{ primary.button_text }}</btn>
        </div>
      </div>
    </container>
  </div>
</template>

<script>
import PrismicConfig from '~/prismic.config.js';

export default {
  props: PrismicConfig.defaultProps
};
</script>
