<template >
    <article class="correspondence-received" v-if="dataCorrespondenceReceived.state==''">
        <nav class="correspondence-received__nav">
            <h1 class="correspondence-received__nav__title">
                {{t('accepted')}}
            </h1>
            <Button v-if="hasPermissions.validator('create_inbound_filing') || hasPermissions.validator('create_anonymous_filing')"
                class="correspondence-received__nav__button" :dataButton="dataCorrespondenceReceived.dataButtonNewFile"/>
        </nav>
        <TableCorrespondenceReceived :dataTableCorrespondenceReceived="dataCorrespondenceReceived.dataTableCorrespondenceReceived" @codeFiling = "showPdf" @filingSelectedMenu="getFilingSelected" />
        <Paginator :dataPaginator="dataCorrespondenceReceived.dataPaginator" />
    </article>
    <article v-if="dataCorrespondenceReceived.state" class="correspondence-received-file">
        <nav class="correspondence-received-file__container-header">
            <h2 class="correspondence-received-file__container-header__title">{{t('welcome_to_the_radicacion_module')}}</h2>
            <ol class="correspondence-received-file__container-header__content-process">
                <li :class="stepByStepClassComputed">
                </li>
                <li :class="'correspondence-received-file__container-header__content-process__pointer correspondence-received-file__container-header__content-process__pointer--'+(dataCorrespondenceReceived.stateViewFile.includes('step1') ? 'focused' :'')"
                    :style="{'--bg-color': bgColor[0]}">
                    1
                </li>
                <li :class="'correspondence-received-file__container-header__content-process__pointer correspondence-received-file__container-header__content-process__pointer--'+(dataCorrespondenceReceived.stateViewFile.includes('step12') ? 'focused' :'')"
                    :style="{'--bg-color': bgColor[1]}">
                    2
                </li>
                <li :class="'correspondence-received-file__container-header__content-process__pointer correspondence-received-file__container-header__content-process__pointer--'+(dataCorrespondenceReceived.stateViewFile.includes('step123') ? 'focused' :'')"
                    :style="{'--bg-color': bgColor[2]}">
                    3
                </li>
                <li :class="'correspondence-received-file__container-header__content-process__pointer correspondence-received-file__container-header__content-process__pointer--'+(dataCorrespondenceReceived.stateViewFile.includes('step1234') ? 'focused' :'')"
                    :style="{'--bg-color': bgColor[3]}">
                    4
                </li>
                <li v-if="dataCorrespondenceReceived.stateViewFile=='step12345'"
                    :class="'correspondence-received-file__container-header__content-process__pointer correspondence-received-file__container-header__content-process__pointer--'+(dataCorrespondenceReceived.stateViewFile.includes('step12345') ? 'focused' :'')"
                    :style="{'--bg-color': bgColor[3]}">
                    5
                </li>
            </ol>
        </nav>
        <section class="correspondence-received-file__container"> 
            <section v-if="dataCorrespondenceReceived.stateViewFile=='step1'" class="correspondence-received-file__container__main">
                <p class="correspondence-received-file__container__main__title">{{t('please_select_the_action_you_wish_to_perform')}}</p>
                <nav>
                    <Button :dataButton="dataCorrespondenceReceived.dataButtonRedirectToSearchRemitter"/>
                    <Button v-if="hasPermissions.validator('create_remitter')" 
                        :dataButton="dataCorrespondenceReceived.dataButtonRedirectToCreateRemitter"/>
                    <Button v-if="hasPermissions.validator('create_anonymous_filing')"
                        :dataButton="dataCorrespondenceReceived.dataButtonRedirectToCreateFileAnonimous"/>
                </nav>
            </section>
            <TableSearchRemitter class="correspondence-received-file__container__search-remitter"  v-if="dataCorrespondenceReceived.stateViewFile=='step12'" :dataTableRemitters="dataCorrespondenceReceived.dataTableRemitters" @user="getUser"/>
            <CreateRemitterForm v-if="dataCorrespondenceReceived.stateViewFile=='step123'" :dataCreateRemitterForm="dataCorrespondenceReceived.dataCreateRemitterForm"/>
            <FilingFlow v-if="dataCorrespondenceReceived.stateViewFile=='step1234'" :dataFilingFlow="dataCorrespondenceReceived.dataFilingFlow" @fileFiling="getFile" @emitDocSelected = "emitDocSelected" :extraButtons="dataCorrespondenceReceived.extraButtons"/>
            <FormTrd v-if="dataCorrespondenceReceived.stateViewFile=='step12345'" :dataFormTrd="dataCorrespondenceReceived.dataFormTrd" />
            <!-- <div v-if="dataCorrespondenceReceived.adviceClasification.stateResponse" class="api-response">
                <h3>Sugerencia de Clasificación:</h3>
                <ul>
                    <li><strong>- Dependencia:</strong> {{ dataCorrespondenceReceived.adviceClasification.predicted_categories["Dependency"] }}</li>
                    <li><strong>- Serie:</strong> {{ dataCorrespondenceReceived.adviceClasification.predicted_categories["Series"] }}</li>
                    <li><strong>- Subserie:</strong> {{ dataCorrespondenceReceived.adviceClasification.predicted_categories["Subseries"] }}</li>
                    <li><strong>- Tipo Documental:</strong> {{ dataCorrespondenceReceived.adviceClasification.predicted_categories["Document Type"] }}</li>
                </ul>
            </div> -->
        </section>
        <nav  class="correspondence-received-file__buttons-nav">
            <Img v-if="dataCorrespondenceReceived.stateViewFile=='step1' || dataCorrespondenceReceived.stateViewFile=='step12'" 
                    class="correspondence-received-file__buttons-nav__img"
                    :dataImg="dataCorrespondenceReceived.dataImgGoToBack"/>
            <Button v-if="dataCorrespondenceReceived.stateViewFile!='step1' && dataCorrespondenceReceived.stateViewFile!='step12' || dataCorrespondenceReceived.dataFilingFlow.stateResponseFiling"
                    class="correspondence-received-file__buttons-nav__button"
                    :dataButton="dataCorrespondenceReceived.dataButtonGoToBack"/>
            <Button v-if="evaluateButtonView"
                    class="correspondence-received-file__buttons-nav__button"
                    :dataButton="dataCorrespondenceReceived.dataButtonGoToNext"/>
        </nav>
    </article> 
    <ModalPdfViewer :dataModalPdfViewer="dataCorrespondenceReceived.dataModalPdfViewer"  />
    <ModalConfirmation :dataModalConfirmation="dataCorrespondenceReceived.dataModalConfirmation"/>
    <ModalAlert :dataModalAlert="dataCorrespondenceReceived.dataModalAlert"/>
    <ModalAssignFiling :dataModalAssignFiling="dataCorrespondenceReceived.dataModalAssignFiling"  @sendDataEditorModalAssignFiling="sendDataEditorModalAssignFiling" />
    <ModalResponseFiling :dataModalResponseFiling="dataCorrespondenceReceived.dataModalResponseFiling" @sendDataEditor="getSendDataEditor" />
    <ModalResponseFile :dataModalResponseFile="dataCorrespondenceReceived.dataModalResponseFile" @sendDataEditor="getSendDataEditor" />
    <ModalAction :dataModalAction="dataCorrespondenceReceived.dataModalAction"/>
