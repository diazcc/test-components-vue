<template>
  <article class="template-table-view" v-if="!dataEntities.stateFormEntities">
    <section class="template-table-view__content">
      <header class="template-table-view__header">
        <h1 class="template-table-view__header__title">{{ t('entities') }}</h1>
        <Button v-if="hasPermissions.validator('create_entities')"
          class="template-table-view__header__button" :dataButton="dataEntities.dataButtonNewEntity" />
      </header>
      <section class="template-table-view__list">
        <nav class="template-table-view__list__nav">
          <MultiSelect :dataMultiSelect="dataEntities.dataMultiSelect" @onChange="applyFilters"/>
          <InputSearch :dataInputSearch="dataEntities.dataInputSearch" />
        </nav>
        <table class="table">
          <thead class="table__row table--header">
            <th class="table__row__cell">{{ t('item') }}</th>
            <th class="table__row__cell">{{ t('nit') }}</th>
            <th class="table__row__cell">{{ t('business_name') }}</th>
            <th class="table__row__cell">{{ t('creation_date') }}</th>
            <th class="table__row__cell">{{ t('state') }}</th>
            <th class="table__row__cell">{{ t('actions') }}</th>
          </thead>
          <tbody class="table__row table--only-row loading-component" v-if="dataEntities.stateLoadData">
            <td class="table__row__cell">{{ t('loading') }}</td>
          </tbody>
          <tbody class="table__row table--only-row" v-else-if="dataEntities.list.length < 1">
            <td class="table__row__cell">{{ t('no_results_found') }}</td>
          </tbody>
          <tbody class="table__row" v-else v-for="(data, i) in dataEntities.list">
            <td class="table__row__cell">{{ i+1 }}</td>
            <td class="table__row__cell">{{ data.nit || 'Null'}}</td>
            <td class="table__row__cell table__row__cell--left-align">{{ convertText(data.entity_name) || 'Null' }}</td>
            <td class="table__row__cell">{{ data.date || 'Null' }}</td>
            <td class="table__row__cell">{{ data.active ? t('active') : t('inactive') }}</td>
            <td class="table__row__cell table__row--img">
              <TooltipIcon v-if="dataEntities.dataTooltipIcons[0].show()" :dataTooltipIcon="dataEntities.dataTooltipIcons[0]" @click="dataEntities.dataTooltipIcons[0].onClick({index: data.id})"/>
              <TooltipIcon v-if="dataEntities.dataTooltipIcons[1].show({data: data})" :dataTooltipIcon="dataEntities.dataTooltipIcons[1]" @click="dataEntities.dataTooltipIcons[1].onClick({index: data.id})"/>
            </td>
          </tbody>
        </table>
      </section>
      <Paginator :dataPaginator="dataEntities.dataPaginator"/>
    </section>
  </article>
  <article :class="'entities--form'+(dataEntities.stateResponseLoad ? ' loading-component': '')"
    v-if="dataEntities.stateFormEntities">
    <header class="entities--form__header">
            <h2>
                {{ t('welcome_to_admin_module_entities') }}
            </h2>
        </header>
    <h1 class="entities--form__title">{{t('create_new_entity')}}</h1>
    <ul class="entities--form__content ">
      <li class="entities--form__content__card">
        <input type="text" :placeholder="t('public_name')" @input=" event => validateLowercaseLetters(event, 'publicName')" required
          v-model="dataEntities.form.publicName"
          @blur="FormValidators.trimInputField($event, 'publicName', dataEntities.form)"
          />
      </li>
      <li class="entities--form__content__card">
        <!-- Here we validate with the same email validator, we use the same characters -->
        <input type="text" :placeholder="t('domain')" @input=" event => FormValidators.validateEmail(event,'domain', dataEntities.form)" required
          v-model="dataEntities.form.schemaName" />
      </li>
      <li class="entities--form__content__card">
        <input type="text" :placeholder="t('name_person_responsible')"
         @input=" event => validateNameResponsible(event, 'namePersonResponsible')"
         @blur="FormValidators.trimInputField($event, 'namePersonResponsible', dataEntities.form)"     
        required
        v-model="dataEntities.form.namePersonResponsible" />

      </li>

      <li class="entities--form__content__card">
        <input type="number" :placeholder="t('nit')" required v-model="dataEntities.form.nit" 
        @input="event => limitInputValue(event, 'nit')"  />

        <input type="number" :placeholder="t('DV')" required v-model="dataEntities.form.cdv"
          class="entities--form__content__card__code" min="0" max="10" control="none" @input="validateInput" />

      </li>
      <li class="entities--form__content__card">
        <select v-model="dataEntities.form.typeOfEntity" required>
          <option value="" selected disabled>
            {{t('select_type_of_entity')}}
          </option>
          <option value="001">
            {{t('public')}}
          </option>
          <option value="002">
            {{t('private')}}
          </option>
          <option value="003">
            {{t('mix')}}
          </option>
        </select>
      </li>
      <li class="entities--form__content__card">
        <input type="number" :placeholder="t('phone')" required v-model="dataEntities.form.phone" maxlength="10"
        @input="event => limitInputValue(event, 'phone')" />

      </li>
      <li class="entities--form__content__card">
        <input type="text" :placeholder="t('address')" required v-model="dataEntities.form.address"
        @input=" event => validateLowercaseLetters(event, 'address')"
        @blur="FormValidators.trimInputField($event, 'address', dataEntities.form)" />

      </li>
      <li class="entities--form__content__card">
        <input type="text" :placeholder="t('email')" required v-model="dataEntities.form.email"
        @input=" event => FormValidators.validateEmail(event,'email', dataEntities.form)" />

      </li>
    </ul>
    <nav class="entities--form__nav">
      <Button class="entities--form__nav__button" :dataButton="dataEntities.dataButtonBack" />
      <Button class="entities--form__nav__button" :dataButton="dataEntities.dataButtonNext" />
    </nav>
  </article>
  <ModalAlert :dataModalAlert="dataEntities.dataModalAlert" />
  <ModalConfirmation :dataModalConfirmation="dataEntities.dataModalConfirmation" />
