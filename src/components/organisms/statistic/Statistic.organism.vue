<template>
    <section class="statistic__title">
        <article class="statistic__title__block">
            <TitleAtom :dataTitle="dataStatistic.dataTitle"></TitleAtom>

        </article>
    </section>

    <section class="statistic__content">
        <div class="statistic__content__block">
            <!-- <ListAtom :dataList="dataStatistic.dataList"></ListAtom>
                <hr class="statistic__content__block__vertical-line"> -->
            <ChartPie :dataChartPie="dataStatistic.dataChartPie"></ChartPie>
        </div>
    </section>

</template>

<script setup lang="ts">
import {
    computed,
    nextTick,
    onMounted,
    onUnmounted,
    ref,
    defineProps,
    reactive,
} from "vue";
import { useRouter } from "vue-router";
import ButtonAtom from "../../atoms/button/Button.atom.vue";
import TitleAtom from "../../atoms/title/Title.atom.vue";
import TextAtom from "../../atoms/text/Text.atom.vue";
import ChartPie from "../../atoms/chart-pie/ChartPie.atom.vue";
import ListAtom from "../../atoms/list/List.atom.vue";

import { useI18n } from 'vue-i18n';

defineProps(['dataStatistic'])



const { t } = useI18n();
const router = useRouter();

</script>

<style scoped src="./Statistic.organism.scss"></style>