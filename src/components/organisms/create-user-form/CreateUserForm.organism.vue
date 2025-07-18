<template>
  <section :class="'create-user-form ' + (dataCreateUserForm.stateCreateUser ? '' : 'loading-component')">
    <article class="create-user-form__content">
      <ul class="create-user-form__content__form">
        <li class="create-user-form__content__form__card">
          <select v-model="dataCreateUserForm.data.identification_type" required>
            <option selected value="" disabled>
              {{ t("select_identification_type") }}
            </option>
            <option v-for="(identificationType, i) in dataIdentificationTypes" :key="i"
              :value="identificationType.code"> {{ identificationType.label }}</option>
          </select>
        </li>
        <li class="create-user-form__content__form__card">
          <input type="text" v-model="dataCreateUserForm.data.identification_number"
            :placeholder="t('identification_number')"  
             @input="event => limitInputValue(event, 'identification_number')"
            required />
        </li>

        <li class="create-user-form__content__form__card">
          <input type="text" v-model="dataCreateUserForm.data.first_name" :placeholder="t('name')" 
          @input="event => FormValidators.validateOnlyLetters(event, 'name', dataCreateUserForm.data)"
          @blur="FormValidators.trimInputField($event, 'name', dataCreateUserForm.data)"
          required />
        </li>
        <li class="create-user-form__content__form__card">
          <input type="text" v-model="dataCreateUserForm.data.last_name" :placeholder="t('last_name')" 
          @input="event => FormValidators.validateOnlyLetters(event, 'last_name', dataCreateUserForm.data)"
          @blur="FormValidators.trimInputField($event, 'last_name', dataCreateUserForm.data)"      
          required />
        </li>
        <li class="create-user-form__content__form__card">
          <input type="email" v-model="dataCreateUserForm.data.email" :placeholder="t('email')" 
          @input="event => FormValidators.validateEmail(event, 'email', dataCreateUserForm.data)"
          required />
        </li>
        <li class="create-user-form__content__form__card">
          <input type="number" v-model="dataCreateUserForm.data.phone_number" :placeholder="t('phone_number')" 
          @input="event => limitInputValue(event, 'phone_number')"
          required />
        </li>

        <li class="create-user-form__content__form__card">
          <select v-model="dataCreateUserForm.data.group_name" required>
            <option selected value="" disabled>
              {{ t("select_role") }}
            </option>
            <option v-for="(role, i) in dataRoles" :key="i" :value="role.id"> {{ role.name }}</option>
          </select>
        </li>

        <li class="create-user-form__content__form__card">
          <select v-model="dataCreateUserForm.data.dependence" required>
            <option selected value="" disabled>
              {{ t("select_dependence") }}
            </option>

            <option v-for="dependence in dataDependences" :key="dependence.code" :value=dependence.code> {{
              dependence.name }}</option>
          </select>
        </li>

        <li class="create-user-form__content__form__card">
          <input type="date" v-model="dataCreateUserForm.data.date_of_birth" :placeholder="t('date_of_birth')"
            :max="maxDate" required />
        </li>

        <li class="create-user-form__content__form__card">
          <select v-model="dataCreateUserForm.data.is_active" required>
            <option selected value="" disabled>
              {{ t("state") }}
            </option>
            <option :value="true">{{ t("enabled") }}</option>
            <option :value="false">{{ t("disabled") }}</option>
          </select>
        </li>

      </ul>
    </article>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import LoginService from "../../../services/testService";
import { useI18n } from 'vue-i18n';
import FormValidators from "../../../validators/FormValidators";
const { t } = useI18n();

// is stored in a function
const props: any = defineProps(["dataCreateUserForm", "dataDependences", "dataRoles", "dataIdentificationTypes"]);

const maxDate = new Date().toISOString().split('T')[0];

// A single function is added that implements the appropriate characters for the ID and Phone fields
onMounted(() => {
  if (!props.dataCreateUserForm.data.date_of_birth) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    props.dataCreateUserForm.data.date_of_birth = today;
  }
});
const limitInputValue = (event: Event, field: 'phone_number' | 'identification_number') => {
  const target = event.target as HTMLInputElement;
  let value = target.value;
  let maxLength = 10;

  // Specific validation for identification_number
  if (field === 'identification_number') {
    maxLength = 20;
    value = value.toLocaleUpperCase();
    value = value.replace(/[^A-Z0-9]/g, ''); // Allow specific letters, numbers, and characters
  } else if (field === 'phone_number') {
    maxLength = 15;
  }

  // Limit to maximum allowable length
  if (value.length > maxLength) {
    value = value.slice(0, maxLength);
  }

  target.value = value;
  props.dataCreateUserForm.data[field] = value;
};

</script>
<style scoped src="./CreateUserForm.organism.scss"></style>