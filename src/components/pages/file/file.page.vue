<template>
    <FileTemplate :dataFile="dataFile" />
</template>
<script setup lang="ts">

import FileTemplate from '../../templates/file/file.template.vue';
import { reactive, onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import FilesServices from '../../../services/FilesServices.ts';
import TrdServices from '../../../services/TrdServices.ts';
import RecordsServices from '../../../services/RecordsServices.ts';
import UtilsServices from '../../../services/UtilsServices.ts';
import DependenceService from '../../../services/DependenceServices.ts';
import { accessStore } from '../../../store';

const store: any = accessStore();
const router = useRouter();
const route: any = useRoute();
const fileId: any = ref('');
const dataFile: any = reactive(getDataFileTemplate())

onMounted(() => {
    validateIdDocument();
    callServices();
})

watch(() => dataFile.dependencesList, (newDependences) => {
    verifyAllchecked();
}, { deep: true });

async function callServices() {
    await getDocument();
    searchDependences("", 1);
    getDocumentaryType();
    redirectDocument();
    searchRecordList("", 1);
}

function getDataFileTemplate() {
    return reactive({
        stateEditForm: false,
        stateViewDocument: true,
        stateAssignRecord: false,
        stateAssignDependencies: false,
        isAllChecked: false,
        records: [],
        dependencesList: [],
        selectedCode: null,
        stateLoadTable: true,
        dataPdfViewer: {
            urlPdf: "",
            toolbar: { 
                toolbar: false 
            },
            onClose: () => { }
        },
        data: {
            name: '',
            archive_number: '',
        },
        dataSelectActions: {
            id: '',
            name: '',
            className: '',
            disabled: false,
            onChange: (data: any) => {
                validateSelect(data.target.value);
                dataFile.dataSelectActions.model = '';//Refresh select and values before be selected
            },
            onClick: () => { },
            placeholder: 'actions',
            model: '',
            options: [
                {
                    value: 'edit',
                    label: 'edit'
                },
            ]
        },
        dataButtonAssign: {
            className: 'blue',
            text: 'assign',
            alt: 'save',
            url: "/Buttons/icon-save.svg",
            disabled: false,
            reverse: true,
            onClick: () => {
                if(dataFile.stateAssignRecord) {
                    assignDocumentToRecord();
                } else if(dataFile.stateAssignDependencies) {
                    assignDependencies();
                }
            }
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
                router.push('/home/files_records');
            }
        },
        dataModalConfirmation: {
            isActive: '',
            dataButton: {
                className: 'blue',
                text: 'Inicio de sesión',
                disabled: false,
                onClick: () => { closeModalConfirmation() }
            },
            dataText: {
                classText: '',
                text: 'Esta es la descripcion',
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
                onClick: () => { closeModalAlert() }
            },
            dataText: {
                classText: '',
                text: '',
                disabled: false,
                onClick: () => { }
            }
        },
        dataSelectDocumentaryType: {
            id: '',
            name: '',
            className: '',
            disabled: false,
            onChange: (data: any) => {

            },
            onClick: () => { },
            placeholder: 'type_documental',
            model: '',
            required: false,
            options: [
            ],
            text: ""
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
                    searchRecordList(value, 1)
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
        dataInputSearch2: {
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
                    searchDependences(value, 1)
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
                searchRecordList(dataFile.dataInputSearch.dataInput.model, value)
            }
        },
        dataPaginator2: {
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
                searchDependences(dataFile.dataInputSearch2.dataInput.model, value)
            }
        },
        redirectDocument: () => {
            redirectDocument();
        },
        redirectAssignRecord: () => {
            redirectAssignRecord();
        },
        redirectAssignDependencies: () => {
            redirectAssignDependencies();
        },
        selectRecord: (recordCode: any) => {
            selectRecord(recordCode)
        },
        checkAll: () => {
            checkAll()
        }
    });
}

function validateIdDocument() {
    if (route.params.id != null && route.params.id != '') {
        fileId.value = route.params.id;
    } else {
        fileId.value = 1;
    }
}

async function searchRecordList(searched_value: any, page: any) {
    dataFile.stateLoadTable = true;
    await RecordsServices.searchRecordsAssignTable(searched_value, page, 50)
        .then(async (response: any) => {
            dataFile.dataPaginator.page = page
            dataFile.dataPaginator.total_pages = response.total_pages
            dataFile.records = response.results;
            dataFile.stateLoadTable = false;
        })
        .catch((error: any) => {
            dataFile.stateLoadTable = false;
            openModalAlert('something_happened_try_later');
            console.error(error);
        });
}

async function searchDependences(searched_value: any, page: any) {
    dataFile.stateLoadTable = true;
    await DependenceService.searchDependences(searched_value, page, 50)
        .then(async (response: any) => {
            dataFile.dataPaginator2.page = page
            dataFile.dataPaginator2.total_pages = response.total_pages
            dataFile.dependencesList = response.results.map((dependence: any) => {
                return {
                    code: dependence.code,
                    name: dependence.name,
                    checked: dataFile.data.dependence.includes(dependence.code),
                };
            });
            dataFile.stateLoadTable = false;
        })
        .catch((error: any) => {
            dataFile.stateLoadTable = false;
            openModalAlert('something_happened_try_later');
            console.error(error);
        });
}

