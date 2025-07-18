<!--
    todo This component needs this structure:

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
                onClick: () => { }
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

        }
-->

<template>
    <section :class="'input-search input-search--'+(active && isActive ? 'active' : 'inactive')">
        <Input :dataInput="dataInputSearch.dataInput" @click="handleInputClick"/>
        <Img :dataImg="dataInputSearch.dataImg"/>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Input from "../../atoms/input/InputText.atom.vue";
import Img from "../../atoms/img/Img.atom.vue";
const props :any = defineProps(['dataInputSearch','active']);


const isActive = ref(false);

const handleInputClick = () => {
    isActive.value = true;
};
</script>

<style scoped src="./InputSearch.molecule.scss"></style>