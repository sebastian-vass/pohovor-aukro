import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents (on, config) {
      config.baseUrl = 'https://aukro.cz'
      config.video = false
      config.viewportHeight = 1080
      config.viewportWidth = 1920

      /*
      Hide all XHR and fetch calls.
      It is always necessary to close the current test window when making a change.
      */
      config.env = {
        hideCalls: true
      }

      return config
    }
  }
})
