<template>
    <svg
      id="Capa_2"
      data-name="Capa 2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 13.18 7.75"
      @mouseover="handleMouseOver"
      @mouseout="handleMouseOut"
    >
      <g id="Object" class="cls-1-content">
        <g>
          <path
            ref="path"
            class="cls-1"
            d="m6.59,0C3.26,0,0,3.46,0,3.46c0,0,2.63,4.28,6.82,4.28,2.83,0,6.36-4.07,6.36-4.07,0,0-3.01-3.68-6.59-3.68Zm0,6.84c-1.64,0-2.97-1.33-2.97-2.97S4.95.91,6.59.91s2.97,1.33,2.97,2.97-1.33,2.97-2.97,2.97Z"
          />
          <path
            class="cls-1"
            d="m8.2,4.61c-.41.88-1.47,1.26-2.35.84s-1.26-1.47-.85-2.35c.37-.78,1.24-1.17,2.04-.95-.12.63-.55,1.72-.66,2.18.57-.04,1.47-.55,1.97-.56.01.28-.04.57-.17.84Z"
          />
        </g>
      </g>
    </svg>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const pathRef = ref(null);
  
  const handleMouseOver = () => {
    if (pathRef.value) {
      pathRef.value.classList.add('hovered');
    }
  };
  
  const handleMouseOut = () => {
    if (pathRef.value) {
      pathRef.value.classList.remove('hovered');
    }
  };
  </script>
  
  <style scoped>
  .cls-1 {
    fill: #555555;
    stroke-width: 0px;
  }
  .cls-1:hover {
    fill: #006cd8;
  }

  .cls-1-content:hover g path{
    fill: #006cd8;
    
}
  
  </style>
  