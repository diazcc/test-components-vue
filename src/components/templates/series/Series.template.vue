<template>
    <article class="template-table-view" v-if="!dataSeries.stateFormCreate">
        <section class="template-table-view__content">
            <header class="template-table-view__header">
                <h1 class="template-table-view__header__title">Serie</h1>
                <Button v-if="hasPermissions.validator('create_series')"
                    class="template-table-view__header__button" :dataButton="dataSeries.dataButtonNewSeries" />
            </header>
            <section class="template-table-view__list">
                <nav class="template-table-view__list__nav">
                    <MultiSelect :dataMultiSelect="dataSeries.dataMultiSelect" @onChange="applyFilters"/>
                    <InputSearch :dataInputSearch="dataSeries.dataInputSearch" />
                </nav>
                <table class="table">
                    <thead class="table--header table__row">
                        <th class="table__row__cell">{{ t("item") }}</th>
                        <th class="table__row__cell">{{ t("name") }}</th>
                        <th class="table__row__cell">{{ t("code") }}</th>
                        <th class="table__row__cell">{{ t("status") }}</th>
                        <th class="table__row__cell">{{ t("creation_date") }}</th>
                        <th class="table__row__cell">{{ t("disabled_date") }}</th>
                        <th class="table__row__cell"
                            v-if="hasPermissions.validator('update_series') || hasPermissions.validator('delete_series')">
                            {{ t("actions") }}
                        </th>
                        <th class="table__row__cell">
                            <Img v-if="hasPermissions.validator('download_series')" :dataImg="dataSeries.dataImgDownloadPdf" />
                            <Img v-if="hasPermissions.validator('download_series')" :dataImg="dataSeries.dataImgDownloadCSV" />
                        </th>
                    </thead>
                    <tbody class="table__row table--only-row loading-component" v-if="dataSeries.stateLoadData">
                        <td class="table__row__cell">{{ t('loading') }}</td>
                    </tbody>
                    <tbody class="table__row table--only-row" v-else-if="dataSeries.data.length < 1">
                        <td class="table__row__cell">{{ t('no_results_found') }}</td>
                    </tbody>
                    <tbody class="table__row" v-else v-for="(data, index) in dataSeries.data">
                        <td class="table__row__cell">{{ index+1 }}</td>
                        <td class="table__row__cell table__row__cell--left-align">{{ data.name }}</td>
                        <td class="table__row__cell">{{ data.code }}</td>
                        <td class="table__row__cell">{{ data.disabled ? t('inactive') : t('active') }}</td>
                        <td class="table__row__cell">{{ data.creation_date ? data.creation_date : t('unregistered') }}</td>
                        <td class="table__row__cell">{{ data.disabled_date ? data.disabled_date : t('unregistered') }}</td>
                        <td class="table__row__cell table__row--img"
                            v-if="hasPermissions.validator('update_series') || hasPermissions.validator('delete_series')">
                            <TooltipIcon v-if="dataSeries.dataTooltipIcons[0].show(data)" :dataTooltipIcon="dataSeries.dataTooltipIcons[0]" @click="dataSeries.dataTooltipIcons[0].onClick({data: data})"/>
                            <TooltipIcon v-if="dataSeries.dataTooltipIcons[1].show(data)" :dataTooltipIcon="dataSeries.dataTooltipIcons[1]" @click="dataSeries.dataTooltipIcons[1].onClick({data: data})"/>
                        </td>
                        <td class="table__row__cell"></td>
                    </tbody>
                </table>
            </section>
            <Paginator :dataPaginator="dataSeries.dataPaginator" />
        </section>
    </article>

    <article class="series-template--form" v-if="dataSeries.stateFormCreate">
        <header class="series-template--form__header">
            <h2>
                {{ t('welcome_to_trd_module_serie') }}
            </h2>
        </header>
        <h1 class="series-template--form__title">{{ t("create_serie") }}</h1>
        <section class="series-template--form__wrapper" v-if="dataSeries.stateChoiceOption">
            <Button class="series-template--form__wrapper__option" :dataButton="dataSeries.dataButtonRedirectToCreateSerie" />
            <Button class="series-template--form__wrapper__option" 
                v-if="hasPermissions.validator('charge_massive_series')"
                :dataButton="dataSeries.dataButtonBulkUpload"/>
            <input type="file" ref="fileInput" accept=".csv" style="display: none" @change="fileUpload" />
        </section>
        <ul class="series-template--form__content" v-else>
            <li class="series-template--form__content__card">
                <input type="number" :placeholder="t('serie_code')" min="0" required v-model="dataSeries.dataForm.code">
            </li>
            <li class="series-template--form__content__card">
                <input type="text" :placeholder="t('serie_name')" required v-model="dataSeries.dataForm.name">
            </li>
            <li class="series-template--form__content__card">
                <select v-model="dataSeries.dataForm.disabled" required>
                    <option selected value="" disabled>
                        {{ t("select_status") }}
                    </option>
                    <option selected :value=false>
                        {{ t("active") }}
                    </option>
                    <option selected :value=true>
                        {{ t("inactive") }}
                    </option>
                    <!-- <option v-for="(role, i) in dataRoles" :key="i" :value="role.id"> {{ role.name }}</option> -->
                </select>
            </li>
            <li class="series-template--form__content__card">
                <input type="text" id="customDate" :placeholder="t('creation_date')" onfocus="(this.type='date')"
                    onblur="(this.type='text')" v-model="dataSeries.dataForm.creation_date" required :max="maxDate" />

            </li>
            <li class="series-template--form__content__card">
                <input type="text" id="customDate" :placeholder="t('disabled_date')" onfocus="(this.type='date')"
                    onblur="(this.type='text')" v-model="dataSeries.dataForm.disabled_date" :max="maxDate" />
            </li>

        </ul>
        <nav class="series-template--form__nav">
            <Img v-if="dataSeries.stateChoiceOption" class="series-template--form__nav__img"
                :dataImg="dataSeries.dataImgGoToBack" />
            <Button class="series-template--form__nav__button" v-if="!dataSeries.stateChoiceOption"
                :dataButton="dataSeries.dataButtonBack" />
            <Button class="series-template--form__nav__button" v-if="!dataSeries.stateChoiceOption"
                :dataButton="dataSeries.dataButtonNext" />
        </nav>
    </article>
    <ModalAlert :dataModalAlert="dataSeries.dataModalAlert" />
    <ModalConfirmation :dataModalConfirmation="dataSeries.dataModalConfirmation" />
