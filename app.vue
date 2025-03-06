<template>
  <div id="app">
    <ClockInOut />
  </div>
</template>

<script setup>
import ClockInOut from './components/ClockInOut.vue';
import './assets/css/main.css'; // Import the Tailwind CSS file
</script>

<style>
/* Optional global styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>