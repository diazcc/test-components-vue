<!--    dataFormTrd:{
    typeFlow: 1 - 2- 3,
            serie:'',
            subserie:'',
            documentary_type :'',
        }

        With this structure you can get data selected by form on .page or any component
 -->
<template>
  <section class="trd-container" id="trd-form-component">
    <p class="trd-container__trd-title">
      {{ t("documental_classification") }} 
      <!-- <span
      :
        :class="
          'trd-container__trd-title__document-name ' +
          (documentName ? '' : 'loading-component')
        "
        >{{ documentName ? documentName : t("loading_name") + "..." }}</span
      > -->
    </p>
    <ul
      class="trd-container__form-trd "
    >
      <li
        v-if="hasPermissions.validator('view_all_trd')"
        class="trd-container__form-trd__card"
      >
        <SelectAtom :dataSelect="dataSelectDependence" required />
      </li>
      <li class="trd-container__form-trd__card">
        <SelectAtom :dataSelect="dataSelectSerie" required />
      </li>
      <li class="trd-container__form-trd__card">
        <SelectAtom :dataSelect="dataSelectSubserie" required />
      </li>
      <li class="trd-container__form-trd__card">
        <SelectAtom :dataSelect="dataSelectDocumentaryType" required />
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup>
// Import vue libraries
import { onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

// Import components
import SelectAtom from "../../atoms/select/Select.atom.vue";

// Import services
import TrdServices from "../../../services/TrdServices.ts";
import DependenceServices from "../../../services/DependenceServices";
import hasPermissions from "../../../guards/hasPermissions.guard.ts";
import { accessStore } from "../../../store/index.ts";
import FilesServices from "../../../services/FilesServices.ts";
const store: any = accessStore();
// Define props and emits an configuration
const { t } = useI18n();
const props: any = defineProps(["dataFormTrd"]);

// Define constants and variables
const stateLoadClassFile: any = ref(false);
const documentName: any = ref(false);
const adviceClasification: any = ref(false);
const typeFlow: any = ref(3);

const areSelectsDisabled: any = ref(
  props.dataFormTrd?.isDisabled ? props.dataFormTrd?.isDisabled : false
);
const dataSelectSerie: any = reactive({
  id: "",
  name: "",
  className: "",
  disabled: false,
  adviceOption: null,
  onChange: (data: any) => {
    props.dataFormTrd.documentary_type = "";
    props.dataFormTrd.subserie = "";
    props.dataFormTrd.serie = data.target.value;
    dataSelectSubserie.model = "";
    dataSelectDocumentaryType.model = "";
    dataSelectSubserie.options = [];
    dataSelectDocumentaryType.options = [];
    getMRSubseries(data.target.value);
  },
  onClick: (data: any) => {},
  placeholder: "select_serie",
  model: "",
  required: false,
  options: [
    /*{
            value : '',
            label :''
        }*/
  ],
});
const dataSelectSubserie: any = reactive({
  id: "",
  name: "",
  className: "",
  disabled: false,
  adviceOption: null,
  onChange: (data: any) => {
    props.dataFormTrd.documentary_type = "";
    props.dataFormTrd.subserie = data.target.value;
    dataSelectDocumentaryType.model = "";
    dataSelectDocumentaryType.options = [];
    getMRDocumentaryType(props.dataFormTrd.serie, data.target.value);
  },
  onClick: () => {},
  placeholder: "select_subserie",
  model: "",
  required: false,
  options: [
    /*{
            value : '',
            label :''
        }*/
  ],
});
const dataSelectDocumentaryType: any = reactive({
  id: "",
  name: "",
  className: "",
  disabled: false,
  adviceOption: null,
  onChange: (data: any) => {
    props.dataFormTrd.documentary_type = data.target.value;
  },
  onClick: () => {},
  placeholder: "select_documentary_type",
  model: "",
  required: false,
  options: [
    /*{
            value : '',
            label :''
        }*/
  ],
});
const dataSelectDependence: any = reactive({
  id: "",
  name: "",
  className: "",
  disabled: false,
  adviceOption: null,
  onChange: (data: any) => {
    props.dataFormTrd.documentary_type = "";
    props.dataFormTrd.subserie = "";
    props.dataFormTrd.serie = "";
    props.dataFormTrd.dependence = data.target.value;
    dataSelectSerie.model = "";
    dataSelectSubserie.model = "";
    dataSelectDocumentaryType.model = "";
    dataSelectSerie.options = [];
    dataSelectSubserie.options = [];
    dataSelectDocumentaryType.options = [];
    getMRSeries();
  },
  onClick: () => {},
  placeholder: "select_dependency",
  model: "",
  required: false,
  options: [
    /*{
            value : '',
            label :''
        }*/
  ],
});

// Functions

onMounted(() => {
  callServices();
  setDefaultValue();
  dataSelectSerie.disabled = areSelectsDisabled.value;
  dataSelectSubserie.disabled = areSelectsDisabled.value;
  dataSelectDocumentaryType.disabled = areSelectsDisabled.value;
  dataSelectDependence.disabled = areSelectsDisabled.value;
});

function senDependency() {
  return hasPermissions.validator("view_all_trd")
    ? props.dataFormTrd.dependence
    : null;
}

function setDefaultValue() {
  if (props.dataFormTrd.serie != "") {
    getMRSeries();
    dataSelectSerie.model = props.dataFormTrd.serie;
    dataSelectDependence.model = props.dataFormTrd.dependence
      ? props.dataFormTrd.dependence
      : "";
    getMRSubseries(props.dataFormTrd.serie);
    dataSelectSubserie.model = props.dataFormTrd.subserie;
    getMRDocumentaryType(props.dataFormTrd.serie, props.dataFormTrd.subserie);
    dataSelectDocumentaryType.model = props.dataFormTrd.documentary_type;
  }
}

function callServices() {
  if (hasPermissions.validator("view_all_trd")) {
    getDependences();
  } else {
    getMRSeries();
  }
  getClassificationFile();
}

function getDependences() {
  /* DependenceServices.searchDependences("", 1)
    .then((response) => {
      console.log(response);
      dataSelectDependence.options = response.results.map((value: any) => ({
        value: value.code,
        label: value.name,
      }));
    })
    .catch((error: any) => {
      console.error(error);
    }); */
}

function getMRSeries() {
  dataSelectSerie.options = [];
  dataSelectSerie.model = "";
  TrdServices.getMRSeries(props.dataFormTrd.typeFlow, senDependency())
    .then((response: any) => {
      dataSelectSerie.options = response.map((value: any) => ({
        value: value.id,
        label: value.name,
      }));
    })
    .catch((error: any) => {
      console.error(error);
    });
}

function getMRSubseries(id: number) {
  dataSelectSubserie.options = [];
  dataSelectSubserie.model = "";
  if (id != undefined) {
    TrdServices.getMRSubseries(id, props.dataFormTrd.typeFlow, senDependency())
      .then((response: any) => {
        dataSelectSubserie.options = response.map((value: any) => ({
          value: value.id,
          label: value.name,
        }));
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
}

function getMRDocumentaryType(serie: number, subserie: number) {
  dataSelectDocumentaryType.options = [];
  dataSelectDocumentaryType.model = "";
  TrdServices.getMRDocumentaryType(
    serie,
    subserie,
    props.dataFormTrd.typeFlow,
    senDependency()
  )
    .then((response: any) => {
      dataSelectDocumentaryType.options = response.map((value: any) => ({
        value: value.id,
        label: value.name_document_type,
      }));
    })
    .catch((error: any) => {
      console.error(error);
    });
}

function getClassificationFile() {
  /*
{
    "document": "CONTRATO- pruebas  de   15 paginas .docx.pdf",
    "predicted_categories": {
        "Dependency": "GerenciaTi",
        "Series": "Informes",
        "Subseries": "InformesFinales",
        "Document Type": "Informes"
    }
}

  const formData = new FormData();
  const file = store.uploadedFiles[0]; // Assuming the first file in the array is to be sent
  if (!file) {
    console.error("No se encontro el archivo para ser enviado a la API de clasificacion");
    return;
  }
  formData.append('file', file);  // Ensure the API expects a "file" field
  FilesServices.sendClassifyFiles(formData)
  .then((response: any) => {
      stateLoadClassFile.value = true;
      documentName.value = response.document;
      adviceClasification.value = response.predicted_categories;
      console.log(response);
      stateLoadClassFile.value = true;

        documentName.value = "Nombre del archivo.pdf";
        dataSelectSerie.adviceOption = 1;
        dataSelectSubserie.adviceOption = 2;
        dataSelectDocumentaryType.adviceOption = 1;
        dataSelectDependence.adviceOption = 2;
    })
    .catch((error: any) => {
      console.error("Error al enviar el archivo a la API de clasificacion:", error);
    });
     */

  /* setTimeout(() => {
    console.log("Simulando la carga de un archivo...");
    stateLoadClassFile.value = true;
    documentName.value = "Nombre del archivo.pdf";
    dataSelectSerie.adviceOption = 1;
    dataSelectSubserie.adviceOption = 1;
    dataSelectDocumentaryType.adviceOption = 1;
    dataSelectDependence.adviceOption = 2;
  }, 1000); */
}

watch(
  () => props.dataFormTrd.serie,
  (newprop) => {
    setDefaultValue();
  }
);

watch(
  () => dataSelectSerie.model,
  (newprop) => {
      getMRSubseries(newprop);
  }
);
watch(
  () => dataSelectSubserie.model,
  (newprop) => {
    getMRDocumentaryType(dataSelectSerie.model,newprop);
  }
);

watch(
  () => dataSelectDependence.model,
  (newprop) => {
    console.log('newprop',newprop);
    
    getMRSeries();
  }
);
</script>
<style scoped src="./FormTrd.organism.scss"></style>
