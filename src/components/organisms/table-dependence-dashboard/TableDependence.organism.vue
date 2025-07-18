<template>

  <section class="table-dependence-received">
    <nav class="table-dependence-received__nav-options">
      <select v-model="selectedFilter" class="table-dependence-received__nav-options__select">
        <option value="" selected disabled>{{ t('quick_actions') }}</option>
        <option value="all">{{ t('all') }}</option>
        <option value="finaliced">{{ t('status_completed') }}</option>
        <option value="process">{{ t('status_in_process') }}</option>
        <option value="radicated">{{ t('status_filing') }}</option>
      </select>

      <InputSearch :dataInputSearch="dataTableCorrespondenceReceived.dataInputSearch" />
    </nav>
    <div class="flex-table">
      <div class="flex-table__header">
        <div class="flex-table__header__cell">{{ t('code') }}</div>
        <div class="flex-table__header__cell">{{ t('name') }}</div>
        <div class="flex-table__header__cell">{{ t('parent_dependence') }}</div>
        <div class="flex-table__header__cell">{{ t('state') }}</div>

      </div>
      <div class="flex-table__row " v-if="dataTableCorrespondenceReceived.data.length < 1">
        <div class="flex-table__row__cell loading-component"></div>
        <div class="flex-table__row__cell loading-component"></div>
        <div class="flex-table__row__cell loading-component"></div>
        <div class="flex-table__row__cell loading-component"></div>
      </div>
      <div v-else class="flex-table__row" v-for="(data, index) in searchedData" :key="index"
        @click="validateMenuOpen(data)">
        <div class="flex-table__row__cell">{{ data?.code }}</div>
        <div class="flex-table__row__cell">{{ data?.name }}</div>
        <div class="flex-table__row__cell"> {{ data?.parent_dependency ? data.parent_dependency.name : 'N/A' }}</div>
        <div class="flex-table__row__cell">{{ data?.state ? t('active') : t('inactive') }}</div>

      </div>

    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import IconVerSvg from "../../../assets/svg/icon-ver.svg.vue";
import InputSearch from "../../molecules/input-search/InputSearch.molecule.vue";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const router = useRouter();

const props = defineProps(["dataTableCorrespondenceReceived"]);
const emits = defineEmits(["codeFiling"]); //Emit the event when all pages are rendered.
const selectedFilter = ref("");
// Método para filtrar por estado
const filteredData = computed(() => {
  if (!selectedFilter.value || selectedFilter.value == "all") {
    return props.dataTableCorrespondenceReceived.data;
  } else {
    return props.dataTableCorrespondenceReceived.data.filter((item: any) => {
      if (selectedFilter.value === "finaliced") {
        return item.state === "finaliced";
      } else if (selectedFilter.value === "process") {
        return item.state === "process";
      } else if (selectedFilter.value === "radicated") {
        return item.state === "radicated";
      } else if (selectedFilter.value === "rdPerson") {
        return (
          item.remitter !== null &&
          item.remitter.person_type.label === "Radicacion persona"
        );
      } else if (selectedFilter.value === "Radicación anónimo") {
        return item.type_of_filing?.label === "Radicación anónimo";
      }
      return false; // Si no coincide con ninguna opción, no se filtra nada
    });
  }
});

// Método para buscar por término
const searchedData = computed(() => {
  if (!props.dataTableCorrespondenceReceived.dataInputSearch.dataInput.model) {
    return filteredData.value;
  } else {
    return filteredData.value.filter(
      (item: any) =>
        item.subject
          .toLowerCase()
          .includes(
            props.dataTableCorrespondenceReceived.dataInputSearch.dataInput.model.toLowerCase()
          ) ||
        item.filing_code.includes(
          props.dataTableCorrespondenceReceived.dataInputSearch.dataInput.model.toLowerCase()
        ) ||
        (item.remitter &&
          item.remitter.contact_name &&
          item.remitter.contact_name
            .toLowerCase()
            .includes(
              props.dataTableCorrespondenceReceived.dataInputSearch.dataInput.model.toLowerCase()
            )) ||
        (item.remitter &&
          item.remitter.first_name &&
          item.remitter.first_name
            .toLowerCase()
            .includes(
              props.dataTableCorrespondenceReceived.dataInputSearch.dataInput.model.toLowerCase()
            )) ||
        (item.remitter &&
          item.remitter.second_last_name &&
          item.remitter.second_last_name
            .toLowerCase()
            .includes(
              props.dataTableCorrespondenceReceived.dataInputSearch.dataInput.model.toLowerCase()
            )) ||
        (item.remitter &&
          item.remitter.middle_name &&
          item.remitter.middle_name
            .toLowerCase()
            .includes(
              props.dataTableCorrespondenceReceived.dataInputSearch.dataInput.model.toLowerCase()
            )) ||
        (item.email &&
          item.email
            .toLowerCase()
            .includes(
              props.dataTableCorrespondenceReceived.dataInputSearch.dataInput.model.toLowerCase()
            )) ||
        item.filing_date.includes(
          props.dataTableCorrespondenceReceived.dataInputSearch.dataInput.model.toLowerCase()
        ) ||
        (item.document &&
          item.document.name
            .toLowerCase()
            .includes(
              props.dataTableCorrespondenceReceived.dataInputSearch.dataInput.model.toLowerCase()
            )) ||
        (item.state &&
          item.state
            .toLowerCase()
            .includes(
              props.dataTableCorrespondenceReceived.dataInputSearch.dataInput.model.toLowerCase()
            ))
    );
  }
});
function validateMenuOpen(data: any) {
  if (!data.isMenuOpen) {
    props.dataTableCorrespondenceReceived.openRadicated();
    router.push("/home/radicated/" + data.filings[0].filing_code);
  }
}
</script>
<style scoped src="./TableDependence.organism.scss"></style>