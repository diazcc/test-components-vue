<template>
    <article class="record">
        <header class="record__header">
            <h1 class="record__header__title">{{ LangServices.validateTranslation('record_data') }}</h1>
            <!-- <SelectActions :dataSelect="dataRecord.dataSelectActions" class="record__header__actions" /> -->
            <nav class="record__header__buttons-nav">
                <ImgAtom class="record__header__buttons-nav__img" :dataImg="dataRecord.dataImgGoBack" />
            </nav>
        </header>
        <section class="record__info" v-if="dataRecord.info.code != null && dataRecord.info.code != ''">
            <ul class="record__info__content">
                <li class="record__info__content__card" >
                    <p class="record__info__content__card__subtitle">
                        {{ LangServices.validateTranslation('name') }}:

                        <span>
                            {{ dataRecord.info.name || t('does_not_have') }}
                        </span>
                    </p>
                </li>
                <li class="record__info__content__card">
                    <p class="record__info__content__card__subtitle">
                        {{ LangServices.validateTranslation('code')  }}:
                        <span>
                            {{ dataRecord.info.code }}
                        </span>
                    </p>
                </li>
              
                <li class="record__info__content__card">
                    <p class="record__info__content__card__subtitle">
                        {{ LangServices.validateTranslation('id') }}:

                        <span>
                            {{ dataRecord.info.id }}
                        </span>
                    </p>
                </li>
                
            </ul>
            <ul class="record__info__content">
                
                <li class="record__info__content__card">
                    <p class="record__info__content__card__subtitle">
                        {{ LangServices.validateTranslation('serie') }}:

                        <span>
                            {{ dataRecord.info.serie || t('does_not_have') }}
                        </span>
                    </p>
                </li>
                <li class="record__info__content__card">
                    <p class="record__info__content__card__subtitle">
                        {{ LangServices.validateTranslation('subserie') }}:

                        <span>
                            {{ dataRecord.info.subserie || t('does_not_have') }}
                        </span>
                    </p>
                </li>
            </ul>
        </section>
        <section class="record__info" v-else>
            <ul class="record__info__content">
                <li class="record__info__content__card">
                    <p
                        class="record__info__content__card__subtitle loading-component record__info__content__card__subtitle--load">
                    </p>
                </li>
                <li class="record__info__content__card">
                    <p
                        class="record__info__content__card__subtitle loading-component record__info__content__card__subtitle--load">
                    </p>
                </li>
                <li class="record__info__content__card">
                    <p
                        class="record__info__content__card__subtitle loading-component record__info__content__card__subtitle--load">
                    </p>
                </li>
                <li class="record__info__content__card">
                    <p
                        class="record__info__content__card__subtitle loading-component record__info__content__card__subtitle--load">
                    </p>
                </li>
            </ul>
            <ul class="record__info__content">
                <li class="record__info__content__card">
                    <p
                        class="record__info__content__card__subtitle loading-component record__info__content__card__subtitle--load">
                    </p>
                </li>
                <li class="record__info__content__card">
                    <p
                        class="record__info__content__card__subtitle loading-component record__info__content__card__subtitle--load">
                    </p>
                </li>
                <li class="record__info__content__card">
                    <p
                        class="record__info__content__card__subtitle loading-component record__info__content__card__subtitle--load">
                    </p>
                </li>
            </ul>
        </section>
        <section class="record__wrapper">
            <ul class="record__wrapper__navegation">
                <li :class="'record__wrapper__navegation__card record__wrapper__navegation__card--' + (dataRecord.stateViewDocument ? 'focused' : '')"
                    @click="dataRecord.redirectDocument">{{ LangServices.validateTranslation('documents') }}
                </li>
                <li :class="'record__wrapper__navegation__card record__wrapper__navegation__card--' + (dataRecord.stateAssignFile ? 'focused' : '')"
                    @click="dataRecord.redirectAssignFiles"
                    v-if="hasPermissions.validator('move_files')">
                    {{ t('assign_file') }}
                </li>
            </ul>
            <div class="record__wrapper__container">
                <ul class="record__wrapper__container__documents" v-if="dataRecord.stateViewDocument">
                    <table class="table">
                        <tr class="table__row table--row2" v-for="document in dataRecord.info.documents">
                            <p class="table__row__cell">{{ document.name }}</p>
                            <TooltipIcon v-if="dataRecord.dataTooltipIcons[0].show()" :dataTooltipIcon="dataRecord.dataTooltipIcons[0]" @click="dataRecord.dataTooltipIcons[0].onClick({document: document})"/>
                        </tr>
                    </table>
                </ul>
                <ul :class="'record__wrapper__container__element ' + (dataRecord.stateLoadassign ? 'loading-component' : '')" 
                    v-else-if="dataRecord.stateAssignFile">
                    <nav class="record__wrapper__container__element__nav-options">
                        <InputSearch :dataInputSearch="dataRecord.dataInputSearch" />
                    </nav>
                    <table class="table">
                        <thead class="table__row table--header">
                            <th class="table__row__cell">
                                <input type="checkbox" name="" id=""
                                :checked="dataRecord.isAllChecked"
                                @click="dataRecord.checkAll">
                            </th>
                            <th class="table__row__cell">{{ t('item') }}</th>
                            <th class="table__row__cell">{{ t('code') }}</th>
                            <th class="table__row__cell">{{ t('name') }}</th>
                            <th class="table__row__cell">{{ t('actions') }}</th>
                        </thead>
                        <tbody v-if="dataRecord.stateLoadTable" class="table__row table--only-row loading-component">
                            <td class="table__row__cell" > {{ t('loading') }} </td>
                        </tbody>
                        <tbody v-else-if="dataRecord.files.length < 1" class="table__row table--only-row">
                            <td class="table__row__cell"> {{ t('no_results_found') }} </td>
                        </tbody>
                        <tbody v-else class="table__row" v-for="(data, index) in dataRecord.files" :key="index" @click="data.checked = !data.checked">
                            <td class="table__row__cell">
                                <input type="checkbox" name="" id=""
                                :checked="data.checked">
                            </td>
                            <td class="table__row__cell">{{ index+1 }}</td>
                            <td class="table__row__cell">{{ data.code || 'null' }}</td>
                            <td class="table__row__cell table__row__cell--left-align">{{ data.name || 'null' }}</td>
                            <td class="table__row__cell table__row--img">
                                <TooltipIcon v-if="dataRecord.dataTooltipIcons[0].show()" :dataTooltipIcon="dataRecord.dataTooltipIcons[0]" @click="dataRecord.dataTooltipIcons[0].onClick({document: data, data: data})"/>
                            </td>
                        </tbody>
                    </table>
                    <nav class="record__wrapper__container__element__nav-options">
                        <Button class="record__wrapper__container__element__nav-options__button"
                        :dataButton="dataRecord.dataButtonAssign" />
                    </nav>
                </ul>
            </div>
        </section>
    </article>
    <ModalPdfViewer :dataModalPdfViewer="dataRecord.dataModalPdfViewer" />
    <ModalConfirmation :dataModalConfirmation="dataRecord.dataModalConfirmation" />
    <ModalAlert :dataModalAlert="dataRecord.dataModalAlert" />
</template>
<script  setup lang="ts">
import { useI18n } from 'vue-i18n';
import { defineAsyncComponent, ref } from 'vue';
import ImgAtom from '../../atoms/img/Img.atom.vue';
import LangServices from '../../../services/LangServices';
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import Button from '../../atoms/button/Button.atom.vue';
import TooltipIcon from '../../atoms/tooltip-icon/TooltipIcon.atom.vue';
import hasPermissions from '../../../guards/hasPermissions.guard';

const ModalConfirmation = defineAsyncComponent(() => import('../../molecules/modals/confirmation/ModalConfirmation.molecule.vue'));
const ModalAlert = defineAsyncComponent(() => import('../../molecules/modals/alert/ModalAlert.molecule.vue'));
const ModalPdfViewer = defineAsyncComponent(() => import('../../molecules/modals/modal-pdf-viewer/ModalPdfViewer.molecule.vue'));

const { t } = useI18n();
const props: any = defineProps(['dataRecord'])

</script>

<style scoped src="./Record.template.scss"></style>