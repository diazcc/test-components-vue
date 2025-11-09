<template>
    <DashboardTemplate :dataDashboardTemplate="dataDashboard"></DashboardTemplate>
</template>

<script setup lang="ts">

import { reactive, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import DashboardTemplate from '../../templates/dashboard/Dashboard.template.vue';
import FilingServices from '../../../services/FilingServices';
import RecordsServices from '../../../services/RecordsServices';
import UserValidators from '../../../validators/UserValidators';

const router: any = useRouter();

const dataDashboard = reactive({
    dataTableCorrespondenceEntry: {
        dataTitle: {
            text: "correspondence",
            classTitle: "",
        },
        stateLoadData: false,
        data: {
            className: 'list',
            lists: [],
            onClick: () => {
            }

        },
        dataText: {
            text: 'latest_entry_filings',
            classText: "italic-small",

        }
    },
    dataTableCorrespondenceInternal: {
        dataTitle: {
            text: "correspondence",
            classTitle: "",
        },
        stateLoadData: false,
        data: {
            className: 'list',
            lists: [],
            onClick: () => {
            }

        },
        dataText: {
            text: 'latest_internal_filings',
            classText: "italic-small",

        }
    },
    dataColaborativeWork: {
        dataTitle: {
            text: "colaborative_work",
            classTitle: "",
        },
        dataText: {
            text: "start_colaborative_work",
            classText: "light",
        },
        dataButton: {
            text: "start",
            className: "blue",

        }
    },
    dataCalendarWidget: {
        dataTitle: {
            text: "calendar",
            classText: "",
        }
    },
    dataStatistic: {
        dataTitle: {
            text: "statistics",
            classText: "",
        },
        dataChartPie: {
            className: 'list',
            data: [],
            onClick: () => {
                router.push("")
            }
        }
    }
})

onMounted(() => {
    callServices();
})

function callServices() {
    getFilings();
    getRecords();
}


function getFilings() {
    /* dataDashboard.dataTableCorrespondenceEntry.stateLoadData = true;
    dataDashboard.dataTableCorrespondenceInternal.stateLoadData = true;
    dataDashboard.dataTableCorrespondenceEntry.data.lists = [];
    dataDashboard.dataTableCorrespondenceInternal.data.lists = [];
    FilingServices.getMinEntryFilings()
        .then((response:any)=>{
            dataDashboard.dataTableCorrespondenceEntry.data.lists = response.results
                .map((value: any) => ({
                    id: value.record_id,
                    subject: value.subject,
                    remitter: UserValidators.validationRemitter(value.remitter),
                    radication: value.filing_code,
                    type: "Natural",
                    related_record_info: value.related_record_info,
                    percentage_of_relationship_matrix:value.percentage_of_relationship_matrix,
                    days_left:value.days_left
                }));
                dataDashboard.dataTableCorrespondenceEntry.stateLoadData = false;
        }).catch((error:any)=>{
            dataDashboard.dataTableCorrespondenceEntry.stateLoadData = false;
            console.error(error);
        });
    FilingServices.getMinInternalFilings()
        .then((response:any)=>{
            dataDashboard.dataTableCorrespondenceInternal.data.lists = response.results
                .map((value: any) => ({
                    id: value.record_id,
                    subject: value.subject,
                    remitter: UserValidators.validationRemitter(value.remitter),
                    radication: value.filing_code,
                    type: "Natural",
                    related_record_info: value.related_record_info,
                    percentage_of_relationship_matrix:value.percentage_of_relationship_matrix,
                    days_left:value.days_left
                }));
            dataDashboard.dataTableCorrespondenceInternal.stateLoadData = false;
        }).catch((error:any)=>{
            dataDashboard.dataTableCorrespondenceInternal.stateLoadData = false;
            console.error(error);
        }) */
       FilingServices.getFilesSent()
        .then((response:any)=>{
      console.log(response);
            dataDashboard.dataTableCorrespondenceEntry.data.lists = response.results
                .map((value: any) => ({
                    id: value.id,
                    subject: value.subject,
                    remitter: value.creator_user,
                    radication: value.date_created,
                    type: "Natural",
                    related_record_info: 'value.related_record_info',
                    percentage_of_relationship_matrix:'value.percentage_of_relationship_matrix',
                    status:value.status,
                    days_left:'value.days_left'
                }));
                dataDashboard.dataTableCorrespondenceEntry.stateLoadData = false;
        }).catch((error:any)=>{
            dataDashboard.dataTableCorrespondenceEntry.stateLoadData = false;
            console.error(error);
        });
    
       RecordsServices.searchFilings('', 1, 10)
    .then((response: any) => {
      console.log(response);
      dataDashboard.dataTableCorrespondenceInternal.data.lists = response.results
                .map((value: any) => ({
                    id: value.id,
                    subject: value.subject,
                    remitter: value.creator_user,
                    radication: value.date_created,
                    type: "Natural",
                    related_record_info: 'value.related_record_info',
                    percentage_of_relationship_matrix:'value.percentage_of_relationship_matrix',
                    days_left:'value.days_left',
                    status:value.status
                }));
     
    })
    .catch((error: any) => {
      console.error("Error fetching data:", error);
    });
}

function getRecords() {
    /* RecordsServices.searchRecordsStatic()
        .then((response:any) => {
            dataDashboard.dataStatistic.dataChartPie.data = response.results;
        })
        .catch((error:any) => {
            console.error(error);
        }); */
}

</script>

<style scoped src="./Dashboard.page.scss"></style>