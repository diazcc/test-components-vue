<!-- ##### COMPONENT TEXT ##### 
    It's define by dataText for be se used on others components.
    -- This component could be improve but can't be modified about funcionality, it must developed in component page. -- 
    :class="['text text--' + dataText.classText]" -- can modify the style that you want in the file ./thisnamecomponente.scss
    @click="dataText.onClick"-- get the event click and develop any functions from father component
    :disabled="dataButton.disabled" -- can disabled this component when you need.

    ?this component expects this structure :


    dataText : 
    {
        classText: '',
        text: 'Email',
        disabled: false,
        onClick: () => { }
    },
            TODO: If you need add some text, you must add it to field from /locales/lang.js and set text es and en.    
-->
<template>
    <p :class="['text text--' + dataText.classText]" @click="dataText.onClick">
        {{ t(dataText.text) }}

    </p>
</template>
<script setup lang="ts">
//IMPORTS
import { defineProps } from 'vue';//Import function 'reactive' for show on the DOM data.
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// VARIABLES
/*
   - This component get a json structure data, you need construct the structure json from the las call about this component,
        for example: page.
*/
defineProps(['dataText']);//Use defineProps for can get data in another component.
/** 
    FUNCTIONS: 
    
*    !¡¡If you need add some function, you must to inform to lider or supervisor of this project before.!!
*/
</script>
<style scoped src="./Text.atom.scss"></style><!--Call the style in the same folder-->
<!--
    ADVICE FROM COMPONENT:

    If you need add some style or change, you must add to doc InputText.atom.scss and add code as :
    
    className {
    
        &--modifierName{
            defining the modifier you can change the style that you need. The default styles by className don't be modified if isn't necesary.
        }
    }

-->
