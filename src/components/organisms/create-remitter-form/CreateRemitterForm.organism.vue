<template>
    <section :class="'create-remitter-form ' + (stateCreateRemmiter ? '' : 'loading-component')">
        <p class="create-remitter-form__title" v-if="dataCreateRemitterForm.form.personType == ''">
            {{ t('please_select_type_of_person_to_create_the_sender') }}
        </p>
        <p class="create-remitter-form__title" v-else="dataCreateRemitterForm.form.personType != ''">
            {{ t('please_select_type_of_person_to_create_the_sender') }} 
            <!-- Cambiar por el label de la persona -->
        </p>

        <section class="create-remitter-form__content">
            <ul class="create-remitter-form__content__select-type">
                <div class="create-remitter-form__content__select-type__container"
                    v-for="(personType, i) in listPersonType">
                    <input type="radio" :value="personType.code" v-model="dataCreateRemitterForm.form.personType">
                    <p class="create-remitter-form__content__select-type__text">{{ t(personType.label) }}</p>
                </div>
            </ul>

            <ul class="create-remitter-form__content__form" v-if="dataCreateRemitterForm.form.personType != ''">
                <li class="create-remitter-form__content__form__card"
                    v-if="dataCreateRemitterForm.form.personType == '001' || dataCreateRemitterForm.form.personType == '003' || dataCreateRemitterForm.form.personType == '004'">
                    <input type="text" v-model="dataCreateRemitterForm.form.first_name" :placeholder="t('first_name')"
                         
                         @input="event => FormValidators.validateOnlyLetters(event, 'first_name', dataCreateRemitterForm.form)"
                        required>
                </li>

                <li class="create-remitter-form__content__form__card"
                    v-if="dataCreateRemitterForm.form.personType == '001' || dataCreateRemitterForm.form.personType == '003' || dataCreateRemitterForm.form.personType == '004'">
                    <input type="text" v-model="dataCreateRemitterForm.form.middle_name"
                        :placeholder="t('second_name')"
                        @input="event => FormValidators.validateOnlyLetters(event, 'middle_name', dataCreateRemitterForm.form)">
                </li>

                <li class="create-remitter-form__content__form__card"
                    v-if="dataCreateRemitterForm.form.personType == '001' || dataCreateRemitterForm.form.personType == '003' || dataCreateRemitterForm.form.personType == '004'">
                    <input type="text" v-model="dataCreateRemitterForm.form.last_name"
                        :placeholder="t('first_last_name')"
                        @input="event => FormValidators.validateOnlyLetters(event, 'last_name', dataCreateRemitterForm.form)"
                        required>
                </li>

                <li class="create-remitter-form__content__form__card"
                    v-if="dataCreateRemitterForm.form.personType == '001' || dataCreateRemitterForm.form.personType == '003' || dataCreateRemitterForm.form.personType == '004'">
                    <input type="text" v-model="dataCreateRemitterForm.form.second_last_name"
                        :placeholder="t('second_last_name')"
                        @input="event => FormValidators.validateOnlyLetters(event, 'second_last_name', dataCreateRemitterForm.form)"
                        > 
                </li>

                <li class="create-remitter-form__content__form__card"
                    v-if="dataCreateRemitterForm.form.personType == '001' || dataCreateRemitterForm.form.personType == '003' || dataCreateRemitterForm.form.personType == '004'">
                    <Select :dataSelect="dataSelectIdentificationTypes" />
                </li>

                <li class="create-remitter-form__content__form__card"
                    v-if="dataCreateRemitterForm.form.personType == '001' || dataCreateRemitterForm.form.personType == '003' || dataCreateRemitterForm.form.personType == '004'">
                    <input type="text" v-model="dataCreateRemitterForm.form.identification_number"
                        :placeholder="t('identification_number')"  @input="event => limitInputValue(event, 'identification_number')"  required>
                </li>

                <li class="create-remitter-form__content__form__card"
                    v-if="dataCreateRemitterForm.form.personType == '002'">
                    <input type="text" v-model="dataCreateRemitterForm.form.contact_name"
                        :placeholder="t('contact_name')" 
                        @input="event => FormValidators.validateOnlyLetters(event, 'contact_name', dataCreateRemitterForm.form)"

                        required>
                </li>

                <li class="create-remitter-form__content__form__card"
                    v-if="dataCreateRemitterForm.form.personType == '002'">
                    <input type="text" v-model="dataCreateRemitterForm.form.social_reason"
                        :placeholder="t('social_razon')"
                         required>
                </li>

                <li class="create-remitter-form__content__form__card"
                    v-if="dataCreateRemitterForm.form.personType == '002'">
                    <input type="number" v-model="dataCreateRemitterForm.form.nit_number" :placeholder="t('nit')"
                        @input ="event => limitInputValue(event, 'nit_number')" required>
                </li>

                <li class="create-remitter-form__content__form__card">
                    <Select :dataSelect="dataSelectCountry" />
                </li>

                <li class="create-remitter-form__content__form__card">
                    <Select :dataSelect="dataSelectDepartament" />
                </li>

                <li class="create-remitter-form__content__form__card">
                    <Select :dataSelect="dataSelectCity" />
                </li>

                <li class="create-remitter-form__content__form__card">
                    <input type="text" v-model="dataCreateRemitterForm.form.address" :placeholder="t('address')"
                    @blur="FormValidators.trimInputField($event, 'address', dataCreateRemitterForm.form)"   
                    required>
                </li>

                <li class="create-remitter-form__content__form__card">
                    <input type="number" v-model="dataCreateRemitterForm.form.phone_number"
                        :placeholder="t('phone_number')"   
                         @input="event => limitInputValue(event, 'phone_number')" 
                         required>     
                </li>

                <li class="create-remitter-form__content__form__card">
                    <input type="text" v-model="dataCreateRemitterForm.form.email" :placeholder="t('email')" 
                    @input="event => FormValidators.validateEmail(event, 'email', dataCreateRemitterForm.form)" 
                    required>
                </li>
            </ul>
        </section>
    </section>
