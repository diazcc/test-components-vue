<template>
    <nav class="popup-menu" ref="popupMenuContainer">
        <a :class="['popup-menu__title', { 'popup-menu__title--active': stateMenu  }]"
            @click="openMenu">
            <p v-if="dataPopupMenu.title != null && dataPopupMenu.title != ''"> {{ te(dataPopupMenu.title) ?
                t(dataPopupMenu.title) : dataPopupMenu.title }}</p>
            <img v-if="dataPopupMenu.icon != null && dataPopupMenu.icon != ''" :src="dataPopupMenu.icon">
            <img src="/icon-arrow-item-menu-padre-black.svg" class="popup-menu__title__arrow">
        </a>
        <ul :class="'popup-menu__list popup-menu__list--' + (stateMenu && 'active')">
            <li v-for="(option, index) in dataPopupMenu.options"
                :class="'popup-menu__list__card popup-menu__list__card--' + (option.state && 'active')"
                @click="option.setOption">
                <img class="popup-menu__list__card__icon" v-if="option.icon != null && option.icon != ''"
                    :src="option.icon">
                <p class="popup-menu__list__card__text" v-if="option.name != null && option.name != ''">
                    {{ te(option.name) ? t(option.name) : option.name }}
                </p>
            </li>
        </ul>
    </nav>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';
import { nextTick, onBeforeUnmount, onMounted, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t, te } = useI18n();
const popupMenuContainer: Ref<any> = ref();
const stateMenu: Ref<boolean> = ref(false);
const props: any = defineProps(['dataPopupMenu']);
const emits: any = defineEmits(['optionSelected'])
const openMenu = () => stateMenu.value = true;

function getOptionSelected(option: string): void {
    emits('optionSelected', option)
}
const handleClickOutside = (event: MouseEvent) => {
    if (popupMenuContainer.value && !popupMenuContainer.value.contains(event.target as Node)) {
        stateMenu.value = false;
    }
};
onMounted(async () => {
    await nextTick();
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});




</script>
<style scoped src="./PopupMenu.molecule.scss"></style>
