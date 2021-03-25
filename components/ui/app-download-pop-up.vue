<template>
  <div />
</template>
<script>
export default {
  name: 'AppDownloadPopUp',
  data() {
    return {
      deferredPrompt: null
    }
  },
  mounted() {
    // prevent default install banner from showing
    window.addEventListener('beforeinstallprompt', e => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e
    })
    this.displayPrompt()
  },
  methods: {
    displayPrompt() {}
  }
}
</script>
