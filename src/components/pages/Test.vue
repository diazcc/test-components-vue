<template>
  <main class="dual-cameras">
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
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { FaceMesh, NormalizedLandmark } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

// refs de videos y canvas
const videoSmile = ref<HTMLVideoElement | null>(null);
const canvasSmile = ref<HTMLCanvasElement | null>(null);
const videoFull = ref<HTMLVideoElement | null>(null);
const canvasFull = ref<HTMLCanvasElement | null>(null);

// estado reactivo para sonrisa
const sonrisaDetectada = ref(false);

onMounted(() => {
  if (
    !videoSmile.value ||
    !canvasSmile.value ||
    !videoFull.value ||
    !canvasFull.value
  )
    return;

  // Creamos FaceMesh
  const faceMesh = new FaceMesh({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  // Procesamos resultados
  faceMesh.onResults((results) => {
    // vista 1: solo sonrisa
    const ctxSmile = canvasSmile.value!.getContext("2d");
    ctxSmile?.clearRect(
      0,
      0,
      canvasSmile.value!.width,
      canvasSmile.value!.height
    );
    if (ctxSmile && results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
  const landmarks = results.multiFaceLandmarks[0]

  // Landmarks clave
  const p13 = landmarks[13]
  const p14 = landmarks[14]
  const p78 = landmarks[78]
  const p308 = landmarks[308]

  if (p13 && p14 && p78 && p308) {
    const verticalDistance = Math.abs(p13.y - p14.y)
    const horizontalDistance = Math.abs(p78.x - p308.x)

    // Sonrisa = boca realmente visible y boca ancha
    sonrisaDetectada.value = verticalDistance > 0.003 && horizontalDistance > 0.065

    // Dibujamos solo esos 4 puntos
    const keyPoints: NormalizedLandmark[] = [p13, p14, p78, p308]
    keyPoints.forEach(p => {
      ctxSmile.beginPath()
      ctxSmile.arc(p.x * canvasSmile.value!.width, p.y * canvasSmile.value!.height, 2, 0, 2 * Math.PI)
      ctxSmile.fillStyle = 'red'
      ctxSmile.fill()
    })
  } else {
    sonrisaDetectada.value = false
  }
} else {
  sonrisaDetectada.value = false
}

    // vista 2: todos los landmarks
    const ctxFull = canvasFull.value!.getContext("2d");
    ctxFull?.clearRect(0, 0, canvasFull.value!.width, canvasFull.value!.height);
    if (
      ctxFull &&
      results.multiFaceLandmarks &&
      results.multiFaceLandmarks.length > 0
    ) {
      const landmarks = results.multiFaceLandmarks[0];
      if (landmarks) {
        landmarks.forEach((p) => {
          ctxFull.beginPath();
          ctxFull.arc(
            p.x * canvasFull.value!.width,
            p.y * canvasFull.value!.height,
            1.5,
            0,
            2 * Math.PI
          );
          ctxFull.fillStyle = "green";
          ctxFull.fill();
        });
      }
    }
  });

  // Usamos una sola cámara real para ambas vistas
  const camera = new Camera(videoSmile.value, {
    onFrame: async () => {
      // copiamos el frame en videoFull también
      if (videoFull.value) {
        videoFull.value.srcObject = videoSmile.value!.srcObject;
      }
      await faceMesh.send({ image: videoSmile.value! });
    },
    width: 640,
    height: 480,
  });

  camera.start();
});
</script>

<style scoped>
.dual-cameras {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.camera {
  position: relative;
  width: 320px;
  height: 240px;
  background: #222;
}
video,
canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 320px;
  height: 240px;
}
h3,
p {
  position: absolute;
  bottom: 4px;
  left: 4px;
  margin: 0;
  color: white;
  font-size: 0.9em;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 4px;
  border-radius: 4px;
}
</style>
