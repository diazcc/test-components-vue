<!--
    todo COMPONENT MENU ORGANISM
    todo---------------------------------------------------------- THIS COMPONENT MUST BE IMPROVE, ALL FUNCIONALITIES MUST BE ON COMPONENT PAGE.----------------------------------------------------------------
    ?This componente has function and state/variable because is a unique component, had funcitonalities that just need him self. dont need send o get other data of another component.
    todo - - -- - -  must add key state on the strucuture  


-->

<template>
    <aside class="sidebar-menu">
        <h2 class="sidebar-menu__title">{{ dataMenu.conectionRender}}</h2>
        <ul class="sidebar-menu__content-list">
            <li v-for="(path, index) in dataMenu.path" :key="index"
                :class="'sidebar-menu__content-list__card sidebar-menu__content-list__card--' + ((path.state) ? 'focused' : 'unfocused')"
                @click="setStateMenuAside(path, index)" :id="path.name">
                <div class="sidebar-menu__content-list__card__title">
                    <img src="/icon-arrow-item-menu-padre lateral-cerrado.svg" alt=""
                        :class="'sidebar-menu__content-list__card__title__img sidebar-menu__content-list__card__title__img--' + ((path.state) ? 'focused' : '')">
                    <p :class="'sidebar-menu__content-list__card__title__text sidebar-menu__content-list__card__title__text--' + ((path.state) ? 'focused' : 'unfocused')">
                        {{ t(path.name) }}
                    </p>
                </div>
                <ol
                    :class="'sidebar-menu__content-list__card__submenu sidebar-menu__content-list__card__submenu--' + ((path.state) ? 'focused' : '')">
                    <li v-for="(route, index) in path.paths" :key="index"
                        :class="'sidebar-menu__content-list__card__submenu__card sidebar-menu__content-list__card__submenu__card--' + (route.state ? 'focused' : '')"
                        @click="redirectToPath(index, route.path, path)">{{ t(route.name) }}</li>
                </ol>
            </li>
        </ul>
    </aside>
</template>
<script setup lang="ts">

import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, watch, onUnmounted, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import UtilsServices from '../../../services/UtilsServices';

const { t,te } = useI18n();
const router: any = useRouter();
const route = useRoute();
const props = defineProps(['dataMenu']);
const emit = defineEmits(['dataEmitMenu']);
const viewKey = ref(0);
const indexFather: any = ref(0);
const indexChild: any = ref(0);
const focusPathMenu: any = ref('');
const currentModule: any = ref('');
const stateLoad: any = ref(false);
const isDataLoaded : Ref<boolean> = ref(false);

function setStateMenuAside(path: any, index: any) {
    setUnfocusedMenu();
    props.dataMenu.path[index].state = true;
    UtilsServices.changeColor(path.templateColor.menu);
    indexFather.value = index;
    props.dataMenu.path.forEach((response: any, indexF: any) => {
        response.paths.forEach((value: any, indexC: any) => {
            const fullPath = '/home/' + value.path;
            if (fullPath == router.currentRoute._value.href) {
                props.dataMenu.path[indexF].paths[indexC].state = true;
            }
        });
    })
}

function refreshComponent() {
    viewKey.value++;
    emit('dataEmitMenu', viewKey.value);
}

function redirectToPath(index: any, path: any, module: any) {
    indexChild.value = index;
    UtilsServices.changeColor(module.templateColor.table);
    focusPathMenu.value = '/home/' + path;
    router.push('/home/' + path);
    if (router.currentRoute._value.href == focusPathMenu.value) {
        refreshComponent(); // --------- temporaly, check lazy laoding components
    }

}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    setCurrentPath();
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});

async function setCurrentPath() {
    setUnfocusedMenu();
    if (await props.dataMenu.path.length > 0) {
        await props.dataMenu.path.forEach(async (response: any, indexF: any) => {
            await response.paths.forEach(async (value: any, indexC: any) => {
                const fullPath = '/home/' + value.path;
                if (fullPath == router.currentRoute._value.href) { //CHECK ALGORITM, HAS A BUG WHEN ENTRY IN ANOTHER ROUTE
                    currentModule.value = await response.name;
                    props.dataMenu.path[indexF].paths[indexC].state = true;
                    UtilsServices.changeColor(props.dataMenu.path[indexF].templateColor.menu);
                    UtilsServices.changeColor(props.dataMenu.path[indexF].templateColor.table);
                    props.dataMenu.path[indexF].state = true;
                } else {
                    currentModule.value = 'module';
                }
                stateLoad.value = true;
            });
        })
    }
}

watch(route, adjustMenuStateBasedOnRoute, { immediate: true });

watch(() => props.dataMenu.path, (newValue: any, oldValue: any) => { //Improved
    if(stateLoad.value == false && isDataLoaded.value == false){
        setCurrentPath();
        isDataLoaded.value = true;
    }
}); 

function adjustMenuStateBasedOnRoute() {
    const state = route.path === focusPathMenu;
    setCurrentPath();
}

const handleClickOutside = (event: any) => {
    const sidebarMenu: any = document.querySelector('.sidebar-menu');
    if (!sidebarMenu.contains(event.target)) {
        setCurrentPath();
    }
};

function setUnfocusedMenu() {
    if (props.dataMenu.path.length > 0) {
        props.dataMenu.path = props.dataMenu.path.map((data: any) => ({
            ...data,
            state: false,
        }));
        props.dataMenu.path[indexFather.value].paths = props.dataMenu.path[indexFather.value].paths.map((data: any) => ({
            ...data,
            state: false
        }));
    }
}

</script>

<style scoped src="./Menu.organism.scss"></style>