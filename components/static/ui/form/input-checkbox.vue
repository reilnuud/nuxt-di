<template>
  <label
    class="flex items-center text-grey-darkest font-sans uppercase tracking-1 font-bold text-xs leading-normal cursor-pointer relative"
    :for="id"
  >
    <input
      :id="id"
      :key="id"
      :name="name"
      :value="value"
      class="block absolute pin-t pin-l h-0 w-0 overflow-hidden z--10 opacity-0"
      type="checkbox"
      :checked="checked"
      @change="$emit('change', $event.target.checked)"
    />
    <span
      class="flex items-center justify-center border-3 transition h-5 w-5 bg-white-400 align-middle p-1"
      :class="{
        'border-grey-darker': !checked,
        'border-primary': checked
      }"
    >
      <span
        class="block transition-all duration-200 bg-primary"
        :class="{
          'bg-grey-darkest w-0 h-0': !checked,
          'bg-primary w-full h-full': checked
        }"
      />
    </span>
    <span class="inline-block ml-2">{{ label }}</span>
  </label>
</template>

<script>
export default {
  name: 'InputCheckbox',
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
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: null,
      isChecked: ''
    };
  },
  mounted() {
    this.id = this._uid;
  }
};
</script>
