<!-- ##### COMPONENT FORM LOGIN ##### -->
<!--
    It's define by dataButton for be se used on others components.
    -- This component could be improve but can't be modified about funcionality, it must developed in component page. -- 
-->
<template>
    <section class="container__form">
        <Title :dataTitle = "dataFormLogin.dataTitle"/>
        <Text :dataText = "dataFormLogin.dataTextEmail"/>        
        <InputText :dataInput = "dataFormLogin.dataInputEmail"/>
        <Text :dataText = "dataFormLogin.dataTextPassword"/>
        <InputText :dataInput = "dataFormLogin.dataInputPassword"/>
        <Button :dataButton = "dataFormLogin.dataButtonLogin"/>
        <Button :dataButton = "dataFormLogin.dataButtonRegister"/>
    </section>
</template>
<script setup lang="ts">
//IMPORTS
import Button  from '../../atoms/button/Button.atom.vue';
import InputText  from '../../atoms/input/InputText.atom.vue';
import Title  from '../../atoms/title/Title.atom.vue';
import Text  from '../../atoms/text/Text.atom.vue';


// VARIABLES
/*
    - This component get a json structure data.
*/
    defineProps(['dataFormLogin']);//Use defineProps for can get data in another component.
/*
    FUNCTIONS: 
    
    ¡This componente haven't functions on this section, must be define on the structure variable json .!

*/
</script>
<style scoped src="./FormLogin.organism.scss"></style><!--Call the style in the same folder-->


