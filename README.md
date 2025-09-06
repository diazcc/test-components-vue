# 🌐 Frontend - Test YOLO AI

Este es un proyecto **Vue 3 + TypeScript + Vite**, con arquitectura basada en **Atomic Design**, cuyo objetivo es contener, mostrar y desarrollar componentes reutilizables siguiendo buenas prácticas de mantenibilidad.

---

## 🚀 Requisitos

- Node.js **18 o superior**
- npm o yarn
- VSCode con extensiones recomendadas:
  - **Volar** (TypeScript Vue Plugin)
  - Deshabilitar Vetur
  - Opcional: habilitar *Take Over Mode* para mayor rendimiento

---

## 📦 Instalación

1. Clonar el repositorio:

   ```bash
   git clone <repo-url>
   cd frontend
Instalar dependencias

npm install
# o
yarn install
▶️ Desarrollo local
Para iniciar el servidor de desarrollo:

npm run dev
El proyecto estará disponible en:

👉 http://localhost:5173

Para acceder a proyecto o vista de la prueba una vez iniciado el proyecto:
http://localhost:5173/slc-enterprice

🏗️ Compilación para producción
npm run build
Los archivos listos para producción estarán en la carpeta /dist.

🔍 Pruebas unitarias
Ejecutar pruebas unitarias con Vitest o Jest:

npm run test:unit
🌐 Despliegue en Firebase Hosting
Autenticarse en Firebase:


firebase login


Compilar el proyecto:


npm run build


Desplegar en Firebase:


firebase deploy


La configuración está en firebase.json.

📡 Conexión con el Backend
Este frontend consume el backend de FastAPI + YOLO en Python.
Verifica que el archivo donde haces la llamada a la API (fetch o axios) apunte a la URL correcta:


const res = await fetch("http://localhost:8000/predict", {
  method: "POST",
  body: formData,
})

Si el backend está desplegado en la nube, reemplaza http://localhost:8000 por tu URL pública.