<template>
    <main class="login__wrapper">
        <header class="login__wrapper__header">
            <img src="/logos/docugate-ai-white.svg" alt="" class="login__wrapper__header__img">
            <SelectLangMolecule/>
        </header>
        <article
            :class="'login__wrapper__content login__wrapper__content--' + (!dataLogin.stateForm ? 'register' : '')">
            <section class="login__wrapper__content__header">
                <img src="/door-icon.png" alt="door-icon">
                <Title :dataTitle="dataLogin.dataTitle" />
            </section>
            <ul
                :class="'login__wrapper__content__options login__wrapper__content__options--' + (!dataLogin.stateForm ? 'register' : '')">
                <CardOptionLogin :dataCardOptionLogin="dataLogin.dataCardOptionLogin"
                    class="login__wrapper__content__options__card" />
                <CardOptionLogin :dataCardOptionLogin="dataLogin.dataCardOptionRegister"
                    class="login__wrapper__content__options__card" v-if="dataLogin.stateLogin=='user'"/>
            </ul>
            <section
                :class="'login__wrapper__content__form login__wrapper__content__form--' + (!dataLogin.stateForm ? 'register' : '')+' login__wrapper__content__form login__wrapper__content__form--' + (!dataLogin.visible ? 'hidde' : '')">
                <span v-if="!dataLogin.stateForm" class="login__wrapper__content__form__options">
                    <label>{{ t('natural_person') }}
                        <input type="radio" name="option" id="" :value="'001'"
                            v-model="dataLogin.stateChoiseTypePerson">
                    </label>
                    <label>{{ t('legal_person') }}
                        <input type="radio" name="option" id="" :value="'002'"
                            v-model="dataLogin.stateChoiseTypePerson">
                    </label>
                </span>
                <InputText :dataInput="dataLogin.dataInputId"
                    v-if="!dataLogin.stateForm && dataLogin.stateChoiseTypePerson == '001'" required />
                <InputText :dataInput="dataLogin.dataInputName"
                    v-if="!dataLogin.stateForm && dataLogin.stateChoiseTypePerson == '001'" required />
                <InputText :dataInput="dataLogin.dataInputBusinessName"
                    v-if="!dataLogin.stateForm && dataLogin.stateChoiseTypePerson == '002'" required />
                <InputText :dataInput="dataLogin.dataInputNit"
                    v-if="!dataLogin.stateForm && dataLogin.stateChoiseTypePerson == '002'" required />
                <InputText :dataInput="dataLogin.dataInputLastName"
                    v-if="!dataLogin.stateForm && dataLogin.stateChoiseTypePerson == '001'" required />
                <InputText :dataInput="dataLogin.dataInputPhone" v-if="!dataLogin.stateForm"
                    required />
                <InputText :dataInput="dataLogin.dataInputEmail" required />
                <InputText :dataInput="dataLogin.dataInputPassword" required />
                <Button :dataButton="dataLogin.dataButton" />
            </section>
            <p class="login__wrapper__content__forgot" v-if="dataLogin.stateForm" @click="dataLogin.sendVerificationCode">
                {{ t('have_you_forgotten_your_password') }}
            </p>
            <p class="login__wrapper__content__forgot" v-if="dataLogin.stateLogin=='user'" @click="dataLogin.redirectFiling">
                {{ t('continue_without_user') }}
            </p>
        </article>
        <Footer class="login__wrapper__footer" :imgColor="'white'"/>

        <ModalAlert :dataModalAlert="dataLogin.dataModalAlert" />
        <ModalConfirmation :dataModalConfirmation="dataLogin.dataModalConfirmation" />
    </main>
</template>

<script setup lang="ts">
import SelectLangMolecule from '../../molecules/select-lang/SelectLang.molecule.vue';
import CardOptionLogin from '../../molecules/card-option-login/CardOptionLogin.molecule.vue'
import ModalAlert from '../../molecules/modals/alert/ModalAlert.molecule.vue';
import ModalConfirmation from '../../molecules/modals/confirmation/ModalConfirmation.molecule.vue';
import FormLogin from '../../organisms/form-login/FormLogin.organism.vue';
import Title from '../../atoms/title/Title.atom.vue';
import Text from '../../atoms/text/Text.atom.vue';
import OptionsLogin from '../../organisms/options-login/OptionsLogin.organism.vue';
import CardLoginNormal from '../../organisms/card-login-normal/CardLoginNormal.organism.vue';
import { defineProps } from 'vue';
import InputText from '../../atoms/input/InputText.atom.vue';
import Button from '../../atoms/button/Button.atom.vue';
import { useI18n } from 'vue-i18n';
import Footer from '../../organisms/footer/Footer.organism.vue';

const { t,locale } = useI18n();
defineProps(['dataLogin']);//Use defineProps for can get data in another component.


</script>
<style scoped src="./Login.template.scss"></style>