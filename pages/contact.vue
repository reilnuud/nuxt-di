<template>
  <div
    class="flex-grow pt-48 bg-purple text-white w-full overflow-hidden relative"
  >
    <container class="py-12">
      <h1 class="font-light text-xl sm:text-2xl md:text-3xl">
        {{ heading }}
      </h1>
    </container>
    <div class="bg-gray py-12 text-black py-6">
      <container>
        <div class="flex flex-wrap -mx-6">
          <div class="w-full max-w-md mr-auto px-6 md:w-1/2">
            <prismic-rich-text
              class="leading-normal rich-text"
              :richtext="description"
            />
          </div>
          <div
            class="w-full px-6 md:w-1/2"
            :class="{ 'pointer-events-none animate-pulse': submitting }"
          >
            <!-- todo thank you page -->
            <div
              v-if="error"
              class="italic border border mt-6 -mb-3 p-3 border-purple"
            >
              {{ error }}
            </div>
            <form
              v-if="!submitted"
              ref="form"
              class="mt-6 md:mt-0"
              @submit="handleSubmit"
            >
              <div class="-mx-2 flex flex-wrap">
                <div class="px-2 w-full mb-1">Name</div>
                <div class="px-2 w-full sm:w-1/2 flex flex-col mb-4">
                  <input
                    name="First Name"
                    type="text"
                    required
                    class="order-1 px-2 py-1"
                  />
                  <label class="order-2 mt-1 text-xs ">First</label>
                </div>
                <div class="px-2 w-full sm:w-1/2 flex flex-col mb-4">
                  <input
                    name="Last Name"
                    type="text"
                    required
                    class="order-1 px-2 py-1"
                  />
                  <label class="order-2 mt-1 text-xs ">Last</label>
                </div>
              </div>
              <div class="flex flex-col md:-mt-2 mb-4">
                <input
                  name="Email"
                  type="email"
                  required
                  class="order-2 px-2 py-1"
                />
                <label class="order-1 mb-1">Email</label>
              </div>
              <div class="flex flex-col mb-4">
                <textarea
                  required
                  name="Message"
                  class="order-2 px-2 py-1"
                  style="min-height:120px;"
                />
                <label class="order-1 mb-1">Message</label>
              </div>
              <div class="mt-6">
                <btn color="black" type="submit">Send</btn>
              </div>
            </form>
            <div v-else class="mt-6">
              Thank you for contacting us. We will get back to you shortly.
            </div>
          </div>
        </div>
        <!-- stuff -->
      </container>
    </div>
  </div>
</template>

<script>
// import gsap from 'gsap';
export default {
  async asyncData({ $prismic, error }) {
    try {
      const res = await $prismic.api.getSingle('contact');
      const document = res.data;
      delete res.data;
      return {
        ...res,
        document,
        heading: document.heading,
        description: document.description,
        title: document.title,
        meta: {
          title: document.meta_title,
          description: document.meta_description,
          image: document.meta_image
        }
      };
    } catch (e) {
      error({ statusCode: 404, message: 'Page not found' });
    }
  },
  data() {
    return {
      error: false,
      submitted: false,
      submitting: false
    };
  },
  mounted() {
    this.$store.commit('setTheme', { header: 'dark', footer: 'light' });
  },
  methods: {
    encode(data) {
      return Object.keys(data)
        .map(
          key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
        )
        .join('&');
    },
    handleSubmit(e) {
      e.preventDefault();
      const _this = this;
      this.submitting = true;
      const myForm = this.$refs.form;
      const formData = new FormData(myForm);
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.encode({ 'form-name': 'contact', ...formData })
      })
        .then(() => {
          _this.submitted = true;
          _this.error = false;
          this.submitting = false;
        })
        .catch(error => {
          this.submitting = true;

          _this.error =
            'There was an error with your submission. Please make sure all fields are completed and try again.';
          // eslint-disable-next-line no-console
          console.log(error);
        });
    },
    head() {
      return this.$processMeta(this.title, this.meta, this.$route.path);
    }
  }
};
</script>
