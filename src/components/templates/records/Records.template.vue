<!-- Esta estructura es un estandar y esta style.css -->
<template>
  <article class="template-table-view" v-if="!dataRecords.stateFormRecords">
    <section class="template-table-view__content">
      <header class="template-table-view__header">
        <h1 class="template-table-view__header__title">{{ t('records') }}</h1>
        <Button v-if="hasPermissions.validator('create_records')" 
          class="template-table-view__header__button" :dataButton="dataRecords.dataButtonNewRecord" />
      </header>
      <section class="template-table-view__list">
        <nav class="template-table-view__list__nav">
          <!-- Temporary solution -->
          <p class="white">This is a filter</p> 
          <InputSearch :dataInputSearch="dataRecords.dataInputSearch" />
        </nav>
        <table class="table" @scroll="UtilsServices.handleScroll(dataResults)">
          <thead class="table__row table--header">
            <th class="table__row__cell table__row__cell--header">{{ t('item') }}</th>
            <th class="table__row__cell table__row__cell--header">
              {{ t('record_number') }}
              <img :class="(dataRecords.dataFilters[0].isOpen ? 'img-rotate ' : ' ') + (dataRecords.dataFilters[0].isActive ? ' img-active' : '')" 
                    src="/filters/icon-filter-open.svg" alt="no_data" @click="dataRecords.openFilter(0)" />
              <Filter @emitOrderSignal="orderFilter" @emitFilterSignal="filterSignal" class="table__row__cell__filter" :dataFilter="dataRecords.dataFilters[0]"/>
            </th>
            <th class="table__row__cell table__row__cell--header">
              {{ t('record_name') }}
              <img :class="(dataRecords.dataFilters[1].isOpen ? 'img-rotate ' : ' ') + (dataRecords.dataFilters[1].isActive ? ' img-active' : '')" 
                    src="/filters/icon-filter-open.svg" alt="no_data" @click="dataRecords.openFilter(1)" />
              <Filter @emitOrderSignal="orderFilter" @emitFilterSignal="filterSignal" class="table__row__cell__filter" :dataFilter="dataRecords.dataFilters[1]"/>
            </th>
            <th class="table__row__cell table__row__cell--header">
              {{ t('record_creation_type') }}
              <img :class="(dataRecords.dataFilters[2].isOpen ? 'img-rotate ' : ' ') + (dataRecords.dataFilters[2].isActive ? ' img-active' : '')" 
                    src="/filters/icon-filter-open.svg" alt="no_data" @click="dataRecords.openFilter(2)" />
              <Filter @emitOrderSignal="orderFilter" @emitFilterSignal="filterSignal" class="table__row__cell__filter" :dataFilter="dataRecords.dataFilters[2]"/>
            </th>
            <th class="table__row__cell table__row__cell--header">
              {{ t('creation_date') }}
              <img :class="(dataRecords.dataFilters[3].isOpen ? 'img-rotate ' : ' ') + (dataRecords.dataFilters[3].isActive ? ' img-active' : '')" 
                    src="/filters/icon-filter-open.svg" alt="no_data" @click="dataRecords.openFilter(3)" />
              <Filter @emitOrderSignal="orderFilter" @emitFilterSignal="filterSignal" class="table__row__cell__filter" :dataFilter="dataRecords.dataFilters[3]"/>
            </th>
            <th class="table__row__cell table__row__cell--header">{{ t('actions') }}</th>
          </thead>
          <tbody class="table__row table--only-row  loading-component"
            v-if="dataRecords?.stateLoadData">
            <td class="table__row__cell">{{ t('loading') }}</td>
          </tbody>
          <tbody class="table__row table--only-row"
            v-else-if="dataResults.length < 1">
            <td class="table__row__cell">{{ t('no_records') }}</td>
          </tbody>
          <tbody class="table__row" v-else v-for="(data, index) in dataResults">
            <td class="table__row__cell">{{ index + 1 }}</td>
            <td class="table__row__cell">{{ data?.data.code || t('does_not_have') }}</td>
            <td class="table__row__cell table__row__cell--left-align">{{ data?.data.name || t('does_not_have') }}</td>
            <td class="table__row__cell table__row__cell--left-align">{{ t(data?.created_mode) }}</td>
            <td class="table__row__cell">{{ extractDateFromString(data?.data.created_at) || t('does_not_have') }}</td>
            <td class="table__row__cell table__row--img">
              <TooltipIcon v-if="dataRecords.dataTooltipIcons[0].show({data: data.user_actions})" :dataTooltipIcon="dataRecords.dataTooltipIcons[0]" @click="dataRecords.dataTooltipIcons[0].onClick({data: data})"/>
              <TooltipIcon v-if="dataRecords.dataTooltipIcons[1].show({data: data.user_actions})" :dataTooltipIcon="dataRecords.dataTooltipIcons[1]" @click="dataRecords.dataTooltipIcons[1].onClick({data: data})"/>
            </td>
          </tbody>
        </table>
      </section>
      <Paginator :dataPaginator="dataRecords.dataPaginator" />
    </section>
  </article>
  <article :class="'records--form' + (dataRecords.stateResponseLoad ? ' loading-component' : '')"
    v-if="dataRecords.stateFormRecords">
    <header class="records--form__header">
      <h1>
        {{ t('welcome_to_file_module_record') }}
      </h1>
    </header>
    <h1 class="records--form__title">{{ t('create_new_record') }}</h1>
    <ul class="records--form__content ">
      <li class="records--form__content__card">
        <InputTextAtom :data-input="dataRecords.dataInputName" required />
      </li>
      <li class="records--form__content__card">
        <SelectAtom :dataSelect="dataRecords.dataSelectSerie" required />
      </li>
      <li class="records--form__content__card">
        <SelectAtom :dataSelect="dataRecords.dataSelectSubserie" required />
      </li>
      <li class="records--form__content__card">
        <InputFilesMolecule :data-input-files="dataRecords.dataInputFiles" @emitDocSelected="emitDocSelected" />
      </li>
      <!--

      
       <li class="records--form__content__card">
        <textarea class="input input--form" :placeholder="t('observation')" required
          v-model="dataRecords.form.observations"></textarea>
      </li> 


        is not be used temporaly
      -->
    </ul>
    <nav class="records--form__nav">
      <Button class="records--form__nav__button" :dataButton="dataRecords.dataButtonBack" />
      <Button class="records--form__nav__button" :dataButton="dataRecords.dataButtonNext" />
    </nav>
  </article>
  <ModalAlert :dataModalAlert="dataRecords.dataModalAlert" />
  <ModalConfirmation :dataModalConfirmation="dataRecords.dataModalConfirmation" />
  <ModalPdfViewer :dataModalPdfViewer="dataRecords.dataModalPdfViewer" />
  <ModalListDocuments :dataModalListDocuments="dataRecords.dataModalListDocuments"
    @emitDocSelected="emitDocRecordSelected" />

