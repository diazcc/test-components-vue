<!-- 
    TODO COMPONENT FILTER
    
    ?structure:

    dataFilter: {
        id: 0, // The id of the filter
        isOpen: true, // Controls whether the filter section is visible or not.
        type: 'date', // The type of filter (e.g., 'text', 'date', 'number').
        isActive: false, // Indicates if the filter is active or not.
        options: [ // List of available filter options
            { text: 'Filter 1', value: 'Filter 1', checked: false },
            { text: 'Filter 2', value: 'Filter 2', checked: false },
            { text: 'Filter 3', value: 'Filter 3', checked: false },
            ...
        ],
    },

    -- !!!!!!!!!!!!!!!!!!  To get the selected documents, use the emit 'emitOrderSignal' or 'emitFilterSignal'! !!!!!!!!!!!!!!
-->

<template>
    <section :class="'filter filter--'+( dataFilter.isOpen ? '' : 'display-none')">
        <div class="filter__sort-container">
            <div class="filter__sort-container__text-container">
                <img class="grey" :src="filterType.i1" alt="filter less to more">
                <p class="filter__sort-container__text-container__text"
                @click="emitOrderSignal(false)">
                    {{ t(filterType.p1) }}
                </p>
            </div>
            <div class="filter__sort-container__text-container">
                <img class="grey" :src="filterType.i2" alt="filter more to less">
                <p class="filter__sort-container__text-container__text"
                @click="emitOrderSignal(true)">
                    {{ t(filterType.p2) }}
                </p>
            </div>
        </div>
        <hr class="filter__line">
        <div class="filter__sort-container">
            <div class="filter__sort-container__text-container" v-if="dataFilter.isActive">
                <img src="/filters/icon-filter-cancel-active.svg" alt="delete">
                <p class="filter__sort-container__text-container__text"
                @click="emitFilterSignal(false)">
                    {{ t('delete_filters') }}
                </p>
            </div>
            <div class="filter__sort-container__text-container" v-else>
                <img class="grey" src="/filters/icon-filter-cancel.svg" alt="delete">
                <p class="filter__sort-container__text-container__text filter__sort-container__text-container__text--inactive">
                    {{ t('delete_filters') }}
                </p>
            </div>
        </div>
        <hr class="filter__line">
        <div class="filter__sort-container">
            <input class="filter__sort-container__search"
                v-model="searchQuery"
                :placeholder="t('search')"
                @input="debouncedSearch"
            />
            <ol class="filter__sort-container__multi-select">
                <li class="filter__sort-container__multi-select__option"
                @click="checkAll()">
                    <input type="checkbox" :checked="allChecked" :name="'check-all'">
                    <p>
                        {{ t('select_all') }} 
                    </p>
                </li>
                <li v-for="(option, index) in optionsFilteredData.options" :key="index" :class="'filter__sort-container__multi-select__option'"
                @click="option.checked = !option.checked">
                    <input type="checkbox" :checked="option.checked">
                    <p>
                        {{ (option.text) ? t(option.text) : option.text }}
                    </p>
                </li>
            </ol>
        </div>
        <footer class="filter__footer">
            <Button :dataButton="DataButton[0]"/>
            <Button :dataButton="DataButton[1]"/>
        </footer>
    </section>
</template>

<script setup lang="ts">

import { ref, computed, watch, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../atoms/button/Button.atom.vue';
import { debounce } from 'lodash';

//Constants data

const { t } = useI18n();
const props = defineProps(['dataFilter']);
const emits = defineEmits(['emitFilterSignal', 'emitOrderSignal']);
const optionsFilteredData: any = reactive({options: []}); 
const searchQuery: any = ref("");
const allChecked: any = ref(false);
const filterType: any = computed(() => {
    let typeFilter: any = {};
    switch (props.dataFilter.type){
        case 'text':
            typeFilter = {
                p1: 'sort_from_a_to_z',
                p2: 'sort_from_z_to_a',
                i1: '/filters/icon-filter-a-z.svg',
                i2: '/filters/icon-filter-z-a.svg',
            };
            break;
        case 'date':
            typeFilter = {
                p1: 'sort_from_most_oldest_to_recent',
                p2: 'sort_from_most_recent_to_oldest',
                i1: '/filters/icon-filter-',
                i2: '/filters/icon-filter-',
            };
            break;
        case 'number':
            typeFilter = {
                p1: 'sort_from_smallest_to_largest',
                p2: 'sort_from_largest_to_smallest',
                i1: '/filters/icon-filter-0-9.svg',
                i2: '/filters/icon-filter-9-0.svg',
            };
            break;
        default:
            typeFilter = {
                p1: '',
                p2: '',
                i1: '/',
                i2: '/',
            };
            break;
    }
    return typeFilter;
});

// Data to children components

const DataButton: any = ref([
    {
        className: 'grey',
        text: 'cancel',
        alt: 'new',
        url: '/Buttons/decline.svg',
        iconSize: 'short',
        reverse: false,
        disabled: false,
        onClick: () => {
            closeFilter();
        }
    },
    {
        className: 'blue',
        text: 'filter',
        alt: 'new',
        url: '/filters/icon-filter.svg',
        reverse: true,
        disabled: false,
        onClick: () => {
            emitFilterSignal(true);
        }
    }
]);

// Cycle life component and watchers

watch(() => props.dataFilter.options, () => {
    restartOptions();
});

watch(optionsFilteredData, () => {;
    verifyAllchecked();
});


// Methods

function restartOptions() {
    optionsFilteredData.options = props.dataFilter.options;
}

function checkAll() {
    allChecked.value = !allChecked.value;
    optionsFilteredData.options.forEach((option: any) => {
        option.checked = allChecked.value;
    });
};

function verifyAllchecked() {
    allChecked.value = optionsFilteredData.options.every((option: any) => option.checked);
};

function closeFilter() {
    props.dataFilter.isOpen = false;
    searchQuery.value = "";
    restartOptions();
};

function optionSearch(searched_value: any) {
    optionsFilteredData.options = props.dataFilter.options.filter((item: any) =>
        item.text.toLowerCase().includes(searched_value.toLowerCase())
    );
};

// Data to parent component (Emits)
function emitOrderSignal(reverse: boolean) {
    closeFilter();
    emits('emitOrderSignal', reverse, props.dataFilter.id);
};

function emitFilterSignal(isActive: boolean) {
    props.dataFilter.isActive = isActive;
    if(!isActive){
        allChecked.value = true;
        checkAll()
    }
    closeFilter();
    emits('emitFilterSignal');
};

// Correct usage of debounce, create a debounced version of the search function
const debouncedSearch = debounce(function () {
  optionSearch(searchQuery.value);
}, 500);  // 1000ms = 1 seconds delay so 500ms = 0.5s

</script>

<style scoped src="./Filter.molecule.scss"></style>