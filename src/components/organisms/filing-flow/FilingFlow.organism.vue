
<!-- 
    todo COMPONENT FLOW RADICATION WITH VIEW RESPONSE 


    dataFilingFlow: {
        stateResponseFiling: false, //start false because the workflow isnt complete
        stateCreatedFilin: true, //start true because the form is active but when is sending data to enpoint change to false
        stateViewFileAnonimous: false, //start false in case isnt anonimous filing , if is true , show all inputs
        dataFormFiling: { //structure for formData
            tracking_number: '',
            subject: '',
            confidential_document: '',
            validateLegalrep: '',
            legal_representative: '',
            presentation_mode: '',
            response_mode: '',
            remitter: '',
            address: '',
            phone_number: '',
            email: '',
        },
        dataResponse: { //This is for last view as response, show qr and the data necesary
            dataImgQR: {
                id: '',
                name: '',
                class: '',
                src: '',
                type: '',
                alt: '',
                onClick: () => { }
            },
            filing_code: '',
            filing_date: ' ',
            remitter: '',
            type_of_filing: '',
            subject: ''
        },
        downloadPdfQR :()=>{},
        downloadPdfCertificated :()=>{},
    }
-->

<!-- Nota hay que cambiar las palabras para que se puedan traducir -->

<template>
    <section class="filing__container__create-filing">
        <div
            :class="'filing__container__create-filing__form filing__container__create-filing__form--' + (dataFilingFlow.stateResponseFiling ? 'hidde' : '') + (dataFilingFlow.stateCreatedFilin ? '' : ' loading-component')">
            <p v-if="dataFilingFlow.stateViewFileAnonimous" class="filing__container__create-filing__form__title">{{
                t("create_anonymous_filing") }} </p>
            <p v-if="!dataFilingFlow.stateViewFileAnonimous" class="filing__container__create-filing__form__title">{{
                t("create_filing") }} </p>
            <div class="filing__container__create-filing__form__container">
                <ul class="filing__container__create-filing__form__container__content">
                    <li class="filing__container__create-filing__form__container__content__card">
                        <input type="text" v-model="dataFilingFlow.dataFormFiling.subject" :placeholder="t('subject')"
                        @input="event => validateLowercaseLetters(event, 'subject')" 
                        @blur="trimInputField($event, 'subject')"
                        required>
                    </li>
                    <li class="filing__container__create-filing__form__container__content__card">
                        <select v-model="dataFilingFlow.dataFormFiling.presentation_mode" required>
                            <option selected disabled value="">{{ t("select_presentation_mode") }}</option>
                            <option value="001">{{ t("written") }}</option>
                            <option value="002">{{ t("verbal") }}</option>
                            <option value="003">{{ t("telephonic") }}</option>
                            <option value="004">{{ t("electronic_media") }}</option>
                        </select>
                    </li>
                    <li class="filing__container__create-filing__form__container__content__card">
                        <select v-model="dataFilingFlow.dataFormFiling.response_mode" required>
                            <option selected disabled value="">{{ t("select_response_mode") }}</option>
                            <option value="001">{{ t("e-mail") }}</option>
                            <option value="002">{{ t("physical_correspondence") }}</option>
                        </select>
                    </li>
                    <li class="filing__container__create-filing__form__container__content__card"
                        v-if="dataFilingFlow.stateViewFileAnonimous">
                        <input type="text" v-model="dataFilingFlow.dataFormFiling.address" :placeholder="t('address')"
                            required>
                    </li>
                    <li class="filing__container__create-filing__form__container__content__card"
                        v-if="dataFilingFlow.stateViewFileAnonimous">
                        <input type="text" v-model="dataFilingFlow.dataFormFiling.phone_number"
                            :placeholder="t('phone_number')" 
                            @input="event => validatePhoneNumber(event, 'phone_number')" 
                            required>
                    </li>
                    <li class="filing__container__create-filing__form__container__content__card"
                        v-if="dataFilingFlow.stateViewFileAnonimous">
                        <input type="text" v-model="dataFilingFlow.dataFormFiling.email" :placeholder="t('email')" 
                        @input="event => validateEmail(event, 'email')" 
                        required>
                    </li>
                    <!-- <li class="filing__container__create-filing__form__content__card">
                        <p class="filing__container__create-filing__form__content__card__text">{{ t("confidential_document")
                            }}?</p>
                        <input type="checkbox" v-model="dataFilingFlow.dataFormFiling.confidential_document">
                    </li> -->
                    <li class="filing__container__create-filing__form__container__content__card"  v-if="typeModeResponse=='001' || typeModeResponse=='004'">
                        <InputFiles :dataInputFiles="dataFilingFlow.dataInputFiles" @emitDocSelected="emitDocSelected"/>
                    </li>
                </ul>
                <ul class="filing__container__create-filing__form__container__content">
                    <textarea class="filing__container__create-filing__form__container__content__text"
                        :placeholder="t('verbal_message')" v-model="dataFilingFlow.dataFormFiling.description"
                        maxlength="500" :required="typeModeResponse!='001' && typeModeResponse!='004'">
                    </textarea>
                </ul>
            </div>
        </div>
        <div class="filing__container__create-filing__response-filing">

            <h1 class="filing__container__create-filing__response-filing__title">Radicación creada correctamente!
            </h1>
            <ul class="filing__container__create-filing__response-filing__content">
                <li class="filing__container__create-filing__response-filing__content__img">
                    <Img :dataImg="dataFilingFlow.dataResponse.dataImgQR" />
                </li>
                <li class="filing__container__create-filing__response-filing__content__card">
                    <p><b>{{ t("filing_code") }}:</b> {{ dataFilingFlow.dataResponse.filing_code }}</p>
                    <p><b> {{ t("date_of_filing") }}:</b> {{ dataFilingFlow.dataResponse.filing_date }}</p>
                    <p><b>{{ t("remitter") }}:</b> {{ dataFilingFlow.dataResponse.remitter }}</p>
                    <p><b>{{ t("type_of_filing") }}:</b> {{ dataFilingFlow.dataResponse.type_of_filing }}</p>
                    <p><b>{{ t("presentation_mode") }}:</b> {{ dataFilingFlow.dataResponse.presentation_mode ?
                        t(dataFilingFlow.dataResponse.presentation_mode) : '' }}</p>
                </li>
                <nav class="filing__container__create-filing__response-filing__content__nav">
                        <!-- Ajustar posición de los botones -->
                    <Button v-for="(button, index) in VisibleButtons"
                        :key="index"
                        class="filing__container__create-filing__response-filing__content__nav__button"
                        :dataButton="button"/>
                </nav>
            </ul>
        </div>
    </section>
