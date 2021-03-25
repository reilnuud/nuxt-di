<template>
  <div>
    <component
      :is="`slice-${kebabify(component.slice_type)}`"
      v-for="(component, i) in content"
      :key="component.slice_type + i"
      :primary="component.primary"
      :items="component.items.length > 0 ? component.items : null"
      :class="
        `${i > 0 ? 'mt-16' : ''} ${
          content && i < content.length - 1 ? 'mb-16' : ''
        } `
      "
    />
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      colors: {},
      previousSlice: null
    };
  },
  methods: {
    // not a full kebabing algo but replaces `_` from prismic
    kebabify(string) {
      return String(string).replace(/_/g, '-');
    }
  }
};
</script>
