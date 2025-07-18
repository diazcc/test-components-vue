<template>
    <HistoricalFilesTemplate :dataHistoricalFiles="dataHistoricalFiles"  @applyFilters="applyFilters"/>
</template>

<script setup lang="ts">

import HistoricalFilesTemplate from '../../templates/historical-files/HistoricalFiles.template.vue';
import { onMounted, ref, reactive, watch } from 'vue';
import { useRouter } from "vue-router";
import FilesServices from '../../../services/FilesServices.ts';

const router = useRouter();
const filters: any = ref([
    'Filtro 1',
    'Filtro 2',
    'Filtro 3',
]);
const dataHistoricalFiles: any = reactive({
    data: [],
    stateLoadData: false,
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
        dataPdfViewer: {
            urlPdf: '',
            toolbar: {
                toolbar: false
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
                dataHistoricalFiles.dataModalAlert.isActive = 'hidde';
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
            getFiles(dataHistoricalFiles.dataInputSearch.dataInput.model, value)
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
    getFile: (data: any) => {
        openModalPdfViewer(data?.document);
    },
});

onMounted(() => {
    getFiles("", 1);
});

watch(() => dataHistoricalFiles.dataPaginator.page_size, () => {
    getFiles(dataHistoricalFiles.dataInputSearch.dataInput.model, 1);
});

/**
 * todo GET & SET
 */

 function getFiles(searched_value:any, page:any) {
    dataHistoricalFiles.data = [];
    dataHistoricalFiles.stateLoadData = true;
    FilesServices.getFiles(searched_value, page, dataHistoricalFiles.dataPaginator.page_size)
        .then((response: any) => {
            dataHistoricalFiles.dataPaginator.page = page
            dataHistoricalFiles.dataPaginator.total_pages = response.total_pages
            dataHistoricalFiles.data = response.results;
            dataHistoricalFiles.stateLoadData = false;
        })
        .catch((error: any) => {
            console.error(error);
            dataHistoricalFiles.stateLoadData = false;
        });
}

function redirectNewFiles() {
    router.push('upload_files');
}

function openModalPdfViewer(path: any) {
    dataHistoricalFiles.dataModalPdfViewer.isActive = 'show';
    FilesServices.getDocumentContent(path)
        .then((response: any) => {
            dataHistoricalFiles.dataModalPdfViewer.dataPdfViewer.urlPdf = response;
        })
        .catch((error: any) => {
            dataHistoricalFiles.dataModalPdfViewer.isActive = 'hidde';
            dataHistoricalFiles.dataModalAlert.isActive = 'show';
            dataHistoricalFiles.dataModalAlert.dataText.text = error;
        });
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

</script>
