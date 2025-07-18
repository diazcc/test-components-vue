<template>
  <section :class="'create-profile-form ' + (dataCreateProfileForm.stateCreateProfile ? '' : 'loading-component')">
    <p class="create-profile-form__title">{{ t('create_profile') }}</p>
    <article class="create-profile-form__content">
      <ul class="create-profile-form__content__form">
        <li class="create-profile-form__content__form__card">
          <input type="text" v-model="dataCreateProfileForm.data.profile_name" :placeholder="t('name')" required />
        </li>
        <li class="create-profile-form__content__form__card">
          <select v-model="dataCreateProfileForm.data.user" required>
            <option selected value="" disabled>
              {{ t("select_user") }}
            </option>

            <option v-for="user in dataUsers" :key="user.id" :value=user.id> {{user.first_name }} {{user.last_name }}</option>
          </select>
        </li>
      </ul>
    </article>
  </section>
</template>


<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
defineProps(["dataCreateProfileForm", "dataUsers"]);

</script>

<style scoped src="./CreateProfileForm.organism.scss"></style>