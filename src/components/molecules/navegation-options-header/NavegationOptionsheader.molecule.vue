<!-- 

    dataNavegationOptionsHeader: {
      enable: true,
      dataCardNotificationsGeneral: {
        isActive: false,

        dataText: {
          classText: "",
          text: "",
          disabled: false,
          onClick: () => { router.push('home/correspondence') },
        },
        dataImg: {
          id: "",
          name: "",
          class: " icon",
          src: "/icon-header-calendario.svg",
          type: "png",
          alt: "",
          onClick: () => { },
        },
        onClick: () => {
          router.push('/home/dashboard')

        }
      },
    },
 -->
<template>
  <ul class="navegation-options-header" v-if="dataNavegationOptionsHeader.enable">

    <CardNotifications :dataCardNotifications="dataNavegationOptionsHeader.dataCardNotificationsCalendar" />

    <!-- Temporal elimination in case is needed again -->
    <!-- <CardNotifications :dataCardNotifications="dataNavegationOptionsHeader.dataCardNotificationsInbox" /> -->
    <div class="navegation-options-header__relative">
      <CardNotifications
        :class="signal ? 'navegation-options-header__flashing' : ''" :dataCardNotifications="dataNavegationOptionsHeader.dataCardNotificationsGeneral"  id="cardCardNotificationsGeneral"/>
      <p v-if="signal" class="navegation-options-header__alert">+</p>
    </div>

    <CardNotifications :dataCardNotifications="dataNavegationOptionsHeader.dataCardNotificationsConfig"
      id="cardNotificationsConfig" />

    <PopUpNotificationOrganism :dataPopUpNotification="dataPopUpNotification" @emitMessageSignal="activateSignalAndMovement()"/>

  </ul>
</template>

<script setup lang="ts">
import PopUpNotificationOrganism from "../../organisms/notification/pop-up-notification/PopUpNotification.organism.vue";
import CardNotifications from "../../molecules/card-notifications/CardNotifications.molecule.vue";
import { reactive, ref } from "vue";

const signal: any = ref(true);
const audio: any = ref<HTMLAudioElement | null>(null);
const props : any = defineProps(['dataNavegationOptionsHeader']);
const dataPopUpNotification: any = reactive({
  isActive: true,
  isList: false,
})

props.dataNavegationOptionsHeader.dataCardNotificationsGeneral.onClick = () => {
  signal.value = false;
  dataPopUpNotification.isList = !dataPopUpNotification.isList
  dataPopUpNotification.isActive = !dataPopUpNotification.isActive;
}

function activateSignalAndMovement() {
  if(!signal.value) {
    signal.value = true;
    playSound();
  }
}

function playSound() {
  if (!audio.value) {
    audio.value = new Audio('/sounds/newMessage.mp3'); // Ruta del archivo de sonido
  } else {
    audio.value.pause();
    audio.value.currentTime = 0;
  }
  audio.value.play();
}

</script>

<style scoped src="./NavegationOptionsheader.molecule.scss"></style>