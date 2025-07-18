<template>
    <PortfolioTemplate :dataPortfolio="dataPortfolio"/>
</template>

<script setup lang="ts">

// Import vue libraries
import { onMounted, ref, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Import components
import PortfolioTemplate from '../../templates/portfolio/Portfolio.template.vue';

// Import services
import FilesServices from '../../../services/FilesServices';
import UtilsServices from '../../../services/UtilsServices';
import hasPermissions from '../../../guards/hasPermissions.guard';
import PortfolioServices from '../../../services/PortfolioServices';
import FormValidators from '../../../validators/FormValidators';

// Define and emits and configuration
const { t } = useI18n();

// Define constants and variables
const documentId: any = ref("");

const dataPortfolio: any = reactive({
    stateLoadData: false,
    stateVisualizePortfolio: false,
    data: [],
    dataChoose: null,
    dataButtonNewPortfolio: {
        className: 'blue',
        text: 'create',
        alt: 'create',
        url: '/Buttons/icon-add.svg',
        reverse: true,
        disabled: false,
        onClick: async () => {
            openModalCreate('create');
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
        }, 
    },
    dataInputSearchFile: {
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
                getFilesPortfolio(dataPortfolio?.dataChoose.id, value, 1);
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
        }, 
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
        }
    },
    dataFilePaginator: {
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
            getFilesPortfolio(dataPortfolio?.dataChoose.id, dataPortfolio.dataInputSearchFile.dataInput.model, value)
        }
    },
    dataCardPortfolio: {
        dataTooltipIcons: [
            { // Delete Portfolio action
                text: UtilsServices.capitalizeFirstLetter(`${t("delete")} ${t("portfolio")}`),
                src: '/Buttons/icon-delete.svg',
                color: 'red',
                alt: 'delete',
                show: () => { return true; },
                onClick: ({data = {id: -1}}) => { validateActionFile({action: 'delete_portfolio', index: data.id}) },
            },
            { // View Portfolio action
                text: UtilsServices.capitalizeFirstLetter(`${t("view")} ${t("portfolio")}`),
                src: '/Buttons/icon-view.svg',
                color: 'blue',
                alt: 'view',
                show: () => { return true; },
                onClick: ({data = {}}) => { validateActionFile({action: 'open_portfolio', data: data}) },
            },
            { // Edit Portfolio action
                text: UtilsServices.capitalizeFirstLetter(`${t("edit")} ${t("portfolio")}`),
                src: '/Buttons/icon-edit.svg',
                color: 'blue',
                alt: 'edit',
                show: () => { return true; },
                onClick: ({data = {name: "", id: -1}}) => { openModalCreate('edit', data.name, data.id) },
            },
        ],
    },
    dataModalAlert: {
        isActive: '',
        dataButton: {
            className: 'blue',
            text: 'close',
            disabled: false,
            onClick: () => {
                dataPortfolio.dataModalAlert.isActive = '';
            }
        },
        dataText: {
            classText: '',
            text: '',
            disabled: false,
            onClick: () => { }
        }
    },
    dataModalCreate: {
        isActive: '',
        formText: '',
        placeholder: '',
        action: '',
        dataButton: {
           className: 'blue',
            text: 'create',
            alt: 'button-img',
            url: '',
            reverse: true,
            disabled: false,
            onClick: () => {
                dataPortfolio.dataModalCreate.isActive = '';
            }
        },
        dataText:{
            classText: '',
            text: 'create_portfolio',
            disabled: false,
            onClick: () => { }
        },
        dataImg: {
            id: "",
            name: "close",
            class: "icon-button",
            src: "/icon-close.svg",
            type: "svg",
            alt: "",
            isActive: () => {}, // optional, currently used to add activate and deactivate the active class
            onClick: () => {
                dataPortfolio.dataModalCreate.isActive = '';
                dataPortfolio.dataModalCreate.formText = '';
            },
        },
    },
    getBack: () => {
        dataPortfolio.stateVisualizePortfolio = false;
        dataPortfolio.dataChoose = null;
        getPortfolio("", 1);
    }
});

