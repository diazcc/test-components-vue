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
    <div class="input-files" @click="dataInputFiles.openModalDocs">
        <p class="input-files__text">{{t('upload_files')}}</p>
        <p class="input-files__counter">{{dataInputFiles.counterFiles}}</p>
    </div>
    <ModalListDocuments :dataModalListDocuments="dataInputFiles.dataModalListDocuments"  @emitDocSelected = "emitDocSelected"/>
</template>
<script setup lang="ts">
import ModalListDocuments from '../../molecules/modals/list-documents/ModalListDocuments.molecule.vue';
import { useI18n } from 'vue-i18n';
import { accessStore } from '../../../store';
import {watch} from 'vue';
const store = accessStore();
const { t } = useI18n();
const props = defineProps(['dataInputFiles']);
const emits  = defineEmits(['emitDocSelected']);
function emitDocSelected(file: any) {
    emits('emitDocSelected', file);
}
watch(store.uploadedFiles, (newFiles: any, oldFiles:any) => {
    props.dataInputFiles.counterFiles = newFiles.length;
});



</script>
<style scoped src="./InputFiles.molecule.scss"></style>