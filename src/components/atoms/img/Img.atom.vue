<!-- *##### COMPONENT IMG/SVG ##### -->
<!--
    ? It's define by dataText for be se used on others components.
    -- This component could be improve but can't be modified about funcionality, it must be developed in component page. -- 
    
    :name="dataImg?.name" -- data for identify component, necesary where someone use the decorator @img.
    :type="dataImg?.type" -- set type of img, could be email, passwordd...
    :class="['img img--' + dataImg?.classInput]" -- can modify the style that you want in the file ./thisnamecomponente.scss
    v-model="dataImg?.model" -- can detect state some change about this component and get the value.
    @click="dataImg?.onClick"-- get the event click and develop any functions from father 
    :placeholder="dataImg?.placeholder" -- personalice the placeholder
    :disabled="dataImg?.disabled" -- can disabled this component when you need.
    @img="handleInput -- you can get the listener about img of each work or character that you press and get data in a json.

    ?this component expects this structure :

        dataImg: {
                        id :'',
                        name:'',
                        class: '',
                        src: '',
                        type: 'png',
                        alt: '',
                        isActive: () => { }, // optional, currently used to add activate and deactivate the active class
                        onClick: () => { }
                    }
    
-->
<template>
    <img draggable="false"
        :id="dataImg?.id" 
        :name="dataImg?.name" 
        :class="['img img--' + dataImg?.class + ' ' + (!dataImg?.src ? 'loading-component' : ''), { 'active': dataImg?.isActive ? dataImg?.isActive() : '' } ]" 
        :src="dataImg?.src"
        :type="dataImg?.type" 
        :alt="te(dataImg?.alt)?t(dataImg?.alt):dataImg?.alt" 
        @click="dataImg?.onClick">
</template>
<script setup lang="ts">

//IMPORTS
import { defineProps } from 'vue';//Import function 'reactive' for show on the DOM data.
import { useI18n } from 'vue-i18n';
const { t,te } = useI18n();
// VARIABLES
defineProps(['dataImg']);//Use defineProps for can get data in another component.
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

<style scoped src="./Img.atom.scss"></style><!--Call the style in the same folder-->
<!--
    ? ADVICE FROM COMPONENT:

    If you need add some style or change, you must add to doc InputText.atom.scss and add code as :
    
    className {
    
        &--modifierName{
            defining the modifier you can change the style that you need. The default styles by className don't be modified if isn't necesary.
        }
    }

-->

