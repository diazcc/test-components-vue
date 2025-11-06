<!-- 
                COMPONENT MULTI SELECT 

                dataMultiSelect {
                    key: 0
                    title: "Selecciona opciones",
                    model: [2],
                    options: [
                        { text: '', value: 1, checked: false },
                    ]
                }


                props.dataMultiSelect.model = [ string , number ]

                props.dataMultiSelect.options = [
                    { text: string , value: string - number, checked: boolean },
                ]

 -->



<template>
    <ul :id="`multi-select${props.dataMultiSelect?.key || 0}`" class="multi-select" @click.self="handleInsideClick">
        <li class="multi-select__header" @click="toggleDropdown">
            <p v-if="type!= 'text'" class="multi-select__header__title">
               {{ truncatedSelectedOptionsLabel }}
            </p>
            <input type="text" v-else class="multi-select__header__input" :placeholder="t('filings')"  >
            <img src="/icon-arrow-item-menu-padre lateral-cerrado.svg" alt=""
                class="multi-select__header__img">
        </li>
        <ol class="multi-select__options" v-if="isOpen">
            <li v-if="localMultiSelect?.options.length < 1" :class="'multi-select__options__option multi-select__options__option--'">
                <label>
                    {{  t('without_data') }}
                </label>
            </li>
            <li v-for="(option, index) in localMultiSelect?.options" :key="index" :class="'multi-select__options__option multi-select__options__option--'+(option.checked?'visible':'hidden')"
                @click="toggleOption(index)">
                <label>
                    {{ te(option.text) ? t(option.text) : option.text }}
                </label>
                <input type="checkbox" :checked="option.checked" :name="`check-${index}`">
            </li>
        </ol>
    </ul>
</template>

<script setup lang="ts">
import { Ref, ref, defineProps, defineEmits, reactive, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, te } = useI18n();
const props: any = defineProps(['dataMultiSelect', 'type']);
const emit = defineEmits(['onChange']);

let isOpen: Ref<boolean> = ref(false);

const localMultiSelect = reactive({
    title: props.dataMultiSelect.title,
    model: props.dataMultiSelect.model,
    options: props.dataMultiSelect?.options?.map((option: any) => ({
        ...option,
        value: (option?.value !== undefined && option?.value !== null) ? option.value : option.text
    }))
});

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
};

const handleInsideClick = () => {
    console.log('Clicked inside multi-select');
};

const handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const multiSelectElement = document.querySelector(`#multi-select${props.dataMultiSelect?.key || 0}`);
    if (multiSelectElement && !multiSelectElement.contains(target)) {
        isOpen.value = false;
    }
};
const selectedOptionsLabel = computed(() => {
  const selected = localMultiSelect.options.filter((o:any) => o.checked);
  if (selected.length === 0) return t(localMultiSelect?.title) || t('select_type');
  return selected.map((o:any) => te(o.text) ? t(o.text) : o.text).join(', ');
});
const truncatedSelectedOptionsLabel = computed(() => {
  const maxLength = 40; // ajusta según diseño
  return selectedOptionsLabel.value.length > maxLength
    ? selectedOptionsLabel.value.slice(0, maxLength) + '...'
    : selectedOptionsLabel.value;
});
const updateSelectedOptions = (newSelectedArray: Array<{ value: string }>) => {
    const validOptions = newSelectedArray.filter(selected =>
        props.dataMultiSelect.options.some((option: any) => option.value === selected.value)
    );
    if (validOptions.length === 0) {
        return;
    }
    localMultiSelect.options.forEach((option: any) => {
        option.checked = validOptions.some(selected => selected.value === option.value);
    });
};

const getSelectedOptions = () => {
    props.dataMultiSelect.model = localMultiSelect.options
        .filter((option: any) => option.checked) 
        .map((option: any) => option.value); 
};

const updateOptionsState = (selectedValues: Array<string | number>) => {
    if (selectedValues.length === 0) {
        // If no values are selected, uncheck all options
        localMultiSelect.options.forEach((option: any) => {
            option.checked = false;
        });
        return;
    }

    const validValues = selectedValues.filter(value =>{
            localMultiSelect.options.some((option: any) => option.value === value)
        }
    );

    if (validValues.length === 0) {
        return;
    }

    localMultiSelect.options.forEach((option: any) => {
        option.checked = validValues.includes(option.value);
    });
};

const toggleOption = (index: number) => {
    localMultiSelect.options[index].checked = !localMultiSelect.options[index].checked;
    const newSelectedArray = localMultiSelect.options
        .filter((option: any) => option.checked)
        .map((option: any) => ({ value: option.value }));
    emit('onChange', newSelectedArray)
    getSelectedOptions();
    updateSelectedOptions(newSelectedArray);
};

onMounted(() => {
    localMultiSelect.options = props.dataMultiSelect.options.map((option: any) => ({
        ...option,
        value: (option?.value !== undefined && option?.value !== null) ? option.value : option.text,
    }));
    document.addEventListener('click', handleOutsideClick);
    updateOptionsState(props.dataMultiSelect.model)
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleOutsideClick);
});

watch(() => props.dataMultiSelect.model, (newModel) => {
    updateOptionsState(newModel);
}, { deep: true });

watch(() => props.dataMultiSelect.options, (newOptions) => {
    localMultiSelect.options = newOptions.map((option: any) => ({
        ...option,
        value: option.value || option.text,
    }));
}, { deep: true });

</script>

<style scoped src="./MultiSelect.atom.scss"></style>
