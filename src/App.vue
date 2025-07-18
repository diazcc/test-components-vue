<template>
  <div id="app">
    <router-view></router-view>
  </div>  
</template>

<script setup>

import axios from 'axios';
import { accessStore } from './store/index.ts'; // Importa el store como un export nombrado
import LoginService from './services/testService'; // Importa el servicio de inicio de sesió
import constants from '/src/constants/index.js'

const store = accessStore();

store.initializeStore();

const access = store.access;

if(access) {
  axios.defaults.headers.common['Authorization'] = 'JWT ' + access
} else {
  axios.defaults.headers.common['Authorization'] = ''
}

clearInterval()

setInterval(() => { LoginService.getAccess() }, constants['REFRESH_TOKEN_INTERVAL_MS'])

</script>

<style scoped></style>