</template>

<script setup lang="ts">

// Import vue libraries
import { defineAsyncComponent, onMounted, onUnmounted, Ref, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Import components
import Button from '../../atoms/button/Button.atom.vue';
import Paginator from "../../molecules/paginator/Paginator.molecule.vue";
import SelectAtom from '../../atoms/select/Select.atom.vue';
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import InputTextAtom from '../../atoms/input/InputText.atom.vue';
import InputFilesMolecule from '../../molecules/input-files/InputFiles.molecule.vue';
import Filter from '../../molecules/filter/Filter.molecule.vue';
import TooltipIcon from '../../atoms/tooltip-icon/TooltipIcon.atom.vue';
const ModalAlert = defineAsyncComponent(() => import('../../molecules/modals/alert/ModalAlert.molecule.vue'));
const ModalConfirmation = defineAsyncComponent(() => import('../../molecules/modals/confirmation/ModalConfirmation.molecule.vue'));
const ModalPdfViewer = defineAsyncComponent(() => import('../../molecules/modals/modal-pdf-viewer/ModalPdfViewer.molecule.vue'));
const ModalListDocuments = defineAsyncComponent(() => import('../../molecules/modals/list-documents/ModalListDocuments.molecule.vue'));

// Import services
import UtilsServices from '../../../services/UtilsServices';
import hasPermissions from '../../../guards/hasPermissions.guard';

// Define props and emits and configuration
const props: any = defineProps(['dataRecords', 'filteredItems']);
const emits: any = defineEmits(['emitDocSelected', 'emitDocRecordSelected'])
const { t } = useI18n();

//Define constants and variables
const selectedFilter = ref('');
const dataResults: Ref<any> = ref([]);

// Define functions and methods
onMounted(async () => {
  document.addEventListener("click", outSideArea);
});

onUnmounted(() => {
  document.removeEventListener("click", outSideArea);
});

const outSideArea = (event: any) => {
  if (!event.target.closest('.table__row__cell__menu')) {
    closeMenus();
  }
};

const closeMenus = () => {
  for (const data of dataResults.value) {
    data.isMenuOpen = false;
  }
};

function emitDocSelected(file: any) {
  emits("emitDocSelected", file);
}
function emitDocRecordSelected(file: any) {
  emits("emitDocRecordSelected", file);
}

function resetValues() {
  dataResults.value = props.dataRecords.list.map((data:any) => {
      return {
        ...data,
        created_mode: data.type === "record" ? t('created_by_filing') : t('internally_created'),
      }
    });
}

watch(() => props.dataRecords.list,
  (filings: any) => {
    resetValues();
    creatingOptionsForFilters();
  }
)

function extractDateFromString(dateTimeString: string): string {
  const date = new Date(dateTimeString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

function findProperty(index: any) {
  let property: any;;
  switch (index) {
    case 0:
      property = 'data.code';
      break;
    case 1:
      property = 'data.name';
      break;
    case 2:
      property = 'created_mode';
      break;
    case 3:
      property = 'data.created_at';
      break;
    default:
      property = '';
      break;
  }
  return property;
}

function orderFilter(reverse: boolean, index: number) {
  let typeOfOrder: any = reverse ? 'desc' : 'asc';
  let property = findProperty(index);
  dataResults.value = UtilsServices.sortArrayOfObjectsByProperty(dataResults.value, property, typeOfOrder)
};

function filterSignal() {
  resetValues();
  props.dataRecords.dataFilters.forEach((filter: any, index: any) => {
    if(filter.isActive) {
      let dataFilter: any = filter.options.filter((option: any) => option.checked).map((option: any) => option.text);
      if(dataFilter.length > 0) {
        let property = findProperty(index);
        dataResults.value = UtilsServices.sortArrayOfObjectsByMultipleValuesFilteredByProperty(dataResults.value, dataFilter, property);
      } else {
        filter.isActive = false;
      }
    }
  });
};

async function creatingOptionsForFilters() {
  [0, 1, 2, 3].forEach((index: any) => UtilsServices.creatingOptionsForFilters(dataResults.value, findProperty(index))
      .then((element) => {
        props.dataRecords.dataFilters[index].options = element;
      })
  );
}

</script>

<style scoped src="./Records.template.scss"></style>