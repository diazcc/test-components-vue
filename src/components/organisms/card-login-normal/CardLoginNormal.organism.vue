<template>
    <section class="card-login-normal">
        <InputText :dataInput="dataCardLogin.dataInputEmail" />
        <InputText :dataInput="dataCardLogin.dataInputPassword" />
        <Button :dataButton="dataCardLogin.dataButton"/>
    </section>
</template>
<script setup lang="ts">
import InputText from '../../atoms/input/InputText.atom.vue';
import Button from '../../atoms/button/Button.atom.vue';

defineProps(['dataCardLogin']);
</script>
<style scoped src="./CardLoginNormal.organism.scss"></style>