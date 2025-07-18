<!-- 
    dataModalResponseFiling: {
        isActive: false,
        idRemitter:'',
        subject:'',
        stateLoadForm:false,
        stateViewPdf: false,
        stateViewDocument: false,
        stateViewResume: false,
        contentDocument: '',
        dataSelectListActionUsers: {
            typeOfFinalAction: '',
            stateEditorText: false,
            usersSelecteds: [],
            users: [],
        },
        dataButtonNext:
        {
            className: 'blue',
            text: 'next',
            disabled: false,
            onClick: () => { validateNavigationNext() }
        },
        dataButtonBack:
        {
            className: '',
            text: 'back',
            disabled: false,
            onClick: () => { validateNavigationBack() }
        },
        dataEditorText: {
            dataEditor: { // properties for the editor
                setData: () => { },
                content: '',
            },
        },
        dataPdfViewer : {
            urlPdf: ,
            toolbar: {
                
            },
            onClose :()=>{
                
            }
        }
    },
 -->
<template>
    <div
        :class="'modal-response-filing__background modal-response-filing__background--' + (dataModalResponseFiling.isActive ? 'show' : '')">
        <article
            :class="'modal-response-filing modal-response-filing--' + (dataModalResponseFiling.isActive ? 'show' : '') + (dataModalResponseFiling.stateLoadForm ? ' loading-component' : '')">
            <nav class="modal-response-filing__container-header"
                v-if="dataModalResponseFiling.stateViewFile != 'step123' || !dataModalResponseFiling.dataSelectListActionUsers.stateEditorText">
                <h2 class="modal-response-filing__container-header__title">
                    {{ t('welcome_to_the_response_module') }}</h2>
                <ol class="modal-response-filing__container-header__content-process">
                    <li :class="stepByStepClassComputed">
                    </li>
                    <li
                        :class="'modal-response-filing__container-header__content-process__pointer modal-response-filing__container-header__content-process__pointer--' + (dataModalResponseFiling.stateViewFile.includes('step1') ? 'focused' : '')"
                        :style="{'--bg-color': bgColor[0]}">
                        1
                    </li>
                    <li
                        :class="'modal-response-filing__container-header__content-process__pointer modal-response-filing__container-header__content-process__pointer--' + (dataModalResponseFiling.stateViewFile.includes('step12') ? 'focused' : '')"
                        :style="{'--bg-color': bgColor[1]}">
                        2
                    </li>
                    <li
                        :class="'modal-response-filing__container-header__content-process__pointer modal-response-filing__container-header__content-process__pointer--' + (dataModalResponseFiling.stateViewFile.includes('step123') ? 'focused' : '')"
                        :style="{'--bg-color': bgColor[2]}">
                        3
                    </li>
                    <li
                        :class="'modal-response-filing__container-header__content-process__pointer modal-response-filing__container-header__content-process__pointer--' + (dataModalResponseFiling.stateViewFile.includes('step1234') ? 'focused' : '')"
                        :style="{'--bg-color': bgColor[3]}">
                        4
                    </li>
                    <li
                        :class="'modal-response-filing__container-header__content-process__pointer modal-response-filing__container-header__content-process__pointer--' + (dataModalResponseFiling.stateViewFile.includes('step12345') ? 'focused' : '')"
                        :style="{'--bg-color': bgColor[4]}">
                        5
                    </li>
                </ol>
            </nav>
            <section class="modal-response-filing__actions" v-if="dataModalResponseFiling.stateViewFile == 'step1'">
                <div class="modal-response-filing__actions__content" v-if="dataModalResponseFiling.contentDocument!=null && dataModalResponseFiling.contentDocument != ''" >
                    <h3 class="modal-response-filing__actions__content__title">{{ t('observation_of_the_request') }} :</h3>
                    <p class="modal-response-filing__actions__content__message"  v-if="dataModalResponseFiling.contentDocument!=null && dataModalResponseFiling.contentDocument != ''">{{ dataModalResponseFiling.contentDocument }}</p>
                    <p class="modal-response-filing__actions__content__message"  v-else>{{ t('no_message')}}</p>
                </div>
                 <PdfViewerAtom :dataPdfViewer="dataModalResponseFiling.dataPdfViewer" v-if="dataModalResponseFiling.stateViewPdf"
                     />
            </section>
            <section class="modal-response-filing__actions" v-if="dataModalResponseFiling.stateViewFile == 'step12'">
                <SelectAtom :dataSelect="dataSelectRemitters" />
                <SelectListActionUsersOrganism
                    :dataSelectListActionUsers="dataModalResponseFiling.dataSelectListActionUsers" />
            </section>
            <section class="modal-response-filing__document" v-if="dataModalResponseFiling.stateViewFile == 'step123'">
                <input type="text" name="" id="" :placeholder="t('subject')" class="modal-response-filing__document__subject"
                    required v-model="dataModalResponseFiling.subject">
                <nav class="modal-response-filing__document__file" @dragover.prevent @drop.prevent="handleDrop"
                    @click="triggerFileInput" v-if="!dataModalResponseFiling.dataSelectListActionUsers.stateEditorText">
                    <p v-if="!fileName">{{ t("drag_and_drop_a_file_here_or_click_to_upload") }}</p>
                    <p v-else>{{ fileName }}</p>
                    <input type="file" id="input-file-form-drop" ref="fileInput" @change="handleFileChange" :style="'display: none;'"
                        :placeholder="t('write_something') + '...'" class="input input--form" name="subject">
                </nav>
                <DocumentCreatorOrganism v-else :dataDocumentCreator="dataModalResponseFiling.dataDocumentCreator"
                    @sendDataEditor="getSendDataEditor" />
            </section>
           
                <FormTrdOrganism :dataFormTrd="dataModalResponseFiling.dataFormTrd" v-if="dataModalResponseFiling.stateViewFile == 'step1234'" />
            <section class="modal-response-filing__document"
                v-if="dataModalResponseFiling.stateViewFile == 'step12345'">
                <ResumeFilingOrganism :dataResumeFiling="dataModalResponseFiling.dataResumeFiling" />
            </section>
            <nav class="modal-response-filing__navegation">
                <Img class="modal-response-filing__navegation__img"
                    :dataImg="dataModalResponseFiling.dataImgGoToBack" />
                <Button class="modal-response-filing__navegation__button"
                    :dataButton="dataModalResponseFiling.dataButtonBack"
                    v-if="dataModalResponseFiling.stateViewFile != 'step12345'" />
                <Button class="modal-response-filing__navegation__button"
                    :dataButton="dataModalResponseFiling.dataButtonNext"
                    v-if="dataModalResponseFiling.stateViewFile != 'step12345'" />
            </nav>
        </article>
    </div>
