<template>
    <section class="card-resetpassword-normal">
        <InputText :dataInput="dataCardResetPassword.dataInputEmail" />
        <InputText :dataInput="dataCardResetPassword.dataInputVerificationCode" />
        <InputText :dataInput="dataCardResetPassword.dataInputNewPassword" />
        <InputText :dataInput="dataCardResetPassword.dataInputConformationPassword" />

        <Button :dataButton="dataCardResetPassword.dataButton" />
    </section>
</template>
<script setup lang="ts">
import InputText from '../../atoms/input/InputText.atom.vue';
import Button from '../../atoms/button/Button.atom.vue';

defineProps(['dataCardResetPassword']);
</script>
<style scoped src="./CardResetPassword.organism.scss"></style>