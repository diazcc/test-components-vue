<!-- 
    dataResumeFiling: {
                showDownloads:false,
                url: '',
                subject: '',
                filing_number: '',
                creation_date: '',
                email: '',
                response_mode: '',
                downloadPdfQR: () => {
                    downloadFilingPdfCertificated()
                },
                downloadPdfCertificated: () => {
                    downloadFilingPdfSticker()
                },
            },
 -->
<template>
    <section class="resume-filing">
            <h1 class="resume-filing__title">
                {{t('filing_created_successfully')}}
            </h1>
            <ul class="resume-filing__content">
                <li class="resume-filing__content__img">
                    <Img :dataImg="dataResumeFiling?.dataResponse?.dataImgQR" />
                </li>
                <li class="resume-filing__content__card">
                    <p><b>{{ t("filing_code") }}:</b> {{ dataResumeFiling?.dataResponse?.filing_code }}</p>
                    <p><b> {{ t("date_of_filing") }}:</b> {{ dataResumeFiling?.dataResponse?.filing_date }}</p>
                    <p><b>{{ t("remitter") }}:</b> {{ dataResumeFiling?.dataResponse?.remitter }}</p>
                    <p><b>{{ t("type_of_filing") }}:</b> {{ dataResumeFiling?.dataResponse?.type_of_filing }}</p>
                    <p><b>{{ t("presentation_mode") }}:</b> {{ dataResumeFiling?.dataResponse?.presentation_mode ?
                        t(dataResumeFiling?.dataResponse?.presentation_mode) : '' }}</p>
                </li>
                <nav class="resume-filing__content__nav">
                        <!-- Ajustar posición de los botones -->
                    <Button v-for="(button, index) in VisibleButtons"
                        :key="index"
                        class="resume-filing__content__nav__button"
                        :dataButton="button"/>
                </nav>
            </ul>
    </section> 
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed,ref } from 'vue';
import Button from '../../atoms/button/Button.atom.vue';

const { t, locale } = useI18n();

    const props :any = defineProps(['dataResumeFiling']);
    
const buttons: any = ref([
    {   
        visible: props.dataResumeFiling.downloadPdfCertificated != undefined,
        button: {
            className: 'blue',
            text: 'certificate',
            alt: 'download',
            url: '/Buttons/icon-download.svg',
            iconSize: "large",
            reverse: true,
            disabled: false,
            onClick: () => { props.dataResumeFiling.downloadPdfCertificated(); }
        }
    },
    {   
        visible: props.dataResumeFiling.downloadPdfQR != undefined,
        button: {
            className: 'blue',
            text: 'QR',
            alt: 'download',
            url: '/Buttons/icon-download.svg',
            iconSize: "large",
            reverse: true,
            disabled: false,
            onClick: () => { props.dataResumeFiling.downloadPdfQR(); }
        }
    },
])

    const VisibleButtons: any = computed(() =>{
        return buttons.value.filter((button:any) => button.visible).map((button:any) => button.button);
    });
</script>
<style scoped src="./ResumeFiling.organism.scss"></style>