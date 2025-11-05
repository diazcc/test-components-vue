<template>
  <article
    :class="
      'pop-up-notification pop-up-notification--' + (dataPopUpNotification.isList ? 'list' : '')
    "
    :style="{
      opacity: dataPopUpNotification.isActive ? '1' : '0',
      visibility: dataPopUpNotification.isActive ? 'visible' : 'hidden',
    }"
  >
    <section class="pop-up-notification__header">
      <h3 class="pop-up-notification__header__title">
        {{ dataPopUpNotification.isList ? t("notifications") : t("notification") }}
      </h3>
      <Img class="pop-up-notification__header__close" :dataImg="dataImgGoBack" />
    </section>
    <p class="pop-up-notification__content" @click="redirectTo" v-if="!dataPopUpNotification.isList">
      {{ notificationText }}
    </p>
    <ul class="pop-up-notification__list" v-else>
      <li
        class="pop-up-notification__list__item"
        v-for="item in dataList"
        @click="redirectToFiling(item.record)"
      >
        <p class="pop-up-notification__list__item__date">
          {{ item.creation_date }}
        </p>
        <p class="pop-up-notification__list__item__text">
          {{
            item.user +
            " " +
            getNotificationText("user_assigned", item.filing_code) +
            ` ${t('to')} ` +
            item.user_asigned
          }}
        </p>
      </li>
    </ul>
  </article>
</template>

<script setup lang="ts">

import { accessStore } from "../../../../store";
import constants from "../../../../constants/index.js";
import { useI18n } from "vue-i18n";
import { onBeforeUnmount, onMounted, Ref, ref, watch } from "vue";
import { TypesNotifications } from "../../../../constants/TypesNotifications";
import { useRouter } from "vue-router";
import NotificationServices from "../../../../services/NotificationServices.js";
import Img from "../../../atoms/img/Img.atom.vue";

const props: any = defineProps(["dataPopUpNotification"]);
const emits: any = defineEmits(['emitMessageSignal'])
const router = useRouter();
const { t, te } = useI18n();
const store: any = accessStore();

const notificationText: Ref<string> = ref("");
const record_id: Ref<any> = ref({
  comments: "",
  creation_date: "2025-01-16",
  creation_time: "08:53:11.418736",
  description: "assigned_record",
  record: 61,
  user: "Andres Diaz",
  user_asigned: "Ernesto Munoz",
});
const dataList: Ref<any> = ref([]);
const dataImgGoBack: any = ref({
  id: '',
  name: 'back',
  class: '',
  src: '/Buttons/icon-close.svg',
  type: 'svg',
  alt: '',
  isActive: () => { },
  onClick: () => {
    closePopUp();
  }
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

async function setWebSocket(userData: any) {
  const webSocket: any = new WebSocket(constants["DEFAULT_WEB_SOCKET_URL"]);
  console.log("holaa");

  webSocket.onopen = () => {
    console.log("WebSocket connection established");
    console.log(userData);
    webSocket.send(
      JSON.stringify({
        id: userData.id,
        email: userData.email,
        role: userData.role,
      })
    );
  };

  webSocket.onmessage = (event: any) => {
    const response = JSON.parse(event.data);
    console.log(response);

    if (response.status === "success") {
      if (response.response.notification_type === "assigned_record") {
        // Construir el mensaje con el id de la respuesta
        record_id.value = response.response.record_id;
        const notificationMessage = getNotificationText(
          "user_assigned",
          response.response.record_id
        );
        notificationText.value = notificationMessage; // Asignar el mensaje a la variable
        props.dataPopUpNotification.isActive = true;
        emits('emitMessageSignal');
        deactivateAfterDelay();

        console.log(notificationText.value); // Muestra el texto asignado
      }
    } else {
      console.error("Error in WebSocket response:", response.message);
    }
  };
}

function handleClickOutside(event: MouseEvent) {
  const popUpElement = document.querySelector(".pop-up-notification");
  const elementIconButton :any = document.querySelector("#cardCardNotificationsGeneral");
  if (popUpElement && !popUpElement.contains(event.target as Node) && !elementIconButton.contains(event.target as Node)) {
    closePopUp();

  }
}

// Función para obtener el texto de la notificación
function getNotificationText(notificationType: string, recordId: string): string {
  const notification: any = TypesNotifications.find(
    (item: any) => item[notificationType]
  );
  // Agregar el ID al mensaje de la notificación
  const baseMessage = notification
    ? t(notification[notificationType])
    : t('unknown_notification');
  return `${baseMessage}: ${recordId}`;
}

function closePopUp() {
  props.dataPopUpNotification.isActive = false;
  props.dataPopUpNotification.isList = false;
}

function redirectTo() {
  router.push("/home/filing/" + record_id.value);
}

function getLastNotifications() {
  /* NotificationServices.getLastNotifications()
    .then((response: any) => {
      dataList.value = response.results;
    })
    .catch((error: any) => {
      console.error(error);
    }); */
}

function redirectToFiling(id: any) {
  router.replace("/home/filing/" + id);
  closePopUp();
}

function deactivateAfterDelay() {
  if (!props.dataPopUpNotification?.isList && props.dataPopUpNotification?.isActive) {
    setTimeout(() => {
      closePopUp();
    }, 4000);
  }
}

watch(
  () => store.userData,
  (newUserData: any) => {
    console.log(newUserData);

    if (
      newUserData &&
      newUserData.id &&
      newUserData.email &&
      newUserData.role
    ) {
      setWebSocket(newUserData);
    }
  },
  { immediate: true }
);

watch(
  () => props.dataPopUpNotification.isList,
  (newUserData: any) => {
    console.log(newUserData);
    props.dataPopUpNotification.isActive = newUserData;
    getLastNotifications();
  },
  { immediate: true }
);


</script>

<style src="./PopUpNotification.organism.scss"></style>
