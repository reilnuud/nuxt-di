<template>
  <label
    class="inline-flex items-center text-grey-darkest font-sans uppercase tracking-1 font-bold text-xs leading-normal cursor-pointer relative"
    :for="id"
  >
    <input
      :id="id"
      :key="id"
      :value="value"
      :name="name"
      type="radio"
      class="block absolute pin-t pin-l h-0 w-0 overflow-hidden opacity-0 z--10"
      :checked="checked == value"
      @change="$emit('change', $event.target.value)"
    />
    <span
      class="inline-block border-3 rounded-full transition h-5 w-5 bg-white-400 items-center p-1"
      :class="{
        'border-grey-darker': checked != value,
        'border-blue': checked == value
      }"
    >
      <span class="block overflow-hidden rounded-full h-full w-full">
        <span
          class="block h-full transition bg-blue"
          :class="{
            'opacity-0 w-0': checked != value,
            'opacity-100 w-full': checked == value
          }"
        />
      </span>
    </span>
    <span class="inline-block ml-2">{{ label }}</span>
  </label>
</template>

<script>
export default {
  name: 'InputRadio',
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    label: {
      type: String,
      default: 'Label'
    },
    value: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    checked: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      id: null,
      isChecked: ''
    }
  },
  mounted() {
    this.id = this._uid
  }
}
</script>
