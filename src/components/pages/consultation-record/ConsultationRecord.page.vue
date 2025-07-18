<template>
    <ConsultationRecord :dataConsultationRecord="dataConsultationRecord" />
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import ConsultationRecord from '../../templates/consultation-record/ConsultationRecord.template.vue';
import ConsultationRecordService from '../../../services/RecordConsultationServices';
import FormValidators from '../../../validators/FormValidators';
import { useRouter } from "vue-router";

const router = useRouter();
const dataConsultationRecord: any = reactive({
    stateLoad: false,
    isDataLoaded: true,
    data: {
        filing_number: '',
        subject: '',
        creation_date: '',
        state: '',
        response_mode: '',
    },
    dataLineHistory: [],
    dataButtonSearch: {
        className: 'blue',
        text: 'search',
        alt: '',
        url: '/public/buttons/icon-search.svg',
        disabled: false,
        reverse: true,
        fontSize: '',
        iconSize: 'large',
        onClick: () => { searchFiling() }
    },
    dataInputId: {
        id: '',
        name: '',
        classInput: 'form',
        model: '',
        type: 'number',
        placeholder: 'identification_number',
        disabled: false,
        required: true,
        title: '',
        onClick: () => { },
        handleBlur: () => { },
        onChange: () => { }
    },
    dataInputFilingNumber: {
        id: '',
        name: '',
        classInput: 'form',
        model: '',
        type: 'number',
        placeholder: 'filing_number',
        disabled: false,
        required: true,
        title: '',
        onClick: () => { },
        handleBlur: () => { },
        onChange: () => { }
    }
    , dataInputEmail: {
        id: '',
        name: '',
        classInput: 'form',
        model: '',
        type: 'email',
        placeholder: 'email',
        disabled: false,
        required: true,
        title: '',
        onClick: () => { },
        handleBlur: () => { },
        onChange: () => { }
    },
    dataModalAlert: {
        isActive: '',
        dataButton: {
            className: 'blue',
            text: 'close',
            alt: 'close',
            url: '/Buttons/decline.svg',
            iconSize: 'short',
            reverse: false,
            disabled: false,
            onClick: () => { closeModalAlert() }
        },
        dataText: {
            classText: '',
            text: 'this_is_the_description',
            disabled: false,
            onClick: () => { }
        }
    },
    dataButtonBack: {
        className: '',
        text: 'back',
        alt: '',
        url: '/public/buttons/left-arrow.svg',
        disabled: false,
        reverse: false,
        fontSize: '',
        iconSize: '',
        onClick: () => { goBack()}
    },
})




function searchFiling() {
    if (FormValidators.getValidationForm('consultation-record__form')) {
        cleanData();
        getRecord();
    } else {
        openModalAlert('empty_inputs')
    }
}


async function getRecord() {

    //Validations
    dataConsultationRecord.stateLoad = true;
    dataConsultationRecord.dataButtonSearch.disabled = true;

    console.log('holistas');

    //Services
    await ConsultationRecordService.getInfoFiling(dataConsultationRecord.dataInputFilingNumber.model, dataConsultationRecord.dataInputId.model, dataConsultationRecord.dataInputEmail.model)
        .then((response: any) => {
            
            dataConsultationRecord.stateLoad = false;
            if (response.status==undefined) {
                dataConsultationRecord.dataButtonSearch.disabled = false;
                console.log(response);
                setDataInfo(response)
                setDataTrazability(response.traceability_records)
            } else {
                cleanData();
                console.log(response.status);
                dataConsultationRecord.dataButtonSearch.disabled = false;
                openModalAlert('record_doesnt_exist');
            }
            })
        .catch((error: any) => {
            console.error(error);
            dataConsultationRecord.stateLoad = false;
            dataConsultationRecord.dataButtonSearch.disabled = false;
            cleanData();
        });
}
function setDataInfo(filing: any) {
    dataConsultationRecord.data = {
        filing_number: filing.filing_code,
        subject: filing.subject,
        creation_date: filing.filing_date,
        state: '',
        response_mode: '',
    }
}
function setDataTrazability(trasabability: any[]) {

    let data: any = [];
    trasabability.map((value: any) => {
        data.push({
            date: value.creation_date,
            time: value.creation_time,
            userName: value.user,
            description: value.description,
            comment: value.comments
        });
    }
    );

    dataConsultationRecord.dataLineHistory = data;
}
function openModalAlert(text: string): void {
    console.log('ddd');
    dataConsultationRecord.dataModalAlert.isActive = 'show';
    dataConsultationRecord.dataModalAlert.dataText.text = text;
}

function closeModalAlert(): void {
    dataConsultationRecord.dataModalAlert.isActive = 'hidde';
}


function cleanData() {
    Object.assign(dataConsultationRecord.data, {
        filing_number: '',
        subject: '',
        creation_date: '',
        state: '',
        response_mode: '',
    });
}


function goBack(){
    router.back();
}



</script>
<style scoped src></style>