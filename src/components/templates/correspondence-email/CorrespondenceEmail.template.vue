<template>
    <article class="template-table-view" v-if="!dataCorrespondenceEmail.stateFormEmail">
        <section class="template-table-view__content">
            <header class="template-table-view__header">
                <h1 class="template-table-view__header__title">
                    {{ t('email') }}
                </h1>
                <Button :class="'template-table-view__header__button ' + (dataCorrespondenceEmail.stateLoadData ? 'loader' : '')"
                        :dataButton="dataCorrespondenceEmail.dataButtonRefresh"
                        v-if="dataCorrespondenceEmail.currentPage == 1"/>
            </header>
            <section class="template-table-view__list">
                <nav class="template-table-view__list__nav">
                    <MultiSelect :dataMultiSelect="dataCorrespondenceEmail.dataMultiSelect" @onChange="applyFilters"/>
                    <InputSearch :dataInputSearch="dataCorrespondenceEmail.dataInputSearch" />
                </nav>
                <table class="table">
                    <thead class="table__row table--header">
                        <th class="table__row__cell--check"><input type="checkbox"
                                @click="dataCorrespondenceEmail.selectAllEmails"
                                v-model="dataCorrespondenceEmail.stateCheckAll"></th>
                        <th class="table__row__cell">{{ t('item') }}</th>
                        <th class="table__row__cell">{{ t('subject') }}</th>
                        <th class="table__row__cell">{{ t('from') }}</th>
                        <th class="table__row__cell">{{ t('date') }}</th>
                        <th class="table__row__cell">{{ t('time') }}</th>
                    </thead>
                    <tbody class="table__row table--only-row loading-component" v-if="dataCorrespondenceEmail.stateLoadData">
                        <td class="table__row__cell">{{ t('loading') }}</td>
                    </tbody>
                    <tbody class="table__row table--only-row" v-else-if="dataCorrespondenceEmail.list.length < 1">
                        <td class="table__row__cell">{{ t('no_results_found') }}</td>
                    </tbody>
                    <tbody class="table__row" v-else v-for="(email, index) in arrayList"
                        :key="index">
                        <td class="table__row__cell">
                            <input type="checkbox" name="" id=""
                                @change="dataCorrespondenceEmail.selectEmail(email.uid)">
                        </td>
                        <td @click="dataCorrespondenceEmail.openEmail(email)"
                            class="table__row__cell">
                            {{ index+1 }}
                        </td>
                        <td @click="dataCorrespondenceEmail.openEmail(email)"
                            class="table__row__cell table__row__cell--left-align">
                            {{ email?.subject || t('without_subject') }}
                        </td>
                        <td @click="dataCorrespondenceEmail.openEmail(email)"
                            class="table__row__cell table__row__cell--left-align">
                            {{ extractEmail(email?.from) }}
                        </td>
                        <td @click="dataCorrespondenceEmail.openEmail(email)"
                            class="table__row__cell">
                            {{ email?.date }}
                        </td>
                        <td @click="dataCorrespondenceEmail.openEmail(email)"
                            class="table__row__cell">
                            {{ email?.time }}
                        </td>
                    </tbody>
                </table>
                <nav class="correspondence-email__list__bottom">
                    <Button :dataButton="dataCorrespondenceEmail.dataButtonDelete"
                        v-if="hasPermissions.validator('delete_email')"
                        class="correspondence-email__list__bottom__delete" />
                </nav>
            </section>
            <Paginator :dataPaginator="dataCorrespondenceEmail.dataPaginator" />
        </section>
    </article>

    <article class="correspondence-email__form"
        v-if="dataCorrespondenceEmail.stateFormEmail && dataCorrespondenceEmail.stateResultResponse">
        <h2 class="correspondence-email__form__title">{{ t('email_filing') }}</h2>
        <section
            :class="'correspondence-email__form__wrapper' + (dataCorrespondenceEmail.stateLoadForm ? ' loading-component ' : '')">
            <ul class="correspondence-email__form__wrapper__email-info">
                <input v-model="dataCorrespondenceEmail.form.subject" type="text" name="" id=""
                    :placeholder="t('subject')" maxlength="100" required>
                <div>
                    <InputFiles :dataInputFiles="dataCorrespondenceEmail.dataInputFiles"
                        @emitDocSelected="emitDocSelected" />
                </div>
                <textarea class="correspondence-email__form__wrapper__email-info__desciption"
                    v-model="dataCorrespondenceEmail.form.description" name="" id="" cols="30" rows="10"
                    :placeholder="t('description')" maxlength="300"></textarea>
            </ul>
            <ul class="correspondence-email__form__wrapper__remitter-info">
                <li class="correspondence-email__form__wrapper__remitter-info__nav">
                    <label>{{ t('natural_person') }}</label>
                    <input v-model="dataCorrespondenceEmail.form.person_type" type="radio" name="option" id=""
                        value="001">
                    <label>{{ t('legal_person') }}</label>
                    <input v-model="dataCorrespondenceEmail.form.person_type" type="radio" name="option" id=""
                        value="002">
                </li>
                <input v-if="dataCorrespondenceEmail.form.person_type == 1" v-model="dataCorrespondenceEmail.form.id"
                    type="text" name="" id="" :placeholder="t('id')">
                <input v-if="dataCorrespondenceEmail.form.person_type == 1"
                    v-model="dataCorrespondenceEmail.form.first_name" type="text" name="" id=""
                    :placeholder="t('first_name')">
                <input v-if="dataCorrespondenceEmail.form.person_type == 1"
                    v-model="dataCorrespondenceEmail.form.last_name" type="text" name="" id=""
                    :placeholder="t('last_name')">
                <input v-if="dataCorrespondenceEmail.form.person_type == 2"
                    v-model="dataCorrespondenceEmail.form.social_razon" type="text" name="" id=""
                    :placeholder="t('social_razon')">
                <input v-if="dataCorrespondenceEmail.form.person_type == 2" v-model="dataCorrespondenceEmail.form.nit"
                    type="text" name="" id="" :placeholder="t('nit')">
                <input v-if="dataCorrespondenceEmail.form.person_type == 1"
                    v-model="dataCorrespondenceEmail.form.address" type="text" name="" id=""
                    :placeholder="t('address')">
                <input type="text" name="" id="" :placeholder="t('phone')" v-model="dataCorrespondenceEmail.form.phone">
                <input type="email" name="" id="" :placeholder="t('email')" v-model="dataCorrespondenceEmail.form.email"
                    required>
                <Select :dataSelect="dataCorrespondenceEmail.dataSelectDependence" />
                <Select :dataSelect="dataCorrespondenceEmail.dataSelectUser"
                    :required="dataCorrespondenceEmail.dataSelectDependence.model != '' && dataCorrespondenceEmail.dataSelectDependence.model != null" />
            </ul>
        </section>
        <nav class="correspondence-email__form__nav">
            <Button class="correspondence-email__form__nav__button"
                :dataButton="dataCorrespondenceEmail.dataButtonBack" />
            <Button class="correspondence-email__form__nav__button"
                :dataButton="dataCorrespondenceEmail.dataButtonNext" />
        </nav>
    </article>
    <article class="correspondence-email__form"
        v-if="dataCorrespondenceEmail.stateFormEmail && !dataCorrespondenceEmail.stateResultResponse">
        <h1 class="correspondence-email__form__title">{{ t('email_filing') }}</h1>

        <section class="correspondence-email__form__wrapper">
            <ul class="correspondence-email__form__wrapper__email-info">
                <li class="loading-component"></li>
                <li class="loading-component"></li>
                <li class="loading-component"></li>
                <li class="loading-component"></li>
                <li class="loading-component"></li>

            </ul>
            <ul class="correspondence-email__form__wrapper__remitter-info">
                <li class="loading-component"></li>
                <li class="loading-component"></li>
                <li class="loading-component"></li>
                <li class="loading-component"></li>
            </ul>
        </section>
        <nav class="correspondence-email__form__nav">
            <Img class="correspondence-email__form__nav__img" :dataImg="dataCorrespondenceEmail.dataImgBack" />
        </nav>
    </article>
    <ModalAlert :dataModalAlert="dataCorrespondenceEmail.dataModalAlert" />
    <ModalConfirmation :dataModalConfirmation="dataCorrespondenceEmail.dataModalConfirmation" />
    <ModalPdfViewer :dataModalPdfViewer="dataCorrespondenceEmail.dataModalPdfViewer" />
