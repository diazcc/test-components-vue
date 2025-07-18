<template>
    <article v-if="!dataTrd.stateLoadForm" class="template-table-view">
        <section class="template-table-view__content">
            <header class="template-table-view__header">
                <h1 class="template-table-view__header__title">Tablas de retención documental</h1>
                <Button v-if="hasPermissions.validator('create_trd')" 
                    class="template-table-view__header__button" :dataButton="dataTrd.dataButtonNewTrd" />
            </header>
            <section class="template-table-view__list">
                <nav class="template-table-view__list__nav">
                    <MultiSelect :dataMultiSelect="dataTrd.dataMultiSelect" @onChange="applyFilters"/>
                    <InputSearch :dataInputSearch="dataTrd.dataInputSearch" />
                </nav>
                <table class="table">
                    <thead class="table__row table--header">
                        <th class="table__row__cell">{{ t("item") }}</th>
                        <th class="table__row__cell">{{ t("dependence") }}</th>
                        <th class="table__row__cell">{{ t("Serie") }}</th>
                        <th class="table__row__cell">{{ t("Subserie") }}</th>
                        <th class="table__row__cell">{{ t("material_type") }}</th>
                        <th class="table__row__cell">{{ t("type_documental") }}</th>
                        <th class="table__row__cell">{{ t("type_filing") }}</th>
                        <th class="table__row__cell"
                            v-if="hasPermissions.validator('update_trd') || hasPermissions.validator('delete_trd')">
                            {{ t("actions") }}
                        </th>
                    </thead>
                    <tbody class="table__row table--only-row loading-component" v-if="dataTrd.stateLoadData">
                        <td class="table__row__cell">{{ t('loading') }}</td>
                    </tbody>
                    <tbody class="table__row table--only-row" v-else-if="dataTrd.data.length < 1">
                        <td class="table__row__cell">{{ t('no_results_found') }}</td>
                    </tbody>
                    <tbody class="table__row" v-else v-for="(data, index) in dataTrd.data">
                        <td class="table__row__cell">{{ index + 1}}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{data?.dependence || null}}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{data?.serie || null}}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{data?.subserie || null}}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{ t(data?.material_type) || null}}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{data?.document_type || null}}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{data?.type_of_filing || null}}</td>
                        <td class="table__row__cell table__row--img"
                            v-if="hasPermissions.validator('update_trd') || hasPermissions.validator('delete_trd')">
                            <TooltipIcon v-if="dataTrd.dataTooltipIcons[0].show(data)" :dataTooltipIcon="dataTrd.dataTooltipIcons[0]" @click="dataTrd.dataTooltipIcons[0].onClick({data: data})"/>
                            <TooltipIcon v-if="dataTrd.dataTooltipIcons[1].show(data)" :dataTooltipIcon="dataTrd.dataTooltipIcons[1]" @click="dataTrd.dataTooltipIcons[1].onClick({data: data})"/>
                        </td>
                    </tbody>
                </table>
            </section>
            <Paginator :dataPaginator="dataTrd.dataPaginator"/>
        </section>
    </article>
    <article v-else class="relationship-matrix-template--form">
        <header class="relationship-matrix-template--form__header">
            <h2>
                {{ t('welcome_to_trd_module') }}
            </h2>
        </header>
        <h1 class="relationship-matrix-template--form__title"> {{ t('relational_matrix')}}</h1>
        <ul class="relationship-matrix-template--form__content">
            <li class="relationship-matrix-template--form__content__card">
                <Select :dataSelect="dataRelationshipMatrix.dataSelectDependence" required />
            </li>
            <li class="relationship-matrix-template--form__content__card">
                <Select :dataSelect="dataRelationshipMatrix.dataSelectSerie" required />
            </li>
            <li class="relationship-matrix-template--form__content__card">
                <Select :dataSelect="dataRelationshipMatrix.dataSelectSubserie" required />
            </li>

            <li class="relationship-matrix-template--form__content__card">
                <Select :dataSelect="dataRelationshipMatrix.dataSelectMaterialType" required />
            </li>
            <li class="relationship-matrix-template--form__content__card relationship-matrix-template--form__content__card--multiple">
                <MultiSelect :dataMultiSelect="dataRelationshipMatrix.dataMultiSelect" required multiple/>
            </li>
        </ul>
        <nav class="relationship-matrix-template--form__nav">
            <Button class="relationship-matrix-template--form__nav__button" :dataButton="dataRelationshipMatrix.dataButtonBack" />
            <Button class="relationship-matrix-template--form__nav__button" :dataButton="dataRelationshipMatrix.dataButtonNext" />
        </nav>
    </article>
    <ModalAlert :dataModalAlert="dataRelationshipMatrix.dataModalAlert" />
    <ModalConfirmation :dataModalConfirmation="dataRelationshipMatrix.dataModalConfirmation" />
</template>

<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import Button from '../../atoms/button/Button.atom.vue'
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import Paginator from '../../molecules/paginator/Paginator.molecule.vue';
import MultiSelect from '../../atoms/multi-select/MultiSelect.atom.vue';
import ModalAlert from '../../molecules/modals/alert/ModalAlert.molecule.vue';
import ModalConfirmation from '../../molecules/modals/confirmation/ModalConfirmation.molecule.vue';
import Select from '../../atoms/select/Select.atom.vue'
import TooltipIcon from '../../atoms/tooltip-icon/TooltipIcon.atom.vue';
import hasPermissions from '../../../guards/hasPermissions.guard';

const { t } = useI18n();
const emits: any = defineEmits(['applyFilters']);
const props: any = defineProps(['dataTrd', 'dataRelationshipMatrix']);

function applyFilters(selectedOptions: Array<{ value: any }>){
    emits("applyFilters", selectedOptions);
}

</script>

<style scoped src="./Trd.template.scss"></style>