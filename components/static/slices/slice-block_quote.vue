<template>
  <div class="py-6">
    <container variant="copy">
      <blockquote
        class="font-sans text-3xl leading-tight my-6 mx-8 md:mx-12 lg:mx-16 mt-10"
      >
        <prismic-rich-text
          v-if="primary.quote !== null"
          :richtext="primary.quote"
        />
        <cite
          class="block mt-2 mx-4 text-right font-serif text-sm tracking-1 uppercase font-semibold italic"
        >
          <prismic-rich-text
            v-if="primary.citation !== null"
            :richtext="primary.citation"
          />
        </cite>
      </blockquote>
    </container>
  </div>
</template>

<script>
import PrismicConfig from '~/prismic.config.js';

export default {
  props: PrismicConfig.defaultProps
};
</script>
