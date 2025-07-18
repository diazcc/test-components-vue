<template>
    <article class="email-configuration">
        <header class="email-configuration__header">
            <h1>{{ t('email_configuration_module') }}</h1>
        </header>
        <h1 class="email-configuration__title">{{ t('email_configuration') }}</h1>
        <section :class="'email-configuration__info ' + (dataEmailConfiguration.stateLoadAns ? 'loading-component' : '')" 
            v-if="!dataEmailConfiguration?.stateLoadForm">
            <li class="email-configuration__info__card">
                <label>
                    {{ t('type_connection') }}:
                </label> <br>
                <p v-if="!dataEmailConfiguration.stateEditForm"> 
                    {{dataEmailConfiguration.data.type_connection}}
                </p>
                <select v-else :class="'input input--' + (dataEmailConfiguration.stateEditForm ? 'form-blue-lighting' : 'read')"
                    v-model="dataEmailConfiguration.newData.type_connection" required
                >
                    <option selected value="" disabled>{{ t("select_connection") }}</option>
                    <option :value="'pop3'">{{ t("pop3") }}</option>
                    <option :value="'imap'">{{ t("imap") }}</option>
                </select>
            </li>
            <li class="email-configuration__info__card">
                <label>
                    {{ t('Host') }}:
                </label> <br>
                <p v-if="!dataEmailConfiguration.stateEditForm"> 
                    {{dataEmailConfiguration.data.host}}
                </p>
                <input v-else :class="'input input--' + (dataEmailConfiguration.stateEditForm ? 'form-blue-lighting' : 'read')"
                    v-model="dataEmailConfiguration.newData.host"
                    :placeholder="dataEmailConfiguration.newData.host != '' && dataEmailConfiguration.newData.host != 'undefined' ? dataEmailConfiguration.newData.host : t('Host')"
                    type="text" required>
            </li>
            <li class="email-configuration__info__card">
                <label>
                    {{ t('port') }}:
                </label> <br>
                <p v-if="!dataEmailConfiguration.stateEditForm"> 
                    {{dataEmailConfiguration.data.port}}
                </p>
                <input v-else :class="'input input--' + (dataEmailConfiguration.stateEditForm ? 'form-blue-lighting' : 'read')"
                    v-model="dataEmailConfiguration.newData.port"
                    :placeholder="dataEmailConfiguration.newData.port != '' && dataEmailConfiguration.newData.port != 'undefined' ? dataEmailConfiguration.newData.port : t('port')"
                    type="text" required>
            </li>
            <li class="email-configuration__info__card">
                <label>
                    {{ t('email') }}:
                </label> <br>
                <p v-if="!dataEmailConfiguration.stateEditForm"> 
                    {{dataEmailConfiguration.data.email}}
                </p>
                <input v-else :class="'input input--' + (dataEmailConfiguration.stateEditForm ? 'form-blue-lighting' : 'read')"
                    v-model="dataEmailConfiguration.newData.email"
                    :placeholder="dataEmailConfiguration.newData.email != '' && dataEmailConfiguration.newData.email != 'undefined' ? dataEmailConfiguration.newData.email : t('email')"
                    type="email" required>
            </li>
            <li class="email-configuration__info__card email-configuration__info__card--full" v-if="dataEmailConfiguration.stateEditForm">
                <label>
                    {{ t('password') }}:
                </label> <br>
                <div style="position: relative;">
                    <input :class="'input input--' + (dataEmailConfiguration.stateEditForm ? 'form-blue-lighting' : 'read')"
                        v-model="dataEmailConfiguration.newData.password"
                        :placeholder="t('password')"
                        :type="showPassword ? 'text' : 'password'" required>
                    <span
                        @mousedown="showPassword = true"
                        @mouseup="showPassword = false"
                        @mouseleave="showPassword = false"
                        class="email-configuration__info__card__eye"
                    >
                        {{ showPassword ? '🙈' : '👁️' }}
                    </span>
                </div>
            </li>
        </section>
        <section class="email-configuration__info" v-else>
            <li class="email-configuration__info__card loading-component">
                <p v-if="!dataEmailConfiguration.stateEditForm"> 
                </p>
            </li>
            <li class="email-configuration__info__card loading-component">
                <p v-if="!dataEmailConfiguration.stateEditForm"> 
                </p>
            </li>
            <li class="email-configuration__info__card loading-component">
                <p v-if="!dataEmailConfiguration.stateEditForm"> 
                </p>
            </li>
            <li class="email-configuration__info__card loading-component">
                <p v-if="!dataEmailConfiguration.stateEditForm"> 
                </p>
            </li>
        </section>
        <footer class="email-configuration__buttons-nav">
            <Button v-if="!dataEmailConfiguration.stateEditForm && !dataEmailConfiguration?.stateLoadForm && hasPermissions.validator('create_emails_connections')"
                    class="email-configuration__buttons-nav__button"
                    :dataButton="dataEmailConfiguration.dataButtonEdit"/>
            <Button v-if="dataEmailConfiguration.stateEditForm"
                    class="email-configuration__buttons-nav__button"
                    :dataButton="dataEmailConfiguration.dataButtonNext"/>
            <Button v-if="dataEmailConfiguration.stateEditForm"
                    class="email-configuration__buttons-nav__button"
                    :dataButton="dataEmailConfiguration.dataButtonBack"/>
        </footer>
    </article>
    <ModalConfirmation :dataModalConfirmation="dataEmailConfiguration.dataModalConfirmation" />
    <ModalAlert :dataModalAlert="dataEmailConfiguration.dataModalAlert" />
</template>

<script setup lang="ts">

import { defineAsyncComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import hasPermissions from "../../../guards/hasPermissions.guard.ts";

import Button from '../../atoms/button/Button.atom.vue';
const ModalAlert = defineAsyncComponent(() => import('../../molecules/modals/alert/ModalAlert.molecule.vue'));
const ModalConfirmation = defineAsyncComponent(() => import('../../molecules/modals/confirmation/ModalConfirmation.molecule.vue'));

const showPassword = ref(false);
const { t } = useI18n();
const props = defineProps(['dataEmailConfiguration']);

</script>

<style scoped src="./EmailConfiguration.template.scss"></style>