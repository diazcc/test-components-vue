<template >
    <section class="table-profile">
        <nav class="table-profile__nav-options">
            <select v-model="selectedFilter" class="table-profile__nav-options__select">
                <option value="" selected disabled>{{t('quick_actions')}}</option>
                <option value="all">{{t('all')}}</option>
                <option value="finaliced">{{t('status_completed')}}</option>
                <option value="process">{{t('status_in_process')}}</option>
                <option value="radicated">{{t('status_filing')}}</option>
            </select>
            <InputSearch :dataInputSearch="dataTableProfile.dataInputSearch"/>
        </nav>
        <div class="flex-table" >
            <div class="flex-table__header">
                <div class="flex-table__header__cell">{{t('profile_name')}}</div>
                <div class="flex-table__header__cell">{{t('email')}}</div>
                <div class="flex-table__header__cell">{{t('first_name')}}</div>
                <div class="flex-table__header__cell">{{t('last_name')}}</div>

               
            </div>
            <div class="flex-table__row " v-if="dataTableProfile.data.length<1">
              <div class="flex-table__row__cell loading-component"></div>
              <div class="flex-table__row__cell loading-component"></div>
              <div class="flex-table__row__cell loading-component"></div>
              <div class="flex-table__row__cell loading-component"></div>


            </div>

            <div v-else class="flex-table__row" v-for="data in dataTableProfile.data" :key="data.id">
                <div class="flex-table__row__cell">{{ data?.profile_name }}</div>
                <div class="flex-table__row__cell">{{ data?.user.email }}</div>
                <div class="flex-table__row__cell">{{ data?.user.first_name }}</div>
                <div class="flex-table__row__cell">{{ data?.user.last_name }}</div>

                </div>
        </div>
    </section>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import InputSearch from "../../molecules/input-search/InputSearch.molecule.vue";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const router = useRouter();
const props = defineProps(["dataTableProfile"]);
const selectedFilter = ref("");


// Método para filtrar por estado
const filteredData = computed(() => {
  if (!selectedFilter.value || selectedFilter.value == "all") {
    return props.dataTableProfile.data;
  } else {
    return props.dataTableProfile.data.filter((item: any) => {
      if (selectedFilter.value === "finaliced") {
        return item.state === "finaliced";
      } else if (selectedFilter.value === "process") {
        return item.state === "process";
      } else if (selectedFilter.value === "radicated") {
        return item.state === "radicated";
      } else if (selectedFilter.value === "rdPerson") {
        return (
          item.remitter !== null &&
          item.remitter.person_type.label === "Radicacion persona"
        );
      } else if (selectedFilter.value === "Radicación anónimo") {
        return item.type_of_filing?.label === "Radicación anónimo";
      }
      return false; // Si no coincide con ninguna opción, no se filtra nada
    });
  }
});

</script>


<style scoped src="./TableProfile.organism.scss"></style>