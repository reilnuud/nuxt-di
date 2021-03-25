// initialize
import Vue from 'vue';
/**
 * To learn more about Link Resolving check out the Prismic documentation
 */

const PrismicLink = link => {
  if (link && typeof link === 'string') {
    return link;
  }
  if (link && typeof link === 'object') {
    // flatten array into one object
    const routes = Object.assign({}, ...process.env.SITE_ROUTES);

    // handle internal link
    if (link.link_type && link.link_type === 'Document') {
      // return route or 404 if none
      return routes[link.uid] || '/404';
    }

    // return url or 404 if none
    return link.url || '/404';
  }
  return false;
};

Vue.prototype.$PrismicLink = doc => PrismicLink(doc);

export default PrismicLink;
