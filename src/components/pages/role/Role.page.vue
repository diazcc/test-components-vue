<template>
  <RoleTemplate :dataRole="dataRole" :filteredItems="filteredItems" />
</template>

<script setup lang="ts">
// Import vue library
import { useRoute, useRouter } from 'vue-router';
import { reactive, ref, onMounted, computed } from 'vue';

// Import components
import RoleTemplate from '../../templates/role/Role.template.vue';

// Import services
import UserServices from '../../../services/UserServices';
import RoleServices from '../../../services/RoleServices';
import FormValidators from '../../../validators/FormValidators';

const route: any = useRoute();
const router: any = useRouter();
const listModules: any = ref([]);
const idRol: any = ref('');
const dataRole: any = reactive({
  list: [],
  idRole: route.params.id,
  dateCreated: '',
  stateLoadingForm: false,
  stateEdit: false,
  stateInfo: false,
  stateCreate: false,
  stateDelete: false,
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
      text: "close",
      disabled: false,
      onClick: () => {
        closeModalConfirmation()
      },
    },
  },
  dataModalAlert: {
    isActive: "",
    dataButton: {
      className: "",
      text: "close",
      disabled: false,
      onClick: () => { closeModalAlert() },
    },
    dataText: {
      classText: "",
      text: "this_is_the_description",
      disabled: false,
      onClick: () => { },
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
      onClick: () => { }
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
  dataButtonBack: {
    className: 'grey',
    text: 'back',
    alt: 'left-arrow',
    url: "/Buttons/left-arrow,svg",
    disabled: false,
    reverse: false,
    onClick: () => { }
  },
  dataButtonNext: {
    className: 'blue',
    text: 'continue',
    alt: 'continues',
    url: '/Buttons/right-arrow.svg',
    reverse: true,
    disabled: false,
    onClick: () => { }
  },
  dataInputName: {
    id: '',
    name: '',
    classInput: 'read',
    model: '',
    type: 'text',
    placeholder: 'name',
    disabled: false,
    required: true,
    title: '',
    lowercaser : true,
    onClick: () => { },
    handleBlur: () => { } //is for detect when unfocused input.
  },
  openModule: (module: any, index: any) => {
    openModule(module, index);
  },
  openSubmodule: (submodule: any, indexModule: any, indexSubmodule: any) => {
    openSubmodule(submodule, indexModule, indexSubmodule);
  },
  selectAllModule: (index: any) => {
    selectAllModule(index);
  },
  selectAllSubmodule: (indexModule: any, indexSubmodule: any) => {
    selectAllSubmodule(indexModule, indexSubmodule);
  },
  activeAction: (action: {} | any, indexAction: number | string, indexModule: number | string, indexSubmodule: number | string) => {
    activeAction(action, indexAction, indexModule, indexSubmodule)
  }
})

onMounted(() => {
  validationView();
});

function validationView() {
  idRol.value = route.params.id
  dataRole.idRole = route.params.id;
  dataRole.dataButtonBack = {
    className: 'appear',
    text: 'back',
    alt: 'left-arrow',
    url: "/Buttons/left-arrow.svg",
    disabled: false,
    reverse: false,
    onClick: () => {
      router.back();
    }
  }
  switch (idRol.value ? true : false) {
    case true:
      //View edit Role
      dataRole.dataInputName.classInput = 'read';
      getRole(idRol.value);
      dataRole.dataButtonNext = {
        className: 'blue',
        text: 'edit',
        alt: 'edit',
        url: '/Buttons/icon-edit.svg',
        iconSize: 'large',
        reverse: true,
        disabled: false,
        onClick: () => {
          setEditRole();
        }
      }


      break;
    case false:
      //View create Role
      getModules();
      dataRole.stateCreate = true;
      dataRole.dataInputName.classInput = 'form-max';
      dataRole.dataInputName.model = '';
      dataRole.dataButtonNext = {
        className: 'blue',
        text: 'create',
        alt: 'create',
        url: '/Buttons/icon-create.svg',
        iconSize: 'large',
        reverse: true,
        disabled: false,
        onClick: () => {
          createNewRole();
        }
      }
      break;
    default:
      break;
  }
}

