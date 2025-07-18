<!--
    todo This component needs this structure:

    dataPaginator: {
        page: 1,
        page_size: 10,
        total_pages: '',
        count: '',
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

        }
    },

-->

<template>
    <section class="paginator">
        <hr class="paginator__hr">
        <footer class="paginator__article">
            <select class="paginator__article__select" @change="handlePageSizeChange"
            name="" id="" required v-model="dataPaginator.page_size">
                <option value="5">{{ 5 }}</option>
                <option value="10">{{ 10 }}</option>
                <option value="20">{{ 20 }}</option>
                <option value="50">{{ 50 }}</option>
                <option value="100">{{ 100 }}</option>
                <option :value="null">{{ t('all') }}</option>
            </select>
            <div class="paginator__article__info">
                <p>{{ dataPaginator.page }}-{{ page_size_info }} {{t('of')}} {{ dataPaginator.total_pages }}</p>
                <Img :dataImg="dataLastImgLeft" />
                <Img :dataImg="dataImgLeft" />
                <div v-for="(options, index) in dataPaginator.pagination_options">
                    <p :class="['paginator__article__info   __p', options.active ? 'paginator__article__info__p--active' : '']" v-if="dataPaginator.total_pages >= options.number" @click="setPageNumber(options.number, index)">{{options.number}}</p>
                </div>
                <Img :dataImg="dataImgRight" />
                <Img :dataImg="dataLastImgRight" />
            </div>
        </footer>
    </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Img from "../../atoms/img/Img.atom.vue";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const props = defineProps(['dataPaginator']);

const page_size_info: any = computed(() => {
    return props.dataPaginator.page_size ? props.dataPaginator.page_size : t('all')
})

const dataLastImgLeft = {
    id: '',
    name: 'icon double arrow left',
    class: 'button-img icon',
    src: '/double-arrow-left.svg',
    type: 'png',
    alt: '',
    isActive: () => { }, // optional, currently used to add activate and deactivate the active class
    onClick: () => { 
        lastPreviousPage()
    }
}

const dataImgLeft = {
    id: '',
    name: 'icon arrow left',
    class: 'button-img icon',
    src: '/arrow-left.svg',
    type: 'png',
    alt: '',
    isActive: () => { }, // optional, currently used to add activate and deactivate the active class
    onClick: () => { 
        previousPage()
    }
}

const dataImgRight = {
    id: '',
    name: 'icon arrow right',
    class: 'button-img icon',
    src: '/arrow-right.svg',
    type: 'png',
    alt: '',
    isActive: () => { }, // optional, currently used to add activate and deactivate the active class
    onClick: () => { 
        nextPage()
    }
}

const dataLastImgRight = {
    id: '',
    name: 'icon double arrow right',
    class: 'button-img icon',
    src: '/double-arrow-right.svg',
    type: 'png',
    alt: '',
    isActive: () => { }, // optional, currently used to add activate and deactivate the active class
    onClick: () => { 
        lastNextPage()
    }
}

const handlePageSizeChange = () => {
    if (props.dataPaginator.page_size === "") {
            props.dataPaginator.page_size = null;
        }
}

function setPageNumber(page_number:number, index:any) {
    props.dataPaginator.page = page_number
    const activeElement = props.dataPaginator.pagination_options.find(
        (element: any) => element.active === true
    );
    if (activeElement) {
        activeElement.active = false;
    }
    props.dataPaginator.pagination_options[index].active = true;
    props.dataPaginator.getService(props.dataPaginator.page);
}

function nextPage() {
    if (props.dataPaginator.page >= 1 && props.dataPaginator.page < props.dataPaginator.total_pages) {
        props.dataPaginator.page++
        props.dataPaginator.getService(props.dataPaginator.page);
    }
}

function lastNextPage() {
    if (props.dataPaginator.page < props.dataPaginator.total_pages) {
        props.dataPaginator.page = props.dataPaginator.total_pages
        props.dataPaginator.getService(props.dataPaginator.page);
    }
}

function previousPage() {
    if (props.dataPaginator.page > 1) {
        props.dataPaginator.page--
        props.dataPaginator.getService(props.dataPaginator.page);
    }
}

function lastPreviousPage() {
    if (props.dataPaginator.page > 1) {
        props.dataPaginator.page = 1
        props.dataPaginator.getService(props.dataPaginator.page);
    }
}

</script>

<style scoped src="./Paginator.molecule.scss"></style>