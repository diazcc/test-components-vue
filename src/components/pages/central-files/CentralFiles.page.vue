<template>
        <CentralFiles :dataCentralFiles="dataCentralFiles" @applyFilters="applyFilters"/>
</template>

<script setup lang="ts">

import CentralFiles from '../../templates/central-files/CentralFiles.template.vue';
import { onMounted, ref, reactive, watch } from 'vue';
import { useRouter } from "vue-router";
import FilesServices from '../../../services/FilesServices.ts';

const router = useRouter();
const filters: any = ref([
    'Filtro 1',
    'Filtro 2',
    'Filtro 3',
]);
const dataCentralFiles: any = reactive({
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
                dataCentralFiles.dataModalAlert.isActive = 'hidde';
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
            getFiles(dataCentralFiles.dataInputSearch.dataInput.model, value)
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

watch(() => dataCentralFiles.dataPaginator.page_size, () => {
    getFiles(dataCentralFiles.dataInputSearch.dataInput.model, 1);
});


/**
 * todo GET & SET
 */

function getFiles(searched_value:any, page:any) {
    dataCentralFiles.data = [];
    dataCentralFiles.stateLoadData = true;
    FilesServices.getFiles(searched_value, page, dataCentralFiles.dataPaginator.page_size)
        .then((response: any) => {
            dataCentralFiles.dataPaginator.page = page
            dataCentralFiles.dataPaginator.total_pages = response.total_pages
            dataCentralFiles.data = response.results;
            dataCentralFiles.stateLoadData = false;
        })
        .catch((error: any) => {
            dataCentralFiles.stateLoadData = false;
            console.error(error);
        });
}

function redirectNewFiles() {
    router.push('upload_files');
}

function openModalPdfViewer(path: any) {
    dataCentralFiles.dataModalPdfViewer.isActive = 'show';
    FilesServices.getDocumentContent(path)
        .then((response: any) => {
                dataCentralFiles.dataModalPdfViewer.dataPdfViewer.urlPdf = response;
        })
        .catch((error: any) => {
                dataCentralFiles.dataModalPdfViewer.isActive = '';
                dataCentralFiles.dataModalAlert.isActive = 'show';
                dataCentralFiles.dataModalAlert.dataText.text = error;
        });
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

</script>
<style scoped src="./CentralFiles.page.scss"></style>