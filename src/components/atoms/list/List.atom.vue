<!-- *##### COMPONENT LIST ##### -->
<!--
    ? It's define by dataList for be se used on others components.

    -- This component could be improve but can't be modified about funcionality, it must developed in component page. -- 
    :class="['list list--' + dataList.className]" -- can modify the style that you want in the file ./thisnamecomponente.scss
    @click="dataList.onClick"-- get the event click and develop any functions from father component


    ?this componente expects this structure :
        dataList: 
                    {
                        className: '',
                        text: 'Ir a las tareas',
                        onClick: ()=>{}
                        lists : [
                        ]
                   }

-->
<template>

    <ul :class="['list list--' + dataList.className]" @click="dataList.onClick">
        <li v-for="list in dataList.lists" :class="['list__element' + list.className]">
            <router-link class="list__element__container" :to=list.path>
                <img src="/icon-arrow-item-menu-padre lateral-cerrado.svg" alt="" class="list__element__container__img">
                <p class="list__element__container__text">{{t(list.text) }} <span v-if="list.number"> {{ '(' + list.number
                    + ')'
                        }}</span>
                </p>
            </router-link>
        </li>
    </ul>


</template>
<script setup lang="ts">
/** 
 * *IMPORTS
 * 
 * *Import function 'defineProps' for call the own prop in others components.
*/

import { defineProps, ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

/** 
*       TODO VARIABLES
*       ?- This component get a json structure data, you need construct the structure json from the las call about this component,
*       ? for example: page.
*/
defineProps(['dataList']);//Use defineProps for can get data in another component.
/** 
    FUNCTIONS: 
    
*       TODO ¡¡If you need add some function, you must to inform to lider or supervisor of this project before.!!
*/
</script>
<style scoped src="./List.atom.scss"></style><!--Call the style in the same folder-->

<!--
    ? ADVICE FROM COMPONENT:

    If you need add some style or change, you must add to doc InputText.atom.scss and add code as :
    
*    className {
    
*        &--modifierName{
*            defining the modifier you can change the style that you need. The default styles by className don't be modified if isn't necesary.
*        }
*    }

-->
