<!-- COMPONENT RESETPASSWORD -->
<template>
  <main class="resetpassword__wrapper">
    <header class="resetpassword__wrapper__header">
      <img
        src="/logos/docugate-ai.svg"
        alt=""
        class="resetpassword__wrapper__header__img"
      />
      <SelectLangMolecule />
    </header>

    <article class="resetpassword__wrapper__content">
      <section class="resetpassword__wrapper__content__header">
        <Title :dataTitle="dataResetPasswordTemplate.dataTitle" />
        <Text :dataText="dataResetPasswordTemplate.dataText" />
      </section>
      <CardResetPassword
        :dataCardResetPassword="dataResetPasswordTemplate.dataCardResetPassword"
      />
    </article>
    <Footer class="resetpassword__wrapper__footer" />

    <ModalAlert :dataModalAlert="dataResetPasswordTemplate.dataModalAlert" />
    <ModalConfirmation
      :dataModalConfirmation="dataResetPasswordTemplate.dataModalConfirmation"
    />
  </main>
</template>

<script setup lang="ts">
/**  IMPORTS
 *    ?- calls all components. functions or variables for be used.
 */
import ModalConfirmation from "../../molecules/modals/confirmation/ModalConfirmation.molecule.vue";
import ModalAlert from "../../molecules/modals/alert/ModalAlert.molecule.vue";
import Title from "../../atoms/title/Title.atom.vue";
import Text from "../../atoms/text/Text.atom.vue";
import CardResetPassword from "../../organisms/card-reset-password/CardResetPassword.organism.vue";
import Footer from "../../organisms/footer/Footer.organism.vue";
import { defineProps } from "vue";
import { useI18n } from "vue-i18n";
import SelectLangMolecule from "../../molecules/select-lang/SelectLang.molecule.vue";
const { t, locale } = useI18n();

defineProps(["dataResetPasswordTemplate"]); //Use defineProps for can get data in another component.
</script>

<style scoped src="./ResetPassword.template.scss"></style>
