<!-- ##### COMPONENT TITLE -H1 ##### -->
<!--
    It's define by dataTitle for be se used on others components.
    -- This component could be improve but can't be modified about funcionality, it must developed in component page. -- 
-->
<template>
    <h1 :class="['title title--' + dataTitle.classTitle + ' ' + (!dataTitle.text ? 'loading-component' : '')]" @click="dataTitle.onClick" :disabled="dataTitle.disabled">
        
        {{ t(dataTitle.text) }} 
        <!--
            TODO: If you need add some text, you must add it to field from /locales/lang.js and set text es and en.    
        -->
    </h1>
</template>
<script setup lang="ts">
//IMPORTS
import { defineProps } from 'vue';//Import function 'reactive' for show on the DOM data.
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// VARIABLES
/*
    - This component get a json structure data like this:

    dataTitle :  {
                    classTitle: '',
                    text: 'texto',
                    disabled: false,
                    onClick: () => {}
                },
*/
defineProps(['dataTitle']);//Use defineProps for can get data in another component.
/** 
    FUNCTIONS: 
    
*    Todo¡This componente haven't functions on this section, must be define on the structure variable json .!
*/
</script>
<style scoped src="./Title.atom.scss"></style><!--Call the style in the same folder-->


