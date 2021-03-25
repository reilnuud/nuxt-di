<template>
  <div class="flex flex-col flex-shrink-0">
    <hero />
    <article>
      <div class="h-2px w-full bg-grey max-w-md mt-6 mx-auto" />
      <section class="mx-auto">
        <container variant="copy" class="p-6 bg-grey-100">
          <div class="py-8 px-6 md:px-12">
            <h3
              class="uppercase tracking-1 font-semibold text-xl mb-6 text-grey-900"
            >
              UI Components
            </h3>
            <div class="my-6">
              <btn color="blue">Regular Button</btn>
            </div>
            <div class="my-6">
              <btn-sm color="black">Small Button</btn-sm>
            </div>
            <div class="my-6">
              <input-field
                v-model="textFieldtest"
                :placeholder="'placeholder'"
                :type="'text'"
                :label="'label'"
                :value="'12345'"
                :description="
                  'These are some extra details about the above item'
                "
              />
            </div>
            <!-- 
          input radio group is required for radio buttons,
          otherwise, vue cannot properly link radio buttons
        -->
            <div class="my-6 flex flex-wrap -mx-4" :name="'test_name'">
              <input-radio
                v-model="radioTest"
                class="px-4"
                :label="'Radio 1'"
                :value="'1'"
                :name="'radioTest'"
              />
              <input-radio
                v-model="radioTest"
                class="px-4"
                :label="'Radio 2'"
                :value="'2'"
                :name="'radioTest'"
              />
            </div>
            <div class="my-6">
              <input-checkbox
                v-model="checkBoxTest"
                :label="'label'"
                :value="'12345'"
                :name="'checkBoxTest'"
              />
            </div>
          </div>
        </container>
      </section>
      <div class="h-2px w-full bg-grey-light max-w-md mt-6 mx-auto" />
      <section>
        <container variant="copy" class="leading-normal">
          <div class="rich-text py-8 px-6 md:px-12">
            <h3 class="uppercase font-normal mb-12 text-grey-dark">
              Typography
            </h3>
            <h1 class="mb-6">
              Headline One
            </h1>
            <h2 class="mb-6">
              Headline Two
            </h2>
            <h3 class="mb-6">
              Headline Three
            </h3>
            <h4 class="mb-6">
              Headline Four
            </h4>
            <p class="leading-normal text-black text-xl mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque sapien nulla, luctus semper mauris in, sollicitudin
              malesuada nulla. Nullam ut leo nisl. Nunc tempor massa at leo
              tincidunt congue.
            </p>
            <p class="leading-normal text-grey-darkest mb-6">
              Vivamus elementum lacus a mi semper elementum sed quis lectus.
              Proin imperdiet sagittis quam eget accumsan. Cras quis suscipit
              velit, eu consequat sapien. Suspendisse sapien metus, ultrices
              eget blandit ut, varius ornare leo. Suspendisse magna nisi,
              fringilla eget ultrices quis, vulputate ut sem. Proin sed maximus
              purus. Sed sagittis tincidunt nunc eu dapibus.
            </p>
            <p class="leading-normal text-grey-darkest mb-6">
              Nam velit arcu, scelerisque eget hendrerit vitae, placerat sit
              amet turpis. Aenean elit urna, viverra et urna et, sagittis
              pulvinar velit. Nulla facilisi. Integer dapibus dolor eu ex
              tristique, consectetur ullamcorper sem porttitor. Nunc egestas leo
              nec magna tincidunt euismod. Suspendisse enim ligula, mollis id
              euismod eget, sagittis ut velit. Quisque blandit velit id nulla
              gravida convallis. Praesent interdum dapibus accumsan. Mauris
              libero augue, semper et aliquet eu, euismod eu orci. Maecenas
              aliquet, lorem sed scelerisque tempus, nulla magna fringilla
              dolor, id blandit velit leo at velit.
            </p>
            <blockquote
              class="font-sans text-3xl text-black leading-tight my-6 mx-8 md:mx-12 lg:mx-16 mt-10"
            >
              <p>
                "We must do away with the absolutely specious notion that
                everybody has to earn a living."
              </p>
              <cite
                class="block mt-2 mx-4 text-right text-grey font-serif text-sm tracking-1 uppercase italic"
              >
                – Buckminister Fuller
              </cite>
            </blockquote>
            <p class="leading-normal text-grey-darkest mb-6">
              Nulla venenatis mi vitae pulvinar bibendum. Vivamus lacinia sed
              turpis a suscipit. Donec at lorem placerat, pretium lectus at,
              fermentum risus. Etiam turpis orci, cursus non dui eget, varius
              maximus diam. Integer hendrerit aliquam pharetra. Quisque
              fermentum interdum fermentum. Proin tincidunt magna ex, sed
              maximus eros tincidunt vitae. Duis turpis risus, viverra vitae
              tristique sed, maximus nec ex. Donec faucibus, urna in vestibulum
              eleifend, nibh neque ultricies ipsum, et rhoncus velit ex sed
              elit. Curabitur sed sem vel lectus pretium lacinia sed ac eros.
              Sed suscipit ex pharetra efficitur sagittis. Curabitur ipsum
              nulla, congue vitae aliquet et, vehicula dapibus erat. Donec a
              urna viverra lorem tempus dapibus sed in dui. Aenean rutrum
              rhoncus metus, in rutrum eros dictum ut. Nam laoreet nulla vitae
              dignissim pharetra.
            </p>
            <p class="leading-normal text-grey-darkest mb-6">
              Nam imperdiet ex laoreet quam tempor scelerisque. Aliquam vitae
              justo ac est efficitur posuere. Aliquam lobortis libero ex, in
              imperdiet sem imperdiet id. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. In porttitor eu nisi pellentesque
              sagittis. Suspendisse sed nisi at justo sagittis rutrum. Phasellus
              mattis neque in diam tempus fermentum. Morbi nec finibus felis.
            </p>
            <p class="leading-normal text-grey-darkest mb-6">
              Nulla id nibh iaculis, cursus nisi nec, vestibulum quam.
              Vestibulum ac quam orci. Duis erat quam, venenatis ac est at,
              sagittis eleifend lorem. Proin erat diam, ornare a molestie sed,
              pharetra vitae diam. Duis vehicula magna id maximus faucibus. Nunc
              a dapibus mi. Vestibulum maximus lacus in quam ullamcorper porta.
              Sed nisl magna, malesuada a dignissim et, laoreet blandit turpis.
              Ut varius orci leo, non commodo felis pharetra eget. Nulla commodo
              ultrices tellus, ut mollis nisi pretium nec. Nullam quis massa
              orci. Phasellus sit amet turpis id risus rutrum porta vitae quis
              velit. Nam faucibus quis magna ac elementum. Nunc tincidunt
              pharetra commodo. Duis quam elit, accumsan vel ante ac, fringilla
              efficitur metus.
            </p>
            <h3 class="uppercase font-normal mb-12 text-grey-400">
              Colors
            </h3>
            <div>
              <div v-for="(color, name) in colors" :key="name" class="mb-6">
                <h4 class="font-semibold text-xs uppercase tracking-1 my-6">
                  {{ name }}
                </h4>
                <div class="flex -mx-1">
                  <div
                    v-for="(variant, variantName) in color"
                    :key="name + variantName"
                    class="px-1 w-full h-16"
                  >
                    <div
                      v-if="variantName !== 'default'"
                      class="h-full w-full"
                      :class="`bg-${name}-${variantName}`"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </container>
        <leaflet-map class="border-t-2 border-black border-b-2 border-black" />
      </section>
    </article>
  </div>
