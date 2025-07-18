<!-- *##### COMPONENT BUTTON ##### -->
<!--
    ? It's define by dataButton for be se used on others components.

    -- This component could be improve but can't be modified about funcionality, it must developed in component page. -- 
    :class="['button button--' + dataButton?.classButton]" -- can modify the style that you want in the file ./thisnamecomponente.scss
    @click="dataButton?.onClick"-- get the event click and develop any functions from father component
    :disabled="dataButton?.disabled" -- can disabled this component when you need.

    ?this componente expects this structure :
        dataButton: 
                    {
                        className: '',
                        text: 'Inicio de sesión',
                        alt: '',
                        url: '',
                        disabled: false,
                        reverse: false,
                        fontSize: '',
                        iconSize: '',
                        onClick: ()=>{}
                   }

-->
<template>
    <button :class="['button button--' + dataButton?.className  + (!dataButton?.text ? ' loading-component' : '') + (dataButton?.reverse ? ' button--reverse' : '')]" @click="dataButton?.onClick" :disabled="dataButton?.disabled">
        <img :class="'button__img button__img--'+dataButton?.iconSize" v-if="dataButton?.url" :src="dataButton?.url" :alt="dataButton?.alt">
        <p v-if="dataButton?.text" :class="'button__text button__text--'+dataButton?.fontSize">{{ te(dataButton?.text)? t(dataButton?.text):dataButton?.text}}</p> 
        <!--
            TODO: If you need add some text, you must add it to field from /locales/lang.js and set text es and en.    
        -->
    </button>
</template>
<script setup lang="ts">
/** 
 * *IMPORTS
 * 
 * *Import function 'defineProps' for call the own prop in others components.
*/

import { defineProps } from 'vue';
import { useI18n } from 'vue-i18n';
const { t,te } = useI18n();
/** 
*       TODO VARIABLES
*       ?- This component get a json structure data, you need construct the structure json from the las call about this component,
*       ? for example: page.
*/
defineProps(['dataButton']);//Use defineProps for can get data in another component.
/** 
    FUNCTIONS: 
    
*       TODO ¡¡If you need add some function, you must to inform to lider or supervisor of this project before.!!
*/
</script>
<style scoped src="./Button.atom.scss"></style><!--Call the style in the same folder-->

<!--
    ? ADVICE FROM COMPONENT:

    If you need add some style or change, you must add to doc InputText.atom.scss and add code as :
    
*    className {
    
*        &--modifierName{
*            defining the modifier you can change the style that you need. The default styles by className don't be modified if isn't necesary.
*        }
*    }

-->
