<!--
    Todo: COMPONENT MODAL PDF VIEWER REUSABLE
    ?To use this component, read carefully what it requires in order to handle the correct data and structure.
dataModalPdfViewer: {
            isActive: '', -- hidde or 'show'
            dataButtons: [
                { //This component is created at here because is standard for all modals
                    className: '',
                    text: 'Cerrar',
                    disabled: false,
                    onClick: () => { }
                },
                .... extras in props
            ]
            dataPdfViewer: {
                urlPdf: '',
                toolbar: {
                    ?toolbar: false ||
                    ?toolbar:{
                        ?toolbarViewerLeft: false || toolbarViewerRight: false, toolbarViewerMiddle : false,
                    ?}
                },
                onClose :()=>{
                    ?to use this function is for get event when close the modal or component where is called.
                    todo like this : dataModalPdfViewer.dataPdfViewer.onClose();
                }
            }

            },
-->
<template>
    <article :class="'alert-modal-pdf-viewer-background ' + dataModalPdfViewer?.isActive || 'hidde'">
        <section :class="['alert-modal-pdf-viewer-background__container ' + (dataModalPdfViewer?.isActive =='show' ? 'showContainer ' : 'hiddeContainer ')]">
            <a class="alert-modal-pdf-viewer-background__container__content-pdf">
                <PdfViewer :dataPdfViewer="dataModalPdfViewer?.dataPdfViewer" v-if="dataModalPdfViewer?.isActive =='show'"/>
            </a>
            <div class="alert-modal-pdf-viewer-background__container__nav">
                <Button class="alert-modal-pdf-viewer-background__container__nav__button" v-for="(dataButton) in dataButtons" :dataButton="dataButton"/>
            </div>
        </section>
    </article>
</template>
<script setup lang="ts">

import { onMounted, ref } from 'vue';
import Button from '../../../atoms/button/Button.atom.vue';
import PdfViewer from '../../../atoms/pdf-viewer/PdfViewer.atom.vue';

const props = defineProps(['dataModalPdfViewer']);
const closeDataButton: any = ref({
    className: '',
    text: 'Cerrar',
    url: '/Buttons/decline.svg',
    iconSize: 'short',
    disabled: false,
    onClick: () => {
        props.dataModalPdfViewer.isActive = 'hidde';
        props.dataModalPdfViewer.dataPdfViewer.urlPdf = '';
    }
});

const dataButtons: any = ref([]);

onMounted(() => {
    dataButtons.value = (props.dataModalPdfViewer?.dataButtons ? 
        [closeDataButton.value, ...props.dataModalPdfViewer?.dataButtons] : 
        [closeDataButton.value]);
});

</script>
<style scoped src="./ModalPdfViewer.molecule.scss"> 
</style>