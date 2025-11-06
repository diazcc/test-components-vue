<template>
  <UploadFilesTemplate
    :dataUploadFiles="dataUploadFiles"
    :multiSelectDependenceDefault="multiSelectDependenceDefault"
    :apiResponse="dataUploadFiles.apiResponse"
  />
</template>

<script setup lang="ts">
// Import vue libraries
import { onMounted, ref, reactive, onBeforeMount, Ref } from "vue";
import { useI18n } from "vue-i18n";

// Import components
import UploadFilesTemplate from "../../templates/upload-files/UploadFiles.template.vue";

// Import services
import FilesServices from "../../../services/FilesServices.ts";
import UserService from "../../../services/UserServices.ts";
import TrdServices from "../../../services/TrdServices.ts";
import DependenceServices from "../../../services/DependenceServices";
import FormValidators from "../../../validators/FormValidators.ts";
import UtilsServices from "../../../services/UtilsServices.ts";
import { accessStore } from "../../../store";

// Define emit and props and configuration
const { t } = useI18n();
const store = accessStore();

// Define variables and constants
const documentContent: any = ref();
const userId: any = ref("");
const userDependece: any = ref("");
const dataUploadFiles: any = reactive({
  dataManyFiles: [],
  dataMultiSelectManyFiles: [],
  stateFormCreate: false,
  countTotalFiles: 0,
  countLoadedFiles: 0,
  countErrorFiles: 0,
  countCorrectFiles: 0,
  stateFormUniqueFile: false,
  stateFormManyFiles: false,
  stateLoad: false,
  stateObtainData: false,
  counterFiles: 1,
  apiResponse: null,
  dataForm: {
    code: "",
    name: "",
    serie: "",
    time_file_management: "",
    time_file_central: "",
    final_disposition: "",
  },
  dataButtonUploadFile: {
    className: "gray-blue",
    text: "upload_file",
    disabled: false,
    onClick: () => {
      setStateFormUniqueFile();
    },
  },
  dataButtonUploadManyFiles: {
    className: "gray-mouse-blue",
    text: "upload_many_files",
    disabled: false,
    onClick: () => {
      setStateFormManyFiles();
    },
  },
  dataButtonNext: {
    className: "blue",
    text: "upload",
    alt: "upload",
    url: "/Buttons/upload-file.svg",
    disabled: false,
    reverse: true,
    onClick: () => {
      try {
        validateForm();
      } catch (error) {
        console.error("Error during form validation:", error);
      }
    },
  },
  dataButtonBack: {
    className: "gray",
    text: "back",
    alt: "left-arrow",
    url: "/Buttons/left-arrow.svg",
    reverse: false,
    disabled: false,
    onClick: () => {
      setStatesBack();
      refreshStateData();
    },
  },
  dataButtonAddManyFiles: {
    className: "gray",
    text: "add",
    alt: "add",
    url: "/Buttons/icon-add.svg",
    reverse: true,
    disabled: false,
    onClick: () => {},
  },
  dataModalAlert: {
    isActive: "",
    dataButton: {
      className: "",
      text: "Cerrar",
      disabled: false,
      onClick: () => {
        closeModalAlert();
      },
    },
    dataText: {
      classText: "",
      text: "",
      disabled: false,
      onClick: () => {},
    },
  },
  dataInputName: {
    id: "",
    name: "",
    classInput: "",
    model: "",
    type: "text",
    placeholder: "name",
    disabled: false,
    required: true,
    onClick: () => {},
  },
  dataSelectDocumentaryType: {
    id: "",
    name: "",
    className: "",
    disabled: false,
    onChange: (data: any) => {},
    onClick: () => {},
    placeholder: "select_documentary_type",
    model: "",
    options: [
      {
        value: "",
        label: "",
      },
    ],
  },
  dataModalConfirmation: {
    isActive: "",
    dataButton: {
      className: "",
      text: "continue",
      disabled: false,
      onClick: () => {},
    },
    dataText: {
      classText: "",
      text: "Error, intentalo mas tarde.",
      disabled: false,
      onClick: () => {},
    },
  },
  handleFileChange: async (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.files || inputElement.files.length === 0) {
      return;
    }
    getContentFile(inputElement);

    const file = inputElement.files[0];
    documentContent.value = file;

    // try {
    //     const response = await sendFileToAPI(file);
    //     console.log("API Response:", response);

    //     // Store the API response in `dataUploadFiles`
    //     dataUploadFiles.apiResponse = response;

    //     // Show response in modal
    //     dataUploadFiles.dataModalAlert.isActive = 'show';
    //     dataUploadFiles.dataModalAlert.dataText.text = response.message || "Archivo procesado exitosamente!";

    // } catch (error) {
    //     console.error("Error sending file to API:", error);
    //     dataUploadFiles.apiResponse = { error: "Error procesando archivo!" };

    //     dataUploadFiles.dataModalAlert.isActive = 'show';
    //     dataUploadFiles.dataModalAlert.dataText.text = "Error procesando archivo!";
    // }
  },
  dataMultiSelect: {
    title: "select_dependency",
    model: [],
    options: [],
  },
  dataTooltipIcons: [
    {
      text: `${UtilsServices.capitalizeFirstLetter(
        t("delete") + " " + t("file")
      )}`,
      src: "/Buttons/icon-delete.svg",
      color: "red",
      alt: "delete",
      show: () => {
        return true;
      },
      onClick: ({ index = -1 }) => {
        removeFile(index);
      },
    },
  ],
});

