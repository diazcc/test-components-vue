<!-- *##### COMPONENT INPUT ##### -->
<template>
    <!--
        ? It's define by dataText for be se used on others components.
        -- This component could be improve but can't be modified about funcionality, it must be developed in component page. -- 
        
        :name="dataTextArea.name" -- data for identify component, necesary where someone use the decorator @textArea.
        :type="dataTextArea.type" -- set type of textArea, could be email, passwordd...
        :class="['textArea textArea--' + dataTextArea.classTextArea]" -- can modify the style that you want in the file ./thisnamecomponente.scss
        v-model="dataTextArea.model" -- can detect state some change about this component and get the value.
        @click="dataTextArea.onClick"-- get the event click and develop any functions from father component
        :placeholder="dataTextArea.placeholder" -- personalice the placeholder
        :disabled="dataTextArea.disabled" -- can disabled this component when you need.
        @textArea="handleTextArea -- you can get the listener about textArea of each work or character that you press and get data in a json.

        ?this component expects this structure :

*        dataTextArea: {
*                        id :'',
*                        name:'password',
*                        className: '',
*                        model: '',
*                        placeholder: '***',
*                        disabled: false,
*                        onClick: () => { }
*                    }
        
    -->
    <textArea :id="dataTextArea.id" :name="dataTextArea.name"  :class="['text-area text-area--' + dataTextArea.className]" v-model="dataTextArea.model" :placeholder="t(dataTextArea.placeholder)" :disabled="dataTextArea.disabled"
    :rows="dataTextArea.rows"
    :cols="dataTextArea.cols"
    @click="dataTextArea.onClick"></textArea>   
        <!--
            TODO: If you need add some text, you must add it to field from /locales/lang.js and set text es and en.    
        -->
</template>
<script setup lang="ts">

//IMPORTS
import { defineProps } from 'vue';//Import function 'reactive' for show on the DOM data.
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
// VARIABLES
defineProps(['dataTextArea']);//Use defineProps for can get data in another component.
/** 
*    ? - This component get a json structure data, you need construct the structure json from the las call about this component,
        for example: page.
*/

//     FUNCTIONS: 

//   ¡¡If you need add some function, you must to inform to lider or supervisor of this project before.!!

/**
    FUNCTIONS: 
*    Todo: ¡This componente will not have more functions on this section, must be define on the structure variable json .!
*/
</script>

<style scoped src="./TextArea.atom.scss"></style><!--Call the style in the same folder-->
<!--
    ? ADVICE FROM COMPONENT:

    If you need add some style or change, you must add to doc TextAreaText.atom.scss and add code as :
    
    className {
    
        &--modifierName{
            defining the modifier you can change the style that you need. The default styles by className don't be modified if isn't necesary.
        }
    }

-->

