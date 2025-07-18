<template>
    <main class="wrapper-home">
      <Header @dataEmitAskMessage="getMessage"
            :dataHeaderOrganism="dataHomeTemplate.dataHeaderOrganism"
            :askDocugate="dataHomeTemplate.askDocugate" />
      <article class="wrapper-home__container">
        <Menu @dataEmitMenu="getViewKey" :dataMenu="dataHomeTemplate.dataMenu" />
        <article v-if="!dataHomeTemplate?.askDocugate" class="wrapper-home__container__content">
          <router-view :key="viewKey"></router-view>
        </article>
            <AskDocugate @emitCloseAskDocugate="closeAskDocugate" v-else class="wrapper-home__container__ask_docugate"/>
      </article>
      <Footer :dataFooterOrganism="dataHomeTemplate.dataFooterOrganism" class="wrapper-home__footer" />
    </main>

</template>

<script setup lang="ts">

import { useRoute, useRouter } from 'vue-router';
import { provide, ref, watch } from 'vue';
import Header from '../../organisms/header/Header.organism.vue'
import Menu from '../../organisms/menu/Menu.organism.vue'
import Footer from '../../organisms/footer/Footer.organism.vue';
import AskDocugate from '../../organisms/ask-docugate/AskDocugate.organism.vue';

const route = useRoute();
const props: any = defineProps(['dataHomeTemplate']);
const dataSearch = ref(""); // Crear el ref desde el principio
const viewKey :any = ref(0); //the way of viewKey end here, because <router-view></router-view> is here 

provide("dataSearch", dataSearch);

function getViewKey(viewKeyData:any){
    viewKey.value = viewKeyData;
}

function getMessage(message: any) {
    props.dataHomeTemplate.askDocugate = true;
}

function closeAskDocugate() {
    props.dataHomeTemplate.askDocugate = false;
}

watch(route, () => {
    props.dataHomeTemplate.askDocugate = false;
});

props.dataHomeTemplate.dataHeaderOrganism.dataInputSearch.dataInput.onChange = (event: any) => {
    dataSearch.value = event; // Actualizar el valor reactivo
    console.log(dataSearch.value);
};



</script>
<style src="./Home.template.scss"></style>