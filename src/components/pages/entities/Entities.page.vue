<template>
    <EntitiesTemplate :dataEntities="dataEntities" @applyFilters="applyFilters"/>
</template>
<script setup lang="ts">

// Import vue library
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

// Import components
import EntitiesTemplate from '../../templates/entities/Entities.template.vue';

// Import services
import EntitiesServices from '../../../services/EntitiesServices.ts';
import FormValidators from '../../../validators/FormValidators.ts';
import { accessStore } from '../../../store';
import hasPermissions from '../../../guards/hasPermissions.guard.ts';
import UtilsServices from '../../../services/UtilsServices.ts'; 

const { t } = useI18n();
const store: any = accessStore();
const router = useRouter();
const filters: any = ref([
    'Filtro 1',
    'Filtro 2',
    'Filtro 3',
]);
const dataEntities: any = reactive({
    stateFormEntities: false,
    stateResponse: false,
    stateResponseLoad: false,
    stateLoadData: false,
    filterSelected: '',
    list: [],
    form: {
        publicName: '',
        schemaName: '',
        namePersonResponsible: '',
        nit: '',
        cdv: '',
        typeOfEntity: '',
        address: '',
        email: '',
        phone: '',
    },
    dataButtonNewEntity:
    {
        className: 'blue',
        text: 'new',
        alt: 'new',
        url: '/Buttons/icon-add.svg',
        reverse: true,
        disabled: false,
        onClick: () => { setFormCreateEntity(); }
    },
    dataInputText: {
        id: '',
        name: 'password',
        classInput: '',
        model: '',
        type: 'password',
        placeholder: '',
        disabled: false,
        required: false,
        onClick: () => { }
    },
    dataButtonNext:
    {
        className: 'blue',
        text: 'create',
        alt: 'create',
        url: '/Buttons/icon-create.svg',
        iconSize: 'large',
        reverse: true,
        disabled: false,
        onClick: () => { createNewEntity() }
    },
    dataButtonBack:
    {
        className: '',
        text: 'back',
        alt: 'left-arrow',
        url: '/Buttons/left-arrow.svg',
        disabled: false,
        onClick: () => { refreshData() }
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
    dataModalConfirmation: {
        isActive: '',
        dataButton: {
            className: 'blue',
            text: 'continue',
            disabled: false,
            onClick: () => { closeModalConfirmation() }
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
                searchEntitiesList(value, 1)
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
            searchEntitiesList(dataEntities.dataInputSearch.dataInput.model, value)
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
            text: UtilsServices.capitalizeFirstLetter(`${t("view")} ${t("entity")}`),
            src: '/Buttons/icon-view.svg',
            color: 'blue',
            alt: 'view',
            show: () => { return true},
            onClick: ({index = -1}) => { redirectToEntity(index) },
        },
        {
            text: UtilsServices.capitalizeFirstLetter(`${t("delete")} ${t("entity")}`),
            src: '/Buttons/icon-delete.svg',
            color: 'red',
            alt: 'delete',
            show: ({data = {}}) => { return hasPermissions.validator('delete_entities'); },
            onClick: ({index = -1}) => { deleteEntity(index) },
        },
    ],
})



/**
 * todo  -------------------------- FUNCTIONS --------------------------
 */

onMounted(() => {
    searchEntitiesList("", 1);
});

watch(() => dataEntities.dataPaginator.page_size, () => {
    searchEntitiesList(dataEntities.dataInputSearch.dataInput.model, 1);
});

function searchEntitiesList(searched_value: any, page: any) {
    dataEntities.list = []; // load state
    dataEntities.stateLoadData = true;
    EntitiesServices.searchEntities(searched_value, page, dataEntities.dataPaginator.page_size)
        .then((response: any) => {
            dataEntities.dataPaginator.page = page
            dataEntities.dataPaginator.total_pages = response.total_pages
            dataEntities.list = response.results;
            dataEntities.stateLoadData = false;
        })
        .catch((error: any) => {
            dataEntities.stateLoadData = false;
            openModalAlert('something_happened_try_later');
            console.error("Error fetching data:", error);
        })
}



function createNewEntity() {
    dataEntities.stateResponseLoad = true;
    if (FormValidators.getValidationForm('entities--form__content')) {
        const formData: any = new FormData();
        formData.append('entity_name', dataEntities.form.publicName.trim());
        formData.append('nit', dataEntities.form.nit);
        formData.append('verification_digit', dataEntities.form.cdv);
        formData.append('entity_type', dataEntities.form.typeOfEntity);
        formData.append('address', dataEntities.form.address.trim());
        formData.append('email', dataEntities.form.email.trim());
        formData.append('phone_number', dataEntities.form.phone);
        formData.append('domain', store.domain);
        formData.append('domain_reset_user_password', store.domain_reset_user_password);
        formData.append('schema_name', dataEntities.form.schemaName);
        formData.append('name_person_responsible', dataEntities.form.namePersonResponsible);
        EntitiesServices.createEntity(formData)
            .then((response: any) => {
                dataEntities.stateResponseLoad = false;
                openModalConfirmation('the_entity_was_successfully_created');
            })
            .catch((error: any) => {
                dataEntities.stateResponseLoad = false;
                openModalAlert(error.response.data.error.details[0]);
            })

    } else {
        dataEntities.stateResponseLoad = false;

        dataEntities.dataModalAlert.isActive = 'show';
        dataEntities.dataModalAlert.dataText.text = 'empty_inputs';
    }
}
function refreshData() {
    searchEntitiesList("", 1);
    dataEntities.stateFormEntities = false;
    dataEntities.stateResponseLoad = false;
    dataEntities.stateResponse = false;
    dataEntities.form = {
        publicName: '',
        schemaName: '',
        namePersonResponsible: '',
        nit: '',
        cdv: '',
        typeOfEntity: '',
        address: '',
        email: '',
        phone: '',
    }
}

function closeModalAlert() {
    dataEntities.dataModalAlert.isActive = 'hidde';
}

function openModalAlert(text: string): void {
    dataEntities.dataModalAlert.isActive = 'show';
    dataEntities.dataModalAlert.dataText.text = text;
}

function setFormCreateEntity() {
    dataEntities.stateFormEntities = true;
}

function closeModalConfirmation() {
    dataEntities.dataModalConfirmation.isActive = 'hidde';
    refreshData();
}
function openModalConfirmation(text: string): void {
    dataEntities.dataModalConfirmation.isActive = 'show';
    dataEntities.dataModalConfirmation.dataText.text = text;
}
function redirectToEntity(id: string | number): void {
    router.push('entity/' + id);
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

function deleteEntity(id: any) {
    EntitiesServices.deleteEntity(id)
        .then(() => {
            openModalConfirmation('the_entity_was_deleted_successfully') 
        })
        .catch((error: any) => {
            openModalAlert('something_happened_try_later');
            console.error(error);
        })
}

</script>

<style scoped src="./Entities.page.scss"></style>