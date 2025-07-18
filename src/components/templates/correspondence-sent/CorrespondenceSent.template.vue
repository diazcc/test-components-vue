<template >
    <article class="correspondence-sent" v-if="dataCorrespondenceSent.stateViewFile==''">
        <nav class="correspondence-sent__nav">
            <h1 class="correspondence-sent__nav__title">
                {{t('requests')}}
            </h1>
            <Button v-if="(hasPermissions.validator('create_external_filing') && hasPermissions.validator('view_remitter'))  || hasPermissions.validator('create_internal_filing')" 
                class="correspondence-sent__nav__button" :dataButton="dataCorrespondenceSent.dataButtonNewFile"/>
        </nav>
        <TableCorrespondenceReceived :dataTableCorrespondenceReceived="dataCorrespondenceSent.dataTableCorrespondenceReceived" @codeFiling = "showPdf" />
        <Paginator :dataPaginator="dataCorrespondenceSent.dataPaginator" />
    </article>
    <article v-if="dataCorrespondenceSent.stateViewFile!='' " :class="'correspondence-sent-file ' + (dataCorrespondenceSent.stateResponseFiling ? 'loading-component':'')">
        <nav class="correspondence-sent-file__container-header" v-if="!dataCorrespondenceSent.dataSelectListActionUsers.stateEditorText ||  dataCorrespondenceSent.stateViewFile!='step1234567'">
            <h2 class="correspondence-sent-file__container-header__title">{{ t(dataCorrespondenceSent.title)}}</h2>
            <ol class="correspondence-sent-file__container-header__content-process">
                <li :class="stepByStepClassComputed">
                </li>
                <li :class="'correspondence-sent-file__container-header__content-process__pointer correspondence-sent-file__container-header__content-process__pointer--'+(dataCorrespondenceSent.stateViewFile.includes('step1') ? 'focused' :'')"
                    :style="{'--bg-color': bgColor[0]}">
                    1
                </li>
                <li :class="'correspondence-sent-file__container-header__content-process__pointer correspondence-sent-file__container-header__content-process__pointer--'+(dataCorrespondenceSent.stateViewFile.includes('step12') ? 'focused' :'')"
                    :style="{'--bg-color': bgColor[1]}">
                    2
                </li>
                <li :class="'correspondence-sent-file__container-header__content-process__pointer correspondence-sent-file__container-header__content-process__pointer--'+(dataCorrespondenceSent.stateViewFile.includes('step123') ? 'focused' :'')"
                    :style="{'--bg-color': bgColor[2]}">
                    3
                </li>
                <li :class="'correspondence-sent-file__container-header__content-process__pointer correspondence-sent-file__container-header__content-process__pointer--'+(dataCorrespondenceSent.stateViewFile.includes('step1234') ? 'focused' :'')"
                    :style="{'--bg-color': bgColor[3]}">
                    4
                </li>
                <li :class="'correspondence-sent-file__container-header__content-process__pointer correspondence-sent-file__container-header__content-process__pointer--'+(dataCorrespondenceSent.stateViewFile.includes('step12345') ? 'focused' :'')"
                    :style="{'--bg-color': bgColor[4]}">
                    5
                </li>
                <li :class="'correspondence-sent-file__container-header__content-process__pointer correspondence-sent-file__container-header__content-process__pointer--'+(dataCorrespondenceSent.stateViewFile.includes('step123456') ? 'focused' :'')"
                    :style="{'--bg-color': bgColor[5]}">
                    6
                </li>
                <li :class="'correspondence-sent-file__container-header__content-process__pointer correspondence-sent-file__container-header__content-process__pointer--'+(dataCorrespondenceSent.stateViewFile.includes('step1234567') ? 'focused' :'')"
                    :style="{'--bg-color': bgColor[6]}">
                    7
                </li>
                <li :class="'correspondence-sent-file__container-header__content-process__pointer correspondence-sent-file__container-header__content-process__pointer--'+(dataCorrespondenceSent.stateViewFile.includes('step12345678') ? 'focused' :'')"
                    :style="{'--bg-color': bgColor[7]}">
                    8
                </li>
            </ol>
        </nav>
        <section class="correspondence-sent-file__container"> 
            <section v-if="dataCorrespondenceSent.stateViewFile=='step1'" class="correspondence-sent-file__container__main">
                    <p class="correspondence-sent-file__container__main__title">{{t('please_select_the_action_you_wish_to_perform')}}</p>
                    <nav>
                        <Button v-if="hasPermissions.validator('create_internal_filing')" 
                            :dataButton="dataCorrespondenceSent.dataButtonCreateInternalFiling"/>
                        <Button v-if="hasPermissions.validator('create_external_filing') && hasPermissions.validator('view_remitter')"  
                            :dataButton="dataCorrespondenceSent.dataButtonCreateOutputFiling"/>
                    </nav>
            </section>
            <section v-if="dataCorrespondenceSent.stateViewFile=='step12'" class="correspondence-sent-file__container__main">
                    <p class="correspondence-sent-file__container__main__title">{{t('please_select_the_action_you_wish_to_perform')}}</p>
                    <nav>
                        <Button :dataButton="dataCorrespondenceSent.dataButtonRedirectToSearchRemitter"
                            v-if="hasPermissions.validator('view_remitter')"/>
                        <Button v-if="hasPermissions.validator('create_remitter')" 
                            :dataButton="dataCorrespondenceSent.dataButtonRedirectToCreateRemitter"/>
                    </nav>
            </section>
            <TableSearchRemitter v-if="dataCorrespondenceSent.stateViewFile=='step123'"
                                 class="correspondence-sent-file__container__search-remitter"  
                                 :dataTableRemitters="dataCorrespondenceSent.dataTableRemitters" @user="getUser"/>
            <SelectListActionUsers v-if="dataCorrespondenceSent.stateViewFile=='step1234'" 
                                   :dataSelectListActionUsers="dataCorrespondenceSent.dataSelectListActionUsers"/>
            <CreateRemitterForm v-if="dataCorrespondenceSent.stateViewFile=='step12345'" 
                                :dataCreateRemitterForm="dataCorrespondenceSent.dataCreateRemitterForm"/>
            <div v-if="dataCorrespondenceSent.stateViewFile=='step123456'"
                class="correspondence-sent-file__container">
                <FormTrd  :dataFormTrd="dataCorrespondenceSent.dataFormTrd" />
                <nav class="correspondence-sent-file__container__type-response">
                    <label class="correspondence-sent-file__container__type-response__container" for="option">
                        <p>{{ t('upload_file') }}</p>
                        <input type="radio" name="option" id="" :value="false"
                            :checked="dataCorrespondenceSent.dataSelectListActionUsers?.stateEditorText ? false : true"
                            v-model="dataCorrespondenceSent.dataSelectListActionUsers.stateEditorText">
                    </label>
                    <label class="correspondence-sent-file__container__type-response__container" for="option">
                        <p>{{ t('create_file') }}</p>
                        <input type="radio" name="option" id="" :value="true"
                            :checked="dataCorrespondenceSent.dataSelectListActionUsers?.stateEditorText"
                            v-model="dataCorrespondenceSent.dataSelectListActionUsers.stateEditorText">
                    </label>
                </nav>
            </div>
            <section class="correspondence-sent-file__container__editor-container" v-if="dataCorrespondenceSent.stateViewFile=='step1234567'">
                <header  class="correspondence-sent-file__container__editor-container__header">
                    <p>{{t('subject')}}:</p>
                    <input type="text" v-model="dataCorrespondenceSent.subject" :placeholder="t('write_something')+'...'" class="input input--form" name="subject" required>
                </header>
                <nav class="correspondence-sent-file__container__editor-container__file"  @dragover.prevent  @drop.prevent="handleDrop" @click="triggerFileInput" v-if="!dataCorrespondenceSent.dataSelectListActionUsers.stateEditorText">
                        <p v-if="!fileName">{{ t("drag_and_drop_a_file_here_or_click_to_upload") }}</p>
                        <p v-else>{{ fileName }}</p>
                        <input type="file"  ref="fileInput"  @change="handleFileChange"  :style="'display: none;'"  :placeholder="t('write_something')+'...'" class="input input--form" name="subject">
                </nav>
                <DocumentCreator v-if="dataCorrespondenceSent.dataSelectListActionUsers.stateEditorText" :dataDocumentCreator="dataCorrespondenceSent.dataDocumentCreator" @sendDataEditor="getSendDataEditor" />
            </section>
            <ResumeFiling :dataResumeFiling="dataCorrespondenceSent.dataResumeFiling" v-if="dataCorrespondenceSent.stateViewFile=='step12345678'"/>
    </section>
        <nav  :class="'correspondence-sent-file__buttons-nav correspondence-sent-file__buttons-nav--' + (dataCorrespondenceSent.stateViewFile=='step1234567' || dataCorrespondenceSent.stateViewFile=='step1234' ? 'new-width':'')">
            <Img v-if="!shouldShowButton" :dataImg="dataCorrespondenceSent.dataImgGoToBack"
                 class="correspondence-sent-file__buttons-nav__img"/>
            <Button class="correspondence-sent-file__buttons-nav__button"
                    v-if="shouldShowButton" :dataButton="dataCorrespondenceSent.dataButtonGoToBack"/>
            <Button class="correspondence-sent-file__buttons-nav__button" 
                    v-if="shouldShowButton" :dataButton="dataCorrespondenceSent.dataButtonGoToNext"/>
        </nav>
    </article> 
    <ModalPdfViewer :dataModalPdfViewer="dataCorrespondenceSent.dataModalPdfViewer"  />
    <ModalConfirmation :dataModalConfirmation="dataCorrespondenceSent.dataModalConfirmation"/>
    <ModalAlert :dataModalAlert="dataCorrespondenceSent.dataModalAlert"/>
    <!-- This modal is a temporary solution for all the actions that dont require to cancel the current operation -->
    <ModalAlert :dataModalAlert="dataCorrespondenceSent.dataModalAlertTemp"/> 

