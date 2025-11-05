<template>
  <LoginTemplate :dataLogin="dataLogin" />
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import LoginTemplate from '../../templates/login/Login.template.vue';
import { useRoute, useRouter } from 'vue-router';
import LoginService from '../../../services/testService';
import ExternalUserService from '../../../services/ExternalUserServices.ts'
import UserService from '../../../services/UserServices.ts'
import FormValidators from '../../../validators/FormValidators.ts';

const router: any = useRouter();
const route = useRoute();
const param : string | string[] = route.params?.user; 
const dataLogin = reactive({
  stateLogin: '', //  empty == Normal view - 'tenant' == External user view
  stateForm: true,
  visible: false,
  stateChoiseTypePerson: '001',
  dataTitle: {
    classTitle: 'center title--white',
    text: 'login',
    disabled: false,
    onClick: () => { }
  },
  dataCardOptionLogin: {
    state: false,
    dataImg: {
      id: '',
      name: '',
      class: 'icon-login',
      src: '/icon-login-usuario-contrasena.svg',
      type: '',
      alt: '',
      onClick: () => { }
    },
    dataText: {
      classText: '',
      text: 'login',
      disabled: false,
      onClick: () => { }
    },
    onClick: () => {
      setOptionLogin();
    }
  },
  dataCardOptionRegister: {
    state: false,
    dataImg: {
      id: '',
      name: '',
      class: 'icon-login',
      src: '/icon-login-id-biometrica.svg',
      type: '',
      alt: '',
      onClick: () => { }
    },
    dataText: {
      classText: '',
      text: 'register',
      disabled: false,
      onClick: () => { }
    },
    onClick: () => {
      setOptionRegister();
    }
  },
  dataInputEmail: {
    id: '',
    name: '',
    classInput: '',
    model: '',
    type: 'text',
    placeholder: 'email',
    disabled: false,
    required: true,
    onClick: () => { }
  },
  dataInputPassword: {
    id: '',
    name: 'password',
    classInput: '',
    model: '',
    type: 'password',
    placeholder: 'password',
    disabled: false,
    required: true,
    onClick: () => { }
  },
  dataInputName: {
    id: '',
    name: '',
    classInput: '',
    model: '',
    type: 'text',
    placeholder: 'name',
    disabled: false,
    required: true,
    onClick: () => { }
  },
  dataInputLastName: {
    id: '',
    name: '',
    classInput: '',
    model: '',
    type: 'text',
    placeholder: 'last_name',
    disabled: false,
    required: true,
    onClick: () => { }
  },
  dataInputBusinessName: {
    id: '',
    name: '',
    classInput: '',
    model: '',
    type: 'text',
    placeholder: 'business_name',
    disabled: false,
    required: true,
    onClick: () => { }
  },
  dataInputNit: {
    id: '',
    name: '',
    classInput: '',
    model: '',
    type: 'text',
    placeholder: 'nit',
    disabled: false,
    required: true,
    onClick: () => { }
  },
  dataInputPhone: {
    id: '',
    name: '',
    classInput: '',
    model: '',
    type: 'text',
    placeholder: 'phone',
    disabled: false,
    required: true,
    onClick: () => { }
  },
  dataInputId: {
    id: '',
    name: '',
    classInput: '',
    model: '',
    type: 'text',
    placeholder: 'id',
    disabled: false,
    required: true,
    onClick: () => { }
  },
  dataButton: {
    className: 'blue',
    text: 'login',
    disabled: false,
    onClick: () => {
      validationSubmit();
    }
  },
  dataModalAlert: {
    isActive: '',
    dataButton: {
      className: 'blue',
      text: 'continue',
      disabled: false,
      onClick: () => { dataLogin.dataModalAlert.isActive = 'hidde' }
    },
    dataText: {
      classText: '',
      text: 'Esta es la descripcion',
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
        closeModalConfirmation()
      }
    },
    dataText: {
      classText: '',
      text: 'Usuario creado correctamente.',
      disabled: false,
      onClick: () => { }
    }
  },
  redirectFiling:()=>{
    router.push('/filing');
  },
  sendVerificationCode: () => {
    router.push('/send-verification')
  },
});

/**
 * todo  #########  Life Cycles #########
 */
onMounted(() => {
  // setOptionLogin();
  window.addEventListener('keydown', handleEnterKey);
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEnterKey);
});

/**
 * todo  #########  WATCHS #########
 */

watch(() => dataLogin.stateForm, (newValue: boolean, oldValue: boolean) => {
  resetStatesForm();
});

