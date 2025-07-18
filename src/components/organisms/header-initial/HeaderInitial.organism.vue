<template>
  <header class="header-initial">
    <img src="/logos/docugate-ai-white.svg" alt="" class="header-initial__img" />
    <SelectLangMolecule />
  </header>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import SelectLangMolecule from "../../molecules/select-lang/SelectLang.molecule.vue";
const { t, locale } = useI18n();
</script>
<style scoped src="./HeaderInitial.organism.scss"></style>