// Define methods and functions
onMounted(() => {
    getPortfolio("", 1);
});

/**
 * todo GET & SET
 */

watch(() => dataPortfolio.dataPaginator.page_size, () => {
    getPortfolio(dataPortfolio.dataInputSearch.dataInput.model, 1);
});

watch(() => dataPortfolio.dataFilePaginator.page_size, () => {
    getFilesPortfolio(dataPortfolio?.dataChoose.id, dataPortfolio.dataInputSearch.dataInput.model, 1);
});

async function getPortfolio(searched_value:any, page:any): Promise<void> {
    dataPortfolio.data = [];
    dataPortfolio.stateLoadData = true;
    await PortfolioServices.getPortfolios(searched_value, page, dataPortfolio.dataPaginator.page_size)
        .then(async (response: any) => {
            dataPortfolio.stateLoadData = false;
            dataPortfolio.data = response.data;
            dataPortfolio.dataPaginator.total_pages = response.total_pages;
            dataPortfolio.dataPaginator.page = response.page;
            dataPortfolio.dataPaginator.page_size = dataPortfolio.dataPaginator.page_size;
        })
        .catch((error: any) => {
            dataPortfolio.stateLoadData = false;
            openModalAlert('something_happened_try_later');
            console.error(error);
        });
}

async function createPortfolio(): Promise<void> {
    activateOrDeactivateLoadState(true);
    const formData: any = new FormData();
    formData.append('name', dataPortfolio.dataModalCreate.formText);
    await PortfolioServices.createPortfolio(formData, dataPortfolio.data)
        .then(async (response: any) => {
            activateOrDeactivateLoadState(false);
            dataPortfolio.data = response.data;
            // dataPortfolio.dataPaginator.total_pages = response.total_pages;
            // dataPortfolio.dataPaginator.page = response.page;
            // dataPortfolio.dataPaginator.page_size = dataPortfolio.dataPaginator.page_size;
        })
        .catch((error: any) => {
            activateOrDeactivateLoadState(false);
            openModalAlert('something_happened_try_later');
            console.error(error);
        });
}

async function deletePortfolio(id: any): Promise<void> {
    dataPortfolio.stateLoadData = true;
    await PortfolioServices.deletePortfolio(id, dataPortfolio.data)
        .then(async (response: any) => {
            console.log('response', response);
            dataPortfolio.stateLoadData = false;
            dataPortfolio.data = response.data;
            dataPortfolio.dataPaginator.total_pages = response.total_pages;
            dataPortfolio.dataPaginator.page = response.page;
            dataPortfolio.dataPaginator.page_size = dataPortfolio.dataPaginator.page_size;
        })
        .catch((error: any) => {
            dataPortfolio.stateLoadData = false;
            openModalAlert('something_happened_try_later');
            console.error(error);
        });
}

async function editPortfolio(id: any): Promise<void> {
    const formData: any = new FormData();
    formData.append('name', dataPortfolio.dataModalCreate.formText);
    activateOrDeactivateLoadState(true);
    await PortfolioServices.updatePortfolio(formData, id, dataPortfolio.data)
        .then(async (response: any) => {
            console.log('response', response);
            dataPortfolio.data = response.data;
            activateOrDeactivateLoadState(false);
        })
        .catch((error: any) => {
            activateOrDeactivateLoadState(false);
            openModalAlert('something_happened_try_later');
            console.error(error);
        });
}

