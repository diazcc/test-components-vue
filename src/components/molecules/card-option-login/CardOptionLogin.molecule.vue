<template >
    <li :class="'card-option-login card-option-login--'+(dataCardOptionLogin.state?'focused':'')" @click="dataCardOptionLogin.onClick">
        <Img :dataImg ="dataCardOptionLogin.dataImg"/> 
        <Text :dataText ="dataCardOptionLogin.dataText"/>
    </li>
</template>
<script setup lang="ts">
import Text from '../../atoms/text/Text.atom.vue';
import Img from '../../atoms/img/Img.atom.vue';

defineProps(['dataCardOptionLogin'])
</script>
<style scoped src="./CardOptionLogin.molecule.scss"></style>