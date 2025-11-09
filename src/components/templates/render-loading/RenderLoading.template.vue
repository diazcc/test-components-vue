<template>
    <main class="render-loading">
        <section class="render-loading__card">
            <a class="render-loading__card__line-container">
                <div class="render-loading__card__line-container__line"></div>
            </a>
            <p class="render-loading__card__name">DOCMAIL</p>
            <p class="render-loading__card__subtitle" >{{ t('please_wait_to_contection_components') }}</p>
            <p class="render-loading__card__message" >{{ t('in_a_less_of_2_min_redirect_to_page') }}</p>
            <p class="render-loading__card__loading" v-if="dataRenderLoading.isLoading">{{ t('loading') }}...</p>
            <p class="render-loading__card__load" ></p>
            <p class="render-loading__card__status" >{{ dataRenderLoading.isConnected ? t('connected') : t('disconnected') }}</p>
        </section>
        <footer class="render-loading__footer">
                <li class="render-loading__footer__text">Desarrollador web : Andres Diaz Castillo</li>
                <li class="render-loading__footer__text">Contacto: diazccx@gmail.com</li>
        </footer>
    </main>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t,te } = useI18n();

const props :any = defineProps(['dataRenderLoading']);
</script>
<style scoped src="./RenderLoading.template.scss"></style>