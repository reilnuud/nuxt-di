<template>
  <div
    class="mx-auto px-6"
    :class="{
      'max-w-3xl xl:max-w-4xl': variant === 'copy',
      'max-w-4xl xl:max-w-5xl': variant === 'site'
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
}
</script>

<style></style>
