<!-- 

    dataProfile :{
        form:{
            first_name:'',
            second_name:'',
            last_name:'',   
            second_last_name:'',
            identification_type:'',
            identification_number:'',
            country:'',
            statedepartment:'',
            city:'',
            email:'',
        }
    }

-->
<template >
    <article :class="'profile '+(dataProfile.stateLoad ? ' loading-component':'')">
        <div class="profile__wrapper" v-if="dataProfile.idDataLoading">
            <img src="" class="profile__wrapper__img loading-component">
            <ul class="profile__wrapper__container">
                <li class="profile__wrapper__container__card loading-component">
                </li>
                <li class="profile__wrapper__container__card loading-component">
                </li>
                <li class="profile__wrapper__container__card loading-component">
                </li>
                <li class="profile__wrapper__container__card loading-component">
                </li>
                <li class="profile__wrapper__container__card loading-component">
                </li>
                <li class="profile__wrapper__container__card loading-component">
                </li>
                <li class="profile__wrapper__container__card loading-component">
                </li>
                <li class="profile__wrapper__container__card loading-component">
                </li>
                <li class="profile__wrapper__container__card loading-component">
                </li>
                <li class="profile__wrapper__container__card loading-component">
                </li>
            </ul>
        </div>
        <div class="profile__wrapper" v-else>
            <div class="profile__wrapper__photo">
                <a class="profile__wrapper__photo__front" @click="triggerFileInput"  v-if="dataProfile.stateForm">{{t('upload_photo')}}</a>
                <img :src="dataProfile.form.profile_picture" class="profile__wrapper__photo__img"  >
                <input type="file" @change="handleFileChange" v-if="dataProfile.stateForm"> 
            </div>
            <ul class="profile__wrapper__container">
                <li class="profile__wrapper__container__card">
                    <label for="">{{t('first_name')}}:</label>
                    <input type="text" :placeholder="t('first_name')" required  v-model="dataProfile.form.first_name" :disabled="!dataProfile.stateForm" @input="onInputHandlerText">
                </li>
                <li class="profile__wrapper__container__card">
                    <label for="">{{t('second_name')}}:</label>
                    <input type="text" :placeholder="t('second_name')" required v-model="dataProfile.form.second_name" :disabled="!dataProfile.stateForm"  @input="onInputHandlerText">
                </li>
                <li class="profile__wrapper__container__card">
                    <label for="">{{t('last_name')}}:</label>
                    <input type="text" :placeholder="t('last_name')" required v-model="dataProfile.form.last_name" :disabled="!dataProfile.stateForm"  @input="onInputHandlerText">
                </li>
                <li class="profile__wrapper__container__card">
                    <label for="">{{t('second_last_name')}}:</label>
                    <input type="text" :placeholder="t('second_last_name')" required v-model="dataProfile.form.second_last_name" :disabled="!dataProfile.stateForm"  @input="onInputHandlerText">
                </li>
                <li class="profile__wrapper__container__card">
                    <label for="">{{t('select_identification_type')}}:</label>
                    <select required v-model="dataProfile.form.identification_type" :disabled="!dataProfile.stateForm">
                        <option value="" selected disabled >
                            {{t('select_identification_type')}}
                        </option>
                        <option v-for="type of optionIdentificationType" :value="type.value">
                          {{type.label}}  
                        </option>
                    </select>
                </li>
                <li class="profile__wrapper__container__card">
                    <label for="">{{t('identification_number')}}:</label>
                    <input type="number" :placeholder="t('identification_number')" required v-model="dataProfile.form.identification_number" :disabled="!dataProfile.stateForm">
                </li>
                <li class="profile__wrapper__container__card">
                    <label for="">{{t('select_country')}}:</label>
                    <select required @change="setDataSelectCountriesStates" v-model="dataProfile.form.country" :disabled="optionCountries.length<1 || !dataProfile.stateForm" >
                        <option value="" selected disabled >
                            {{t('select_country')}}
                        </option>
                        <option v-for="type of optionCountries" :value="type.value">
                          {{type.label}}  
                        </option>
                    </select>
                </li>
                <li class="profile__wrapper__container__card">
                    <label for="">{{t('select_department')}}:</label>
                    <select required @change="setDataSelectCities" v-model="dataProfile.form.statedepartment" :disabled="optionStatesDepartment.length<1 || !dataProfile.stateForm">
                        <option value="" selected disabled >
                            {{t('select_department')}}
                        </option>
                        <option v-for="type of optionStatesDepartment" :value="type.value">
                          {{type.label}}  
                        </option>
                    </select>
                </li>
                <li class="profile__wrapper__container__card">
                    <label for="">{{t('select_city')}}:</label>
                    <select required v-model="dataProfile.form.city" :disabled="optionCities.length<1 || !dataProfile.stateForm">
                        <option value="" selected disabled >
                            {{t('select_city')}}
                        </option>
                        <option v-for="type of optionCities" :value="type.value">
                          {{type.label}}  
                        </option>
                    </select>
                </li>
                <li class="profile__wrapper__container__card">
                    <label for="">{{t('email')}}:</label>
                    <input type="email" placeholder="email" required  v-model="dataProfile.form.email" :disabled="!dataProfile.stateForm">
                </li>
            </ul>
        </div>
        <nav class="profile__buttons-nav">
                <Img class="profile__buttons-nav__img" v-if="dataProfile.idDataLoading"
                    :dataImg="dataProfile.dataImgGoToBack"/>
                <Button class="profile__buttons-nav__button" :dataButton="dataProfile.dataButtonGoToBack" v-if="!dataProfile.idDataLoading"/>
                <Button class="profile__buttons-nav__button" :dataButton="dataProfile.dataButtonGoToNext" v-if="!dataProfile.idDataLoading"/>
        </nav>
    </article> 
