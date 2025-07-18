<template>
    <div :class="'pulse pulse--'+status"></div>
</template>
  
<script setup>

const props = defineProps(['status']);

</script>
  
<style scoped src="./DotIcon.atom.scss"></style>