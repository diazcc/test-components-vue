<template>
    <FilesTemplate :dataFiles="dataFiles" :dataModalAssignTable="dataModalAssignTable" 
        @applyFilters="applyFilters"/>
</template>

<script setup lang="ts">

// Import vue libraries
import { onMounted, ref, reactive, watch } from 'vue';
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';

// Import components
import FilesTemplate from '../../templates/files/Files.template.vue';

// Import services
import FilesServices from '../../../services/FilesServices.ts';
import DataFlowServices from '../../../services/DataFlowServices.ts';
import hasPermissions from '../../../guards/hasPermissions.guard.ts';
// import DependenceService from '../../../services/DependenceServices.ts';
import UtilsServices from '../../../services/UtilsServices.ts';

// Define and emits and configuration
const router = useRouter();
const { t } = useI18n();

// Define constants and variables
const documentId = ref('');
const filters: any = ref([
    'Filtro 1',
    'Filtro 2',
    'Filtro 3',
]);
const dataFiles: any = reactive({
    title: 'files',
    stateLoadData: true,
    fileToEdit: null,
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
    dataMultiselectDependence: {
        key: 1,
        title: "select_dependency",
        model: [],
        options: [],
    },
    dataTooltipIcons: [
        { // Open_document action
            text: `${UtilsServices.capitalizeFirstLetter(t("open_document"))}`,
            src: '/Buttons/icon-open.svg',
            color: 'blue',
            alt: 'open',
            show: (data: any) => { return dataFiles.fileToEdit !== data },
            onClick: ({action = "", data = {}, index = 0,}) => { dataFiles.actionsMenu(action, data, index) },
        },
        { // Assign dependence action
            text: `${UtilsServices.capitalizeFirstLetter(t("assign_dependencies"))}`,
            src: '/Buttons/icon-assign.svg',
            color: 'blue',
            alt: 'assign',
            show: (data: any) => { return dataFiles.fileToEdit !== data && hasPermissions.validator('share_file')},
            onClick: ({action = "", data = {}, index = 0,}) => { dataFiles.actionsMenu(action, data, index) },
        },
        { // Save document action
            text: `${UtilsServices.capitalizeFirstLetter(t("save"))}`,
            src: '/Buttons/icon-save.svg',
            color: 'blue',
            alt: 'open',
            show: (data: any) => { return dataFiles.fileToEdit === data && hasPermissions.validator('share_file')},
            onClick: ({action = "", data = {}, index = 0,}) => { dataFiles.actionsMenu(action, data, index) },
        },
        { // Cancel document action
            text: `${UtilsServices.capitalizeFirstLetter(t("cancel"))}`,
            src: '/Buttons/icon-close.svg',
            color: 'red',
            alt: 'cancel',
            show: (data: any) => { return dataFiles.fileToEdit === data && hasPermissions.validator('share_file')},
            onClick: ({action = "", data = {}, index = 0,}) => { dataFiles.actionsMenu(action, data, index) },
        },
    ],
    actionsMenu: (action: any, record: any, index: any = null) => { //Menu table
        validateActionFile(action, record, index)
    },
});

const dataModalAssignTable: any = reactive({
  title: 'assign_files_to_a_dependency',
  isActive: false,
  isAllChecked: false,
  fileList: [],
  stateLoadTable: true,
  stateLoadAssign: false,
  dataMultiselectDependence: {
        key: 2,
        title: "select_dependency",
        model: [],
        options: [],
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
      onChange: (value:any) => { },
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
    getService: (value:any) => { }
  },
  dataButtonAssign: {
    className: 'blue',
    text: 'assign',
    alt: 'save',
    url: "/Buttons/icon-save.svg",
    disabled: false,
    reverse: true,
    onClick: () => {
      updateFileDependence();
    }
  },
  dataButtonCancel: {
    className: 'grey',
    text: 'cancel',
    alt: 'cancel',
    url: "/Buttons/decline.svg",
    disabled: false,
    reverse: false,
    iconSize: 'short',
    onClick: () => {
      dataModalAssignTable.isActive = false;
    }
  },
  dataImgGoBack: {
      id: '',
      name: 'back',
      class: 'icon-back',
      src: '/Buttons/icon-close.svg',
      type: 'svg',
      alt: '',
      isActive: () => { }, // optional, currently used to add activate and deactivate the active class
      onClick: () => {
        dataModalAssignTable.isActive = false;
      }
  },
  dataTooltipIcons: [
    {
        text: UtilsServices.capitalizeFirstLetter(`${t("view")} ${t("radication")}`),
        src: '/Buttons/icon-view.svg',
        color: 'blue',
        alt: 'view',
        show: () => { return true; },
        onClick: ({data = {url: "", checked:true}}) => { dataModalAssignTable.openDocument(data.url); data.checked = !data.checked},
    },
  ],
  checkAll: () => {},
  openDocument: (url: any) => {
    findUrl(url);
  }
})

