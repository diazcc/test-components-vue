<template>
    <article class="template-table-view">
        <section class="template-table-view__content">
            <header class="template-table-view__header">
                <h1 class="template-table-view__header__title">{{t(dataFiles.title)}}</h1>
                <Button v-if="hasPermissions.validator('create_file') || hasPermissions.validator('charge_massive_file')" 
                    class="template-table-view__header__button" :dataButton="dataFiles.dataButtonNewFiles" />
            </header>
            <section class="template-table-view__list">
                <nav class="template-table-view__list__nav">
                    <p v-if="!dataFiles?.newView && hasPermissions.validator('share_file')"
                    @click="dataModalAssignTable.isActive = true">{{ t('actions') }}</p>
                    <InputSearch :dataInputSearch="dataFiles.dataInputSearch" />
                </nav>
                <table class="table" @scroll="UtilsServices.handleScroll(dataFiles.data)">
                    <thead :class="'table__row table--header table__row--'+(dataFiles?.newView ? 'less-column' : '')">
                        <li class="table__row__cell">{{ t('item') }}</li>
                        <li class="table__row__cell">{{ t("name")}}</li>
                        <li class="table__row__cell" v-if="!dataFiles?.newView">{{ t("type_documental")}}</li>
                        <li class="table__row__cell" v-else>{{ t("description") }}</li>
                        <li class="table__row__cell" v-if="!dataFiles?.newView">{{ t("dependences")}}</li>
                        <li class="table__row__cell">{{ t("creation_date")}}</li>
                        <li class="table__row__cell">{{ t('actions') }}</li>
                    </thead>
                    <tbody class="table__row table--only-row loading-component"
                        v-if="dataFiles?.stateLoadData">
                        <td class="table__row__cell">{{ t('loading') }}</td>
                    </tbody>
                    <tbody class="table__row table--only-row"
                        v-else-if="dataFiles.data.length < 1 && dataFiles?.stateLoadData == false">
                        <td class="table__row__cell">{{ t('no_results_found') }}</td>
                    </tbody>
                    <tbody :class="'table__row table__row--'+(dataFiles?.newView ? 'less-column' : '')" 
                        v-else v-for="(data, index) in dataFiles.data">
                        <td class="table__row__cell">{{ index + 1 }}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{ data.document_name }}</td>
                        <td class="table__row__cell table__row__cell--left-align" v-if="!dataFiles?.newView">{{ data.documentary_type.name_document_type }}</td>
                        <td class="table__row__cell table__row__cell--left-align" v-else>{{ data?.description || t('does_not_have') }}</td>
                        <li class="table__row__cell table__row__cell--left-align" v-if="!dataFiles?.newView && dataFiles?.fileToEdit !== index">{{ data.dependences_to_show }}</li>
                        <li class="table__row__cell table__row--new-cell table__row__cell--left-align" v-else-if="!dataFiles?.newView && dataFiles?.fileToEdit === index">
                            <MultiSelect class="table__row--new-cell__white" :dataMultiSelect="dataFiles.dataMultiselectDependence"/>
                        </li>
                        <td class="table__row__cell">{{ data.date }}</td>
                        <td class="table__row__cell table__row--img">
                            <TooltipIcon v-if="dataTooltipIconView.show(index)" :dataTooltipIcon="dataTooltipIconView" @click="dataTooltipIconView.onClick({data: data, index: index, action: 'see_document'})"/>
                            <TooltipIcon v-if="!dataFiles?.newView && dataFiles?.dataTooltipIcons[0].show(index)" :dataTooltipIcon="dataFiles?.dataTooltipIcons[0]" @click="dataFiles?.dataTooltipIcons[0].onClick({data: data, index: index, action: 'open_document'})"/>
                            <TooltipIcon v-if="!dataFiles?.newView && dataFiles?.dataTooltipIcons[1].show(index)" :dataTooltipIcon="dataFiles?.dataTooltipIcons[1]" @click="dataFiles?.dataTooltipIcons[1].onClick({data: data, index: index, action: 'assign_dependencies'})"/>
                            <TooltipIcon v-if="!dataFiles?.newView && dataFiles?.dataTooltipIcons[2].show(index)" :dataTooltipIcon="dataFiles?.dataTooltipIcons[2]" @click="dataFiles?.dataTooltipIcons[2].onClick({data: data, index: index, action: 'save'})"/>
                            <TooltipIcon v-if="!dataFiles?.newView && dataFiles?.dataTooltipIcons[3].show(index)" :dataTooltipIcon="dataFiles?.dataTooltipIcons[3]" @click="dataFiles?.dataTooltipIcons[3].onClick({data: data, index: index, action: 'cancel'})"/>
                        </td>
                    </tbody>
                </table>
            </section>
            <Paginator :dataPaginator="dataFiles.dataPaginator"/>
        </section>
    </article>
    <ModalAssignTable v-if="!dataFiles?.newView && hasPermissions.validator('share_file')" :dataModalAssignTable="dataModalAssignTable"/>
    <ModalPdfViewer :dataModalPdfViewer="dataFiles.dataModalPdfViewer" />
    <ModalAlert :dataModalAlert="dataFiles.dataModalAlert" />
</template>

<script setup lang="ts">

// Import vue libraries
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Import vue components
import Button from '../../atoms/button/Button.atom.vue';
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import ModalPdfViewer from '../../molecules/modals/modal-pdf-viewer/ModalPdfViewer.molecule.vue';
import ModalAlert from '../../molecules/modals/alert/ModalAlert.molecule.vue';
import ModalAssignTable from '../../molecules/modals/modal-assign-table/ModalAssignTable.molecule.vue';
import Paginator from '../../molecules/paginator/Paginator.molecule.vue';
import MultiSelect from '../../atoms/multi-select/MultiSelect.atom.vue';
import TooltipIcon from "../../atoms/tooltip-icon/TooltipIcon.atom.vue";

// Import services
import UtilsServices from '../../../services/UtilsServices';
import hasPermissions from '../../../guards/hasPermissions.guard';

// Define props and emits and configuration
const { t } = useI18n();
const emits = defineEmits(['applyFilters']);
const props: any = defineProps(['dataFiles', 'dataModalAssignTable']);

// Define variables and constants
const dataTooltipIconView = ref({ 
    // see_document action
        text: `${UtilsServices.capitalizeFirstLetter(t("see_document"))}`,
        src: '/Buttons/icon-view.svg',
        color: 'blue',
        alt: 'view',
        show: (data: any) => { return props.dataFiles?.fileToEdit !== data },
        onClick: ({action = "", data = {}, index = 0,}) => { props.dataFiles?.actionsMenu(action, data, index) },
});


// Define functions and methods
onMounted(async () => {
  document.addEventListener("click", outSideArea);
});

onUnmounted(() => {
  document.removeEventListener("click", outSideArea);
});

const outSideArea = (event: any) => {
  if (!event.target.closest('.table__row__cell__menu')) {
    closeMenus();
  }
};

const closeMenus = () => {
  for (const data of props.dataFiles.data) {
    data.isMenuOpen = false;
  }
};

function applyFilters(selectedOptions: Array<{ value: any }>){
    emits("applyFilters", selectedOptions);
}

</script>

<style scoped src="./Files.template.scss"></style>
