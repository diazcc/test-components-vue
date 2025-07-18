<template>
    <div class="document-creator-page" :id="'document-creator-page-'+dataDocumentCreatorPage.page">
        <!-- <DocumentCreatorPageHeaderAtom :dataDocumentCreatorPageHeader="dataDocumentCreatorPage.dataDocumentCreatorPageHeader"  @getDataHeaderPage="getDataEditorHeader"/> AWAIT FOR DEV TEMPLATES -->
        <DocumentCreatorPageBodyAtom :dataDocumentCreatorPageBody="dataDocumentCreatorPage.dataDocumentCreatorPageBody"  @sendDataEditor="getSendDataEditor" @getDataBodyPage="getDataEditorBody"/>
        <!-- <DocumentCreatorPageFooterAtom :dataDocumentCreatorPageFooter="dataDocumentCreatorPage.dataDocumentCreatorPageFooter"  @getDataFooterPage="getDataEditorFooter"/> AWAIT FOR DEV TEMPLATES -->
    </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import DocumentCreatorPageHeaderAtom from '../../atoms/document-creator-page/document-creator-page-header/DocumentCreatorPageHeader.atom.vue';
import DocumentCreatorPageFooterAtom from '../../atoms/document-creator-page/document-creator-page-footer/DocumentCreatorPageFooter.atom.vue';
import DocumentCreatorPageBodyAtom from '../../atoms/document-creator-page/document-creator-page-body/DocumentCreatorPageBody.atom.vue';

const props = defineProps(['dataDocumentCreatorPage']);
const emits = defineEmits(['sendDataEditor','getDataHeaderPage','getDataFooterPage','getDataBodyPage']);

function getSendDataEditor(data: any) {
    emits('sendDataEditor', data)
}
function getDataEditorHeader(editor: any) {
    emits('getDataHeaderPage', editor)
}

function getDataEditorBody(editor: any) {
    emits('getDataBodyPage', editor)
}

function getDataEditorFooter(editor: any) {
    emits('getDataFooterPage', editor)
}

</script>
<style scoped src="./DocumentCreatorPage.molecule.scss"></style>