</template>

<script setup lang="ts">
const FormTrd = defineAsyncComponent(() => import('../../organisms/form-trd/FormTrd.organism.vue'));
const CreateRemitterForm = defineAsyncComponent(() => import('../../organisms/create-remitter-form/CreateRemitterForm.organism.vue'));
const RequestForm = defineAsyncComponent(() => import('../../organisms/request-form/RequestForm.organism.vue'));

import { computed, defineAsyncComponent, ref, watch } from 'vue';
import TableCorrespondenceReceived from '../../organisms/table-correspondence-received/TableCorrespondenceReceived.organism.vue';
import Img from '../../atoms/img/Img.atom.vue';
import Paginator from "../../molecules/paginator/Paginator.molecule.vue";
import Button from '../../atoms/button/Button.atom.vue';
import TableSearchRemitter from '../../organisms/table-search-remitter/TableSearchRemitter.organism.vue';
import { useI18n } from 'vue-i18n';
import DocumentCreator from '../../organisms/document-creator/DocumentCreator.organism.vue';
import UtilsServices from '../../../services/UtilsServices';
import hasPermissions from '../../../guards/hasPermissions.guard';

const ResumeFiling = defineAsyncComponent(() => import('../../organisms/resume-filing/ResumeFiling.organism.vue'));
const SelectListActionUsers = defineAsyncComponent(() => import('../../organisms/select-list-action-users/SelectListActionUsers.organism.vue'));
const FilingFlow = defineAsyncComponent(() => import('../../organisms/filing-flow/FilingFlow.organism.vue'));
const FilingForm = defineAsyncComponent(() => import('../../organisms/filing-form/FilingForm.organism.vue'));
const ModalPdfViewer = defineAsyncComponent(() => import('../../molecules/modals/modal-pdf-viewer/ModalPdfViewer.molecule.vue'));
const ModalAlert = defineAsyncComponent(() => import('../../molecules/modals/alert/ModalAlert.molecule.vue'));
const ModalConfirmation = defineAsyncComponent(() => import('../../molecules/modals/confirmation/ModalConfirmation.molecule.vue'));
const { t } = useI18n();
const props: any = defineProps(['dataCorrespondenceSent']);
const emits = defineEmits(['codeFiling', 'user', 'fileFiling', 'emitDocs', 'emitDocSelected', 'dataEditor', 'sendDataEditor']);
const bgColor: any = ref(UtilsServices.colorGenerator(8, [0, 108, 216], [255, 147, 39]))