function createNewRole() {
  const formData = new FormData();
  if (FormValidators.getValidationForm('role__content__form')) {
    dataRole.stateLoadingForm = true;
    const actions = listModules.value.reduce((acc: any, module: any) => {
      module.submodule.forEach((submodule: any) => {
        submodule.actions.forEach((action: any) => {
          if (action.active) {
            acc.push(action);
          }
        });
      });
      return acc;
    }, []);

    formData.append('name', dataRole.dataInputName.model);
    formData.append('list_permit', JSON.stringify(actions));

    RoleServices.createRole(formData)
      .then((response: any) => {
        openModalConfirmation('the_role_has_been_created_successfully');
      })
      .catch((error: any) => {
        openModalAlert(error.details[0]);
      })


  } else {
    openModalAlert('empty_inputs');
  }
}

function getModules() {
  // UserServices.getPermissions().then((response: any) => {
  //   const data = response.results.map((module: any) => ({
  //     ...module,
  //     active: false,
  //     state: false,
  //     submodule: module.submodule.map((submodule: any) => ({
  //       ...submodule,
  //       active: false,
  //       state: false,
  //       actions: submodule.actions.map((actions: any) => ({
  //         ...actions,
  //         active: false
  //       }))
  //     }))
  //   }));
  //   listModules.value = data;
  // });
}

function getRole(id: string | number) {
  RoleServices.getRolById(id)
    .then((response: any) => {
      dataRole.dataInputName.model = response.name;
      dataRole.dateCreated = response.date;
      listModules.value = response.permit;
      dataRole.stateDelete = response.elimination_status;
    })
    .catch((error: any) => {
      console.error(error);
    })
}

function setEditRole() {
  dataRole.stateEdit = true;
  dataRole.dataButtonNext = {
    className: 'blue-appear',
    text: 'save',
    disabled: false,
    reverse: true,
    url: '/Buttons/icon-save.svg',
    onClick: () => {
      updateRole();
    }
  }
  dataRole.dataButtonBack = {
    className: 'appear',
    text: 'cancel',
    alt: 'cancel',
    url: '/Buttons/decline.svg',
    iconSize: 'short',
    disabled: false,
    reverse: false,
    onClick: () => {
      setStateBack();
    }
  }
  dataRole.dataInputName.classInput = 'form-max';
}


function updateRole() {
  const formData = new FormData();
  if (FormValidators.getValidationForm('role__content__form')) {
    dataRole.stateLoadingForm = true;

    const actions = listModules.value.reduce((acc: any, module: any) => {
      module.submodule.forEach((submodule: any) => {
        submodule.actions.forEach((action: any) => {
          if (action.active) {
            acc.push(action);
          }
        });
      });
      return acc;
    }, []);

    formData.append('name', dataRole.dataInputName.model);
    formData.append('list_permit', JSON.stringify(actions));
    for (let value of formData.entries()) {
    }

    RoleServices.updateRol(formData, idRol.value)
      .then((response: any) => {
        openModalConfirmation('the_role_has_been_updated_successfully');
      })
      .catch((error: any) => {
        openModalAlert(error.details[0]);
      })


  } else {
    openModalAlert('empty_inputs');
  }

}
const filteredItems: any = computed(() => {
  closeModules()
  const searchInput = dataRole.dataInputSearch.dataInput.model.toLowerCase();
  return listModules.value.filter((item: any) => {
    const name = item?.module ? item.module.toLowerCase() : '';
    return name.includes(searchInput);
  });
});
function openModule(module: any, index: any) {
  filteredItems.value[index].state = !filteredItems.value[index].state;
}

