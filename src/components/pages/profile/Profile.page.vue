<template>
  <ProfileTemplate :dataProfile="dataProfile" />
</template>

<!--
  TODO Some data of some services are call on template for perfomance code 
-->
<script setup lang="ts">
// IMPORTS
import ProfileTemplate from "../../templates/profile/Profile.template.vue";
import { onMounted, reactive, ref } from "vue";
import ProfileService from "../../../services/ProfileServices";
import UserService from "../../../services/UserServices";
import FormValidators from "../../../validators/FormValidators";

import { useRouter } from "vue-router";
import { accessStore } from "../../../store";

const store: any = accessStore();

const userId: any = ref('');
const router = useRouter();
let formData: FormData = new FormData(); //Formdata used for be send to endpoits
const dataProfile = reactive(setDataProfile());

onMounted(() => {
  callServices();
})

function callServices() {
  getUserLogged();
}


function setDataProfile(): any {
  return reactive({
    stateForm: false,
    stateLoad: false,
    idDataLoading: false,
    form: {
      profile_picture: '',
      first_name: '',
      second_name: '',
      last_name: '',
      second_last_name: '',
      identification_type: '',
      identification_number: '',
      country: '',
      statedepartment: '',
      city: '',
      email: '',
    },
    dataButtonGoToNext: {
      className: "blue",
      text: "edit",
      alt: 'edit',
      url: '/Buttons/icon-edit.svg',
      reverse: true,
      disabled: false,
      iconSize: 'large',
      onClick: () => {
        validateNavegationViewNext()
      },
    },
    dataButtonGoToBack: {
      className: "gray",
      text: "back",
      alt: 'back',
      url: '/Buttons/left-arrow.svg',
      reverse: false,
      disabled: false,
      onClick: () => {
        validateNavegationViewBack()
      },

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
        router.back();
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
        className: "blue",
        text: "finalize",
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
        onClick: () => {
          closeModalAlert()
        },
      },
      dataText: {
        classText: "",
        text: "",
        disabled: false,
        onClick: () => { },
      },
    },
  })
}

function getUserLogged() {
  dataProfile.idDataLoading = true;
  UserService.getMe()
    .then((response: any) => {
      dataProfile.idDataLoading = false;

      userId.value = response.id;
      getUserData(response.id);
    })
    .catch((error: any) => {
      console.error(error);
      dataProfile.idDataLoading = false;
      openModalAlert(error.response.data.error.details[0]);
    })
}
async function getUserData(id: any) {
  UserService.getUser(id)
    .then((response: any) => {
      dataProfile.form = {
        profile_picture: response.profile_picture,
        first_name: response.first_name,
        second_name: response.second_name,
        last_name: response.last_name,
        second_last_name: response.second_last_name,
        identification_type: response.identification_type.code,
        identification_number: response.identification_number,
        country: response.country?.id ?? '',
        statedepartment: response?.department?.id || '',
        city: response?.city?.id || '',
        email: response?.email,
      }
    })
    .catch((error: any) => {
      console.error(error);
      openModalAlert(error.response.data.error.details[0]);
    })

}

function validateNavegationViewNext() {
  switch (dataProfile.stateForm) {
    case true:
      saveUserData()
      break;
    case false:
      setStateEdit()
      break;
  }
}
function validateNavegationViewBack() {
  switch (dataProfile.stateForm) {
    case true:
      setCancelEdit()
      break;
    case false:
      router.back();
      break;
  }
}

function setStateEdit() {
  dataProfile.stateForm = true;
  dataProfile.dataButtonGoToNext.text = 'save';
  dataProfile.dataButtonGoToNext.url = '/Buttons/icon-save.svg';
  dataProfile.dataButtonGoToBack.text = 'cancel';
  dataProfile.dataButtonGoToBack.url = '/Buttons/decline.svg';
  dataProfile.dataButtonGoToBack.iconSize = 'short';
}
function setCancelEdit() {
  dataProfile.stateForm = false;
  dataProfile.dataButtonGoToNext.text = 'edit';
  dataProfile.dataButtonGoToNext.url = '/Buttons/icon-edit.svg';
  dataProfile.dataButtonGoToBack.text = 'back';
  dataProfile.dataButtonGoToBack.url = '/Buttons/left-arrow.svg';
  dataProfile.dataButtonGoToBack.iconSize = null;
}

function saveUserData() {
  if (FormValidators.getValidationForm('profile__wrapper__container')) {
    dataProfile.stateLoad = true;
    dataProfile.stateForm = false;
    const formData: any = new FormData();
    dataProfile.form
    formData.append('first_name', dataProfile.form.first_name)
    formData.append('second_name', dataProfile.form.second_name)
    formData.append('last_name', dataProfile.form.last_name)
    formData.append('second_last_name', dataProfile.form.second_last_name)
    formData.append('identification_type', dataProfile.form.identification_type)
    formData.append('identification_number', dataProfile.form.identification_number)
    formData.append('country', dataProfile.form.country)
    formData.append('department', dataProfile.form.statedepartment)
    formData.append('city', dataProfile.form.city)
    formData.append('email', dataProfile.form.email)
    formData.append('profile_picture', isUrl(dataProfile.form.profile_picture) ? dataProfile.form.profile_picture : store.base64ToFile(dataProfile.form.profile_picture))


    UserService.saveData(formData, userId.value)
      .then((response: any) => {
        dataProfile.stateLoad = false;
        openModalConfirmation('the_user_data_was_saved_succesfully');
      })
      .catch((error: any) => {
        console.error(error);

        openModalAlert(error.response.data.error.details[0]);
      })
  } else {
    openModalAlert('empty_inputs')
  }
}

function openModalConfirmation(text: string): void {
  dataProfile.dataModalConfirmation.isActive = 'show';
  dataProfile.dataModalConfirmation.dataText.text = text;
}
function closeModalConfirmation() {
  dataProfile.dataModalConfirmation.isActive = 'hidde';
  statesBack();
}

function openModalAlert(text: string): void {
  dataProfile.dataModalAlert.isActive = 'show';
  dataProfile.dataModalAlert.dataText.text = text;
  dataProfile.stateLoad = true;

}
function closeModalAlert() {
  dataProfile.dataModalAlert.isActive = 'hidde';
  dataProfile.stateLoad = false;
}


function statesBack() {
  Object.assign(dataProfile, setDataProfile());
  callServices();
}
function isUrl(string: any) {
  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(:[0-9]{1,5})?(\/.*)?$/;

  const isBase64 = /^(data:image\/[a-zA-Z]+;base64,)/.test(string);

  return urlPattern.test(string) && !isBase64;
}

</script>



<style scoped src="./Profile.page.scss"></style>