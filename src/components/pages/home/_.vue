<template >
    <HomeTemplate :dataHome="dataHome"/>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import HomeTemplate from '../../templates/home/Home.template.vue';
import UserService from '../../../services/UserServices';
import axios from 'axios';
import { accessStore } from '../../../store';
const store : any =  accessStore();
const dataHome : any = reactive({
    data: '',
    urlPdf: null,
    email: '',
    password: '',
    name: '',
    onClickButtonSubmit :() => {
        signUp();
    },
    sendFile: ()=>{
        sendFile();
    },
    downloadPdf:()=>{
      downloadPdf();
    },
    login: ()=>{
      login();
    }

});

onMounted(() => {
    getConexion();
});


function getConexion(){
 UserService.getConectionData().then((data:any)=>{
    console.log('dataaa:', data);
    dataHome.data = data;
 }).catch((error:any)=>{
    console.error('Error al obtener los datos de conexion:', error);
 });
}

async function sendFile(){

      const file = store.uploadedFiles[0];
    console.log(file, 'file');
  if (!file) return alert("Selecciona un archivo PDF");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res :any = await axios.post("/upload-pdf", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dataHome.url = res.data.url;
    console.log(res, 'respuesta');
    console.log(res.data.url, 'respuesta');
    
  } catch (err) {
    console.error(err);
  }
}


const signUp = async () => {

  try {
    const response = await axios.post('/signup', {
      name: dataHome.name,
      email: dataHome.email,
      password: dataHome.password,
    });
    console.log(response,'response');
    

  } catch (error: any) {
    console.error(error,'error');
    
  } finally {
  }
};
const downloadPdf = async () => {
  if (!dataHome.urlPdf) return;

  const response = await fetch(dataHome.urlPdf);
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

function login(){
    console.log(dataHome.password,'password');
    console.log(dataHome.email,'email');

  UserService.login(dataHome.email,dataHome.password).then((response:any)=>{
    console.log(response,'response');
    
  }).catch((error:any)=>{
    console.error(error,'errior');
    
  });
}
</script>
<style scoped src="./Home.page.scss"></style>