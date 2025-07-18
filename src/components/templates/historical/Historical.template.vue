<template>
    <article class="template-table-view">
        <section class="template-table-view__content">
            <header class="template-table-view__header">
                <h1 class="template-table-view__header__title">{{t('historical')}}</h1>
                <!-- <Button class="template-table-view__header__button" :dataButton="dataHistorical.dataButtonNewFiles" /> -->
            </header>
            <section class="template-table-view__list">
                <nav class="template-table-view__list__nav">
                    <MultiSelect :dataMultiSelect="dataHistorical.dataMultiSelect" @onChange="applyFilters"/>
                    <InputSearch :dataInputSearch="dataHistorical.dataInputSearch" />
                </nav>
                <table class="table">
                    <thead class="table__row table--header">
                        <th class="table__row__cell">{{ t("item") }}</th>
                        <th class="table__row__cell">{{ t("action")}}</th>
                        <th class="table__row__cell">{{ t("creation_date")}}</th>
                        <th class="table__row__cell">{{ t("code")}}</th>
                        <!-- Temporary solution -->
                        <!-- <th class="table__row__cell">{{ t("type_of_filing")}}</th> -->
                        <th class="table__row__cell">{{ t("description")}}</th>
                    </thead>
                    <tbody class="table__row table--only-row loading-component" v-if="dataHistorical.stateLoadData">
                        <td class="table__row__cell">{{ t('loading') }}</td>
                    </tbody>
                    <tbody class="table__row table--only-row" v-else-if="dataHistorical.data.length < 1">
                        <td class="table__row__cell">{{ t('no_results_found') }}</td>
                    </tbody>
                    <tbody class="table__row" v-else v-for="(data, index) in dataHistorical.data" @click="dataHistorical.goToPath(data.path)">
                        <td class="table__row__cell">{{ index+1}}</td>
                        <td class="table__row__cell table__row__cell--left-align">
                            <a class="table__row__cell__text" v-html="UtilsServices.highlightVerbForPastSentences({inputString:t(data?.action), color:'#000000', 
                            style: 'text-transform: capitalize;'})"></a>
                        </td>
                        <td class="table__row__cell">{{ data?.date }}</td>
                        
                        <td class="table__row__cell">{{ data?.code }}</td>
                        <td class="table__row__cell table__row__cell--left-align">
                            <a class="table__row__cell__text" v-html="UtilsServices.highlightVerbForPastSentences({inputString:t(data?.description), color:'#000000', 
                            style: 'text-transform: capitalize;'})"></a>
                        </td>
                    </tbody>
                </table>
            </section>
            <Paginator :dataPaginator="dataHistorical.dataPaginator"/>
        </section>
    </article>
    <ModalAlert :dataModalAlert="dataHistorical.dataModalAlert" />
</template>

<script setup lang="ts">

import Button from '../../atoms/button/Button.atom.vue';
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import ModalPdfViewer from '../../molecules/modals/modal-pdf-viewer/ModalPdfViewer.molecule.vue';
import ModalAlert from '../../molecules/modals/alert/ModalAlert.molecule.vue';
import Paginator from '../../molecules/paginator/Paginator.molecule.vue';
import MultiSelect from '../../atoms/multi-select/MultiSelect.atom.vue';
import UtilsServices from '../../../services/UtilsServices';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const emits = defineEmits(['applyFilters']);
const props: any = defineProps(['dataHistorical']);

function applyFilters(selectedOptions: Array<{ value: any }>){
    emits("applyFilters", selectedOptions);
}

</script>

<style scoped src="./Historical.template.scss"></style>