</template>
<script setup lang="ts">

import { onMounted, reactive, ref, watch} from 'vue';
import FilingServices from '../../../services/FilingServices';
import LocalizationServices from '../../../services/LocalizationServices';
import Select from '../../atoms/select/Select.atom.vue'
import { useI18n } from 'vue-i18n';
import FormValidators from '../../../validators/FormValidators';


const { t } = useI18n();
const props: any = defineProps(['dataCreateRemitterForm']);

const stateCreateRemmiter:any = ref(true)
const listPersonType:any = ref([])
const personTypeLabel : any = ref("");




// Function to limit characters in the Phone, NIT, Identification field
// A single function is added to limit the number of characters

const limitInputValue = (event: Event, field: 'phone_number' | 'nit_number' | 'identification_number' ) => {
  const target = event.target as HTMLInputElement;
  let value = target.value;
  let maxLength = 10;

  if (field === 'identification_number') {
    maxLength = 20;
    value = value.toLocaleUpperCase();
    target.value = value.replace(/[^A-Z0-9]/g, '');
  } 
  if (field === 'nit_number') {
    maxLength = 18;
  } else if (field === 'phone_number') {
    maxLength = 15; 
  }

  if (target.value.length > maxLength) {
    props.dataCreateRemitterForm.form[field] = target.value.slice(0, maxLength);
  } else {
    props.dataCreateRemitterForm.form[field] = target.value;
  }
};





// Constantes reactivas para dataSelectIdentificationTypes
const dataSelectIdentificationTypes:any = ref({
  id: '',
  name: '',
  className: '',
  disabled: false,
  onChange: (data: any) => {
    props.dataCreateRemitterForm.form.identification_type = dataSelectIdentificationTypes.value.model;
    setDataSelectIdentificationTypes(data.target.value)
  },
  onClick: () => {},
  placeholder: 'select',
  model: '',
  required: true,
  options: []
})

// Constantes reactivas para dataSelectCountry
const dataSelectCountry:any = ref({
  id: '',
  name: '',
  className: '',
  disabled: false,
  onChange: (data: any) => {
    props.dataCreateRemitterForm.form.country = dataSelectCountry.value.model;
    
    setDataSelectCountry(data.target.value, data.target.options[data.target.selectedIndex].label)
  },
  onClick: () => {},
  placeholder: 'select_country',
  model: '',
  required: true,
  options: []
})

