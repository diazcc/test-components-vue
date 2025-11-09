<template>
    <RenderLoadingTemplate :dataRenderLoading="dataRenderLoading"/>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import RenderLoadingTemplate from '../../templates/render-loading/RenderLoading.template.vue';
import UtilsServices from '../../../services/UtilsServices';
import { useRoute, useRouter } from 'vue-router';
const router :any = useRouter();
const dataRenderLoading :any = reactive({
    isLoading: false,
    isConnected: false,
});


onMounted(() => {
    callServices(); 
});

function callServices(){
dataRenderLoading.isLoading = true;
dataRenderLoading.isConnected = false;
    setTimeout(() => {
        
        UtilsServices.getConectionRender()
        .then((response:any)=>{
            dataRenderLoading.isLoading = false;
            dataRenderLoading.isConnected = true;
            // router.push('/home/dashboard');
        })
        .catch((error:any)=>{
            console.error(error);
            
        })
    }, 2000);
}
</script>