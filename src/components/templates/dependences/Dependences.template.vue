<template >
    <article class="dependence-received" v-if="dataDependence.state==''">
        <nav class="dependence-received__nav">
            <h1 class="dependence-received__nav__title">
                {{t('dependence')}}
            </h1>
            <Button v-if="hasPermissions.validator('create_dependences')" 
                class="dependence-received__nav__button" :dataButton="dataDependence.dataButtonNewDependence"/>
        </nav>
        <TableDependence :dataTableDependence="dataDependence.dataTableDependence"/>
        <Paginator :dataPaginator="dataDependence.dataPaginator" />
    </article>

    <article v-if="dataDependence.state=='viewNewFile'" class="dependence-received-file">
        <header class="dependence-received-file__header">
            <h2>
                {{ t('welcome_to_admin_module_dependence') }}
            </h2>
        </header>
        <section class="dependence-received-file__container">
            <CreateDependenceForm :dataCreateDependenceForm="dataDependence.dataCreateDependenceForm" :dataDependence="dataDependence.dataTableDependence.data"  />
        </section>

        <nav class="dependence-received-file__buttons-nav">
            <Button :dataButton="dataDependence.dataButtonGoToBack" :class="'dependence-received-file__buttons-nav__button'"/>
            <Button class="dependence-received-file__buttons-nav__button" :dataButton="dataDependence.dataButtonGoToNext"/>
        </nav>
    </article>
    <ModalConfirmation :dataModalConfirmation="dataDependence.dataModalConfirmation"/>
    <ModalAlert :dataModalAlert="dataDependence.dataModalAlert"/>
 
</template>

<script setup lang="ts">

import TableDependence from "../../organisms/table-dependence/TableDependence.organism.vue";
import Paginator from "../../molecules/paginator/Paginator.molecule.vue";
import CreateDependenceForm from "../../organisms/create-dependence-form/CreateDependenceForm.organism.vue";
import ModalAlert from "../../molecules/modals/alert/ModalAlert.molecule.vue";
import ModalConfirmation from "../../molecules/modals/confirmation/ModalConfirmation.molecule.vue";
import Button from "../../atoms/button/Button.atom.vue";
import { useI18n } from 'vue-i18n';
import hasPermissions from "../../../guards/hasPermissions.guard";

const { t } = useI18n();
const emits = defineEmits(['applyFilters']);
defineProps(["dataDependence"]);

function applyFilters(selectedOptions: Array<{ value: any }>){
    emits("applyFilters", selectedOptions);
}

</script>

<style scoped lang="scss" src="./Dependences.template.scss"></style>