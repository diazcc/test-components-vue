<template>
  <section class="test">
    <ModalResponseFileMolecule :dataModalResponseFile="dataModalResponseFile" />
    <ModalPdfViewer :dataModalPdfViewer="dataModalPdfViewer" />
    <ModalAlert :dataModalAlert="dataModalAlert" />
  </section>
</template>
<script setup lang="ts">
import { reactive, onMounted, ref } from "vue";
import ModalResponseFileMolecule from "../molecules/modals/response-file/ModalResponseFile.molecule.vue";
import ModalPdfViewer from "../molecules/modals/modal-pdf-viewer/ModalPdfViewer.molecule.vue";
import FilesServices from "../../services/FilesServices";
import FilingServices from "../../services/FilingServices";
import DataFlowServices from "../../services/DataFlowServices";
import FormValidators from "../../validators/FormValidators";
import ModalAlert from "../molecules/modals/alert/ModalAlert.molecule.vue";
import { accessStore } from "../../store";
const store: any = accessStore();

const valueEditor: any = ref();
onMounted(() => {
  setTimeout(() => {
    dataModalResponseFile.isActive = true;
  }, 1000);
});
const dataModalResponseFile: any = reactive({
  isFirstSection: true, //Is first view
  howContinue: "", //reply - assignopen
  shippingMode: "", //me - others - othersandme
  isActive: false, //Is active modal
  isResponse: true, //Is response, if no is asignment
  isCreateFile: false,
  modeResponse: "", //me - othersandme -sothers
  stateView: "step1", //step1 - step2 - step3
  isTrdView: false, //Is trd view
  dataCardInformationFiling: {
    status_display: {
      label: "in_process",
      code: "IN_PROCESS",
    },
    dataFiling: {
      filing_code: "112025000018",
      type_of_filing: {
        id: 1,
        code: "1",
        name: "Entrada",
        delete: false,
      },
      filing_date: "2025-06-04",
      filing_time: "16:16:59",
      subject: "prueba",
      description: "",
      presentation_mode: {
        id: 1,
        code: "001",
        label: "written",
      },
      remitter: {
        id: 1,
        email: "louppautrumabo-1392@yopmail.com",
        contact_name: null,
        address: "calle  11  53",
        person_type: {
          id: 1,
          code: "001",
          label: "person",
        },
      },
      addressee: null,
      creation_medium: "window_filing",
      filing_qr:
        "auth/records_and_folders/2025EXP000133/112025000018/qr-112025000018.png",
      filing_certificate:
        "auth/records_and_folders/2025EXP000133/112025000018/certificado_radicación-112025000018.pdf",
      filing_sticker:
        "auth/records_and_folders/2025EXP000133/112025000018/sticker-112025000018.pdf",
      documents: [
        {
          name: "Docugate BPM Mokcups-112025000018 - 1-Entrada.pdf",
          url: "auth/records_and_folders/2025EXP000133/112025000018/documents/Docugate BPM Mokcups-112025000018 - 1-Entrada.pdf",
        },
      ],
      relationship_matrix_documentary_type: null,
    },
    openFile: (url: any) => {
      openModalPdfViewer(url);
    },
  },
  assign:{
    dataSelectDependence:{
        id: '',
        name: 'dependece',
        className: '',
        disabled: false,
        onChange: (data: any) => {
        selectDependenceInputChange(data.target.value);
      },
        onClick: () => { },
        placeholder: 'select_dependence',
        model: '',
        options: [
        ]
    },
    dataSelectUser:{
        id: '',
        name: 'dependece',
        className: '',
        disabled: false,
        onClick: () => { },
        placeholder: 'select_user',
        model: '',
        options: [
        ]
    },
    comments:'',
  },
  dataResumeFiling: {
    url: "",
    subject: "",
    filing_number: "",
    creation_date: "",
    email: "",
    response_mode: "",
    downloadPdfQR: () => {
      downloadFilingPdfSticker();
    },
    downloadPdfCertificated: () => {
      downloadFilingPdfCertificated();
    },
  },
  dataSelectListActionUsers: {
    typeOfFinalAction: "",
    stateEditorText: false,
    usersSelecteds: [],
    users: [],
  },
  dataDocumentCreator: {
    setDataPage: () => {},
  },
  dataFormTrd: {
    typeFlow: 2,
    serie: "",
    subserie: "",
    documentary_type: "",
  },
  dataButtonBack: {
    className: "",
    text: "close",
    alt: "",
    url: "/Buttons/left-arrow.svg",
    disabled: false,
    reverse: false,
    fontSize: "",
    iconSize: "",
    onClick: () => {
      validateButtonBack();
    },
  },
  dataButtonContinue: {
    className: "blue",
    text: "continue",
    alt: "",
    url: "/Buttons/right-arrow.svg",
    disabled: false,
    reverse: true,
    fontSize: "",
    iconSize: "",
    onClick: () => {
      validateButtonContinue();
    },
  },
  dataSelectListUserAction: {},
});
const dataModalPdfViewer: any = reactive({
  isActive: "hidde",
  dataPdfViewer: {
    urlPdf: "",
    toolbar: { toolbar: false },
    onClose: () => {},
  },
});
const dataModalAlert: any = reactive({
  isActive: "",
  dataButton: {
    className: "blue",
    text: "close",
    disabled: false,
    onClick: () => {
      dataModalAlert.isActive = "hidde";
    },
  },
  dataText: {
    classText: "",
    text: "",
    disabled: false,
    onClick: () => {},
  },
});