</template>

<script setup lang="ts">

import Button from '../../atoms/button/Button.atom.vue'
import Img from "../../atoms/img/Img.atom.vue";
import TooltipIcon from '../../atoms/tooltip-icon/TooltipIcon.atom.vue';
import ModalAlert from '../../molecules/modals/alert/ModalAlert.molecule.vue';
import ModalConfirmation from '../../molecules/modals/confirmation/ModalConfirmation.molecule.vue';
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import Paginator from '../../molecules/paginator/Paginator.molecule.vue';
import MultiSelect from '../../atoms/multi-select/MultiSelect.atom.vue';
import hasPermissions from '../../../guards/hasPermissions.guard';

import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';

const props: any = defineProps(['dataSeries']);
const emits: any = defineEmits(['bulkUpload', 'applyFilters']);
const { t } = useI18n();
const fileInput = ref<HTMLInputElement | null>(null);
const maxDate = new Date().toISOString().split('T')[0];

onMounted(() => {
    props.dataSeries.dataButtonBulkUpload.onClick = triggerFileInput;
});

function triggerFileInput() {
  fileInput.value?.click();
}

function fileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files ? target.files[0] : null
  if (file) {
    props.dataSeries.processFileUpload(file)
  }
}

function applyFilters(selectedOptions: Array<{ value: any }>){
    emits("applyFilters", selectedOptions);
}

</script>

<style scoped src="./Series.template.scss"></style>
