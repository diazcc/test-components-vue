<template>
  <UserTemplate :dataUser="dataUser" @applyFilters="applyFilters"/>
</template>

<script setup lang="ts">

// Import vue library
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

// Import components
import UserTemplate from "../../templates/user/User.template.vue";

// Import services
import UserService from "../../../services/UserServices";
import DependenceService from "../../../services/DependenceServices";
import IdentificationTypesService from "../../../services/IdentificationTypesServices";
import FormValidators from "../../../validators/FormValidators";
import RoleService from "../../../services/RoleServices";
import DataFlowServices from "../../../services/DataFlowServices";
import UtilsServices from "../../../services/UtilsServices";
import hasPermissions from "../../../guards/hasPermissions.guard";

const router = useRouter();
const { t } = useI18n();

// VARIABLES OR STATES
/**
 * TODO HERE DEFINE VALUES DEFAULT
 */
const domain = window.location.origin
const filters: any = ref([
    'Filtro 1',
    'Filtro 2',
    'Filtro 3',
]);
const dataUser = reactive({
  //Structure of all components data
  id_user: "id_user",
  stateFormCreate: false,
  stateChoiceOption: false,
  state: "", //First state for show first view
  stateViewFile: "",
  stateCreateUser: true,
  dataCreateUserForm: {
    stateCreateUser: true,
    data: {
      first_name: "",
      last_name: "",
      email: "",
      dependence: "",
      identification_number: '',
      date_of_birth: "",
      is_active: '',
      group_name: '',
      identification_type: '',
      phone_number: '',
    },
  },
  dataButtonNewUser: {
    className: "blue",
    text: "new",
    alt: 'new',
    url: "/Buttons/icon-add.svg",
    reverse: true,
    disabled: false,
    onClick: () => {
      redirectNewUser();
    },
  },
  dataButtonRedirectToCreateUser: {
    className: "gray-blue",
    text: "create_user",
    disabled: false,
    onClick: () => {
      setStateFormCreate()
    },
  },
  dataButtonBulkUpload: {
    className: "gray-mouse-blue",
    text: "bulk_upload",
    disabled: false,
    onClick: () => {
    
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
    disabled: false,
    onClick: () => {
      backToChoice();
    },
  },
  dataTableUser: {
    data: [],
    stateLoadData: false,
    dataInputSearch: {
      dataInput: {
        id: "",
        name: "",
        classInputEmail: "",
        model: "",
        type: "text",
        placeholder: "search_user",
        disabled: false,
        required: false,
        onClick: () => { },
        onChange: (value: any) => {
          getSearchUsers(value, 1)
        },
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
        text: UtilsServices.capitalizeFirstLetter(`${t("view")} ${t("user_info")}`),
        src: '/Buttons/icon-view.svg',
        color: 'blue',
        alt: 'view',
        show: () => { return true },
        onClick: ({data = {}}) => { dataUser.dataTableUser.selectUser(data) },
      },
      {
        text: UtilsServices.capitalizeFirstLetter(`${t("delete")} ${t("user")}`),
        src: '/Buttons/icon-delete.svg',
        color: 'red',
        alt: 'delete',
        show: (data: any) => { return data?.elimination_status && hasPermissions.validator('delete_users') },
        onClick: ({index = -1}) => { eliminateUser(index) },
      },
    ],
    selectUser: (data: any) => {
      redirectInfoUser(data.id);
    }
  },
  dataDependences: {
    data: []
  },
  dataRoles: {
    data: []
  },
  dataIdentificationTypes: {
    data: []
  },
  dataImgGoToBack: {
    id: '',
    name: 'back',
    class: 'icon-back',
    src: '/arrow-left.svg',
    type: 'svg',
    alt: '',
    isActive: () => { }, // optional, currently used to add activate and deactivate the active class
    onClick: () => {
      validateNavegationBack();
    }
  },
  dataModalConfirmation: {
    isActive: "",
    dataText: {
      classText: "",
      text: "",
      disabled: false,
      onClick: () => { },
    },
    dataButton: {
      className: "",
      text: "h",
      disabled: false,
      onClick: () => {
        dataUser.dataModalConfirmation.isActive = "hidde";
      },
    },
  },
  dataModalAlert: {
    isActive: "",
    dataButton: {
      className: "",
      text: "close",
      disabled: false,
      onClick: () => {dataUser.dataModalAlert.isActive=""},
    },
    dataText: {
      classText: "",
      text: "this_is_the_description",
      disabled: false,
      onClick: () => { },
    },
  },
  dataRadicationFlow: {
    stateResponseFiling: false,
    //This works with line 47 in template
  },
  dataImportWarnings: {    // prop para manejar error de importacion de usuarios
    skippedUsers: 0,
    totalUsers: 0,
    importedUsers: 0,
    errorDetails: [],
    isVisible: false
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
      getSearchUsers(dataUser.dataTableUser.dataInputSearch.dataInput.model, value)
    }
  },
  processFileUpload: (file: any) => {
    processFileUpload(file)
  }
});

