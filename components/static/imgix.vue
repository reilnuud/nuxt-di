<template>
  <figure
    ref="figure"
    :class="`${fitContainer ? 'inset-0 absolute' : 'w-full h-full relative'}`"
    :style="`padding-bottom:${arPadding}`"
  >
    <img
      class="absolute inset-0 object-cover w-full h-full"
      :src="src"
      @onload="this.loaded = true"
    />
  </figure>
</template>

<script>
export default {
  props: {
    image: {
      type: Object,
      default: null
    },
    fitContainer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      src: null,
      loaded: false
    };
  },
  computed: {
    arPadding() {
      if (!this.fitContainer) {
        return `${(this.image.dimensions.height / this.image.dimensions.width) *
          100}%`;
      }
      return null;
    }
  },
  mounted() {
    this.buildUrls(this.image);
  },
  methods: {
    objToParams(obj) {
      const params = obj;
      return params;
    },
    buildUrls(image) {
      this.src = this.image.url;
      return true;
    }
  }
};
</script>
