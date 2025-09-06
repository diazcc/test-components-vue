<template>
  <main class="face-verify">
    <h3>🧪 Verificación facial</h3>
    <div class="video-section">
      <div>
        <video ref="video" autoplay playsinline></video>
        <p v-if="matchResult === true">✅ Es la misma persona</p>
        <p v-else-if="matchResult === false">❌ No coincide</p>
        <p v-else>🔍 Detectando...</p>
      </div>
      <!--  <div>
        <canvas ref="landmarksCanvas" width="320" height="240"></canvas>
        <p>Landmarks FaceAPI (68 puntos)</p>
      </div> -->
      <div>
        <canvas ref="faceMeshCanvas" width="320" height="240"></canvas>
        <p>Landmarks FaceMesh (468 puntos)</p>
      </div>
    </div>
    <div class="reference-section">
      <img
        :src="referenceImgUrl"
        alt="Referencia"
        v-if="referenceImgUrl"
        width="160"
      />
      <input type="file" accept="image/*" @change="onFileChange" />
      <p>Imagen de referencia</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import * as faceapi from "face-api.js";
import { Camera } from "@mediapipe/camera_utils";
declare global {
  interface Window {
    FaceMesh: any;
  }
}
const video: any = ref<HTMLVideoElement | null>(null);
const landmarksCanvas = ref<HTMLCanvasElement | null>(null);
const faceMeshCanvas: any = ref<HTMLCanvasElement | null>(null);
const matchResult = ref<boolean | null>(null);
const referenceImgUrl = ref<string>("/fotolas.png");
const refDescriptor = ref<Float32Array | null>(null);
const glassesImg = new Image();
glassesImg.src = "/gafitas.png";
const videoRef: any = ref(null);
const canvasRef: any = ref(null);
async function loadReferenceImage(url: string) {
  const img = await faceapi.fetchImage(url);
  const detection = await faceapi
    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    console.error("❌ No se detectó rostro en la foto de referencia");
    refDescriptor.value = null;
    return;
  }
  refDescriptor.value = detection.descriptor;
}

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  referenceImgUrl.value = url;
  await loadReferenceImage(url);
}

onMounted(async () => {
  await nextTick(); // Espera a que el DOM esté listo

  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  ]);
  await loadReferenceImage(referenceImgUrl.value);

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  if (video.value) {
    video.value.srcObject = stream;
  } else {
    console.error("El elemento <video> no está disponible");
  }

  // FaceAPI detection (68 puntos)
  video.value!.addEventListener("playing", () => {
    const displaySize = { width: 320, height: 240 };
    faceapi.matchDimensions(landmarksCanvas.value!, displaySize);

    const runDetection = async () => {
      if (!video.value) return;

      const liveDetection = await faceapi
        .detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      // Limpiar canvas
      const ctx = landmarksCanvas.value!.getContext("2d");
      ctx?.clearRect(0, 0, displaySize.width, displaySize.height);
      ctx?.drawImage(video.value, 0, 0, displaySize.width, displaySize.height);

      if (liveDetection) {
        const resizedDetections = faceapi.resizeResults(
          liveDetection,
          displaySize
        );
        faceapi.draw.drawFaceLandmarks(
          landmarksCanvas.value!,
          resizedDetections
        );
        if (refDescriptor.value) {
          const distance = faceapi.euclideanDistance(
            refDescriptor.value,
            liveDetection.descriptor
          );
          matchResult.value = distance < 0.65;
        }
      } else {
        matchResult.value = null;
      }
      requestAnimationFrame(runDetection);
    };
    runDetection();
  });

  // FaceMesh detection (468 puntos) usando window.FaceMesh
  const faceMesh = new window.FaceMesh({
    locateFile: (file: any) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  });
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  faceMesh.onResults((results:any) => {
  const ctx = faceMeshCanvas.value?.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, faceMeshCanvas.value.width, faceMeshCanvas.value.height);
  ctx.drawImage(results.image, 0, 0, faceMeshCanvas.value.width, faceMeshCanvas.value.height);

  if (results.multiFaceLandmarks) {
    if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      for (const point of landmarks) {
        ctx.beginPath();
        ctx.arc(point.x * faceMeshCanvas.value.width, point.y * faceMeshCanvas.value.height, 1, 0, 1 * Math.PI);
        ctx.fillStyle = "green";
        ctx.fill();
      }
    }
  }
    for (const landmarks of results.multiFaceLandmarks) {
  // Ojos
  const leftEyeOuter = landmarks[33];   // ojo izq. extremo
  const leftEyeInner = landmarks[133];  // ojo izq. interno
  const rightEyeInner = landmarks[362]; // ojo der. interno
  const rightEyeOuter = landmarks[263]; // ojo der. extremo
  const nose = landmarks[168];

  const xLeft = leftEyeOuter.x * faceMeshCanvas.value.width;
  const yLeft = leftEyeOuter.y * faceMeshCanvas.value.height;
  const xRight = rightEyeOuter.x * faceMeshCanvas.value.width;
  const yRight = rightEyeOuter.y * faceMeshCanvas.value.height;

  // Centro entre ojos
  const centerX = (xLeft + xRight) / 2;
  const centerY = (yLeft + yRight) / 2;

  // Ángulo de inclinación (roll)
  const angle = Math.atan2(yRight - yLeft, xRight - xLeft);

  // Distancia entre ojos (para escalar las gafas)
  const eyeDist = Math.sqrt((xRight - xLeft) ** 2 + (yRight - yLeft) ** 2);
  const glassesWidth = eyeDist * 2.5;
  const glassesHeight = glassesWidth * 0.5;

  // Dibujar gafas ajustadas
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);

  if (glassesImg.complete && glassesImg.naturalWidth > 0) {
    ctx.drawImage(
      glassesImg,
      -glassesWidth / 2,
      -glassesHeight / 2,
      glassesWidth,
      glassesHeight
    );
  }
  ctx.restore();
}

  }
});


  const camera = new Camera(video.value, {
    onFrame: async () => {
      await faceMesh.send({ image: video.value });
    },
    width: 640,
    height: 480,
  });
  camera.start();

  // Helper function to draw landmarks on canvas
  function drawLandmarks(
    ctx: CanvasRenderingContext2D | null,
    landmarks: Array<{ x: number; y: number }>,
    options: { color?: string; radius?: number } = {}
  ) {
    if (!ctx) return;
    const color = options.color || "#00FF00";
    const radius = options.radius || 1;
    ctx.save();
    ctx.fillStyle = color;
    for (const point of landmarks) {
      ctx.beginPath();
      ctx.arc(point.x * 320, point.y * 240, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.restore();
  }
});
</script>

<style scoped>
.face-verify {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.video-section {
  display: flex;
  gap: 32px;
}
video,
canvas {
  width: 320px;
  height: 240px;
  background: black;
}
.reference-section {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
p {
  margin-top: 8px;
  font-size: 1.2em;
}
</style>
