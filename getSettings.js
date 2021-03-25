import Prismic from 'prismic-javascript';

const getGlobalSettings = new Promise((resolve, reject) => {
  // get api
  resolve(
    Prismic.getApi(`https://${process.env.PRISMIC_REPO}.prismic.io/api/v2`)
  );
})
  .then(api => {
    // get query
    return new Promise((resolve, reject) => {
      resolve(api.getSingle('global_settings'));
    });
  })
  .then(query => {
    return query.data;
  });

export default getGlobalSettings;
