<template>
    <article class="entity">
        <header class="entity__header">
            <h1 class="entity__header__title">{{ t('entity') }}</h1>
            <Select :dataSelect="dataEntity.dataSelectActions" class="entity__header__actions" 
                v-if="(hasPermissions.validator('update_entities') || hasPermissions.validator('change_state_entities')) && !dataEntity.stateEditForm" />
            <nav class="entity__header__nav" v-if="!dataEntity.stateEditForm">
                <Img class="entity__header__nav__img" :dataImg="dataEntity.dataImgGoBack"/>
            </nav>  
        </header>
        <section class="entity__info" v-if="dataEntity.data.date!= '' && dataEntity.data.date != null">
            <ul class="entity__info__form">
                <li class="entity__info__form__card">
                    <label>
                        {{ t('name') }}:
                    </label>
                   <input class="input input--read"
                        v-model="dataEntity.data.name"
                        :placeholder="dataEntity.data.name != '' && dataEntity.data.name != 'undefined' ? dataEntity.data.name : t('name')"
                        type="text">
                </li>
                <li class="entity__info__form__card">
                    <label>
                        {{ t('public_name') }}:
                    </label>
                     <input :class="'input input--' + (dataEntity.stateEditForm ? 'form-blue-lighting' : 'read')"
                        v-model="dataEntity.data.publicName"
                        :placeholder="dataEntity.data.publicName != '' && dataEntity.data.publicName != 'undefined' ? dataEntity.data.publicName : t('public_name')"
                        type="text">
                </li>
                <li class="entity__info__form__card">
                    <label>
                        {{ t('name_person_responsible') }}:
                    </label>
                    <input :class="'input input--' + (dataEntity.stateEditForm ? 'form-blue-lighting' : 'read')"
                        v-model="dataEntity.data.name_person_responsible"
                        :placeholder="dataEntity.data.name_person_responsible != '' && dataEntity.data.name_person_responsible != 'undefined' ? dataEntity.data.name_person_responsible : t('public_name')"
                        type="text">
                </li>
                <li class="entity__info__form__card">
                    <label>
                        {{ t('address') }}:
                    </label>
                    <input :class="'input input--' + (dataEntity.stateEditForm ? 'form-blue-lighting' : 'read')"
                        v-model="dataEntity.data.address"
                        :placeholder="dataEntity.data.address != '' && dataEntity.data.address != 'undefined' ? dataEntity.data.address : t('address')"
                        type="text">
                </li>
                <li class="entity__info__form__card">
                    <label>
                        {{ t('nit') }}:
                    </label>
                    <input :class="'input input--' + (dataEntity.stateEditForm ? 'form-blue-lighting' : 'read')"
                        v-model="dataEntity.data.nit"
                        :placeholder="dataEntity.data.nit != '' && dataEntity.data.nit != 'undefined' ? dataEntity.data.nit : t('nit')"
                        type="text">
                </li>
                <li class="entity__info__form__card">
                    <label>
                        {{ t('enabled') }}:
                    </label>
                    <input
                    v-model="dataEntity.data.enabled"
                        :checked="dataEntity.data.enabled"
                        :disabled="!dataEntity.stateEditForm"
                        type="checkbox">

                </li>
                <li class="entity__info__form__card">
                    <label>
                        {{ t('date') }}:
                    </label>
                    <input class="input input--read"
                        v-model="dataEntity.data.date"
                        :placeholder="dataEntity.data.date != '' && dataEntity.data.date != 'undefined' ? dataEntity.data.date : t('date')"
                        type="text">
                </li>
                <li class="entity__info__form__card">
                    <label>
                        {{ t('email') }}:
                    </label>
                    <input :class="'input input--' + (dataEntity.stateEditForm ? 'form-blue-lighting' : 'read')"
                        v-model="dataEntity.data.email"
                        :placeholder="dataEntity.data.email != '' && dataEntity.data.email != 'undefined' ? dataEntity.data.email : t('email')" 
                        type="text">
                </li>
                <li class="entity__info__form__card">
                    <label>
                        {{ t('type_of_entity') }}:
                    </label>
                    <Select :dataSelect="dataEntity.dataSelectEntityType" :class="'input input--' + (dataEntity.stateEditForm ? 'form-blue-lighting' : 'read')" />
                </li>
                <li class="entity__info__form__card">
                    <label>
                        {{ t('phone_number') }}:
                    </label>
                    <input :class="'input input--' + (dataEntity.stateEditForm ? 'form-blue-lighting' : 'read')"
                        v-model="dataEntity.data.phone"
                        :placeholder="dataEntity.data.phone != '' && dataEntity.data.phone != 'undefined' ? dataEntity.data.phone : t('phone')"
                        type="text">

                </li>
            </ul>
        </section>
        <section class="entity__info" v-else>
            <ul class="entity__info__content">
                <l1 class="entity__info__content__card">
                    <p
                        class="entity__info__content__card__subtitle loading-component entity__info__content__card__subtitle--load">
                    </p>
                </l1>
                <l1 class="entity__info__content__card">
                    <p
                        class="entity__info__content__card__subtitle loading-component entity__info__content__card__subtitle--load">
                    </p>
                </l1>
                <l1 class="entity__info__content__card">
                    <p
                        class="entity__info__content__card__subtitle loading-component entity__info__content__card__subtitle--load">
                    </p>
                </l1>
                <l1 class="entity__info__content__card">
                    <p
                        class="entity__info__content__card__subtitle loading-component entity__info__content__card__subtitle--load">
                    </p>
                </l1>
            </ul>
            <ul class="entity__info__content">
                <l1 class="entity__info__content__card">
                    <p
                        class="entity__info__content__card__subtitle loading-component entity__info__content__card__subtitle--load">
                    </p>
                </l1>
                <l1 class="entity__info__content__card">
                    <p
                        class="entity__info__content__card__subtitle loading-component entity__info__content__card__subtitle--load">
                    </p>
                </l1>
                <l1 class="entity__info__content__card">
                    <p
                        class="entity__info__content__card__subtitle loading-component entity__info__content__card__subtitle--load">
                    </p>
                </l1>
            </ul>
        </section>
        <ul class="entity__correspondence">
            <li class="entity__correspondence__card">
                <p class="entity__correspondence__card__title">{{ t('file_number_setting') }}</p>
                <div class="entity__correspondence__card__number-filing">
                    <a :class="'entity__correspondence__card__number-filing__card entity__correspondence__card__number-filing__card--'+(dataEntity.stateEditForm&&'focused')"
                        v-for="(number, index) in  dataEntity.numberFiling">
                        <button v-if="dataEntity.stateEditForm"
                            class="entity__correspondence__card__number-filing__card__button"
                            @click="dataEntity.setLeftPosition(number, index)">&lt;</button>
                        <p>{{ t(number.name) }}</p>
                        <button v-if="dataEntity.stateEditForm"
                            class="entity__correspondence__card__number-filing__card__button"
                            @click="dataEntity.setRightPosition(number, index)">></button>
                    </a>
                    <a :class="'entity__correspondence__card__number-filing__card entity__correspondence__card__number-filing__card--'+(dataEntity.stateEditForm&&'focused')">
                        
                        <p>{{ t('incremental') }}</p>
                        
                    </a>
                </div>
            </li>
            <li class="entity__correspondence__card">
                <p>{{ t('default_user_correspondence') }}</p>
                <Select :dataSelect="dataEntity.dataSelectUserCorrespondence" :class="'input input--' + (dataEntity.stateEditForm ? 'form-blue-lighting' : 'read')" />
            </li>
        </ul>
        <nav class="entity__nav last-column">
            <Button class="entity__nav__button" :dataButton="dataEntity.dataButtonBack"  v-if="dataEntity.stateEditForm"/>
            <Button class="entity__nav__button" :dataButton="dataEntity.dataButtonNext"  v-if="dataEntity.stateEditForm"/>
        </nav>
    </article>
    <ModalConfirmation :dataModalConfirmation="dataEntity.dataModalConfirmation" />
    <ModalAlert :dataModalAlert="dataEntity.dataModalAlert" />
</template>
<script setup lang="ts">

// Import vue library
import { defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

// Import components
import Button from '../../atoms/button/Button.atom.vue';
import Select from '../../atoms/select/Select.atom.vue';
import Img from '../../atoms/img/Img.atom.vue';
const ModalAlert = defineAsyncComponent(() => import('../../molecules/modals/alert/ModalAlert.molecule.vue'));
const ModalConfirmation = defineAsyncComponent(() => import('../../molecules/modals/confirmation/ModalConfirmation.molecule.vue'));

// Import services
import hasPermissions from '../../../guards/hasPermissions.guard';

// Define props, emits and their types
const { t } = useI18n();
const props = defineProps(['dataEntity']);

// Define Functions
function convertText(text: any) {
    if (text == null) {
        return '';
    }

    return text.replace(/_/g, ' ').replace(/-/g, ' ').toUpperCase();
}


</script>
<style scoped src="./Entity.template.scss"></style>