function closeModalConfirmation() {
  dataRole.dataModalConfirmation.isActive = 'hidde';
  dataRole.stateLoadingForm = false;
  setStateBack();
}

function openModalConfirmation(text: string): void {
  dataRole.dataModalConfirmation.isActive = 'show';
  dataRole.dataModalConfirmation.dataText.text = text;
}


function openModalAlert(text: string): void {
  dataRole.dataModalAlert.isActive = 'show';
  dataRole.dataModalAlert.dataText.text = text;
}

function closeModalAlert() {
  dataRole.dataModalAlert.isActive = 'hidde';
}

function openSubmodule(submodule: any, indexModule: any, indexSubmodule: any) {
  filteredItems.value[indexModule].submodule[indexSubmodule].state = !filteredItems.value[indexModule].submodule[indexSubmodule].state;

}

function closeModules() {
  const data = listModules.value.map((module: any) => ({
    ...module,
    state: false,
    submodule: module.submodule.map((submodule: any) => ({
      ...submodule,
      state: false,
    }))
  }));

  listModules.value = data;
}

function activeAction(action: {} | any, indexAction: number | string, indexModule: number | string, indexSubmodule: number | string) {
  filteredItems.value[indexModule].submodule[indexSubmodule].actions[indexAction].active = !filteredItems.value[indexModule].submodule[indexSubmodule].actions[indexAction].active;
}

function selectAllModule(index: number | string) {
  let data: any = [];
  filteredItems.value[index].active = !filteredItems.value[index].active;
  if (filteredItems.value[index].active) {
    data = filteredItems.value[index].submodule.map((submodule: any, indexsubmodule: any) => ({
      ...submodule,
      active: true,
      actions: submodule.actions.map((actions: any, indexAction: any) => ({
        ...actions,
        active: true
      }))
    }))

  } else {
    data = filteredItems.value[index].submodule.map((submodule: any, indexsubmodule: any) => ({
      ...submodule,
      active: false,
      actions: submodule.actions.map((actions: any, indexAction: any) => ({
        ...actions,
        active: false
      }))
    }))
  }
  filteredItems.value[index].submodule = data;
}

function unselectAllModule() {
  let data: any = [];
  data = filteredItems.value.map((response: any) => ({
    ...response,
    submodule: response.submodule.map((submodule: any, indexsubmodule: any) => ({
      ...submodule,
      active: true,
      actions: submodule.actions.map((actions: any, indexAction: any) => ({
        ...actions,
        active: true
      }))
    }))
  }))

  filteredItems.value = data;
}

function getActiveActions() {
  let activeActions: any[] = [];
  filteredItems.value.forEach((response: any) => {
    response.submodule.forEach((submodule: any) => {
      const activeSubmoduleActions = submodule.actions.filter((action: any) => action.active);
      activeActions = activeActions.concat(activeSubmoduleActions);
    });
  });
  // return activeActions;
}
function selectAllSubmodule(indexModule: any, indexSubmodule: any) {
  let data: any = [];
  filteredItems.value[indexModule].submodule[indexSubmodule].active = !filteredItems.value[indexModule].submodule[indexSubmodule].active;
  if (filteredItems.value[indexModule].submodule[indexSubmodule].active) {
    data = filteredItems.value[indexModule].submodule[indexSubmodule].actions.map((action: any, indexAction: any) => ({
      ...action,
      active: true,
    }))
  } else {
    data = filteredItems.value[indexModule].submodule[indexSubmodule].actions.map((action: any, indexAction: any) => ({
      ...action,
      active: false,
    }))
  }
  filteredItems.value[indexModule].submodule[indexSubmodule].actions = data;
}


function setStateBack() {
  closeModules()
  listModules.value = [];
  dataRole.stateLoadingForm = false;
  dataRole.dataInputSearch.dataInput.model = '';
  dataRole.stateEdit = false;
  validationView();
  unselectAllModule()

}

</script>

<style scoped src="./Role.page.scss"></style>