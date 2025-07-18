<!--
     todo THIS IS A FIRST COMPONENT FUNCTIONALITY, HAD MANY INTERN FUNCTIONS, COULD BE IMPROVE 


    dataFilingForm: {
        stateLoadResponse: false,
        stateResponse: false,
        anonymousFiling: false,
        form: {
            subject: '',
            confidential_document: 'false', //must get string
        },
        response: {
            dataImgQR: {
                id: '',
                name: '',
                class: '',
                src: '',
                type: 'png',
                alt: '',
                onClick: () => { }
            },
            filing_code: '',
            document: '',
            filing_date: '',
            remitter: '',
            type_of_filing: '',

        },
        dataInputFiles: {
            counterFiles: filesArrayFilingForm.value.length,
            openModalDocs: () => {
                openModalListDocuments()
            },
            dataModalListDocuments: {
                isActive: false,
                closeModal: () => {
                    closeModalListDocuments();
                },
            }
        },
    },



?      function emitDocSelected(file: any) {
?          emits('emitDocSelected', file);
?      }




todo If you dont need some key, just dont put on json, dont gonna be on html and dont get error








-->

<template>
    <article class="filing-form">
        <section :class="'filing-form__form filing-form__form--' + (dataFilingForm?.stateResponse ? 'hidde' : '')">
            <ul
                :class="'filing-form__form__container' + (dataFilingForm?.stateLoadResponse ? ' loading-component' : '')">
                <li class="filing-form__form__container__card">
                    <input type="text" v-model="dataFilingForm.form.subject" placeholder="Asunto" required>
                </li>
                <li v-if="typeof dataFilingForm.form.tracking_number !== 'undefined' || (typeof dataFilingForm.form.tracking_number != 'undefined' && dataFilingForm.anonymousFiling)" class="filing-form__form__container__card">
                    <input type="number" v-model="dataFilingForm.form.tracking_number" placeholder="Número de páginas" required>
                </li>
                <li v-if="typeof dataFilingForm.form.address !== 'undefined' || (typeof dataFilingForm.form.address != 'undefined' && dataFilingForm.anonymousFiling)" class="filing-form__form__container__card">
                    <input type="text" v-model="dataFilingForm.form.address" placeholder="Direccion" required>

                </li>
                <li v-if="typeof dataFilingForm.form.phone_number !== 'undefined' || (typeof dataFilingForm.form.phone_number != 'undefined' && dataFilingForm.anonymousFiling)" class="filing-form__form__container__card">
                    <input type="text" v-model="dataFilingForm.form.phone_number" placeholder="Numero celular" required>

                </li>
                <li
                v-if="typeof dataFilingForm.form.presentation_mode !== 'undefined' || (typeof dataFilingForm.form.presentation_mode != 'undefined' && dataFilingForm.anonymousFiling)" class="filing-form__form__container__card">
                    <select v-model="dataFilingForm.form.presentation_mode" required>
                        <option selected disabled value="">{{ t('select_presentation_mode') }}</option>
                        <option value="4">{{ t('electronic_media') }}</option>
                        <option value="2">{{ t('verbal') }}</option>
                        <option value="3"> {{t('telephonic') }}</option>
                        <option value="1"> {{t('written') }}</option>
                    </select>
                </li>
                <li v-if="typeof dataFilingForm.form.response_mode !== 'undefined' || (typeof dataFilingForm.form.response_mode != 'undefined' && dataFilingForm.anonymousFiling)" class="filing-form__form__container__card">
                    <select v-model="dataFilingForm.form.response_mode" required>
                        <option selected disabled value="">{{ t('select_response_mode') }}</option>
                        <option value="001">{{ t('e-mail') }}</option>
                        <option value="002">{{ t('physical_correspondence') }}</option>
                    </select>
                </li>
                <li v-if="typeof dataFilingForm.form.email !== 'undefined' || (typeof dataFilingForm.form.email != 'undefined' && dataFilingForm.anonymousFiling)" class="filing-form__form__container__card">
                    <input type="text" v-model="dataFilingForm.form.email" placeholder="Correo" required>

                </li>
                
                <li class="filing-form__form__container__card">
                    <InputFiles :dataInputFiles="dataFilingForm.dataInputFiles" @emitDocSelected="emitDocSelected" />
                </li>
                <li class="filing-form__form__container__card" v-if="typeof dataFilingForm.form.confidential_document !== 'undefined' ">
                    <textarea :placeholder=" t('verbal_message')"></textarea>
                </li>
                <li v-if="typeof dataFilingForm.form.confidential_document !== 'undefined'"> 
                    <p for="">Documento confidencial?</p>
                    <input type="checkbox" v-model="dataFilingForm.form.confidential_document">
                </li>
                <li v-if="typeof dataFilingForm.dataEditorText !== 'undefined'" class="filing-form__form__container__editor">
                    <EditorText :dataEditorText="dataFilingForm.dataEditorText"   @sendDataEditor="getSendDataEditor"/>
                </li>
            </ul>
        </section>
        <section class="filing-form__response" v-if="dataFilingForm?.stateResponse">
            <h1 class="filing-form__response__title">Radicación creada correctamente!
            </h1>
            <ul class="filing-form__response__content">
                <li class="filing-form__response__content__img">
                    <Img :dataImg="dataFilingForm.response.dataImgQR" />
                </li>
                <li class="filing-form__response__content__card">
                    <p>Codigo de radicación: {{ dataFilingForm.response.filing_code }}</p>
                    <p>Nombre del archivo: {{ dataFilingForm.response.document }}</p>
                    <p>Fecha de radicación: {{ dataFilingForm.response.filing_date }}</p>
                    <p>Remitente: {{ dataFilingForm.response.remitter }}</p>
                    <p>Tipo de radicación: {{ dataFilingForm.response.type_of_filing }}</p>
                </li>
            </ul>
        </section>
    </article>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import EditorText from '../../molecules/editor-text/EditorText.molecule.vue';
import Img from '../../atoms/img/Img.atom.vue';
import InputFiles from '../../molecules/input-files/InputFiles.molecule.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps(['dataFilingForm']);

const emits = defineEmits(['emitDocSelected','sendDataEditor']);



onMounted(()=>{

});

function validateTypeOfFiling(){

}
function emitDocSelected(file: any) {
    emits('emitDocSelected', file);
}
function getSendDataEditor(data: any) {
    emits('sendDataEditor', data)
}
</script>
<style src="./FilingForm.organism.scss" scoped></style>