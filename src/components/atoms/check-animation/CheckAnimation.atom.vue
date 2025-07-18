<template>
    <div :class="'success-checkmark success-checkmark--'+isActive" ref="checkmark">
      <div class="check-icon" v-show="showCheckIcon">
        <span class="icon-line line-tip"></span>
        <span class="icon-line line-long"></span>
        <div class="icon-circle"></div>
        <div class="icon-fix"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const showCheckIcon = ref(true);
defineProps(['isActive']);
  
  onMounted(() => {
      showCheckIcon.value = false;
      setTimeout(() => {
        showCheckIcon.value = true;
      }, 10);
  });
  </script>
  
  <style scoped src="./CheckAnimation.atom.scss"></style>
  