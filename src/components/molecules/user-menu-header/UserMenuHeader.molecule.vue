<template>
    <article class="user-menu-header" @click="dataUserMenuHeader.showMenu" id="menuHeader">
        <section :class="'user-menu-header__card user-menu-header__card--'+dataUserMenuHeader?.classUserMenuHeader">
            <p>
                {{ t('hello') }},
            </p>
            <TextAtomVue :dataText="dataUserMenuHeader?.dataText" class="user-menu-header__card__name" />
            <ImgAtom :dataImg="dataUserMenuHeader?.dataImg" />
        </section>
        <UserListMenuHeader :dataUserListMenuHeader="dataUserMenuHeader.dataUserListMenuHeader" />
    </article>
</template>
<script setup lang="ts">
import TextAtomVue from '../../atoms/text/Text.atom.vue';
import ImgAtom from '../../atoms/img/Img.atom.vue';
import UserListMenuHeader from '../../molecules/user-list-menu-header/UserListMenuHeader.molecule.vue'
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
defineProps(['dataUserMenuHeader']);



</script>
<style scoped src="./UserMenuHeader.molecule.scss"></style>