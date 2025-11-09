<template>
  <FilingTemplate
    :dataFiling="dataFiling"
    @sendDataEditorModalAssignFiling="sendDataEditorModalAssignFiling"
    @sendDataEditor="getValueEditor"
    @emitDocSelected="getFileFilingForm"
  />
</template>
<script setup lang="ts">
import FilingTemplate from "../../templates/filing/Filing.template.vue";
import { onMounted, reactive, ref } from "vue";
import FilingServices from "../../../services/FilingServices";
import RecordsServices from "../../../services/RecordsServices";
import ActionServices from "../../../services/ActionServices";
import FilesServices from "../../../services/FilesServices";
import { useRoute, useRouter } from "vue-router";
import { accessStore } from "../../../store";
import UtilsServices from "../../../services/UtilsServices";
import TrdServices from "../../../services/TrdServices";
import FormValidators from "../../../validators/FormValidators";
import DependenceServices from "../../../services/DependenceServices";
import DataFlowServices from "../../../services/DataFlowServices";

const store: any = accessStore();
const route: any = useRoute();
const router: any = useRouter();
const idUserAssign: any = ref("");
const filing: any = reactive({ data: {} });
const recordId: any = ref(route.params.id);
const emailUser: any = ref("");
const urlPdfSticker: any = ref("");
const valueEditor: any = ref();
const urlPdfCertificated: any = ref("");
const recordData: any = ref();
const dataFiling: any = reactive({
  stateViewTrazability: true,
  stateViewRecord: false,
  stateViewTrd: false,
  stateViewDocuments: false,
  backWasPresed: false,
  record_documents: {},
  filings: [],
  dataLineHistory: [],
  data: {
    subject: "",
    filing_code: "",
    remitter: "",
    show_remitter_email: true,
    person_type: "",
    email: "",
    filing_date: "",
    status: "",
    type_of_filing: "",
    documents: [],
  },
  dataModalPdfViewer: {
    isActive: "",
    dataPdfViewer: {
      urlPdf: "",
      toolbar: {
        toolbar: {
          toolbarViewerMiddle: false,
          toolbarViewerLeft: false,
        },
      },
      onClose: () => {},
    },
  },
  dataSelectActions: {
    id: "",
    name: "",
    className: "",
    disabled: false,
    placeholder: "actions",
    model: "",
    options: [],
    onChange: (data: any) => {
      validateSelect(data.target.value);
      dataFiling.dataSelectActions.model = ""; //Refresh select and values before be selected
    },
    onClick: () => {},
  },
  dataModalAssignFiling: {
    comments: "",

    isActive: false,
    dataEditorText: {
      dataEditor: {
        // properties for the editor
        setData: () => {},
        content: "",
      },
    },
    dataButtonCancel: {
      className: "",
      text: "cancel",
      alt: "cancel",
      url: "/Buttons/decline.svg",
      iconSize: "short",
      disabled: false,
      reverse: false,
      onClick: () => {
        closeModalAssignFiling();
      },
    },
    dataButtonSend: {
      className: "blue",
      text: "assign",
      alt: "asignar",
      url: "/Buttons/icon-assign.svg",
      disabled: false,
      reverse: true,
      iconSize: "large",
      onClick: () => {
        validateFormAssignFiling();
      },
    },
    dataSelectDependence: {
      id: "",
      name: "dependece",
      className: "",
      disabled: false,
      onChange: (data: any) => {
        selectDependenceInputChange(data.target.value);
      },
      placeholder: "select",
      model: "",
      options: [
        {
          value: "",
          label: "",
        },
      ],
    },
    dataSelectUser: {
      id: "",
      name: "userDependece",
      className: "",
      disabled: true, //disabled temporaly
      onClick: (data: any) => {
        idUserAssign.value = data.target.value;
      },
      placeholder: "Seleccionar Usuario",
      model: "",
      options: [
        {
          value: "",
          label: "",
        },
      ],
    },
  },
  dataModalResponseFiling: {
    isActive: false,
    subject: "",
    idRemitter: "",
    stateLoadForm: false,
    stateViewFile: "step1",
    stateViewDocument: false,
    contentDocument: "",
    stateViewResume: false,
    stateViewPdf: true,
    dataSelectListActionUsers: {
      typeOfFinalAction: "",
      stateEditorText: false,
      usersSelecteds: [],
      users: [],
    },
    dataDocumentCreator: {
      setDataPage: () => {},
    },
    dataButtonNext: {
      className: "blue",
      text: "continue",
      alt: "continue",
      url: "/Buttons/right-arrow.svg",
      reverse: true,
      disabled: false,
      onClick: () => {
        validateNavigationNextResponse();
      },
    },

    dataButtonBack: {
      className: "",
      text: "back",
      alt: "continue",
      url: "/Buttons/left-arrow.svg",
      reverse: false,
      disabled: false,
      onClick: () => {
        validateNavigationBackResponse();
      },
    },
    dataImgGoToBack: {
      id: "",
      name: "back",
      class: "icon-button",
      src: "/icon-close.svg",
      type: "svg",
      alt: "",
      isActive: () => {}, // optional, currently used to add activate and deactivate the active class
      onClick: () => {
        dataFiling.dataModalResponseFiling.isActive =
          !dataFiling.dataModalResponseFiling.isActive;
        dataFiling.dataModalResponseFiling.stateViewFile = "step1";
        dataFiling.dataModalResponseFiling.dataButtonBack.url =
          "/Buttons/left-arrow.svg";
        dataFiling.dataModalResponseFiling.dataPdfViewer.urlPdf = "";
      },
    },
    dataPdfViewer: {
      urlPdf: "",
      toolbar: {
        secondaryToolbar: false,
        toolbar: {
          toolbarViewerLeft: {
            findbar: true,
            previous: false,
            next: false,
            pageNumber: true,
          },
          toolbarViewerRight: {
            presentationMode: false,
            openFile: false,
            print: true,
            download: true,
            viewBookmark: false,
          },
          toolbarViewerMiddle: {
            zoomOut: true,
            zoomIn: true,
            scaleSelectContainer: true,
          },
        },
      },
      onClose: () => {},
    },
    dataFormTrd: {
      typeFlow: 2,
      serie: "",
      subserie: "",
      documentary_type: "",
    },
    dataFilingFlow: {
      stateResponseFiling: true, // = true for see view response filing final step.
      stateCreatedFilin: true,
      stateViewFileAnonimous: false,
      dataFormFiling: {
        tracking_number: "",
        subject: "",
        confidential_document: "",
        presentation_mode: "",
        response_mode: "",
        remitter: "",
        address: "",
        phone_number: "",
        email: "",
        description: "",
      },
      dataResponse: {
        dataImgQR: {
          id: "",
          name: "",
          class: "",
          src: "",
          type: "",
          alt: "",
          onClick: () => {},
        },
        filing_code: "",
        filing_date: " ",
        remitter: "",
        type_of_filing: "",
        subject: "",
      },
      dataInputFiles: {
        counterFiles: 0,
        dataModalListDocuments: {
          isActive: false,
          closeModal: () => {
            dataFiling.dataModalResponseFiling.dataFilingFlow.dataInputFiles.dataModalListDocuments.isActive =
              false;
          },
        },
        openModalDocs: () => {
          dataFiling.dataModalResponseFiling.dataFilingFlow.dataInputFiles.dataModalListDocuments.isActive =
            true;
        },
      },
      downloadPdfQR: () => {
        downloadFilingPdfSticker();
      },
      downloadPdfCertificated: () => {
        downloadFilingPdfCertificated();
      },
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
  },
  dataModalConfirmation: {
    isActive: "",
    dataButton: {
      className: "blue",
      text: "close",
      alt: "close",
      url: "/Buttons/decline.svg",
      iconSize: "short",
      reverse: true,
      disabled: false,
      onClick: () => {
        closeModalConfirmation();
      },
    },
    dataText: {
      classText: "",
      text: "",
      disabled: false,
      onClick: () => {},
    },
  },
  dataModalAlert: {
    isActive: "", // -- > show
    dataButton: {
      className: "blue",
      text: "close",
      alt: "close",
      url: "/Buttons/decline.svg",
      iconSize: "short",
      reverse: true,
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
  dataFormTrd: {
    typeFlow: filing?.data?.type_of_filing?.id,
    stateLoad: false,
    serie: filing?.data?.relationship_matrix_documentary_type?.serie,
    subserie: filing?.data?.relationship_matrix_documentary_type?.serie,
    documentary_type: filing?.data?.relationship_matrix_documentary_type?.serie,
  },
  dataButtonAssignTrd: {
    className: "blue",
    text: "save",
    alt: "save",
    reverse: true,
    url: "/Buttons/icon-save.svg",
    disabled: false,
    onClick: () => {
      assignTrd();
    },
  },
  dataImgGoBack: {
    id: "",
    name: "back",
    class: "icon-back",
    src: "/arrow-left.svg",
    type: "svg",
    alt: "",
    isActive: () => {}, // optional, currently used to add activate and deactivate the active class
    onClick: () => {
      if (dataFiling.backWasPresed == false) {
        router.back();
        dataFiling.backWasPresed = true;
      }
    },
  },
  dataModalListDocuments: {
    onlyView: true,
    isActive: false,
    closeModal: () => {
      closeModalListDocuments();
    },
  },
  dataModalAction: {
    isActive: false,
    title: "",
    messageBox: false,
    comments: "",
    dataButtonAction1: {
      className: "red",
      text: "",
      alt: "",
      url: "",
      disabled: false,
      reverse: true,
      fontSize: "",
      onClick: () => {},
    },
    dataButtonAction2: {
      className: "blue",
      text: "",
      alt: "",
      url: "",
      disabled: false,
      reverse: true,
      fontSize: "",
      onClick: () => {},
    },
    dataPdfViewer: {
      urlPdf: "",
      toolbar: { toolbar: false },
      onClose: () => {},
    },
    dataImg: {
      id: "",
      name: "close",
      class: "icon-button",
      src: "/icon-close.svg",
      type: "svg",
      alt: "",
      isActive: () => {}, // optional, currently used to add activate and deactivate the active class
      onClick: () => {
        resetModalAction();
      },
    },
  },

  redirectTrazability: () => {
    redirectTrazability();
  },
  redirectRecord: () => {
    redirectRecord();
  },
  redirectDocuments: () => {
    redirectDocuments();
  },
  redirectTrd: () => {
    redirectTrd();
  },
  onClickDocument: (document: any) => {
    console.log(document.url);
    
    findUrl(document.url);
  },
  openModalListDocuments: (documents: any, index: any) => {
    openModalListDocuments(documents, index);
  },
});

/**
 * Todo ########################### FUNCTIONS ####################################
 */

/**
 * Todo CYCLES LIFES
 */

onMounted(() => {
  callServices();
  store.clearUploadedFiles();
  console.log(dataFiling.data);
});

/**
 * TODO GET AND SEN
 * ?
 */
async function findUrl(url: string) {
  try {
    // 1️⃣ Descarga el archivo como Blob
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al descargar el archivo');

    // 2️⃣ Convierte a Blob con tipo PDF
    const blob = await response.blob();
    const pdfBlob = new Blob([blob], { type: 'application/pdf' });

    // 3️⃣ Crea una URL temporal para el visor
    const blobUrl = URL.createObjectURL(pdfBlob);

    // 4️⃣ Abre el modal con el PDF
    openModalPdfViewer(blobUrl);

    // 5️⃣ Guarda el ID o URL original
  } catch (error) {
    console.error(error);
    openModalAlert('something_happened_try_later');
  }
}
async function setTrdFormData() {
  dataFiling.dataFormTrd.typeFlow =
    (await filing?.data?.type_of_filing?.id) || 1;
  dataFiling.dataFormTrd.serie =
    (await filing.data.relationship_matrix_documentary_type?.serie) || ""; // validation if is undefined, show placeholder selectAtom
  dataFiling.dataFormTrd.subserie =
    (await filing.data.relationship_matrix_documentary_type?.subserie) || "";
  dataFiling.dataFormTrd.documentary_type =
    (await filing.data.relationship_matrix_documentary_type
      ?.documentary_type) || "";
}

function callServices() {
  getRecord(recordId.value);
  // getParentDependences();
}

async function getRecord(id: any) {
  try {
    const response = await RecordsServices.getRequest(id);
    console.log(response,'response');
    
    recordData.value = response.response;
    dataFiling.record_documents = response.documents;
    dataFiling.data =
      response;
      validateOptionSelectActions();
    
  } catch (error) {
    console.error(error);
  }
}
function getRemitterName(filing: any): string {
  const remitter = filing?.remitter;
  if (!remitter) return 'unnamed';

  if (remitter.contact_name) return remitter.contact_name;
  if (remitter.first_name && remitter.last_name) {
    return `${remitter.first_name} ${remitter.last_name}`;
  }


  return 'unnamed';
}
function getTrazabilityRecord() {
  RecordsServices.getTrazabilityRecord(recordId.value)
    .then((response: any) => {
      dataFiling.dataLineHistory = response.map((value: any) => {
        return {
          date: value.creation_date,
          time: value.creation_time,
          userName: value.user,
          description: value.description,
          comment: value.comments,
          userAsigned: value.user_asigned,
        };
      });
    })
    .catch((error: any) => {
      console.error(error);
    });
}

async function getDocumentContent(url: any, id: any) {
  FilesServices.getDocumentContent(url).then((response: any) => {
    dataFiling.dataModalPdfViewer.dataPdfViewer.urlPdf = response;
  });
}

function sendDataEditorModalAssignFiling(data: any) {}

function downloadFilingPdfCertificated() {
  DataFlowServices.downloadPdf(urlPdfCertificated.value).catch((error: any) => {
    console.error("Error al descargar el PDF:", error);
    openModalAlert("something_happened_try_later");
  });
}

function downloadFilingPdfSticker() {
  DataFlowServices.downloadPdf(urlPdfSticker.value).catch((error: any) => {
    console.error("Error al descargar el PDF:", error);
    openModalAlert("something_happened_try_later");
  });
}

function revertAssignmentRecord() {
  ActionServices.returnFiling(recordId.value)
    .then((response: any) => {
      openModalConfirmation("the_file_was_successfully_returned");
      dataFiling.dataModalConfirmation.dataButton.onClick = () => {
        router.push("/home/correspondence/received");
      };
    })
    .catch((error: any) => {
      console.error(error);
      openModalAlert(error.response.data.error.details[0]);
    });
}

function actionFile(action:string) {
  ActionServices.actionFile(dataFiling.data.id,action)
    .then((response: any) => {
      openModalConfirmation("the_file_was_successfully_returned");
      dataFiling.dataModalConfirmation.dataButton.onClick = () => {
        router.push("/home/correspondence/received");
      };
    })
    .catch((error: any) => {
      console.error(error);
      openModalAlert('sope');
    });
}

function openModalAction(action: any, idRecord: any) {
  //Modal
  let action1 = action.replace("continue", "decline");
  let responseAction = findUrlImageForOpenModalAction(action);
  console.log(responseAction);
  console.log(dataFiling.filings[0].documents[0].url);

  FilesServices.getDocumentContent(dataFiling.filings[0].documents[0].url)
    .then((response: any) => {
      dataFiling.dataModalAction.dataPdfViewer.urlPdf = response;
    })
    .catch((error) => {
      console.error(error);
    });
  dataFiling.dataModalAction.isActive = true;
  dataFiling.dataModalAction.title = action;
  dataFiling.dataModalAction.dataButtonAction1 = {
    className: "red",
    text: action1,
    alt: "decline",
    url: "/Buttons/decline.svg",
    iconSize: "short",
    disabled: false,
    reverse: false,
    fontSize: "",
    onClick: () => {
      actionFiling(action1, idRecord);
      resetModalAction();
    },
  };
  dataFiling.dataModalAction.dataButtonAction2 = {
    className: "blue",
    text: responseAction.text,
    alt: "accion",
    url: responseAction.url,
    disabled: false,
    reverse: true,
    fontSize: "",
    iconSize: responseAction.iconSize,
    onClick: () => {
      actionFiling(action, idRecord);
      resetModalAction();
    },
  };
}
function resetModalAction() {
  dataFiling.dataModalAction.isActive = false;
  dataFiling.dataModalAction.dataPdfViewer.urlPdf = "";
  dataFiling.dataModalAction.messageBox = false;
  dataFiling.dataModalAction.comments = "";
}
function actionFiling(action: string, id: any) {
  const formData = new FormData();
  formData.append("comments", dataFiling.dataModalAction.comments);
  ActionServices.actionFiling(id, action, formData)
    .then((response: any) => {
      openModalConfirmation("action_performed_succesfully");
    })
    .catch((error: any) => {});
}
function findUrlImageForOpenModalAction(action: any) {
  let url = "/Buttons/";
  let text = action;
  let iconSize = "";
  switch (action) {
    case "action_sign_assignment_quoue_continue":
      url += "icon-check.svg";
      break;
    case "action_approve_assignment_quoue_continue":
      url += "icon-aprove-filing.svg";
      iconSize = "large";
      break;
    case "action_review_assignment_quoue_continue":
      url += "icon-review.svg";
      text = "review";
      iconSize = "large";
      break;
    default:
      url = "";
      break;
  }
  let response = {
    url: url,
    text: text,
    iconSize: iconSize,
  };
  return response;
}
function setStatesBack() {}

function assignTrd() {
  const data: any = {
    serie: dataFiling.dataFormTrd.serie,
    subserie: dataFiling.dataFormTrd.subserie,
    documentary_type: dataFiling.dataFormTrd.documentary_type,
  };
  TrdServices.assignTRdToFiling(filing.data.filing_code, data)
    .then((response: any) => {
      openModalConfirmation("the_trd_was_correctly_assigned_to_the_file");
    })
    .catch((error: any) => {
      console.error(error);
      openModalAlert(error.error.details[0]);
    });
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

function openModalResponseFiling(data: any) {
  if (data.filings.length > 0) {
    if (data.filings[data.filings.length - 1].remitter != null) {
      if (!data.documents?.filings || data.documents?.filings.length === 0) {
        dataFiling.dataModalResponseFiling.stateViewPdf = false;
        dataFiling.dataModalResponseFiling.contentDocument =
          data.filings[data.filings.length - 1].description;
      } else {
        //This method and code couldbe like  FilingPage same name function openModalResponseFiling
        FilesServices.getDocumentContent(
          data.documents?.filings[data.documents?.filings.length - 1].document
        )
          .then((response: any) => {
            dataFiling.dataModalResponseFiling.stateViewPdf = true;
            dataFiling.dataModalResponseFiling.dataPdfViewer.urlPdf = response;
          })
          .catch((error: any) => {
            console.error(error);
          });
      }
      dataFiling.dataModalResponseFiling.idRemitter =
        data.filings[data.filings.length - 1].remitter.email;
      dataFiling.dataModalResponseFiling.isActive = true;
      dataFiling.dataModalResponseFiling.dataButtonBack.text = "back";
      dataFiling.dataModalResponseFiling.dataButtonNext.text = "continue";
    } else {
      openModalAlert("this_action_does_not_belong_to_this_type_of_filing");
    }
  } else {
    openModalAlert("no_filing_has_been_obtained");
  }
}

/**
 * TODO OPEN & CLOSE
 *
 */

function openModalListDocuments(documents: any[], index: number) {
  store.clearUploadedFiles();
  documents.map((value: any) => {
    dataFiling.dataModalListDocuments.onlyView = true;
    dataFiling.dataModalListDocuments.isActive = true;
    FilesServices.getDocumentContent(value.url)
      .then((response: any) => {
        const file = {
          name: value.name,
          url: response,
          remove: false,
        };
        store.addUploadedFile(file);
      })
      .catch((error: any) => {
        console.error(error);
      });
  });
}

function closeModalListDocuments() {
  store.clearUploadedFiles();
  dataFiling.dataModalListDocuments.isActive = false;
}

function openModalPdfListViewer(url: any) {
  dataFiling.dataModalPdfViewer.dataPdfViewer.urlPdf = url;
  dataFiling.dataModalPdfViewer.isActive = "show";
}

function openModalPdfViewer(url: any) {
  getDocumentContent(url, recordId.value);
  dataFiling.dataModalPdfViewer.isActive = "show";
}

function openModalAssignFiling() {
  dataFiling.dataModalAssignFiling.isActive = true;
}

function closeModalAssignFiling() {
  dataFiling.dataModalAssignFiling.isActive = false;
}

function openModalConfirmation(text: string): void {
  dataFiling.dataModalConfirmation.isActive = "show";
  dataFiling.dataModalConfirmation.dataText.text = text;
}

function closeModalConfirmation() {
  dataFiling.dataModalConfirmation.isActive = "hidde";
}

function openModalAlert(text: string): void {
  dataFiling.dataModalAlert.isActive = "show";
  dataFiling.dataModalAlert.dataText.text = text;
}

function closeModalAlert() {
  dataFiling.dataModalAlert.isActive = "hidde";
  setStatesBack();
}

/**
 * TODO VALIDATIONS
 *
 */

function validateOptionSelectActions() {
  /* dataFiling.dataSelectActions.options = [];
  let options: any = reactive([]);
  arrayActions.map((action) => options.push(action)); */
  dataFiling.dataSelectActions.options = [
    {
      label:'review',
      value:'answered'
  }, {
      label:'reject',
      value:'rejected'
  }
  ];
}

function validateSelect(key: any) {
  console.log(key);

  switch (key) {
    case "assign_user_record":
      openModalAssignFiling();
      break;
    case "add_record_outbound_filing":
      openModalAssignFiling();
      break;
    case "record_response_filing":
      openModalResponseFiling(recordData.value);
      break;
    case "revert_assignment_record":
      break;
    case "revert_assignment_record":
      revertAssignmentRecord();
      break;
    default:
      actionFile(key);

      break;
  }
}

function getFileFilingForm(index: any) {
  store.uploadedFiles[index].url != null &&
    store.uploadedFiles[index] != undefined &&
    openModalPdfListViewer(store.uploadedFiles[index].url);
}

/**
 * TODO REDIRECTS
 *
 */

function setstateView(
  documentsView: any,
  trazabilityView: any,
  recordView: any,
  trdView: any
) {
  dataFiling.stateViewDocuments = documentsView;
  dataFiling.stateViewTrazability = trazabilityView;
  dataFiling.stateViewRecord = recordView;
  dataFiling.stateViewTrd = trdView;
}

function redirectTrazability() {
  setstateView(false, true, false, false);
  changeColor(0);
}

function redirectRecord() {
  setstateView(false, false, true, false);
  changeColor(0);
}

function redirectDocuments() {
  setstateView(true, false, false, false);
  changeColor(0);
}

function redirectTrd() {
  setstateView(false, false, false, true);
  changeColor(0);
}

function changeColor(index: any) {
  let color: any = store.getColor()[index].template.filingNavegation;
  UtilsServices.changeColor(color);
}

function validateFormAssignFiling() {
  if (FormValidators.getValidationForm("modal-assign-filing__content")) {
    assignFiling();
  } else {
    dataFiling.dataModalAlert = {
      isActive: "show",
      dataText: {
        classText: "center",
        text: "all_inputs_empy",
        disabled: false,
        onClick: () => {},
      },
      dataButton: {
        className: "blue",
        text: "close",
        alt: "close",
        url: "/Buttons/decline.svg",
        iconSize: "short",
        reverse: false,
        disabled: false,
        onClick: () => {
          dataFiling.dataModalAlert.isActive = "hidde";
        },
      },
    };
  }
}

async function assignFiling() {
  //This function it's called by emits, review where get alls emits by component function emited setData by editor text atom.
  const formData = new FormData();
  formData.append("user_id", idUserAssign.value);
  formData.append("comments", dataFiling.dataModalAssignFiling.comments);
  dataFiling.dataModalAssignFiling.dataButtonSend.disabled = true;
  const response = await ActionServices.sendAssingData(
    recordId.value,
    formData
  );
  if (response.data.status_code == 400 || response.data.error) {
    dataFiling.dataModalAlert = {
      isActive: "show",
      dataText: {
        classText: "center",
        text: "an_error_has_occurred_please_try_again_later",
        disabled: false,
        onClick: () => {},
      },
      dataButton: {
        className: "blue",
        text: "close",
        alt: "close",
        url: "/Buttons/decline.svg",
        iconSize: "short",
        reverse: false,
        disabled: false,
        onClick: () => {
          dataFiling.dataModalAlert.isActive = "hidde";
        },
      },
    };
    dataFiling.dataModalAssignFiling.dataButtonSend.disabled = false;
  }
  if (response.data.status_code == 200 || response.data.response) {
    dataFiling.dataModalConfirmation = {
      isActive: "show",
      dataText: {
        classText: "",
        text: "the_filing_was_successfully_assigned",
        disabled: false,
        onClick: () => {},
      },
      dataButton: {
        className: "blue",
        text: "close",
        alt: "close",
        url: "/Buttons/decline.svg",
        iconSize: "short",
        reverse: true,
        disabled: false,
        onClick: () => {
          dataFiling.dataModalConfirmation.isActive = "hidde";
          dataFiling.dataModalAssignFiling.isActive = false;
          dataFiling.dataModalAssignFiling.dataButtonSend.disabled = false;
        },
      },
    };
  }
}

async function getParentDependences() {
  await DependenceServices.getParentDependences()
    .then(async (response: any) => {
      dataFiling.dataModalAssignFiling.dataSelectDependence.options =
        response.map((element: any) => {
          return {
            value: element.code,
            label: element.name,
          };
        });
    })
    .catch((error: any) => {
      console.error(error);
    });
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
    dataFiling.dataModalAssignFiling.dataSelectUser.options = arrayData;
    dataFiling.dataModalAssignFiling.dataSelectUser.disabled = false;
  } catch (error) {
    console.error(error, "error selectDependenceInputChange");
    dataFiling.dataModalAssignFiling.dataSelectUser.options = [];
    dataFiling.dataModalAssignFiling.dataSelectUser.disabled = true;
    idUserAssign.value = "";
  }
}

function getValidationFormActionUsers() {
  let ans = true;
  if (
    dataFiling.dataModalResponseFiling.dataSelectListActionUsers.usersSelecteds
      .length == 0
  ) {
    openModalAlert("at_least_one_user_must_be_selected");
    dataFiling.dataModalAlert.dataButton.onClick = () => {
      dataFiling.dataModalAlert.isActive = "hidde";
    };
    ans = false;
  } else if (!FormValidators.getValidationForm("table__row__cell")) {
    openModalAlert("all_inputs_empy");
    dataFiling.dataModalAlert.dataButton.onClick = () => {
      dataFiling.dataModalAlert.isActive = "hidde";
    };
    ans = false;
  }
  return ans;
}

function validateNavigationNextResponse() {
  switch (dataFiling.dataModalResponseFiling.stateViewFile) {
    case "step1":
      dataFiling.dataModalResponseFiling.stateViewFile = "step12";
      dataFiling.dataModalResponseFiling.dataButtonNext.text = "continue";
      dataFiling.dataModalResponseFiling.dataButtonNext.url =
        "/Buttons/right-arrow.svg";
      break;
    case "step12":
      if (getValidationFormActionUsers()) {
        dataFiling.dataModalResponseFiling.stateViewFile = "step123";
        dataFiling.dataModalResponseFiling.dataButtonNext.text = "continue";
        dataFiling.dataModalResponseFiling.dataButtonNext.url =
          "/Buttons/right-arrow.svg";
      }
      break;
    case "step123":
      if (FormValidators.getValidationForm("modal-response-filing__document")) {
        dataFiling.dataModalResponseFiling.stateViewFile = "step1234";
        dataFiling.dataModalResponseFiling.dataButtonNext.text = "continue";
        dataFiling.dataModalResponseFiling.dataButtonNext.url =
          "/Buttons/right-arrow.svg";
        dataFiling.dataModalResponseFiling.dataSelectListActionUsers
          .stateEditorText &&
          dataFiling.dataModalResponseFiling.dataDocumentCreator.setDataPage();
      }
      break;
    case "step1234":
      dataFiling.dataModalResponseFiling.dataButtonNext.text = "create_filing";
      dataFiling.dataModalResponseFiling.dataButtonNext.url = null;
      dataFiling.dataModalResponseFiling.dataButtonBack.text = "finalize";
      dataFiling.dataModalResponseFiling.dataButtonBack.url = null;
      responseFiling();
      break;
    default:
      break;
  }
}

function validateNavigationBackResponse() {
  switch (dataFiling.dataModalResponseFiling.stateViewFile) {
    case "step1":
      dataFiling.dataModalResponseFiling.isActive =
        !dataFiling.dataModalResponseFiling.isActive;
      dataFiling.dataModalResponseFiling.dataButtonNext.text = "continue";
      dataFiling.dataModalResponseFiling.dataButtonNext.url =
        "/Buttons/right-arrow.svg";
      dataFiling.dataModalResponseFiling.dataPdfViewer.urlPdf = "";
      break;
    case "step12":
      dataFiling.dataModalResponseFiling.stateViewFile = "step1";
      dataFiling.dataModalResponseFiling.dataButtonNext.text = "continue";
      dataFiling.dataModalResponseFiling.dataButtonNext.url =
        "/Buttons/right-arrow.svg";
      break;
    case "step123":
      dataFiling.dataModalResponseFiling.stateViewFile = "step12";
      dataFiling.dataModalResponseFiling.dataButtonNext.text = "continue";
      dataFiling.dataModalResponseFiling.dataButtonNext.url =
        "/Buttons/right-arrow.svg";
      break;
    case "step1234":
      dataFiling.dataModalResponseFiling.stateViewFile = "step123";
      dataFiling.dataModalResponseFiling.dataButtonNext.text = "continue";
      dataFiling.dataModalResponseFiling.dataButtonNext.url =
        "/Buttons/right-arrow.svg";
      break;
    case "step12345":
      dataFiling.dataModalResponseFiling.isActive =
        !dataFiling.dataModalResponseFiling.isActive;
      dataFiling.dataModalResponseFiling.stateViewFile = "step1";
      dataFiling.dataModalResponseFiling.dataButtonNext.text = "continue";
      dataFiling.dataModalResponseFiling.dataButtonNext.url =
        "/Buttons/right-arrow.svg";
      callServices();

      break;
    default:
      break;
  }
}

function responseFiling() {
  dataFiling.dataModalResponseFiling.stateLoadForm = true;
  const formData: any = new FormData();
  const usersReview: any[] =
    dataFiling.dataModalResponseFiling.dataSelectListActionUsers.usersSelecteds
      ?.filter((data: any) => data.action === "review")
      .map((data: any) => data.email);
  const usersAprove: any[] =
    dataFiling.dataModalResponseFiling.dataSelectListActionUsers.usersSelecteds
      ?.filter((data: any) => data.action === "aprove")
      .map((data: any) => data.email);
  const usersSign: any[] =
    dataFiling.dataModalResponseFiling.dataSelectListActionUsers.usersSelecteds
      ?.filter((data: any) => data.action === "sign")
      .map((data: any) => data.email);
  formData.append("type_of_filing", "2");
  formData.append("subject", dataFiling.dataModalResponseFiling.subject);
  formData.append(
    "type_response",
    dataFiling.dataModalResponseFiling.dataSelectListActionUsers.stateEditorText
      ? "001"
      : "002"
  ); // editor or pdf
  formData.append(
    "response_sent",
    !dataFiling.dataModalResponseFiling.dataSelectListActionUsers
      .stateEditorText
      ? dataFiling.dataModalResponseFiling.contentDocument
      : JSON.stringify(valueEditor.value)
  );
  formData.append("addressee", dataFiling.dataModalResponseFiling.idRemitter);

  dataFiling.dataModalResponseFiling.dataFormTrd.serie != "" &&
    dataFiling.dataModalResponseFiling.dataFormTrd.serie != null &&
    formData.append(
      "serie",
      dataFiling.dataModalResponseFiling.dataFormTrd.serie
    );
  dataFiling.dataModalResponseFiling.dataFormTrd.subserie != "" &&
    dataFiling.dataModalResponseFiling.dataFormTrd.subserie != null &&
    formData.append(
      "subserie",
      dataFiling.dataModalResponseFiling.dataFormTrd.subserie
    );
  dataFiling.dataModalResponseFiling.dataFormTrd.documentary_type != "" &&
    dataFiling.dataModalResponseFiling.dataFormTrd.documentary_type != null &&
    formData.append(
      "documentary_type",
      dataFiling.dataModalResponseFiling.dataFormTrd.documentary_type
    );

  usersReview.length > 0 &&
    formData.append("review_users", JSON.stringify(usersReview));
  usersAprove.length > 0 &&
    formData.append("approver_users ", JSON.stringify(usersAprove));
  usersSign.length > 0 &&
    formData.append("signer_users ", JSON.stringify(usersSign));

  ActionServices.responseFiling(recordId.value, formData)
    .then((response: any) => {
      dataFiling.dataModalResponseFiling.stateLoadForm = false;
      openModalConfirmation("the_filing_was_responsed_successfully");
      dataFiling.dataModalResponseFiling.stateViewFile = "step12345";

      dataFiling.dataModalResponseFiling.dataResumeFiling.url =
        response.data.response.filing_qr;
      dataFiling.dataModalResponseFiling.dataResumeFiling.subject =
        response.data.response.subject;
      dataFiling.dataModalResponseFiling.dataResumeFiling.filing_number =
        response.data.response.filing_code;
      dataFiling.dataModalResponseFiling.dataResumeFiling.creation_date =
        response.data.response.filing_date;
      dataFiling.dataModalResponseFiling.dataResumeFiling.email =
        response.data.response.addressee;
      dataFiling.dataModalResponseFiling.dataResumeFiling.response_mode =
        "Document";
      urlPdfCertificated.value = response.data.response.filing_certificate;
      urlPdfSticker.value = response.data.response.filing_sticker;
    })
    .catch((error: any) => {
      dataFiling.dataModalResponseFiling.stateLoadForm = false;
      console.error(error);
      /* 
                openModalAlert(error.response.data.error.details[0]); */
    });
}
</script>
<style scoped src="./Filing.page.scss"></style>
