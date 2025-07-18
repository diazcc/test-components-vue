<template>
    <section class="card-cardsendverificationcode-normal">
        <InputText :dataInput="dataCardSendVerificationCode.dataInputEmail" />

        <Button :dataButton="dataCardSendVerificationCode.dataButton" />
    </section>
</template>
<script setup lang="ts">
import InputText from '../../atoms/input/InputText.atom.vue';
import Button from '../../atoms/button/Button.atom.vue';

defineProps(['dataCardSendVerificationCode']);
</script>
<style scoped src="./CardSendVerificationCode.organism.scss"></style>