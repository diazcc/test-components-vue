<template>
    <article class="template-table-view">
        <section class="template-table-view__content">
            <header class="template-table-view__header">
                <h1 class="template-table-view__header__title">{{t('central_files')}}</h1>
                <Button v-if="hasPermissions.validator('create_file')"  
                    class="template-table-view__header__button" :dataButton="dataCentralFiles.dataButtonNewFiles" />
            </header>
            <section class="template-table-view__list">
                <nav class="template-table-view__list__nav">
                    <MultiSelect :dataMultiSelect="dataCentralFiles.dataMultiSelect" @onChange="applyFilters"/>
                    <InputSearch :dataInputSearch="dataCentralFiles.dataInputSearch" />
                </nav>
                <table class="table">
                    <thead class="table__row table--header">
                        <th class="table__row__cell">{{ t("item")}}</th>
                        <th class="table__row__cell">{{ t("name")}}</th>
                        <th class="table__row__cell">{{ t("type_documental")}}</th>
                        <th class="table__row__cell">{{ t("type_filing")}}</th>
                        <th class="table__row__cell">{{ t("date")}}</th>
                    </thead>
                    <tbody class="table__row table--only-row loading-component" v-if="dataCentralFiles.stateLoadData">
                        <td class="table__row__cell">{{ t("loading") }}</td>
                    </tbody>
                    <tbody class="table__row table--only-row" v-else-if="dataCentralFiles.data.length < 1">
                        <td class="table__row__cell">{{ t("no_results_found") }}</td>
                    </tbody>
                    <tbody class="table__row" v-else v-for="(data, index) in dataCentralFiles.data" @click="dataCentralFiles.getFile(data)">
                        <td class="table__row__cell">{{ index+1 }}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{ data.document_name }}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{ data.documentary_type.name_document_type }}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{ data.documentary_type.type_of_filing.label }}</td>
                        <td class="table__row__cell">{{ data.date }}</td>
                    </tbody>
                </table>
            </section>
            <Paginator :dataPaginator="dataCentralFiles.dataPaginator"/>
        </section>
    </article>
    <ModalPdfViewer :dataModalPdfViewer="dataCentralFiles.dataModalPdfViewer" />
    <ModalAlert :dataModalAlert="dataCentralFiles.dataModalAlert" />
</template>

<script setup lang="ts">

import Button from '../../atoms/button/Button.atom.vue';
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import ModalPdfViewer from '../../molecules/modals/modal-pdf-viewer/ModalPdfViewer.molecule.vue';
import ModalAlert from '../../molecules/modals/alert/ModalAlert.molecule.vue';
import Paginator from '../../molecules/paginator/Paginator.molecule.vue';
import MultiSelect from '../../atoms/multi-select/MultiSelect.atom.vue';
import hasPermissions from '../../../guards/hasPermissions.guard';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const emits = defineEmits(['applyFilters']);

defineProps(['dataCentralFiles']);

function applyFilters(selectedOptions: Array<{ value: any }>){
    emits("applyFilters", selectedOptions);
}

</script>

<style scoped src="./CentralFiles.template.scss"></style>
