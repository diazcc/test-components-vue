<template>
    <HistoricalTemplate :dataHistorical="dataHistorical" @applyFilters="applyFilters"/>
</template>

<script setup lang="ts">

import HistoricalTemplate from '../../templates/historical/Historical.template.vue';
import { onMounted, ref, reactive, watch } from 'vue';
import { useRouter } from "vue-router";
import FilingServices from '../../../services/FilingServices.ts';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const router = useRouter();
const filters: any = ref([
    'Filtro 1',
    'Filtro 2',
    'Filtro 3',
]);
const dataHistorical: any = reactive({
    data: [],
    stateLoadData: true,
    dataButtonNewFiles: {
        className: 'blue',
        text: 'upload',
        alt: 'upload',
        url: '/Buttons/icon-upload.svg',
        reverse: true,
        disabled: false,
        onClick: () => {
            
        }
    },
    dataModalAlert: {
        isActive: '',
        dataButton: {
            className: 'blue',
            text: 'close',
            disabled: false,
            onClick: () => {
                dataHistorical.dataModalAlert.isActive = '';
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
                getHistoricalData(value, 1)
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
            getHistoricalData(dataHistorical.dataInputSearch.dataInput.model, value)
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
    goToPath: (path: any) => {
        goToPath(path);
    },
});

onMounted(() => {
    getHistoricalData("", 1);
});

watch(() => dataHistorical.dataPaginator.page_size, () => {
    getHistoricalData(dataHistorical.dataInputSearch.dataInput.model, 1);
});

/**
 * todo GET & SET
 */

function getHistoricalData(searched_value:any, page:any) {
    dataHistorical.stateLoadData = true;
    dataHistorical.data = [];
    FilingServices.getHistoricalFilingData(searched_value, page, dataHistorical.dataPaginator.page_size)
        .then((response: any) => {
            dataHistorical.data = response.results.map((value: any) => {
                let [hour, minute]:any = value.creation_time.split(':');
                let date:any = `${value.creation_date} ${hour}:${minute}`;
                let action = value.action_description;
                let path:any;
                let code:any = value.filing_code;
                let description:any;
                let type_of_filing:any = 'not_implemented';
                let id:any;
                switch (value.description) {
                    case 'performance_action_record':
                        let user2:any = value?.target_model?.user_asigned ? value?.target_model?.user_asigned : '';
                        description = `${value.user} ${t(value?.target_model.description)} ${t('with_code')} ${code} ${user2 ? t('to') + ' ' + user2: ''}`; 
                        path = `/home/filing/${value.target_model.record}`;
                        break;
                    case 'move_archive_record':
                        let name_pdf:any = value?.target_model.name;
                        let isRecord:any = value?.target_model?.record ? true : false;
                        id = value?.target_model?.record ? value?.target_model?.record : value?.target_model?.folder;
                        description = `${value.user} ${t('moved_the_file_with_the_name')} ${name_pdf} ${t('to') + ' ' + t('the_record_with_code')} ${code}`;
                        path = `/home/record/${id}?isRecord=${isRecord}`;
                        break;
                    case 'create_record':
                        id = value?.target_model?.folder;
                        action = 'create_folder'
                        description = `${value.user} ${t('create_folder')} ${t('with_code')} ${code}`;
                        path = `/home/record/${id}?isRecord=false`;
                        break;
                    case 'create_archive':
                        id = value?.target_model?.archive_number
                        if(!id) description = t(`move_archive_record`);
                        else description = `${value.user} ${t('create_archive')} ${t('called')} '${value?.target_model?.document_name}'`;
                        path = `/home/files_records/${id}`;
                        break;
                    case 'register_dependencies_archive':
                        id = value?.target_model?.archive_number
                        if(!id) description = t(`move_archive_record`);
                        else description = `${value.user} ${t('assigned_the_dependencies')} ${value?.target_model?.dependence.map((depen: any) => depen.name).join(', ')} ${t('to_the_file')} ${t('called')} '${value?.target_model?.document_name}'`;
                        action = 'assigned_the_dependencies';
                        path = `/home/files_records/${id}`;
                        break;
                    default:
                        break;
                }
                return {
                    path: path,
                    date: date,
                    code: code,
                    description: description,
                    type_of_filing: type_of_filing,
                    action: action,
                }
            });
            dataHistorical.dataPaginator.page = page
            dataHistorical.dataPaginator.total_pages = response.total_pages
            dataHistorical.stateLoadData = false;
        })
        .catch((error: any) => {
            console.error(error);
            openModalAlert(error);
            dataHistorical.stateLoadData = false;
        });
}

function goToPath(path: any) {
    router.push(path);
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

function openModalAlert(text: any) {
    dataHistorical.dataModalAlert.dataText.text = text;
    dataHistorical.dataModalAlert.isActive = 'active';
}

</script>
