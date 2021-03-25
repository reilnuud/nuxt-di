<template>
  <div class="relatives">
    <div class="flex flex-col group">
      <input
        :id="id"
        :key="id"
        :value="value"
        :name="name"
        :placeholder="placeholder"
        class="input-field placeholder-grey bg-white-400 block w-full py-3 px-4 text-grey-darkest focus:text-black focus:outline-none font-sans text-sm relative group order-1 border-b-2 border-grey-darker focus:border-black transition"
        :type="type"
        @input="$emit('input', $event.target.value)"
      />
      <label
        class="input-field__label transition inline-block text-grey-darker font-sans mb-2 uppercase tracking-1 font-bold text-xs order-0"
        :for="id"
      >
        {{ label }}
      </label>
      <span
        v-if="description != ''"
        class="transition input-field__description text-grey font-sans text-xs uppercase order-2 mt-2 font-semibold tracking-1"
      >
        {{ description }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputField',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: 'Label'
    },
    description: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    placeholder: {
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
      isChecked: false
    }
  },
  mounted() {
    this.id = this._uid
  }
}
</script>

<style lang="pcss">
.input-field:focus ~ .input-field__label {
  @apply text-black;
}
.input-field:focus ~ .input-field__description {
  /* @apply text-gray; */
}
</style>
