<template>
  <div class="flex-grow w-full overflow-hidden bg-purple relative">
    <div
      ref="logomark"
      class="absolute opacity-0 transform translate-y-8 inset-0 p-12 sm:pt-20 pb-24 sm:pb-36 md:pb-40 z-10 flex"
    >
      <container class="flex-grow">
        <!-- TODO: fix mobile width -->
        <div class="md:px-12 relative h-full w-full">
          <logomark-outline class="block fill-white w-auto max-w-full h-full" />
        </div>
      </container>
    </div>
    <swiper
      ref="homeCarousel"
      :options="swiperOptions"
      class="w-full h-full min-h-screen flex-grow flex"
    >
      <swiper-slide v-for="slide in carousel" :key="slide.uid">
        <div class="relative min-h-screen pt-24 pb-12 flex flex-col items-end">
          <div class="absolute inset-0 z-0">
            <imgix :image="slide.image" fit-container :fade="false" />
          </div>
          <container
            class="flex flex-col justify-end flex-grow relative z-20"
            style="font-size:5vw;"
            data-swiper-parallax="-250"
          >
            <h2
              class="text-white tracking-1 font-bold text-2xl sm:text-inherit xl:text-4xl"
            >
              {{ slide.heading }}
            </h2>
          </container>
          <div
            class="opacity-50 bg-gradient-to-t from-purple to-transparent absolute bottom-0 right-0 left-0 h-64 z-10 transition duration-200"
          />
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import gsap from 'gsap';
export default {
  async asyncData({ $prismic, error }) {
    try {
      const res = await $prismic.api.getSingle('home_page');
      const document = res.data;
      delete res.data;
      return {
        ...res,
        document,
        slices: document.body,
        install: false,
        carousel: document.full_page_carousel.map(slide => {
          return {
            uid: slide.uid,
            heading: slide.heading,
            image: slide.image
          };
        }),
        title: document.title,
        meta: {
          title: document.meta_title,
          description: document.meta_description,
          image: document.meta_image
        }
      };
    } catch (e) {
      // error({ statusCode: 404, message: 'Page not found' })
      return {
        install: true
      };
    }
  },
  data() {
    return {
      install: false,
      swiperOptions: {
        fadeEffect: { crossFade: true },
        autoplay: {
          delay: 4000,
          disableOnInteraction: false
        },
        speed: 1000,
        slidersPerView: 1,
        effect: 'fade'
      }
    };
  },
  head() {
    return this.$processMeta(this.title, this.meta, this.$route.path);
  },
  mounted() {
    this.$store.commit('setTheme', { header: 'dark', footer: 'dark' });
    setTimeout(() => {
      gsap.to(this.$refs.logomark, { y: 0, opacity: 1, duration: 0.5 });
    }, 500);
  }
};
</script>

<style scoped>
.swiper-slide-duplicate-active {
  opacity: 1;
}
</style>
