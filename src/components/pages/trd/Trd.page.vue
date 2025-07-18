<template>
    <Trd :dataTrd="dataTrd" :dataRelationshipMatrix="dataRelationshipMatrix" @applyFilters="applyFilters"/>
</template>
<script setup lang="ts">

import { onMounted, ref, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Trd from '../../templates/trd/Trd.template.vue';
import TrdServices from '../../../services/TrdServices.ts';
import DependenceServices from '../../../services/DependenceServices.ts';
import FormValidators from '../../../validators/FormValidators.ts';
import UtilsServices from '../../../services/UtilsServices.ts';
import hasPermissions from '../../../guards/hasPermissions.guard.ts';

const { t } = useI18n();
const filters: any = ref([
    'Filtro 1',
    'Filtro 2',
    'Filtro 3',
]);

const dataTrd: any = reactive({
    data: [],
    stateLoadData: false,
    stateLoadForm: false,
    dataButtonNewTrd: {
        className: 'blue',
        text: 'new',
        alt: 'new',
        url: '/Buttons/icon-add.svg',
        reverse: true,
        disabled: false,
        onClick: () => { 
            dataTrd.stateLoadForm = true;
            resetForm();
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
                getRelationshipMatrix(value, 1)
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
            getRelationshipMatrix(dataTrd.dataInputSearch.dataInput.model, value)
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
            text: UtilsServices.capitalizeFirstLetter(`${t("delete")} ${t("trd")}`),
            src: '/Buttons/icon-delete.svg',
            color: 'red',
            alt: 'delete',
            show: (data: any) => { return hasPermissions.validator('delete_trd') /*&& data?.delete;*/ }, // Data delete no esta llegando
            onClick: ({data = {id: 1}}) => { dataTrd.eliminateTrd(data?.id) },
        },
        {
            text: UtilsServices.capitalizeFirstLetter(`${t("edit")} ${t("trd")}`),
            src: '/Buttons/icon-edit.svg',
            color: 'blue',
            alt: 'edit',
            show: (data: any) => { return hasPermissions.validator('update_trd') },
            onClick: ({data = {id: 1}}) => { dataTrd.updateTrd(data?.id) },
        },
    ],
    eliminateTrd: (id: any) => {
        eliminateTrd(id);
    },
    updateTrd: (id: any) => {
        console.log("updateTrd in construction", id);
    },
});

const dataRelationshipMatrix: any = reactive({
    stateFormCreate: false,
    dataSeries: [],
    dataForm: {
        code: '',
        name: '',
        serie: '',
        time_file_management: '',
        time_file_central: '',
        final_disposition: '',
    },
    dataButtonBack: {
        className: 'gray',
        text: 'back',
        alt: 'left-arrow',
        url: '/Buttons/left-arrow.svg',
        reverse: false,
        disabled: false,
        onClick: () => {
            dataTrd.stateLoadForm = false;
            getRelationshipMatrix("" , 1);
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
            sendDataNewRelationshipMatrix();
        }
    },
    dataModalAlert: {
        isActive: '',
        dataButton: {
            className: '',
            text: 'Cerrar',
            disabled: false,
            onClick: () => {
                dataRelationshipMatrix.dataModalAlert.isActive = '';
            }
        },
        dataText: {
            classText: '',
            text: '',
            disabled: false,
            onClick: () => { }
        }
    },
    dataSelectDependence: {
        id: '',
        name: '',
        className: '',
        disabled: false,
        onChange: (data: any) => {

        },
        onClick: () => { },
        placeholder: 'select_dependence',
        model: '',
        options: [
            {
                value: '',
                label: ''
            }
        ]
    },
    dataSelectSerie: {
        id: '',
        name: '',
        className: '',
        disabled: false,
        onChange: (selectedSerieCode: any) => {
            // Buscar la serie seleccionada por su código
            const selectedSerie = dataRelationshipMatrix.dataSeries.find((serie: any) => serie.id == selectedSerieCode.target.value);
            if (selectedSerie) {
                // Actualizar las opciones del selector de subserie
                dataRelationshipMatrix.dataSelectSubserie.options = selectedSerie.subseries.map((subserie: any) => ({
                    value: subserie.id,
                    label: subserie.name
                }));
                // Limpiar el valor seleccionado de subserie
                dataRelationshipMatrix.dataSelectSubserie.model = '';

            }
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
    dataSelectSubserie: {
        id: '',
        name: '',
        className: '',
        disabled: false,
        onChange: (data: any) => {

        },
        onClick: () => { },
        placeholder: 'select_subserie',
        model: '',
        options: [
            {
                value: '',
                label: ''
            }
        ]
    },
    dataSelectDocumentaryType: {
        id: '',
        name: '',
        className: '',
        disabled: false,
        onChange: (data: any) => {

        },
        onClick: () => { },
        placeholder: 'select_documentary_type',
        model: '',
        options: [
            {
                value: '',
                label: ''
            }
        ]
    },
    dataSelectMaterialType: {
        id: '',
        name: '',
        className: '',
        disabled: false,
        onChange: (data: any) => {

        },
        onClick: () => { },
        placeholder: 'select_material_type',
        model: '',
        options: [
            {
                value: '',
                label: ''
            }
        ]
    },
    dataMultiSelect: {
        title: "select_documentary_type",
        model: [],
        options: [
            { text: '', value: 0, checked: false },
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
    }
});

onMounted(() => {
    getSeries();
    getDependences();
    getDocumentaryType();
    getMaterialType();
    getRelationshipMatrix("" , 1);
});

watch(() => dataTrd.dataPaginator.page_size, () => {
    getRelationshipMatrix(dataTrd.dataInputSearch.dataInput.model, 1);
});

function resetForm() {
    dataRelationshipMatrix.dataSelectDependence.model = '';
    dataRelationshipMatrix.dataSelectSerie.model = '';
    dataRelationshipMatrix.dataSelectSubserie.model = '';
    dataRelationshipMatrix.dataSelectMaterialType.model = '';
    dataRelationshipMatrix.dataMultiSelect.model = [];
}

function getRelationshipMatrix(searched_value:any, page:any) {
    dataTrd.data = [];
    dataTrd.stateLoadData = true;
    TrdServices.getRelationshipMatrix(searched_value, page, dataTrd.dataPaginator.page_size)
        .then((response: any) => {
            dataTrd.dataPaginator.page = page
            dataTrd.dataPaginator.total_pages = response.total_pages
            dataTrd.data = response.results;
            dataTrd.stateLoadData = false;
        })
        .catch((error: any) => {
            console.error(error);
            dataTrd.stateLoadData = false;
        })
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

async function getSeries() {
    await TrdServices.getSeries()
        .then((response: any) => {
            dataRelationshipMatrix.dataSeries = response.results;
            dataRelationshipMatrix.dataSelectSerie.options = response.results.map((value: any) => ({
                value: value.id,
                label: value.name
            }))
        });
}

function getMaterialType() {

    interface MaterialTypeResponse {
        id: number;
        code: string;
    }

    TrdServices.getMaterialType()
        .then((response: MaterialTypeResponse[]) => {

            const codeLabelMap: { [key: string]: string } = {
                "001": t('paper'),
                "002": t('magnetic'),
                "003": t('paper_and_magnetic'),
            };

            dataRelationshipMatrix.dataSelectMaterialType.options = response.map((value: MaterialTypeResponse) => ({
                value: value.code,
                label: codeLabelMap[value.code] || value.code
            }));
        })
        .catch((error) => {
            console.error("Error fetching material types:", error);
        });
}

function getDocumentaryType() {
    TrdServices.getDocumentaryType()
        .then((response: any) => {
            dataRelationshipMatrix.data = response.results;
            dataRelationshipMatrix.dataMultiSelect.options = response.results.map((value: any) => ({
                text: value.name_document_type,
                value: value.id,
                checked: false
            }))
        });
}

function getDependences() {
    DependenceServices.getAllDependences(1)
        .then((response: any) => {
            dataRelationshipMatrix.data = response;
            dataRelationshipMatrix.dataSelectDependence.options = response.results.map((value: any) => ({
                value: value.code,
                label: value.name
            }))
        });
}

function sendDataNewRelationshipMatrix() {
    if (FormValidators.getValidationForm('relationship-matrix-template--form__content')) {
        const formData = new FormData; //as variable local
        formData.append('dependence', dataRelationshipMatrix.dataSelectDependence.model);
        formData.append('serie', dataRelationshipMatrix.dataSelectSerie.model);
        formData.append('subserie', dataRelationshipMatrix.dataSelectSubserie.model);
        // Should send an array for backend, so we need to convert it to JSON or Array
        formData.append('documentary_type', JSON.stringify(dataRelationshipMatrix.dataMultiSelect.model));
        formData.append('material_type', dataRelationshipMatrix.dataSelectMaterialType.model);

        TrdServices.sendRelationshipMatrix(formData).then((response: any) => {

            dataRelationshipMatrix.dataModalConfirmation.isActive = 'show';
            dataRelationshipMatrix.dataModalConfirmation.dataText.text = 'the_relationship_matrix_was_successfully_created';
            dataRelationshipMatrix.dataModalConfirmation.dataButton.onClick = () => {
                dataRelationshipMatrix.stateFormCreate = false;
                hiddeModalConfirmation();
                dataRelationshipMatrix.dataSelectDependence.model = '';
                dataRelationshipMatrix.dataSelectSerie.model = '';
                dataRelationshipMatrix.dataSelectSubserie.model = '';
                dataRelationshipMatrix.dataMultiSelect.model = [];
                dataRelationshipMatrix.dataSelectMaterialType.model = '';
            }
        })
            .catch((error: any) => {
                console.error(error.response.data.error.details);
                dataRelationshipMatrix.dataModalAlert.isActive = 'show';
                dataRelationshipMatrix.dataModalAlert.dataText.text = error?.response.data.error.details?.code;
            });
    } else {
        dataRelationshipMatrix.dataModalAlert.isActive = 'show';
        dataRelationshipMatrix.dataModalAlert.dataText.text = 'empty_inputs';
    }

}

function hiddeModalConfirmation() {
    dataRelationshipMatrix.dataModalConfirmation.isActive = 'hidde';
    dataTrd.stateLoadForm = false;
    getRelationshipMatrix("" , 1);
}

function showModalConfirmation() {
    dataRelationshipMatrix.dataModalConfirmation.isActive = 'show';
}

async function eliminateTrd(id: any) {
    TrdServices.deleteTrd(id)
        .then(response => {
            dataRelationshipMatrix.dataModalConfirmation.isActive = 'show';
            dataRelationshipMatrix.dataModalConfirmation.dataText.text = 'action_performed_succesfully';
            dataTrd("", 1);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            dataRelationshipMatrix.dataModalAlert.isActive = 'show';
            dataRelationshipMatrix.dataModalAlert.dataText.text = 'an_error_has_occurred_please_try_again_later';
        })
}

</script>
<style scoped src="./Trd.page.scss"></style>