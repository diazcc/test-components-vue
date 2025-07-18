<template>
  <section class="document-creator-page-body">
    <EditorTextAtom :data-editor="dataDocumentCreatorPageBody.dataEditor" @editorValue="getEditorValue"
      @onChange="setupEditorListeners" @sendDataEditor="getSendDataEditor"  @click="onClick"/>
  </section>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import EditorTextAtom from '../../editor-text/EditorText.atom.vue';

const props: any = defineProps(['editable', 'dataDocumentCreatorPageBody']);
const emits = defineEmits(['sendDataEditor', 'getDataBodyPage']);
const editorContent : Ref<any> = ref();

function getEditorValue(editor: any) {
  editorContent.value =editor;
  emits('getDataBodyPage', editor);
}
function getSendDataEditor(data: any) {
  emits('sendDataEditor', data);
}
function setupEditorListeners(editor: any) { //Review the position of this function, could be on editText.atom, this let us edit, have some bug
  
}
function onClick():void{
  emits('getDataBodyPage', editorContent.value);
  
}
</script>

<style scoped src="./DocumentCreatorPageBody.atom.scss"></style>