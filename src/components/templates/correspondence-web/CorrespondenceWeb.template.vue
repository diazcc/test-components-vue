<template>
    <main class="correspondence-web">
        <header class="correspondence-web__header">
            <img src="/logos/docugate-ai.svg" alt="" class="correspondence-web__header__img">
            <SelectLangMolecule/>
        </header>
        <article class="correspondence-web__content">
            <h1 v-if="validateForm() == 'remitter'" class="correspondence-web__content__title">{{ t('remitter_data') }}
            </h1>
            <h1 v-else-if="validateForm() == 'filing'" class="correspondence-web__content__title">{{ t('filing') }}</h1>
            <h1 v-else="validateForm()=='response'" class="correspondence-web__content__title">¡{{ t('filing_sent') }}!
            </h1>
            <p class="correspondence-web__content__sub-title" v-if="validateForm() != 'response'">{{ t('please_fill_out_the_following_form') }}</p>
            <p class="correspondence-web__content__sub-title" v-if="validateForm() == 'response'">{{
                t('your_application_was_sent_correctly_the_application_report_will_be_sent_to_your_email') }}</p>
            <section
                :class="'correspondence-web__content__bk ' + (dataCorrespondenceWeb.stateFormLoad ? 'loading-component' : '')">
                <ul :class="'correspondence-web__content__bk__form correspondence-web__content__bk__form--' + validateForm()">
                    <nav class="correspondence-web__content__bk__form__header">
                        <a class="correspondence-web__content__bk__form__header__option"
                            v-for="(option, index) in  dataCorrespondenceWeb.types_person">
                            <label>
                                {{ t(option.label) }}
                            </label>
                            <input type="radio" name="option" v-model="dataCorrespondenceWeb.type_of_person"
                                :value="option.code" @click="dataCorrespondenceWeb.setForm(option.code)">
                        </a>
                    </nav>
                    <template v-if="validateForm() == 'remitter' && dataCorrespondenceWeb.stateFormRemitter">


                        <li class="correspondence-web__content__bk__form__card"
                            v-if="dataCorrespondenceWeb.type_of_person == '002'">
                            <label>
                                {{ t('social_razon') }} :
                            </label>
                            <input type="text" :placeholder="t('social_razon')"
                                v-model="dataCorrespondenceWeb.form.social_reason" required>
                        </li>
                        <li class="correspondence-web__content__bk__form__card"
                            v-if="dataCorrespondenceWeb.type_of_person == '002'">
                            <label>
                                {{ t('contact_name') }} :
                            </label>
                            <input type="text" :placeholder="t('contact_name')"
                                v-model="dataCorrespondenceWeb.form.contact_name" required>
                        </li>
                        <li class="correspondence-web__content__bk__form__card"
                            v-if="dataCorrespondenceWeb.type_of_person == '002'">
                            <label>
                                {{ t('nit') }} :
                            </label>
                            <input type="text" :placeholder="t('nit')" v-model="dataCorrespondenceWeb.form.nit_number"
                                required>
                        </li>
                        <li class="correspondence-web__content__bk__form__card"
                            v-if="dataCorrespondenceWeb.type_of_person != '002'">
                            <label>
                                {{ t('first_name') }} :
                            </label>
                            <input type="text" :placeholder="t('first_name')"
                                v-model="dataCorrespondenceWeb.form.first_name" required>
                        </li>
                        <li class="correspondence-web__content__bk__form__card"
                            v-if="dataCorrespondenceWeb.type_of_person != '002'">
                            <label>
                                {{ t('second_name') }}:
                            </label>
                            <input type="text" :placeholder="t('second_name')"
                                v-model="dataCorrespondenceWeb.form.second_name">
                        </li>
                        <li class="correspondence-web__content__bk__form__card"
                            v-if="dataCorrespondenceWeb.type_of_person != '002'">
                            <label>
                                {{ t('last_name') }} :
                            </label>
                            <input type="text" :placeholder="t('last_name')"
                                v-model="dataCorrespondenceWeb.form.last_name" required>
                        </li>
                        <li class="correspondence-web__content__bk__form__card"
                            v-if="dataCorrespondenceWeb.type_of_person != '002'">
                            <label>
                                {{ t('second_last_name') }}:
                            </label>
                            <input type="text" :placeholder="t('second_last_name')"
                                v-model="dataCorrespondenceWeb.form.second_last_name">
                        </li>
                        <li class="correspondence-web__content__bk__form__card"
                            v-if="dataCorrespondenceWeb.type_of_person != '002'">
                            <label>
                                {{ t('identification_type') }} : 
                            </label>
                            <SelectAtom :dataSelect="dataCorrespondenceWeb.dataSelectIdType" />
                        </li>
                        <li class="correspondence-web__content__bk__form__card"
                            v-if="dataCorrespondenceWeb.type_of_person != '002'">
                            <label>
                                {{ t('identification_number') }} :
                            </label>
                            <input type="text" :placeholder="t('identification_number')"
                                v-model="dataCorrespondenceWeb.form.identification_number" required>
                        </li>
                        <li class="correspondence-web__content__bk__form__card">
                            <label>
                                {{ t('select_country') }} :
                            </label>
                            <SelectAtom :dataSelect="dataCorrespondenceWeb.dataSelectCountry" />
                        </li>
                        <li class="correspondence-web__content__bk__form__card">
                            <label>
                                {{ t('select_department') }} :
                            </label>
                            <SelectAtom :dataSelect="dataCorrespondenceWeb.dataSelectDepartment" />
                        </li>
                        <li class="correspondence-web__content__bk__form__card">
                            <label>
                                {{ t('select_city') }} :
                            </label>
                            <SelectAtom :dataSelect="dataCorrespondenceWeb.dataSelectCity" />
                        </li>
                        <li class="correspondence-web__content__bk__form__card">
                            <label>
                                {{ t('address') }}:
                            </label>
                            <input type="text" :placeholder="t('address')" v-model="dataCorrespondenceWeb.form.address" required>
                        </li>
                        <li class="correspondence-web__content__bk__form__card">
                            <label>
                                {{ t('phone_number') }} :
                            </label>
                            <input type="number" :placeholder="t('phone_number')"
                                v-model="dataCorrespondenceWeb.form.phone_number" required>
                        </li>
                        <li class="correspondence-web__content__bk__form__card">
                            <label>
                                {{ t('email') }} :
                            </label>
                            <input type="text" :placeholder="t('email')" v-model="dataCorrespondenceWeb.form.email"
                                required>
                        </li>
                    </template>
                    <template v-else>
                        <ul class="correspondence-web__content__bk__form__guide">
                            <p>{{ t('select_the_type_of_person_to_fill_out_the_form') }}</p>
                        </ul>
                    </template>
                </ul>

                <ul class="correspondence-web__content__bk__grid-container"
                    v-if="validateForm() == 'filing' || validateForm() == 'response'">
                    <!-- <li class="correspondence-web__content__bk__form__card">
                        <label>
                            {{ t('folio_number') }}:
                        </label>
                        <input type="text" :placeholder="t('folio_number')"
                            v-model="dataCorrespondenceWeb.form.folio_number" required>
                    </li> -->
                    <li class="correspondence-web__content__bk__form__card correspondence-web__content__bk__grid-container__card item1">
                        <input type="text" :placeholder="t('subject')" v-model="dataCorrespondenceWeb.form.subject"
                            required>
                    </li>
                    <li class="correspondence-web__content__bk__form__card correspondence-web__content__bk__grid-container__card item2">
                        <textarea :placeholder=" t('verbal_message')" v-model="dataCorrespondenceWeb.form.description" maxlength="500"></textarea>
                    </li>
                    <li class="correspondence-web__content__bk__form__card correspondence-web__content__bk__grid-container__card item3">
                        <SelectAtom :dataSelect="dataCorrespondenceWeb.dataSelectResponseMode" />
                    </li>
                    <li class="correspondence-web__content__bk__form__card correspondence-web__content__bk__grid-container__card item4">
                        <InputFilesMolecule :dataInputFiles="dataCorrespondenceWeb.dataInputFiles" @emitDocSelected="emitDocSelected"/>
                    </li>
                </ul>
                <ol class="correspondence-web__content__bk__response"
                    v-if="validateForm() == 'filing' || validateForm() == 'response'">
                    <a class="correspondence-web__content__bk__response__img">
                        <img :src="dataCorrespondenceWeb.response.url">
                    </a>
                    <ul class="correspondence-web__content__bk__response__info">
                        <li class="correspondence-web__content__bk__response__info__card">
                            <p>{{ t('subject') }}:</p>
                            <p>{{ dataCorrespondenceWeb.response.subject }}</p>
                        </li>
                        <li class="correspondence-web__content__bk__response__info__card">
                            <p>{{ t('filing_number') }}:</p>
                            <p>{{ dataCorrespondenceWeb.response.filing_number }}</p>
                        </li>
                        <li class="correspondence-web__content__bk__response__info__card">
                            <p>{{ t('creation_date') }}:</p>
                            <p>{{ dataCorrespondenceWeb.response.creation_date }}</p>
                        </li>
                        <li class="correspondence-web__content__bk__response__info__card">
                            <p>{{ t('email') }}:</p>
                            <p>{{ dataCorrespondenceWeb.response.email }}</p>
                        </li>
                        <li class="correspondence-web__content__bk__response__info__card">
                            <p>{{ t('response_mode') }}:</p>
                            <p>{{ t(dataCorrespondenceWeb.response.response_mode) }}</p>
                        </li>
                        <li class="correspondence-web__content__bk__response__info__card">
                            <button class="button--blue" @click="dataCorrespondenceWeb.downloadPdfQR()">{{ t('qr_certificate') }}</button>
                            <button class="button--blue" @click="dataCorrespondenceWeb.downloadPdfCertificated()">{{ t('filing_certificate') }}</button>
                        </li>
                    </ul>
                </ol>
            </section>
            <nav class="correspondence-web__content__nav">
                <Button class="correspondence-web__content__nav__button" 
                    :dataButton="dataCorrespondenceWeb.dataButtonBack" />
                <Button class="correspondence-web__content__nav__button" v-if="!dataCorrespondenceWeb.stateFormResponse && !dataCorrespondenceWeb.stateFormLoad"
                    :dataButton="dataCorrespondenceWeb.dataButtonNext" />
            </nav>
        </article>
        <Footer class="correspondence-web__footer"/>

        <ModalAlertMolecule :dataModalAlert="dataCorrespondenceWeb.dataModalAlert" />
        <ModalConfirmation :dataModalConfirmation="dataCorrespondenceWeb.dataModalConfirmation" />
        <ModalPdfViewer :dataModalPdfViewer="dataCorrespondenceWeb.dataModalPdfViewer" />
    </main>
