<template>
    <footer class="document-creator-page-footer" :ref="footerElement">
        <EditorTextAtom :data-editor="dataDocumentCreatorPageFooter.dataEditor" @editorValue="getEditorValue"
            @sendDataEditor="getSendDataEditor" />
    </footer>
</template>
<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, Ref, ref } from 'vue';
import EditorTextAtom from '../../editor-text/EditorText.atom.vue';
import DocumentCreatorServices from '../../../../services/DocumentCreatorServices';
const props: any = defineProps(['editable']);
const emits = defineEmits(['sendDataEditor', 'getDataFooterPage'])
const footerElement: any = ref();
const dataDocumentCreatorPageFooter: any = reactive({
    dataEditor: {
        setData: () => { },
        content: ''
    },
});

onBeforeMount(() => {
    getFooterContentPage()
    callServices();
})
onMounted(() => {
})

function callServices() {
}

async function getFooterContentPage() {
    dataDocumentCreatorPageFooter.dataEditor.content = DocumentCreatorServices.getFooterContentPage();
}

function setDefaultValues(editor: any) {
    editor.setEditable(false);
}



function getEditorValue(editor: any) {
    setDefaultValues(editor); //Its called here because of this way we can get content (not value) of editor tip tap and do actions.
    emits('getDataFooterPage', editor)
}

function getSendDataEditor(data: any) {

    emits('sendDataEditor', data)
}

</script>

<style scoped src="./DocumentCreatorPageFooter.atom.scss"></style>