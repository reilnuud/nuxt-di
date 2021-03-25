<template>
  <button
    class="inline-block py-3 px-4 text-white font-sans tracking-1 uppercase text-sm font-bold relative group"
    :href="href"
  >
    <span class="relative z-10"><slot /></span>
    <div
      class="transition w-full h-full absolute inset-0 z-0"
      :class="`bg-${color} group-hover:bg-${color}-light`"
    />
  </button>
</template>

<script>
export default {
  name: 'Btn',
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
}
</script>
