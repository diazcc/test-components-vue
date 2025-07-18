<template>
    <article :class="'role' + (dataRole.idRole ? ' role--view' : '') + (dataRole.stateLoadingForm?' loading-component':'')">
        <header class="role__header">
            <h2>
                {{ t('welcome_to_admin_module_role') }}
            </h2>
        </header>
        <h1 class="role__header__title">{{ dataRole.idRole!='' &&dataRole.idRole!= undefined ? t('role_data'):t('create_role')}}</h1>
        <section class="role__info" v-if="dataRole != null && dataRole != '' && !stateCreateRole()">
            <ul class="role__info__content">
                <li class="role__info__content__card">
                    <p class="role__info__content__card__subtitle">
                        {{ t('name') }} 
                    </p>
                    <InputText :dataInput="dataRole.dataInputName"/>
                </li>
                <li class="role__info__content__card">
                    <p class="role__info__content__card__subtitle">
                        {{ t('creation_date') }}:
                    </p>
                    <span>
                        {{ dataRole.dateCreated }}
                    </span>
                </li>
            </ul>
        </section>
        <section class="role__info" v-else-if="!stateCreateRole()">
            <ul class="role__info__content">
                <li class="role__info__content__card">
                    <p
                        class="role__info__content__card__subtitle loading-component role__info__content__card__subtitle--load">
                    </p>
                </li>
                <li class="role__info__content__card">
                    <p
                        class="role__info__content__card__subtitle loading-component role__info__content__card__subtitle--load">
                    </p>
                </li>
                <li class="role__info__content__card">
                    <p
                        class="role__info__content__card__subtitle loading-component role__info__content__card__subtitle--load">
                    </p>
                </li>
                <li class="role__info__content__card">
                    <p
                        class="role__info__content__card__subtitle loading-component role__info__content__card__subtitle--load">
                    </p>
                </li>
            </ul>
            <ul class="role__info__content">
                <li class="role__info__content__card">
                    <p
                        class="role__info__content__card__subtitle loading-component role__info__content__card__subtitle--load">
                    </p>
                </li>
                <li class="role__info__content__card">
                    <p
                        class="role__info__content__card__subtitle loading-component role__info__content__card__subtitle--load">
                    </p>
                </li>
                <li class="role__info__content__card">
                    <p
                        class="role__info__content__card__subtitle loading-component role__info__content__card__subtitle--load">
                    </p>
                </li>
            </ul>
        </section>
        <section class="role__content">
            <nav class="role__content__form">
                <InputText v-if="stateCreateRole()" :dataInput="dataRole.dataInputName" />
                <!--  -->
                <InputSearch :dataInputSearch="dataRole.dataInputSearch" class="role__content__search" />
            </nav>
            <section class="role__content__table">
                <ul class="role__content__table__column--header">
                    <li>
                        {{ t('profile') }}
                    </li>
                </ul>
                <ul class="role__content__table__column role__content__table__column--load "
                    v-if="filteredItems.length < 1">
                    <li class="role__content__table__row loading-component">

                    </li>
                </ul>
                <ul :class="'role__content__table__column role__content__table__column--' + (module.state ? 'open' : '')"
                    v-for="(module, indexModule) in filteredItems">
                    <li class="role__content__table__column__row">
                        <input type="checkbox" @click="dataRole.selectAllModule(indexModule)" v-if="stateCreateRole() || stateEditRole() "
                        :disabled="(stateEditRole()==false && stateCreateRole()==false)">
                        <p @click="dataRole.openModule(module, indexModule)">{{ t(replaceHyphensWithUnderscores(module.module)) ?? 'Error translate' }}</p>
                    </li>
                    <ol class="role__content__table__column__row--module">
                        <li v-for="(submodule, indexSubmodule) in module.submodule"
                            :class="'role__content__table__column__row--module__submodule role__content__table__column__row--module__submodule--' + (submodule.state ? 'open' : '')">
                            <header class="role__content__table__column__row--module__submodule__header">
                                <input type="checkbox" v-if="stateCreateRole() || stateEditRole()"  :disabled="(stateEditRole()==false && stateCreateRole()==false)"
                                    :checked="submodule.active"
                                    @click="dataRole.selectAllSubmodule(indexModule, indexSubmodule)">
                                <p @click="dataRole.openSubmodule(submodule, indexModule, indexSubmodule)">{{ t(submodule.name)}}</p>
                            </header>
                            <div class="role__content__table__column__row--module__submodule__actions">
                                <a v-for="(action, indexAction) in submodule.actions"
                                    @click="(stateEditRole()|| stateCreateRole())?dataRole.activeAction(action, indexAction,indexModule, indexSubmodule):''"
                                    class="role__content__table__column__row--module__submodule__actions__action">
                                    <input type="checkbox" :disabled="(stateEditRole()==false && stateCreateRole()==false)"
                                        :checked="action.active">
                                    <p>{{  t(action.name, action.name) }}</p>
                                </a>
                            </div>
                        </li>
                    </ol>
                </ul>
            </section>
        </section>
        <nav class="role__nav">
            <Button class="role__nav__button" :dataButton="dataRole.dataButtonBack" />
            <Button class="role__nav__button" :dataButton="dataRole.dataButtonNext" v-if="hasPermissions.validator('update_roles')" />
        </nav>
    </article>
    <ModalAlert :dataModalAlert="dataRole.dataModalAlert" />
    <ModalConfirmation :dataModalConfirmation="dataRole.dataModalConfirmation" />
</template>
<script setup lang="ts">

// Import vue library
import { defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

// Import components
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import InputText from '../../atoms/input/InputText.atom.vue';
import Button from '../../atoms/button/Button.atom.vue';
const ModalAlert = defineAsyncComponent(() => import('../../molecules/modals/alert/ModalAlert.molecule.vue'));
const ModalConfirmation = defineAsyncComponent(() => import('../../molecules/modals/confirmation/ModalConfirmation.molecule.vue'));

// Import services
import FormValidators from '../../../validators/FormValidators';
import hasPermissions from '../../../guards/hasPermissions.guard';

// Define props and emits and their types
const { t } = useI18n();
const props: any = defineProps(['dataRole', 'filteredItems']);

// Define variables and states
const stateCreateRole: any = (): boolean => props.dataRole.stateCreate ? true : false;
const stateEditRole: any = (): boolean => props.dataRole.stateEdit ? true : false;

// Define functions

const toggleActionState = (action: any) => {
  if (stateEditRole()|| stateCreateRole()) {
    action.active = !action.active;
  }
}

const validateCaracters = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value = target.value.toString(); 
  value = value.replace(/[^a-zA-Z0-9ñáéíóúü\s]/g, ''); 
  // Remove white spaces at the end
  value = value.trimStart(); 
  // Update the value of the input and model

  target.value = value;
  const field = target.name; // Assuming the input has a name attribute that corresponds to the field
  props.dataRole.dataInputName[field] = value; //  Adjust the field according to your model
};


function replaceHyphensWithUnderscores(str:string) {
  if (typeof str !== 'string') {
    return 'error translate';
  }
  return str.replace(/-/g, '_');
}

</script>

<style scoped src="./Role.template.scss"></style>