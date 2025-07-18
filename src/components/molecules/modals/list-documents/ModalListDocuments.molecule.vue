<!-- 
    dataModalListDocuments:{
        onlyView: false,
        isActive: false,
        closeModal :()=>{},
    }

    @emitDocSelected = "emitDocSelected"
-->

<template>
    <article :class="'list-documents list-documents--' + (dataModalListDocuments.isActive ? 'show' : 'hidde')">
        <section
            :class="'list-documents__content list-documents__content--' + (dataModalListDocuments.isActive ? 'show' : 'hidde')">
            <h1 class="list-documents__content__title">{{ t('list_of_documents') }}</h1>
            <table class="table">
                <thead class="table__row table--header">
                    <th class="table__row__cell">{{ t('name') }}</th>
                    <th class="table__row__cell">{{ t('actions') }}</th>
                </thead>
                <tbody class="table__row table--only-row" v-if="uploadedFiles.length === 0">
                    <td class="table__row__cell">{{ t('without_data') }}</td>
                </tbody>
                <tbody v-for="(file, index) in uploadedFiles" :key="index" class="table__row">
                    <td class="table__row__cell table__row__cell--left-align">
                        {{ file.name }}
                    </td>
                    <td class="table__row__cell table__row--img">
                        <TooltipIcon v-if="dataTooltipIcons[0].show(file)" :dataTooltipIcon="dataTooltipIcons[0]" @click="dataTooltipIcons[0].onClick({index: index, file: file})"/>
                        <TooltipIcon v-if="dataTooltipIcons[1].show(file)" :dataTooltipIcon="dataTooltipIcons[1]" @click="dataTooltipIcons[1].onClick({index: index, file: file})"/>
                        <TooltipIcon v-if="dataTooltipIcons[2].show(file)" :dataTooltipIcon="dataTooltipIcons[2]" @click="dataTooltipIcons[2].onClick({index: index, file: file})"/>
                    </td>
                </tbody>
            </table>
            <nav class="list-documents__content__nav">
                <Button class="list-documents__content__nav__button" :dataButton="dataButtonUpload"
                    v-if="dataModalListDocuments.onlyView == null || dataModalListDocuments.onlyView == false" />
                <Button class="list-documents__content__nav__button" :dataButton="dataButtonSave" />
            </nav>
        </section>
        <input type="file" ref="fileInput" @change="handleFileChange" style="display: none" multiple />
    </article>
</template>

<script setup lang="ts">

import { ref, reactive, watch } from 'vue';
import { accessStore } from '../../../../store';
import { useI18n } from 'vue-i18n';
import Button from '../../../atoms/button/Button.atom.vue';
import DataFlowServices from '../../../../services/DataFlowServices';
import TooltipIcon from '../../../atoms/tooltip-icon/TooltipIcon.atom.vue';

const { t } = useI18n();
const store = accessStore();
const props: any = defineProps(["dataModalListDocuments"]);
const emit = defineEmits(['emitDocs', 'emitDocSelected']);

const fileInput = ref<HTMLElement | null>(null);
let uploadedFiles: any = reactive(store.uploadedFiles);

const dataButtonSave: any = ref({
    className: '',
    text: validateTextButton(),
    alt: 'save',
    url: validateIconButton(),
    reverse: false,
    disabled: false,
    iconSize: validateSizeButton(),
    onClick: () => { props.dataModalListDocuments.closeModal() }
});

const dataButtonUpload: any = ref({
    className: 'blue',
    text: 'upload',
    alt: 'upload',
    url: '/Buttons/icon-upload.svg',
    reverse: true,
    disabled: false,
    onClick: () => { triggerFileInput() }
});

const dataTooltipIcons: any = ref([
    {
        text: `${t("view")} ${t("file")}`,
        src: '/Buttons/icon-view.svg',
        color: 'blue',
        alt: 'view',
        show: (data: any) => { return data?.url == null || store.isPdfUrl(data?.url); },
        onClick: ({index = 0, file = ""}) => { getPdfViewer(index) },
    },
    {
        text: `${t("delete")} ${t("file")}`,
        src: '/Buttons/icon-delete.svg',
        color: 'red',
        alt: 'delete',
        show: (data: any) => { return validateCondition();},
        onClick: ({index = 0, file = ""}) => { removeFile(index) },
    },
    {
        text: `${t("download")} ${t("file")}`,
        src: '/download.svg',
        color: '',
        alt: 'download',
        show: (data: any) => { return !validateCondition();},
        onClick: ({index = 0, file = ""}) => { downloadDocument(file) },
    }
]);

function validateCondition() {
    let ans: any = false;
    if(props.dataModalListDocuments.onlyView == null || props.dataModalListDocuments.onlyView == false)
        ans = true;
    return ans;
}

function downloadDocument(file: any) {
    DataFlowServices.downloadDocument(file)
        .catch((error: any) => {
            console.error(error);
        })
}

function triggerFileInput() {
    fileInput.value?.click();
}
function removeFile(index: number) {
    store.removeUploadedFile(index);
}

function validateSizeButton(): string {
    if (props.dataModalListDocuments.onlyView == null || props.dataModalListDocuments.onlyView == false) {
        return 'large'
    } else {
        return 'short'
    }
}

function validateIconButton(): string {
    if (props.dataModalListDocuments.onlyView == null || props.dataModalListDocuments.onlyView == false) {
        return '/Buttons/icon-save.svg'
    } else {
        return '/Buttons/decline.svg'
    }
}

function validateTextButton(): string {
    if (props.dataModalListDocuments.onlyView == null || props.dataModalListDocuments.onlyView == false) {
        return 'save'
    } else {
        return 'close'
    }
}

async function handleFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
        for (let i = 0; i < inputElement.files.length; i++) {
            const file = inputElement.files[i];
            await store.addUploadedFile(file);//Use  store for save all files elected about input file. check store for be used
        }

        inputElement.value = '';
    }
}

function getPdfViewer(file: any) {
    emit('emitDocSelected', file);
}

watch(() => store.uploadedFiles, (newValue: any, oldValue: any) => {
    uploadedFiles = store.getUploadedFiles()
});

</script>

<style scoped src="./ModalListDocuments.molecule.scss"></style>