<!--
    Todo: COMPONENT MODAL CONFIRMATION REUSABLE

    ?To use this component, read carefully what it requires in order to handle the correct data and structure.
    
    todo isActive = 'show' || 'hidde'

    dataModalConfirmation : {
                    isActive: '', 'show' || 'hidde'
                    dataButton: {
                        className: '',
                        text: 'Inicio de sesión',
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
    <article :class="'confirmation-modal-background ' + dataModalConfirmation.isActive"> <!--todo isActive = 'show' || 'hidde'-->
        <section
            :class="'confirmation-modal-background__container ' + (dataModalConfirmation.isActive == 'show' ? 'showContainer' : 'hiddeContainer')"><!--todo isActive = 'show' || 'hidde'-->
            <Text :dataText="dataModalConfirmation.dataText" />
            <CheckAnimation :isActive="dataModalConfirmation.isActive"/>
            <Button class="confirmation-modal-background__container__button" :dataButton="dataModalConfirmation.dataButton" />
        </section>
    </article>
</template>
<script setup lang="ts">
import Button from "../../../atoms/button/Button.atom.vue";
import Text from "../../../atoms/text/Text.atom.vue";
import CheckAnimation from "../../../atoms/check-animation/CheckAnimation.atom.vue";


defineProps(['dataModalConfirmation']);



</script>

<style src="./ModalConfirmation.molecule.scss"></style>