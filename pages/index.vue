<template>
  <div class="flex-grow w-full overflow-hidden bg-purple relative">
    <div
      ref="logomark"
      class="absolute opacity-0 transform translate-y-8 inset-0 lg:px-12 pr-12 py-24 sm:py-36 lg:py-48 z-10 flex"
    >
      <container class="flex-grow">
        <logomark-outline class="block fill-white w-auto max-w-full h-full" />
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
            <imgix v-if="slide.image.url" :image="slide.image" fit-container />
          </div>
          <container
            class="flex flex-col justify-end flex-grow relative z-10"
            style="font-size:8vw;"
          >
            <h2 class="text-white tracking-1 font-bold xl:text-6xl">
              {{ slide.heading }}
            </h2>
          </container>
        </div>
      </swiper-slide>
    </swiper>
    <div
      class="opacity-50 bg-gradient-to-t from-purple to-transparent absolute bottom-0 right-0 left-0 h-64 z-0 transition duration-200"
    />
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
        })
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
        autoplay: {
          delay: 5000
        },
        keyboard: {
          enabled: true,
          onlyInViewport: false
        }
      }
    };
  },
  computed: {
    swiper() {
      return this.$refs.homeCarousel.$swiper;
    }
  },
  mounted() {
    setTimeout(() => {
      gsap.to(this.$refs.logomark, { y: 0, opacity: 1, duration: 0.5 });
    }, 500);
  }
};
</script>
