<template>
    <Series :dataSeries="dataSeries"
     @applyFilters="applyFilters"/>
</template>

<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import Series from '../../templates/series/Series.template.vue';
import { onMounted, ref, reactive, watch } from 'vue';
import { useRouter } from "vue-router";
import TrdServices from '../../../services/TrdServices.ts';
import DataFlowServices from '../../../services/DataFlowServices.ts';
import FormValidators from '../../../validators/FormValidators.ts';
import UtilsServices from '../../../services/UtilsServices.ts';
import hasPermissions from '../../../guards/hasPermissions.guard';

const { t } = useI18n();

const filters: any = ref([
    'Filtro 1',
    'Filtro 2',
    'Filtro 3',
]);

const dataSeries: any = reactive({
    stateChoiceOption : false,
    stateFormCreate: false,
    stateLoadData: false,
    data: [],
    dataForm: {
        code: '',
        name: '',
        disabled: '',
        creation_date: '',
        disabled_date: ''
    },
    dataButtonNewSeries: {
        className: 'blue',
        text: 'new',
        alt: 'new',
        url: '/Buttons/icon-add.svg',
        reverse: true,
        disabled: false,
        onClick: () => {
            //setStateFormCreate();
            setChoiceOption()
        }
    },
    dataButtonRedirectToCreateSerie: {
        className: "gray-blue",
        text: "create_serie",
        disabled: false,
        onClick: () => {
        setStateFormCreate()
        },
    },
    dataButtonBulkUpload: {
        className: "gray-mouse-blue",
        text: "bulk_upload",
        disabled: false,
        onClick: () => {
        
        },
    },
    dataButtonBack: {
        className: 'gray',
        text: 'back',
        alt: 'left-arrow',
        url: '/Buttons/left-arrow.svg',
        reverse: false,
        disabled: false,
        onClick: () => {
            backToChoice();
        }
    },
    dataButtonNext: {
        className: 'blue',
        text: 'create',
        alt: 'create',
        url: '/Buttons/icon-create.svg',
        iconSize: 'large',
        reverse: true,
        disabled: false,
        onClick: () => {
            sendDataNewSerie();
        }
    },
    dataModalAlert: {
        isActive: '',
        dataButton: {
            className: '',
            text: 'Cerrar',
            disabled: false,
            onClick: () => {
                dataSeries.dataModalAlert.isActive = '';
            }
        },
        dataText: {
            classText: '',
            text: '',
            disabled: false,
            onClick: () => { }
        }
    },
    dataSelect: {
        id: '',
        name: '',
        className: '',
        disabled: false,
        onChange: (data: any) => {

        },
        onClick: () => { },
        placeholder: 'select_serie',
        model: '',
        options: [
            {
                value: '',
                label: ''
            }
        ]
    },
    dataModalConfirmation: {
        isActive: '',
        dataButton: {
            className: '',
            text: 'continue',
            disabled: false,
            onClick: () => {
                showModalConfirmation();
            }
        },
        dataText: {
            classText: '',
            text: 'Error, intentalo mas tarde.',
            disabled: false,
            onClick: () => { }
        }
    },
    dataInputSearch: {
        dataInput: {
            id: '',
            name: '',
            classInputEmail: '',
            model: '',
            type: '',
            placeholder: 'search',
            disabled: false,
            required: false,
            onClick: () => { },
            onChange: (value:any) => {
                getSeries(value, 1)
            },
        },
        dataImg: {
            id: '',
            name: '',
            class: ' icon',
            src: '/icon-lupa-general.svg',
            type: '',
            alt: '',
            onClick: () => { }
        }

    },
    dataPaginator: {
        page: 1,
        page_size: 10,
        total_pages: '',
        pagination_options: [
            {
                number: 10,
                active: false
            },
            {
                number: 20,
                active: false
            },
            {
                number: 30,
                active: false
            },
            {
                number: 50,
                active: false
            },
        ],
        getService: (value:any) => {
            getSeries(dataSeries.dataInputSearch.dataInput.model, value)
        }
    },
    dataMultiSelect: {
        title: "filters",
        model: [],
        options: filters.value.map((value: any) => ({
            text: value,
            value: value,
            checked: false
        }))
    },
    dataImgDownloadPdf: {
        id: '',
        name: '',
        class: 'icon-button',
        src: '/download-pdf.svg',
        type: 'png',
        alt: 'Download list of series in pdf',
        onClick: () => { downloadSeriesPdf() }
    },
    dataImgDownloadCSV: {
        id: '',
        name: '',
        class: 'icon-button',
        src: '/download-csv.svg',
        type: 'png',
        alt: '',
        onClick: () => { downloadSeriesCSV() }
    },
    dataImgGoToBack: {
        id: '',
        name: 'back',
        class: 'icon-back',
        src: '/arrow-left.svg',
        type: 'svg',
        alt: '',
        isActive: () => { }, // optional, currently used to add activate and deactivate the active class
        onClick: () => {
            validateNavegationBack();
        }
    },
    dataTooltipIcons: [
        {
            text: UtilsServices.capitalizeFirstLetter(`${t("delete")} ${t("serie")}`),
            src: '/Buttons/icon-delete.svg',
            color: 'red',
            alt: 'delete',
            show: (data: any) => { return hasPermissions.validator('delete_series') && data?.delete; },
            onClick: ({data = {code: 1}}) => { dataSeries.eliminateSerie(data?.code) },
        },
        {
            text: UtilsServices.capitalizeFirstLetter(`${t("edit")} ${t("serie")}`),
            src: '/Buttons/icon-edit.svg',
            color: 'blue',
            alt: 'edit',
            show: (data: any) => { return hasPermissions.validator('update_series') },
            onClick: ({data = {code: 1}}) => { dataSeries.updateSeries(data?.code) },
        },
    ],
    eliminateSerie: (id: any) => {
        eliminateSerie(id);
    },
    updateSeries: (id: any) => {
        console.log("updateSeries in construction", id);
    },
    processFileUpload: (file: any) => {
        openAndGetFile(file);
    }
});

