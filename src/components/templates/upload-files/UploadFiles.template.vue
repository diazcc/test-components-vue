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
                    <input type="file" name="" id="" @change="dataUploadFiles.handleFileChange" required>
                </li>
                <li class="upload-files__content__card">
                    <Select :dataSelect="dataUploadFiles.dataSelectDocumentaryType" required />
                </li>
                <li v-if="hasPermissions.validator('share_file')" class="upload-files__content__card">
                    <MultiSelect :dataMultiSelect="dataUploadFiles.dataMultiSelect" required />
                </li>
                <div v-if="dataUploadFiles.apiResponse" class="api-response">
                    <h3>Sugerencia de Clasificación:</h3>
                    <ul>
                        <li><strong>- Dependencia:</strong> {{ dataUploadFiles.apiResponse.response_ml.predicted_categories["Dependency"] }}</li>
                        <li><strong>- Serie:</strong> {{ dataUploadFiles.apiResponse.response_ml.predicted_categories["Series"] }}</li>
                        <li><strong>- Subserie:</strong> {{ dataUploadFiles.apiResponse.response_ml.predicted_categories["Subseries"] }}</li>
                        <li><strong>- Tipo Documental:</strong> {{ dataUploadFiles.apiResponse.response_ml.predicted_categories["Document Type"] }}</li>
                    </ul>
                </div>
            </ul>
            <div>
            <UploadFilesTemplate :dataUploadFiles="dataUploadFiles" :multiSelectDependenceDefault="multiSelectDependenceDefault" />

            <!-- Display API response dynamically -->
            

        </div>
        </article>
        <article :class="'upload-files__container-multiple '+(dataUploadFiles.stateLoad ? 'loading-component' : '')" v-if="dataUploadFiles.stateFormManyFiles">
            <h1 class="upload-files__title">{{ t('upload_many_files') }}</h1>
            <section class="upload-files__container-multiple__many-files">
                <header class="upload-files__container-multiple__many-files__header">
                    <input type="file" ref="fileInput" @change="handleFileChange" style="display:none" multiple />
                    <Button class="upload-files__nav__button" :dataButton="dataUploadFiles.dataButtonAddManyFiles"/>
                </header>
                <table class="table">
                    <ol v-if="store.uploadedFiles.length">
                        <thead :class="'table__row table--header table__row--'+(!hasPermissions.validator('share_file') ? 'less-column' : '')">
                            <th class="table__row__cell">{{ t("item") }}</th>
                            <th>{{ t("name") }}</th>
                            <th>{{ t("type_documental") }}</th>
                            <th v-if="hasPermissions.validator('share_file')">{{ t("dependences") }}</th>
                            <th></th>
                        </thead>
                        <tbody :class="'table__row table__row--'+(!hasPermissions.validator('share_file') ? 'less-column' : '')"
                        v-for="(file, index) in store.uploadedFiles" :key="index">
                            <td class="table__row__cell">{{ index + 1 }}</td>
                            <input class="table__row__cell table__row--info table__row--more-padding" type="text" name="" id="" placeholder="Nombre" required :value="file.name?file.name:''">
                            <select class="table__row__cell table__row--info" name="" id="" v-model="dataUploadFiles.dataManyFiles[index]" required>
                                    <option value="" selected disabled>
                                        {{ t('select_documentary_type') }}
                                    </option>
                                    <option  v-for="documentary of dataUploadFiles.dataSelectDocumentaryType.options" :value="documentary.value">
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

async function handleFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
        for (let i = 0; i < inputElement.files.length; i++) {
            const file = inputElement.files[i];
            if (file.type === "application/pdf") {
                await store.addUploadedFile(file);//Use  store for save all files elected about input file. check store for be used
                await props.dataUploadFiles.dataManyFiles.push("");
                await props.dataUploadFiles.dataMultiSelectManyFiles.push(Object.assign({}, props.multiSelectDependenceDefault.value));
                let size = props.dataUploadFiles.dataMultiSelectManyFiles.length;
                props.dataUploadFiles.dataMultiSelectManyFiles[size-1].key = size-1;
            }
        }
        
        inputElement.value = '';
    }
}

onMounted(() => {
    props.dataUploadFiles.dataButtonAddManyFiles.onClick = () => {triggerFileInput()}
})


</script>


<style scoped src="./UploadFiles.template.scss"></style>