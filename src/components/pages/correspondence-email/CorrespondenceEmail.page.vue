<template>
    <CorrespondenceEmail :dataCorrespondenceEmail="dataCorrespondenceEmail" @emitDocSelected="openDocSelected"
        :arrayList="arrayList" @applyFilters="applyFilters"/>
</template>
<script setup lang="ts">
import CorrespondenceEmail from '../../templates/correspondence-email/CorrespondenceEmail.template.vue';
import { reactive, onMounted, onUnmounted, watch, ref, computed } from 'vue';
import EmailCorrespondenceServices from '../../../services/EmailCorrespondenceServices';
import FilesServices from '../../../services/FilesServices';
import { accessStore } from '../../../store';
import FilingServices from '../../../services/FilingServices';
import DependenceServices from '../../../services/DependenceServices'
import FormValidators from '../../../validators/FormValidators';

const store = accessStore();
const arrayEmail: any = ref([])

// Assination function to const
const filesArrayFilingForm = ref(store.uploadedFiles);
const uidEmail: any = ref('');
const filters: any = ref([
    'Filtro 1',
    'Filtro 2',
    'Filtro 3',
]);

const dataCorrespondenceEmail: any = reactive({
    stateFormEmail: false,
    stateLoadForm: false,
    stateLoadData: false,
    stateResultResponse: false,
    stateCheckAll: false,
    currentPage: 1,
    totalPages: 0,
    list: [],
    dataEmail: {
        date: '',
        from: '',
        subject: '',
    },
    form: {
        id: '',
        person_type: '001',//Value required
        subject: '',
        uid_email: '',
        email: '',
        remitter: '',
        address: '',
        assigned_user_id: '',
        phone_number: '',
        user_dependence: '',
        social_razon: '',
        nit: '',
        description: '',
        first_name: '',
        last_name: '',
    },
    dataButtonRefresh: {
        className: 'blue',
        text: 'refresh',
        alt: 'refresh',
        url: '/Buttons/icon-refresh.svg',
        reverse: true,
        iconSize: 'large',
        disabled: false,
        onClick: () => { getEmails(dataCorrespondenceEmail.currentPage) }
    },
    dataButtonBack: {
        className: '',
        text: 'back',
        alt: 'left-arrow',
        url: '/Buttons/left-arrow.svg',
        reverse: false,
        disabled: false,
        onClick: () => { setStatesBack() }
    },
    dataImgBack: {
        id :'',
        name:'back',
        class: 'icon-back',
        src: '/arrow-left.svg',
        type: 'svg',
        alt: '',
        isActive: () => { }, // optional, currently used to add activate and deactivate the active class
        onClick: () => { setStatesBack() }
    },
    dataButtonNext: {
        className: 'blue',
        text: 'create_filing',
        alt: 'create',
        url: "/Buttons/icon-create.svg",
        reverse: true,
        disabled: false,
        onClick: () => { createNewFiling() }
    },
    dataButtonDelete: {
        className: 'gray',
        text: 'delete',
        alt: 'delete',
        url: '/Buttons/icon-delete.svg',
        reverse: false,
        disabled: true,
        onClick: () => { deleteArrayEmails() }
    },
    dataInputFiles: {
        counterFiles: store.uploadedFiles.length,
        openModalDocs: () => {
            openModalListDocuments();
        },
        dataModalListDocuments: {
            isActive: false,
            closeModal: () => { closeModalListDocuments(); },
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
            onClick: () => { }
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
    dataModalAlert: {
        isActive: '', // -- > show
        dataButton: {
            className: 'blue',
            text: 'continue',
            disabled: false,
            onClick: () => { closeModalAlert() }
        },
        dataText: {
            classText: '',
            text: 'Esta es la descripcion',
            disabled: false,
            onClick: () => { }
        }
    },
    dataModalConfirmation: {
        isActive: '',
        dataButton: {
            className: '',
            text: 'finished',
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
    dataSelectDependence: {
        id: '',
        name: '',
        className: '',
        disabled: true,
        onChange: (data: any) => {
            selectDependenceInputChange(data.target.value)

        },
        onClick: () => { },
        placeholder: 'select_dependency',
        model: '',
        options: []
    },
    dataSelectUser: {
        id: '',
        name: '',
        className: '',
        disabled: false,
        onChange: (data: any) => {

        },
        onClick: () => { },
        placeholder: 'select_user',
        model: '',
        options: []
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
            getEmails(value);
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
    openEmail: (data: any) => { openFormResponseEmail(data) },
    selectEmail: (email: any) => { selectEmail(email) },
    selectAllEmails: () => { selectAllEmails('table__row__cell'); }
});

onMounted(() => {
    getEmails(dataCorrespondenceEmail.dataPaginator.page);
    getParentDependences();
})

watch(() => dataCorrespondenceEmail.dataPaginator.page_size, () => {
    getEmails(dataCorrespondenceEmail.dataPaginator.page);
});

function getEmails(page: number | string) {
    dataCorrespondenceEmail.list = [];
    dataCorrespondenceEmail.stateLoadData = true;
    EmailCorrespondenceServices.getEmails(page, dataCorrespondenceEmail.dataPaginator.page_size)
        .then((response: any) => {
            dataCorrespondenceEmail.stateLoadData = false;
            dataCorrespondenceEmail.list = response.list_emails;
            dataCorrespondenceEmail.dataPaginator.total_pages = response.total_pages;
        })
        .catch((error: any) => {
            dataCorrespondenceEmail.stateLoadData = false;
            console.error(error);
        })
}

async function getParentDependences() {
    const data: any = [];
    let listDependences: any;
    try {

        listDependences = await DependenceServices.getParentDependences();
        listDependences.forEach((element: any) => {
            data.push({
                value: element.code,
                label: element.name
            });
        });
        dataCorrespondenceEmail.dataSelectDependence.options = data;
        dataCorrespondenceEmail.dataSelectDependence.disabled = false;
    } catch (error) {
    }
}

async function selectDependenceInputChange(data: any) {
    const arrayData: any = [];
    try {
        const response = await FilingServices.getUsersDependence(data)
        if (response.error) {
            console.error('error usuario', response.data);
        }
        response.response.forEach((element: any) => {
            arrayData.push({
                value: element.id,
                label: element.email
            });
        });
        dataCorrespondenceEmail.dataSelectUser.options = arrayData;
        dataCorrespondenceEmail.dataSelectUser.disabled = false;
    } catch (error) {
        console.error(error, 'error sssssss');
        dataCorrespondenceEmail.dataSelectUser.options = [];
        dataCorrespondenceEmail.dataSelectUser.disabled = true;

    }
}

function getEmail(id: string | number): void {
    EmailCorrespondenceServices.getEmail(id)
        .then((response: any) => {
            dataCorrespondenceEmail.stateResultResponse = true;
            if (response.document != null) {
                response.document.map((element: any) => {
                    const file = {
                        name: element.substring(element.lastIndexOf('/') + 1),
                        url: element,
                        remove: false,
                    };
                    store.addUploadedFile(file);
                });
            }
            dataCorrespondenceEmail.dataInputFiles.counterFiles = store.uploadedFiles.length;
        })
        .catch((error: any) => {
            console.error(error);
        })
}

/**
 * todo WATCHS
 */

watch(dataCorrespondenceEmail.list, (newFiles: any, oldFiles) => {
    dataCorrespondenceEmail.list = newFiles;
});


// Crear una propiedad computada que derive la longitud del array
const uploadedFilesLength = computed(() => store.uploadedFiles.length);
// watch para la longitud del array
watch(uploadedFilesLength, (newLength, oldLength) => {
  dataCorrespondenceEmail.dataInputFiles.counterFiles = newLength;
});


watch(() => dataCorrespondenceEmail.form.person_type, (newValue: boolean, oldValue: boolean) => {
    dataCorrespondenceEmail.form.id = '';
    dataCorrespondenceEmail.form.address = '';
    dataCorrespondenceEmail.form.first_name = '';
    dataCorrespondenceEmail.form.last_name = '';
    dataCorrespondenceEmail.form.nit = '';
    dataCorrespondenceEmail.form.social_razon = '';
});




const arrayList: any = computed(() => {
    if (!dataCorrespondenceEmail.dataInputSearch.dataInput.model) return dataCorrespondenceEmail.list;
    return dataCorrespondenceEmail.list.filter((email: any) => {
        return Object.values(email).some(value =>
            String(value).toLowerCase().includes(dataCorrespondenceEmail.dataInputSearch.dataInput.model.toLowerCase())
        );
    });
});

function selectAllEmails(className: string) {
    const containers = document.querySelectorAll('.' + className);
    containers.forEach((container: any) => {
        const inputs = container.querySelectorAll('input[type="checkbox"]');
        inputs.forEach((input: any) => {
            input.checked = !input.checked;
            const event = new Event('change', { bubbles: true });
            input.dispatchEvent(event);
        });
    });
}


function selectEmail(email: any) {
    const index = arrayEmail.value.findIndex((value: any) => value === email);
    if (index !== -1) {
        arrayEmail.value.splice(index, 1);
    } else {
        arrayEmail.value.push(email);
    }
    validateStateButtonDelete();
}

function deleteArrayEmails() {
    if (arrayEmail.value.length < 1) return;
    let formData: any = new FormData();
    formData.append('uid_emails', JSON.stringify(arrayEmail.value));
    EmailCorrespondenceServices.deleteEmails(formData)
        .then((response: any) => {
            setStatesBack();
            dataCorrespondenceEmail.stateCheckAll = false;
        });
}

function createNewFiling() {
    dataCorrespondenceEmail.stateLoadForm = true;
    let formData = new FormData();

    let document_email: any = [];
    let document: any = [];

    if (FormValidators.getValidationForm('correspondence-email__form__wrapper__remitter-info') && FormValidators.getValidationForm('correspondence-email__form__wrapper__email-info')) {

        store.uploadedFiles.forEach((response: any) => {

            if (response.url === undefined) {
                formData.append('document', response);
            } else {
                document_email.push(response.url);
            }
        });
        (dataCorrespondenceEmail.form.subject != '' && dataCorrespondenceEmail.form.subject != null) && formData.append('subject', dataCorrespondenceEmail.form.subject);
        (uidEmail.value != '' && uidEmail.value != null) && formData.append('uid_email', uidEmail.value);
        (dataCorrespondenceEmail.form.email != '' && dataCorrespondenceEmail.form.email != null) && formData.append('email', dataCorrespondenceEmail.form.email);
        (dataCorrespondenceEmail.form.id != '' && dataCorrespondenceEmail.form.id != null) && formData.append('identification_number', dataCorrespondenceEmail.form.id);
        (dataCorrespondenceEmail.form.person_type != '' && dataCorrespondenceEmail.form.person_type != null) && formData.append('person_type', dataCorrespondenceEmail.form.person_type);
        (dataCorrespondenceEmail.form.remitter != '' && dataCorrespondenceEmail.form.remitter != null) && formData.append('remitter', dataCorrespondenceEmail.form.remitter);
        (dataCorrespondenceEmail.form.address != '' && dataCorrespondenceEmail.form.address != null) && formData.append('address', dataCorrespondenceEmail.form.address);
        (dataCorrespondenceEmail.dataSelectUser.model != '' && dataCorrespondenceEmail.dataSelectUser.model != null) && formData.append('assigned_user_id', dataCorrespondenceEmail.dataSelectUser.model);
        (dataCorrespondenceEmail.form.phone_number != '' && dataCorrespondenceEmail.form.phone_number != null) && formData.append('phone_number', dataCorrespondenceEmail.form.phone_number);
        (dataCorrespondenceEmail.dataSelectUser.model != '' && dataCorrespondenceEmail.dataSelectUser.model != null) && formData.append('user_dependence', dataCorrespondenceEmail.dataSelectUser.model);
        (dataCorrespondenceEmail.form.social_razon != '' && dataCorrespondenceEmail.form.social_razon != null) && formData.append('social_razon', dataCorrespondenceEmail.form.social_razon);
        (dataCorrespondenceEmail.form.nit != '' && dataCorrespondenceEmail.form.nit != null) && formData.append('nit', dataCorrespondenceEmail.form.nit);
        (dataCorrespondenceEmail.form.description != '' && dataCorrespondenceEmail.form.description != null) && formData.append('description', dataCorrespondenceEmail.form.description);
        (dataCorrespondenceEmail.form.first_name != '' && dataCorrespondenceEmail.form.first_name != null) && formData.append('first_name', dataCorrespondenceEmail.form.first_name);
        (dataCorrespondenceEmail.form.last_name != '' && dataCorrespondenceEmail.form.last_name != null) && formData.append('last_name', dataCorrespondenceEmail.form.last_name);
        formData.append('documents_email', JSON.stringify(document_email));


        if (dataCorrespondenceEmail.form.subject != '' && dataCorrespondenceEmail.form.subject != null) formData.append('id', dataCorrespondenceEmail.form.subject);

        EmailCorrespondenceServices.createFilingEmail(formData)
            .then((response: any) => {
                dataCorrespondenceEmail.dataModalConfirmation.dataText.text = 'filing_successfully_created';
                dataCorrespondenceEmail.dataModalConfirmation.isActive = 'show';
            })
            .catch((error: any) => {
                if (error.status_code == 400 || error.status == "error") {
                    dataCorrespondenceEmail.dataModalAlert.isActive = "show"
                    dataCorrespondenceEmail.dataModalAlert.dataText.text = error.error?.details[0]
                } else {
                    dataCorrespondenceEmail.dataModalAlert.isActive = "show"
                    dataCorrespondenceEmail.dataModalAlert.dataText.text = "an_error_has_occurred_please_try_again_later"
                }
            });

    } else {
        dataCorrespondenceEmail.dataModalAlert.isActive = 'show';
        dataCorrespondenceEmail.dataModalAlert.dataText.text = 'empty_inputs';
    }
}


function validateStateButtonDelete() {

    if (arrayEmail.value.length > 0) {
        dataCorrespondenceEmail.dataButtonDelete.disabled = false;
        dataCorrespondenceEmail.dataButtonDelete.className = 'red';
    } else {
        dataCorrespondenceEmail.dataButtonDelete.disabled = true;
        dataCorrespondenceEmail.dataButtonDelete.className = 'gray';

    }
}


function setStatesBack() {
    arrayEmail.value = [];
    getEmails(dataCorrespondenceEmail.currentPage);
    dataCorrespondenceEmail.stateFormEmail = false;
    dataCorrespondenceEmail.stateResultResponse = false;

    store.clearUploadedFiles();
    validateStateButtonDelete();
    dataCorrespondenceEmail.dataInputSearch.dataInput.model = '';
    dataCorrespondenceEmail.stateLoadForm = false;
    dataCorrespondenceEmail.form = {
        id: '',
        person_type: '001',
        subject: '',
        uid_email: '',
        email: '',
        remitter: '',
        address: '',
        assigned_user_id: '',
        phone_number: '',
        user_dependence: '',
        social_razon: '',
        nit: '',
        description: '',
    }
}




function openDocSelected(index: number | string): void {



    if (store.uploadedFiles[index].url === undefined) { //Validate if is a route or file
        const reader = new FileReader();
        reader.readAsDataURL(store.uploadedFiles[index]);//File
        reader.onload = () => {
            const base64String = reader.result as string;
            openModalPdfViewer(base64String);
        };
    } else {
        FilesServices.getDocumentContent(store.uploadedFiles[index].url)
            .then((response: any) => {
                
                openModalPdfViewer(response);//route
            })
            .catch((error: any) => {
                console.error(error);
            })

    }

}



function openFormResponseEmail(data: any) {
    getEmail(data.uid)
    uidEmail.value = data.uid;
    dataCorrespondenceEmail.dataEmail = {
        date: data.date,
        from: data.from,
        subject: data.subject,
    }
    dataCorrespondenceEmail.stateFormEmail = true;
    dataCorrespondenceEmail.form.email = extractEmail(data.from);
    dataCorrespondenceEmail.form.subject = data.subject;

}

function extractEmail(emailString: string): string {
    const emailPattern = /<(.+)>/;
    const match = emailString.match(emailPattern);

    if (match && match[1]) {
        return match[1];
    }

    return 'Empty'; // Devuelve null si no se encuentra una dirección de correo válida
}
function openModalListDocuments() {
    dataCorrespondenceEmail.dataInputFiles.dataModalListDocuments.isActive = true;
}


function openModalPdfViewer(url: string): void {
    dataCorrespondenceEmail.dataModalPdfViewer = {
        isActive: 'show',
        dataPdfViewer: {
            urlPdf: url,
            toolbar: { toolbar: false },
            onClose: () => { }
        }

    }
}

function closeModalListDocuments() {
    dataCorrespondenceEmail.dataInputFiles.dataModalListDocuments.isActive = false;
}


function closeModalAlert() {
    dataCorrespondenceEmail.dataModalAlert.isActive = 'hidde';
    dataCorrespondenceEmail.stateLoadForm = false;
}

function closeModalConfirmation() {
    dataCorrespondenceEmail.dataModalConfirmation.isActive = 'hidde';
    setStatesBack();
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

onUnmounted(() => {
    store.clearUploadedFiles();
})

</script>

<style scoped src="./CorrespondenceEmail.page.scss"></style>