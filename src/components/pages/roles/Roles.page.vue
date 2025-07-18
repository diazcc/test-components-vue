<!--
  TODO COMPONENT ROLE RECEIVED PAGE
  ?This component has all logic and develop of correspondence on only section 'received'.
-->

<template>
  <RolesTemplate :dataRole="dataRole" @applyFilters="applyFilters"/>
</template>

<script setup lang="ts">

// Import vue library
import { onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

// Import components
import RolesTemplate from "../../templates/roles/Roles.template.vue";

// Import services
import RoleService from "../../../services/RoleServices";
import UtilsServices from "../../../services/UtilsServices";
import hasPermissions from "../../../guards/hasPermissions.guard";
import { accessStore } from "../../../store";

// Define props and emits and their types
const router = useRouter();
const store: any = accessStore();
const { t } = useI18n();
const filters: any = ref([
    'Filtro 1',
    'Filtro 2',
    'Filtro 3',
]);

// VARIABLES OR STATES
/**
 * TODO HERE DEFINE VALUES DEFAULT
*/
const arrayPermissions = ref([])
const dataRole: any = reactive({
  stateLoadData: false,
  currentPage: 1,
  totalPages: 0,
  list: [],
  dataButtonNewRole: {
    className: "blue",
    text: "new",
    alt: 'new',
    url: '/Buttons/icon-add.svg',
    reverse: true,
    disabled: false,
    onClick: () => {
      router.push('role');
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
        getRoles(value, 1)
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
      getRoles(dataRole.dataInputSearch.dataInput.model, value)
    }
  },
  dataModalAlert: {
    isActive: '',
    dataButton: {
      className: '',
      text: 'Cerrar',
      disabled: false,
      onClick: () => {
          dataRole.dataModalAlert.isActive = '';
      }
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
      className: '',
      text: 'continue',
      disabled: false,
      onClick: () => {
          closeModalConfirmation();
      }
    },
    dataText: {
        classText: '',
        text: 'Error, intentalo mas tarde.',
        disabled: false,
        onClick: () => { }
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
      text: UtilsServices.capitalizeFirstLetter(`${t("view")} ${t("rol")}`),
      src: '/Buttons/icon-view.svg',
      color: 'blue',
      alt: 'edit',
      show: () => { return true},
      onClick: ({data = {}, index = -1}) => { openRole(data, index); },
    },
    {
      text: UtilsServices.capitalizeFirstLetter(`${t("delete")} ${t("rol")}`),
      src: '/Buttons/icon-delete.svg',
      color: 'red',
      alt: 'delete',
      show: ({data = {elimination_status: false}}) => { return hasPermissions.validator('delete_roles') && data?.elimination_status; },
      onClick: ({index = -1}) => { deleteRole(index); },
    },
  ],
  openModule: (data: any, indexRole: number | string, indexModule: number | string): void => {
    openModule(data, indexRole, indexModule);
  },
  selectAllModule: (data: any, indexRole: number | string, indexModule: number | string): void => {
  },
});

/**
 * todo METHODS
 *
 * ?LIFE CICLES
*/

onMounted(() => {
  getRoles("", 1);
});

watch(() => dataRole.dataPaginator.page_size, () => {
  getRoles(dataRole.dataInputSearch.dataInput.model, 1);
});
/**
 * TODO FUNCTIONS SET AND GET
*/

function getRoles(searched_value:any, page:any) {
  dataRole.list = [];
  dataRole.stateLoadData = true;
  RoleService.getRole(searched_value, page, dataRole.dataPaginator.page_size)
    .then((response: any) => {
      dataRole.dataPaginator.page = page
      dataRole.dataPaginator.total_pages = response.total_pages
      dataRole.list = response.results;
      dataRole.stateLoadData = false;
    }).catch((error) => {
      dataRole.stateLoadData = false;
      console.error(error)
    })
}

function openRole(data: any | number, index: number | string) {
  router.push('role/' + data.id);
}

function openModule(id: string | number, indexRol: any, indexModule: number | string) {
  dataRole.list[indexRol].permissions[indexModule].state = !dataRole.list[indexRol].permissions[indexModule].state;
}

function getActionsSelected() {
  const result: any = [];

  dataRole.list.forEach((role: any) => {
    role.permissions.forEach((module: any) => {
      module.permissions.forEach((action: any) => {
        if (action.state === true) {
          result.push(action.id);
        }
      });
    });
  });
  return JSON.stringify(result);
};

function deleteRole(id: any) {
  RoleService.deleteRole(id)
    .then(() => {
      openModalConfirmation(t('the_role_has_been_deleted_successfully'));
      getRoles(dataRole.dataInputSearch.dataInput.model, 1);
    })
    .catch((error: any) => {
      console.error(error);
      openModalAlert('an_error_has_occurred_please_try_again_later');
    })
}


function openModalAlert(text: string): void {
  dataRole.dataModalAlert.isActive = 'show';
  dataRole.dataModalAlert.dataText.text = text;
}

function openModalConfirmation(text: string): void {
  dataRole.dataModalConfirmation.isActive = 'show';
  dataRole.dataModalConfirmation.dataText.text = text;
}

function closeModalConfirmation() {
  dataRole.dataModalConfirmation.isActive = 'hidde';
  getRoles(dataRole.dataInputSearch.dataInput.model, 1);
}

function applyFilters(selectedOptions: Array<{ value: any }>) {
    console.log("On construction");
    console.log(selectedOptions);
}

</script>


<style scoped src="./Roles.page.scss"></style>