// Define functions
async function sendFileToAPI(file: File) {
  const formData = new FormData();
  formData.append("file", file); // Ensure the API expects a "file" field

  try {
    const response = await FilesServices.sendClassifyFiles(formData);
    console.log(typeof response);
    return response;
  } catch (error) {
    console.error("API Upload Error:", error);
    throw error;
  }
}

const multiSelectDependenceDefault: any = reactive({ value: {} });

onMounted(() => {
  // getDocumentaryType();
  // getDependence();
});

onBeforeMount(() => {
  store.clearUploadedFiles();
});

/**
 * todo GET & SET
 */

function getDocumentaryType() {
  TrdServices.getDocumentaryType().then((response: any) => {
    dataUploadFiles.data = response;
    dataUploadFiles.dataSelectDocumentaryType.options = response.results.map(
      (value: any) => ({
        value: value.id,
        label: value.name_document_type,
      })
    );
  });
}



async function getUserId() {
  await UserService.getMe()
    .then(async (response: any) => (userId.value = response.id))
    .catch((error: any) => console.error(error));
}

async function sendNewFile() {
  if (!FormValidators.getValidationForm("upload-files__content")) {
    dataUploadFiles.dataModalAlert.isActive = "show";
    dataUploadFiles.dataModalAlert.dataText.text = "empty_inputs";
    return;
  }

  dataUploadFiles.stateLoad = true;

  const file = store.uploadedFiles[0]; // ✅ único archivo cargado
  if (!file) {
    dataUploadFiles.stateLoad = false;
    dataUploadFiles.dataModalAlert.isActive = "show";
    dataUploadFiles.dataModalAlert.dataText.text = "no_file_selected";
    return;
  }

  // ✅ Preparamos el FormData
  const formData = new FormData();
  formData.append("file", file);

  // ✅ Enviar al backend Flask
  UserService.uploadFile(formData).then((response: any) => {
    dataUploadFiles.stateLoad = false;
    dataUploadFiles.dataModalConfirmation.isActive = "show";
    dataUploadFiles.dataModalConfirmation.dataText.text =
      "El archivo fue subido exitosamente";
    dataUploadFiles.dataModalConfirmation.dataButton.onClick = () => {
      dataUploadFiles.stateFormCreate = false;
      hiddeModalConfirmation();
      refreshStateData();
    };
    console.log("Archivo subido:", response.data);
  });
}