</template>

<script>
//
import home from '~/apollo/queries/home'

// eslint-disable-next-line no-unused-vars
const { theme } = process.env.TAILWIND

// eslint-disable-next-line no-unused-vars
const removeDefault = colorVariant => {
  const filteredVariant = {}
  Object.keys(colorVariant).map(key => {
    if (key !== 'default') {
      filteredVariant[key] = colorVariant[key]
    }
  })
  return filteredVariant
}

export default {
  // figure this out
  apollo: {
    home
  },
  data() {
    return {
      radioTest: '',
      checkBoxTest: false,
      textFieldtest: ''
    }
  },
  computed: {
    // getNotificationPermission() {
    //   Notification.permission
    // },
    // sendSampleNotification() {},
    colors() {
      const colorSamples = {}
      Object.keys(theme.extend.colors).map(color => {
        colorSamples[color] = removeDefault(theme.extend.colors[color])
      })
      return colorSamples
      // return {}
    }
  },
  mounted() {
    console.log(Notification)
    console.log(Notification.permission)
    if (
      Notification.permission !== 'denied' &&
      Notification.permission !== 'granted'
    ) {
      Notification.requestPermission()
      // eslint-disable-next-line no-unused-vars
      this.showNotification('Test Notification', 'Copy')
    } else {
      // eslint-disable-next-line no-unused-vars
      this.showNotification('Test Notification', 'Copy')
    }
  },
  methods: {
    showNotification(heading, copy) {
      // eslint-disable-next-line no-new
      new Notification(`${heading}:${copy}`)
    }
  }
}
</script>
