<template>
    <section class="card-portfolio">
      <div class="card-portfolio__icon">
        <img src="/carpeta.png" alt="carpeta">
      </div>
      <div class="card-portfolio__text-container">
        <p class="card-portfolio__text-container__title">{{ data.name }}</p>
        <div class="card-portfolio__text__description">
          <p class="card-portfolio__text__description__text">
            {{ t('number_of_files') }}: {{ data.documents.length }}
          </p>
          <p class="card-portfolio__text__description__text">
            {{ t('creation_date') }}: {{ data.creation_date}}
          </p>
          <p class="card-portfolio__text__description__text">
            {{ t('creation_hour') }}: {{ data.creation_hour }}
          </p>
        </div> 
      </div>
      <div class="card-portfolio__img">
        <TooltipIcon v-if="dataCardPortfolio?.dataTooltipIcons[0].show()" :dataTooltipIcon="dataCardPortfolio?.dataTooltipIcons[0]" @click="dataCardPortfolio?.dataTooltipIcons[0].onClick({data: data})"/>
        <TooltipIcon class="card-portfolio__img--to-active"
          v-if="dataCardPortfolio?.dataTooltipIcons[1].show()" :dataTooltipIcon="dataCardPortfolio?.dataTooltipIcons[1]" @click="dataCardPortfolio?.dataTooltipIcons[1].onClick({data: data})"/>
        <TooltipIcon class="card-portfolio__img--to-active"
          v-if="dataCardPortfolio?.dataTooltipIcons[2].show()" :dataTooltipIcon="dataCardPortfolio?.dataTooltipIcons[2]" @click="dataCardPortfolio?.dataTooltipIcons[2].onClick({data: data})"/>
      </div>
    </section>
</template>

<script lang="ts" setup>

// Import vue libraries
import {} from 'vue';
import { useI18n } from 'vue-i18n';

// Import components
import TooltipIcon from '../../atoms/tooltip-icon/TooltipIcon.atom.vue';

// Import props, emits and configuration
const { t } = useI18n();
defineProps(["dataCardPortfolio", "data"]);

</script>

<style scoped src="./CardPortfolio.molecule.scss"></style>