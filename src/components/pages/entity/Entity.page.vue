<template>
    <EntityTemplate :dataEntity="dataEntity" />
</template>
<script setup lang="ts">

// Import vue library
import { reactive, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

// Import components
import EntityTemplate from '../../templates/entity/Entity.template.vue';

// Import services
import EntitiesServices from '../../../services/EntitiesServices.ts';
import hasPermissions from '../../../guards/hasPermissions.guard.ts';


const router = useRouter();
const route: any = useRoute();
const entityId: any = ref('');
const dataEntity: any = reactive(getDataEntityTemplate())

onMounted(() => {
    validateIdEntity();
    callServices();
    validateIdEntity();
})

function callServices() {
    assignPermitedActions()
    getEntity();
    getUserCorrespondence();
}

function assignPermitedActions() {
    let options: any = [];
    if (hasPermissions.validator('change_state_entities')) {
        options.push({
            value: false,
            label: 'enabled'
        })
    } if (hasPermissions.validator('update_entities')) {
        options.push({
            value: 'edit',
            label: 'edit'
        })
    }
    dataEntity.dataSelectActions.options = [...options];
}

function getDataEntityTemplate() {
    return reactive({
        stateEditForm: false,
        numberFiling: [],
        data: {
            name: '',
            name_person_responsible: '',
            publicName: '',
            address: '',
            nit: '',
            enabled: '',
            date: '',
            email: '',
            entityType: '',
            phone: '',
            entity_type: '',
        },
        dataSelectActions: {
            id: '',
            name: '',
            className: '',
            disabled: false,
            onChange: (data: any) => {
                validateSelect(data.target.value);
                dataEntity.dataSelectActions.model = '';//Refresh select and values before be selected
            },
            onClick: () => { },
            placeholder: 'settings',
            model: '',
            options: []
        },
        dataButtonBack: {
            className: '',
            text: 'cancel',
            alt: 'cancel',
            url: '/Buttons/decline.svg',
            iconSize: 'short',
            disabled: false,
            reverse: false,
            onClick: () => { 
                dataEntity.stateEditForm = false
                callServices();
            }
        },
        dataButtonNext: {
            className: 'blue',
            text: 'save',
            alt: 'save',
            url: "/Buttons/icon-save.svg",
            disabled: false,
            reverse: true,
            onClick: () => { sendEntityData() }
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
                router.push('/home/administration-tenant/entities');
            }
        },
        dataModalConfirmation: {
            isActive: '',
            dataButton: {
                className: '',
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
        dataSelectEntityType: {
            id: '',
            name: '',
            className: '',
            disabled: false,
            onChange: (data: any) => {

            },
            onClick: () => { },
            placeholder: 'select_the_correspondence_user',
            model: '',
            required: false,
            options: [
                {
                    value: '001',
                    label: 'public'
                },
                {
                    value: '002',
                    label: 'private'
                },
                {
                    value: '003',
                    label: 'mix'
                }
            ]
        },
        dataSelectUserCorrespondence: {
            id: '',
            name: '',
            className: '',
            disabled: false,
            onChange: (data: any) => {

            },
            onClick: () => { },
            placeholder: 'select_the_correspondence_user',
            model: '',
            required: false,
            options: [
            ]
        },
        setRightPosition: (number: {}, index: number) => {

            setRightPosition(number, index);
        },
        setLeftPosition: (number: {}, index: number) => {
            setLeftPosition(number, index);
        },
    });
}

function validateIdEntity() {
    if (route.params.id != null && route.params.id != '') {
        entityId.value = route.params.id;
    } else {
        entityId.value = 1;
    }
}

function getEntity() {
    dataEntity.data = {};
    EntitiesServices.getEntity(entityId.value)
        .then((response: any) => {
            dataEntity.data = {
                name: response.url_name,
                name_person_responsible: response.name_person_responsible,
                publicName: response.entity_name,
                address: response.address,
                nit: response.nit,
                enabled: response.active,
                date: response.date,
                email: response.email,
                entityType: response.entity_type,
                phone: response.phone_number,
            }
            dataEntity.numberFiling = response.filing_code_custom;
            if (hasPermissions.validator('change_state_entities')) {
                dataEntity.dataSelectActions.options[0] = {
                    value: response.active,
                    label: response.active ? 'disable' : 'enable'
                };
            }
        })
        .catch((error: any) => {
            console.error(error);
            openModalAlert(error.response.data.error.details[0]);
        });
}

function validateSelect(key: any): void {
    switch (key) {
        case 'false':
        case 'true':
            enableEntity(key === 'true');
            break;
        case 'edit':
            if(dataEntity.stateEditForm) {
                callServices();
            }
            dataEntity.stateEditForm = !dataEntity.stateEditForm;
            break;
        default:
            break;
    }
}

function refreshStates() {
    dataEntity.stateEditForm = false;
    callServices();
}

function getUserCorrespondence() {
    EntitiesServices.getUserCorrespondence()
        .then((response: any) => {
            dataEntity.dataSelectUserCorrespondence.options = response.map((data: any) => ({
                value: data.email,
                label: data.email
            }))
        })
        .catch((error: any) => {
            console.error(error);
            openModalAlert(error.response.data.error.details[0])
        })
}

function setRightPosition(number: {}, index: number) {
    const element = dataEntity.numberFiling.splice(index, 1)[0];
    const newIndex = index + 1;
    dataEntity.numberFiling.splice(newIndex, 0, element);
    dataEntity.numberFiling[newIndex] = number;
}

function setLeftPosition(number: {}, index: number) {

    if (index === 0) return;

    const element = dataEntity.numberFiling.splice(index, 1)[0];

    const newIndex = index - 1;
    dataEntity.numberFiling.splice(newIndex, 0, element);

    dataEntity.numberFiling[newIndex] = number;

}

function closeModalConfirmation() {
    dataEntity.dataModalConfirmation.isActive = 'hidde';
    refreshStates();
}

function openModalConfirmation(text: string): void {
    dataEntity.dataModalConfirmation = {
        isActive: 'show',
        dataButton: {
            className: '',
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
    dataEntity.dataModalAlert.isActive = 'show';
    dataEntity.dataModalAlert.dataText.text = text;
}

function closeModalAlert(): void {
    dataEntity.dataModalAlert.isActive = 'hidde';
}

function enableEntity(state: boolean): void {
    let formData: any = new FormData();
    formData.append("active", state);

    EntitiesServices.enableEntity(entityId.value, formData)
        .then((response: any) => {
            state ? openModalConfirmation('the_entity_was_successfully_enabled') : openModalConfirmation('the_entity_was_successfully_disabled');
        })
        .catch((error: any) => {
            console.error(error);
        })
}

function sendEntityData() {

    dataEntity.numberFiling = dataEntity.numberFiling.map((response: any, index: number) => ({
        name: response.name,
        sort: index + 1
    }))

    let formData = new FormData();
    (dataEntity.data.publicName != '' && dataEntity.data.publicName != null) && formData.append('entity_name', dataEntity.data.publicName);
    (dataEntity.data.publicName != '' && dataEntity.data.publicName != null) && formData.append('phone_number', dataEntity.data.publicName);
    (dataEntity.data.address != '' && dataEntity.data.address != null) && formData.append('address', dataEntity.data.address);
    (dataEntity.data.nit != '' && dataEntity.data.nit != null) && formData.append('nit', dataEntity.data.nit);
    (dataEntity.data.email != '' && dataEntity.data.email != null) && formData.append('email', dataEntity.data.email);
    (dataEntity.dataSelectEntityType.model != '' && dataEntity.dataSelectEntityType.model != null) && formData.append('entity_type', dataEntity.dataSelectEntityType.model);
    (dataEntity.data.phone != '' && dataEntity.data.phone != null) && formData.append('phone_number', dataEntity.data.phone);
    (dataEntity.data.name_person_responsible != '' && dataEntity.data.name_person_responsible != null) && formData.append('name_person_responsible', dataEntity.data.name_person_responsible);
    (dataEntity.dataSelectUserCorrespondence.model != '' && dataEntity.dataSelectUserCorrespondence.model != null) && formData.append('hatch_user', dataEntity.dataSelectUserCorrespondence.model);
    formData.append('filing_code_custom', JSON.stringify(dataEntity.numberFiling));
    formData.append('active', dataEntity.data.enabled);


    EntitiesServices.updateEntity(formData, entityId.value)
        .then((response: any) => {
            openModalConfirmation('the_entity_was_updated_succesfully');
        })
        .catch((error: any) => {
            console.error(error);
            openModalAlert(error.response.data.error.details[0])
        })


}

</script>
<style scoped src="./Entity.page.scss"></style>