function showPdf(codeFiling: any) {
    emits('codeFiling', codeFiling);
}
function getUser(user: any) {
    emits('user', user);
}

function getFile(file: any) {
    emits('fileFiling', file);
}

function emitDocSelected(file: any) {
    emits('emitDocSelected', file);
}

function dataEditor(file: any) {
    emits('dataEditor', file);
}

function getSendDataEditor(data: any) {
    emits('sendDataEditor', data)
}
const stateClassMap: any = {
    step12: 'step12',
    step123: 'step123',
    step1234: 'step1234',
    step12345: 'step12345',
    step123456: 'step123456',
    step1234567: 'step1234567',
};

const shouldShowButton = computed(() => {
    
    return props.dataCorrespondenceSent.stateViewFile !== 'step1' &&
        props.dataCorrespondenceSent.stateViewFile !== 'step12' &&
        !props.dataCorrespondenceSent.stateResponseFiling &&
        props.dataCorrespondenceSent.stateViewFile !== 'step123' &&
        props.dataCorrespondenceSent.stateViewFile !== 'step12345678'

});

const stepByStepClassComputed = computed(() => {
    const baseClass: string = 'correspondence-sent-file__container-header__content-process__line';
    const dynamicClass = stateClassMap[props.dataCorrespondenceSent.stateViewFile] || '';
    return `${baseClass} ${baseClass}--${dynamicClass}`;
});

watch(() => props.dataCorrespondenceSent.contentDocument, (newValue) => {
    if(!newValue)
        fileName.value = '';
})

const fileName = ref<string | null>(null);

// Manejador cuando se suelta el archivo
const handleDrop = (event: DragEvent) => {
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
        fileName.value = files[0].name;
        const file = files[0];
        props.dataCorrespondenceSent.contentDocument = file;
    }
};

// Manejador para el input file
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        fileName.value = file.name;
        props.dataCorrespondenceSent.contentDocument = file;
    }
};

// Disparar el clic en el input file cuando se hace clic en el div
const triggerFileInput = () => {
    (document.querySelector('input[type="file"]') as HTMLInputElement)?.click();
};


</script>

<style scoped lang="scss" src="./CorrespondenceSent.template.scss"></style>