<template>
    <section class="table-search">
        <nav class="table-search__header">
            <!-- <input type="text" class="table-search__header__input-search" placeholder="Buscar" v-model="searchTerm"> -->
            <p v-if="hasPermissions.validator('create_remitter')" class="table-search__header__text">{{ t('can_not_find_it') }}</p>
            <Button v-if="hasPermissions.validator('create_remitter')"
                class="table-search__header__button" :dataButton="dataTableRemitters.dataButton"/>
            <InputSearch class="table-search__header__input-search" :dataInputSearch="dataTableRemitters.dataInputSearch"/>
        </nav>
            <TransitionGroup tag="table" :css="false" @before-enter="onBeforeEnter" @enter="onEnter" @leave="onLeave" class="table">
                <thead class="table__row table--header">
                    <th class="table__row__cell">{{t('item')}}</th>
                    <th class="table__row__cell">{{t('name')}}</th>
                    <th class="table__row__cell">{{t('identification_number')}} / {{t('nit') }}</th>
                    <th class="table__row__cell">{{t('email')}}</th>
                    <th class="table__row__cell">{{ t('from') }}</th>
                </thead>
                <tbody v-if="filteredUsers.length === 0" class="table__row table--only-row">
                    <td class="table__row__cell">{{ t('no_results_found') }}</td>
                </tbody>
                <tbody v-for="(user, index) in filteredUsers" class="table__row" @click="getUser(user)" :key="user.id">
                    <td class="table__row__cell">
                        {{ index+1 }}
                    </td>
                    <td class="table__row__cell table__row__cell--left-align">
                        {{ user.first_name != null ? user.first_name : user?.contact_name ?? t('anonymous_person')}}
                    </td>
                    <td class="table__row__cell table__row__cell--left-align">
                        {{ user.identification_number ?? user.nit_number ?? t('anonymous_person')}}
                    </td>
                    <td class="table__row__cell table__row__cell--left-align"> 
                        {{ user.email }}
                    </td>
                    <td class="table__row__cell">
                        {{ user.person_type?.label ? t(user.person_type.label,user.person_type.label) : user.dependence.name }}
                    </td>
                </tbody>
            </TransitionGroup>
    </section>
</template>

<script setup lang="ts">

import { computed, onMounted, ref } from 'vue';
import gsap from 'gsap';
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import Button from '../../atoms/button/Button.atom.vue';
import UserService from '../../../services/UserServices';
import { useI18n } from 'vue-i18n';
import hasPermissions from '../../../guards/hasPermissions.guard';

const { t } = useI18n();
const userList: any = ref([]);
const searchTerm = ref('');
const props = defineProps(['dataTableRemitters']);
const emits = defineEmits(['user']);

onMounted(() => {
    getUsers();
});

function getUser(user:any){
    emits('user', user);
}

function getUsers() {
    UserService.getRemitters()
        .then((response: any) => {
            userList.value = response.response.results;
        })
        .catch((error: any) => {
            console.error(error);
        })
}

function onBeforeEnter(el:any) {
    el.style.opacity = 0
    el.style.height = 0
}

function onEnter(el:any, done:any) {
    gsap.to(el, {
        opacity: 1,
        height: '2.5rem',
        delay: el.dataset.index * 0.15,
        onComplete: done
    })
}

function onLeave(el:any, done:any) {
    gsap.to(el, {
        opacity: 0,
        height: 0,
        delay: el.dataset.index * 0.15,
        onComplete: done
    })
}

const removeAccents = (str: any) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const filteredUsers: any = computed(() => {
    searchTerm.value = props.dataTableRemitters.dataInputSearch.dataInput.model
    return userList.value.filter((user: any) => {
        const searchField = user.first_name || user.contact_name || ''; 
        const searchValue = removeAccents(searchField.toLowerCase());
        const searchTermValue = removeAccents(searchTerm.value.toLowerCase());
        return searchValue.includes(searchTermValue);
    });
});

</script>

<style scoped src="./TableSearchRemitter.organism.scss"></style>