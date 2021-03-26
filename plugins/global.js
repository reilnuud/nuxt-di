// initialize
import Vue from 'vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';

// debouncing & component loading
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

// import style (>= Swiper 6.x)
import 'swiper/swiper-bundle.css';

Vue.use(VueAwesomeSwiper);

Vue.config.productionTip = false;
Vue.config.performance = true;

/* 

* Sync Load

  Good for smaller components needed for SSR.

*/

// load all components
const requireComponent = require.context(
  // which directory?
  '@/components/static/',
  // look in subdirectories?
  true,
  // which files?
  /[\w-]+\.vue$/
);

// For each matching file name...
requireComponent.keys().forEach(fileName => {
  // Get the component config
  // const fileNameOnly = fileName.split('/').pop()
  const componentConfig = requireComponent(fileName);
  // Get the PascalCase version of the component name
  const componentName = upperFirst(
    camelCase(
      fileName
        .replace(/^\.\/(.*)\.\w+$/, '$1')
        .split('/')
        .pop()
    )
  );
  // Globally register the component
  Vue.component(componentName, componentConfig.default || componentConfig);
});

/* 

* Async Load

  Good for larger, more interactive components.

*/

// load all components
const dynamicRequireComponent = require.context(
  // which directory?
  '@/components/dynamic/',
  // look in subdirectories?
  true,
  // which files?
  /[\w-]+\.vue$/,
  'lazy'
);

// For each matching file name...
dynamicRequireComponent.keys().forEach(fileName => {
  // Get the component config
  // // const fileNameOnly = fileName.split('/').pop()
  // const dynamicComponentConfig = requireComponent(fileName)
  // // Get the PascalCase version of the component name
  const dynamicComponentName = upperFirst(
    camelCase(
      fileName
        .replace(/^\.\/(.*)\.\w+$/, '$1')
        .split('/')
        .pop()
    )
  );
  // Globally register the component
  Vue.component(dynamicComponentName, () => dynamicRequireComponent(fileName));
});
