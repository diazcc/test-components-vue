<template>
    <section class="calendar">
        <Calendar></Calendar>
    </section>
</template>


<script setup lang="ts">

import {
    defineProps,
} from "vue";
import { useRouter } from "vue-router";
import TitleAtom from "../../atoms/title/Title.atom.vue";
import Calendar from "../../atoms/calendar/Calendar.atom.vue";
const router = useRouter();

defineProps(['dataCalendarWidget'])



</script>

<style scoped src="./CalendarWidget.organism.scss">


</style>