<!-- Todo: ##### COMPONENT SUBTITLE - H2 ##### -->
<!--
    It's define by dataSubtTitle for be se used on others components.
    -- This component could be improve but can't be modified about funcionality, it must developed in component page. -- 
    ?- This component get a json structure data like this:

*    dataSubtitle =  {
*                    classSubtTitle: '',
*                    text: 'texto',
*                    disabled: false,
*                    onClick: () => {}
*               };
-->
<template>
    <h2 :class="['subtTitle subtTitle--' + dataSubtitle.classSubtTitle]" @click="dataSubtitle.onClick" :disabled="dataSubtitle.disabled">
        {{ t(dataSubtitle.text) }} 
        <!--
            TODO: If you need add some text, you must add it to field from /locales/lang.js and set text es and en.    
        -->
    </h2>
</template>
<script setup lang="ts">
//IMPORTS
import { defineProps } from 'vue';//Import function 'reactive' for show on the DOM data.
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// VARIABLES
/*
    
*/
defineProps(['dataSubtitle']);//Use defineProps for can get data in another component.
/** 
    FUNCTIONS: 
    
*    !¡This componente haven't functions on this section, must be define on the structure variable json .!
*/
</script>
<style scoped src="./Subtitle.atom.scss"></style><!--Call the style in the same folder-->


