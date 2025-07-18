<template>
  <li :class="'card-notifications card-notifications--'+(dataCardNotifications.isActive? 'focused':'')" @click="dataCardNotifications.onClick" ref="liRef">
    <Text v-if="dataCardNotifications.dataText.text" :dataText="dataCardNotifications.dataText"/>
    <Img :dataImg="dataCardNotifications.dataImg"/>
  </li>
</template>

<script setup lang="ts">

import { defineProps, onMounted, onUnmounted,ref } from 'vue';
import Text from '../../atoms/text/Text.atom.vue';
import Img from '../../atoms/img/Img.atom.vue';

const  prop = defineProps(['dataCardNotifications']);
const liRef = ref<HTMLElement | null>(null);

// Function to handle clicks outside the li and outside the specified element
const handleClickOutside = (event: MouseEvent) => {
  const clickedElement = event.target as HTMLElement;

  // Check if the clicked element is outside the li or outside the specified element
  if (
    (liRef.value && !liRef.value.contains(clickedElement)) &&
    (!clickedElement.classList.contains('card-notifications') && !clickedElement.closest('.card-notifications'))
  ) {
    // Click occurred outside the li and outside the specified element
    // Here you can perform any action needed
    prop.dataCardNotifications.isActive = false;
  }
};

// Add event listener when the component is mounted
onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

// Remove event listener when the component is unmounted to prevent memory leaks
onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});

</script>

<style scoped src="./CardNotifications.molecule.scss"></style>
