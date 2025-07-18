<template>
    <article class="user-received" v-if="!dataUser.stateFormCreate">
        <nav class="user-received__nav">
            <h1 class="user-received__nav__title"> {{ t('user') }}</h1>
            <Button v-if="hasPermissions.validator('create_users') || hasPermissions.validator('charge_massive_users')" 
                class="user-received__nav__button" :dataButton="dataUser.dataButtonNewUser" />
        </nav>
        <TableUser :dataTableUser="dataUser.dataTableUser" @onChange="applyFilters" />
        <Paginator :dataPaginator="dataUser.dataPaginator" />
    </article>

    <article v-if="dataUser.stateFormCreate" class="user-received-file">
        <header class="user-received-file__header">
            <h2>
                {{ t('welcome_to_admin_module_user') }}
            </h2>
        </header>
        <p class="user-received-file__title">{{ t('create_user') }}</p>

        <section class="user-received-file__choice-option" v-if="dataUser.stateChoiceOption">
            <Button class="user-received-file__choice-option__option" :dataButton="dataUser.dataButtonRedirectToCreateUser" 
                v-if="hasPermissions.validator('create_users')"/>
            <Button class="user-received-file__choice-option__option" :dataButton="dataUser.dataButtonBulkUpload" 
                v-if="hasPermissions.validator('charge_massive_users')"/>
            
            <input type="file" ref="fileInput" accept=".csv" style="display: none" @change="fileUpload" />
        </section>
        <section class="user-received-file__container" v-else>
            <CreateUserForm :dataCreateUserForm="dataUser.dataCreateUserForm"
                :dataDependences="dataUser.dataDependences.data" :dataRoles="dataUser.dataRoles.data"
                :dataIdentificationTypes="dataUser.dataIdentificationTypes.data" />
        </section>
        <nav class="user-received-file__buttons-nav">
            <ImgAtom v-if="dataUser.stateChoiceOption" class="series-template--form__nav__img pos-back-top-left"
                :dataImg="dataUser.dataImgGoToBack" />
            <Button v-if="!dataUser.stateChoiceOption" :dataButton="dataUser.dataButtonGoToBack"
                :class="'user-received-file__buttons-nav__button'" />
            <Button v-if="!dataUser.stateChoiceOption" :dataButton="dataUser.dataButtonGoToNext"
                :class="'user-received-file__buttons-nav__button'" />
        </nav>
    </article>

    <ModalConfirmation :dataModalConfirmation="dataUser.dataModalConfirmation" />
    <ModalAlert :dataModalAlert="dataUser.dataModalAlert" />
</template>

<script setup lang="ts">

import TableUser from "../../organisms/table-user/TableUser.organism.vue";
import CreateUserForm from "../../organisms/create-user-form/CreateUserForm.organism.vue";
import ModalAlert from "../../molecules/modals/alert/ModalAlert.molecule.vue";
import ModalConfirmation from "../../molecules/modals/confirmation/ModalConfirmation.molecule.vue";
import Button from "../../atoms/button/Button.atom.vue";
import Paginator from "../../molecules/paginator/Paginator.molecule.vue";
import hasPermissions from "../../../guards/hasPermissions.guard";

import { useI18n } from 'vue-i18n';
import ImgAtom from "../../atoms/img/Img.atom.vue";
import { onMounted, ref } from "vue";

const { t, locale } = useI18n();
const emits: any = defineEmits(['applyFilters']);
const props = defineProps(["dataUser"]);

const fileInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
    props.dataUser.dataButtonBulkUpload.onClick = triggerFileInput;
});

function triggerFileInput() {
    fileInput.value?.click();
}

function applyFilters(selectedOptions: Array<{ value: any }>){
    emits("applyFilters", selectedOptions);
}

function fileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files ? target.files[0] : null
  if (file) {
    props.dataUser.processFileUpload(file)
  }
}


</script>

<style scoped lang="scss" src="./User.template.scss"></style>