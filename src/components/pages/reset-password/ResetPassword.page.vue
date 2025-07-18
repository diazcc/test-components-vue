<!-- todo ### COMPONENT RESETPASSWORD ###-->
<!--
TODO  ¡¡Developer Conditions!!:
    - just define variables for be used. 
    - With the structure json variable,just could call inside them 
      functions defined on this component page, don't be create or do
      functionality on the structure json variable.
-->
<template>
  <ResetPasswordTemplate :dataResetPasswordTemplate="dataResetPasswordTemplate" />
</template>

<script setup lang="ts">
/**
 * *IMPORTS - calls all components. functions or variables for be used. 
*/

import ResetPasswordTemplate from '../../templates/reset-password/ResetPassword.template.vue';
import UserServices from '../../../services/UserServices';
import FormValidators from '../../../validators/FormValidators';
import { useRouter } from 'vue-router';
import { reactive, onMounted, onBeforeMount, onUnmounted, ref } from 'vue';
/** 
*  *VARIABLES -----
*/
const router = useRouter();
const data = ref()

const dataResetPasswordTemplate = reactive({
  dataTitle: {
    classTitle: 'center',
    text: 'start_new_password',
    disabled: false,
    onClick: () => { }
  },
  dataText: {
    classText: 'center',
    text: 'introduce_code',
    disabled: false,
    onClick: () => { }
  },
  dataCardResetPassword: {
    dataInputEmail: {
      id: '',
      name: 'email',
      classInput: '',
      model: '',
      type: 'email',
      placeholder: 'email',
      disabled: false,
      required: true,
      onClick: () => { }
    },
    dataInputVerificationCode: {
      id: '',
      name: 'code',
      classInput: '',
      model: '',
      type: 'text',
      placeholder: 'verification_code',
      disabled: false,
      required: true,
      onClick: () => { }
    },
    dataInputNewPassword: {
      id: '',
      name: 'new password',
      classInput: '',
      model: '',
      type: 'password',
      placeholder: 'start_new_password',
      disabled: false,
      required: true,
      onClick: () => { }
    },
    dataInputConformationPassword: {
      id: '',
      name: 'confirmation password',
      classInput: '',
      model: '',
      type: 'password',
      placeholder: 'Confirmacion',
      disabled: false,
      required: true,
      onClick: () => { }
    },
    dataButton: {
      className: 'blue button',
      text: 'validate',
      disabled: false,
      onClick: () => { validate() }
    }
  },
  state: "",
  dataButtonGoToNext: {
    className: "blue",
    text: "following",
    disabled: false,
    onClick: () => {
    },
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
        dataResetPasswordTemplate.dataModalConfirmation.isActive = "hidde";
      },
    },
  },
  dataModalAlert: {
    isActive: '',
    dataButton: {
      className: '',
      text: 'Inicio de sesión',
      disabled: false,
      onClick: () => { }
    },
    dataText: {
      classText: '',
      text: 'Esta es la descripcion',
      disabled: false,
      onClick: () => { }
    }
  },
});


/** 
*  Todo ALL FUNCTIONS
*/

//LIFECYCLE COMPONENT
// Lifecycle hook: executed before the component is mounted to the DOM
onBeforeMount(() => {

});

// Lifecycle hook: executed when the component is mounted to the DOM
onMounted(() => {

  /**
   * ?On this function try to just call function that you need, do not create code. 
   */

  window.addEventListener('keypress', handleEnterKey);// add event listener for press key enter
});


// Lifecycle hook: executed after the component is unmounted
onUnmounted(() => {
  window.removeEventListener('keypress', handleEnterKey);//must be remove listener
});


//FUNCTIONS DEVELOPER

/** 
 * TODO Start section for set default data components. 
 * */


/** 
 * TODO SET AND GETS 
 * */


/** 
 * TODO: End section for set default data components. 
 * */


/** 
 * TODO OTHERS METHODS 
 * */
async function validate() {

  const email = dataResetPasswordTemplate.dataCardResetPassword.dataInputEmail.model
  const verification_code = dataResetPasswordTemplate.dataCardResetPassword.dataInputVerificationCode.model
  const new_password = dataResetPasswordTemplate.dataCardResetPassword.dataInputNewPassword.model
  const confirmation_password = dataResetPasswordTemplate.dataCardResetPassword.dataInputConformationPassword.model

  if (FormValidators.getValidationForm('card-resetpassword-normal')) {
    await UserServices.resetPassword(email, verification_code, new_password, confirmation_password)
      .then(() => {
        dataResetPasswordTemplate.dataModalConfirmation = {
          isActive: "show",
          dataText: {
            classText: "big",
            text: "the_password_was_changed",
            disabled: false,
            onClick: () => { },
          },
          dataButton: {
            className: "blue",
            text: "continue",
            disabled: false,
            onClick: () => {
              dataResetPasswordTemplate.dataModalConfirmation.isActive = "hidde";
              dataResetPasswordTemplate.state = "";
              dataResetPasswordTemplate.dataButtonGoToNext.text = "create_radicated";
              router.push('/login/')
            },
          },
        };
      })
      .catch((error) => {
        if (error.status == "error" || error.status_code == 400) {
          dataResetPasswordTemplate.dataModalAlert = {
            isActive: 'show',
            dataButton: {
              className: 'blue',
              text: 'Cerrar',
              disabled: false,
              onClick: () => { dataResetPasswordTemplate.dataModalAlert.isActive = 'hidde' }
            },
            dataText: {
              classText: 'center',
              text: error.error.details[0],
              disabled: false,
              onClick: () => { }
            }
          }
        }
      });
  } else {
    dataResetPasswordTemplate.dataModalAlert = {
      isActive: 'show',
      dataButton: {
        className: 'blue',
        text: 'Cerrar',
        disabled: false,
        onClick: () => { dataResetPasswordTemplate.dataModalAlert.isActive = 'hidde' }
      },
      dataText: {
        classText: 'center',
        text: 'Al parecer no has llenado todos los campos',
        disabled: false,
        onClick: () => { }
      }
    }
  }
}

function handleEnterKey(event: any) {
  if (event.key === "Enter") {
    validate()
  }
}

/** 
 * TODO VALIDATORS 
 * */

</script>
<!-- This componnet cannot have styles, just develop logic -->
<style scoped src="./ResetPassword.page.scss"></style>