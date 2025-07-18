<template>
    <article class="template-table-view" v-if="!dataDocumentaryType.stateFormCreate">
        <section class="template-table-view__content">
            <header class="template-table-view__header">
                <h1 class="template-table-view__header__title">{{ t("type_documental") }}</h1>
                <Button v-if="hasPermissions.validator('create_type_documental')"
                    class="template-table-view__header__button" :dataButton="dataDocumentaryType.dataButtonNewDocumentaryTypes" />
            </header>
            <section class="template-table-view__list">
                <nav class="template-table-view__list__nav">
                    <MultiSelect :dataMultiSelect="dataDocumentaryType.dataMultiSelect" @onChange="applyFilters"/>
                    <InputSearch :dataInputSearch="dataDocumentaryType.dataInputSearch" />
                </nav>
                <table class="table">
                    <thead class="table__row table--header">
                        <th class="table__row__cell">{{ t('item') }}</th>
                        <th class="table__row__cell">{{ t('name') }}</th>
                        <th class="table__row__cell">{{ t('type_of_filing') }}</th>
                        <th class="table__row__cell">{{ t('type_of_procedure') }}</th>
                        <th class="table__row__cell">{{ t('procedure_time') }}</th>
                        <th class="table__row__cell"
                            v-if="hasPermissions.validator('update_type_documental') || hasPermissions.validator('delete_type_documental')">
                            {{ t('actions') }}
                        </th>
                    </thead>
                    <tbody class="table__row table--only-row loading-component" v-if="dataDocumentaryType.stateLoadData">
                        <td class="table__row__cell">{{ t('loading') }}</td>
                    </tbody>
                    <tbody class="table__row table--only-row" v-else-if="dataDocumentaryType.data.length < 1">
                        <td class="table__row__cell">{{ t('no_results_found') }}</td>
                    </tbody>
                    <tbody class="table__row" v-else v-for="(data, index) in dataDocumentaryType.data">
                        <td class="table__row__cell">{{ index+1 }}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{ data.name_document_type || 'null' }}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{ data.type_of_filing || 'null' }}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{ indetifyTypeOfProcedureByCode(data.type_processing_time) || 'null' }}</td>
                        <td class="table__row__cell">{{ data.processing_time || 'null' }}</td>
                        <td class="table__row__cell table__row--img"
                            v-if="hasPermissions.validator('update_type_documental') || hasPermissions.validator('delete_type_documental')">
                            <TooltipIcon v-if="dataDocumentaryType.dataTooltipIcons[0].show(data)" :dataTooltipIcon="dataDocumentaryType.dataTooltipIcons[0]" @click="dataDocumentaryType.dataTooltipIcons[0].onClick({data: data})"/>
                            <TooltipIcon v-if="dataDocumentaryType.dataTooltipIcons[1].show(data)" :dataTooltipIcon="dataDocumentaryType.dataTooltipIcons[1]" @click="dataDocumentaryType.dataTooltipIcons[1].onClick({data: data})"/>
                        </td>
                    </tbody>
                </table>
            </section>
            <Paginator :dataPaginator="dataDocumentaryType.dataPaginator" />
        </section>
    </article>
    <article class="documentary-type--form" v-else>
        <header class="documentary-type--form__header">
            <h1>
                {{ t('welcome_to_trd_module_type_documental') }}
            </h1>
        </header>
        <h1 class="documentary-type--form__title"> {{ t('create_documental_type') }}</h1>
        <ul class="documentary-type--form__content">
            <li class="documentary-type--form__content__card">
                <input type="text" :placeholder="t('name')" required
                    v-model="dataDocumentaryType.dataForm.name_document_type">
            </li>
            <li class="documentary-type--form__content__card">
                <input type="number" :placeholder="t('procedure_time')" min="0" required
                    v-model="dataDocumentaryType.dataForm.processing_time">
            </li>
            <li class="documentary-type--form__content__card">
                <select name="" id="" required v-model="dataDocumentaryType.dataForm.type_processing_time">
                    <option value="" selected disabled>{{ t('select_the_type_of_procedure') }}...</option>
                    <option value="001">{{ t('business_days') }}</option>
                    <option value="002">{{ t('calendar_days') }}</option>
                    <option value="003">{{ t('business_hours') }}</option>
                </select>
            </li>
            <li class="documentary-type--form__content__card">
                <MultiSelectAtom :dataMultiSelect="dataDocumentaryType.dataMultiSelect" required multiple />
            </li>

        </ul>
        <nav class="documentary-type--form__nav">
            <Button class="documentary-type--form__nav__button" :dataButton="dataDocumentaryType.dataButtonBack" />
            <Button class="documentary-type--form__nav__button" :dataButton="dataDocumentaryType.dataButtonNext" />
        </nav>
    </article>
    <ModalAlert :dataModalAlert="dataDocumentaryType.dataModalAlert" />
    <ModalConfirmation :dataModalConfirmation="dataDocumentaryType.dataModalConfirmation" />
</template>

<script setup lang="ts">

import TooltipIcon from '../../atoms/tooltip-icon/TooltipIcon.atom.vue';
import MultiSelectAtom from '../../atoms/multi-select/MultiSelect.atom.vue';
import Button from '../../atoms/button/Button.atom.vue'
import ModalAlert from '../../molecules/modals/alert/ModalAlert.molecule.vue';
import ModalConfirmation from '../../molecules/modals/confirmation/ModalConfirmation.molecule.vue';
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import Paginator from '../../molecules/paginator/Paginator.molecule.vue';
import MultiSelect from '../../atoms/multi-select/MultiSelect.atom.vue';
import hasPermissions from '../../../guards/hasPermissions.guard';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const emits: any = defineEmits(['applyFilters']);
const props: any = defineProps(['dataDocumentaryType']);

function applyFilters(selectedOptions: Array<{ value: any }>){
    emits("applyFilters", selectedOptions);
}

function indetifyTypeOfProcedureByCode(code: any) {
    let ans: any = '';
    switch(code){
        case 1:
            ans = 'business_days';
            break;
        case 2:
            ans = 'calendar_days';
            break;
        case 3:
            ans = 'business_hours'
            break;
        default:
            ans = ''
            break;
    }
    return t(ans);
}

</script>

<style scoped src="./TypeDocumental.template.scss"></style>
