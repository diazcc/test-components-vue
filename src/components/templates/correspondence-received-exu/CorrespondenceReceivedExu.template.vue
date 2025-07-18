<template >
    <article class="template-table-view" v-if="!dataCorrespondenceReceivedExu.stateChooseFiling && !dataCorrespondenceReceivedExu.stateCreateFiling">
        <section class="template-table-view__content">
            <header class="template-table-view__header">
                <h1 class="template-table-view__header__title">{{t('accepted')}}</h1>
                <Button class="template-table-view__header__button" :dataButton="dataCorrespondenceReceivedExu.dataButtonNew"/>
            </header>
            <section class="template-table-view__list">
                <nav class="template-table-view__list__nav">
                    <MultiSelect :dataMultiSelect="dataCorrespondenceReceivedExu.dataMultiSelect" @onChange="applyFilters"/>
                    <InputSearch :dataInputSearch="dataCorrespondenceReceivedExu.dataInputSearch"/>
                </nav>
                <table class="table">
                    <thead class="table__row table--header">
                        <th class="table__row__cell">{{t('item')}}</th>
                        <th class="table__row__cell">{{t('subject')}}</th>
                        <th class="table__row__cell">{{t('filing_number')}}</th>
                        <th class="table__row__cell">{{t('remitter')}}</th>
                        <th class="table__row__cell">{{t('type_of_person')}}</th>
                        <th class="table__row__cell">{{t('email')}}</th>
                        <th class="table__row__cell">{{t('date_of_filing')}}</th>
                        <th class="table__row__cell">{{t('state')}}</th>
                    </thead>
                    <tbody class="table__row table--only-row loading-component" v-if="dataCorrespondenceReceivedExu.stateLoadDatadata">
                        <td class="table__row__cell">{{ t('loading') }}</td>
                    </tbody>
                    <tbody class="table__row table--only-row" v-else-if="dataCorrespondenceReceivedExu.list.length < 1 ">
                        <td class="table__row__cell">{{ t('no_results_found') }}</td>
                    </tbody>
                    <tbody v-else class="table__row" v-for="(data, index) in dataCorrespondenceReceivedExu.list" :key="index" @click="dataCorrespondenceReceivedExu.openFiling(data)">
                        <td class="table__row__cell">{{ index + 1 }}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{ data?.filings[0]?.subject }}</td>
                        <td class="table__row__cell"><span>{{ data?.filings[data?.filings.length - 1]?.filing_code }}</span></td>
                        <td class="table__row__cell table__row__cell--left-align">
                            {{ data.filings[0]?.remitter ? (data.filings[0]?.remitter.contact_name ? data.filings[0]?.remitter.contact_name : (data.filings[0]?.remitter.first_name ? (data.filings[0]?.remitter.first_name + ' ' + data.filings[0]?.remitter.last_name) : (data.filings[0]?.remitter.email))) : t('anonymous_person') }}
                        </td>
                        <td class="table__row__cell table__row__cell--left-align">{{ t((data.filings[0]?.remitter!=null? data.filings[0]?.remitter.person_type.label : 'N/A')) }}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{ data.filings[0]?.remitter.email || t("did_not_specify") }}</td>
                        <td class="table__row__cell"><span v-for="filing in data?.filings">{{ filing?.filing_date }}</span></td>
                        <td class="table__row__cell">{{ t(data?.status.label || '') }}</td>
                    </tbody>
                </table>
            </section>
        </section>
    </article>

    <article v-if="dataCorrespondenceReceivedExu.stateChooseFiling" class="correspondence-received-exu__navegation">
        <h1 class="correspondence-received-exu__navegation__title">{{t('welcome_to_filing_module')}}</h1>
        <section class="correspondence-received-exu__navegation__body">
            <p>{{t('please_select_the_action_you_wish_to_perform')}}</p>
            <nav class="correspondence-received-exu__navegation__body__wrapper">
                <Button :dataButton="dataCorrespondenceReceivedExu.dataButtonAnonymousFiling"/>
                <Button :dataButton="dataCorrespondenceReceivedExu.dataButtonFiling"/>
                <button class="correspondence-received-exu__navegation__body__wrapper__button-back" @click=" dataCorrespondenceReceivedExu.stateChooseFiling= false, dataCorrespondenceReceivedExu.stateCreateFiling=false">
                    {{ t('back') }}
                </button>
            </nav>
        </section>
    </article>
    <div class="correspondence-received-exu correspondence-received-exu--flow" v-if="dataCorrespondenceReceivedExu.stateCreateFiling && !dataCorrespondenceReceivedExu.stateChooseFiling ">
        <FilingForm :dataFilingForm="dataCorrespondenceReceivedExu.dataFilingForm" @emitDocSelected="emitDocSelected"/>
        <nav class="correspondence-received-exu--flow__nav">
            <Button :dataButton="dataCorrespondenceReceivedExu.dataButtonBack"/>
            <Button :dataButton="dataCorrespondenceReceivedExu.dataButtonNext" v-if="!dataCorrespondenceReceivedExu.dataFilingForm.stateResponse"/>
        </nav>
    </div>
    <ModalAlert :dataModalAlert="dataCorrespondenceReceivedExu.dataModalAlert"/>
    <ModalConfirmation :dataModalConfirmation="dataCorrespondenceReceivedExu.dataModalConfirmation"/>
    <ModalPdfViewer :dataModalPdfViewer="dataCorrespondenceReceivedExu.dataModalPdfViewer" />
</template>

<script setup lang="ts">

import { defineAsyncComponent } from 'vue';
import FilingForm from '../../organisms/filing-form/FilingForm.organism.vue';
import Button from '../../atoms/button/Button.atom.vue';
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import MultiSelect from '../../atoms/multi-select/MultiSelect.atom.vue';
import { useI18n } from 'vue-i18n';
const ModalAlert = defineAsyncComponent(() => import('../../molecules/modals/alert/ModalAlert.molecule.vue'));
const ModalConfirmation = defineAsyncComponent(() => import('../../molecules/modals/confirmation/ModalConfirmation.molecule.vue'));
const ModalPdfViewer = defineAsyncComponent(() => import('../../molecules/modals/modal-pdf-viewer/ModalPdfViewer.molecule.vue'));

const { t } = useI18n();

defineProps(['dataCorrespondenceReceivedExu']);
const emits = defineEmits(['codeFiling', 'user', 'fileFiling', 'emitDocs', 'emitDocSelected', 'dataEditor', 'sendDataEditorModalAssignFiling', 'sendDataEditorModalResponseEditor', 'applyFilters']);
function emitDocSelected(file: any) {
    emits('emitDocSelected', file);
}

function applyFilters(selectedOptions: Array<{ value: any }>){
    emits("applyFilters", selectedOptions);
}

</script>
<style src="./CorrespondenceReceivedExu.template.scss" scoped></style>