function closeResponseModal() {
  dataModalResponseFile.isActive = false;
}


function validateButtonContinue() {
  switch (dataModalResponseFile.stateView) {
    case "step1":
      if (dataModalResponseFile.isFirstSection == false) {
        console.log(
          "dataModalResponseFile.shippingMode",
          dataModalResponseFile.shippingMode
        );
        switch (dataModalResponseFile.howContinue) {
          case "reply":
            if (dataModalResponseFile.shippingMode == "") {
              //Capture error if in case
              openModalAlert("choose_mode");
              FormValidators.getValidationForm(
                "modal-response-file__wrapper__content__address"
              );
            } else if (
              dataModalResponseFile.dataSelectListActionUsers.usersSelecteds
                .length == 0
            ) {
              openModalAlert("choose_users");
            } else if (
              dataModalResponseFile.shippingMode == "othersandme" &&
              !hasCurrentUserAndOthersWithAction(
                dataModalResponseFile.dataSelectListActionUsers.usersSelecteds
              )
            ) {
              openModalAlert("choose_users");
            } else {
              dataModalResponseFile.stateView = "step12";
              scrollToSection("destination");
            }
            break;
          case "assign":
              openModalAlert("the_filing_was_successfully_assigned"); //MODIFY -- Confimration modal

            break;
          default:
            console.log(
              "openModalAler : No se ha seleccionado una opción válida"
            );
            openModalAlert("choose_option");
            break;
        }
      }
      scrollToSection("how_do_you_want_to_continue");
      dataModalResponseFile.isFirstSection = false;
      break;
    case "step12":
      if (
        !dataModalResponseFile.dataSelectListActionUsers.stateEditorText &&
        store.uploadedFiles.length == 0
      ) {
        openModalAlert("upload_file");
        return;
      }
      if (dataModalResponseFile.isTrdView == true) {
        dataModalResponseFile.stateView = "step123";
      }
      dataModalResponseFile.isTrdView = true;
      scrollToSection("trd-form-component");
      break;

    case "step123":
      break;

    default:
      break;
  }
}
function validateButtonBack() {
  console.log(dataModalResponseFile.stateView);
  switch (dataModalResponseFile.stateView) {
    case "step1":
      closeResponseModal();
      break;
    case "step12":
      console.log("step2");

      dataModalResponseFile.stateView = "step1";
      break;
    case "step123":
      dataModalResponseFile.isActive = false;
      break;
    default:
      break;
  }
}
function hasCurrentUserAndOthersWithAction(
  users: Array<{ is_current_user: boolean; action: string }>
): boolean {
  const hasCurrentUser = users.some((u) => u.is_current_user);
  const hasOtherUser = users.some((u) => !u.is_current_user);
  const allHaveAction = users.every(
    (u) => !!u.action && u.action.trim() !== ""
  );
  return hasCurrentUser && hasOtherUser && allHaveAction;
}
function scrollToSection(id: string) {
  setTimeout(async () => {
    const el = await document.getElementById(id);
    console.log(el, "eeeeeeeeeeeeeeeee");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 100);
}
async function selectDependenceInputChange(data: any) {
  const arrayData: any = [];
  try {
    const response = await FilingServices.getUsersDependence(data);
    if (response.error) {
      console.error("error usuario", response.data);
    }
    response.response.forEach((element: any) => {
      arrayData.push({
        value: element.id,
        label: element.email,
      });
    });
    dataModalResponseFile.assign.dataSelectUser.options =
      arrayData;
    dataModalResponseFile.assign.dataSelectUser.disabled =
      false;
  } catch (error) {
    console.error(error, "error selectDependenceInputChange");
    dataModalResponseFile.assign.dataSelectUser.options =
      [];
    dataModalResponseFile.assign.dataSelectUser.disabled =
      true;
  }
}


function downloadFilingPdfCertificated() {
  DataFlowServices.downloadPdf('urlPdfCertificated.value').catch((error: any) => {
    console.error("Error al descargar el PDF:", error);
    openModalAlert("something_happened_try_later");
  });
}
function downloadFilingPdfSticker(){
    DataFlowServices.downloadPdf('urlPdfSticker.value')
        .catch((error:any) => {
            console.error('Error al descargar el PDF:', error);
            openModalAlert('something_happened_try_later')
        });
}
function openModalAlert(text: string) {
  dataModalAlert.isActive = "show";
  dataModalAlert.dataText.text = text;
}
function getValueEditor(value: any) {
  valueEditor.value = value.map(
    ({ page, dataDocumentCreatorPageBody }: any) => ({
      page,
      content: store.escapeHtmlContent(
        dataDocumentCreatorPageBody.dataEditor.content
      ),
    })
  ); //This gonna be string for optimized process but could be modify
}
function openModalPdfViewer(data: File | string) {
  if (data instanceof File) {
    const url = URL.createObjectURL(data);
    dataModalPdfViewer.dataPdfViewer.urlPdf = url;
  } else if (typeof data === "string") {
    dataModalPdfViewer.dataPdfViewer.urlPdf = data;
  }
  dataModalPdfViewer.isActive = "show";
}
</script>
<style scoped src="./Test.scss"></style>
