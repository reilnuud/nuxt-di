<template>
  <button
    class="inline-block px-3 py-2 text-white font-sans tracking-1 uppercase text-xs font-bold relative group"
    :href="href"
  >
    <span class="relative z-10"><slot /></span>
    <div
      class="group-hover:opacity-75 w-full transition h-full absolute inset-0 z-0"
      :class="`bg-${color}`"
    />
  </button>
</template>

<script>
export default {
  name: 'BtnSm',
  props: {
    color: {
      type: String,
      default: 'black'
    },
    href: {
      type: String,
      default: '#'
    }
  }
};
</script>
