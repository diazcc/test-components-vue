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

</script>
<style scoped src="./Home.page.scss"></style>