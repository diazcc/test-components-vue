<!-- todo ### COMPONENT RESETPASSWORD ###-->
<!--
TODO  ¡¡Developer Conditions!!:
    - just define variables for be used. 
    - With the structure json variable,just could call inside them 
      functions defined on this component page, don't be create or do
      functionality on the structure json variable.
-->
<template>
  <SendVerificationCode :dataSendVerificationCode="dataSendVerificationCodeTemplate" />
</template>

<script setup lang="ts">
/**
 * *IMPORTS - calls all components. functions or variables for be used. 
*/

import SendVerificationCode from '../../templates/send-verification-code/SendVerificationCode.template.vue';
import UserServices from '../../../services/UserServices';
import { useRouter } from 'vue-router';
import { reactive, onMounted, onBeforeMount, onUnmounted, ref } from 'vue';
import FormValidators from '../../../validators/FormValidators';

/** 
*  *VARIABLES -----
*/
const router = useRouter();
const domain = window.location.origin

const dataSendVerificationCodeTemplate = reactive({
  dataText: {
    classText: 'center',
    text: 'send_verification_code_message',
    disabled: false,
    onClick: () => { }
  },
  CardSendVerificationCode: {
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
        dataSendVerificationCodeTemplate.dataModalConfirmation.isActive = "hidde";
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
 * TODO Start section for set default data components
*/

/** 
 * TODO SET AND GETS 
*/

/** 
 * TODO: End section for set default data components
*/

/** 
 * TODO OTHERS METHODS 
*/

async function validate() {

  const email = dataSendVerificationCodeTemplate.CardSendVerificationCode.dataInputEmail.model

  if (FormValidators.getValidationForm('card-cardsendverificationcode-normal')) {
    await UserServices.sendVerificationCode(email, domain, domain + "/new-password")
      .then(() => {
        dataSendVerificationCodeTemplate.dataModalConfirmation = {
          isActive: "show",
          dataText: {
            classText: "big",
            text: "verification_code_sent_successfully",
            disabled: false,
            onClick: () => { },
          },
          dataButton: {
            className: "blue",
            text: "continue",
            disabled: false,
            onClick: () => {
              dataSendVerificationCodeTemplate.dataModalConfirmation.isActive = "hidde";
              dataSendVerificationCodeTemplate.state = "";
              dataSendVerificationCodeTemplate.dataButtonGoToNext.text = "create_radicated";
              router.push('new-password/')
            },
          },
        };
      })
      .catch((error) => {
        if (error.status == "error" || error.status_code == 400) {
          dataSendVerificationCodeTemplate.dataModalAlert = {
            isActive: 'show',
            dataButton: {
              className: 'blue',
              text: 'Cerrar',
              disabled: false,
              onClick: () => { dataSendVerificationCodeTemplate.dataModalAlert.isActive = 'hidde' }
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
    dataSendVerificationCodeTemplate.dataModalAlert = {
      isActive: 'show',
      dataButton: {
        className: 'blue',
        text: 'Cerrar',
        disabled: false,
        onClick: () => { dataSendVerificationCodeTemplate.dataModalAlert.isActive = 'hidde' }
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
<style scoped src="./SendVerificationCode.page.scss"></style>