onMounted(() => {
    getSeries("", 1);
});

watch(() => dataSeries.dataPaginator.page_size, () => {
    getSeries(dataSeries.dataInputSearch.dataInput.model, 1);
});


/**
 * todo GET & SET
 */

function resetForm(){
    dataSeries.dataForm = {
        code: '',
        name: '',
        disabled: '',
        creation_date: '',
        disabled_date: ''
    };
}

function getSeries(searched_value:any, page:any) {
    dataSeries.data = [];
    dataSeries.stateLoadData = true;
    TrdServices.getSeries(searched_value, page, dataSeries.dataPaginator.page_size)
        .then((response: any) => {
            dataSeries.dataPaginator.page = page
            dataSeries.dataPaginator.total_pages = response.total_pages
            dataSeries.data = response.results;
            dataSeries.dataSelect.options = response.results.map((value: any) => ({
                value: value.code,
                label: value.name
            }))
            dataSeries.stateLoadData = false;
        })
        .catch((error: any) => {
            console.error(error);
            dataSeries.stateLoadData = false;
        });
}

function sendDataNewSerie() {
    if (FormValidators.getValidationForm('series-template--form__content')) {
        const formData = new FormData; //as variable local
        formData.append('code', dataSeries.dataForm.code);
        formData.append('name', dataSeries.dataForm.name);
        formData.append('creation_date', dataSeries.dataForm.creation_date);
        formData.append('disabled_date', dataSeries.dataForm.disabled_date);
        formData.append('disabled', dataSeries.dataForm.disabled);
        TrdServices.sendSerie(formData)
            .then((response: any) => {
                openModalConfirmation("the_series_was_successfully_created", "finish", closeModalConfirmation);
                getSeries("", 1);
            })
            .catch((error: any) => {
                console.error(error.response.data.error.details);
                dataSeries.dataModalAlert.isActive = 'show';
                dataSeries.dataModalAlert.dataText.text = error?.response.data.error.details[0];
            });
    } else {
        dataSeries.dataModalAlert.isActive = 'show';
        dataSeries.dataModalAlert.dataText.text = 'empty_inputs';
    }

}

async function eliminateSerie(id: number) {
    TrdServices.deleteSerie(id)
        .then(response => {
            openModalConfirmation(response, "finish", closeModalConfirmation)
            getSeries("", 1);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        })
}

function openModalConfirmation(dataText: string, buttonText: string, buttonOnClick: any): void {
    dataSeries.dataModalConfirmation.isActive = 'show';
    dataSeries.dataModalConfirmation.dataText.text = dataText;
    dataSeries.dataModalConfirmation.dataButton.text = buttonText;
    dataSeries.dataModalConfirmation.dataButton.onClick = () => { buttonOnClick() };
}

function closeModalConfirmation() {
    dataSeries.dataModalConfirmation.isActive = "hidde";
    dataSeries.stateFormCreate = false;
    dataSeries.stateChoiceOption = false;
    dataSeries.dataButtonGoToNext.text = "create_dependence";
    resetForm();
}

function setChoiceOption(){
    dataSeries.stateFormCreate = true;
    dataSeries.stateChoiceOption = true;
}

function setStateFormCreate() {
    dataSeries.stateChoiceOption = false;
    dataSeries.stateFormCreate = true;
}

function showModalConfirmation() {
    dataSeries.dataModalConfirmation.isActive = 'show';
}

function downloadSeriesPdf() {
    DataFlowServices.getListPdfSeries()
        .catch((error: any) => {
            console.error(error);
        })
}

function downloadSeriesCSV() {
    DataFlowServices.getListCSVSeries()
        .catch((error: any) => {
            console.error(error);
        })
}

function openAndGetFile(file:any){
    let formData = new FormData();
    formData.append("file", file);
    DataFlowServices.bulkUploadSeries(formData)
        .catch((error: any) => {
            console.error(error)
        })
}

function backToChoice() {
    resetForm();
    dataSeries.stateFormCreate = true;
    dataSeries.stateChoiceOption = true;
}

function validateNavegationBack() {
    getSeries("", 1);
    resetForm();
    dataSeries.stateFormCreate = false;
    dataSeries.stateChoiceOption = false;
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

</script>

<style scoped src="./Series.page.scss"></style>
