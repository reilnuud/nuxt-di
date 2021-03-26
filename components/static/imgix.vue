<template>
  <figure
    ref="figure"
    :class="`${fitContainer ? 'inset-0 absolute' : 'w-full h-full relative'}`"
    :style="`padding-bottom:${arPadding}`"
  >
    <img
      ref="img"
      class="absolute inset-0 object-cover w-full h-full opacity-0 transition duration-200"
      :src="src"
      @load="loaded = true"
    />
  </figure>
</template>

<script>
import gsap from 'gsap';
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
  watch: {
    loaded() {
      gsap.to(this.$refs.img, { opacity: 1 });
    }
  },
  mounted() {
    // const _this = this;
    // this.$refs.img.on('load', () => {
    //   _this.loaded = true;
    // });
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
