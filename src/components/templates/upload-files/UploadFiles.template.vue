<template>
    <section v-if="!dataUploadFiles.stateObtainData" class="upload-files">
        <!-- v-if="!dataUploadFiles.stateFormUniqueFile && !dataUploadFiles.stateFormManyFiles"> -->
        <header class="upload-files__header">
            <h2>
                {{ t('welcome_to_files_module') }}
            </h2>
        </header>
        <div class="upload-files__container__main"
             v-if="!dataUploadFiles.stateFormUniqueFile && !dataUploadFiles.stateFormManyFiles">
            <p class="upload-files__container__main__title"> {{ t('please_select_the_action_you_wish_to_perform_to_upload') }}</p>
            <nav>
                <Button v-if="hasPermissions.validator('create_file')" 
                    :dataButton="dataUploadFiles.dataButtonUploadFile" />
                <Button v-if="hasPermissions.validator('charge_massive_file')" 
                    :dataButton="dataUploadFiles.dataButtonUploadManyFiles" />
            </nav>
        </div>
        <article class="upload-files__container-single" v-if="dataUploadFiles.stateFormUniqueFile">
            <h1 class="upload-files__title">{{ t('upload_files') }}</h1>
            <ul :class="'upload-files__content ' + (dataUploadFiles.stateLoad ? 'loading-component' : '')">
                <li class="upload-files__content__card">
                    <InputText :dataInput="dataUploadFiles.dataInputName" />
                </li>
                <li class="upload-files__content__card">
                    <!-- <input type="file" name="" id="" @change="handleSingleFileChange" required> -->
                        <InputFiles :useInputFiles="true" @change="handleSingleFileChange" />
                </li>
                <!-- <li class="upload-files__content__card">
                    <Select :dataSelect="dataUploadFiles.dataSelectDocumentaryType" required />
                </li> -->
                <!-- <li class="upload-files__content__card">
                    <MultiSelect :dataMultiSelect="dataUploadFiles.dataMultiSelect" required />
                </li> -->
                
            </ul>
            <div>

            <!-- Display API response dynamically --> 
            

        </div>
        </article>
        <article :class="'upload-files__container-multiple '+(dataUploadFiles.stateLoad ? 'loading-component' : '')" v-if="dataUploadFiles.stateFormManyFiles">
            <h1 class="upload-files__title">{{ t('upload_many_files') }}</h1>
            <section class="upload-files__container-multiple__many-files">
                <article class="upload-files__container-multiple__many-files__status" v-if="dataUploadFiles.stateLoad">
                    <img :src=" getIconSrc()" class="upload-files__container-multiple__many-files__status__icon">
                    <div class="upload-files__container-multiple__many-files__status__content">
                        <p class="upload-files__container-multiple__many-files__status__content__title">{{ t('loaded_files_count') }}: {{ dataUploadFiles.countLoadedFiles }} / {{ dataUploadFiles.countTotalFiles }}</p>
                        <p class="upload-files__container-multiple__many-files__status__content__correct" v-if="dataUploadFiles.countLoadedFiles > 0">{{ t('accepted') }}:  {{ dataUploadFiles.countCorrectFiles }}</p>
                        <p class="upload-files__container-multiple__many-files__status__content__incorrect" v-if="dataUploadFiles.countLoadedFiles > 0">{{ t('rejected') }}:  {{ dataUploadFiles.countErrorFiles }}</p>
                    </div>
                </article>
                <header class="upload-files__container-multiple__many-files__header">
                    <input type="file" ref="fileInput" @change="handleFileChange" style="display:none" multiple />
                    <Button class="upload-files__nav__button" :dataButton="dataUploadFiles.dataButtonAddManyFiles"/>
                    
                </header>
                <table class="table table--noborder">   
                    <ol v-if="store.uploadedFiles.length">
                        <thead :class="'table__row table--header table__row--'+(!hasPermissions.validator('share_file') ? 'less-column' : '')">
                            <th class="table__row__cell">{{ t("item") }}</th>
                            <th>{{ t("name") }}</th>
                            <th>{{ t("type_documental") }}</th>
                            <th v-if="hasPermissions.validator('share_file')">{{ t("dependences") }}</th>
                            <th></th>
                        </thead>
                        <tbody :class="'table__row table__row--'+(!hasPermissions.validator('share_file') ? 'less-column' : '')"
                        v-for="(file, index) in dataUploadFiles.dataManyFiles" :key="index">
                            <td class="table__row__cell">{{ index + 1 }}</td>
                            <input v-model="dataUploadFiles.dataManyFiles[index].document_name" 
                                @input="updateFileName(index, $event)"
                                class="table__row__cell table__row--info table__row--more-padding" 
                                type="text" placeholder="Nombre" required>

                            <select v-model="dataUploadFiles.dataManyFiles[index].documentary_type" 
                                    class="table__row__cell table__row--info" required>
                                <option value="" selected disabled>
                                    {{ t('select_documentary_type') }}
                                </option>
                                <option v-for="documentary of dataUploadFiles.dataSelectDocumentaryType.options" 
                                        :value="documentary.value">
                                    {{ documentary.label }}
                                </option>
                            </select>
                            <MultiSelect class="table__row__cell table__row--info" :dataMultiSelect="dataUploadFiles.dataMultiSelectManyFiles[index]" required
                            v-if="dataUploadFiles.dataMultiSelectManyFiles.length > index && hasPermissions.validator('share_file')"/>
                            <td class="table__row__cell table__row--img">
                                <TooltipIcon v-if="dataUploadFiles.dataTooltipIcons[0].show()" :dataTooltipIcon="dataUploadFiles.dataTooltipIcons[0]" @click="dataUploadFiles.dataTooltipIcons[0].onClick({index: index})"/>
                            </td>
                        </tbody>
                    </ol>
                    <ul v-else class="table__card">
                        <li>
                            {{t('not_selected_files')}}
                        </li>
                    </ul>
                </table>
            </section>
        </article>
        <nav class="upload-files__nav" v-if="dataUploadFiles.stateFormUniqueFile || dataUploadFiles.stateFormManyFiles">
            <Button class="upload-files__nav__button" :dataButton="dataUploadFiles.dataButtonBack" />
            <Button class="upload-files__nav__button" :dataButton="dataUploadFiles.dataButtonNext" />
        </nav>
    </section>
    <ModalAlert :dataModalAlert="dataUploadFiles.dataModalAlert" />
    <ModalConfirmation :dataModalConfirmation="dataUploadFiles.dataModalConfirmation" />
