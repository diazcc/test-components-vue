<template>
  <article class="template-table-view">
    <section class="template-table-view__content">
      <header class="template-table-view__header">
        <h1 class="template-table-view__header__title">
          {{ t("Resultados similares") }}
        </h1>
      </header>
      <section class="template-table-view__list">
        <nav class="template-table-view__list__nav">
          <!-- <MultiSelect
            :dataMultiSelect="dataGeneralSearch.dataMultiSelect"
            @onChange="applyFilters"
          /> -->
        </nav>
        <table class="table">
          <thead class="table__row table--header">
            <th class="table__row__cell">{{ t("item") }}</th>
            <th class="table__row__cell">{{ t("code") }}</th>
            <th class="table__row__cell">{{ t("subject") }}</th>
            <th class="table__row__cell">{{ t("date") }}</th>
            <th class="table__row__cell">{{ t("state") }}</th>
            <th class="table__row__cell">{{ t("action") }}</th>
          </thead>
          <tbody class="table__row table--only-row loading-component" v-if="dataGeneralSearch?.stateLoadData">
            <td class="table__row__cell">{{ t("loading") }}</td>
          </tbody>
          <tbody class="table__row table--only-row" v-else-if="dataGeneralSearch.data.length < 1">
            <td class="table__row__cell">{{ t("no_results_found") }}</td>
          </tbody>
          <tbody class="table__row" v-else v-for="(data, index) in dataGeneralSearch.data"
            @click="dataGeneralSearch.getFile(data)"
          >
            <td class="table__row__cell">{{ index+1 }}</td>
            <td class="table__row__cell">{{ data.code  }}</td>
            <td class="table__row__cell">{{ data.subject }}</td>
            <td class="table__row__cell">{{ data.date }}</td>
            <td class="table__row__cell">{{ data.status }}</td>
            <td class="table__row__cell">{{ data.code }}</td>
          </tbody>
        </table>
      </section>
      <Paginator :dataPaginator="dataGeneralSearch.dataPaginator" />
    </section>
  </article>
</template>
<script setup lang="ts">

import UtilsServices from "../../../services/UtilsServices";
import Paginator from '../../molecules/paginator/Paginator.molecule.vue';
import { useI18n } from "vue-i18n";
const { t, te } = useI18n();

const props: any = defineProps(["dataGeneralSearch"]);
function getFirstAvailableKey(item: any, keys: string[], fallbackKey: string) {
  for (const key of keys) {
      if (item.hasOwnProperty(key)) {
          return item[key];
      }
  }
  return item.hasOwnProperty(fallbackKey) ? item[fallbackKey] : 'No key found';
}
</script>
<style scoped src="./GeneralSearch.template.scss"></style>
