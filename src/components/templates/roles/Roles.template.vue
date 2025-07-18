<template>
  <article class="template-table-view">
    <section class="template-table-view__content">
      <header class="template-table-view__header">
        <h1 class="template-table-view__header__title">{{ t('roles') }}</h1>
        <Button v-if="hasPermissions.validator('create_roles')" 
          class="template-table-view__header__button" :dataButton="dataRole.dataButtonNewRole" />
      </header>
      <section class="template-table-view__list">
        <nav class="template-table-view__list__nav">
          <MultiSelect :dataMultiSelect="dataRole.dataMultiSelect" @onChange="applyFilters"/>
          <InputSearch :dataInputSearch="dataRole.dataInputSearch" />
        </nav>
        <table class="table">
          <thead class="table__row table--header">
            <th class="table__row__cell">{{ t('item') }}</th>
            <th class="table__row__cell">{{ t('name') }}</th>
            <th class="table__row__cell">{{ t('creation_date') }}</th>
            <th class="table__row__cell">{{ t('actions') }}</th>
          </thead>
          <tbody class="table__row table--only-row loading-component" v-if="dataRole.stateLoadData">
            <td class="table__row__cell">{{ t('loading') }}</td>
          </tbody>
          <tbody class="table__row table--only-row" v-else-if="dataRole.list.length < 1">
            <td class="table__row__cell">{{ t('no_results_found') }}</td>
          </tbody>
          <tbody class="table__row" v-else v-for="(role, indexRol) in dataRole.list">
            <td class="table__row__cell">{{ indexRol + 1 }}</td>
            <td class="table__row__cell table__row__cell--left-align">{{ role.name || 'Null' }}</td>
            <td class="table__row__cell">{{ role.date }}</td>
            <td class="table__row__cell table__row--img">
              <TooltipIcon v-if="dataRole.dataTooltipIcons[0].show()" :dataTooltipIcon="dataRole.dataTooltipIcons[0]" @click="dataRole.dataTooltipIcons[0].onClick({data: role, index: indexRol})"/>
              <TooltipIcon v-if="dataRole.dataTooltipIcons[1].show({data: role})" :dataTooltipIcon="dataRole.dataTooltipIcons[1]" @click="dataRole.dataTooltipIcons[1].onClick({data: role, index: role.id})"/>
            </td>
          </tbody>
        </table>
      </section>
      <Paginator :dataPaginator="dataRole.dataPaginator"/>
    </section>
  </article>
  <ModalAlert :dataModalAlert="dataRole.dataModalAlert" />
  <ModalConfirmation :dataModalConfirmation="dataRole.dataModalConfirmation" />
</template>

<script setup lang="ts">

// Import vue library
import { defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

// Import components
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import Button from "../../atoms/button/Button.atom.vue";
import MultiSelect from '../../atoms/multi-select/MultiSelect.atom.vue';
import Paginator from '../../molecules/paginator/Paginator.molecule.vue';
import TooltipIcon from '../../atoms/tooltip-icon/TooltipIcon.atom.vue';
const ModalConfirmation = defineAsyncComponent(() => import('../../molecules/modals/confirmation/ModalConfirmation.molecule.vue'));
const ModalAlert = defineAsyncComponent(() => import('../../molecules/modals/alert/ModalAlert.molecule.vue'));

// Import services
import hasPermissions from '../../../guards/hasPermissions.guard';

// Define props and emits and their types
const { t } = useI18n();
const emits = defineEmits(['applyFilters']);
defineProps(["dataRole"]);

// Define variables and states

// Define functions

function applyFilters(selectedOptions: Array<{ value: any }>){
    emits("applyFilters", selectedOptions);
}

</script>

<style scoped lang="scss" src="./Roles.template.scss"></style>