</template>

<script setup lang="ts">

// Import vue library
import { defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

// Import components
import Button from '../../atoms/button/Button.atom.vue';
import Paginator from "../../molecules/paginator/Paginator.molecule.vue";
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import MultiSelect from '../../atoms/multi-select/MultiSelect.atom.vue';
import TooltipIcon from '../../atoms/tooltip-icon/TooltipIcon.atom.vue';
const ModalConfirmation = defineAsyncComponent(() => import('../../molecules/modals/confirmation/ModalConfirmation.molecule.vue'));
const ModalAlert = defineAsyncComponent(() => import('../../molecules/modals/alert/ModalAlert.molecule.vue'));

// Import services
import FormValidators from '../../../validators/FormValidators';
import hasPermissions from '../../../guards/hasPermissions.guard';

const props: any = defineProps(['dataEntities', 'filteredItems']);
const emits = defineEmits(['applyFilters']);
const { t } = useI18n();

const limitInputValue = (event: Event, field: 'phone' | 'nit' ) => {
  const input = event.target as HTMLInputElement;
  let maxLength = 10;

  if (field === 'nit') {
    maxLength = 18;
  } else if (field === 'phone') {
    maxLength = 15; 
  }
  if (input.value.length > maxLength) {
    props.dataEntities.form[field] = input.value.slice(0, maxLength);
  } else {
    props.dataEntities.form[field] = input.value;
  }
};  

const validateLowercaseLetters = (event: Event, field: 'publicName' | 'schemaName' |'address') => {
  const target = event.target as HTMLInputElement;
  let value = target.value.toString(); 
  // value = value.replace(/[^a-zñáéíóúü\s]/g, ''); 
  value = value.replace(/[^a-zA-Zñáéíóúü0-9\s\-_.,&!#]/g, '');
  const cursorPosition = target.selectionStart;
  // Eliminar espacios en blanco al inicio
  value = value.trimStart(); 
  // Actualizar el valor del input y del modelo
  target.value = value;
  props.dataEntities.form[field] = value; 

};

// Responsible name validation, capitalization and spaces are applied,
// using the trimimputvalue function and in conjunction with the blur event
const validateNameResponsible = (event: Event, field: 'namePersonResponsible' ) => {
  const target = event.target as HTMLInputElement;
  let value = target.value.toString(); 
  const cursorPosition = target.selectionStart;
 
  value = value.replace(/[^a-zA-Zñáéíóúü\s]/g, ''); 
  value = value.trimStart(); 
  
  target.value = value;
  props.dataEntities.form[field] = value; 

  if(cursorPosition !== null){
    target.setSelectionRange(cursorPosition, cursorPosition);
  };
};

function convertText(text: any) {
  if (text == null) {
    return '';
  }
  return text.replace(/_/g, ' ').replace(/-/g, ' ').toUpperCase();
};

function validateInput(event: Event) {
  const target = event.target as HTMLInputElement;
  let value = parseInt(target.value);
  if (isNaN(value)) {
    props.dataEntities.form.cdv = null;
    target.value = '';
  } else if (value >= 9) {
    props.dataEntities.form.cdv = 9;
    target.value = '9';
  } else if (value <= 0) {
    props.dataEntities.form.cdv = 0;
    target.value = '0';
  } else {
    props.dataEntities.form.cdv = value;
  }
}

function applyFilters(selectedOptions: Array<{ value: any }>){
  emits("applyFilters", selectedOptions);
};

</script>

<style scoped src="./Entities.template.scss"></style>







