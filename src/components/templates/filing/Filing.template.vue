<template>
    <article class="filing">
        <header class="filing__header">
            <h1 class="filing__header__title">{{ t('filing_data') }}</h1>
            <SelectActions :dataSelect="dataFiling.dataSelectActions" class="filing__header__actions" />
            <nav class="filing__header__buttons-nav">
                <Img class="filing__header__buttons-nav__img" :dataImg="dataFiling.dataImgGoBack" />
            </nav>
        </header>
        <section class="filing__info ">
            <ul class="filing__info__content">
                <li class="filing__info__content__card">
                    <p class="filing__info__content__card__subtitle">
                        {{ t('subject') }}:
                        <span>
                            {{ dataFiling.data.subject }}
                        </span>
                    </p>
                </li>
                <li class="filing__info__content__card">
                    <p class="filing__info__content__card__subtitle">
                        {{ t('filing_number') }}:

                        <span>
                            {{ dataFiling.data.id }}
                        </span>
                    </p>
                </li>
                <li class="filing__info__content__card">
                    <p class="filing__info__content__card__subtitle">
                        {{ t('remitter') }}:

                        <span>
                            {{  dataFiling.data.creator_user }}
                        </span>
                    </p>
                </li>
                
            </ul>
            <ul class="filing__info__content">
                <li class="filing__info__content__card" >
                    <p class="filing__info__content__card__subtitle">
                        {{ t('email') }}:

                        <span>
                            {{ dataFiling.data.user_asigned }}
                        </span>
                    </p>
                </li>
                <li class="filing__info__content__card">
                    <p class="filing__info__content__card__subtitle">
                        {{ t('creation_date') }}:

                        <span>
                            {{ dataFiling.data.date_created }}
                        </span>
                    </p>
                </li>
                <li class="filing__info__content__card">
                    <p class="filing__info__content__card__subtitle">
                        {{ t('state') }}:

                        <span>
                            {{ t(dataFiling.data.status) }}
                        </span>
                    </p>
                </li>
            </ul>
            
        </section>
        <section class="filing__wrapper"
            v-if="dataFiling.record_documents.length > 1 || dataFiling.record_documents != null">
            <ul class="filing__wrapper__navegation">
                
                <li :class="'filing__wrapper__navegation__card filing__wrapper__navegation__card--' + (dataFiling.stateViewDocuments ? 'focused' : '')"
                    @click="dataFiling.redirectDocuments">{{ t('documents') }}</li>
                
            </ul>
            <div class="filing__wrapper__container">
                <ul class="filing__wrapper__container__info" >
                    <table class="table">
                        <thead class="table__row table--row2 table--header">
                            <th class="table__row__cell">{{ t("name") }}</th>
                            <th class="table__row__cell"></th>
                        </thead>
                        <tbody class="table__row table--row2"
                            v-if="dataFiling.record_documents.length < 1 || dataFiling.record_documents == null">
                            <td class="table__row__cell">{{ t('without_data')}}</td>
                        </tbody>
                        <tbody class="table__row table--row2" v-else v-for="document in dataFiling.record_documents">
                            <td class="table__row__cell">{{ document.name }}</td>
                            <td class="table__row__cell table__row--img" @click="dataFiling.onClickDocument(document)">
                                <img alt="ver" src="/Buttons/icon-view.svg">
                                <span class="tooltip"> {{ t("view") + " " + t("file") }}</span>
                            </td>
                        </tbody>
                    </table>
                </ul>
            </div>
        </section>
        <ModalAssignFiling :dataModalAssignFiling="dataFiling.dataModalAssignFiling"
            @sendDataEditorModalAssignFiling="sendDataEditorModalAssignFiling" />

    </article>
    <ModalListDocuments :dataModalListDocuments="dataFiling.dataModalListDocuments"
        @emitDocSelected="emitDocSelected" />
    <ModalPdfViewer :dataModalPdfViewer="dataFiling.dataModalPdfViewer" />
    <ModalAlert :dataModalAlert="dataFiling.dataModalAlert" />
    <ModalConfirmation :dataModalConfirmation="dataFiling.dataModalConfirmation" />
    <ModalResponseFiling :dataModalResponseFiling="dataFiling.dataModalResponseFiling"
        @sendDataEditor="getSendDataEditor" />
    <ModalActionMolecule :dataModalAction="dataFiling.dataModalAction"/>