</template>

<script setup lang="ts">

// Import vue libraries
import { ref, onMounted} from 'vue';
import { useI18n } from 'vue-i18n';
import InputFiles from '../../molecules/input-files/InputFiles.molecule.vue';

// Import components
import Button from '../../atoms/button/Button.atom.vue'
import Select from '../../atoms/select/Select.atom.vue'
import ModalAlert from '../../molecules/modals/alert/ModalAlert.molecule.vue';
import ModalConfirmation from '../../molecules/modals/confirmation/ModalConfirmation.molecule.vue';
import MultiSelect from '../../atoms/multi-select/MultiSelect.atom.vue';
import TooltipIcon from "../../atoms/tooltip-icon/TooltipIcon.atom.vue";
import InputText from '../../atoms/input/InputText.atom.vue';

// Import services
import UtilsServices from '../../../services/UtilsServices';
import { accessStore } from '../../../store';
import hasPermissions from '../../../guards/hasPermissions.guard';

// Define emit and props and configuration
const { t, locale } = useI18n();
const store  = accessStore();
const props : any = defineProps(['dataUploadFiles', 'multiSelectDependenceDefault']);

// Define variables and constants
const fileInput = ref<HTMLElement | null>(null);

// Define functions
function triggerFileInput() {
    fileInput.value?.click();
}
function getIconSrc() {
  
  
  // Si hay archivos con errores
  if (props.dataUploadFiles.countErrorFiles > 0 && !props.dataUploadFiles.stateLoad) {
    return '/cancel-circle.svg'; // Ícono de error
  }
  
  // Si está cargando
  if (props.dataUploadFiles.stateLoad) {
    return '/loading.gif'; // Ícono de carga
  }
  
  // Si hay archivos correctos procesados
  if (props.dataUploadFiles.countCorrectFiles > 0) {
    return '/icon-check-blue.svg'; // Ícono de éxitodataManyFiles
  }
  
  
  return '/circle-gray.svg'; // Ícono por defecto
}
async function handleFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
        for (let i = 0; i < inputElement.files.length; i++) {
            const file = inputElement.files[i];
            if (file.type === "application/pdf") {
                await store.addUploadedFile(file);
                
                // Cambiar esto:
                // await props.dataUploadFiles.dataManyFiles.push(file);
                
                // Por esto:
                await props.dataUploadFiles.dataManyFiles.push({
                    document_name: file.name.replace(/\.[^/.]+$/, ""), // Nombre sin extensión
                    documentary_type: "" // Tipo documental vacío
                });
                
                await props.dataUploadFiles.dataMultiSelectManyFiles.push(
                    Object.assign({}, props.multiSelectDependenceDefault.value)
                );
                let size = props.dataUploadFiles.dataMultiSelectManyFiles.length;
                props.dataUploadFiles.countTotalFiles = store.uploadedFiles.length;
                props.dataUploadFiles.dataMultiSelectManyFiles[size-1].key = size-1;
            }
        }
        inputElement.value = '';
    }
}

// Nueva función para manejar la carga de archivo único
async function handleSingleFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
        const file = inputElement.files[0];
        
        // Extraer el nombre sin la extensión
        const fileName = file.name.replace(/\.[^/.]+$/, "");

        // Asignar el nombre al campo InputText usando la propiedad 'model'
        if (props.dataUploadFiles.dataInputName) {
            // El componente InputText usa la propiedad 'model'
            props.dataUploadFiles.dataInputName.model = fileName;
        }
    }
    
    // Llamar al manejador original para mantener la funcionalidad existente
    if (props.dataUploadFiles.handleFileChange) {
        await props.dataUploadFiles.handleFileChange(event);
    }
}

onMounted(() => {
    props.dataUploadFiles.dataButtonAddManyFiles.onClick = () => {triggerFileInput()}
})

function updateFileName(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    props.dataUploadFiles.dataManyFiles[index].name = target.value;
}
</script>


<style scoped src="./UploadFiles.template.scss"></style>