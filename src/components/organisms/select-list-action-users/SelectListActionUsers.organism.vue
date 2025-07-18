
<!-- 

 dataSelectListActionUsers: {
            typeOfFinalAction: '',
            stateEditorText: false,
            usersSelecteds: [],
            users: [], 
        },

 -->
<template>
    <article class="select-list-users">
        <nav class="select-list-users__form">
            <!-- <p class="select-list-users__form__title">
                {{
                    t('who_answer')
                }}
            </p> -->
            <select class="input input--form bg-blue width-mid" v-model="dataSelectDependence2">
                <option value="" selected disabled>{{ t('select_dependence') }}</option>
                <option :value="dependence.code" v-for="dependence of listDependences">
                {{ dependence.name }}</option>
            </select>
            <SelectSearch    @userSelected="getUserFinalSelected" :disabled="dataSelectDependence2 ==''" :dependence="dataSelectDependence2" />
        </nav>
        <section class="table">
            <header class="table__row table--header">
                <a class="table__row__cell">{{ t('item') }}</a>
                <a class="table__row__cell">{{ t('dependence') }}</a>
                <a class="table__row__cell">{{ t('user') }}</a>
                <a class="table__row__cell">{{ t('email') }}</a>
                <a class="table__row__cell">{{ t('action') }}</a>
                <!-- <a class="table__row__cell">{{ t('') }}</a> -->
            </header>
            <ul class="table__row" v-if="dataSelectListActionUsers?.usersSelecteds.length > 0"
                v-for="(user, index) in dataSelectListActionUsers?.usersSelecteds">
                <li class="table__row__cell">{{ index + 1 }}</li>
                <li class="table__row__cell">{{ user.dependence }}</li>
                <li class="table__row__cell">{{ user.name || t('unnamed') }}</li>
                <li class="table__row__cell">{{ user.email }}</li>
                <li class="table__row__cell">
                    <select name="" id="" required v-model="user.action" :class="'select ' + (user.action != '' ? 'bg-blue' : '')">
                        <option value="" selected disabled>{{ t('select_action') }}</option>
                        <option value="no_action" selected v-if="user.is_current_user">{{ t('no_action') }}</option>
                        
                        <option value="review">{{ t('review') }}</option>
                        <option value="aprove">{{ t('aprove') }}</option>
                        <option value="sign">{{ t('sign') }}</option>
                    </select>
                </li>
                <!-- <li class="table__row__cell table__row--img" >
                    <TooltipIcon v-if="dataTooltipIcons[0].show(user)" :dataTooltipIcon="dataTooltipIcons[0]" @click="dataTooltipIcons[0].onClick({user: user, index: index})"/>
                </li> -->
            </ul>
        </section>
        <nav class="select-list-users__type-response" v-if="dataSelectListActionUsers?.notShowOptions === undefined || dataSelectListActionUsers?.notShowOptions === false">
            <label class="select-list-users__type-response__container" for="option">
                <p>{{ t('upload_file') }}</p>
                <input type="radio" name="option" id="" :value="false"
                    :checked="dataSelectListActionUsers?.stateEditorText ? false : true"
                    v-model="dataSelectListActionUsers.stateEditorText">
            </label>
            <label class="select-list-users__type-response__container" for="option">
                <p>{{ t('create_file') }}</p>
                <input type="radio" name="option" id="" :value="true"
                    :checked="dataSelectListActionUsers?.stateEditorText"
                    v-model="dataSelectListActionUsers.stateEditorText">
            </label>
        </nav>
    </article>
</template>
<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import { onMounted, Ref, ref, reactive, watch } from 'vue';
import DependenceServices from '../../../services/DependenceServices';
import UserServices from '../../../services/UserServices.ts';
import SelectSearch from '../../molecules/select-search/SelectSearch.molecule.vue'
import TooltipIcon from '../../atoms/tooltip-icon/TooltipIcon.atom.vue';

const dataSelectDependence: any = ref('');
const dataSelectDependence2: any = ref('');
const listDependences: any = ref([]);
const listUsers: any = ref([]);
const resultsReviewSelectSearch: any = ref('');
const resultsFinalSelectSearch: any = ref('');
const dataSearch: Ref<string> = ref('');
const { t, te } = useI18n();
const keyValue: any = ref('');
const stateOpenList: any = ref(false);
const usersSelecteds: any = reactive([]);
const props: any = defineProps(['dataSelectListActionUsers', 'mode']);
const dataTooltipIcons: any = ref([
  {
    text: `${t("delete")} ${t("user").toLowerCase()}`,
    src: '/Buttons/icon-delete.svg',
    color: 'red',
    alt: 'delete',
    show: (data: any) => { return !(data?.is_current_user) },
    onClick: ({user = {}, index = 0}) => { deleteUser(user, index) },
  },
])

function keyFinalPressed(event: any) {
    keyValue.value = event;
    searchFinalsUsers()
}


function deleteUser(user: any, index: number | string) {
    props.dataSelectListActionUsers.usersSelecteds.splice(index, 1);

}


function removeFinalUser(index: number) {
    props.dataSelectListActionUsers.usersSelecteds.splice(index, 1);
}


function searchFinalsUsers() {
    if (keyValue.value.trim() === '') {
        resultsFinalSelectSearch.value = [];

        return;
    }

    UserServices.sendSearchUsers(dataSelectDependence2.value, keyValue.value.trim())
        .then(response => {
            resultsFinalSelectSearch.value = response.map((data: any) => ({
                first: data.first_name,
                second: data.email,
                third: data.dependence.name
            }))

        })
        .catch(error => {
            console.error(error, 'error');
        });


}



onMounted(() => {
    callServices()
})

function callServices() {
    getDependences()
    getUsersDependence(1, '');
}

function getDependences() {
    DependenceServices.getParentDependences()
        .then(response => listDependences.value = response)
        .catch((error: any) => {
            console.error(error);
        })
}

function getUsersDependence(idDependence: number | string, value: string) {
    DependenceServices.getUsersDependences(idDependence, value)
        .then((response: any) => {
            listUsers.value = response;
        })
        .catch((error: any) => {
            console.error(error);
        })
}


function getUserFinalSelected(value: any) {
    const userExists = props.dataSelectListActionUsers.usersSelecteds.some((user: any) => user.email === value.second);
    if (!userExists) {
        props.dataSelectListActionUsers.usersSelecteds.push({
            name: value.first,
            email: value.second,
            dependence: value.third,
            action: ''
        });
        resultsFinalSelectSearch.value = [];
    } else {
    }
}


watch(dataSearch, (newValue: any) => {
});


</script>
<style scoped src="./SelectListActionUsers.organism.scss"></style>
