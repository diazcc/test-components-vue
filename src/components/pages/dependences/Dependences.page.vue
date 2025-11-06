<template>
  <DependenceTemplate :dataDependence="dataDependence" @applyFilters="applyFilters"/>
</template>

<script setup lang="ts">
// Import vue library
import { onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

// Import components
import DependenceTemplate from "../../templates/dependences/Dependences.template.vue";

// Import services
import DependenceService from "../../../services/DependenceServices";
import FormValidators from "../../../validators/FormValidators";
import UtilsServices from "../../../services/UtilsServices";

// Define props and emits and their types
const { t } = useI18n();
const router = useRouter();
const filters: any = ref([
    'Filtro 1',
    'Filtro 2',
    'Filtro 3',
]);

// VARIABLES OR STATES
/**
 * TODO HERE DEFINE VALUES DEFAULT
 */
let formData: FormData = new FormData(); //Formdata used for be send to endpoits
const dataDependence: any = reactive({
  //Structure of all components data
  id_dependence: "id_dependence",
  state: "", //First state for show first view
  stateViewFile: "",
  stateCreateDependence: true,
  dataCreateDependenceForm: {
    stateCreateDependence: true,
    data: {
      code: "",
      name: "",
      parent_dependency: "",
      state: "",
    },
  },
  dataButtonNewDependence: {
    className: "blue",
    text: "new",
    alt: 'new',
    url: "/Buttons/icon-add.svg",
    reverse: true,
    disabled: false,
    onClick: () => {
      redirectNewDependence();
    },
  },
  dataButtonRedirectToCreateDependence: {
    className: "gray-blue",
    text: "create",
    disabled: false,
    onClick: () => {
      dataDependence.stateViewFile = "step123";
      dataDependence.dataButtonGoToNext.text =
        "create";
    },
  },
  dataButtonGoToNext: {
    className: "blue",
    text: "create",
    reverse: true,
    alt: 'create',
    url: '/Buttons/icon-create.svg',
    iconSize: 'large',
    disabled: false,
    onClick: () => {
      validateNavegationButtonNext();
    },
  },
  dataButtonGoToBack: {
    className: "gray",
    text: "back",
    alt: "left-arrow",
    url: "/Buttons/left-arrow.svg",
    reverse: false,
    disabled: false,
    onClick: () => {
      router.push('/home/dependences');
      validateNavegationButtonBack();
    },
  },
  dataTableDependences: {
    data: [],
    stateLoadData: false,
    dataButton: {
      className: "blue",
      text: "create_dependence",
      disabled: false,
      onClick: () => {
        redirectCreateDependence();
      },
    },
    dataInputDependenceName: {
      id: '',
      name: 'name',
      classInput: '',
      model: '',
      type: 'text',
      placeholder: '',
      disabled: false,
      required: false,
      title: '',
      onClick: () => { },
      handleBlur: () => { },
      onChange: () => { }
    },
  },
  dataModalConfirmation: {
    isActive: "",
    dataText: {
      classText: "big",
      text: "",
      disabled: false,
      onClick: () => { },
    },
    dataButton: {
      className: "blue",
      text: "close",
      disabled: false,
      onClick: () => { },
    },
  },
  dataModalAlert: {
    isActive: "",
    dataButton: {
      className: "",
      text: "login",
      disabled: false,
      onClick: () => { closeModalConfirmation() },
    },
    dataText: {
      classText: "",
      text: "this_is_the_description",
      disabled: false,
      onClick: () => {

      },
    },
  },
  dataRadicationFlow: {
    stateResponseFiling: false,
    //This works with line 47 in template
  },
  dataTableDependence: {
    data: [],
    dataInputSearch: {
      dataInput: {
        id: "",
        name: "",
        classInputEmail: "",
        model: "",
        type: "text",
        placeholder: "search_dependence",
        disabled: false,
        required: false,
        onClick: () => { },
        onChange: (value: any) => {
          searchDependencesList(value, 1)
        }
      },
      dataImg: {
        id: "",
        name: "",
        class: " icon",
        src: "/icon-lupa-general.svg",
        type: "",
        alt: "",
        onClick: () => { },
      },  
    },
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
    dataTooltipIcons: [
      {
        text: `${t("edit")} ${t("dependence").toLowerCase()}`,
        src: '/Buttons/icon-edit.svg',
        color: 'blue',
        alt: 'edit',
        show: (data: any) => { return !data?.editable },
        onClick: ({data = {code: 0}, index = 0}) => { dataDependence.dataTableDependence.setEditableForm(index) },
      },
      {
        text: UtilsServices.capitalizeFirstLetter(`${t("delete")} ${t("dependence")}`),
        src: '/Buttons/icon-delete.svg',
        color: 'red',
        alt: 'delete',
        show: (data: any) => { return data?.delete && !data?.editable; },
        onClick: ({data = {code: 0}, index = 0}) => { dataDependence.dataTableDependence.eliminateDependency(data?.code) },
      },
      {
        text: UtilsServices.capitalizeFirstLetter(`${t("save")} ${t("dependence")}`),
        src: '/Buttons/icon-upload.svg',
        color: 'blue',
        alt: 'save',
        show: (data: any) => { return data?.editable },
        onClick: ({data = {code: 0}, index = 0}) => { dataDependence.dataTableDependence.setEditableForm(index) },
      },
      {
        text: UtilsServices.capitalizeFirstLetter(`${t("close")} ${t("edit")}`),
        src: '/Buttons/icon-close.svg',
        color: 'red',
        alt: 'close',
        show: (data: any) => { return data?.editable },
        onClick: ({data = {code: 0}, index = 0}) => { dataDependence.dataTableDependence.setEditableForm(index) },
      },
    ],
    dataMultiSelect: {
        title: "filters",
        model: [],
        options: filters.value.map((value: any) => ({
            text: value,
            value: value,
            checked: false
        }))
    },
    eliminateDependency: (id: number) => { eliminateDependency(id) },
    setEditableForm: (index: any) => {
      validateEdition(index)
    },
    closeEdition: () => {
      setStatesBack()
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
    getService: (value: any) => {
      searchDependencesList(dataDependence.dataTableDependence.dataInputSearch.dataInput.model, value)
    }
  },
});

/**
 * todo METHODS
 *
 * ?LIFE CICLES
 */

// Ciclos de vida del componente
onMounted(() => {
  searchDependencesList("", 1); //Call function for get all dependences exist on data base.
});

watch(() => dataDependence.dataPaginator.page_size, () => {
  searchDependencesList(dataDependence.dataTableDependence.dataInputSearch.dataInput.model, 1)
});

/**
 * TODO FUNCTIONS SET AND GET
 */

async function searchDependencesList(searched_value: any, page: any) {
  dataDependence.dataTableDependence.data = [];
  dataDependence.dataTableDependence.stateLoadData = true;
  DependenceService.searchDependences(searched_value, page, dataDependence.dataPaginator.page_size)
    .then(response => {
      /* dataDependence.dataPaginator.page = page
      dataDependence.dataPaginator.total_pages = response.total_pages
      dataDependence.dataTableDependence.data = response.results.map((data: any) => ({
        ...data,
        editable: false, // Añade la propiedad isMenuOpen inicializada en false a cada objeto.
      }));
      dataDependence.dataTableDependence.stateLoadData = false; */
    })
    .catch(error => {
      dataDependence.dataTableDependence.stateLoadData = false;
      console.error("Error fetching data:", error);
    })
}

async function eliminateDependency(id: number) {
  DependenceService.deleteDependence(id)
    .then(response => {
      openModalConfirmation(response, "finish", closeModalConfirmation)
      searchDependencesList("", 1);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      openModalAlert(error)
    })
}

function openModalConfirmation(dataText: string, buttonText: string, buttonOnClick: any): void {
  dataDependence.dataModalConfirmation.isActive = 'show';
  dataDependence.dataModalConfirmation.dataText.text = dataText;
  dataDependence.dataModalConfirmation.dataButton.text = buttonText;
  dataDependence.dataModalConfirmation.dataButton.onClick = () => { buttonOnClick() };
}

function closeModalConfirmation() {
  dataDependence.dataModalConfirmation.isActive = "hidde";
  dataDependence.state = "";
}

function openModalAlert(text: string): void {
  dataDependence.dataModalAlert.isActive = 'show';
  dataDependence.dataModalConfirmation.dataText.text = text;
}

//POST DEPENDENCE
async function sendDataCreateDependence() {
  const data: any = reactive({});
  if (FormValidators.getValidationForm("create-dependence-form__content__form")) {
    dataDependence.stateCreateDependence = false;

    data.value = {
      code: dataDependence.dataCreateDependenceForm.data.code,
      name: dataDependence.dataCreateDependenceForm.data.name,
      parent_dependency: dataDependence.dataCreateDependenceForm.data.parent_dependency,
      state: dataDependence.dataCreateDependenceForm.data.state,
    };

    DependenceService.createDependence(data.value)
      .then(() => {
          openModalConfirmation("the_dependence_was_created", "continue", closeModalConfirmation)
          searchDependencesList("", 1);
          resetForm();
      })
      .catch((error) => {
        dataDependence.dataModalConfirmation.isActive = "hidde";
        if (error.status_code == 400 || error.status == 'error') {
          dataDependence.dataModalAlert = {
            isActive: "show",
            dataText: {
              classText: "center",
              text: error.error.details[0],
              disabled: false,
              onClick: () => { },
            },
            dataButton: {
              className: "blue",
              text: "continue",
              disabled: false,
              onClick: () => {
                dataDependence.dataModalAlert.isActive = "hidde";
              },
            },
          };
        } else {
          dataDependence.dataModalAlert = {
            isActive: "show",
            dataText: {
              classText: "center",
              text: "an_error_has_occurred_please_try_again_later",
              disabled: false,
              onClick: () => { },
            },
            dataButton: {
              className: "blue",
              text: "continue",
              disabled: false,
              onClick: () => {
                dataDependence.dataModalAlert.isActive = "hidde";
              },
            },
          };
        }
      });
  } else {
    dataDependence.dataModalAlert = {
      isActive: "show",
      dataText: {
        classText: "center",
        text: "all_inputs_empy",
        disabled: false,
        onClick: () => { },
      },
      dataButton: {
        className: "blue",
        text: "continue",
        disabled: false,
        onClick: () => {
          dataDependence.dataModalAlert.isActive = "hidde";
        },
      },
    };
  }
}



function validateNavegationButtonBack() {
  switch (dataDependence.stateViewFile) {
    case "step1":
      dataDependence.state = "";
      dataDependence.dataButtonGoToNext.text = "create";
      setStatesBack();
      break;

    case "step123":
      dataDependence.stateViewFile = "step1";
      dataDependence.dataButtonGoToNext.text = "create";
      setStatesBack();
      break;


    default:
      break;
  }
}
function validateNavegationButtonNext() {
  switch (dataDependence.stateViewFile) {
    case "step123":
      dataDependence.stateViewFile = "step12";
      dataDependence.dataButtonGoToNext.text = "create";
      break;
    case "step12":
      dataDependence.stateViewFile = "step123";
      dataDependence.dataButtonGoToNext.text =
        "create";
      break;
    case "step1":
      sendDataCreateDependence();
      break;
    case "step1234":
      break;
    default:
      break;
  }
}


/**
 * TODO FUNCTIONS REDIRECTS AND NAVEGATIONS
 */

function redirectCreateDependence() {
  dataDependence.stateViewFile = "step1";
  dataDependence.dataButtonGoToNext.text = "create";
}

function redirectNewDependence() {
  dataDependence.state = "viewNewFile";
  dataDependence.stateViewFile = "step1";
}
function validateEdition(index: number) {
  if (dataDependence.dataTableDependence.data[index]?.editable && FormValidators.getValidationForm('table__row__cell')) {
    DependenceService.updateDependence(
      { name: dataDependence.dataTableDependence.data[index].name },
      dataDependence.dataTableDependence.data[index].code
    )
      .then((response: any) => {
        dataDependence.dataTableDependence.data[index].editable = false;
        openModalConfirmation('the_dependency_name_was_successfully_updated', 'finalize', setStatesBack);
      })
      .catch((error: any) => {
        console.error(error);
      });
  } else {
    dataDependence.dataTableDependence.data.forEach((item: any, i: number) => {
      item.editable = i === index; 
    });
  }
}

function setStatesBack() {
  resetForm();
  searchDependencesList("", 1);
  closeModalConfirmation()
}

function resetForm() {
  dataDependence.dataCreateDependenceForm = {
    stateCreateDependence: true,
    data: {
      code: "",
      name: "",
      parent_dependency: "",
      state: "",
    },
  };
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

</script>

<style scoped src="./Dependences.page.scss"></style>