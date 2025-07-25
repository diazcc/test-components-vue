<template>
  <div class="flashing-container" :class="{ 'mode-hidden': mode === 'hidden' }">
    <div
      v-for="flash in flashes"
      :key="flash.id"
      class="flash"
      :class="{ 
        'hidden': flash.isHidden || mode === 'stop',
        'mode-active': mode === 'active',
        'mode-lightness': mode === 'lightness',
        'mode-jump': mode === 'jump'
      }"
      :style="{
        top: flash.y + 'px',
        left: flash.x + 'px',
        '--flash-color': flash.color,
        animationDuration: flash.duration + 'ms'
      }"
      @mouseenter="handleMouseEnter(flash)"
      @mouseleave="handleMouseLeave(flash)"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, watch } from 'vue'

// ===== PROPS & REFS =====
const props = defineProps({
  mode: {
    type: String,
    default: ''
  }
})

const flashes = ref([])
const mouseX = ref(0)
const mouseY = ref(0)
const intervalId = ref(null)
const animationId = ref(null)

// ===== CONSTANTS =====
const COLORS = ['gray', 'brown', 'purple']
const PHYSICS_CONFIG = {
  pushRadius: 35,
  pushForce: 0.2,
  friction: 0.95,
  bounceReduction: 0.6,
  boundaryMargin: 10
}

// ===== FLASH CREATION & MANAGEMENT =====
function createFlashObject() {
  const id = Date.now() + Math.random()
  return {
    id,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    duration: getDurationByMode(),
    originalX: 0,
    originalY: 0,
    isHidden: false,
    mode: props.mode,
    velocityX: 0,
    velocityY: 0,
    friction: PHYSICS_CONFIG.friction
  }
}

function getDurationByMode() {
  const durations = {
    active: () => 500 + Math.random() * 500,
    lightness: () => 2000 + Math.random() * 3000,
    jump: () => 800 + Math.random() * 1200,
    default: () => 300 + Math.random() * 10000
  }
  
  return durations[props.mode] || durations.default()
}

function createFlash() {
  if (shouldStopCreation()) return

  const flash = createFlashObject()
  flash.originalX = flash.x
  flash.originalY = flash.y

  flashes.value.push(flash)
  scheduleFlashRemoval(flash)
}

function shouldStopCreation() {
  return props.mode === 'stop' || props.mode === 'hidden'
}

function scheduleFlashRemoval(flash) {
  setTimeout(() => {
    flashes.value = flashes.value.filter(f => f.id !== flash.id)
  }, flash.duration)
}

// ===== FLASH INTERVAL MANAGEMENT =====
function getFlashInterval() {
  return props.mode === 'active' ? 100 : 200
}

function startFlashing() {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
  
  const interval = getFlashInterval()
  intervalId.value = setInterval(createFlash, interval)
}

function stopFlashing() {
  if (intervalId.value) {
    clearInterval(intervalId.value)
    intervalId.value = null
  }
}

// ===== PHYSICS CALCULATIONS =====
function calculateDistance(flash, mouseX, mouseY) {
  return Math.sqrt(
    Math.pow(flash.x - mouseX, 2) + 
    Math.pow(flash.y - mouseY, 2)
  )
}

function calculatePushAngle(flash, mouseX, mouseY) {
  return Math.atan2(
    flash.y - mouseY, 
    flash.x - mouseX
  )
}

function calculatePushForce(distance) {
  return (PHYSICS_CONFIG.pushRadius - distance) * PHYSICS_CONFIG.pushForce
}

function applyPushForce(flash, angle, force) {
  flash.velocityX += Math.cos(angle) * force
  flash.velocityY += Math.sin(angle) * force
}

function shouldPushFlash(distance) {
  return distance < PHYSICS_CONFIG.pushRadius && distance > 0
}

// ===== MOUSE INTERACTION =====
function handleMouseMove(event) {
  updateMousePosition(event)
  applyMousePushToFlashes()
}

function updateMousePosition(event) {
  mouseX.value = event.clientX
  mouseY.value = event.clientY
}

function applyMousePushToFlashes() {
  flashes.value.forEach(flash => {
    const distance = calculateDistance(flash, mouseX.value, mouseY.value)
    
    if (shouldPushFlash(distance)) {
      const angle = calculatePushAngle(flash, mouseX.value, mouseY.value)
      const force = calculatePushForce(distance)
      applyPushForce(flash, angle, force)
    }
  })
}

// ===== PHYSICS ENGINE =====
function updatePhysics() {
  flashes.value.forEach(flash => {
    updateFlashPosition(flash)
    applyFriction(flash)
    handleBoundaryCollisions(flash)
  })
  
  scheduleNextPhysicsUpdate()
}

function updateFlashPosition(flash) {
  flash.x += flash.velocityX
  flash.y += flash.velocityY
}

function applyFriction(flash) {
  flash.velocityX *= flash.friction
  flash.velocityY *= flash.friction
}

