<!-- COMPONENT VERIFICATIONCODE -->
<template>
    <main class="verificationcode__wrapper">
        <header class="verificationcode__wrapper__header">
            <img src="/logos/docugate-ai.svg" alt="" class="verificationcode__wrapper__header__img">
            <SelectLangMolecule/>
        </header>

        <article class="verificationcode__wrapper__content">
            <section class="verificationcode__wrapper__content__header">
                <Text :dataText="dataSendVerificationCode.dataText" />
            </section>
            <CardSendVerificationCode :dataCardSendVerificationCode="dataSendVerificationCode.CardSendVerificationCode" />
        </article>
        <Footer class="verificationcode__wrapper__footer"/>
        
        <ModalAlert :dataModalAlert="dataSendVerificationCode.dataModalAlert" />
        <ModalConfirmation :dataModalConfirmation="dataSendVerificationCode.dataModalConfirmation" />
    </main>
</template>

<script setup lang="ts">
/**  IMPORTS
*    ?- calls all components. functions or variables for be used. 
*/
import ModalConfirmation from '../../molecules/modals/confirmation/ModalConfirmation.molecule.vue';
import ModalAlert from '../../molecules/modals/alert/ModalAlert.molecule.vue';
import Text from '../../atoms/text/Text.atom.vue';
import CardSendVerificationCode from '../../organisms/card-send-verification-code/CardSendVerificationCode.organism.vue';
import Footer from '../../organisms/footer/Footer.organism.vue';
import { defineProps } from 'vue';
import { useI18n } from 'vue-i18n';
import SelectLangMolecule from '../../molecules/select-lang/SelectLang.molecule.vue';
const { t,locale } = useI18n();
defineProps(['dataSendVerificationCode']);//Use defineProps for can get data in another component.

</script>
<style scoped src="./SendVerificationCode.template.scss"></style>
