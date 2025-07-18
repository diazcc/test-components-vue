<template >
    <section class="table-user">
        <nav class="table-user__nav-options">
            <MultiSelect :dataMultiSelect="dataTableUser.dataMultiSelect" @onChange="applyFilters"/>
            <InputSearch :dataInputSearch="dataTableUser.dataInputSearch"/>
        </nav>
        <table class="table">
            <thead class="table__row table--header">
                <th class="table__row__cell">{{t('item')}}</th>
                <th class="table__row__cell">{{t('identification_number')}}</th>
                <th class="table__row__cell">{{t('first_name')}}</th>
                <th class="table__row__cell">{{t('last_name')}}</th>
                <th class="table__row__cell">{{t('email')}}</th>
                <th class="table__row__cell">{{t('date_of_birth')}}</th>
                <th class="table__row__cell">{{t('dependence')}}</th>
                <th class="table__row__cell">{{t('role')}}</th>
                <th class="table__row__cell">{{t('state')}}</th>
                <th class="table__row__cell">{{t('registered')}}</th>
                <th class="table__row__cell">{{t('actions')}}</th>
            </thead>
            <tbody class="table__row table--only-row loading-component" v-if="dataTableUser.stateLoadData">
                <td class="table__row__cell">{{ t('loading') }}</td>
            </tbody>
            <tbody class="table__row table--only-row" v-else-if="dataTableUser.data.length < 1">
                <td class="table__row__cell">{{ t('no_results_found') }}</td>
            </tbody>
            <tbody class="table__row" v-else v-for="(data, index) in dataTableUser.data" :key="data.id">
                <td class="table__row__cell">{{ index+1 }}</td>  
                <td class="table__row__cell">{{ data?.identification_number }}</td>
                <td class="table__row__cell table__row__cell--left-align">{{ data?.first_name }}</td>
                <td class="table__row__cell table__row__cell--left-align">{{ data?.last_name }}</td>
                <td class="table__row__cell table__row__cell--left-align">{{ data?.email }}</td>
                <td class="table__row__cell">{{ data?.date_of_birth }}</td>
                <td class="table__row__cell table__row__cell--left-align">{{ data?.dependence ? data.dependence.name : 'N/A' }}</td>
                <td class="table__row__cell table__row__cell--left-align">{{ data?.role ? data.role.name : 'N/A' }}</td>
                <td class="table__row__cell">
                  <select 
                    v-model="data.is_active" 
                    @click.stop 
                    @change="(event) => handleStatusChange(event, data.id)"
                    class="table__select"
                  >
                    <option :value="true">{{ t("enabled") }}</option>
                    <option :value="false">{{ t("disabled") }}</option>
                  </select>
                </td>
                <td class="table__row__cell">{{ data?.is_active ? t("registered") : t("unregistered")}}</td>
                <td class="table__row__cell table__row--img">
                  <TooltipIcon v-if="dataTableUser.dataTooltipIcons[0].show(data)" :dataTooltipIcon="dataTableUser.dataTooltipIcons[0]" @click.stop="dataTableUser.dataTooltipIcons[0].onClick({data: data, index: index})"/>
                  <TooltipIcon v-if="dataTableUser.dataTooltipIcons[1].show(data)" :dataTooltipIcon="dataTableUser.dataTooltipIcons[1]" @click.stop="dataTableUser.dataTooltipIcons[1].onClick({index: data?.id})"/>
                </td>
            </tbody>
        </table>
    </section>
</template>
<script setup lang="ts">

// Import vue library
import { useI18n } from 'vue-i18n';

// Import components
import InputSearch from "../../molecules/input-search/InputSearch.molecule.vue";
import MultiSelect from '../../atoms/multi-select/MultiSelect.atom.vue';
import TooltipIcon from "../../atoms/tooltip-icon/TooltipIcon.atom.vue";

// Import services
import UserServices from '../../../services/UserServices';
import hasPermissions from '../../../guards/hasPermissions.guard';

// Define props and emits and their types
const { t } = useI18n();
const props = defineProps(["dataTableUser"]);
const emits = defineEmits(['applyFilters']);

// Define Functions
function applyFilters(selectedOptions: Array<{ value: any }>){
    emits("applyFilters", selectedOptions);
}

const handleStatusChange = async (event: Event, userId: number) => {
  const target = event.target as HTMLSelectElement;
  if (target && hasPermissions.validator('change_stare_users')) {
    try {
      await UserServices.updateUserStatus(userId, target.value === 'true');
    } catch (error) {
      console.error(`Error al actualizar el estado del usuario ${userId}:`, error);
      // Here you could add error handling, such as displaying a notification
    }
  }
};

</script>

<style scoped src="./TableUser.organism.scss"></style>