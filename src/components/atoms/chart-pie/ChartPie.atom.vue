<!-- 
  TODO
  This component must be improved

  docu: https://vue-chart-3.netlify.app/
  uninstall with : npm uninstall vue-chart-3

  ?this componente expects this structure :
          dataChartPie: 
            data: [
            {
              id: integer,
              text: string //Label for the pieChart
              number: integer //Data
            }];

-->

<template>
  <PieChart class="pie-chart"
            ref="doughnutRef" :chartData="testData" :options="options" 
            :height="200" :width="300" 
            @click="handleClick"/>
</template>

<script setup lang="ts">

import { ref, computed, reactive, onMounted, defineProps, watch } from "vue";
import { PieChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import { useI18n } from 'vue-i18n';
import { nextTick } from "vue";
import UtilsServices from "../../../services/UtilsServices";
import { useRoute, useRouter } from 'vue-router';

const { t } = useI18n();
const router: any = useRouter();
const props = defineProps(['dataChartPie']);
const dataPie = ref([]);
const labelPie = ref([]);
const colorPie = ref([]);
const routes = ref([]);

Chart.register(...registerables);

const doughnutRef = ref();

const testData = computed(() => ({
  labels: labelPie.value,
  datasets: [
    {
      data: dataPie.value,
      backgroundColor: colorPie.value,
    },
  ],
  options: {
    responsive: true,
    maintainAspectRatio: false, 
  }
}));

const options = reactive({
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem: any) {
          let total = tooltipItem.dataset.data.reduce((a: any, b: any) => a + b, 0);
          let currentValue = tooltipItem.raw;
          let percentage = Math.floor((currentValue / total) * 100);
          return tooltipItem.label + ': ' + percentage + '%';
        }
      }
    },
  },
});

onMounted(() => {
  updatePieData();
});

watch(props.dataChartPie, () => {
  updatePieData();
});

function updatePieData() {
  labelPie.value = props.dataChartPie.data.map((element: any) => { return t(element.text) });
  dataPie.value = props.dataChartPie.data.map((element: any) => { return element.number });
  colorPie.value = UtilsServices.rainbowColorGenerator("#006cd8", props.dataChartPie.data.length);
  routes.value = props.dataChartPie.data.map((element: any) => { return element.route });
}

function handleClick(event: any) {
  nextTick(() => {
    // Ahora que el DOM está actualizado, intentamos acceder al gráfico
    const chart = doughnutRef.value?.chartInstance;
    if (!chart) {
      console.error('El gráfico no está disponible');
      return;
    }

    const activePoints = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

    if (activePoints.length > 0) {
      const index = activePoints[0].index; // El índice del segmento clicado
      const label = chart.data.labels[index]; // La etiqueta del segmento clicado
      const value = chart.data.datasets[0].data[index]; // El valor del segmento clicado

      // Acción con los datos del segmento
      router.push(routes.value[index])
    }
  });
}
</script>

<style scoped src="./ChartPie.atom.scss"></style>