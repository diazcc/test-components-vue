<!--
    Todo: COMPONENT MODAL ALERT REUSABLE

    ?To use this component, read carefully what it requires in order to handle the correct data and structure.
    
    todo isActive = 'show' || 'hidde'

    dataModalAlert : {
                    isActive: '', // -- > show
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
    <article :class="'alert-modal-background ' + dataModalAlert.isActive"> <!--todo isActive = 'show' || 'hidde'-->
        <section
            :class="dataModalAlert.isActive == 'show' ? 'alert-modal-background__container showContainer' : 'alert-modal-background__container hiddeContainer'"><!--todo isActive = 'show' || 'hidde'-->
            <Text :dataText="dataModalAlert.dataText" />
            <Button :dataButton="dataModalAlert.dataButton" />
        </section>
    </article>
</template>
<script setup lang="ts">
import Title from "../../../atoms/title/Title.atom.vue";
import Button from "../../../atoms/button/Button.atom.vue";
import Text from "../../../atoms/text/Text.atom.vue";


defineProps(['dataModalAlert']);



</script>

<style src="./ModalAlert.molecule.scss"></style>