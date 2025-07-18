<template>
  <ol
    :class="'select-lang select-lang--' + (stateMenu ? 'active' : '')"
    ref="selectLangContainer"
  >
    <li
      :class="
        'select-lang__header select-lang__header--' +
        (stateMenu ? 'active' : '')
      "
      @click="openMenu"
    >
      <img :src="optionSelected.urlImg" alt="" class="icon" />
      <p>{{ optionSelected.name }}</p>
    </li>
    <ul
      :class="
        'select-lang__list select-lang__list--' + (stateMenu ? 'active' : '')
      "
    >
      <li
        class="select-lang__list__card"
        v-for="(option, index) in filteredOptionsLang"
        :key="index"
        @click="selectLanguage(option)"
      >
        <img :src="option.urlImg" alt="" class="select-lang__list__card__img" />
        <p>{{ option.name }}</p>
      </li>
    </ul>
  </ol>
</template>

<script setup lang="ts">

import { ref, onMounted, onUnmounted, computed, Ref } from "vue";
import { useI18n } from 'vue-i18n';
import { languageStore } from "../../../store/language";

const { locale, t } = useI18n();
const langStore = languageStore();

const stateMenu = ref(false);
const optionSelected: Ref<any> = ref({ name: '', urlImg: '' });

const optionsLang = ref([
  { urlImg: "/Buttons/icon-usa-flag.svg", name: "USA (EEUU)", code: 'en' },
  { urlImg: "/Buttons/icon-colombian-flag.svg", name: "Colombia (ES)", code: 'es' },
  { urlImg: "/Buttons/icon-mex-flag.png", name: "México (ES)", code: 'es_me' },
]);

const selectLangContainer = ref<HTMLElement | null>(null);

function openMenu() {
  stateMenu.value = !stateMenu.value;
}

function handleClickOutside(event: MouseEvent) {
  if (
    selectLangContainer.value &&
    !selectLangContainer.value.contains(event.target as Node)
  ) {
    stateMenu.value = false;
  }
}

function selectLanguage(option: any) {
  optionSelected.value = option;
  locale.value = option.code; // Cambia el idioma usando vue-i18n
  langStore.setLocale(option.code);
  stateMenu.value = false; // Cierra el menú después de seleccionar
}

// Computed property to filter out the selected option
const filteredOptionsLang = computed(() =>
  optionsLang.value.filter(option => option.name !== optionSelected.value.name)
);

onMounted(() => {
  // Inicializamos el idioma seleccionado
  const defaultLang = optionsLang.value.find(option => option.code === locale.value);
  if (defaultLang) optionSelected.value = defaultLang;
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped src="./SelectLang.molecule.scss"></style>
