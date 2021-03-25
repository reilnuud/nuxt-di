<template>
  <!-- external link -->
  <div class="flex">
    <button v-if="type === 'submit'" :class="defaultClasses" type="type">
      <span class="relative z-10 flex items-center"><slot></slot></span>
      <span
        class="transition duration-200 w-full absolute left-0 right-0 bottom-0 h-0 z-0 opacity-50"
        :class="`bg-${color}-100 group-hover:h-full`"
      />
    </button>
    <app-link v-else :class="defaultClasses" :to="to" :link="link">
      <span class="relative z-10 flex items-center"><slot></slot></span>
      <span
        class="transition duration-200 w-full absolute left-0 right-0 bottom-0 h-0 z-0 opacity-50"
        :class="`bg-${color}-100 group-hover:h-full`"
      />
    </app-link>
  </div>
</template>

<script>
export default {
  name: 'Btn',
  props: {
    type: {
      type: String,
      default: 'button'
    },
    color: {
      type: String,
      default: 'green'
    },
    outline: {
      type: Boolean,
      default: false
    },
    link: {
      type: Object,
      default: null
    },
    to: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null
    },
    fluid: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    defaultClasses() {
      let baseClasses = `flex rounded items-center leading-none justify-center font-sans tracking-1 uppercase font-bold relative group cursor-pointer rounded-sm transition duration-200`;
      if (this.outline) {
        baseClasses += ` border-2 border-${this.color} hover:bg-${this.color} text-${this.color} hover:text-white`;
      } else if (this.color === 'white') {
        baseClasses += ` text-green bg-${this.color} hover:bg-blue hover:border-green border-2 border-${this.color}`;
      } else {
        baseClasses += ` text-white bg-${this.color} hover:bg-${this.color}-light hover:border-${this.color}-light border-2 border-${this.color}`;
      }
      if (this.fluid) {
        baseClasses += ` w-full`;
      }
      if (this.size === 'xl') {
        return `${baseClasses} py-6 px-8 text-xl`;
      }
      if (this.size === 'lg') {
        return `${baseClasses} py-4 px-6 text-lg`;
      }
      if (this.size === 'sm') {
        return `${baseClasses} py-3 px-4 text-sm`;
      }
      return `${baseClasses} py-3 px-4`;
    }
  }
};
</script>
