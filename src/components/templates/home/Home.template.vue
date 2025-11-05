<template>
  <main class="home">
    <header class="home__header">
     <!--  <div class="home__header__info-creator">
        <p class="home__header__info-creator__name">Andres Diaz Castillo</p>
        <p class="home__header__info-creator__email">diazccx@gmail.com</p>
        <p class="home__header__info-creator__handle">@diazcc</p>
      </div>
      <h1 class="home__header__title">COMPONENTES</h1>
      <nav class="home__header__nav">
        <a class="home__header__nav__link">Editor de PDF</a>
        <a class="home__header__nav__link">Posicionamiento de firma</a>
        <a class="home__header__nav__link">Gestor documental por API (Frontend Vue)</a>
      </nav> -->
      <form @submit.prevent="dataHome.sendFile">
        <label>Nombre Usuario:</label>
        <input type="text" v-model="dataHome.name" class="input input--form">

        <label>Correo Electrónico:</label>
        <input type="email" v-model="dataHome.email" class="input input--form">

        <label>Contraseña:</label>
        <input type="password" v-model="dataHome.password" class="input input--form">
        <input type="file" ref="fileInput" @change="handleFile" accept=".pdf" />

        <button type="submit">Enviar</button>
      </form>
      <button v-if="dataHome.urlPdf" @click="downloadPdf">Descargar PDF</button>
    </header>
    <a :href="dataHome.urlPdf" download="documento.pdf">{{ dataHome.url  }}</a>
    {{ dataHome }}
   <!--  <section class="home__header___content">
      <CameraBiometric />
    </section> -->
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CameraBiometric from "../../organisms/camera-biometric/CameraBiometric.organism.vue";
import BackgroundFlashingOrganism from "../../organisms/backgrounds/BackgroundFlashing.organism.vue";
import { accessStore } from "../../../store";
import axios from "axios";
const props :any = defineProps(['dataHome']);
const fileInput = ref(null);
const pdfUrl = ref("");
const selectedMode = ref("");
const store :any = accessStore();
const file = ref<File | null>(null);
const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0];
    sendFile();
  }
};

const sendFile = async () => {
  if (!file.value) return alert("Selecciona un archivo PDF");

  const formData = new FormData();
  formData.append("file", file.value); // 👈 aquí debe ir file.value, no el store

  try {
    const res = await axios.post("https://documental-flow.onrender.com/upload-pdf", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log(res.data, "respuesta");
    store.addUploadedFile({
      name: file.value.name,
      url: res.data.url
    });
    console.log(store.uploadedFiles, "store.addUploadedFile");
props.dataHome.urlPdf=res.data.url;
  } catch (err) {
    console.error(err);
  }
};
const downloadPdf = async () => {
  if (!props.dataHome.urlPdf) return;

  const response = await fetch(props.dataHome.urlPdf);
  const blob = await response.blob();

  // Asegurarte de que sea tipo PDF
  const pdfBlob = new Blob([blob], { type: "application/pdf" });

  const url = window.URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "documento.pdf"; // Nombre del archivo
  link.click();
  window.URL.revokeObjectURL(url);
};

</script>
<style src="./Home.template.scss"></style>
