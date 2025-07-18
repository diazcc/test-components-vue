<template>
    <article class="template-table-view" v-if="!dataSubseries.stateFormCreate">
        <section class="template-table-view__content">
            <header class="template-table-view__header">
                <h1 class="template-table-view__header__title">Subseries</h1>
                <Button v-if="hasPermissions.validator('create_subseries')" 
                    class="template-table-view__header__button" :dataButton="dataSubseries.dataButtonNewSubseries" />
            </header>
            <section class="template-table-view__list">
                <nav class="template-table-view__list__nav">
                    <MultiSelect :dataMultiSelect="dataSubseries.dataMultiSelect" @onChange="applyFilters"/>
                    <InputSearch :dataInputSearch="dataSubseries.dataInputSearch" />
                </nav>
                <table class="table">
                    <thead class="table__row table--header">
                        <th class="table__row__cell">{{t('item')}}</th>
                        <th class="table__row__cell">{{t('code')}}</th>
                        <th class="table__row__cell">{{t('name')}}</th>
                        <th class="table__row__cell">{{t('Serie')}}</th>
                        <th class="table__row__cell">{{t('final_disposition')}}
                            <ImgAtom v-if="hasPermissions.validator('download_subseries')" :dataImg="dataSubseries.dataImgDownloadPdf" />
                            <ImgAtom v-if="hasPermissions.validator('download_subseries')" :dataImg="dataSubseries.dataImgDownloadCSV" />
                        </th>
                        <th class="table__row__cell"
                            v-if="hasPermissions.validator('update_subseries') || hasPermissions.validator('delete_subseries')">
                            {{t('actions')}}
                        </th>
                    </thead>
                    <tbody class="table__row table--only-row loading-component" v-if="dataSubseries.stateLoadData">
                        <td class="table__row__cell">{{ t('loading') }}</td>
                    </tbody>
                    <tbody class="table__row table--only-row" v-else-if="dataSubseries.data.length < 1">
                        <td class="table__row__cell">{{ t('no_results_found') }}</td>
                    </tbody>
                    <tbody class="table__row" v-else v-for="(data,index) in dataSubseries.data">
                        <td class="table__row__cell">{{ index+1 }}</td>
                        <td class="table__row__cell">{{ data.code }}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{ data.name }}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{ data.serie.name }}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{ t(data.final_disposition.label) }}</td>
                        <td class="table__row__cell table__row--img" 
                            v-if="hasPermissions.validator('update_subseries') || hasPermissions.validator('delete_subseries')">
                            <TooltipIcon v-if="dataSubseries.dataTooltipIcons[0].show(data)" :dataTooltipIcon="dataSubseries.dataTooltipIcons[0]" @click="dataSubseries.dataTooltipIcons[0].onClick({data: data})"/>
                            <TooltipIcon v-if="dataSubseries.dataTooltipIcons[1].show(data)" :dataTooltipIcon="dataSubseries.dataTooltipIcons[1]" @click="dataSubseries.dataTooltipIcons[1].onClick({data: data})"/>
                        </td>
                    </tbody>
                </table>
            </section>
            <Paginator :dataPaginator="dataSubseries.dataPaginator"/>
        </section>
    </article>
    <article class="subseries-template--form" v-else>
        <header class="subseries-template--form__header">
            <h2>
                {{ t('welcome_to_trd_module_subserie') }}
            </h2>
        </header>
        <h1 class="subseries-template--form__title">{{ t("create_subserie") }}</h1>
        <section class="subseries-template--form__content">
            <ul class="subseries-template--form__content__container">
                <li class="subseries-template--form__content__container__card">
                    <Select :dataSelect="dataSubseries.dataSelect" required />
                </li>
                <li class="subseries-template--form__content__container__card">
                    <input type="number" :placeholder="t('subserie_code')" min="0" required
                        v-model="dataSubseries.dataForm.code">
                </li>
                <li class="subseries-template--form__content__container__card">
                    <input type="text" :placeholder="t('subserie_name')" required v-model="dataSubseries.dataForm.name">
                </li>
                <li class="subseries-template--form__content__container__card">
                    <input type="number" :placeholder="t('management_file_time')" min="0" required
                        v-model="dataSubseries.dataForm.time_file_management">
                </li>
                <li class="subseries-template--form__content__container__card">
                    <input type="number" :placeholder="t('central_file_time')" min="0" required
                        v-model="dataSubseries.dataForm.time_file_central">
                </li>
                <li class="subseries-template--form__content__container__card">
                    <select name="" id="" required v-model="dataSubseries.dataForm.final_disposition">
                        <option value="" selected disabled>{{ t("final_disposition") }}</option>
                        <option value="001">{{ t('total_conservation') }}</option>
                        <!-- <option value="002">{{ t('selection') }}</option> Comentado/Eliminado por JEFE TI-->
                        <option value="003">{{ t('digitization') }}</option>
                        <option value="004">{{ t('elimination') }}</option>
                    </select>
                </li>
            </ul>
        </section>
        <nav class="subseries-template--form__nav">
            <Button class="subseries-template--form__nav__button" :dataButton="dataSubseries.dataButtonBack" />
            <Button class="subseries-template--form__nav__button" :dataButton="dataSubseries.dataButtonNext" />
        </nav>
    </article>
    <ModalAlert :dataModalAlert="dataSubseries.dataModalAlert" />
    <ModalConfirmation :dataModalConfirmation="dataSubseries.dataModalConfirmation" />
</template>

<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import { defineAsyncComponent } from 'vue';
import Button from '../../atoms/button/Button.atom.vue'
import Select from '../../atoms/select/Select.atom.vue'
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import Paginator from '../../molecules/paginator/Paginator.molecule.vue';
import MultiSelect from '../../atoms/multi-select/MultiSelect.atom.vue';
import TooltipIcon from '../../atoms/tooltip-icon/TooltipIcon.atom.vue';
import hasPermissions from '../../../guards/hasPermissions.guard';

const ModalConfirmation = defineAsyncComponent(() => import('../../molecules/modals/confirmation/ModalConfirmation.molecule.vue'));
const ModalAlert = defineAsyncComponent(() => import('../../molecules/modals/alert/ModalAlert.molecule.vue'));
const ImgAtom = defineAsyncComponent(() => import('../../atoms/img/Img.atom.vue'));
const { t } = useI18n();
const emits: any = defineEmits(['applyFilters']);
const props: any = defineProps(['dataSubseries']);

function applyFilters(selectedOptions: Array<{ value: any }>){
    emits("applyFilters", selectedOptions);
}

</script>

<style scoped src="./Subseries.template.scss"></style>
