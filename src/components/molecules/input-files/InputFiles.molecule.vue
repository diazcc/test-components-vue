<!-- 
    TODO COMPONENT INPUT FILES
    
    ?structure:

    dataInputFiles:{
        counterFiles:0,
        openModalDocs: ()=>{
            ...dataModalListDocuments.isActive = true;
        },
        dataModalListDocuments:{
            isActive: false,
            closeModal: () => { ...dataInputFiles.dataModalListDocuments.isActive = false; },
        }
    },

    todo If you need get all files, search at STORE the state :
    ?   ----------- uploadedFiles -----------

    Value of uploadedFiles is saved on Modal List Documetns component




    -- !!!!!!!!!!!!!!!!!!  To get documents selected its by emit emitDocSelected(); !!!!!!!!!!!!!!!!!
-->

<template>
    <div class="input-files" @click="()=> {console.log('click'); handleClick();}">
        <p class="input-files__text">{{t('upload_files')}}</p>
        <p class="input-files__text">{{selectedFileName}}</p>
        <p class="input-files__counter" v-if="!useInputFiles">{{dataInputFiles?.counterFiles}}</p>
    </div>
    <ModalListDocuments  v-if="!useInputFiles" :dataModalListDocuments="dataInputFiles?.dataModalListDocuments"  @emitDocSelected = "emitDocSelected"/>
      <input v-else type="file" multiple style="display: none;" ref="fileInput" @change="handleFilesSelected" />
</template>
<script setup lang="ts">
import ModalListDocuments from '../../molecules/modals/list-documents/ModalListDocuments.molecule.vue';
import { useI18n } from 'vue-i18n';
import { accessStore } from '../../../store';
import {ref, watch} from 'vue';
const store = accessStore();
const { t } = useI18n();
const props = defineProps(['dataInputFiles', 'useInputFiles']);
const emits  = defineEmits(['emitDocSelected','change']);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFileName = ref<string>('');
function emitDocSelected(file: any) {
    emits('emitDocSelected', file);
}
watch(store.uploadedFiles, (newFiles: any, oldFiles:any) => {
    props.dataInputFiles.counterFiles = newFiles.length;
    if (props.useInputFiles && newFiles.length === 1) {
      selectedFileName.value = newFiles[0].name;
    }
});
function handleClick() {
  if (props.useInputFiles) {
    fileInput.value?.click();
  } else {
    props.dataInputFiles.openModalDocs();
  }
}

function handleFilesSelected(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    const fileList = Array.from(files);
    store.uploadedFiles = fileList; // actualiza store
    selectedFileName.value = fileList.length === 1 ? fileList[0].name : '';

    emits('change', e); // emite evento con lista de archivos
  }else {
    selectedFileName.value = '';
  }
}
</script>
<style scoped src="./InputFiles.molecule.scss"></style>