</template>
<script setup lang="ts">

import SelectListActionUsersOrganism from '../../../organisms/select-list-action-users/SelectListActionUsers.organism.vue';
import SelectAtom from '../../../atoms/select/Select.atom.vue';
import Button from '../../../atoms/button/Button.atom.vue';
import Img from '../../../atoms/img/Img.atom.vue';
import { useI18n } from 'vue-i18n';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import PdfViewerAtom from '../../../atoms/pdf-viewer/PdfViewer.atom.vue';
import FormTrdOrganism from '../../../organisms/form-trd/FormTrd.organism.vue';
import ResumeFilingOrganism from '../../../organisms/resume-filing/ResumeFiling.organism.vue';
import DocumentCreatorOrganism from '../../../organisms/document-creator/DocumentCreator.organism.vue';
import UtilsServices from '../../../../services/UtilsServices';
import UserService from '../../../../services/UserServices';

const bgColor: any = ref(UtilsServices.colorGenerator(5, [0, 108, 216], [255, 147, 39]))
const { t } = useI18n();
const props: any = defineProps(['dataModalResponseFiling']);
const emits: any = defineEmits(['sendDataEditor']);
const dataSelectRemitters: any = reactive({
    id: '',
    name: '',
    className: '',
    disabled: false,
    onChange: (data: any) => {
    },
    onClick: () => { },
    placeholder: 'sssssss',
    model: props.dataModalResponseFiling.idRemitter,
    required: false,
    options: [
    ]
})
const stateClassMap: any = {
    step12: 'step12',
    step123: 'step123',
    step1234: 'step1234',
    step12345: 'step12345',
};
onMounted(() => {
    callServices()
    setDefaultRemitter()
})
const stepByStepClassComputed = computed(() => {
    const baseClass: string = 'modal-response-filing__container-header__content-process__line';
    const dynamicClass = stateClassMap[props.dataModalResponseFiling.stateViewFile] || '';
    return `${baseClass} ${baseClass}--${dynamicClass}`;
});
const triggerFileInput = () => {
    (document.getElementById('input-file-form-drop') as HTMLInputElement)?.click();
};
function setDefaultRemitter() {
    dataSelectRemitters.model = props.dataModalResponseFiling.idRemitter
}
const fileName = ref<string | null>(null);

function getSendDataEditor(data: any) {
    emits('sendDataEditor', data)
}
const handleDrop = (event: DragEvent) => {
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
        fileName.value = files[0].name;
        const file = files[0];
        props.dataModalResponseFiling.contentDocument = file;
    }
};

// Manejador para el input file
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        fileName.value = file.name;
        props.dataModalResponseFiling.contentDocument = file;
    }
};

watch(() => props.dataModalResponseFiling.contentDocument, (newValue) => {
    if(!newValue)
        fileName.value = '';
})

function callServices() {
    UserService.getRemitters()
        .then((response: any) => {
            response.response.results.map((element: any) => {
                dataSelectRemitters.options.push({
                    value: element.email,
                    label: remitterName(element)
                })
            });
        })
        .catch((error: any) => {
            console.error(error)
        })
}
const remitterName = (remitter: any) => {
    if (!remitter) {
        return t('anonymous_person');
    }

    if (remitter.contact_name) {
        return remitter.contact_name;
    }

    if (remitter.first_name && remitter.last_name) {
        return `${remitter.first_name} ${remitter.last_name}`;
    }

    return remitter.email || t('anonymous_person');
};


watch(() => props.dataModalResponseFiling.idRemitter, (newValue: any, oldValue: any) => {
    dataSelectRemitters.model = newValue;
});

</script>
<style scoped src="./ModalResponseFiling.molecule.scss"></style>