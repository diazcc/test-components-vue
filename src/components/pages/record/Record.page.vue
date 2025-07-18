<template>
    <RecordTemplate :dataRecord="dataRecord" />
</template>

<script setup lang="ts">

// Import vue libraries
import { onBeforeMount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

// Import components
import RecordTemplate from '../../templates/record/Record.template.vue';

// Import services
import RecordsServices from '../../../services/RecordsServices';
import { accessStore } from '../../../store';
import FilesServices from '../../../services/FilesServices';
import UtilsServices from '../../../services/UtilsServices';

// Define emit and props and configuration
const route: any = useRoute();
const router: any = useRouter();
const store: any = accessStore();
const { t } = useI18n();

// Define variables and constants
const recordId: any = ref(route.params.id);
const isRecord: any = ref(route.query.isRecord)

const dataRecord: any = reactive({
    stateLoad: false,
    stateViewDocument: true,
    stateAssignFile: false,
    stateLoadTable: false,
    isAllChecked: false,
    stateLoadassign: false,
    data: [],
    files: [],
    info: {
        code: "",
        documents: [],
        filings_count: 1,
        id: 0,
        name: '',
        serie: '',
        subserie: '',
    },
    dataImgGoBack: {
        id: '',
        name: 'back',
        class: 'icon-back',
        src: '/arrow-left.svg',
        type: 'svg',
        alt: '',
        isActive: () => { }, // optional, currently used to add activate and deactivate the active class
        onClick: () => {
            goBack();
        }
    },
    dataSelectActions: {
        id: '',
        name: '',
        className: '',
        disabled: false,
        placeholder: 'actions',
        model: '',
        options: [],
        onChange: (data: any) => {
            //validateSelect(data.target.value);
            dataRecord.dataSelectActions.model = '';//Refresh select and values before be selected
        },
        onClick: () => { },
    },
    dataModalPdfViewer: {
        isActive: '',
        dataPdfViewer: {
            urlPdf: '',
            toolbar: {
                toolbar: {
                    toolbarViewerMiddle: false,
                    toolbarViewerLeft: false
                }
            },
            onClose: () => {
            }
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
                searchRecordFiles(value, 1);
            }
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
    dataButtonAssign: {
        className: 'blue',
        text: 'assign',
        alt: 'save',
        url: "/Buttons/icon-save.svg",
        disabled: false,
        reverse: true,
        onClick: () => {
            assignDocumentsToRecord();
        }
    },
    dataModalConfirmation: {
        isActive: '',
        dataButton: {
            className: 'blue',
            text: 'close',
            disabled: false,
            onClick: () => { dataRecord.dataModalConfirmation.isActive = 'hidde'; }
        },
        dataText: {
            classText: '',
            text: '',
            disabled: false,
            onClick: () => { }
        }
    },
    dataModalAlert: {
        isActive: '',
        dataButton: {
            className: '',
            text: 'close',
            disabled: false,
            onClick: () => { dataRecord.dataModalAlert.isActive = 'hidde'; }
        },
        dataText: {
            classText: '',
            text: '',
            disabled: false,
            onClick: () => { }
        }
    },
    dataTooltipIcons: [
        {
            text: UtilsServices.capitalizeFirstLetter(`${t("view")} ${t("file")}`),
            src: '/Buttons/icon-view.svg',
            color: 'blue',
            alt: 'view',
            show: () => { return true; },
            onClick: ({document = "", data = {checked:true}}) => {dataRecord.openDocument(document); data.checked = !data.checked},
        },
    ],
    openDocument: (document: any) => {
        openModalPdfViewer(document.url)
    },
    redirectDocument: () => {
        redirectDocument();
    },
    redirectAssignFiles: () => {
        redirectAssignFiles();
    },
    checkAll: () => {
        checkAll();
    },
})

onBeforeMount(() => {
    window.history.replaceState({}, '', `/home/record/${recordId.value}`);
})

onMounted(() => {
    callServices()
})

watch(() => dataRecord.files, (newFiles) => {
    verifyAllchecked();
}, { deep: true });

function callServices() {
    getRecord(recordId.value);
    redirectDocument();
    searchRecordFiles('', 1);
}

function searchRecordFiles(searched_value: any, page: any){
    dataRecord.stateLoadTable = true;
    dataRecord.isAllChecked = false;
    dataRecord.files = [];
    FilesServices.getFiles(searched_value, page, 20)
        .then((response: any) => {
            dataRecord.files = response.results.map((file: any) => {
                return {
                    code: file.archive_number,
                    name: file.document_name,
                    url: file.document,
                    checked: false,
                };
            });
            dataRecord.stateLoadTable = false;
        })
        .catch((error: any) => {
            dataRecord.stateLoadTable = false;
            console.error(error);
        });
}

function getRecord(id: any) {
    dataRecord.stateLoad = true;
    RecordsServices.getRecord(id, true, isRecord.value)
        .then((response: any) => {
            dataRecord.stateLoad = false;
            dataRecord.info = {
                code: response.response.code,
                documents: response.response.documents,
                filings_count: response.response.filings_count,
                id: response.response.id,
                name: response.response.name,
                serie: response.response.serie?.name,
                subserie: response.response.subserie?.name,
            }
        })
        .catch((error: any) => {
            dataRecord.stateLoad = false;
            console.error(error);
        })
}

function openModalPdfViewer(path: any) {
    dataRecord.dataModalPdfViewer.isActive = 'show';
    FilesServices.getDocumentContent(path)
        .then((response: any) => {
            dataRecord.dataModalPdfViewer.dataPdfViewer.urlPdf = response;
        })
        .catch((error: any) => {
            dataRecord.dataModalPdfViewer.isActive = 'hidde';

            dataRecord.dataModalAlert.isActive = 'show';
            dataRecord.dataModalAlert.dataText.text = error;
        });
}

function goBack() {
    router.back();
}

async function assignDocumentsToRecord() {
    const files: any = dataRecord.files.filter((file: any) => file.checked);
    if(files.length === 0){
        openModalAlert('a_file_was_not_assigned');
    }
    else {
        const promesas = files.map((file: any) => assignFileTorecord(file.code));
        dataRecord.stateLoadassign = true;
        Promise.all(promesas)
            .then(() => {
                openModalConfirmation('the_files_were_successfully_assigned');
                searchRecordFiles('', 1);
                getRecord(recordId.value);
                dataRecord.stateLoadassign = false;
            })
            .catch(() => {
                openModalAlert('an_error_has_occurred_please_try_again_later');
                dataRecord.stateLoadassign = false;
            });
    }
}

async function assignFileTorecord(file_code:any) {
    let action = isRecord.value == 'true' ? 'move_to_record' : 'move_to_folder';
    await FilesServices.moveFileToRecord(file_code, action, recordId.value);
}

function checkAll() {
    dataRecord.isAllChecked = !dataRecord.isAllChecked;
    dataRecord.files.forEach((file: any) => {
       file.checked = dataRecord.isAllChecked; 
    });
}

function verifyAllchecked() {
    dataRecord.isAllChecked = dataRecord.files.every((file: any) => file.checked);
};

function openModalAlert(text: string) {
    dataRecord.dataModalAlert.isActive = 'show';
    dataRecord.dataModalAlert.dataText.text = text;
}

function openModalConfirmation(text: any) {
    dataRecord.dataModalConfirmation.isActive = 'show';
    dataRecord.dataModalConfirmation.dataText.text = text;
}

function setstateView(documentView: any, assignFileView: any){
    dataRecord.stateViewDocument = documentView;
    dataRecord.stateAssignFile = assignFileView;
}

async function redirectDocument() {
    setstateView(true, false);
    changeColor(1);
}

function redirectAssignFiles() {
    setstateView(false, true);
    changeColor(1);
}

function changeColor(index: any) {
    let color: any = store.getColor()[index].template.filingNavegation;
    UtilsServices.changeColor(color);
}

</script>
<style scoped></style>