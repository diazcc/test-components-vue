<!-- 
  TODO IMPORTANT: THIS COMPONENT MUST BE IMPROVE ABOUT STYLES AND STRUCTURE OF COMPONENTS

  ?ISSUES:

  *Redesign view about 

  !DON'T WORK WITH THIS COMPONENT BEFORE CHECK ALL ISSUES 
-->

<template>
  <section class="dashboard">
    <article class="dashboard__widget">
      <header class="dashboard__widget__header">
        <h1 class="dashboard__widget_header__title">
          {{ t("pending_documents") }}
        </h1>
       <!--  <p class="dashboard__widget___header__subtitle">
          ( {{ t("latest_internal_filings") }} )
        </p> -->
      </header>
      <TableCorrespondenceDashboard
        :dataTableCorrespondenceDashboard="
          dataDashboardTemplate.dataTableCorrespondenceInternal
        "
      />
    </article>
    <!-- <article class="dashboard__widget">
      <header class="dashboard__widget__header">
        <h1 class="dashboard__widget_header__title">
          {{ t("calendar") }}
        </h1>
      </header>
      <CalendarWidget :dataCalendarWidget="dataDashboardTemplate.dataCalendarWidget" />
    </article> -->
    <article class="dashboard__widget">
      <header class="dashboard__widget__header">
        <h1 class="dashboard__widget_header__title">
          {{ t("sents") }}
        </h1>
        <!-- <p class="dashboard__widget___header__subtitle">
          ( {{ t("latest_entry_filings") }} )
        </p> -->
      </header>
      <TableCorrespondenceDashboard
        :dataTableCorrespondenceDashboard="
          dataDashboardTemplate.dataTableCorrespondenceEntry
        "
      />
    </article>
  <!--   <article class="dashboard__widget">
      <Statistic :dataStatistic="dataDashboardTemplate.dataStatistic"></Statistic>
    </article> -->
  </section>
</template>

<script setup lang="ts">
import TableCorrespondenceDashboard from "../../organisms/table-correspondence-dashboard/TableCorrespondenceDashboard.organism.vue";
import ColaborativeWork from "../../organisms/colaborative-work/ColaborativeWork.organism.vue";
import CalendarWidget from "../../organisms/calendar/CalendarWidget.organism.vue";
import Statistic from "../../organisms/statistic/Statistic.organism.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
defineProps(["dataDashboardTemplate"]);
</script>

<style scoped src="./Dashboard.template.scss"></style>
