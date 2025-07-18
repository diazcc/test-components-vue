<template>
  <section class="card-information-filing">
    <article class="card-information-filing__card">
      <p class="card-information-filing__card__label">{{ t('information_filing') }}</p>
      <ul class="card-information-filing__card__list">
        <li class="card-information-filing__card__list__card">
          <h3 class="card-information-filing__card__list__card__label">{{t('subject')}}:</h3>
          <p class="card-information-filing__card__list__card__value">{{dataCardInformationFiling?.dataFiling?.subject ?? null}}</p>
        </li>
        <li class="card-information-filing__card__list__card">
          <h3 class="card-information-filing__card__list__card__label">{{t('type_of_filing')}}:</h3>
          <p class="card-information-filing__card__list__card__value">{{dataCardInformationFiling?.dataFiling?.type_of_filing?.name ?? null}}</p>
        </li>
        <li class="card-information-filing__card__list__card">
          <h3 class="card-information-filing__card__list__card__label">{{t('email')}}:</h3>
          <p class="card-information-filing__card__list__card__value">{{dataCardInformationFiling?.dataFiling?.remitter?.email ?? null}}</p>
        </li>
        <li class="card-information-filing__card__list__card">
          <h3 class="card-information-filing__card__list__card__label">{{t('filing_code')}}:</h3>
          <p class="card-information-filing__card__list__card__value">{{dataCardInformationFiling?.dataFiling?.filing_code ?? null}}</p>
        </li>
        <li class="card-information-filing__card__list__card">
          <h3 class="card-information-filing__card__list__card__label">{{t('creation_date')}}:</h3>
          <p class="card-information-filing__card__list__card__value">{{dataCardInformationFiling?.dataFiling?.filing_date ?? null}}</p>
        </li>
        <li class="card-information-filing__card__list__card">
          <h3 class="card-information-filing__card__list__card__label">{{t('status')}}:</h3>
          <p class="card-information-filing__card__list__card__value">{{
            t(dataCardInformationFiling?.status_display?.label) ?? null
        }}</p>
        </li>
      </ul>
    </article>
    <article class="card-information-filing__card">
      <p class="card-information-filing__card__label">{{ t('information_remitter') }}</p>
      <ul class="card-information-filing__card__list">
        <li class="card-information-filing__card__list__card">
          <h3 class="card-information-filing__card__list__card__label">{{t('name')}}:</h3>
          <p class="card-information-filing__card__list__card__value">Juan Pérez Gómez</p>
        </li>
        <li class="card-information-filing__card__list__card">
          <h3 class="card-information-filing__card__list__card__label">{{t('email')}}:</h3>
          <p class="card-information-filing__card__list__card__value">juan.perez@email.com</p>
        </li>
        <li class="card-information-filing__card__list__card">
          <h3 class="card-information-filing__card__list__card__label">{{t('identification_number')}}:</h3>
          <p class="card-information-filing__card__list__card__value">123456789</p>
        </li>
        <li class="card-information-filing__card__list__card">
          <h3 class="card-information-filing__card__list__card__label">{{t('identification_type')}}:</h3>
          <p class="card-information-filing__card__list__card__value">Cédula de ciudadanía</p>
        </li>
        <li class="card-information-filing__card__list__card">
          <h3 class="card-information-filing__card__list__card__label">{{t('nit')}}:</h3>
          <p class="card-information-filing__card__list__card__value">900123456-7</p>
        </li>
      </ul>
    </article>
    <article class="card-information-filing__card">
      <p class="card-information-filing__card__label">{{t('documents')}}</p>
      <ul class="card-information-filing__card__list">
        <li class="card-information-filing__card__list__card" v-for="(document, index) in dataCardInformationFiling?.dataFiling?.documents" :key="index">
          <p class="card-information-filing__card__list__card__value card-information-filing__card__list__card__value--left">{{document.name}}</p>
      <button class="card-information-filing__card__list__card__saw">
        <img  src="/Buttons/icon-saw-blue.svg" alt="Ver documento" @click="dataCardInformationFiling?.openFile(document?.url)" />
      
      </button>
          
        </li>
      </ul>
    </article>
  </section>
</template>
<script setup lang="ts">

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props :any = defineProps(['dataCardInformationFiling']);
</script>
<style scoped src="./CardInformationFiling.molecule.scss"></style>
