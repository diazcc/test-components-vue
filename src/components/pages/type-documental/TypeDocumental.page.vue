<template>
    <TypeDocumentalTemplate :dataDocumentaryType="dataDocumentaryType" @applyFilters="applyFilters"/>
</template>

<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import TypeDocumentalTemplate from '../../templates/type-documental/TypeDocumental.template.vue'
import { onMounted, ref, reactive, watch } from 'vue';
import TrdServices from '../../../services/TrdServices.ts';
import TypeFilingServices from '../../../services/TypeFilingServices.ts';
import FormValidators from '../../../validators/FormValidators.ts';
import UtilsServices from '../../../services/UtilsServices.ts';
import hasPermissions from '../../../guards/hasPermissions.guard.ts';

const { t } = useI18n();

const dataDocumentaryType: any = reactive({
    stateFormCreate: false,
    stateLoadData: false,
    data: [],
    dataForm: {
        name_document_type: '',
        processing_time: '',
        type_processing_time: '',
        type_of_filing: '',
    },
    dataButtonNewDocumentaryTypes: {
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
        url: "/Buttons/left-arrow.svg",
        disabled: false,
        onClick: () => {
            resetForm();
            dataDocumentaryType.stateFormCreate = false;
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
            sendDataNewDocumentaryType();
        }
    },
    dataModalAlert: {
        isActive: '',
        dataButton: {
            className: '',
            text: 'close',
            disabled: false,
            onClick: () => {
                closeModalAlert()
            }
        },
        dataText: {
            classText: '',
            text: '',
            disabled: false,
            onClick: () => { }
        }
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
                getDocumentaryType(value, 1)
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
            getDocumentaryType(dataDocumentaryType.dataInputSearch.dataInput.model, value)
        }
    },
    dataMultiSelect: {
        title: "type_of_filing",
        model: [],
        options: []
    },
    dataTooltipIcons: [
        {
            text: UtilsServices.capitalizeFirstLetter(`${t("delete")} ${t("type_documental")}`),
            src: '/Buttons/icon-delete.svg',
            color: 'red',
            alt: 'delete',
            show: (data: any) => { return hasPermissions.validator('delete_type_documental') && data?.delete; },
            onClick: ({data = {id: 1}}) => { dataDocumentaryType.eliminateDocumentaryType(data?.id) },
        },
        {
            text: UtilsServices.capitalizeFirstLetter(`${t("edit")} ${t("type_documental")}`),
            src: '/Buttons/icon-edit.svg',
            color: 'blue',
            alt: 'edit',
            show: (data: any) => { return hasPermissions.validator('update_type_documental') },
            onClick: ({data = {id: 1}}) => { dataDocumentaryType.updateDocumentaryType(data?.id) },
        },
    ],
    eliminateDocumentaryType: (id: any) => {
        eliminateDocumentaryType(id);
    },
    updateDocumentaryType: (id: any) => {
        console.log("updateDocumentaryType in construction", id);
    },
});

onMounted(() => {
    getDocumentaryType("", 1);
    getTypeOfFiling()
});

watch(() => dataDocumentaryType.dataPaginator.page_size, () => {
    getDocumentaryType(dataDocumentaryType.dataInputSearch.dataInput.model, 1);
});
/**
 * todo GET & SET
 */


function getTypeOfFiling(){
    TypeFilingServices.getAllTypesFiling('', 1)
        .then((response: any) => {
            dataDocumentaryType.dataMultiSelect.options = response.results.map((value:any)=>({
                text:value.name,
                value: value.code
            }));
        })
        .catch((error: any) => {
        console.error(error);
        openModalAlert('something_happened_try_later');
        })
}

function getDocumentaryType(searched_value:any, page:any) {
    dataDocumentaryType.data = [];
    dataDocumentaryType.stateLoadData = true;
    TrdServices.getDocumentaryType(searched_value, page, dataDocumentaryType.dataPaginator.page_size)
        .then((response: any) => {
            dataDocumentaryType.dataPaginator.page = page
            dataDocumentaryType.dataPaginator.total_pages = response.total_pages
            dataDocumentaryType.data = response.results.map((value: any) => {
                const { type_of_filing, ...other } = value
                return {
                    ...other,
                    type_of_filing: type_of_filing.map((type_of_filing: any) => type_of_filing.name).join(', ')
                }
            });
            dataDocumentaryType.stateLoadData = false;
        })
        .catch((error: any) => {
            console.error(error);
            dataDocumentaryType.stateLoadData = false;
        })
}

function sendDataNewDocumentaryType() {
    if (FormValidators.getValidationForm('documentary-type--form__content')) {
        const formData = new FormData; //as variable local
        formData.append('name_document_type', dataDocumentaryType.dataForm.name_document_type);
        formData.append('processing_time', dataDocumentaryType.dataForm.processing_time);
        formData.append('type_processing_time', dataDocumentaryType.dataForm.type_processing_time);
        formData.append('type_of_filing', JSON.stringify(dataDocumentaryType.dataMultiSelect.model));
        TrdServices.sendDocumentaryType(formData).then((response: any) => {
            dataDocumentaryType.dataModalConfirmation.isActive = 'show';
            dataDocumentaryType.dataModalConfirmation.dataText.text = 'the_documental_type_was_successfully_created';
            dataDocumentaryType.dataModalConfirmation.dataButton.onClick = () => {
                dataDocumentaryType.stateFormCreate = false;
                hiddeModalConfirmation();
                dataDocumentaryType.dataModalConfirmation.dataText.text = '';
            }
            getDocumentaryType("", 1);
            resetForm();
        })
            .catch((error: any) => {
                console.error(error.response.data.error.details);
                dataDocumentaryType.dataModalAlert.isActive = 'show';
                dataDocumentaryType.dataModalAlert.dataText.text = error?.response.data.error?.details[0];
            });
    } else {
        dataDocumentaryType.dataModalAlert.isActive = 'show';
        dataDocumentaryType.dataModalAlert.dataText.text = 'empty_inputs';
    }

}

function setStateFormCreate() {
    dataDocumentaryType.stateFormCreate = true;
}

function hiddeModalConfirmation() {
    dataDocumentaryType.dataModalConfirmation.isActive = 'hidde';
}

function showModalConfirmation() {
    dataDocumentaryType.dataModalConfirmation.isActive = 'show';
}

function openModalAlert(text: string): void {
  dataDocumentaryType.dataModalAlert.isActive = 'show';
  dataDocumentaryType.dataModalAlert.dataText.text = text;
}

function closeModalAlert() {
    dataDocumentaryType.dataModalAlert.isActive = 'hidde';
}

function resetForm() {
    dataDocumentaryType.dataForm = {
        name_document_type: '',
        processing_time: '',
        type_processing_time: '',
        type_of_filing: '',
    };
    dataDocumentaryType.dataMultiSelect.model = [];
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

async function eliminateDocumentaryType(id: any) {
    TrdServices.deleteDocumentaryType(id)
        .then(response => {
            dataDocumentaryType.dataModalConfirmation.isActive = 'show';
            dataDocumentaryType.dataModalConfirmation.dataText.text = 'action_performed_succesfully';
            getDocumentaryType("", 1);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            dataDocumentaryType.dataModalAlert.isActive = 'show';
            dataDocumentaryType.dataModalAlert.dataText.text = 'an_error_has_occurred_please_try_again_later';
        })
}

</script>

<style scoped src="./TypeDocumental.page.scss"></style>