// Define methods and functions
onMounted(() => {
    getFiles("", 1);
});

/**
 * todo GET & SET
 */

watch(() => dataFiles.dataPaginator.page_size, () => {
    getFiles(dataFiles.dataInputSearch.dataInput.model, 1);
});

function getFiles(searched_value:any, page:any) {
    dataFiles.data = [];
    dataFiles.stateLoadData = true;
    FilesServices.getFiles(searched_value, page, dataFiles.dataPaginator.page_size)
        .then((response: any) => {
            console.log(response,'response');
            
            dataFiles.dataPaginator.page = page
            dataFiles.dataPaginator.total_pages = response.total_pages
            
            dataFiles.data = response.results.map((value: any) => {
                return {
                    ...value,
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



function redirectNewFiles() {
    /**
     * todo BUG/PROBLEM WITH ROUTER IN OTHERS VIEWS OF THE SAME MODULE ---  some must add files/ and others just the path 
     */
    router.push('files_records/upload_files');
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

async function findUrl(url: string) {
  try {
    // 1️⃣ Descarga el archivo como Blob
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al descargar el archivo');

    // 2️⃣ Convierte a Blob con tipo PDF
    const blob = await response.blob();
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });

    // 3️⃣ Crea una URL temporal para el visor
    const blobUrl = URL.createObjectURL(pdfBlob);

    // 4️⃣ Abre el modal con el PDF
    openModalPdfViewer(blobUrl);

    // 5️⃣ Guarda el ID o URL original
    documentId.value = url;
  } catch (error) {
    console.error(error);
    openModalAlert('something_happened_try_later');
  }
}
async function validateActionFile(action: any, file: any, index: any = null) {
    switch (action) {
        case 'see_document':
            console.log(file,'filefilefilefile');
            findUrl(file.url);
            break;
        case 'open_document':
            
            // router.push(`/home/files_records/${file.archive_number}`)
            break;
        case 'assign_dependencies':
        case 'cancel':
            let userAction: any = ['see_document', 'open_document', 'assign_dependencies'];
            if(dataFiles.fileToEdit != index) {
                let size: any = dataFiles.data.length;
                for(let i:any = 0; i < size; ++i){
                    if(i === index){
                        let dependenceList: any = dataFiles.data[index].dependence.map((depen:any) => depen.code);
                        dataFiles.dataMultiselectDependence.model = [];
                        dataFiles.dataMultiselectDependence.options.forEach((element: any) => {
                            let flag: any = dependenceList.includes(element.value);
                            element.checked = flag;
                            if(flag) {
                                dataFiles.dataMultiselectDependence.model.push(element.value);
                            }
                        }); 
                    }   
                }
                dataFiles.fileToEdit = index;
            } else {
                dataFiles.fileToEdit = null;
            }
            dataFiles.data[index].isMenuOpen = false;
            break;
        case 'save':
            await FilesServices.assignDependences(dataFiles.data[index].archive_number, dataFiles.dataMultiselectDependence.model)
                    .then(async (response: any) => {
                        openModalAlert(response);
                        getFiles("", 1);
                        dataFiles.fileToEdit = null;
                    })
                    .catch((error: any) => openModalAlert('no_dependency_has_been_selected'));
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

function downloadSummaryDocument(url: string): void {
    DataFlowServices.getFileResume(1)
        .catch((error:any)=>{
            openModalAlert('Download summary Document in progress');
            console.error(error);
        })
    console.log("On construction");
}

async function assignDependenceToFile(file_code:any, dependece: any) {
  await FilesServices.assignDependences(file_code, dependece);
}

function updateFileDependence() {
  const files: any = dataModalAssignTable.fileList.filter((file: any) => file.checked);
  if(files.length === 0){
    openModalAlert('a_file_was_not_assigned');
  } else if (dataModalAssignTable.dataMultiselectDependence.model.length === 0) {
    openModalAlert('no_dependency_has_been_selected');
  } else {
    const promesas = files.map((file: any) => assignDependenceToFile(file.code, dataModalAssignTable.dataMultiselectDependence.model));
    dataModalAssignTable.stateLoadAssign = true;
    Promise.all(promesas)
      .then(() => {
        openModalAlert('the_files_were_successfully_assigned');
        getFiles(dataFiles.dataInputSearch.dataInput.model, 1);
        dataModalAssignTable.stateLoadAssign = false;
        dataModalAssignTable.isActive = false;
        dataModalAssignTable.isAllChecked = true;
        dataModalAssignTable.checkAll();
        dataModalAssignTable.dataMultiselectDependence.model = [];
      })
      .catch(() => {
        openModalAlert('an_error_has_occurred_please_try_again_later');
        dataModalAssignTable.stateLoadAssign = false;
      });
  }
}

</script>