</template>

<script setup lang="ts">

// Import vue library
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref, onMounted, computed } from 'vue';

// Import component
import LineHistory from '../../organisms/line-history/LineHistory.organism.vue';
import SelectActions from '../../atoms/select/Select.atom.vue';
import Img from '../../atoms/img/Img.atom.vue'; import ModalListDocuments from '../../molecules/modals/list-documents/ModalListDocuments.molecule.vue';
import TooltipIcon from '../../atoms/tooltip-icon/TooltipIcon.atom.vue';
const ButtonAtom = defineAsyncComponent(() => import('../../atoms/button/Button.atom.vue'));
const FormTrd = defineAsyncComponent(() => import('../../organisms/form-trd/FormTrd.organism.vue'));
const ModalAssignFiling = defineAsyncComponent(() => import('../../molecules/modals/modal-assign-filing/ModalAssignFiling.molecule.vue'));
const ModalResponseFiling = defineAsyncComponent(() => import('../../molecules/modals/modal-response-filing/ModalResponseFiling.molecule.vue'));
const ModalPdfViewer = defineAsyncComponent(() => import('../../molecules/modals/modal-pdf-viewer/ModalPdfViewer.molecule.vue'));
const ModalAlert = defineAsyncComponent(() => import('../../molecules/modals/alert/ModalAlert.molecule.vue'));
const ModalConfirmation = defineAsyncComponent(() => import('../../molecules/modals/confirmation/ModalConfirmation.molecule.vue'));

// Import services
import { accessStore } from "../../../store/index.ts";
import UtilsServices from '../../../services/UtilsServices.ts';
import hasPermissions from '../../../guards/hasPermissions.guard';
import ModalActionMolecule from '../../molecules/modals/modal-action/ModalAction.molecule.vue';

// Define props and emits and setup
const emits = defineEmits(['sendDataEditorModalAssignFiling', 'sendDataEditor','emitDocSelected']);
const props: any = defineProps(['dataFiling']);
const { t,te } = useI18n();
const store: any = accessStore();

// Define constants
const filingFocused: any = ref('');
const aceptedMessage: any = ref([
    'review_filing',
    'approve_filing',
    'sign_filing',
    'rejected_filing',
    'assigned_record',
    'revert_record',
])

const dataTooltipIcons: any = ref([
  {
    text: `${t("view")} ${t("radication").toLowerCase()}`,
    src: '/Buttons/icon-view.svg',
    color: 'blue',
    alt: 'view',
    show: (data: any) => { return data.documents.length >= 0 },
    onClick: ({filing = {documents: ""}, index = 0}) => { props.dataFiling.openModalListDocuments(filing?.documents,index) },
  },
])

const filteredTrazability: any = computed(() => {
    return props.dataFiling.dataLineHistory.filter(
        (history: any) => aceptedMessage.value.includes(history?.description)
    ).map((history: any) => {
        return {
            user1: history?.userName,
            description: history?.description,
            user2: history?.userAsigned
    }});
});

onMounted(() => {
    props.dataFiling.redirectTrazability();
    props.dataFiling.dataFormTrd.isDisabled = !hasPermissions.validator('update_trd_filing');
})

function sendDataEditorModalAssignFiling(data: any) {
    emits('sendDataEditorModalAssignFiling', data)
}
function getSendDataEditor(data: any) {
    emits('sendDataEditor', data)
}
function emitDocSelected(file: any) {
    emits('emitDocSelected', file);
}
</script>
<style scoped src="./Filing.template.scss"></style>