/**
 * todo METHODS
 *
 * ?LIFE CICLES
 */

// Ciclos de vida del componente
onMounted(() => {
  // getSearchUsers("", 1);
  // getDependences();
  // getRoles();
  // getDataIdentificationTypes();
});

watch(() => dataUser.dataPaginator.page_size, () => {
  getSearchUsers(dataUser.dataTableUser.dataInputSearch.dataInput.model, 1);
});

/**
 * TODO FUNCTIONS SET AND GET
 */

async function getSearchUsers(searched_value: any, page: any) {
  dataUser.dataTableUser.data = []; // load state
  dataUser.dataTableUser.stateLoadData = true;
  UserService.searchUsers(searched_value, page, dataUser.dataPaginator.page_size)
    .then(response => {
      dataUser.dataPaginator.page = page
      dataUser.dataPaginator.total_pages = response.total_pages
      dataUser.dataTableUser.data = response.results;
      dataUser.dataTableUser.stateLoadData = false;
    })
    .catch(error => {
      dataUser.dataTableUser.stateLoadData = false;
      console.error("Error fetching data:", error);
    })
}

async function getDependences() {
  DependenceService.getAllDependences(1)
    .then(response => {
      dataUser.dataDependences.data =
        response.results.map((data: any) => ({
          ...data,
          isMenuOpen: false, // Añade la propiedad isMenuOpen inicializada en false a cada objeto.
        }));
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}

async function getRoles() {
  RoleService.getRole("", 1)
    .then(response => {
      dataUser.dataRoles.data =
        response.results.map((data: any) => ({
          ...data,
          isMenuOpen: false, // Añade la propiedad isMenuOpen inicializada en false a cada objeto.
        }));
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}

async function getDataIdentificationTypes() {
  IdentificationTypesService.getAllIdentificationTypes()
    .then(response => {
      dataUser.dataIdentificationTypes.data =
        response.map((data: any) => ({
          ...data,
          isMenuOpen: false, // Añade la propiedad isMenuOpen inicializada en false a cada objeto.
        }))
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}

//POST USER
async function sendDataCreateUser() {
  const data: any = reactive({});
  if (FormValidators.getValidationForm("create-user-form__content__form")) {
    dataUser.stateCreateUser = false;

    data.value = {
      first_name: dataUser.dataCreateUserForm.data.first_name,
      last_name: dataUser.dataCreateUserForm.data.last_name,
      email: dataUser.dataCreateUserForm.data.email,
      dependence: dataUser.dataCreateUserForm.data.dependence,
      identification_number: dataUser.dataCreateUserForm.data.identification_number,
      date_of_birth: dataUser.dataCreateUserForm.data.date_of_birth,
      is_active: dataUser.dataCreateUserForm.data.is_active,
      role: dataUser.dataCreateUserForm.data.group_name,
      domain: domain,
      domain_reset_user_password: domain + "/new-password",
      identification_type: dataUser.dataCreateUserForm.data.identification_type,
      phone_number: dataUser.dataCreateUserForm.data.phone_number,
    };
    UserService.createUser(data.value)
      .then(() => {
        dataUser.dataModalConfirmation = {
          isActive: "show",
          dataText: {
            classText: "big",
            text: "the_user_was_created",
            disabled: false,
            onClick: () => { },
          },
          dataButton: {
            className: "blue",
            text: "continue",
            disabled: false,
            onClick: () => {
              dataUser.dataModalConfirmation.isActive =
                "hidde";
                validateNavegationBack();
            },
          },
        };
        getSearchUsers("", 1);
        resetForm();
      })
      .catch((error) => {
        dataUser.dataModalConfirmation.isActive = "hidde";
        if (error.status_code == 400 || error.status == "error") {
          dataUser.dataModalAlert = {
            isActive: "show",
            dataText: {
              classText: "center",
              text: error.error?.details[0],
              disabled: false,
              onClick: () => { },
            },
            dataButton: {
              className: "blue",
              text: "continue",
              disabled: false,
              onClick: () => {
                dataUser.dataModalAlert.isActive = "hidde";
              },
            },
          };
        } else {
          dataUser.dataModalAlert = {
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
                dataUser.dataModalAlert.isActive = "hidde";
              },
            },
          };
        }
      });
  } else {
    dataUser.dataModalAlert = {
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
          dataUser.dataModalAlert.isActive = "hidde";
        },
      },
    };
  }
}

function validateNavegationBack() {
  dataUser.stateFormCreate = false;
  dataUser.stateChoiceOption = false;
}

function eliminateUser(id: number) {
  UserService.deleteUser(id)
    .then((response) => {
      openModalConfirmation(response, "fin", closeModalConfirmation)
    })
    .catch((error) => {
      openModalAlert(error)

    });
}

function backToChoice() {
    dataUser.stateFormCreate = true;
    dataUser.stateChoiceOption = true;
    resetForm();
}

function validateNavegationButtonNext() {
    sendDataCreateUser();
}

/**
 * TODO FUNCTIONS REDIRECTS AND NAVEGATIONS
 */

function redirectCreateUser() {
  dataUser.stateViewFile = "step123";
  dataUser.dataButtonGoToNext.text = "create_and_continue";
}

function redirectNewUser() {
  dataUser.stateChoiceOption = true;
  dataUser.stateFormCreate = true;
}

function redirectTableView() {
  dataUser.stateChoiceOption = false;
  dataUser.stateFormCreate = false;
}

function redirectInfoUser(id: string | number): void {
  router.push('user/' + id);
}

async function processFileUpload(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Llamar al servicio de carga masiva
    const response = await DataFlowServices.bulkUploadUsers(formData);

    // Primero, verificar si hay errores de correo
    if (response.errors_email && response.errors_email.length > 0) {
      // Mostrar modal con los errores de correo
     
      openModalAlert("csv_import_incomplete_need_email");
      return;
    }

    // Si no hay errores de correo, continuar con la verificación de éxito
    if (response.success) { 
      // Verificar si hay usuarios que no se pudieron importar
      if (response.data?.failedUsers && response.data.failedUsers.length > 0) {
        // Mostrar modal con información de importación parcial
        openModalConfirmation(
          "csv_import_partially_successfully", 
          "close", 
          () => {
            closeModalConfirmation();
            redirectTableView();
          }, 
        );
      } else {
        // Importación completamente exitosa
        openModalConfirmation("csv_import_successfully", "close", () => {
          closeModalConfirmation();
          redirectTableView();
        });
      }
    } else {
      // Manejar otros errores específicos devueltos por el backend
      if (response.errors && response.errors.length > 0) {
        // Mostrar modal con los errores específicos
       
        openModalAlert("file_requires_email_field");

      } else {
        // Mensaje de error genérico si no hay detalles específicos
        openModalAlert("Incomplete_import");
      }
    }
  } catch (error) {
    // Manejar cualquier error inesperado en la función
    openModalAlert("Incomplete_import");
  }
}

function openModalConfirmation(dataText: string, buttonText: string, buttonOnClick: any, additionalData = null): void {
  dataUser.dataModalConfirmation.isActive = 'show';
  dataUser.dataModalConfirmation.dataText.text = dataText;
  dataUser.dataModalConfirmation.dataButton.text = buttonText;
  dataUser.dataModalConfirmation.dataButton.onClick = () => { buttonOnClick() };
  
  if (additionalData) {
    console.log("Datos adicionales:", additionalData);
   
  }

}

function closeModalConfirmation() {
  dataUser.dataModalConfirmation.isActive = "hidde";
  dataUser.state = "";
  getSearchUsers("", 1);
}

function openModalAlert(text: string): void {
  dataUser.dataModalAlert.isActive = 'show';
  dataUser.dataModalAlert.dataText.text = text;
}

function setStateFormCreate() {
    dataUser.stateChoiceOption = false;
    dataUser.stateFormCreate = true;
}

function resetForm() {
  dataUser.dataCreateUserForm = {
    stateCreateUser: true,
    data: {
      first_name: "",
      last_name: "",
      email: "",
      dependence: "",
      identification_number: '',
      date_of_birth: "",
      is_active: '',
      group_name: '',
      identification_type: '',
      phone_number: '',
    },
  }
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

</script>

<style scoped src="./User.page.scss"></style>