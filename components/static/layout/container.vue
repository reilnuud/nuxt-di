<template>
  <div
    class="mx-auto"
    :class="{
      'w-full max-w-2xl xl:max-w-3xl px-6': variant === 'copy',
      'w-full max-w-6xl xl:max-w-8xl px-6 lg:px-12': variant === 'site',
      'w-full': variant === 'full'
    }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: 'site'
    }
  }
};
</script>

<style></style>
