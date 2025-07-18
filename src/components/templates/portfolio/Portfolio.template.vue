<!-- Esta estructura es un estandar y esta en style.css -->
<template>
  <article class="template-table-view">
    <section class="template-table-view__content" v-if="!dataPortfolio.stateVisualizePortfolio">
      <header class="template-table-view__header">
        <h1 class="template-table-view__header__title">{{ t('portfolio') }}</h1>
        <Button  class="template-table-view__header__button" :dataButton="dataPortfolio.dataButtonNewPortfolio" />
      </header>
      <section class="template-table-view__list"
        :style="dataPortfolio?.stateLoadData ? 'overflow: hidden;' : ''"
      >
        <nav class="template-table-view__list__nav">
          <!-- Temporary solution -->
          <p class="white">.</p> 
          <InputSearch :dataInputSearch="dataPortfolio.dataInputSearch" />
        </nav>
        <table class="table-portfolio">
          <tbody class="table-portfolio__row table-portfolio--only-row  loading-component"
            v-if="dataPortfolio?.stateLoadData">
            <tr>
              <td colspan="2" class="table-portfolio__row__cell">{{ t('loading') }}</td>
            </tr>
          </tbody>
          <tbody class="table-portfolio__row table-portfolio--only-row"
            v-else-if="dataPortfolio.data.length < 1">
            <tr>
              <td colspan="2" class="table-portfolio__row__cell">{{ t('no_results_found') }}</td>
            </tr>
          </tbody>
          <tbody class="table-portfolio__row" v-else>
            <tr v-for="(pair, rowIndex) in groupedData">
              <td class="table-portfolio__row__cell" v-for="(data, colIndex) in pair">
                <CardPortfolio v-if="data" :data="data" :dataCardPortfolio="dataPortfolio.dataCardPortfolio"/>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <Paginator :dataPaginator="dataPortfolio.dataPaginator" />
    </section>
    <section class="template-table-view__content" v-else>
      <header class="template-table-view__header">
        <h1 class="template-table-view__header__title">{{ t('content_of_the_portfolio') }}: {{ dataPortfolio.dataChoose?.name }}</h1>
      </header>
      <section class="template-table-view__list">
        <nav class="template-table-view__list__nav">
          <p class="template-table-view__list__nav__text" @click="dataPortfolio.getBack()">{{ t("back") }}</p>
          <InputSearch :dataInputSearch="dataPortfolio.dataInputSearchFile" />
        </nav>
        <table class="table">
          <thead class="table__row table--header">
            <li class="table__row__cell">{{ t('item') }}</li>
            <li class="table__row__cell">{{ t("name")}}</li>
            <li class="table__row__cell">{{ t("type_documental")}}</li>
            <li class="table__row__cell">{{ t("creation_date")}}</li>
            <li class="table__row__cell">{{ t('actions') }}</li>
          </thead>
          <tbody class="table__row table--only-row loading-component"
            v-if="dataPortfolio?.stateLoadData">
            <td class="table__row__cell">{{ t('loading') }}</td>
          </tbody>
          <tbody class="table__row table--only-row"
            v-else-if="dataPortfolio.dataChoose?.documents?.length < 1 && dataPortfolio?.stateLoadData == false">
            <td class="table__row__cell">{{ t('no_results_found') }}</td>
          </tbody>
          <tbody class="table__row" 
            v-else v-for="(data, index) in dataPortfolio.dataChoose?.documents">
            <td class="table__row__cell">{{ index + 1 }}</td>
            <td class="table__row__cell table__row__cell--left-align">{{ data.document_name }}</td>
            <td class="table__row__cell table__row__cell--left-align">{{ data.documentary_type.name_document_type }}</td>
            <td class="table__row__cell">{{ data.date }}</td>
            <td class="table__row__cell table__row--img">
                <!-- <TooltipIcon v-if="dataTooltipIconView.show(index)" :dataTooltipIcon="dataTooltipIconView" @click="dataTooltipIconView.onClick({data: data, index: index, action: 'see_document'})"/>
                <TooltipIcon v-if="!dataFiles?.newView && dataFiles?.dataTooltipIcons[0].show(index)" :dataTooltipIcon="dataFiles?.dataTooltipIcons[0]" @click="dataFiles?.dataTooltipIcons[0].onClick({data: data, index: index, action: 'open_document'})"/>
                <TooltipIcon v-if="!dataFiles?.newView && dataFiles?.dataTooltipIcons[1].show(index)" :dataTooltipIcon="dataFiles?.dataTooltipIcons[1]" @click="dataFiles?.dataTooltipIcons[1].onClick({data: data, index: index, action: 'assign_dependencies'})"/>
                <TooltipIcon v-if="!dataFiles?.newView && dataFiles?.dataTooltipIcons[2].show(index)" :dataTooltipIcon="dataFiles?.dataTooltipIcons[2]" @click="dataFiles?.dataTooltipIcons[2].onClick({data: data, index: index, action: 'save'})"/>
                <TooltipIcon v-if="!dataFiles?.newView && dataFiles?.dataTooltipIcons[3].show(index)" :dataTooltipIcon="dataFiles?.dataTooltipIcons[3]" @click="dataFiles?.dataTooltipIcons[3].onClick({data: data, index: index, action: 'cancel'})"/> -->
            </td>
          </tbody>
        </table>
      </section>
      <Paginator :dataPaginator="dataPortfolio.dataFilePaginator"/>
    </section>
  </article>
  <ModalAlert :dataModalAlert="dataPortfolio.dataModalAlert" />
  <ModalConfirmation :dataModalConfirmation="dataPortfolio.dataModalConfirmation" />
  <ModalPdfViewer :dataModalPdfViewer="dataPortfolio.dataModalPdfViewer" />
  <ModalCreate :dataModalCreate="dataPortfolio.dataModalCreate" />
</template>

<script setup lang="ts">

// Import vue libraries
import { defineAsyncComponent, computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Import components
import Button from '../../atoms/button/Button.atom.vue';
import Paginator from "../../molecules/paginator/Paginator.molecule.vue";
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import CardPortfolio from '../../molecules/card-portfolio/CardPortfolio.molecule.vue';
const ModalAlert = defineAsyncComponent(() => import('../../molecules/modals/alert/ModalAlert.molecule.vue'));
const ModalConfirmation = defineAsyncComponent(() => import('../../molecules/modals/confirmation/ModalConfirmation.molecule.vue'));
const ModalPdfViewer = defineAsyncComponent(() => import('../../molecules/modals/modal-pdf-viewer/ModalPdfViewer.molecule.vue'));
const ModalCreate = defineAsyncComponent(() => import('../../molecules/modals/create/ModalCreate.molecule.vue'));
// Import services

// Define props and emits and configuration
const { t } = useI18n();
const props: any = defineProps(["dataPortfolio"]);

//Define constants and variables

// Agrupa los datos de dos en dos
const groupedData = computed(() => {
  const result = [];
  for (let i = 0; i < props.dataPortfolio.data.length; i += 2) {
    result.push([
      props.dataPortfolio.data[i],
      props.dataPortfolio.data[i + 1] || null
    ]);
  }
  return result;
});

// Define functions and methods

</script>

<style scoped src="./Portfolio.template.scss"></style>