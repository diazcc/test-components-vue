<template >
    <HomeTemplate :dataHome="dataHome"/>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import HomeTemplate from '../../templates/home/Home.template.vue';
import UserService from '../../../services/UserServices';
const dataHome : any = reactive({
    data: ''
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
</script>
<style scoped src="./Home.page.scss"></style>