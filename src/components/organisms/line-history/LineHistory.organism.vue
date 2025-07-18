<!-- 

    TODO ########################## COMPONENT LINE HISTORY ORGANISM ########################## 

    ?This component is a component personalized, just need a prop of type array []

    structure prop:

    dataLineHistory :[
        {
            date:'',
            userName: '',
            description:''
        }
    ]

-->

<template>
    <ul class="line-history">
        <template v-if="dataLineHistory.length < 1">
            <li class="line-history__card">
                <div class="line-history__card__line"></div>
                <p class="line-history__card__date loading-component"></p>
                <p class="line-history__card__description loading-component">
                </p>
            </li>
            <li class="line-history__card">
                <div class="line-history__card__line"></div>
                <p class="line-history__card__date loading-component"></p>
                <p class="line-history__card__description loading-component">
                </p>
            </li>

        </template>
        <template v-else>
            <template v-for="(history, index) in dataLineHistory">
                <li class="line-history__card">
                    <a class="line-history__card__comment" v-if="history.comment">
                        {{ history.comment }}
                    </a>
                    <div class="line-history__card__line"></div>
                    <p class="line-history__card__date">{{ formatDate(history?.date) + ' ' + t('to') + ' ' +
                        (extractTime(history?.time) ?? 'time') }} </p>
                    <p class="line-history__card__description ">
                        <span>{{ history?.userName + ' '}}</span>
                        <a v-html="UtilsServices.highlightVerbForPastSentences({ inputString:t(history?.description)})"></a>
                        <a v-if="history?.userAsigned"> {{ ' ' + t('to') }} </a> 
                        <span v-if="history?.userAsigned">{{ ' ' + history?.userAsigned }}</span>.
                    </p>
                </li>
            </template>
            <a class="line-history__pointer-init" rowspan="2">
                <p class="line-history__pointer-init__point">
                    {{ t('init') }}
                </p>
            </a>
        </template>
    </ul>
</template>
<script setup lang="ts">

import { useI18n } from 'vue-i18n';
import { accessStore } from "../../../store/index.ts";
import UtilsServices from '../../../services/UtilsServices.ts';
const { t, te } = useI18n();
const props: any = defineProps(['dataLineHistory']);
const store: any = accessStore();


function formatDate(dateString: any) {
    const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    const dateParts = dateString.split('-');
    const year = dateParts[0];
    const month = months[parseInt(dateParts[1], 10) - 1];
    const day = dateParts[2];

    return `${t(day)} ${t('of')} ${t(month)} ${t('of')} ${year}`;
}

function extractTime(timeString: string) {
    const [time] = timeString.split('.');
    return time;
}

</script>
<style src="./LineHistory.organism.scss" scoped></style>