function setOptionRegister() {
  dataLogin.stateForm = false;
  dataLogin.dataCardOptionRegister.dataImg.src = '/icon-login-id-biometrica-white.svg';
  dataLogin.dataCardOptionRegister.state = true;
  dataLogin.visible = true;
  dataLogin.dataCardOptionLogin.dataImg.src = '/icon-login-usuario-contrasena.svg';
  dataLogin.dataCardOptionLogin.state = false;
  dataLogin.dataTitle.text = 'register';
  dataLogin.dataButton.text = 'register';
}

function setOptionLogin() {
  dataLogin.stateForm = true;
  dataLogin.dataCardOptionLogin.dataImg.src = '/icon-login-usuario-contrasena-white.svg';
  dataLogin.dataCardOptionLogin.state = true;
  dataLogin.dataCardOptionRegister.dataImg.src = '/icon-login-id-biometrica.svg';
  dataLogin.dataCardOptionRegister.state = false;
  dataLogin.dataTitle.text = 'login'
  dataLogin.dataButton.text = 'login';
  dataLogin.visible = true;

}

function resetStatesForm() {
  dataLogin.dataInputEmail.model = '';
  dataLogin.dataInputPassword.model = '';
  dataLogin.dataInputName.model = '';
  dataLogin.dataInputLastName.model = '';
  dataLogin.dataInputId.model = '';
  dataLogin.dataInputBusinessName.model = '';
  dataLogin.dataInputPhone.model = '';
}

const handleEnterKey = (event:KeyboardEvent) =>  event.key == 'Enter' && validationSubmit(); // VALIDATION ENTER KEY ON ONLY VIEW LOGIN PAGE

function validationSubmit() {
  switch (dataLogin.stateForm) {
    case true:
      FormValidators.getValidationForm('login__wrapper__content__form') ? login() : openModalAlert('empty_inputs');
      break;
    case false:
      FormValidators.getValidationForm('login__wrapper__content__form--register') ? sendDataRegister() : openModalAlert('empty_inputs');
      break;
    default:
      break;
  }
}

function openModalAlert(key_mssg: string) {
  dataLogin.dataModalAlert.dataText.text = key_mssg;
  dataLogin.dataModalAlert.isActive = 'show';
}

function closeModalConfirmation() {
  dataLogin.dataModalConfirmation.isActive = 'hidde';
}

const getValidationTenant = (param: string | string[]):void=>{ (param || param.length>0 )  ? dataLogin.stateLogin = 'user' : ''};

function sendDataRegister() {
  const formData = new FormData;

  formData.append('person_type', dataLogin.stateChoiseTypePerson);
  formData.append('email', dataLogin.dataInputEmail.model);
  formData.append('password', dataLogin.dataInputPassword.model);
  formData.append('phone_number', dataLogin.dataInputPhone.model);

  if (dataLogin.stateChoiseTypePerson == '001') {
    formData.append('first_name', dataLogin.dataInputName.model);
    formData.append('last_name', dataLogin.dataInputLastName.model);
    formData.append('identification_number', dataLogin.dataInputId.model);
  }

  if (dataLogin.stateChoiseTypePerson == '002') {
    formData.append('contact_name', dataLogin.dataInputBusinessName.model);
    formData.append('nit_number', dataLogin.dataInputNit.model);
  }

  const formObject = Object.fromEntries(formData.entries());

  ExternalUserService.sendExternalUser(formData)
    .then(async (response) => {
      dataLogin.dataModalConfirmation.isActive = 'show'
    })
    .catch((error) => {
      console.error(error);
      dataLogin.dataModalAlert = {
        isActive: 'show',
        dataButton: {
          className: 'blue',
          text: 'close',
          disabled: false,
          onClick: () => { dataLogin.dataModalAlert.isActive = 'hidde' }
        },
        dataText: {
          classText: 'center',
          text: error.error.details[0],
          disabled: false,
          onClick: () => { }
        }
      }
    });
}

async function login() {
  try {
    // Call method where get service to post data and check user.

    const success = await UserService.login(dataLogin.dataInputEmail.model, dataLogin.dataInputPassword.model);
    console.log(success,' ssss');
      router.push('/home/dashboard');//Redirect if the user was checked. 
    console.log(' sisa');


  } catch (error) {
    console.error('Error en el inicio de sesión:', error);

    dataLogin.dataModalAlert = {
      isActive: 'show',
      dataButton: {
        className: 'blue',
        text: 'close',
        disabled: false,
        onClick: () => { dataLogin.dataModalAlert.isActive = 'hidde' }
      },
      dataText: {
        classText: 'center',
        text: 'incorrect_credentials',
        disabled: false,
        onClick: () => { }
      }
    }
  }
}

</script>
<style scoped src="./Login.page.scss"></style>