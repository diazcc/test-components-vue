<template>
  <GeneralSearch :dataGeneralSearch="dataGeneralSearch" />
</template>
<script setup lang="ts">
import { inject, onMounted, reactive, ref, watch } from "vue";
import GeneralSearch from "../../templates/general-search/GeneralSearch.template.vue";
import SearchServices from "../../../services/SearchServices";
const dataSearch = inject("dataSearch") as any;

// Agregar el watch directamente sobre dataSearch

const dataGeneralSearch: any = reactive({
  stateLoadData: false,
  data: [],
  dataPaginator: {
    page: 1,
    page_size: 10,
    total_pages: "",
    pagination_options: [
      {
        number: 10,
        active: false,
      },
      {
        number: 20,
        active: false,
      },
      {
        number: 30,
        active: false,
      },
      {
        number: 50,
        active: false,
      },
    ],
    getService: (value: any) => {
      getData(dataSearch?.value, value);
    },
  },
  getFile: () => {},
});

onMounted(() => {
  getData(" ", 1);
});

watch(() => dataGeneralSearch.dataPaginator.page_size, () => {
  getData(dataSearch?.value, 1);
});

function getData(data: any, page: any) {
  data != '' ? data : data = ' ';
  dataGeneralSearch.data = [];
  dataGeneralSearch.stateLoadData = true;
  SearchServices.getResponse(data, page, dataGeneralSearch.dataPaginator.page_size)
    .then((response: any) => {
      console.log(response);
      dataGeneralSearch.data = response.results
      dataGeneralSearch.dataPaginator.page = page;
      dataGeneralSearch.dataPaginator.total_pages = response.total_pages;
      dataGeneralSearch.stateLoadData = false;
    })
    .catch((error: any) => {
      dataGeneralSearch.stateLoadData = false;
      console.error(error);
    });
}
watch(
  () => dataSearch?.value, // Observar el valor interno del ref
  (newValue: any, oldValue: any) => {
    console.log("Valor anterior:", oldValue);
    console.log("Nuevo valor:", newValue);
    getData(newValue, 1);
  }
);
</script>
