<template>
    <ul :class="'user-list-menu-header user-list-menu-header--'+dataUserListMenuHeader.class">
        <li class="user-list-menu-header__option" @click="dataUserListMenuHeader.redirectEditPerfil">{{ t('edit_perfil')}}</li>
        <li class="user-list-menu-header__option" @click="dataUserListMenuHeader.logOut">{{ t('logout') }}</li>
    </ul>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();


defineProps(['dataUserListMenuHeader']);


</script>
<style scoped src="./UserListMenuHeader.molecule.scss"></style>