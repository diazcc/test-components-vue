<template>
    <Subseries :dataSubseries="dataSubseries" @applyFilters="applyFilters"/>
</template>


<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import Subseries from '../../templates/subseries/Subseries.template.vue'
import { onMounted, ref, reactive, watch } from 'vue';
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

const dataSubseries: any = reactive({
    stateFormCreate: false,
    stateLoadData: false,
    data: [],
    dataForm: {
        code: '',
        name: '',
        serie: '',
        time_file_management: '',
        time_file_central: '',
        final_disposition: '',
    },
    dataButtonNewSubseries: {
        className: 'blue',
        text: 'new',
        alt: 'new',
        url: '/Buttons/icon-add.svg',
        reverse: true,
        disabled: false,
        onClick: () => {
            setStateFormCreate();
        }
    },
    dataButtonBack: {
        className: 'gray',
        text: 'back',
        alt: 'left-arrow',
        url: '/Buttons/left-arrow.svg',
        reverse: false,
        disabled: false,
        onClick: () => {
            resetForm();
            dataSubseries.stateFormCreate = false;
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
            sendDataNewSubserie();
        }
    },
    dataModalAlert: {
        isActive: '',
        dataButton: {
            className: '',
            text: 'Cerrar',
            disabled: false,
            onClick: () => {
                dataSubseries.dataModalAlert.isActive = '';
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
                getSubseries(value, 1)
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
            getSubseries(dataSubseries.dataInputSearch.dataInput.model, value)
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
    dataTooltipIcons: [
        {
            text: UtilsServices.capitalizeFirstLetter(`${t("delete")} ${t("subserie")}`),
            src: '/Buttons/icon-delete.svg',
            color: 'red',
            alt: 'delete',
            show: (data: any) => { return hasPermissions.validator('delete_subseries') && data?.delete; },
            onClick: ({data = {code: 1}}) => { dataSubseries.eliminateSuberie(data?.code) },
        },
        {
            text: UtilsServices.capitalizeFirstLetter(`${t("edit")} ${t("subserie")}`),
            src: '/Buttons/icon-edit.svg',
            color: 'blue',
            alt: 'edit',
            show: (data: any) => { return hasPermissions.validator('update_subseries') },
            onClick: ({data = {code: 1}}) => { dataSubseries.updateSubseries(data?.code) },
        },
    ],
    dataImgDownloadPdf: {
        id: '',
        name: '',
        class: 'icon-button',
        src: '/download-pdf.svg',
        type: 'png',
        alt: 'Download list of series in pdf',
        onClick: () => {downloadSubseriesPdf()}
    },
    dataImgDownloadCSV: {
        id: '',
        name: '',
        class: 'icon-button',
        src: '/download-csv.svg',
        type: 'png',
        alt: '',
        onClick: () => {downloadSubseriesCSV()}
    },
    eliminateSuberie: (id: any) => {
        eliminateSuberie(id);
    },
    updateSubseries: (id: any) => {
        console.log("updateSubseries in construction", id);
    },
});

onMounted(() => {
    getSubseries("", 1);
    getSeries();
});

watch(() => dataSubseries.dataPaginator.page_size, () => {
    getSubseries(dataSubseries.dataInputSearch.dataInput.model, 1);
});

/**
 * todo GET & SET
 */


function getSubseries(searched_value:any, page:any) {
    dataSubseries.data = [];
    dataSubseries.stateLoadData = true;
    TrdServices.getSubseries(searched_value, page, dataSubseries.dataPaginator.page_size)
        .then((response: any) => {
            dataSubseries.dataPaginator.page = page
            dataSubseries.dataPaginator.total_pages = response.total_pages
            dataSubseries.data = response.results;   
            dataSubseries.stateLoadData = false;
        })
        .catch((error: any) => {
            console.error(error);
            dataSubseries.stateLoadData = false;
        })
}

function getSeries() {
    TrdServices.getSeries()
        .then((response: any) => {
            dataSubseries.dataSelect.options = response.results.map((value: any) => ({
                value: value.code,
                label: value.name
            }))
        });
}

function downloadSubseriesPdf(){
    DataFlowServices.getListPdfSubseries()
    .catch((error:any)=>{
        console.error(error);
    })
}

function downloadSubseriesCSV(){
    DataFlowServices.getListCSVSubseries()
        .catch((error:any)=>{
            console.error(error);
        })
}

function sendDataNewSubserie() {
    if (FormValidators.getValidationForm('subseries-template--form__content')) {
        const formData = new FormData; //as variable local
        formData.append('code', dataSubseries.dataForm.code);
        formData.append('name', dataSubseries.dataForm.name);
        formData.append('serie', dataSubseries.dataSelect.model);
        formData.append('time_file_management', dataSubseries.dataForm.time_file_management);
        formData.append('time_file_central', dataSubseries.dataForm.time_file_central);
        formData.append('final_disposition', dataSubseries.dataForm.final_disposition);
        TrdServices.sendSubserie(formData).then((response: any) => {
            dataSubseries.dataModalConfirmation.isActive = 'show';
            dataSubseries.dataModalConfirmation.dataText.text = 'the_subseries_was_successfully_created';
            dataSubseries.dataModalConfirmation.dataButton.onClick = () => {
                dataSubseries.stateFormCreate = false;
                hiddeModalConfirmation();
                resetForm();
            }
            getSubseries("", 1);
        })
            .catch((error: any) => {
                console.error(error.response.data.error.details);
                dataSubseries.dataModalAlert.isActive = 'show';
                dataSubseries.dataModalAlert.dataText.text = error?.response.data.error.details?.code;
            });
    } else {
        dataSubseries.dataModalAlert.isActive = 'show';
        dataSubseries.dataModalAlert.dataText.text = 'empty_inputs';
    }

}

function setStateFormCreate() {
    dataSubseries.stateFormCreate = true;
}

function hiddeModalConfirmation() {
    dataSubseries.dataModalConfirmation.isActive = 'hidde';
}

function showModalConfirmation() {
    dataSubseries.dataModalConfirmation.isActive = 'show';
}

function resetForm() {
    dataSubseries.dataSelect.model = '';
    dataSubseries.dataForm = {
        code: '',
        name: '',
        serie: '',
        time_file_management: '',
        time_file_central: '',
        final_disposition: '',
    };
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

function eliminateSuberie(id: any) {
    TrdServices.deleteSubserie(id)
        .then((response: any) => {
            getSubseries("", 1);
            dataSubseries.dataModalConfirmation.isActive = 'show';
            dataSubseries.dataModalConfirmation.dataText.text = 'action_performed_succesfully';
        })
        .catch((error: any) => {
            console.error(error);
            dataSubseries.dataModalAlert.isActive = 'show';
            dataSubseries.dataModalAlert.dataText.text = 'an_error_has_occurred_please_try_again_later';
        });
};

</script>

<style scoped src="./Subseries.page.scss"></style>