async function sendNewManyFiles() {
  dataUploadFiles.stateLoad = true;

  if (!FormValidators.getValidationForm("table")) {
    dataUploadFiles.stateLoad = false;
    dataUploadFiles.dataModalAlert.isActive = "show";
    dataUploadFiles.dataModalAlert.dataText.text = "empty_inputs";
    return;
  }

  dataUploadFiles.countLoadedFiles = 0;
  dataUploadFiles.countErrorFiles = 0;
  dataUploadFiles.countCorrectFiles = 0;

  let errors: any = "";
  const failedIndexes: number[] = []; // Guardar índices fallidos

  try {
    for (let i = 0; i < dataUploadFiles.dataManyFiles.length; i++) {
      const fileData = dataUploadFiles.dataManyFiles[i];
      const file = store.uploadedFiles[i];
      if (!file) continue;

      const singleFileData = {
        document_name:
          fileData.document_name?.replace(/[ ]/g, "_") || file.name,
        documentary_type: fileData.documentary_type,
        dependences: dataUploadFiles.dataMultiSelectManyFiles[i]?.model || [],
      };

      dataUploadFiles.countLoadedFiles++;

      const formData: any = new FormData();
      formData.append("document", file);
      formData.append("data", JSON.stringify([singleFileData]));

      try {
        const response = await FilesServices.sendFiles(formData);
        console.log(`✅ Archivo ${i + 1} enviado:`, response);
        dataUploadFiles.countCorrectFiles++;
      } catch (error: any) {
        console.error(`❌ Error enviando archivo ${i + 1}:`, error);
        failedIndexes.push(i); // guardar el índice del archivo fallido
        errors = error?.results?.errors?.[0]?.error || "Error desconocido";
        dataUploadFiles.countErrorFiles++;
      }
    }

    dataUploadFiles.stateLoad = false;

    if (dataUploadFiles.countErrorFiles === 0) {
      dataUploadFiles.dataModalConfirmation.isActive = "show";
      dataUploadFiles.dataModalConfirmation.dataText.text =
        "files_uploaded_succesfully";
      dataUploadFiles.dataModalConfirmation.dataButton.onClick = () => {
        dataUploadFiles.stateFormCreate = false;
        hiddeModalConfirmation();
        refreshStateData();
        setStatesBack();
      };
    } else {
      // 🔥 Mantener solo los archivos que fallaron
      store.uploadedFiles = store.uploadedFiles.filter((_: any, index: any) =>
        failedIndexes.includes(index)
      );
      dataUploadFiles.dataManyFiles = dataUploadFiles.dataManyFiles.filter(
        (_: any, index: any) => failedIndexes.includes(index)
      );
      dataUploadFiles.dataModalAlert.isActive = "show";
      dataUploadFiles.dataModalAlert.dataText.text = errors;
      dataUploadFiles.countTotalFiles = 0;
      dataUploadFiles.countTotalFiles = store.uploadedFiles.length;
    }
  } catch (err) {
    console.error("Error inesperado en subida:", err);
    dataUploadFiles.dataModalAlert.isActive = "show";
    dataUploadFiles.dataModalAlert.dataText.text = "error_during_upload";
  }
}

const removeFile = (index: any) => {
  store.removeUploadedFile(index);
  dataUploadFiles.dataManyFiles.splice(index, 1);
  dataUploadFiles.dataMultiSelectManyFiles.splice(index, 1);
  for (
    let i: any = 0;
    i < dataUploadFiles.dataMultiSelectManyFiles.length;
    ++i
  ) {
    dataUploadFiles.dataMultiSelectManyFiles[i].key = i;
  }
};

function refreshStateData() {
  dataUploadFiles.dataInputName.model = "";
  dataUploadFiles.dataSelectDocumentaryType.model = "";
  dataUploadFiles.stateLoad = false;
  dataUploadFiles.dataMultiSelect.model = [];
  store.clearUploadedFiles();
  dataUploadFiles.dataManyFiles = [];
  dataUploadFiles.dataMultiSelectManyFiles = [];
}

function setStateFormCreate() {
  dataUploadFiles.stateFormCreate = true;
}

function setStatesBack() {
  // Estados de formulario
  dataUploadFiles.stateFormUniqueFile = false;
  dataUploadFiles.stateFormManyFiles = false;
  dataUploadFiles.stateFormCreate = false;
  dataUploadFiles.stateLoad = false;

  // Contadores
  dataUploadFiles.countTotalFiles = 0;
  dataUploadFiles.countLoadedFiles = 0;
  dataUploadFiles.countErrorFiles = 0;
  dataUploadFiles.countCorrectFiles = 0;
  dataUploadFiles.counterFiles = 1;

  // Datos de formulario
  dataUploadFiles.dataInputName.model = "";
  dataUploadFiles.dataSelectDocumentaryType.model = "";
  dataUploadFiles.dataMultiSelect.model = [];

  // Arrays de datos
  dataUploadFiles.dataManyFiles = [];
  dataUploadFiles.dataMultiSelectManyFiles = [];

  // API Response
  dataUploadFiles.apiResponse = null;

  // Modales
  dataUploadFiles.dataModalAlert.isActive = "";
  dataUploadFiles.dataModalConfirmation.isActive = "";

  // Limpiar archivos del store
  store.clearUploadedFiles();

  // Limpiar contenido del documento
  documentContent.value = null;

  // Resetear dependencia por defecto
  dataUploadFiles.dataMultiSelect = Object.assign(
    {},
    multiSelectDependenceDefault.value
  );
}