async function getFilesPortfolio(id: any, searched_value:any, page:any): Promise<void> {
    dataPortfolio.stateLoadData = true;
    await PortfolioServices.getFilesPortfolio(id, searched_value, page, dataPortfolio.dataFilePaginator.page_size)
        .then(async (response: any) => {
            dataPortfolio.stateLoadData = false;
            dataPortfolio.dataChoose.documents = response.results;
            dataPortfolio.dataFilePaginator.total_pages = response.total_pages;
            dataPortfolio.dataFilePaginator.page = page;
            dataPortfolio.dataFilePaginator.page_size = dataPortfolio.dataPaginator.page_size;
        })
        .catch((error: any) => {
            dataPortfolio.stateLoadData = false;
            openModalAlert('something_happened_try_later');
            console.error(error);
        });
}

async function openPortfolio(data: any): Promise<void> {
    dataPortfolio.dataChoose = data;
    dataPortfolio.stateVisualizePortfolio = true;
    await getFilesPortfolio(dataPortfolio?.dataChoose.id, "", 1);
}

function findUrl(url: any){
    FilesServices.getDocumentContent(url)
        .then(async response => {
            openModalPdfViewer(response)
            documentId.value = url
        })
        .catch((error: any) => {
            openModalAlert('something_happened_try_later');
            console.error(error);
        });
}

async function validateActionFile({action = "", file = {document: ""}, index = -1, data = {}}): Promise<void> {
    switch (action) {
        case 'see_document':
            findUrl(file?.document);
            break;
        case 'create_portFolio':
            if (FormValidators.getValidationForm("create-modal-background__container")) {
                createPortfolio();
            }
            break;
        case 'open_portfolio':
            openPortfolio(data);
            break;
        case 'edit_portfolio':
            if (FormValidators.getValidationForm("create-modal-background__container")) { 
                editPortfolio(index);
            }
            break;
        case 'delete_portfolio':
            deletePortfolio(index)
            break;
        case 'move_file_to_other_portfolio':
            break;
        case 'remove_file_from_portfolio':
            break;
        case 'download_file':
            break;
        default:
            break;
    }
}

function openModalAlert(text: string): void {
    dataPortfolio.dataModalAlert.isActive = 'show';
    dataPortfolio.dataModalAlert.dataText.text = text;
}

function openModalPdfViewer(url: string): void {
    dataPortfolio.dataModalPdfViewer.isActive = 'show';
    dataPortfolio.dataModalPdfViewer.dataPdfViewer.urlPdf = url;
}

function openModalCreate(action: string, name: string = "", id: any = -1): void {
    console.log('openModalCreate', action);
    dataPortfolio.dataModalCreate.action = action;
    dataPortfolio.dataModalCreate.isActive = 'show';
    switch(action) {
        case 'create':
            editModalActionInformation('create_portfolio', 'create_portfolio', 'create', '/Buttons/icon-add.svg', name);
            dataPortfolio.dataModalCreate.dataButton.onClick = () => {
                validateActionFile({action: 'create_portFolio'});
            }
            break;
        case 'edit':
            editModalActionInformation('edit_portfolio', 'edit_portfolio', 'edit', '/Buttons/icon-edit.svg', name);
            dataPortfolio.dataModalCreate.dataButton.onClick = () => {
                validateActionFile({action: 'edit_portfolio', index: id});
            }
            break;
        default:
            break;
    }
    console.log('dataPortfolio.dataModalCreate', dataPortfolio.dataModalCreate);
}

function editModalActionInformation(title: string, placeholder: string, buttonLabel: string, urlImgButton: string, formText: string): void {
    dataPortfolio.dataModalCreate.dataButton.disabled = false;
    dataPortfolio.dataModalCreate.formText = formText;
    dataPortfolio.dataModalCreate.dataText.text = title;
    dataPortfolio.dataModalCreate.placeholder = placeholder;
    dataPortfolio.dataModalCreate.dataButton.text = buttonLabel;
    dataPortfolio.dataModalCreate.dataButton.url = urlImgButton;
}

function activateOrDeactivateLoadState(state: boolean): void {
    dataPortfolio.stateLoadData = state;
    dataPortfolio.dataModalCreate.isActive = state ? 'show' : '';
    dataPortfolio.dataModalCreate.dataButton.disabled = state;
}

</script>

