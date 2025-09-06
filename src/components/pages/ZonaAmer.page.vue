<template>
  <main class="wrapper">
    <h1>YOLO + Vue Demo</h1>
    <section class="wrapper__camera">
      <div class="container-camera">
        <div class="bg-front-camera"></div>
        <video ref="video" autoplay playsinline></video>
      </div>
      <canvas ref="canvas" class="hidden"></canvas>
    </section>
    <div class="container-nav">
      <div v-if="detections.length" class="list-details">
        <h3>Detecciones:</h3>
        <ul>
          <li v-for="(d, i) in detections" :key="i">
            {{ d.class }} ({{ (d.confidence * 100).toFixed(1) }}%)
          </li>
        </ul>
      </div>

      <div class="container-buttons">

        <button
          @click="startCamera"
          class="bg-blue-500 text-white px-4 py-2 rounded"
        >
          🎥 Iniciar Cámara
        </button>
        <button
          @click="capturePhoto"
          class="bg-green-500 text-white px-4 py-2 rounded"
        >
          📸 Tomar Foto
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";

const video = ref<HTMLVideoElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const detections = ref<any[]>([]);

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (video.value) {
      video.value.srcObject = stream;
    }
  } catch (err) {
    alert("No se pudo acceder a la cámara");
    console.error(err);
  }
};

const capturePhoto = async () => {
  if (!video.value || !canvas.value) return;

  const ctx = canvas.value.getContext("2d");
  if (!ctx) return;

  // Ajustar tamaño del canvas al video
  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;

  // Dibujar el frame actual del video en el canvas
  ctx.drawImage(video.value, 0, 0);

  // Convertir a blob (imagen)
  canvas.value.toBlob(async (blob) => {
    if (!blob) return;

    const formData = new FormData();
    formData.append("file", blob, "photo.jpg");

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      detections.value = data.detections || [];
    } catch (err) {
      console.error("Error enviando imagen:", err);
    }
  }, "image/jpeg");
};
</script>

<style scoped>
video {
  width: 30rem;
  object-fit: contain;
  height: 22.5rem;
  background-color: gray;
}

.container-camera {
  position: relative;
  width: 30rem;
  height:22.5rem;
}
.bg-front-camera {
  position: absolute;
    width: 45%;
    height: 17rem;
    border-radius: 50%;
    margin: 9% 27%;
    border: 2px solid rgb(0, 138, 115);
    /* box-sizing: border-box; */
    top: 0%;
    left: 0%;
}
.wrapper__camera {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}


.wrapper {
  display: flex;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  gap: 5rem;
  flex-direction: column;
  align-items: center;
}
canvas {
  width: 30rem;
  height: 22.5rem;
  background-color: gray;
  object-fit: contain;
}

.container-nav{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}

.list-details{
  width: 100%;
  justify-content: center;
  align-items: center;
  display:flex ;
  flex-direction: column;
  padding: 1rem;
  gap: .5rem;
      box-sizing: border-box;

}

.container-buttons{
  display: flex;
  flex-direction: row;
  gap: .5rem;
}
</style>