async function getDocument() {
    dataFile.data = {};
    await FilesServices.getFile(fileId.value)
        .then(async (response: any) => {
            dataFile.data = {
                name: response.document_name,
                archive_number: response.archive_number,
                date: response.date,
                number_of_pages: response.number_pages,
                url: response.document,
                dependence: response.dependence.map((obj: any) => obj.code),
                dependences_to_show: response.dependence.map((obj: any) => obj.name).join(', '),
            }
            dataFile.dataSelectDocumentaryType.model = response.documentary_type.id;
            dataFile.dataSelectDocumentaryType.text = response.documentary_type.name_document_type;
            FilesServices.getDocumentContent(dataFile.data.url)
                .then(async response => {
                    dataFile.dataPdfViewer.urlPdf = response;
                })
                .catch((error: any) => {
                    console.error(error)
                });
        })
        .catch((error: any) => {
            console.error(error);
            openModalAlert(error.response.data.error.details[0]);
        });
}

function getDocumentaryType() {
    TrdServices.getDocumentaryType()
        .then((response: any) => {
            dataFile.dataSelectDocumentaryType.options = response.results.map((value: any) => 
            {   
                if(dataFile.dataSelectDocumentaryType.model === value.id){
                    dataFile.dataSelectDocumentaryType.text = value.name_document_type;
                }
                return {
                    label: value.name_document_type,
                    value: value.id,
                }
            })
        });
}

function validateSelect(key: any): void {
    switch (key) {
        case 'edit':
            if(dataFile.stateEditForm) {
                sendArchiveData()
                dataFile.dataSelectActions.options[0].label = 'edit'
            } else {
                dataFile.dataSelectActions.options[0].label = 'save'
            }
            dataFile.stateEditForm = !dataFile.stateEditForm;
            break;
        default:
            break;
    }
}

function refreshStates() {
    dataFile.stateEditForm = false;
    callServices();
    Object.assign(dataFile, getDataFileTemplate());
}

function closeModalConfirmation() {
    dataFile.dataModalConfirmation.isActive = 'hidde';
    refreshStates();
}

function openModalConfirmation(text: string): void {
    dataFile.dataModalConfirmation = {
        isActive: 'show',
        dataButton: {
            className: 'blue',
            text: 'continue',
            disabled: false,
            onClick: () => { closeModalConfirmation() }
        },
        dataText: {
            classText: '',
            text: text,
            disabled: false,
            onClick: () => { }
        }
    }
}

function openModalAlert(text: string): void {
    dataFile.dataModalAlert.isActive = 'show';
    dataFile.dataModalAlert.dataText.text = text;
}

function closeModalAlert(): void {
    dataFile.dataModalAlert.isActive = 'hidde';
}

function sendArchiveData() {
    let formData = new FormData();
    (dataFile.data.name != '' && dataFile.data.name != null) && formData.append('document_name', dataFile.data.name);
    (dataFile.dataSelectDocumentaryType.model != '' && dataFile.dataSelectDocumentaryType.model != null) && formData.append('documentary_type', dataFile.dataSelectDocumentaryType.model);
    FilesServices.updateFile(fileId.value, formData)
        .then((response: any) => {
            openModalConfirmation('action_performed_succesfully');
        })
        .catch((error: any) => {
            console.error(error);
            openModalAlert(error.response.data.error.details[0])
        })


}

function setstateView(documentView: any, assignRecordView: any, stateAssignDependencies: any){
    dataFile.stateViewDocument = documentView;
    dataFile.stateAssignRecord = assignRecordView;
    dataFile.stateAssignDependencies = stateAssignDependencies;
}

async function redirectDocument() {
    setstateView(true, false, false);
    changeColor(1);
}

function redirectAssignRecord() {
    setstateView(false, true, false);
    changeColor(1);
}

function redirectAssignDependencies() {
    setstateView(false, false, true);
    changeColor(1);
}

function changeColor(index: any) {
    let color: any = store.getColor()[index].template.filingNavegation;
    UtilsServices.changeColor(color);
}

function selectRecord(recordData: any) {
    if(dataFile.selectedCode?.id === recordData.id){
        dataFile.selectedCode = null;
    } else {
        dataFile.selectedCode = {
            id: recordData.id,
            type: recordData.type
        };
    }
}

function assignDocumentToRecord() {
    if(!dataFile.selectedCode) {
        openModalAlert('a_record_was_not_assigned')
    } else {
        let recordType = dataFile.selectedCode.type;
        let action = recordType === 'folder' ? 'move_to_folder' : 'move_to_record'
        FilesServices.moveFileToRecord(fileId.value, action, dataFile.selectedCode.id)
            .then(response => {
                openModalConfirmation(response);
                dataFile.dataModalConfirmation.dataButton.onClick = () => {
                    dataFile.dataModalConfirmation.dataButton.onClick;
                    router.push("/home/files_records");
                }
            })
            .catch((error) => {
                console.error(error)
                openModalAlert("an_error_has_occurred_please_try_again_later");
            })
    }
}

function checkAll() {
    dataFile.isAllChecked = !dataFile.isAllChecked;
    dataFile.dependencesList.forEach((dependence: any) => {
        dependence.checked = dataFile.isAllChecked; 
    });
}

function verifyAllchecked() {
    dataFile.isAllChecked = dataFile.dependencesList.every((dependence: any) => dependence.checked);
}

function assignDependencies() {
    const dependenceList = dataFile.dependencesList.filter((dependece: any) => dependece.checked).map((dependece: any) => dependece.code);
    if(dependenceList.length === 0) {
        openModalAlert('no_dependency_has_been_selected')
    } else {
        FilesServices.assignDependences(fileId.value, dependenceList)
            .then(response => {
                openModalConfirmation(response);
            })
            .catch((error) => {
                console.error(error)
                openModalAlert("an_error_has_occurred_please_try_again_later");
            })
    }
}

</script>