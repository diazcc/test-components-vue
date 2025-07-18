<!--
    Todo: COMPONENT MODAL CREATE REUSABLE

    ?To use this component, read carefully what it requires in order to handle the correct data and structure.
    
    todo isActive = 'show' || 'hidde'

    dataModalcREATE : {
                    isActive: '', 'show' || 'hidde'
                    formText: '',
                    placeholder: '',
                    dataButton: {
                        className: '',
                        text: 'create',
                        disabled: false,
                        onClick: ()=>{}
                    },
                    dataText:{
                        classText: '',
                        text: 'Esta es la descripcion',
                        disabled: false,
                        onClick: () => { }
                    }
                }

-->
<template>
    <article :class="'create-modal-background ' + dataModalCreate.isActive"> <!--todo isActive = 'show' || 'hidde'-->
        <section
            :class="'create-modal-background__container ' + (dataModalCreate.isActive == 'show' ? 'showContainer' : 'hiddeContainer')"><!--todo isActive = 'show' || 'hidde'-->
            <Text class="create-modal-background__container__title" :dataText="dataModalCreate.dataText" />
            <input type="text" v-model="dataModalCreate.formText" :placeholder="t(dataModalCreate.placeholder)" required/>
            <Button class="create-modal-background__container__button" :dataButton="dataModalCreate.dataButton" />
            <Img class="create-modal-background__container__icon" :dataImg="dataModalCreate.dataImg"></Img>
        </section>
    </article>
</template>

<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import Button from "../../../atoms/button/Button.atom.vue";
import Text from "../../../atoms/text/Text.atom.vue";
import Img from '../../../atoms/img/Img.atom.vue';

const { t } = useI18n();
defineProps(['dataModalCreate']);

</script>

<style src="./ModalCreate.molecule.scss"></style>