<template>
  <section
    v-if="primary.heading !== null"
    class="min-h-hero-md py-12 w-full bg-black flex flex-col text-white items-start justify-center relative"
  >
    <!-- background image -->
    <imgix
      v-if="primary.background_image"
      :image="primary.background_image"
      class="absolute inset-0 z-0"
      fit-container
    />
    <!-- image -->
    <container
      class="relative text-white z-10"
      :class="{
        'justify-center': primary.text_alignment === `center`,
        'justify-right': primary.text_alignment === `right`
      }"
    >
      <!-- heading -->
      <prismic-rich-text
        v-if="primary.heading !== null"
        class="leading-normal rich-text text-4xl"
        :richtext="primary.heading"
      />
      <!-- supporting text -->
      <prismic-rich-text
        v-if="primary.subheading !== null"
        class="leading-normal text-lg rich-text"
        :richtext="primary.subheading"
      />
      <!-- button -->
    </container>
  </section>
</template>

<script>
import PrismicConfig from '~/prismic.config.js';

export default {
  props: PrismicConfig.defaultProps
  /* to merge the default values, use the below code instead */
  /*
  props: {
    ...defaultProps,
    NEWPROPERTY: {
      type: TYPE
      default: DEFAULT
    }
  }
  */
};
</script>
