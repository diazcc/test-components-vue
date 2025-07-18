<template>
    <EmailConfigurationTemplate :dataEmailConfiguration="dataEmailConfiguration" />
</template>
<script setup lang="ts">

import EmailConfigurationTemplate from '../../templates/email-configuration/EmailConfiguration.template.vue';
import { reactive, onMounted } from 'vue';
import EmailCorrespondenceServices from '../../../services/EmailCorrespondenceServices';
import FormValidators from '../../../validators/FormValidators';

const dataEmailConfiguration: any = reactive({
    stateEditForm: false,
    stateLoadForm: true,  
    stateLoadAns: false,   
    data: {
        type_connection: '',
        host: '',
        port: '',
        email: '',
        password: '', // Como se va a visulizar el password??
    },
    newData: {
        type_connection: '',
        host: '',
        port: '',
        email: '',
        password: '', // Como se va a visulizar el password??
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
    dataButtonEdit: {
        className: '',
        text: 'edit',
        url: '/Buttons/icon-edit.svg',
        alt: 'edit',
        reverse: true,
        disabled: false,
        iconSize: "large",
        onClick: () => {
            dataEmailConfiguration.stateEditForm = true;
            asignData('newData', 'data');
        }
    },
    dataButtonNext: {
        className: 'blue',
        text: 'save',
        url: '/Buttons/icon-save.svg',
        atl: 'save',
        reverse: true,
        disabled: false,
        onClick: () => {
            updateEmailConfiguration();
        }
    },
    dataButtonBack: {
        className: 'gray-red',
        text: 'cancel',
        url: '/Buttons/decline.svg',
        iconSize: 'short',
        alt: 'decline',
        reverse: false,
        disabled: false,
        onClick: () => {         
            dataEmailConfiguration.stateEditForm = false;
        }
    },
});


onMounted(() => {
    callServices();
})

function callServices() {
    getEmailConfiguration();
}

function getEmailConfiguration() {
    dataEmailConfiguration.stateLoadForm = true;
    EmailCorrespondenceServices.getEmailConnection()
        .then(async (response: any) => {
            dataEmailConfiguration.stateLoadForm = false;
            dataEmailConfiguration.data = response ? response : dataEmailConfiguration.data;
        })
        .catch((error: any) => {
            openModalAlert('something_happened_try_later');
        });
}

async function updateEmailConfiguration() {
    if (FormValidators.getValidationForm("email-configuration__info")){
        editStateOfObjectsWhenUpdate(true);
        await EmailCorrespondenceServices.createEmailConnection(dataEmailConfiguration.newData)
            .then(async (response: any) => {
                asignData('data', 'newData');
                editStateOfObjectsWhenUpdate(false);
                openModalConfirmation('email_configuration_was_successfully_updated');
            })
            .catch((error: any) => {
                editStateOfObjectsWhenUpdate(false);
                openModalAlert('something_happened_try_later');
            });
    }
}

function editStateOfObjectsWhenUpdate(flag: any) {
    dataEmailConfiguration.stateEditForm = flag;
    dataEmailConfiguration.stateLoadAns = flag;
    dataEmailConfiguration.dataButtonNext.disabled = flag;
    dataEmailConfiguration.dataButtonBack.disabled = flag;
}

function asignData(key1: string, key2: string): void {
    dataEmailConfiguration[key1] = {
        type_connection: dataEmailConfiguration[key2].type_connection,
        host: dataEmailConfiguration[key2].host,
        port: dataEmailConfiguration[key2].port,
        email: dataEmailConfiguration[key2].email,
        password: ""
    }
}

function closeModalConfirmation() {
    dataEmailConfiguration.dataModalConfirmation.isActive = 'hidde';
}

function openModalConfirmation(text: string): void {
    dataEmailConfiguration.dataModalConfirmation = {
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
    dataEmailConfiguration.dataModalAlert.isActive = 'show';
    dataEmailConfiguration.dataModalAlert.dataText.text = text;
}

function closeModalAlert(): void {
    dataEmailConfiguration.dataModalAlert.isActive = 'hidde';
}

</script>