function setStateFormUniqueFile() {
  dataUploadFiles.stateFormUniqueFile = true;
  dataUploadFiles.stateFormManyFiles = false;
  dataUploadFiles.dataMultiSelect = Object.assign(
    {},
    multiSelectDependenceDefault.value
  );
}

function setStateFormManyFiles() {
  dataUploadFiles.stateFormManyFiles = true;
  dataUploadFiles.stateFormUniqueFile = false;
}

function closeModalAlert() {
  dataUploadFiles.dataModalAlert.isActive = "";
  dataUploadFiles.stateLoad = false;
}

function hiddeModalConfirmation() {
  dataUploadFiles.dataModalConfirmation.isActive = "hidde";
  dataUploadFiles.stateLoad = false;
  setStatesBack();
}

function showModalConfirmation() {
  dataUploadFiles.dataModalConfirmation.isActive = "show";
}

function getContentFile(file: any) {
  documentContent.value = file.files[0];
}
async function uploadFilesToServer() {
  try {
    const formData = new FormData();

    dataUploadFiles.dataManyFiles.forEach((fileData: any, index: number) => {
      const file = store.uploadedFiles[index];
      if (!file) return;

      const metadata = {
        document_name:
          fileData.document_name?.replace(/[ ]/g, "_") || file.name,
        documentary_type: fileData.documentary_type,
        dependences:
          dataUploadFiles.dataMultiSelectManyFiles[index]?.model || [],
      };

      formData.append("files", file);
      formData.append("metadata", JSON.stringify(metadata));
    });

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Error al subir archivos");

    const result = await response.json();
    console.log("✅ Subida exitosa:", result);
    alert("Archivos subidos correctamente");
  } catch (error) {
    console.error("❌ Error al subir archivos:", error);
    alert("Error al subir archivos, revisa la consola.");
  }
}

function getDataFiles(className: any): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const data: any[] = [];

    // Usar dataManyFiles en lugar de leer del DOM
    dataUploadFiles.dataManyFiles.forEach((fileData: any, index: number) => {
      if (fileData.document_name && fileData.documentary_type) {
        data.push({
          document_name: fileData.document_name.replace(/[ ]/g, "_"),
          documentary_type: fileData.documentary_type,
          document: "", // Se llenará después
          dependences:
            dataUploadFiles.dataMultiSelectManyFiles[index]?.model || [],
        });
      }
    });

    // Leer archivos secuencialmente
    const readFilesSequentially = (index: number) => {
      if (index >= store.uploadedFiles.length || index >= data.length) {
        return resolve(data);
      }

      const file = store.uploadedFiles[index];
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as ArrayBuffer;
        const base64String = btoa(
          new Uint8Array(fileContent).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        data[index].document = base64String;
        dataUploadFiles.countLoadedFiles = index + 1;

        readFilesSequentially(index + 1);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    };

    readFilesSequentially(0);
  });
}

function openModalAlert(text: string) {
  dataUploadFiles.dataModalAlert.isActive = "show";
  dataUploadFiles.dataModalAlert.dataText.text = text;
}

function getDataFile(dataForm: any[]): Promise<FormData> {
  return new Promise((resolve, reject) => {
    const formData = new FormData(); // como variable local
    const reader = new FileReader();

    reader.onload = () => {
      const fileContent: any = reader.result;
      const base64String = btoa(
        new Uint8Array(fileContent).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      const updatedData = dataForm.map((item: any) => ({
        ...item,
        document: base64String,
      }));
      const dataString = JSON.stringify(updatedData);

      formData.append("data", dataString);

      resolve(formData);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(documentContent.value);
  });
}

function validateForm() {
  dataUploadFiles.stateFormUniqueFile ? sendNewFile() : sendNewManyFiles();
}
</script>

<style scoped src="./UploadFiles.page.scss"></style>