</template>

<script setup lang="ts">

// Import vue library
import { computed, defineAsyncComponent, onBeforeMount, onUpdated, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Impor components
import TableCorrespondenceReceived from '../../organisms/table-correspondence-received/TableCorrespondenceReceived.organism.vue';
import Paginator from "../../molecules/paginator/Paginator.molecule.vue";
import Img from '../../atoms/img/Img.atom.vue';
import Button from '../../atoms/button/Button.atom.vue';
import TableSearchRemitter from '../../organisms/table-search-remitter/TableSearchRemitter.organism.vue';

const FormTrd = defineAsyncComponent(() => import('../../organisms/form-trd/FormTrd.organism.vue'));
const CreateRemitterForm = defineAsyncComponent(() => import('../../organisms/create-remitter-form/CreateRemitterForm.organism.vue'));
const FilingFlow = defineAsyncComponent(() => import('../../organisms/filing-flow/FilingFlow.organism.vue'));
const ModalPdfViewer = defineAsyncComponent(() => import('../../molecules/modals/modal-pdf-viewer/ModalPdfViewer.molecule.vue'));
const ModalAlert = defineAsyncComponent(() => import('../../molecules/modals/alert/ModalAlert.molecule.vue'));
const ModalConfirmation = defineAsyncComponent(() => import('../../molecules/modals/confirmation/ModalConfirmation.molecule.vue'));
const ModalAssignFiling = defineAsyncComponent(() => import('../../molecules/modals/modal-assign-filing/ModalAssignFiling.molecule.vue'));
const ModalResponseFiling = defineAsyncComponent(() => import('../../molecules/modals/modal-response-filing/ModalResponseFiling.molecule.vue'));
const ModalResponseFile = defineAsyncComponent(() => import('../../molecules/modals/response-file/ModalResponseFile.molecule.vue'));
const ModalResponseEditor = defineAsyncComponent(() => import('../../molecules/modals/modal-response-editor/ModalResponseEditor.molecule.vue'));
const ModalAction = defineAsyncComponent(() => import('../../molecules/modals/modal-action/ModalAction.molecule.vue'))

// Import services
import hasPermissions from '../../../guards/hasPermissions.guard.ts';
import UtilsServices from '../../../services/UtilsServices.ts';

// Define emits and props and configuration
const { t } = useI18n();
const props :any =  defineProps(['dataCorrespondenceReceived']);
const emits = defineEmits(['codeFiling','sendDataEditor', 'user', 'fileFiling', 'emitDocs', 'emitDocSelected', 'dataEditor', 'sendDataEditorModalAssignFiling', 'sendDataEditorModalResponseEditor','filingSelectedMenu']);

// Define constants and variables
const stateClassMap: any = {
    step12: 'step12',
    step123: 'step123',
    step1234: 'step1234',
    step12345: 'step12345',
};

const evaluateButtonView: any = computed(() => {
    let ans: any = false;
    if(props.dataCorrespondenceReceived.dataFilingFlow.stateResponseFiling){
        ans = hasPermissions.validator('update_filing');
    } else {
        ans = props.dataCorrespondenceReceived.stateViewFile !='step1' && props.dataCorrespondenceReceived.stateViewFile!='step12';
    }
    return ans;
})

const bgColor: any = ref(UtilsServices.colorGenerator(4, [0, 108, 216], [255, 147, 39]));

function showPdf(codeFiling: any) {
  emits("codeFiling", codeFiling);
}
function getUser(user: any) {
  emits("user", user);
}
function getFilingSelected(data:any){
  emits("filingSelectedMenu", data);
}
function getFile(file: any) {
    emits('fileFiling', file);
}

function emitDocSelected(file: any) {
  emits("emitDocSelected", file);
}

function sendDataEditorModalAssignFiling(data: any) {
    emits('sendDataEditorModalAssignFiling', data)
}
function getSendDataEditor(data: any) {
    emits('sendDataEditor', data)
}

const stepByStepClassComputed = computed(() => {
    const baseClass: string = 'correspondence-received-file__container-header__content-process__line';
    const dynamicClass = stateClassMap[props.dataCorrespondenceReceived.stateViewFile] || '';
    return `${baseClass} ${baseClass}--${dynamicClass}`;
});

</script>

<style scoped lang="scss" src="./CorrespondenceReceived.template.scss"></style>