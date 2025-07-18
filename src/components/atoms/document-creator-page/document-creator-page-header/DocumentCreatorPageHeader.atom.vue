<template>
    <header class="document-creator-page-header" :ref="headerElement">
        <EditorTextAtom :data-editor="dataDocumentCreatorPageHeader.dataEditor" @editorValue="getEditorValue"
            @sendDataEditor="getSendDataEditor" />
    </header>
</template>
<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, Ref, ref } from 'vue';
import EditorTextAtom from '../../editor-text/EditorText.atom.vue';
import DocumentCreatorServices from '../../../../services/DocumentCreatorServices';
const props: any = defineProps(['editable']);
const emits = defineEmits(['sendDataEditor', 'getDataHeaderPage'])
const headerElement: any = ref();
const dataDocumentCreatorPageHeader: any = reactive({
    dataEditor: {
        setData: () => { },
        content: ''
    },
});

onBeforeMount(() => {
    getHeaderContentPage()
    callServices();
})
onMounted(() => {
})

function callServices() {
}

async function getHeaderContentPage() {
    dataDocumentCreatorPageHeader.dataEditor.content = DocumentCreatorServices.getHeaderContentPage();
}

function setDefaultValues(editor: any) {
    editor.setEditable(false);
}

const arrayActions: any = reactive({
    actions: []
})


function getEditorValue(editor: any) {
    
    setDefaultValues(editor); //Its called here because of this way we can get content (not value) of editor tip tap and do actions.
    emits('getDataHeaderPage', editor)
}

function getSendDataEditor(data: any) {

    emits('sendDataEditor', data)
}

</script>
<style  src="./DocumentCreatorPageHeader.atom.scss"></style>