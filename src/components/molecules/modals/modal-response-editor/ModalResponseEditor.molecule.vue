<!--
    Todo: COMPONENT MODAL PDF VIEWER REUSABLE
    ?To use this component, read carefully what it requires in order to handle the correct data and structure.

    dataModalResponseEditor: {
        isActive: false, // This key is used to turn the modal on and off.
        dataEditorText: {
            dataEditor: { // properties for the editor
                setData: () => { },
                content: '',
            },
        },
        dataButtonCancel: { // properties for the buttom cancel
            className: 'red',
            text: 'Cancelar',
            disabled: false,
            onClick: () => {
                closeModalResponseFiling()
            }
        },
        dataButtonSend: { // properties for the buttom send
            className: 'gray-blue',
            text: 'Enviar',
            disabled: false,
            onClick: () => {
                dataCorrespondenceReceived.dataModalAssignFiling.dataEditorText.dataEditor.setData(); // The "getData" function from the editor properties is passed as the value of the function.
            }
        }
    }

-->
<template>
    <article :class="'modal-response-editor modal-response-editor--' + (dataModalResponseEditor.isActive ? 'show' : 'hidde')">
        <section class="modal-response-editor__content">

            <h1 class="modal-response-editor__content__title">{{t('response')}}</h1>

            <input type="text" :placeholder="t('subject')" v-model="dataModalResponseEditor.affair">
            <article class="modal-response-editor__content__editor">
                <EditorText :dataEditorText="dataModalResponseEditor.dataEditorText" @sendDataEditor="getSendDataEditor"/>
            </article>
            
            <nav class="modal-response-editor__content__footer">
                <Button :dataButton="dataModalResponseEditor.dataButtonCancel" />
                <Button :dataButton="dataModalResponseEditor.dataButtonSend" />
            </nav>
        </section>
    </article>
</template>
<script setup lang="ts">
import EditorText from "../../editor-text/EditorText.molecule.vue";
import Button from "../../../atoms/button/Button.atom.vue";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps(['dataModalResponseEditor']);
const emits = defineEmits(['sendDataEditorModalResponseEditor'])


function getSendDataEditor(data: any) {  
    
    emits('sendDataEditorModalResponseEditor', data)
}

</script>
<style scoped src="./ModalResponseEditor.molecule.scss"></style>