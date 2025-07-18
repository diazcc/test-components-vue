<template>
  <section class="table-correspondence-dashboard-content">
    <table class="table">
      <thead class="table__row table--header">
        <th class="table__row__cell">{{ t('item') }}</th>
        <th class="table__row__cell">{{ t('subject') }}</th>
        <th class="table__row__cell">{{ t('remitter') }}</th>
        <th class="table__row__cell">{{ t('state') }}</th>
      </thead>
      <tbody class="table__row table--only-row loading-component" v-if="dataTableCorrespondenceDashboard.stateLoadData">
        <td class=" table__row__cell">{{ t('loading') }}</td>
      </tbody>
      <tbody class="table__row table--only-row" v-else-if="dataTableCorrespondenceDashboard.data.lists.length < 1">
        <td class=" table__row__cell">{{ t('no_results_found') }}</td>
      </tbody>
      <tbody v-else class=" table__row" v-for="(element, index) in dataTableCorrespondenceDashboard.data.lists"
        :key="element.id" @click="redirectToRecord(element.id)">
        <td class="table__row__cell">{{ index + 1 }}</td>
        <td class="table__row__cell table__row__cell--left-align">{{ element?.subject }}</td>
        <td class="table__row__cell table__row__cell--left-align">{{ te(element?.remitter) ? t(element?.remitter) : element?.remitter }}</td>
        <td class="table__row__cell table__row__cell--positon-relative">
          <p
            :class="'table__row__cell__status table__row__cell__status--' + UtilsServices.getColorByPercentage(element.filings ? element.filings[0]?.percentage_of_relationship_matrix : element.percentage_of_relationship_matrix, element?.status?.code || element?.related_record_info?.status_display.code)">
            {{ t(element?.related_record_info.status_display.label) }}
          </p>
          <div class="icon-container">
            <span :class="'tooltip tooltip--table-sent'"
              v-if="UtilsServices.getColorByPercentage(element.percentage_of_relationship_matrix, element?.related_record_info?.status_display.code) == 'status-red'">
              {{ t("filing_expiring_soon") }}:
              {{
                element?.days_left.days === 0 ?
                  (Math.floor(element?.days_left?.seconds / 3600) + " " + t('hours')) :
                  (element?.days_left?.days + " " + t('days'))

              }}
            </span>
            <span :class="'tooltip tooltip--table-sent'"
              v-if="UtilsServices.getColorByPercentage(  element.percentage_of_relationship_matrix,  element?.related_record_info?.status_display.code) == 'status-black'">
              {{ t("filing_expired") }} {{ t("for") }}
              {{
                  element?.days_left.days === 0 ?
                    (Math.floor(element?.days_left?.seconds / 3600) + " " + t('hours')) :
                    (element?.days_left?.days + " " + t('days'))
              }}
            </span>
            <DotIconAtom
              :class="'icon-container__dot-icon icon-container__dot-icon--' + UtilsServices.getColorByPercentage(element.filings ? element.filings[0]?.percentage_of_relationship_matrix : element.percentage_of_relationship_matrix, element?.status?.code || element?.related_record_info?.status_display.code)"
              :status="UtilsServices.getColorByPercentage( element.percentage_of_relationship_matrix,  element?.related_record_info?.status_display.code)" />
          </div>
        </td>
      </tbody>
    </table>
  </section>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
import TitleAtom from "../../atoms/title/Title.atom.vue";
import TextAtom from "../../atoms/text/Text.atom.vue";
import { useI18n } from 'vue-i18n';
import { useRouter } from "vue-router";
import DotIconAtom from "../../atoms/dot-icon/DotIcon.atom.vue";
import UtilsServices from '../../../services/UtilsServices.ts';

const { te, t } = useI18n();
const router: any = useRouter();
defineProps(["dataTableCorrespondenceDashboard"]);



function redirectToRecord(id: number) {
  router.push('filing/' + id);
}
</script>

<style scoped src="./TableCorrespondenceDashboard.organism.scss"></style>