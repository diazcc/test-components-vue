<template>
    <section class="options-login">
        <ul class="options-login__content">
            <CardOptionLogin :dataCardOptionLogin="dataOptionsLogin.dataCardOptionLogin"/>
            <!-- <CardOptionLogin :dataCardOptionLogin="dataOptionsLogin.dataCardOptionRegister"/> -->
            <!-- <CardOptionLogin :dataCardOptionLogin="dataOptionsLogin.dataCardOptionBiometric"/> 

                TODO: unnecesary components
        -->
        </ul>
    </section>
</template>
<script setup lang="ts">
import CardOptionLogin from '../../molecules/card-option-login/CardOptionLogin.molecule.vue'

defineProps(['dataOptionsLogin'])

</script>
<style scoped src="./OptionsLogin.organism.scss"></style>