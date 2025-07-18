<template>
  <article class="template-table-view" v-if="!dataTypeFiling.stateFormTypeFiling">
    <section class="template-table-view__content">
      <header class="template-table-view__header">
        <h1 class="template-table-view__header__title">{{ t('type_filing') }}</h1>
        <Button v-if="hasPermissions.validator('create_type_of_filing')"
          class="template-table-view__header__button" :dataButton="dataTypeFiling.dataButtonNewTypeFiling" />
      </header>
      <section class="template-table-view__list">
        <nav class="template-table-view__list__nav">
          <MultiSelect :dataMultiSelect="dataTypeFiling.dataMultiSelect" @onChange="applyFilters"/>
          <InputSearch :dataInputSearch="dataTypeFiling.dataInputSearch" />
        </nav>
        <table class="table">
          <thead class="table__row table--header">
            <th class="table__row__cell">{{ t('item') }}</th> 
            <th class="table__row__cell">{{ t('code') }}</th>
            <th class="table__row__cell">{{ t('name') }}</th>
            <th class="table__row__cell"
              v-if="hasPermissions.validator('update_type_of_filing') || hasPermissions.validator('delete_type_of_filing')">
              {{ t('actions') }}
            </th>
          </thead>
          <tbody class="table__row table--only-row loading-component" v-if="dataTypeFiling.stateLoadData">
            <td class="table__row__cell">{{ t('loading') }}</td>
          </tbody>
          <tbody class="table__row table--only-row" v-else-if="dataTypeFiling.list.length < 1">
            <td class="table__row__cell">{{ t('no_results_found') }}</td>
          </tbody>
          <tbody class="table__row" v-else v-for="(typefiling, index) in dataTypeFiling.list"
            @click="dataTypeFiling.getTypeFiling(typefiling.id)">
            <td class="table__row__cell">{{ index+1 }}</td>
            <td class="table__row__cell">{{ typefiling.code || 'N/A' }}</td>
            <td class="table__row__cell table__row__cell--left-align">{{ typefiling.name || 'N/A' }}</td>
            <td class="table__row__cell table__row--img"
              v-if="hasPermissions.validator('update_type_of_filing') || hasPermissions.validator('delete_type_of_filing')">
              <TooltipIcon v-if="dataTypeFiling.dataTooltipIcons[0].show(typefiling)" :dataTooltipIcon="dataTypeFiling.dataTooltipIcons[0]" @click="dataTypeFiling.dataTooltipIcons[0].onClick({data: typefiling})"/>
              <TooltipIcon v-if="dataTypeFiling.dataTooltipIcons[1].show(typefiling)" :dataTooltipIcon="dataTypeFiling.dataTooltipIcons[1]" @click="dataTypeFiling.dataTooltipIcons[1].onClick({data: typefiling})"/>  
            </td>
          </tbody>
        </table>
      </section>
      <Paginator :dataPaginator="dataTypeFiling.dataPaginator"/>
    </section>
  </article>

  <article :class="'type-filing--form' + (dataTypeFiling.stateResponseLoad ? ' loading-component' : '')" v-else>
    <header class="type-filing--form__header">
      <h2>
          {{ t('welcome_to_admin_module_type_of_filing') }}
      </h2>
    </header>
    <h1 class="type-filing--form__title">{{ t('create_type_filing') }}</h1>
    <ul class="type-filing--form__content ">
      <li class="type-filing--form__content__card">
        <input type="number" :placeholder="t('code')" required
          v-model="dataTypeFiling.form.code" />
      </li>
      <li class="type-filing--form__content__card">
        <input type="text" :placeholder="t('name')" required v-model="dataTypeFiling.form.name" />
      </li>
    </ul>
    <nav class="type-filing--form__nav">
      <Button class="type-filing--form__nav__button" :dataButton="dataTypeFiling.dataButtonBack" />
      <Button class="type-filing--form__nav__button" :dataButton="dataTypeFiling.dataButtonNext" />
    </nav>
  </article>
  <ModalAlert :dataModalAlert="dataTypeFiling.dataModalAlert" />
  <ModalConfirmation :dataModalConfirmation="dataTypeFiling.dataModalConfirmation" />
</template>

<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import ModalAlert from '../../molecules/modals/alert/ModalAlert.molecule.vue';
import ModalConfirmation from '../../molecules/modals/confirmation/ModalConfirmation.molecule.vue';
import Button from "../../atoms/button/Button.atom.vue";
import Paginator from '../../molecules/paginator/Paginator.molecule.vue';
import MultiSelect from '../../atoms/multi-select/MultiSelect.atom.vue';
import TooltipIcon from '../../atoms/tooltip-icon/TooltipIcon.atom.vue';
import hasPermissions from '../../../guards/hasPermissions.guard';

const { t } = useI18n();
const props: any = defineProps(["dataTypeFiling"]);
const emits = defineEmits(['applyFilters']);

function applyFilters(selectedOptions: Array<{ value: any }>){
    emits("applyFilters", selectedOptions);
}

</script>

<style scoped lang="scss" src="./TypeFiling.template.scss"></style>