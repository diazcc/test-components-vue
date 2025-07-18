<template>
    <FilesTemplate :dataFiles="dataFiles" @applyFilters="applyFilters"/>
</template>

<script setup lang="ts">

import FilesTemplate from '../../templates/files/Files.template.vue';
import { onMounted, ref, reactive, watch } from 'vue';
import { useRouter } from "vue-router";
import FilesServices from '../../../services/FilesServices.ts';
import DataFlowServices from '../../../services/DataFlowServices.ts';

const router = useRouter();
const documentId = ref('');
const filters: any = ref([
    'Filtro 1',
    'Filtro 2',
    'Filtro 3',
]);
const dataFiles: any = reactive({
    title: "files_search",
    stateLoadData: true,
    newView: true,
    data: [],
    dataButtonNewFiles: {
        className: 'blue',
        text: 'upload',
        alt: 'upload',
        url: '/Buttons/icon-upload.svg',
        reverse: true,
        disabled: false,
        onClick: () => {
            redirectNewFiles();
        }
    },
    dataModalPdfViewer: {
        isActive: '',
        dataButtons: [
            {
                className: 'blue',
                text: 'original',
                disabled: false,
                reverse: true,
                url: '/Buttons/icon-download.svg',
                iconSize: 'large',
                alt: 'original',
                onClick: () => {  
                    openModalAlert('Original Document in progress');
                    console.log("On construction"); 
                }
            },
            {
                className: 'blue',
                text: 'summary',
                disabled: false,
                reverse: true,
                url: '/Buttons/icon-download.svg',
                iconSize: 'large',
                alt: 'summary',
                onClick: () => { 
                    downloadSummaryDocument('')
                }
            },
        ],
        dataPdfViewer: {
            urlPdf: '',
            toolbar: {
                secondaryToolbar: false,
                toolbar: {
                    toolbarViewerLeft: {
                        findbar: true,
                        previous: false,
                        next: false,
                        pageNumber: true,
                    },
                    toolbarViewerRight: {
                        presentationMode: false,
                        openFile: false,
                        print: true,
                        download: true,
                        viewBookmark: false,
                    },
                    toolbarViewerMiddle: {
                        zoomOut: true,
                        zoomIn: true,
                        scaleSelectContainer: true,
                    },
                },
            },
            onClose: () => {
            }
        }
    },
    dataModalAlert: {
        isActive: '',
        dataButton: {
            className: 'blue',
            text: 'close',
            disabled: false,
            onClick: () => {
                dataFiles.dataModalAlert.isActive = '';
            }
        },
        dataText: {
            classText: '',
            text: '',
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
                getFiles(value, 1)
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
            getFiles(dataFiles.dataInputSearch.dataInput.model, value)
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
    actionsMenu: (action: any, record: any) => { //Menu table
        validateActionFile(action, record)
    },
});

onMounted(() => {
    getFiles("", 1);
});

watch(() => dataFiles.dataPaginator.page_size, () => {
    getFiles(dataFiles.dataInputSearch.dataInput.model, 1);
});

/**
 * todo GET & SET
 */

function getFiles(searched_value:any, page:any) {
    dataFiles.data = [];
    dataFiles.stateLoadData = true;
    FilesServices.getFilesJson(searched_value, page, dataFiles.dataPaginator.page_size)
        .then((response: any) => {
            dataFiles.dataPaginator.page = page
            dataFiles.dataPaginator.total_pages = response.total_pages
            dataFiles.data = response.results.map((value: any) => {
                return {
                    ...value,
                    user_actions: ['see_document'],
                    isMenuOpen: false,
                }
            });
            dataFiles.stateLoadData = false;
        })
        .catch((error: any) => {
            console.error(error);
            dataFiles.stateLoadData = false;
        });
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

function validateActionFile(action: any, file: any) {
    switch (action) {
        case 'see_document':
            FilesServices.getDocumentContent(file.document)
                .then(async response => {
                    openModalPdfViewer(response)
                    documentId.value = file.document
                })
                .catch((error: any) => {
                    openModalAlert('something_happened_try_later');
                    console.error(error);
                });
            break;
        default:
            break;
    }
}

function openModalAlert(text: string): void {
    dataFiles.dataModalAlert.isActive = 'show';
    dataFiles.dataModalAlert.dataText.text = text;
}

function openModalPdfViewer(url: string): void {
    dataFiles.dataModalPdfViewer.isActive = 'show';
    dataFiles.dataModalPdfViewer.dataPdfViewer.urlPdf = url;
}

function redirectNewFiles() {
    router.push('upload_files');
}

function downloadSummaryDocument(url: string): void {
    DataFlowServices.getFileResume(1)
        .catch((error:any)=>{
            openModalAlert('Download summary Document in progress');
            console.error(error);
        })
    console.log("On construction");
}

</script>