<ModalAlert :dataModalAlert="dataProfile.dataModalAlert"/>
<ModalConfirmation :dataModalConfirmation="dataProfile.dataModalConfirmation"/>
</template>

<script setup lang="ts">
import ModalAlert from "../../molecules/modals/alert/ModalAlert.molecule.vue";
import ModalConfirmation from "../../molecules/modals/confirmation/ModalConfirmation.molecule.vue";
import Button from "../../atoms/button/Button.atom.vue";
import { useI18n } from 'vue-i18n';
import FilingServices from "../../../services/FilingServices";
import LocalizationServices from "../../../services/LocalizationServices";
import { onMounted, ref, watch } from "vue";
const { t } = useI18n();
const props: any = defineProps(["dataProfile"]);
const emits = defineEmits([]);
const optionIdentificationType: any = ref([]);
const optionCountries: any = ref([]);
const optionCities: any = ref([]);
const optionStatesDepartment: any = ref([]);

onMounted(() => {
    callServices()

})
function callServices() {
    getIdentificationTypes()
    getCountries()
}

function getCountries() {
    LocalizationServices.getCountries()
        .then(async (response: any) => {
            optionCountries.value = response.response.map((value: any) => ({
                label: value.name,
                value: value.id
            }))
        })
        .catch((error: any) => {
            console.error(error);
        })

}
function getCountriesStates() {

    if (props.dataProfile.form.statedepartment != '') {
        LocalizationServices.getCountriesStates(props.dataProfile.form.country)
            .then(async (response: any) => {
                optionStatesDepartment.value = response.response.map((value: any) => ({
                    label: value.name,
                    value: value.id
                }))
            })
            .catch((error: any) => {
                console.error(error);
            })
    }

}
function getStatesCities() {
    if (props.dataProfile.form.city != '') {
        LocalizationServices.getStatesCities(props.dataProfile.form.statedepartment)
            .then(async (response: any) => {
                optionCities.value = response.response.map((value: any) => ({
                    label: value.name,
                    value: value.id
                }))
            })
            .catch((error: any) => {
                console.error(error);
            })
    }
}

function setDataSelectCountriesStates(data: any) {
    props.dataProfile.form.statedepartment = '';
    LocalizationServices.getCountriesStates(data.target.value)
        .then( async(response: any) => {
            optionStatesDepartment.value = response.response.map((value: any) => ({
                label: value.name,
                value: value.id
            }))
        })
        .catch((error: any) => {
            console.error(error);
        })
}
function setDataSelectCities(data: any) {
    props.dataProfile.form.city = '';
    LocalizationServices.getStatesCities(data.target.value)
        .then(async (response: any) => {
            optionCities.value = response.response.map((value: any) => ({
                label: value.name,
                value: value.id
            }))
        })
        .catch((error: any) => {
            console.error(error);
        })
}

function getIdentificationTypes() {
    FilingServices.getIdentificationTypes()
        .then((response: any) => {
            optionIdentificationType.value = response.map((value: any) => ({
                value: value.code,
                label: value.label
            }))
        })
        .catch((error: any) => {
            console.error(error);
        })
}
const triggerFileInput = () => {
    (document.querySelector('input[type="file"]') as HTMLInputElement)?.click();
};
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            props.dataProfile.form.profile_picture = reader.result as string; // Asigna la URL de la imagen
        };
        reader.readAsDataURL(file); // Convierte la imagen a Data URL
    }
};
const onInputHandlerText = (event: any) => {
    const regex = /^[a-zA-Z0-9 ]*$/;

    let inputValue = event.target.value;

    inputValue = inputValue
        .split('')
        .filter((char: any) => regex.test(char))
        .slice(0, 30)
        .join('');
    event.target.value = inputValue;
};
watch(() => props.dataProfile.form.statedepartment, (newValue: any, oldValue: any) => {
    getCountriesStates()
});
watch(() => props.dataProfile.form.city, (newValue: any, oldValue: any) => {
    getStatesCities()
});
</script>

<style scoped lang="scss" src="./Profile.template.scss"></style>