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
      <img :src="referenceImgUrl" alt="Referencia" v-if="referenceImgUrl" width="160" />
      <input type="file" accept="image/*" @change="onFileChange" />
      <p>Imagen de referencia</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as faceapi from 'face-api.js';
declare global {
  interface Window {
    FaceMesh: any;
  }
}
const video = ref<HTMLVideoElement | null>(null);
const landmarksCanvas = ref<HTMLCanvasElement | null>(null);
const faceMeshCanvas = ref<HTMLCanvasElement | null>(null);
const matchResult = ref<boolean | null>(null);
const referenceImgUrl = ref<string>('/fotolas.png');
const refDescriptor = ref<Float32Array | null>(null);

async function loadReferenceImage(url: string) {
  const img = await faceapi.fetchImage(url);
  const detection = await faceapi
    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    console.error('❌ No se detectó rostro en la foto de referencia');
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
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  ]);
  await loadReferenceImage(referenceImgUrl.value);

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.value!.srcObject = stream;

  // FaceAPI detection (68 puntos)
  video.value!.addEventListener('playing', () => {
    const displaySize = { width: 320, height: 240 }
    faceapi.matchDimensions(landmarksCanvas.value!, displaySize)

    const runDetection = async () => {
      if (!video.value) return

      const liveDetection = await faceapi
        .detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor()

      // Limpiar canvas
      const ctx = landmarksCanvas.value!.getContext('2d')
      ctx?.clearRect(0, 0, displaySize.width, displaySize.height)
      ctx?.drawImage(video.value, 0, 0, displaySize.width, displaySize.height)

      if (liveDetection) {
        const resizedDetections = faceapi.resizeResults(liveDetection, displaySize)
        faceapi.draw.drawFaceLandmarks(landmarksCanvas.value!, resizedDetections)
        if (refDescriptor.value) {
          const distance = faceapi.euclideanDistance(refDescriptor.value, liveDetection.descriptor)
          matchResult.value = distance < 0.65
        }
      } else {
        matchResult.value = null
      }
      requestAnimationFrame(runDetection)
    }
    runDetection()
  })

  // FaceMesh detection (468 puntos) usando window.FaceMesh
  const faceMesh = new window.FaceMesh({
    locateFile: (file: any) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  })
  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  })
  faceMesh.onResults((results: any) => {
    const ctx = faceMeshCanvas.value!.getContext('2d')
    ctx?.clearRect(0, 0, 320, 240)
    ctx?.drawImage(results.image, 0, 0, 320, 240)
    if (results.multiFaceLandmarks) {
      for (const landmarks of results.multiFaceLandmarks) {
        drawLandmarks(ctx, landmarks, { color: '#00FF00', radius: 1 })
      }
    }
  })

  // Helper function to draw landmarks on canvas
  function drawLandmarks(
    ctx: CanvasRenderingContext2D | null,
    landmarks: Array<{ x: number; y: number }>,
    options: { color?: string; radius?: number } = {}
  ) {
    if (!ctx) return;
    const color = options.color || '#00FF00';
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

  async function processFaceMesh() {
    if (video.value && video.value.readyState >= 2) {
      await faceMesh.send({ image: video.value })
    }
    requestAnimationFrame(processFaceMesh)
  }
  processFaceMesh()
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
video, canvas {
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