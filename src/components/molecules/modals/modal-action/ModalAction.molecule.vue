<!-- 
 
dataModalAction: {
    isActive: false,
    title: "",
    messageBox: false,
    dataButtonAction1: {
        className: 'red',
        text: '',
        alt: '',
        url: '',
        disabled: false,
        reverse: true,
        fontSize: '',
        onClick: ()=>{}
    },
    dataButtonAction2: {
        className: 'blue',
        text: '',
        alt: '',
        url: '',
        disabled: false,
        reverse: true,
        fontSize: '',
        onClick: ()=>{}
    },
    dataPdfViewer: {
        urlPdf: url_pdf,
        toolbar: { toolbar: false },
        onClose: () => { }
    },
    dataImg: {
        id :'',
        name:'close',
        class: 'icon-button',
        src: '/icon-close.svg',
        type: 'svg',
        alt: '',
        isActive: () => { }, // optional, currently used to add activate and deactivate the active class
        onClick: () => {}
    }
}, 

-->

<template>
    <article :class="'modal-action-background ' + (dataModalAction?.isActive ? 'show' : 'hidde')">
        <section :class="'modal-action-background__container ' + (dataModalAction?.isActive ? 'showContainer ' : 'hiddeContainer ')">
            <h1 class="modal-action-background__container__title">{{ t(dataModalAction.title) }}</h1>
            <a class="modal-action-background__container__content-pdf">
                <PdfViewer :dataPdfViewer="dataModalAction?.dataPdfViewer" v-if="dataModalAction?.isActive"/>
            </a>
            <div class="modal-action-background__container__comment-box">
                <div class="modal-action-background__container__comment-box__info">
                    <p>{{ t("click_here_to_add_comments") }}:</p>
                    <label class="modal-action-background__container__comment-box__info__checkbox-container">
                        <input type="checkbox" v-model="dataModalAction.messageBox"
                        class="modal-action-background__container__comment-box__info__checkbox-container__checkbox">
                        <span class="modal-action-background__container__comment-box__info__checkbox-container__checkmark"></span>
                    </label>
                </div>
                <div class="modal-action-background__container__comment-box__message" 
                    v-if="dataModalAction.messageBox">
                    <textarea :placeholder="t('comments')" v-model="dataModalAction.comments"></textarea>
                </div>
            </div>
            <nav class="modal-action-background__container__nav">
                <Button class="modal-action-background__container__nav__button" :dataButton="dataModalAction.dataButtonAction1"></Button>
                <Button class="modal-action-background__container__nav__button" :dataButton="dataModalAction.dataButtonAction2"></Button>
            </nav>
            <Img class="modal-action-background__container__icon" :dataImg="dataModalAction.dataImg"></Img>
        </section>
    </article>
</template>

<script setup lang="ts">
//imports
import { ref } from 'vue';
import Button from '../../../atoms/button/Button.atom.vue';
import PdfViewer from '../../../atoms/pdf-viewer/PdfViewer.atom.vue';
import Img from '../../../atoms/img/Img.atom.vue';
import { useI18n } from 'vue-i18n';

//eliminar
import { reactive } from 'vue';

// Conts
const { t } = useI18n();
const props = defineProps(['dataModalAction'])

//Pruebas
// const dataModalAction: any = reactive({
//     isActive: true,
//     title: "Inserte título de acción aquí",
//     messageBox: false,
//     dataButtonAction1: {
//         className: 'red',
//         text: 'Declinar',
//         alt: 'left-arrow',
//         url: '/Buttons/left-arrow.svg',
//         disabled: false,
//         reverse: false,
//         fontSize: '',
//         onClick: ()=>{}
//     },
//     dataButtonAction2: {
//         className: 'blue',
//         text: 'Aprobar',
//         alt: 'right-arrow',
//         url: '/Buttons/right-arrow.svg',
//         disabled: false,
//         reverse: true,
//         fontSize: '',
//         onClick: ()=>{}
//     },
//     dataPdfViewer: {
//         urlPdf: "",
//         toolbar: { toolbar: false },
//         onClose: () => { }
//     },
//     dataImgCerrar: {
//         id :'',
//         name:'close',
//         class: 'icon-button',
//         src: '/icon-close.svg',
//         type: 'svg',
//         alt: '',
//         isActive: () => { }, // optional, currently used to add activate and deactivate the active class
//         onClick: () => {}
//     }
// })

//Pruebas

</script>
<style scoped src="./ModalAction.molecule.scss"></style>