// Constantes reactivas para dataSelectDepartament
const dataSelectDepartament:any = ref({
  id: '',
  name: '',
  className: '',
  disabled: true,
  onChange: (data: any) => {
    props.dataCreateRemitterForm.form.department = dataSelectDepartament.value.model;

    setDataSelectDepartament(data.target.value, data.target.options[data.target.selectedIndex].label)
  },
  onClick: () => {},
  placeholder: 'select_department',
  model: '',
  required: true,
  options: []
})

// Constantes reactivas para dataSelectCity
const dataSelectCity:any = ref({
  id: '',
  name: '',
  className: '',
  disabled: true,
  onChange: (data: any) => {
    props.dataCreateRemitterForm.form.city = dataSelectCity.value.model;
    setDataSelectCity(data.target.value, data.target.options[data.target.selectedIndex].label)
  },
  onClick: () => {},
  placeholder: 'select_city',
  model: '',
  required: true,
  options: []
})

dataSelectIdentificationTypes.value.placeholder = props.dataCreateRemitterForm.form.personType ? 'identification_type' : 'you_have_not_selected_person_type'


onMounted(() => {
    getDataPersonTypes();
    getDataIdentificationTypes();
    getDataCountries();
})
async function getDataPersonTypes() {
    try {
        const response = await FilingServices.getPersonTypes()
        listPersonType.value = response;
    } catch (error) {
        console.error(error, 'error getDataPersonTypes');
        listPersonType.value = [];
    }
}
async function getDataIdentificationTypes() {

    const arrayData: any = [];
    try {
        const response = await FilingServices.getIdentificationTypes()

        response.forEach((element: any) => {
            arrayData.push({
                value: element.code,
                label: element.label
            });
        });
        dataSelectIdentificationTypes.value.options = arrayData;

    } catch (error) {
        console.error(error, 'error getDataIdentificationTypes');
        dataSelectIdentificationTypes.value.options = [];
    }

}
async function setDataSelectCountry(data: any, label: any) {
    props.dataCreateRemitterForm.form.country = label
    const arrayData: any = [];
    try {
        const response = await LocalizationServices.getCountriesStates(data)
        if (response.error) {
        }

        response.response.forEach((element: any) => {
            arrayData.push({
                value: element.id,
                label: element.name
            });
        });
        dataSelectDepartament.value.options = arrayData;
        dataSelectDepartament.value.disabled = false;
    } catch (error) {
        console.error(error, 'error selectDependenceInputChange');
        dataSelectDepartament.value.options = [];
        dataSelectDepartament.value.disabled = true;

    }
}

async function setDataSelectDepartament(data: any, label: any) {

    props.dataCreateRemitterForm.form.department = label

    const arrayData: any = [];
    try {
        const response = await LocalizationServices.getStatesCities(data)
        if (response.error) {
        }

        response.response.forEach((element: any) => {
            arrayData.push({
                value: element.id,
                label: element.name
            });
        });

        dataSelectCity.value.options = arrayData;
        dataSelectCity.value.disabled = false;
    } catch (error) {
        console.error(error, 'error selectDependenceInputChange');
        dataSelectCity.value.options = [];
        dataSelectCity.value.disabled = true;

    }

}
async function getDataCountries() {

    const arrayData: any = [];
    try {
        const response = await LocalizationServices.getCountries()
        if (response.error) {
        }
        response.response.forEach((element: any) => {
            arrayData.push({
                value: element.id,
                label: element.name
            });
        });
        dataSelectCountry.value.options = arrayData;

    } catch (error) {
        console.error(error, 'error selectDependenceInputChange');
        dataSelectCountry.value.options = [];
    }

}


async function setDataSelectIdentificationTypes(data: any) {
    props.dataCreateRemitterForm.form.identification_type = data
}


function setDataSelectCity(data: any, label: any) {
    props.dataCreateRemitterForm.form.city = label
}

watch(() => props.dataCreateRemitterForm.form.personType,
    (personType) => {

        if (personType == '003') {
            const newArrayIdentificationTypes = dataSelectIdentificationTypes.value.options.filter((item: any) => item.value !== '001');
            dataSelectIdentificationTypes.value.options = newArrayIdentificationTypes
        } else {
            getDataIdentificationTypes();
        }

        dataSelectIdentificationTypes.value.placeholder = props.dataCreateRemitterForm.form.personType ? 'identification_type' : 'you_have_not_selected_person_type'
    }
)


</script>
<style scoped src="./CreateRemitterForm.organism.scss"></style>