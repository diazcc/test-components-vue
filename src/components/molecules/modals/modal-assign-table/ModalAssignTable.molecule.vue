<!-- TODO documentation (this component could be generalize for being usable on other views. for time cosntraitns it only has one use)
 
-->

<template>
  <article :class="'modal-assign-table modal-assign-table--'+(dataModalAssignTable.isActive ? 'show' : '')">
    <section :class="'modal-assign-table__content '+(dataModalAssignTable.stateLoadAssign ? 'loading-component' : '')">
      <h1 class="modal-assign-table__content__title">{{ t(dataModalAssignTable.title) }}</h1>
      <div class="modal-assign-table__content__container">
        <nav class="modal-assign-table__content__container__header">
          <MultiSelect class="modal-assign-table__content__container__header__select" :dataMultiSelect="dataModalAssignTable.dataMultiselectDependence"/>
          <InputSearch :dataInputSearch="dataModalAssignTable.dataInputSearch" />
        </nav>
        <table class="table">
          <thead class="table__row table--header">
            <th class="table__row__cell">
              <input type="checkbox" name="" id=""
                :checked="dataModalAssignTable.isAllChecked"
                @click="dataModalAssignTable.checkAll">
            </th>
            <th class="table__row__cell">{{ t('item') }}</th>
            <th class="table__row__cell">{{ t('code') }}</th>
            <th class="table__row__cell">{{ t('name') }}</th>
            <th class="table__row__cell">{{ t('dependences') }}</th>
            <th class="table__row__cell"></th>
          </thead>
          <tbody v-if="dataModalAssignTable.stateLoadTable" class="table__row table--only-row loading-component">
            <td class="table__row__cell" > {{ t('loading') }} </td>
          </tbody>
          <tbody v-else-if="dataModalAssignTable.fileList.length < 1" class="table__row table--only-row">
            <td class="table__row__cell"> {{ t('no_results_found') }} </td>
          </tbody>
          <tbody v-else class="table__row" v-for="(data, index) in dataModalAssignTable.fileList" :key="index" @click="data.checked = !data.checked">
              <td class="table__row__cell">
                  <input type="checkbox" name="" id=""
                  :checked="data.checked">
              </td>
              <td class="table__row__cell">{{ index+1 }}</td>
              <td class="table__row__cell">{{ data.code || 'null' }}</td>
              <td class="table__row__cell table__row__cell--left-align">{{ data.name || 'null' }}</td>
              <td class="table__row__cell table__row__cell--left-align">{{ data.dependencies || '' }}</td>
              <td class="table__row__cell table__row--img" @click="{dataModalAssignTable.openDocument(data.url); data.checked = !data.checked}">
                <TooltipIcon v-if="dataModalAssignTable.dataTooltipIcons[0].show()" :dataTooltipIcon="dataModalAssignTable.dataTooltipIcons[0]" @click="dataModalAssignTable.dataTooltipIcons[0].onClick({data: data})"/>
              </td>
          </tbody>
        </table>
        <Paginator class="modal-assign-table__content__container__paginator" 
          :dataPaginator="dataModalAssignTable.dataPaginator"/>
      </div>
      <footer class="modal-assign-table__content__footer">
        <Button :dataButton="dataModalAssignTable.dataButtonCancel" />
        <Button :dataButton="dataModalAssignTable.dataButtonAssign" />
      </footer>
      <Img class="modal-assign-table__content__icon-close" :dataImg="dataModalAssignTable.dataImgGoBack"/>
    </section>
  </article>
</template>

<script setup lang="ts">

// Import vue libraries
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Import components
import MultiSelect from '../../../atoms/multi-select/MultiSelect.atom.vue';
import InputSearch from '../../input-search/InputSearch.molecule.vue';
import Paginator from '../../paginator/Paginator.molecule.vue';
import Button from '../../../atoms/button/Button.atom.vue';
import Img from '../../../atoms/img/Img.atom.vue';
import TooltipIcon from '../../../atoms/tooltip-icon/TooltipIcon.atom.vue';

// Import services
import FilesServices from '../../../../services/FilesServices';
import DependenceService from '../../../../services/DependenceServices';

// Define props and emits and configuration
const { t } = useI18n();
const props: any = defineProps(['dataModalAssignTable'])

// Define functions and methods
onMounted(async () => {
  props.dataModalAssignTable.dataInputSearch.dataInput.onChange = (value: any) => {
    getFilesModal(value, 1);
  };
  props.dataModalAssignTable.dataPaginator.getService = (value:any) => {
    getFilesModal(props.dataModalAssignTable.dataInputSearch.dataInput.model, value)
  };
  props.dataModalAssignTable.checkAll = () => {
    checkAll();
  };
  await getDependences();
  getFilesModal("", 1);
})

watch(() => props.dataModalAssignTable.fileList, () => {
    verifyAllchecked();
}, { deep: true });

watch(() => props.dataModalAssignTable.dataPaginator.page_size, () => {
  getFilesModal (props.dataModalAssignTable.dataInputSearch.dataInput.model, 1);
});

function getDependences() {
  DependenceService.searchDependences("", 1)
    .then(response => {
      props.dataModalAssignTable.dataMultiselectDependence.options = response.results.map((value: any) => ({
        checked: false,
        value: value.code,
        text: value.name
      }))
    })
    .catch((error: any) => console.error(error));
}

function getFilesModal(searched_value: any, page: any){
  props.dataModalAssignTable.stateLoadTable = true;
  props.dataModalAssignTable.isAllChecked = false;
  props.dataModalAssignTable.fileList = [];
  FilesServices.getFiles(searched_value, page, props.dataModalAssignTable.dataPaginator.page_size)
    .then((response: any) => {
      props.dataModalAssignTable.dataPaginator.page = page
      props.dataModalAssignTable.dataPaginator.total_pages = response.total_pages
      props.dataModalAssignTable.fileList = response.results.map((file: any) => {
        return {
          code: file.archive_number,
          name: file.document_name,
          url: file.document,
          dependencies: file.dependence.map((obj: any) => obj.name).join(', '),
          checked: false,
        };
      });
      props.dataModalAssignTable.stateLoadTable = false;
    })
    .catch((error: any) => {
      props.dataModalAssignTable.stateLoadTable = false;
      console.error(error);
    });
}

function checkAll() {
  props.dataModalAssignTable.isAllChecked = !props.dataModalAssignTable.isAllChecked;
  props.dataModalAssignTable.fileList.forEach((file: any) => {
    file.checked = props.dataModalAssignTable.isAllChecked; 
  });
}

function verifyAllchecked() {
  props.dataModalAssignTable.isAllChecked = props.dataModalAssignTable.fileList.every((file: any) => file.checked);
}

</script>

<style scoped src="./ModalAssignTable.molecule.scss"></style>