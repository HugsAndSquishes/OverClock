// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'], // Add your CSS file here
  postcss: {
    plugins: {
      tailwindcss: {}, // Tailwind CSS plugin
      autoprefixer: {}, // Autoprefixer plugin
    },
  },
});