<template>
  <div class="w-full h-full">
    <section
      class="transition-slow w-full h-full flex flex-col relative z-0"
      :class="{
        'opacity-0': !mapLoaded
      }"
    >
      <div
        id="map"
        ref="map"
        class="transition h-full min-h-1/2-screen w-full"
      />
    </section>
    <!-- <div id="mapControls" ref="mapControls" /> -->
  </div>
</template>

<script>
export default {
  name: 'MapWidget',
  data() {
    return {
      // map instance
      map: null,
      // leaflet instance
      leaflet: null,
      // allow monitoring of zoomlevel more easily
      zoomLevel: 0,
      // whether or not the user has been located
      located: false,
      // whether or not the map has loaded yet
      mapLoaded: false,
      // current map view
      mapBounds: null,
      // whether or not to show warning
      showZoomWarning: false,
      tiles: {
        positron: {
          url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        },
        'toner-light': {
          url:
            'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
          attribution:
            'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
      }
    }
  },
  computed: {
    selectedTiles() {
      return this.tiles.positron
    },
    projectedBounds() {
      // probably can remove this, since coordinates in the database
      // but it can allow projecting of coordinates before passing them to api
      const app = this
      const bounds = app.mapBounds
      const sw = { x: bounds._southWest.lat, y: bounds._southWest.lng }
      const ne = { x: bounds._northEast.lat, y: bounds._northEast.lng }
      // sw = map.project([sw.x, sw.y])
      // ne = map.project([ne.x, ne.y])
      return [sw.x, sw.y, ne.x, ne.y]
    }
  },
  mounted() {
    /* eslint-disable no-unused-vars */
    // declare app for anonymous functions
    const app = this
    // only render map clientside
    // throws an error and doesn't work otherwise
    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client) {
      // create leaflet instance
      const L = require('leaflet')
      // pass leaflet instance to vue data
      this.leaflet = L
      // init map
      const map = L.map(this.$refs.map).setView([36.9741, -122.0308], 13)
      // get coordinates from IP address function
      // borrows heavily from leaflet-geoip
      // https://github.com/jakubdostal/leaflet-geoip
      L.GeoIP = L.extend({
        getPosition(ip) {
          // set url for geoip service
          // if this starts failing, check this url
          let url = 'https://freegeoip.app/json/'
          // result placeholder
          const result = L.latLng(0, 0)

          // handle no ip
          if (ip !== undefined) {
            url = url + ip
          } else {
            // lookup our own ip address
          }

          // send the api request
          const xhr = new XMLHttpRequest()
          xhr.open('GET', url, false)
          xhr.onload = function() {
            const status = xhr.status
            if (status === 200) {
              const geoipResponse = JSON.parse(xhr.responseText)
              result.lat = geoipResponse.latitude
              result.lng = geoipResponse.longitude
            } else {
              // TODO: do something else if it fails
            }
          }
          xhr.send()
          return result
        },
        // set map to retrieved coordinates
        centerMapOnPosition(map, zoom, ip) {
          const position = L.GeoIP.getPosition(ip)
          map.setView(position, zoom)
        }
      })

      // define icons

      // define user location icon
      const userLocation = L.divIcon({
        className:
          'w-4 rounded-full border-4 h-4 -ml-1 -mt-1 bg-green border-white',
        iconSize: null
      })

      // define toilet market
      this.toilet = app.leaflet.divIcon({
        className:
          'w-3 rounded-full border-3 h-3 -ml-1 -mt-1 bg-blue border-white',
        iconSize: null
      })

      // add tile layer to map (from wikimedia)
      L.tileLayer(app.selectedTiles.url, {
        attribution: app.selectedTiles.attribution,
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map)

      // get location from IP
      L.GeoIP.centerMapOnPosition(map, 11)

      // add marker
      // map.on('locationfound', function(e) {
      app.located = true
      app.mapLoaded = true
      //   const marker = L.marker(e.latlng, { icon: userLocation }).addTo(map)
      // })
      // get user location
      // map.locate({ setView: true, maxZoom: 16 })
      // set vue variable to map
      app.map = map
      // add stuff
      app.map.on('zoomend moveend', e => {
        app.map = map
        app.zoomLevel = app.map.getZoom()
        app.mapBounds = app.map.getBounds()
      })
      // map.dragging.disable()
      app.map.touchZoom.disable()
      app.map.doubleClickZoom.disable()
      app.map.scrollWheelZoom.disable()
      app.map.boxZoom.disable()
      // map.keyboard.disable()
      // if (map.tap) map.tap.disable()
      document.getElementById('map').style.cursor = 'default'
      /* eslint-enable no-unused-vars */
    }
  }
}
</script>