</template>

<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import Button from '../../atoms/button/Button.atom.vue';
import SelectAtom from '../../atoms/select/Select.atom.vue';
import ModalAlertMolecule from '../../molecules/modals/alert/ModalAlert.molecule.vue';
import ModalConfirmation from '../../molecules/modals/confirmation/ModalConfirmation.molecule.vue';
import InputFilesMolecule from '../../molecules/input-files/InputFiles.molecule.vue';
import ModalPdfViewer from '../../molecules/modals/modal-pdf-viewer/ModalPdfViewer.molecule.vue';
import Footer from '../../organisms/footer/Footer.organism.vue';
import { watch, Ref, ref, onMounted } from 'vue';
import SelectLangMolecule from '../../molecules/select-lang/SelectLang.molecule.vue';
const props = defineProps(['dataCorrespondenceWeb']);
const emits = defineEmits(['emitDocSelected']);
const { t, locale } = useI18n();
const listIdType: any = ref([]);

function emitDocSelected(file: any) {
  emits("emitDocSelected", file);
}

function validateForm(): string {
    let modifier: string = 'remitter';
    if (props.dataCorrespondenceWeb.stateFormRemitter) {
        modifier = 'remitter';
    }
    if (props.dataCorrespondenceWeb.stateFormFiling) {
        modifier = 'filing';
    }
    if (props.dataCorrespondenceWeb.stateFormResponse) {
        modifier = 'response';
    }
    return modifier;
}

watch(props.dataCorrespondenceWeb.type_of_person, (newFiles: any, oldFiles: any) => validationIdType(newFiles));

watch(() => props.dataCorrespondenceWeb.listIdTypes, async (newVal) => {
    if (newVal) {
        listIdType.value = await newVal;
        validationIdType(await props.dataCorrespondenceWeb.type_of_person);
    }
}, { immediate: true });

function validationIdType(code: string): void {
    if (code == '003') {
        let data: any = [];
        listIdType.value = props.dataCorrespondenceWeb.listIdTypes.map((value: any) => {
            if (value.value != '001' && value.value != '002' && value.value != '004') data.push(value);
        })
        listIdType.value = data;
    } else {
        let data: any = [];
        props.dataCorrespondenceWeb.listIdTypes.map((value: any) => value.value != '003' && data.push(value))
        listIdType.value = data;
    }
}

</script>

<style scoped src="./CorrespondenceWeb.template.scss"></style>