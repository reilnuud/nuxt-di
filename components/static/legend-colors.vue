<template>
  <ul
    v-if="values && Object.keys(values).length > 1"
    class="flex flex-wrap"
    style="font-variant-numeric: tabular-nums;"
  >
    <li
      v-for="value in Object.keys(values)"
      :key="value"
      class="flex items-center uppercase text-xs font-bold -mx-1 px-2 my-2"
    >
      <div class="px-1">
        <div class="h-4 w-4" :style="`background:${values[value]}`" />
      </div>
      <div class="px-1" :style="`color:${values[value]}`">
        {{ value }}
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    values: {
      // eslint-disable-next-line vue/require-default-prop
      type: Object,
      // eslint-disable-next-line vue/require-default-prop
      default: null
    }
  }
};
</script>
