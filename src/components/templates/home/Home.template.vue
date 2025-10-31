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
      <form action="">

        <label for="">Nombre Usaurio:</label>
        <input type="text" class="input input--form">
        <label for="">Contrasenia:</label>
        <input type="text" class="input input--form">
        <button >Enviar</button>
      </form>
    </header>
   <!--  <section class="home__header___content">
      <CameraBiometric />
    </section> -->
      {{ typeof dataHome.data }}
      {{ dataHome.data }}
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CameraBiometric from "../../organisms/camera-biometric/CameraBiometric.organism.vue";
import BackgroundFlashingOrganism from "../../organisms/backgrounds/BackgroundFlashing.organism.vue";
const props :any = defineProps(['dataHome']);
const selectedMode = ref("");
</script>
<style src="./Home.template.scss"></style>
