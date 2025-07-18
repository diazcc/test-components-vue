<!-- *##### COMPONENT INPUT ##### -->
<!--
    ? It's define by dataText for be se used on others components.
    -- This component could be improve but can't be modified about funcionality, it must be developed in component page. -- 
    
    :name="dataInput.name" -- data for identify component, necesary where someone use the decorator @input.
    :type="dataInput.type" -- set type of input, could be email, passwordd...
    :class="['input input--' + dataInput.classInput]" -- can modify the style that you want in the file ./thisnamecomponente.scss
    v-model="dataInput.model" -- can detect state some change about this component and get the value.
    @click="dataInput.onClick"-- get the event click and develop any functions from father component
    :placeholder="dataInput.placeholder" -- personalice the placeholder
    :disabled="dataInput.disabled" -- can disabled this component when you need.
    @input="handleInput -- you can get the listener about input of each work or character that you press and get data in a json.

    ?this component expects this structure :

    dataInput: {
        id :'',
        name:'password',
        classInput: '',
        model: '',
        type: 'password',
        placeholder: '',
        disabled: false,
        required: false,
        title:'',
        onClick: () => { },
        handleBlur: () =>{}, //is for detect when unfocused input.
        onChange: () => {}
    }
     
-->


<template>
    <input 
    :id="dataInput.id"
    :name="dataInput.name"
    :class="['input input--' + dataInput.classInput]"
    v-model="lowercaseModel"
    :type="dataInput.type"
    @input="handleInput"
    :placeholder="t(dataInput.placeholder)"
    :disabled="dataInput.disabled"
    @click="dataInput.onClick"
    :required="dataInput?.required"
    :onchange="dataInput?.onchange"
    :title="t((dataInput?.title!=null)&&(dataInput?.title!='')?dataInput?.title:'')"
    @blur="dataInput?.handleBlur"
    @change="(dataInput?.onChange&& dataInput?.onChange(lowercaseModel))"
    >
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { defineProps } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props =  defineProps(['dataInput']);
const emits = defineEmits(['inputChange']);

// Computed property para manejar lowercase
const lowercaseModel = computed({
  get: () => {
    // Si está definido explícitamente que no sea lowercase, devolver el valor original
    // de esta manera se asegura que los valores que se envien a la base de datos sean consistentes
    if (props.dataInput.lowercase === false) {
      return props.dataInput.model;
    }
    // Si no se especifica, o se especifica como true, convertir a lowercase
    return (props.dataInput.model || '').toString().toLowerCase();
  },
  set: (value: string) => {
    // Actualizar el modelo original
    props.dataInput.model = props.dataInput.lowercase !== false 
      ? value.toLowerCase() 
      : value;
  }
});

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  
  // Emitir el valor (convertido a lowercase si es necesario)
  emits('inputChange', { 
    [props.dataInput.name]: props.dataInput.lowercase !== false 
      ? value.toLowerCase() 
      : value 
  });
};
</script>

<style scoped src="./InputText.atom.scss"></style>
