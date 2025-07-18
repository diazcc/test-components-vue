<template>
    <ul class="tenant-presentation-header">
        <li class="tenant-presentation-header__card">
            <Img :dataImg="dataTenantPreHead.dataImgButtonHome"/>
        </li>
        <li class="tenant-presentation-header__card">
            <Title :dataTitle="dataTenantPreHead.dataTitle"/>
        </li>
        <li class="tenant-presentation-header__line-separator">
        </li>
        <li class="tenant-presentation-header__card">
            <p class="tenant-presentation-header__card__reference">By</p>
        </li>
        <li class="tenant-presentation-header__card">
            <Img :dataImg="dataTenantPreHead.dataImgCompany"/>
        </li>
    </ul>
</template>
<script setup lang="ts">

import Img from "../../atoms/img/Img.atom.vue";
import Title from "../../atoms/title/Title.atom.vue";


defineProps(['dataTenantPreHead']);
</script>
<style scoped src="./TenantPresentationHeader.molecule.scss"></style>