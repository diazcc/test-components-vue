<template>
    <article class="user-info ">
        <header class="user-info__header">
            <h1 class="user-info__header__title">{{ t('user') }}</h1>
            <Button class="user-info__header__edit" v-if="!dataUserInfo.stateEditForm && hasPermissions.validator('update_users')"
                    :dataButton="dataUserInfo.dataButtonEdit"/>
            <nav class="user-info__header__nav" v-if="!dataUserInfo.stateEditForm">
                <Img class="user-info__header__nav__img" :dataImg="dataUserInfo.dataImgGoBack"/>
            </nav>  
        </header>
        
        <ul v-if="dataUserInfo.form.id!=null||dataUserInfo.form.id!=''"
            :class="'user-info__content ' + (dataUserInfo?.stateLoadForm ? 'loading-component' : '')">

            <li class="user-info__content__card">
                <label>{{ t('select_identification_type') }}:</label>
                <Select :dataSelect="dataUserInfo.dataSelectIdentificationType" required />
                        </li>
            <li class="user-info__content__card">
                <label>{{ t('identification_number') }}:</label>
                <input type="text" v-model="dataUserInfo.form.identification_number"
                    :placeholder="t('identification_number')" @input="event => limitInputValue(event, 'identification_number')" required disabled>
            </li>
            <li class="user-info__content__card">
                <label>{{ t('first_name') }}:</label>
                <input type="text" v-model="dataUserInfo.form.first_name" :placeholder="t('first_name')" 
                @input="event => FormValidators.validateOnlyLetters(event, 'first_name', dataUserInfo.form)"
                required
                disabled>
            </li>
            <li class="user-info__content__card">
                <label>{{ t('second_name') }}:</label>

                <input type="text" v-model="dataUserInfo.form.second_name" :placeholder="t('second_name')"
                @input="event => FormValidators.validateOnlyLetters(event, 'second_name', dataUserInfo.form)"
                disabled>
            </li>

            <li class="user-info__content__card">
                <label>{{ t('last_name') }}:</label>

                <input type="text" v-model="dataUserInfo.form.last_name" :placeholder="t('last_name')"
                @input="event => FormValidators.validateOnlyLetters(event, 'last_name', dataUserInfo.form)"
                required
                disabled>
            </li>
            <li class="user-info__content__card">
                <label>{{ t('second_last_name') }}:</label>

                <input type="text" v-model="dataUserInfo.form.second_last_name" :placeholder="t('second_last_name')"
                @input="event => FormValidators.validateOnlyLetters(event, 'second_last_name', dataUserInfo.form)"
                disabled>
            </li>

         
            <li class="user-info__content__card">
                <label>{{ t('country') }}:</label>
                <Select :dataSelect="dataUserInfo.dataSelectCountry" />
            </li>
            <li class="user-info__content__card">
                <label>{{ t('department') }}:</label>
                <Select :dataSelect="dataUserInfo.dataSelectDepartment"
                    :required="(dataUserInfo.dataSelectCountry.model!=''&&dataUserInfo.dataSelectCountry.model!=null)" />
            </li>
            <li class="user-info__content__card">
                <label>{{ t('city') }}:</label>
                <Select :dataSelect="dataUserInfo.dataSelectCity"
                    :required="(dataUserInfo.dataSelectCountry.model!=''&&dataUserInfo.dataSelectCountry.model!=null)" />
            </li>
            <li class="user-info__content__card">
                <label>{{ t('address') }}:</label>
                <input type="text" v-model="dataUserInfo.form.address" :placeholder="t('address')" 
                @input="event => FormValidators.trimInputField(event, 'email', dataUserInfo.form)"
                disabled>
            </li>
            <li class="user-info__content__card">
                <label>{{ t('email') }}:</label>

                <input type="text" v-model="dataUserInfo.form.email" :placeholder="t('email')"
                @input="event => FormValidators.validateEmail(event, 'email', dataUserInfo.form)"
                required disabled>
            </li>
            <li class="user-info__content__card">
                <label>{{ t('phone') }}:</label>

                <input type="number" v-model="dataUserInfo.form.phone_number" :placeholder="t('phone')"  @input="event => limitInputValue(event, 'phone_number')"
                required
                disabled>
            </li>

            <li class="user-info__content__card">
                <label>{{ t('birthday') }}:</label>

                <input type="date" v-model="dataUserInfo.form.birthday" :placeholder="t('birthday')" required disabled>
            </li>
            <li class="user-info__content__card">
                <label>{{ t('role') }}:</label>
                <Select :dataSelect="dataUserInfo.dataSelectRole" />
            </li>
            
            <li class="user-info__content__card">
                <label>{{ t('select_dependence') }}:</label>
                <Select :dataSelect="dataUserInfo.dataSelectDependence" />
            </li>
            <li class="user-info__content__card">
                <label>{{ t('active') }}:</label>
                <input type="checkbox" v-model="dataUserInfo.form.active" :placeholder="t('first_name')" required
                    disabled>
            </li>
        </ul>
        <nav class="user-info__nav">
            <!-- Esto hay que poner una verificación para que cancel deshabilite el modeo de edición -->
            <Button class="user-info__nav__button" :dataButton="dataUserInfo?.dataButtonBack" v-if="dataUserInfo.stateEditForm"/>
            <Button class="user-info__nav__button" :dataButton="dataUserInfo?.dataButtonNext" v-if="dataUserInfo.stateEditForm" />
        </nav>
    </article>
    <ModalAlert :dataModalAlert="dataUserInfo?.dataModalAlert" />
    <ModalConfirmation :dataModalConfirmation="dataUserInfo?.dataModalConfirmation" />
</template>

<script setup lang="ts">

// Import vue library
import {defineAsyncComponent} from 'vue';
import { useI18n } from 'vue-i18n';

// Import components
import Select from '../../atoms/select/Select.atom.vue'
import Button from '../../atoms/button/Button.atom.vue';
import Img from '../../atoms/img/Img.atom.vue';
const ModalAlert = defineAsyncComponent(() => import('../../molecules/modals/alert/ModalAlert.molecule.vue'));
const ModalConfirmation = defineAsyncComponent(() => import('../../molecules/modals/confirmation/ModalConfirmation.molecule.vue'));

// Import services
import FormValidators from '../../../validators/FormValidators';
import hasPermissions from '../../../guards/hasPermissions.guard';

// Define emits and props and their types
const { t } = useI18n();
const props = defineProps(['dataUserInfo']);

// Define variables and constants

// Define functions
const limitInputValue = (event: Event, field: 'phone_number' | 'identification_number') => {
  const target = event.target as HTMLInputElement;
  let value = target.value;
  let maxLength = 10; 

  // Maximum length settings for different fields
  if (field === 'phone_number') {
    maxLength = 15;
  }

  // Specific validation for identification_number
  if (field === 'identification_number') {
    maxLength = 20;
    value = value.toLocaleUpperCase()
    value = value.replace(/[^A-Z0-9]/g, ''); // Allow specific letters, numbers, and characters
    
  }

    // Limit to maximum allowable length
    if (value.length > maxLength) {
    value = value.slice(0, maxLength); 
  }

  target.value = value;
  props.dataUserInfo.form[field] = value;
};

</script>
<style scoped src="./UserInfo.template.scss"></style>
