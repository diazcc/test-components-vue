<!--
  TODO COMPONENT TYPEFILING RECEIVED PAGE
  ?This component has all logic and develop of correspondence on only section 'received'.
-->

<template>
  <TypeFilingsTemplate :dataTypeFiling="dataTypeFiling" @applyFilters="applyFilters"/>
</template>

<script setup lang="ts">

import { onMounted, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import TypeFilingsTemplate from '../../templates/type-filing/TypeFiling.template.vue';
import TypeFilingServices from '../../../services/TypeFilingServices.ts';
import FormValidators from '../../../validators/FormValidators.ts';
import UtilsServices from '../../../services/UtilsServices.ts';
import hasPermissions from '../../../guards/hasPermissions.guard.ts';

const { t } = useI18n();

const filters: any = ref([
    'Filtro 1',
    'Filtro 2',
    'Filtro 3',
]);

const dataTypeFiling: any = reactive({
  stateFormTypeFiling: false,
  stateResponse: false,
  stateResponseLoad: false,
  stateLoadData: false,
  filterSelected: '',
  list: [],
  form: {
    code: '',
    name: '',
  },
  dataButtonNewTypeFiling: {
    className: 'blue',
    text: 'new',
    alt: 'new',
    url: '/Buttons/icon-add.svg',
    reverse: true,
    disabled: false,
    onClick: () => { setFormCreateTypeFiling(); }
  },
  dataButtonNext: {
    className: 'blue',
    text: 'create',
    alt: 'create',
    url: '/Buttons/icon-create.svg',
    iconSize: 'large',
    reverse: true,
    disabled: false,
    onClick: () => { createNewTypeFiling()  }
  },
  dataButtonBack: {
    className: '',
    text: 'back',
    alt: 'left-arrow',
    url: '/Buttons/left-arrow.svg',
    reverse: false,
    disabled: false,
    onClick: () => { refreshData() }
  },
  dataModalAlert: {
    isActive: '',
    dataButton: {
      className: '',
      text: 'close',
      disabled: false,
      onClick: () => { closeModalAlert() }
    },
    dataText: {
      classText: '',
      text: '',
      disabled: false,
      onClick: () => { }
    }
  },
  dataModalConfirmation: {
    isActive: '',
    dataButton: {
      className: 'blue',
      text: 'continue',
      disabled: false,
      onClick: () => { closeModalConfirmation() }
    },
    dataText: {
      classText: '',
      text: '',
      disabled: false,
      onClick: () => { }
    }
  },
  dataTableTypeFiling: {
    data: [],
    
    dataImg: {
      id: '',
      name: '',
      class: 'icon',
      src: '/delete.svg',
      type: 'png',
      alt: '',
      isActive: () => { }, // optional, currently used to add activate and deactivate the active class
      onClick: () => { }
    },
  },
  dataInputSearch: {
    dataInput: {
      id: '',
      name: '',
      classInputEmail: '',
      model: '',
      type: '',
      placeholder: 'search',
      disabled: false,
      required: false,
      onClick: () => { },
      onChange: (value:any) => {
        getTypeFiling(value, 1)
      },
    },
    dataImg: {
      id: '',
      name: '',
      class: ' icon',
      src: '/icon-lupa-general.svg',
      type: '',
      alt: '',
      onClick: () => { }
    }
  },
  dataPaginator: {
    page: 1,
    page_size: 10,
    total_pages: '',
    pagination_options: [
      {
        number: 10,
        active: false
      },
      {
        number: 20,
        active: false
      },
      {
        number: 30,
        active: false
      },
      {
        number: 50,
        active: false
      },
    ],
    getService: (value:any) => {
      getTypeFiling(dataTypeFiling.dataInputSearch.dataInput.model, value)
    }
  },
  dataMultiSelect: {
    title: "filters",
    model: [],
    options: filters.value.map((value: any) => ({
      text: value,
      value: value,
      checked: false
    }))
  },
  dataTooltipIcons: [
    {
        text: UtilsServices.capitalizeFirstLetter(`${t("delete")} ${t("type_of_filing")}`),
        src: '/Buttons/icon-delete.svg',
        color: 'red',
        alt: 'delete',
        show: (data: any) => { return hasPermissions.validator('delete_type_of_filing') && data?.delete; },
        onClick: ({data = {id: 1}}) => { dataTypeFiling.eliminateTypeFiling(data?.id) },
    },
    {
        text: UtilsServices.capitalizeFirstLetter(`${t("edit")} ${t("type_of_filing")}`),
        src: '/Buttons/icon-edit.svg',
        color: 'blue',
        alt: 'edit',
        show: (data: any) => { return hasPermissions.validator('update_type_of_filing') },
        onClick: ({data = {id: 1}}) => { dataTypeFiling.updateTypeOfFiling(data?.id) },
    },
  ],
  getTypeFiling: (id: string | number) => { redirectToTypeFiling(id) },
  eliminateTypeFiling: (id: number) => { eliminateTypeFiling(id) },
  updateTypeOfFiling: (id: any) => {
    console.log("updateTypeOfFiling in construction", id);
  },
})

/**
 * todo  -------------------------- FUNCTIONS --------------------------
 */

onMounted(() => {
  getTypeFiling("", 1);
});

watch(() => dataTypeFiling.dataPaginator.page_size, () => {
  getTypeFiling(dataTypeFiling.dataInputSearch.dataInput.model, 1);
});

// Idea for filtering without using the backend
// const filteredItems = computed(() => {
//   return dataTypeFiling.list.filter((item: any) => {
//     const matchesSearch = item.name.toLowerCase().includes(dataTypeFiling.dataInputSearch.dataInput.model.toLowerCase());
//     const matchesFilter = dataTypeFiling.filterSelected === '' || item.active.toString() === dataTypeFiling.filterSelected;
//     return matchesSearch && matchesFilter;
//   });
// });

function getTypeFiling(searched_value:any, page:any) {
  dataTypeFiling.list = [];
  dataTypeFiling.stateLoadData = true;
  TypeFilingServices.getAllTypesFiling(searched_value, page, dataTypeFiling.dataPaginator.page_size)
    .then((response: any) => {
      dataTypeFiling.dataPaginator.page = page
      dataTypeFiling.dataPaginator.total_pages = response.total_pages
      dataTypeFiling.list = response.results;
      dataTypeFiling.stateLoadData = false;
    })
    .catch((error: any) => {
      console.error(error);
      dataTypeFiling.stateLoadData = false;
      openModalAlert('something_happened_try_later');
    })
}

async function eliminateTypeFiling(id: number) {
  TypeFilingServices.deleteTypeFiling(id)
    .then(response => {
      openModalConfirmation(response)
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      openModalAlert("something_happened_try_later")
    })
}

function createNewTypeFiling() {
  dataTypeFiling.stateResponseLoad = true;
  if (FormValidators.getValidationForm('type-filing--form__content')) {
    const formData: any = new FormData();
    formData.append('code', dataTypeFiling.form.code);
    formData.append('name', dataTypeFiling.form.name);
    TypeFilingServices.createTypeFiling(formData)
      .then((response: any) => {
        dataTypeFiling.stateResponseLoad = false;
        openModalConfirmation('the_type_filing_was_successfully_created');
      })
      .catch((error: any) => {
        dataTypeFiling.stateResponseLoad = false;
        openModalAlert(error.response.data.error.details[0]);
        console.error(error);
      })
  } else {
    dataTypeFiling.stateResponseLoad = false;
    dataTypeFiling.dataModalAlert.isActive = 'show';
    dataTypeFiling.dataModalAlert.dataText.text = 'empty_inputs';
  }
}

function refreshData() {
  getTypeFiling("", 1);
  dataTypeFiling.stateFormTypeFiling = false;
  dataTypeFiling.stateResponseLoad = false;
  dataTypeFiling.stateResponse = false;
  dataTypeFiling.form = {
    code: '',
    name: '',
  
  }
}

function closeModalAlert() {
  dataTypeFiling.dataModalAlert.isActive = 'hidde';
}

function openModalAlert(text: string): void {
  dataTypeFiling.dataModalAlert.isActive = 'show';
  dataTypeFiling.dataModalAlert.dataText.text = text;
}

function setFormCreateTypeFiling() {
  dataTypeFiling.stateFormTypeFiling = true;
}

function closeModalConfirmation() {
  dataTypeFiling.dataModalConfirmation.isActive = 'hidde';
  refreshData();
}

function openModalConfirmation(text: string): void {
  dataTypeFiling.dataModalConfirmation.isActive = 'show';
  dataTypeFiling.dataModalConfirmation.dataText.text = text;
}

function redirectToTypeFiling(id: string | number): void {
  // alert(id);
  // router.push('type-filing/' + id);
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

</script>

<style scoped src="./TypeFiling.page.scss"></style>