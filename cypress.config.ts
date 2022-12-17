import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents (on, config) {
      config.baseUrl = 'https://aukro.cz'
      config.video = false
      config.viewportHeight = 1080
      config.viewportWidth = 1400

      return config
    }
  }
})
