import Prismic from 'prismic-javascript';

// eslint-disable-next-line no-unused-vars
export const getPageRoute = (page, allPages) => {
  const parents = [];

  const getPageParents = (uid, allPages, depth) => {
    // prevent circular parent hierarchy
    if (!parents.includes(uid)) {
      parents.push(uid);
      // // find parent object in query results
      const parent = allPages.find(item => item.uid === uid);
      // does parent have a parent?
      if (
        parent.type === 'page' &&
        Object.prototype.hasOwnProperty.call(parent.data.parent, 'uid') &&
        parent.data.parent.uid !== ''
      ) {
        // return recursive function
        return `${getPageParents(parent.data.parent.uid, allPages)}/${uid}`;
      }
      // if not, return uid
      return uid;
    }
    throw new Error(
      `Oops. Looks like there's a circular parent. Check ${uid}.`
    );
  };

  // does page have parent
  if (Object.prototype.hasOwnProperty.call(page.data.parent, 'uid')) {
    return `/${getPageParents(page.data.parent.uid, allPages)}/${page.uid}`;
  }
  // if no parent
  return `/${page.uid}`;
};

export const getPrismicRoutes = new Promise((resolve, reject) => {
  // get api
  resolve(
    Prismic.getApi(`https://${process.env.PRISMIC_REPO}.prismic.io/api/v2`)
  );
})
  .then(api => {
    // get query
    return new Promise((resolve, reject) => {
      resolve(api.query(''));
    });
  })
  .then(query => {
    // process query to get routes
    const routes = [];
    const pageTypes = ['post', 'page', 'team_member'];
    query.results
      .filter(page => {
        if (pageTypes.includes(page.type)) {
          return true;
        }
        return false;
      })
      .forEach(page => {
        // eslint-disable-next-line no-console
        // check if type is page
        if (page.type === 'page') {
          const pageRoute = `/${page.uid}`; // getPageRoute(page, query.results);
          routes.push({ [page.uid]: pageRoute });
        }
        if (page.type === 'case') {
          const pageRoute = `/practice/${page.uid}`;
          routes.push({ [page.uid]: pageRoute });
        }
        if (page.type === 'team_member') {
          const pageRoute = `/our-team/${page.uid}`;
          routes.push({ [page.uid]: pageRoute });
        }
      });
    routes.push({ preview: '/preview' });
    routes.push({ home: '/' });
    routes.push({ about: '/about' });
    routes.push({ practice: '/practice' });
    routes.push({ 'our-team': '/our-team' });
    routes.push({ contact: '/contact' });
    return routes;
  });

export default getPrismicRoutes;
