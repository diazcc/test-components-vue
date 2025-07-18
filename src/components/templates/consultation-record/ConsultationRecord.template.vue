<template>
    <main class="consultation-record">
        <HeaderInitialOrganism />
        <h1 class="consultation-record__title">
            {{ t('filing_consultation') }}
        </h1>
        <nav class="consultation-record__form">
            <label class="consultation-record__form__description">
                {{ t('write_the_filing_number') }}:
            </label>
            <InputTextAtom :dataInput="dataConsultationRecord.dataInputFilingNumber" />
            <InputTextAtom :dataInput="dataConsultationRecord.dataInputId" />
            <InputTextAtom :dataInput="dataConsultationRecord.dataInputEmail" />

        </nav>
        <section class="consultation-record__wrapper"
            v-if="!dataConsultationRecord.stateLoad && dataConsultationRecord.data.subject != ''">
            <ul class="consultation-record__wrapper__filing">
                <li class="consultation-record__wrapper__filing__card">
                    <p class="consultation-record__wrapper__filing__card__subtitle">
                        {{ t('filing_number') }}:
                    </p>
                    <p>
                        {{ dataConsultationRecord.data.filing_number }}
                    </p>
                </li>
                <li class="consultation-record__wrapper__filing__card">
                    <p class="consultation-record__wrapper__filing__card__subtitle">
                        {{ t('subject') }}:
                    </p>
                    <p>
                        {{ dataConsultationRecord.data.subject }}
                    </p>
                </li>
                <li class="consultation-record__wrapper__filing__card">
                    <p class="consultation-record__wrapper__filing__card__subtitle">
                        {{ t('creation_date') }}:
                    </p>
                    <p>
                        {{ dataConsultationRecord.data.creation_date }}
                    </p>
                </li>
                <li class="consultation-record__wrapper__filing__card">
                    <p class="consultation-record__wrapper__filing__card__subtitle">
                        {{ t('remitter') }}:
                    </p>
                    <p>
                        {{ dataConsultationRecord.data.remitter }}
                    </p>
                </li>
                <li class="consultation-record__wrapper__filing__card">
                    <p class="consultation-record__wrapper__filing__card__subtitle">
                        {{ t('response_mode') }}:
                    </p>
                    <p>
                        {{ dataConsultationRecord.data.response_mode }}
                    </p>
                </li>
                <li class="consultation-record__wrapper__filing__card">
                    <p class="consultation-record__wrapper__filing__card__subtitle">
                        {{ t('state') }}:
                    </p>
                    <p>
                        {{ dataConsultationRecord.data.state }}
                    </p>
                </li>
            </ul>
            <article class="consultation-record__wrapper__trazability">
                <LineHistoryOrganism :data-line-history="dataConsultationRecord.dataLineHistory" />
            </article>
        </section>
        <section class="consultation-record__wrapper" v-if="dataConsultationRecord.stateLoad">
            <ul class="consultation-record__wrapper__filing">
                <li class="consultation-record__wrapper__filing__card loading-component">

                </li>
                <li class="consultation-record__wrapper__filing__card loading-component">

                </li>
                <li class="consultation-record__wrapper__filing__card loading-component">

                </li>
                <li class="consultation-record__wrapper__filing__card loading-component">

                </li>
                <li class="consultation-record__wrapper__filing__card loading-component">

                </li>
                <li class="consultation-record__wrapper__filing__card loading-component">

                </li>
            </ul>
        </section>

        <nav class="consultation-record__footer">
            <ButtonAtom :dataButton="dataConsultationRecord.dataButtonBack" />
            <ButtonAtom :dataButton="dataConsultationRecord.dataButtonSearch" />

        </nav>
        <ModalAlertMolecule :dataModalAlert="dataConsultationRecord.dataModalAlert" />
    </main>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ButtonAtom from '../../atoms/button/Button.atom.vue';
import InputSearchMolecule from '../../molecules/input-search/InputSearch.molecule.vue';
import InputTextAtom from '../../atoms/input/InputText.atom.vue';
import HeaderInitialOrganism from '../../organisms/header-initial/HeaderInitial.organism.vue';
import LineHistoryOrganism from '../../organisms/line-history/LineHistory.organism.vue';
import ModalAlertMolecule from '../../molecules/modals/alert/ModalAlert.molecule.vue';
const { t } = useI18n();
const props: any = defineProps(['dataConsultationRecord']) 
</script>
<style scoped src="./ConsultationRecord.template.scss"></style>