function handleBoundaryCollisions(flash) {
  handleLeftBoundary(flash)
  handleRightBoundary(flash)
  handleTopBoundary(flash)
  handleBottomBoundary(flash)
}

function handleLeftBoundary(flash) {
  if (flash.x <= PHYSICS_CONFIG.boundaryMargin) {
    flash.x = PHYSICS_CONFIG.boundaryMargin
    flash.velocityX = Math.abs(flash.velocityX) * PHYSICS_CONFIG.bounceReduction
  }
}

function handleRightBoundary(flash) {
  if (flash.x >= window.innerWidth - PHYSICS_CONFIG.boundaryMargin) {
    flash.x = window.innerWidth - PHYSICS_CONFIG.boundaryMargin
    flash.velocityX = -Math.abs(flash.velocityX) * PHYSICS_CONFIG.bounceReduction
  }
}

function handleTopBoundary(flash) {
  if (flash.y <= PHYSICS_CONFIG.boundaryMargin) {
    flash.y = PHYSICS_CONFIG.boundaryMargin
    flash.velocityY = Math.abs(flash.velocityY) * PHYSICS_CONFIG.bounceReduction
  }
}

function handleBottomBoundary(flash) {
  if (flash.y >= window.innerHeight - PHYSICS_CONFIG.boundaryMargin) {
    flash.y = window.innerHeight - PHYSICS_CONFIG.boundaryMargin
    flash.velocityY = -Math.abs(flash.velocityY) * PHYSICS_CONFIG.bounceReduction
  }
}

function scheduleNextPhysicsUpdate() {
  animationId.value = requestAnimationFrame(updatePhysics)
}

// ===== PHYSICS LIFECYCLE =====
function startPhysics() {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
  updatePhysics()
}

function stopPhysics() {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
    animationId.value = null
  }
}

// ===== FLASH VISIBILITY HANDLERS =====
function handleMouseEnter(flash) {
  flash.isHidden = true
}

function handleMouseLeave(flash) {
  flash.isHidden = false
}

// ===== MODE CHANGE HANDLERS =====
function handleHiddenMode() {
  flashes.value = []
  stopFlashing()
  stopPhysics()
}

function handleStopMode() {
  stopFlashing()
  // Mantener la física activa para que los existentes sigan moviéndose
}

function handleActiveMode() {
  startFlashing()
  if (!animationId.value) {
    startPhysics()
  }
}

function handleModeChange(newMode) {
  const modeHandlers = {
    hidden: handleHiddenMode,
    stop: handleStopMode,
    default: handleActiveMode
  }
  
  const handler = modeHandlers[newMode] || modeHandlers.default
  handler()
}

// ===== LIFECYCLE MANAGEMENT =====
function initializeComponent() {
  window.addEventListener('mousemove', handleMouseMove)
  startFlashing()
  startPhysics()
}

function cleanupComponent() {
  window.removeEventListener('mousemove', handleMouseMove)
  stopFlashing()
  stopPhysics()
}

// ===== VUE LIFECYCLE HOOKS =====
onMounted(initializeComponent)
onUnmounted(cleanupComponent)

// ===== WATCHERS =====
watch(() => props.mode, handleModeChange)
</script>

<style scoped>
.flashing-container {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  overflow: hidden;
}

.flashing-container.mode-hidden {
  display: none;
}

.flash {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  opacity: 0;
  animation: flash-fade 2s ease-out forwards;
  background: radial-gradient(circle, var(--flash-color) 0%, var(--flash-color) 40%, transparent 70%);
  filter: blur(0.5px);
  transition: opacity 0.2s ease-out;
  pointer-events: all;
}

.flash.hidden {
  opacity: 0 !important;
  transform: scale(0) !important;
}

/* Modo Active - Solo destellos rápidos */
.flash.mode-active {
  animation: flash-active 0.5s ease-out forwards;
}

/* Modo Lightness - Brillar más intenso */
.flash.mode-lightness {
  animation: flash-lightness 3s ease-in-out forwards;
  filter: blur(1px) brightness(1.5);
  box-shadow: 0 0 20px var(--flash-color);
}

/* Modo Jump - Saltar/agrandarse */
.flash.mode-jump {
  animation: flash-jump 1s ease-out forwards;
}

@keyframes flash-fade {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  10% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(2);
  }
}

@keyframes flash-active {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  20% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}

@keyframes flash-lightness {
  0% {
    opacity: 0;
    transform: scale(0.5);
    filter: blur(0.5px) brightness(1);
  }
  15% {
    opacity: 0.8;
    transform: scale(1);
    filter: blur(1px) brightness(2);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
    filter: blur(2px) brightness(3);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
    filter: blur(3px) brightness(1);
  }
}

@keyframes flash-jump {
  0% {
    opacity: 0;
    transform: scale(0.5) ;
  }
  30% {
    opacity: 1;
    transform: scale(1.5) ;
  }
  60% {
    opacity: 1;
    transform: scale(2) ;
  }
  100% {
    opacity: 0;
    transform: scale(2.5) ;
  }
}
</style>