</template>
<script setup lang="ts">
import { computed, onMounted, Ref, ref, watch } from 'vue';
import Img from '../../atoms/img/Img.atom.vue';
import Button from '../../atoms/button/Button.atom.vue';
import InputFiles from '../../molecules/input-files/InputFiles.molecule.vue';

import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const typeModeResponse :Ref<any> =ref('') 

const props: any = defineProps(['dataFilingFlow', 'extraButtons'] );
const emits = defineEmits(['fileFiling', 'emitDocSelected']);

const buttons: any = ref([
    {   
        visible: props.dataFilingFlow.downloadPdfCertificated != undefined,
        button: {
            className: 'blue',
            text: 'certificate',
            alt: 'download',
            url: '/Buttons/icon-download.svg',
            iconSize: "large",
            reverse: true,
            disabled: false,
            onClick: () => { props.dataFilingFlow.downloadPdfCertificated(); }
        }
    },
    {   
        visible: props.dataFilingFlow.downloadPdfQR != undefined,
        button: {
            className: 'blue',
            text: 'QR',
            alt: 'download',
            url: '/Buttons/icon-download.svg',
            iconSize: "large",
            reverse: true,
            disabled: false,
            onClick: () => { props.dataFilingFlow.downloadPdfQR(); }
        }
    },
])

const VisibleButtons: any = computed(() =>{
    return buttons.value.filter((button:any) => button.visible).map((button:any) => button.button);
});

onMounted(() => {
    if (props.extraButtons instanceof Array){
        buttons.value = [...buttons.value, ...props.extraButtons.map((button : any) => {
            return {
                visible: true,
                button: button
            }
        })]
    }
})


const validateLowercaseLetters = (event: Event, field: 'subject') => {
  const target = event.target as HTMLInputElement;
  let value = target.value.toString();
  // Permite letras, números, espacios y signos de puntuación comunes
  value = value.replace(/[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ\s.,;:()\-_'"]/g, '');
  const cursorPosition = target.selectionStart;

  target.value = value;
  props.dataFilingFlow.dataFormFiling[field] = value;
  if (cursorPosition !== null) {
    target.setSelectionRange(cursorPosition, cursorPosition);
  }
};

// se agrega funcion para elimiar espacios al perder el foco, al salir del input

const trimInputField = (event: Event, field: 'subject') => {
  const target = event.target as HTMLInputElement;
  let value = target.value.trim(); // Elimina espacios al principio y al final

  // Actualizar el valor del modelo y del input
  props.dataFilingFlow.dataFormFiling[field] = value;
  target.value = value;
};

const validateEmail = (event: Event, field: 'email') => {
  const target = event.target as HTMLInputElement;
  let value = target.value;

  value = value.toLowerCase();
  value = value.replace(/[^a-z0-9@._-]/g, '');
  value = value.trimEnd();

  target.value = value;
  props.dataFilingFlow.dataFormFiling[field] = value;
};


const validatePhoneNumber = (event: Event, field: 'phone_number') => {
  const target = event.target as HTMLInputElement;
  let value = target.value;

  // Eliminar cualquier carácter que no sea número
  const numericValue = value.replace(/\D/g, '');
  const trimmedValue = numericValue.slice(0, 15);

  // Actualizar el valor del input
  target.value = trimmedValue;

  // Actualizar el modelo de datos
  props.dataFilingFlow.dataFormFiling[field] = trimmedValue;
};

function getFile(file: any) {//Get file by input file and emit
    const fileList: any = file.target.files;
    if (fileList.length > 0) {
        const file = fileList[0];
        emits('fileFiling', file);
    } else {
    }
}
function emitDocSelected(file: any) {
    emits('emitDocSelected', file);
}

watch(() => props.dataFilingFlow.dataFormFiling.presentation_mode, (newValue: any, oldValue: any) => {
    typeModeResponse.value = newValue; 
});
</script>
<style scoped src="./FilingFlow.organism.scss"></style>