</template>
<script setup lang="ts">

// Import vue library
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

// Import components
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import ModalAlert from '../../molecules/modals/alert/ModalAlert.molecule.vue';
import InputFiles from '../../molecules/input-files/InputFiles.molecule.vue';
import Button from '../../atoms/button/Button.atom.vue';
import Img from '../../atoms/img/Img.atom.vue';
import Select from '../../atoms/select/Select.atom.vue';
import ModalConfirmation from '../../molecules/modals/confirmation/ModalConfirmation.molecule.vue';
import ModalPdfViewer from '../../molecules/modals/modal-pdf-viewer/ModalPdfViewer.molecule.vue';
import Paginator from '../../molecules/paginator/Paginator.molecule.vue';
import MultiSelect from '../../atoms/multi-select/MultiSelect.atom.vue';

// Import services
import hasPermissions from '../../../guards/hasPermissions.guard';
import { accessStore } from '../../../store';

// Define props and emits and config
const { t } = useI18n();
const store = accessStore();
const props = defineProps(['dataCorrespondenceEmail', 'arrayList']);
const emits = defineEmits(['emitDocSelected', 'applyFilters']);

// Functions

function extractEmail(emailString: string): string {
    const emailPattern = /<(.+)>/;
    const match = emailString.match(emailPattern);

    if (match && match[1]) {
        return match[1];
    }

    return 'Empty'; // Devuelve null si no se encuentra una dirección de correo válida
}

const isHeaderChecked = computed(() => {
    if (props.arrayList.length < 0) return false;
});

function emitDocSelected(file: any) {
    emits("emitDocSelected", file);
}

function applyFilters(selectedOptions: Array<{ value: any }>){
    emits("applyFilters", selectedOptions);
}

</script>

<style scoped src="./CorrespondenceEmail.template.scss"></style>