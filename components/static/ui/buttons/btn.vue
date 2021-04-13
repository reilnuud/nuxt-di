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
      let baseClasses = `flex items-center leading-none justify-center font-sans font-normal relative group cursor-pointer transition duration-200`;
      if (this.outline) {
        baseClasses += ` border-2 border-${this.color} hover:bg-${this.color} text-${this.color} hover:text-black`;
      } else if (this.color === 'white') {
        baseClasses += ` text-black bg-${this.color} hover:bg-blue hover:border-green border-2 border-${this.color}`;
      } else {
        baseClasses += ` text-white bg-${this.color} hover:bg-${this.color}-light hover:border-${this.color}-light border-2 border-${this.color}`;
      }
      if (this.fluid) {
        baseClasses += ` w-full`;
      }
      if (this.size === 'xl') {
        return `${baseClasses} py-4 px-6 text-lg sm:text-xl`;
      }
      if (this.size === 'lg') {
        return `${baseClasses} py-2 px-2 text-xl sm:text-lg`;
      }
      if (this.size === 'sm') {
        return `${baseClasses} py-1 px-3 text-xxs sm:text-xs`;
      }
      return `${baseClasses} text-sm sm:text-base py-2 px-3`;
    }
  }
};
</script>
