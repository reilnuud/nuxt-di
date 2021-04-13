import Vuex from 'vuex';

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      theme: { header: 'dark', footer: 'light' },
      navOpen: false
    }),
    mutations: {
      setTheme: (state, theme) => (state.theme = theme),
      setNavOpen: (state, navOpen) => (state.navOpen = navOpen)
    }
  });
};

export default createStore;
