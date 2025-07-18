<template >
    <a :class="'select-search select-search--' + (disabled ? 'disabled' :'enabled')" ref="selectSearchRef">
        <input 
                type="text" 
                @input="handleInput" 
                :placeholder=" disabled ? t('select_dependence') :t('search')+'...'" 
                class="select-search__input"
                :disabled="disabled && dependence == ''"
                v-model="dataInput">
        <img :src=" getIconSrc()" class="select-search__icon">
        <ul class="select-search__container" v-if="resultsFinalSelectSearch.length>0" >
            <li class="select-search__container__card" v-for="obj in resultsFinalSelectSearch" @click="getUserSelected(obj)">
                <img src="/icon-check-user-blue.svg" class="select-search__container__card__img" alt="">
                <div class="select-search__container__card__name">
                    <p class="select-search__container__card__name__title">  
                        {{obj.first || t('unnamed')}}
                    </p>
                    <p class="select-search__container__card__email">
                        {{obj.second}}
                    </p>
                </div>
            </li>
        </ul>
    </a>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, onMounted ,onBeforeUnmount } from 'vue';
import UserServices from '../../../services/UserServices';
const { t, te } = useI18n();
const props: any = defineProps(['dataSelectSearch','disabled', 'dependence']);
const emits : any = defineEmits(['keyPressed','userSelected'])
const searchQuery = ref('');
const selectSearchRef :any = ref();
const dataInput :any = ref('');
const isLoading :any = ref(false);
const resultsFinalSelectSearch: any = ref('');

function getUserSelected(obj:any){
    emits('userSelected',obj);
    dataInput.value='';
}
function getIconSrc() {
  
   if (props.disabled) {
    return '/circle-gray.svg'; // Ícono de error
  }
  if (dataInput.value !== '' && resultsFinalSelectSearch.value.length === 0 && !isLoading.value) {
    return '/cancel-circle.svg'; // Ícono de error
  }
   if (dataInput.value === '' && !isLoading.value) {
    return '/circle-green.svg'; // Ícono de círculo vacío
  }
   if (isLoading.value) {
    return '/loading.gif'; // Ícono de carga
  }
  return '/icon-check-blue.svg'; // Ícono por defecto (cuando hay resultados)
}
function handleInput(event: Event) {
    searchQuery.value = (event.target as HTMLInputElement).value;
    searchFinalsUsers(searchQuery.value);
    emits('keyPressed',(event.target as HTMLInputElement).value)
}

function searchFinalsUsers(key: any) {
        resultsFinalSelectSearch.value = [];
    if (key.trim() === '') {
        resultsFinalSelectSearch.value = [];

        return;
    }
    isLoading.value = true;
    UserServices.sendSearchUsers(props.dependence, key.trim())
        .then((response:any) => {
            console.log(response, 'response');
            isLoading.value = false;

            resultsFinalSelectSearch.value = response.map((data: any) => ({
                first: data.first_name,
                second: data.email,
                third: data.dependence.name
            }))

        })
        .catch(error => {
            isLoading.value = false;
            console.error(error, 'error');
        });


}
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  console.log(selectSearchRef.value);
  if (
    selectSearchRef.value &&
    !selectSearchRef.value.contains(target) &&
    !target.closest('.select-search__container')
  ) {
    // Click realmente fuera
    props.disabled = false;
    resultsFinalSelectSearch.value = [];
    dataInput.value = '';
  }
}
onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
});
onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside);
});
</script>
<style scoped src="./SelectSearch.molecule.scss"></style>