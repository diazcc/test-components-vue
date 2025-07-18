<template>
  <section class="table-dependence">
    <nav class="table-dependence__nav-options">
      <MultiSelect :dataMultiSelect="dataTableDependence.dataMultiSelect" @onChange="applyFilters"/>
      <InputSearch :dataInputSearch="dataTableDependence.dataInputSearch" />
    </nav>
    <div class="table">
      <div class="table__row table--header">
        <div class="table__row__cell">{{ t('item') }}</div>
        <div class="table__row__cell">{{ t('code') }}</div>
        <div class="table__row__cell">{{ t('name') }}</div>
        <div class="table__row__cell">{{ t('parent_dependence') }}</div>
        <div class="table__row__cell">{{ t('state') }}</div>
        <div class="table__row__cell"
          v-if="hasPermissions.validator('update_dependences') || hasPermissions.validator('delete_dependences')">
          {{ t('actions') }}
        </div>
      </div>
      <div class="table__row table--only-row loading-component" v-if="dataTableDependence.stateLoadData">
        <div class="table__row__cell">{{ t('loading') }}</div>
      </div>
      <div class="table__row table--only-row" v-else-if="dataTableDependence.data.length < 1">
        <div class="table__row__cell"> {{ t('no_results_found') }}</div>
      </div>
      <div class="table__row" v-else v-for="(data, index) in dataTableDependence.data" :key="data.id">
        <div class="table__row__cell">{{ index+1 }}</div>
        <div class="table__row__cell">{{ data?.code }}</div>
        <div class="table__row__cell table__row__cell--left-align">
          <input type="text" name="name" :placeholder="data.name"
            :class="'input text-left input--' + (data?.editable ? 'form-blue-lighting' : 'read')" v-model="data.name" required>
        </div>
        <div class="table__row__cell table__row__cell--left-align">{{ data?.parent_dependency ? data?.parent_dependency.name : t('does_not_have') }}</div>
        <div class="table__row__cell">{{ data?.state ? t('active') : t('inactive') }}</div>
        <div class="table__row__cell table__row--img"
          v-if="hasPermissions.validator('update_dependences') || hasPermissions.validator('delete_dependences')">
          <TooltipIcon v-if="dataTableDependence.dataTooltipIcons[0].show(data)" :dataTooltipIcon="dataTableDependence.dataTooltipIcons[0]" @click="dataTableDependence.dataTooltipIcons[0].onClick({data: data, index: index})"/>
          <TooltipIcon v-if="dataTableDependence.dataTooltipIcons[1].show(data)" :dataTooltipIcon="dataTableDependence.dataTooltipIcons[1]" @click="dataTableDependence.dataTooltipIcons[1].onClick({data: data, index: index})"/>
          <TooltipIcon v-if="dataTableDependence.dataTooltipIcons[2].show(data)" :dataTooltipIcon="dataTableDependence.dataTooltipIcons[2]" @click="dataTableDependence.dataTooltipIcons[2].onClick({data: data, index: index})"/>
          <TooltipIcon v-if="dataTableDependence.dataTooltipIcons[3].show(data)" :dataTooltipIcon="dataTableDependence.dataTooltipIcons[3]" @click="dataTableDependence.dataTooltipIcons[3].onClick({data: data, index: index})"/>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">

// Import vue library
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';

// Import components
import InputSearch from "../../molecules/input-search/InputSearch.molecule.vue";
import MultiSelect from '../../atoms/multi-select/MultiSelect.atom.vue';
import TooltipIcon from "../../atoms/tooltip-icon/TooltipIcon.atom.vue";

// Import services
import hasPermissions from "../../../guards/hasPermissions.guard";

// Define props and emits and their types
const { t } = useI18n();
const router = useRouter();
const props = defineProps(["dataTableDependence"]);
const emits = defineEmits(['applyFilters']);

function applyFilters(selectedOptions: Array<{ value: any }>){
    emits("applyFilters", selectedOptions);
}

</script>

<style scoped src="./TableDependence.organism.scss"></style>