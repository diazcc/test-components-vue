<template>
  <div :class="'tooltip-icon-container tooltip-icon-container--'+dataTooltipIcon?.color">
    <img :alt="dataTooltipIcon.alt" :src="dataTooltipIcon.src">
    <span class="tooltip ">{{ t(dataTooltipIcon.text) }}</span>
  </div>
</template>

<script setup lang="ts">

import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props: any = defineProps(['dataTooltipIcon'])

</script>

<style scoped src="./TooltipIcon.atom.scss"></style><!--Call the style in the same folder-->