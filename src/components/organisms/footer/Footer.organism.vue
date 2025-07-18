<template>
    <footer :class="'footer footer--'+(dataFooterOrganism?.isLogged ? 'home' : '')">
        <div class="footer__content">
            <hr :class="imgColor+'--hr'">
            <div class="footer__section">
                <h3>Colombia</h3>
                <div class="footer__section__container">
                    <img :class="imgColor" src="/icon-mail.svg" alt="main-icon">
                    <a href="mailto:info@suntic.co">info@suntic.co</a>
                </div>
                <div class="footer__section__container">
                    <img :class="imgColor" src="/icon-map-dot.svg" alt="mad-dot">
                    <p>Calle 20 Norte #5Bn38 Edificio Centro 20</p>
                </div>
                <div class="footer__section__container">
                    <img :class="imgColor" src="/icon-city.svg" alt="city">
                    <p>Cali</p>
                </div>
            </div>
            <hr :class="imgColor+'--hr'">
            <div class="footer__section">
                <h3>México</h3>
                <div class="footer__section__container">
                    <img :class="imgColor" src="/icon-mail.svg" alt="main-icon">
                    <a href="mailto:info@sunticmex.com">info@sunticmex.com</a>
                </div>
                <div class="footer__section__container">
                    <img :class="imgColor" src="/icon-map-dot.svg" alt="mad-dot">
                    <p>Calle Fuego Numero 316 Colonia Jardines Del Moral</p>
                </div>
                <div class="footer__section__container">
                    <img :class="imgColor" src="/icon-city.svg" alt="city">
                    <p>León</p>
                </div>
            </div>
            <hr :class="imgColor+'--hr'">
            <div class="footer__section">
                <h3>USA</h3>
                <div class="footer__section__container">
                    <img :class="imgColor" src="/icon-mail.svg" alt="main-icon">
                    <a href="mailto:info@sunticusa.com">info@sunticusa.com</a>
                </div>
                <div class="footer__section__container">
                    <img :class="imgColor" src="/icon-map-dot.svg" alt="mad-dot">
                    <p>Florida 400 Emmet Street Ste 7</p>
                </div>
                <div class="footer__section__container">
                    <img :class="imgColor" src="/icon-city.svg" alt="city">
                    <p>Kissimmee, FL 34741</p>
                </div>
            </div>
            <hr :class="imgColor+'--hr'">
        </div>
        <div :class="'footer__copyright footer__copyright--'+(dataFooterOrganism?.isLogged ? 'home' : '')">            
            <p>© {{ t("rights_reserved") }} suntic</p>
        </div>
    </footer>
</template>

<script setup lang="ts">

import { defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps(['dataFooterOrganism', 'imgColor'])

</script>

<style scoped src="./Footer.organism.scss"></style>