<template>
  <section class="dual-cameras">
    <div class="camera">
      <h3>😄 Detector de sonrisa</h3>
      <video ref="videoSmile" autoplay playsinline></video>
      <canvas ref="canvasSmile"></canvas>
      <p v-if="sonrisaDetectada">✅ Sonriendo</p>
      <p v-else>🙂 No estás sonriendo</p>
    </div>
    <div class="camera">
      <h3>🧬 Landmarks completos</h3>
      <video ref="videoFull" autoplay playsinline></video>
      <canvas ref="canvasFull"></canvas>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const videoSmile = ref<HTMLVideoElement | null>(null);
const canvasSmile = ref<HTMLCanvasElement | null>(null);
const videoFull = ref<HTMLVideoElement | null>(null);
const canvasFull = ref<HTMLCanvasElement | null>(null);
const sonrisaDetectada = ref(false);
declare global {
  interface Window {
    FaceMesh: any;
    Camera: any;
  }
}
onMounted(() => {
  if (!videoSmile.value || !canvasSmile.value || !videoFull.value || !canvasFull.value) return;

const faceMesh = new window.FaceMesh({
  locateFile: (file:any) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
});
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  faceMesh.onResults((results:any) => {
    const ctxSmile = canvasSmile.value!.getContext("2d");
    ctxSmile?.clearRect(0, 0, canvasSmile.value!.width, canvasSmile.value!.height);
    if (ctxSmile && results.multiFaceLandmarks?.length) {
      const landmarks = results.multiFaceLandmarks[0];
      const p13 = landmarks[13], p14 = landmarks[14], p78 = landmarks[78], p308 = landmarks[308];
      if (p13 && p14 && p78 && p308) {
        const verticalDistance = Math.abs(p13.y - p14.y);
        const horizontalDistance = Math.abs(p78.x - p308.x);
        sonrisaDetectada.value = verticalDistance > 0.003 && horizontalDistance > 0.065;
        [p13, p14, p78, p308].forEach(p => {
          ctxSmile.beginPath();
          ctxSmile.arc(p.x * canvasSmile.value!.width, p.y * canvasSmile.value!.height, 2, 0, 2 * Math.PI);
          ctxSmile.fillStyle = 'red';
          ctxSmile.fill();
        });
      } else {
        sonrisaDetectada.value = false;
      }
    } else {
      sonrisaDetectada.value = false;
    }

    const ctxFull = canvasFull.value!.getContext("2d");
    ctxFull?.clearRect(0, 0, canvasFull.value!.width, canvasFull.value!.height);
    if (ctxFull && results.multiFaceLandmarks?.length) {
      results.multiFaceLandmarks[0]?.forEach((p:any) => {
        ctxFull.beginPath();
        ctxFull.arc(p.x * canvasFull.value!.width, p.y * canvasFull.value!.height, 1.5, 0, 2 * Math.PI);
        ctxFull.fillStyle = "green";
        ctxFull.fill();
      });
    }
  });

const camera = new window.Camera(videoSmile.value, {
  onFrame: async () => {
    if (videoFull.value) videoFull.value.srcObject = videoSmile.value!.srcObject;
    await faceMesh.send({ image: videoSmile.value! });
  },
  width: 640,
  height: 480,
});

camera.start().catch((err: any) => {
  console.error("❌ No se pudo iniciar la cámara:", err);
});
});
</script>
<style src="./CameraBiometric.organism.scss"></style>
    