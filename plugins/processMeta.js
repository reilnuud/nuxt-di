import Vue from 'vue';

const globalSettings = process.env.SITE_SETTINGS;

const buildURL = (url, params) => {
  const paramsURI = Object.keys(params)
    .map(key => key + '=' + params[key])
    .join('&');
  return `${url}?${paramsURI}`;
};

const processMetaImage = url => {
  const imgUrl = url || globalSettings.default_meta_image.url;
  // set default params
  const defaultParams = {
    auto: 'format,compress',
    fit: 'crop',
    crop: 'faces,edges,entropy'
  };

  let urlParams;

  // get just image's existing url params
  imgUrl
    .split('?')[1]
    .split('&')
    .forEach(string => {
      const splitString = string.split('=');
      urlParams = {
        ...urlParams,
        ...{ [splitString[0]]: splitString[1] }
      };
    });

  // setup params
  let params = { ...defaultParams };

  // add rectangle crop from prismic
  if (urlParams.rect) {
    params = { ...params, ...{ rect: urlParams.rect } };
  }

  // add duotone
  params = {
    ...params,
    ...{
      auto: 'format,compress,enhance'
      // con: '25',
      // exp: '-3',
      // high: '-25',
      // shadow: '5',
      // // slightly lighter duotone
      // duotone: 'EC1F27,F2A5AB'
    }
  };

  // get just the image part of the url
  const parsedUrl = imgUrl.split('?')[0];

  // create srcs
  const imgixUrl = buildURL(parsedUrl, {
    ...params,
    w: 1200,
    h: 900
  });

  // return the srcset object
  return imgixUrl;
};

Vue.prototype.$processMeta = (_title, meta, _path = '/') => {
  const path = _path.substr(_path.length - 1) !== '/' ? _path + '/' : _path;
  const metaImageUrl = processMetaImage(meta.image.url);
  const title =
    meta.title && meta.title.length > 1
      ? meta.title
      : `${_title} ${globalSettings.title_separator} ${globalSettings.site_name}`;
  return {
    title,
    meta: [
      // hid is used as unique identifier. Do not use `vmid` for it as it will not work
      { hid: 'title', name: 'title', content: meta.title },
      {
        hid: 'description',
        name: 'description',
        content: meta.description
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: title
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: globalSettings.site_name
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: meta.description
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: metaImageUrl
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: process.env.SITE_URL + path
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website'
      },
      {
        hid: 'fb:app_id',
        property: 'fb:app_id',
        content: process.env.FB_APP_ID
      },
      {
        hid: 'twitter:title',
        property: 'twitter:title',
        content: title
      },

      {
        hid: 'twitter:description',
        property: 'twitter:description',
        content: meta.description
      },
      {
        hid: 'twitter:image',
        property: 'twitter:image',
        content: metaImageUrl
      },
      {
        hid: 'twitter:card',
        property: 'twitter:card',
        content: 'summary_large_image'
      }
    ]
  };
};
