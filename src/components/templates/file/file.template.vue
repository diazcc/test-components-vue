<template>
    <article class="file">
        <header class="file__header">
            <h1 class="file__header__title">{{ t('file_data') }}</h1>
            <Select v-if="hasPermissions.validator('update_files')" 
            :dataSelect="dataFile.dataSelectActions" class="file__header__actions" />
            <nav class="file__header__nav" >
                <Img class="file__header__nav__img" :dataImg="dataFile.dataImgGoBack"/>
            </nav>  
        </header>
        <section class="file__info" v-if="dataFile.data.date!= '' && dataFile.data.date != null">
            <ul class="file__info__form">
                <li class="file__info__form__card">
                    <label>
                        {{ t('archive_number') }}:
                    </label>
                    <p> {{dataFile.data.archive_number}} </p>
                </li>
                <li class="file__info__form__card">
                    <label>
                        {{ t('name') }}:
                    </label>
                    <p v-if="!dataFile.stateEditForm">{{ dataFile.data.name }}</p>
                    <input v-else :class="'input input--' + (dataFile.stateEditForm ? 'form-blue-lighting' : 'read')"
                        v-model="dataFile.data.name"
                        :placeholder="dataFile.data.name != '' && dataFile.data.name != 'undefined' ? dataFile.data.name : t('name')"
                        type="text">
                </li>
                <li class="file__info__form__card">
                    <label>
                        {{ t('type_documental') }}:
                    </label>
                    <p v-if="!dataFile.stateEditForm">{{ dataFile.dataSelectDocumentaryType.text }}</p>
                    <Select v-else :dataSelect="dataFile.dataSelectDocumentaryType" :class="'input input--' + (dataFile.stateEditForm ? 'form-blue-lighting' : 'read')" />
                </li>
                <li class="file__info__form__card">
                    <label>
                        {{ t('creation_date') }}:
                    </label>
                    <p> {{dataFile.data.date}} </p>
                </li>
                <li class="file__info__form__card">
                    <label>
                        {{ t('number_of_pages') }}:
                    </label>
                    <p> {{dataFile.data.number_of_pages}} </p>
                </li>
                <li class="file__info__form__card">
                    <label>
                        {{ t('dependences') }}:
                    </label>
                    <p> {{dataFile.data.dependences_to_show}} </p>
                </li>
            </ul>
        </section>
        <section class="file__info" v-else>
            <ul class="file__info__content">
                <li class="file__info__content__card">
                    <p
                        class="file__info__content__card__subtitle loading-component file__info__content__card__subtitle--load">
                    </p>
                </li>
                <li class="file__info__content__card">
                    <p
                        class="file__info__content__card__subtitle loading-component file__info__content__card__subtitle--load">
                    </p>
                </li>
                <li class="file__info__content__card">
                    <p
                        class="file__info__content__card__subtitle loading-component file__info__content__card__subtitle--load">
                    </p>
                </li>
            </ul>
            <ul class="file__info__content">
                <li class="file__info__content__card">
                    <p
                        class="file__info__content__card__subtitle loading-component file__info__content__card__subtitle--load">
                    </p>
                </li>
                <li class="file__info__content__card">
                    <p
                        class="file__info__content__card__subtitle loading-component file__info__content__card__subtitle--load">
                    </p>
                </li>
            </ul>
        </section>
        <section class="file__wrapper" v-if="dataFile.data.date != null && dataFile.data.date != ''">
            <ul class="file__wrapper__navegation">
                <li :class="'file__wrapper__navegation__card file__wrapper__navegation__card--' + (dataFile.stateViewDocument ? 'focused' : '')"
                    @click="dataFile.redirectDocument">{{ t('files') }}
                </li>
                <li v-if="hasPermissions.validator('move_files')" :class="'file__wrapper__navegation__card file__wrapper__navegation__card--' + (dataFile.stateAssignRecord ? 'focused' : '')"
                    @click="dataFile.redirectAssignRecord">
                    {{ t('assign_record') }}
                </li>
                <li v-if="hasPermissions.validator('share_file')" :class="'file__wrapper__navegation__card file__wrapper__navegation__card--' + (dataFile.stateAssignDependencies ? 'focused' : '')"
                    @click="dataFile.redirectAssignDependencies">
                    {{ t('assign_dependencies') }}
                </li>
            </ul>
            <div class="file__wrapper__container">
                <div class="file__wrapper__container__element" v-if="dataFile.stateViewDocument">
                    <div class="file__wrapper__container__element__content-pdf">
                        <PdfViewer :dataPdfViewer="dataFile?.dataPdfViewer" />
                    </div>
                </div>
                <div class="file__wrapper__container__element" v-if="dataFile.stateAssignRecord && hasPermissions.validator('move_files')">
                    <nav class="file__wrapper__container__element__nav-options">
                        <InputSearch :dataInputSearch="dataFile.dataInputSearch" />
                    </nav>
                    <table class="table">
                        <thead class="table__row table--header">
                            <th class="table__row__cell"></th>
                            <th class="table__row__cell">{{ t('item') }}</th>
                            <th class="table__row__cell">{{ t('code') }}</th>
                            <th class="table__row__cell">{{ t('name') }}</th>
                        </thead>
                        <tbody v-if="dataFile.stateLoadTable" class="table__row table--only-row loading-component">
                            <td class="table__row__cell" > {{ t('loading') }} </td>
                        </tbody>
                        <tbody v-else-if="dataFile.records.lengh < 1" class="table__row table--only-row">
                            <td class="table__row__cell"> {{ t('no_results_found') }} </td>
                        </tbody>
                        <tbody v-else class="table__row" v-for="(data, index) in dataFile.records"
                                @click="dataFile.selectRecord(data)">
                            <td class="table__row__cell">
                                <input type="checkbox" name="" id=""
                                :checked="dataFile.selectedCode?.id === data.id" >
                            </td>
                            <td class="table__row__cell">{{ index+1 }}</td>
                            <td class="table__row__cell">{{ data.code || 'null' }}</td>
                            <td class="table__row__cell">{{ data.name || 'null' }}</td>
                        </tbody>
                    </table>
                    <nav class="file__wrapper__container__element__nav-options">
                        <Button class="file__wrapper__container__element__nav-options__button"
                        :dataButton="dataFile.dataButtonAssign" />
                    </nav>
                </div>
                <div class="file__wrapper__container__element" v-if="dataFile.stateAssignDependencies && hasPermissions.validator('share_file')">
                    <nav class="file__wrapper__container__element__nav-options">
                        <InputSearch :dataInputSearch="dataFile.dataInputSearch2" />
                    </nav>
                    <table class="table">
                        <thead class="table__row table--header">
                            <th class="table__row__cell">
                                <input type="checkbox" name="" id=""
                                :checked="dataFile.isAllChecked"
                                @click="dataFile.checkAll">
                            </th>
                            <th class="table__row__cell">{{ t('item') }}</th>
                            <th class="table__row__cell">{{ t('code') }}</th>
                            <th class="table__row__cell">{{ t('name') }}</th>
                        </thead>
                        <tbody v-if="dataFile.stateLoadTable" class="table__row table--only-row loading-component">
                            <td class="table__row__cell" > {{ t('loading') }} </td>
                        </tbody>
                        <tbody v-else-if="dataFile.dependencesList.length < 1" class="table__row table--only-row">
                            <td class="table__row__cell"> {{ t('no_results_found') }} </td>
                        </tbody>
                        <tbody v-else class="table__row" v-for="(data, index) in dataFile.dependencesList" :key="index" @click="data.checked = !data.checked">
                            <td class="table__row__cell">
                                <input type="checkbox" name="" id=""
                                :checked="data.checked">
                            </td>
                            <td class="table__row__cell">{{ index+1 }}</td>
                            <td class="table__row__cell">{{ data.code || 'null' }}</td>
                            <td class="table__row__cell table__row__cell--left-align">{{ data.name || 'null' }}</td>
                        </tbody>
                    </table>
                    <nav class="file__wrapper__container__element__nav-options">
                        <Button class="file__wrapper__container__element__nav-options__button"
                        :dataButton="dataFile.dataButtonAssign" />
                    </nav>
                </div>
            </div>
        </section>
    </article>
    <ModalConfirmation :dataModalConfirmation="dataFile.dataModalConfirmation" />
    <ModalAlert :dataModalAlert="dataFile.dataModalAlert" />
</template>

<script setup lang="ts">

import Button from '../../atoms/button/Button.atom.vue';
import Select from '../../atoms/select/Select.atom.vue';
import Img from '../../atoms/img/Img.atom.vue';
import PdfViewer from '../../atoms/pdf-viewer/PdfViewer.atom.vue';
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import hasPermissions from '../../../guards/hasPermissions.guard';
import Paginator from '../../molecules/paginator/Paginator.molecule.vue';
import { defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

const ModalAlert = defineAsyncComponent(() => import('../../molecules/modals/alert/ModalAlert.molecule.vue'));
const ModalConfirmation = defineAsyncComponent(() => import('../../molecules/modals/confirmation/ModalConfirmation.molecule.vue'));

const { t } = useI18n();
const props = defineProps(['dataFile']);

</script>

<style scoped src="./file.template.scss"></style>