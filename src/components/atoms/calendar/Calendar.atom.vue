<!-- 
  TODO
  This component must be improved

docu: https://vcalendar.io/
uninstall with : npm uninstall v-calendar


-->

<template>
    <Calendar title-position="left" :columns="columns" trim-weeks borderless transparent expanded view="monthly" />
</template>


<script setup lang="ts">
import { ref } from 'vue';

import { Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';


import { useScreens } from 'vue-screen-utils';

useScreens(
  // Order from smallest to largest
  {
    xs: '0px', // (min-width: 0px)
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  }
  // {
  //   injectKey: $sq, (Optional custom inject key)
  // }
);
// const selectedColor = ref('blue');
const { mapCurrent } = useScreens({ xs: '0px', sm: '640px', md: '768px', lg: '1024px' });
const columns = mapCurrent({ lg: 1 }, 1);
let selectedDate: null;


</script>

<style scoped src="./Calendar.atom.scss"></style>
