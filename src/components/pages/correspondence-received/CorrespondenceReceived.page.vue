<!--
    TODO COMPONENT CORRESPONDENCE RECEIVED PAGE
    ? This component has all logic and develop of correspondence on only section 'received'.
-->

<template>
  <CorrespondenceReceivedTemplate
    :dataCorrespondenceReceived="dataCorrespondenceReceived"
    @codeFiling="getCodeFilingByMenu"
    @user="getUser"
    @fileFiling="getDocumentFiling"
    @emitDocSelected="getFileFilingForm"
    @filingSelectedMenu="getFilingSelected"
    @sendDataEditor="getValueEditor"
  />
</template>

<script setup lang="ts">

// Import vue libraries
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

// Import components
import CorrespondenceReceivedTemplate from "../../templates/correspondence-received/CorrespondenceReceived.template.vue";

// Import services
import UserServices from "../../../services/UserServices";
import TrdServices from "../../../services/TrdServices";
import DataFlowServices from "../../../services/DataFlowServices";
import { accessStore } from "../../../store";
import FilingServices from "../../../services/FilingServices";
import ActionServices from "../../../services/ActionServices";
import RecordsServices from "../../../services/RecordsServices";
import FilesServices from "../../../services/FilesServices";
import FormValidators from "../../../validators/FormValidators";
// import DependenceServices from "../../../services/DependenceServices";
import UtilsServices from "../../../services/UtilsServices";

// Define props and emits and configuration
const router = useRouter();
const store: any = accessStore();
const { t } = useI18n();

// VARIABLES OR STATES
/*
 * TODO HERE DEFINE VALUES DEFAULT
 */

const valueEditor: any = ref();
const filing_code_filing: any = ref(""); //State for be used globaly - selected code filing  by list menu table filings
const url_pdf: any = ref(""); //State for be user globaly
const ref_pdf: any = ref(""); //State for be user globaly
const filesArrayFilingForm = ref(store.uploadedFiles);
const fileFilingForm: any = ref(null);
const fileReaderBase64: any = ref(null);
const dataListRad: any = ref("");
const idRecord: any = ref(""); //State for be used globaly - selected code filing  by functions modal assignated - review
const urlPdfSticker: any = ref("");
const urlPdfCertificated: any = ref("");
const idUser: any = ref("");
let formData: FormData = new FormData(); //Formdata used for be send to endpoits

const dataCorrespondenceReceived: any = reactive({
  adviceClasification : {
    stateResponse:false
  },
  //Structure of all components data
  id_remitter: "id_remitter",
  state: false, //First state for show first view (tables filings) 'boolean'-------------------------------------------------
  stateViewFile: "", // Steps  :  step1, step12, step123, step1234 for see each view but state must be  state =  boolean;
  stateCreateRemmiter: true,
  stateCreatedFilin: true, // Todo: Could be not used ---------------------------------------
  stateViewFileAnonimous: false,
  stateResponseFiling: false, // Todo: Could be not used ---------------------------------------
  extraButtons: [
    {
      className: "blue",
      text: "assign",
      alt: "assign",
      url: "/Buttons/icon-assign.svg",
      reverse: true,
      disabled: false,
      iconSize: "large",
      onClick: () => { openModalAssignFiling(); }
    }
  ],
  dataCreateRemitterForm: {
    form: {
      name: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      second_last_name: "",
      identification_type: "",
      identification_number: "",
      contact_name: "",
      social_reason: "",
      nit_number: "",
      personType: "",
      country: "",
      department: "",
      city: "",
      address: "",
      phone_number: "",
      email: "",
    },
  },
  dataButtonNewFile: {
    className: "blue",
    text: "new",
    alt: "new",
    url: "/Buttons/icon-add.svg",
    reverse: true,
    disabled: false,
    onClick: () => {
      redirectNeWFiling();
    },
  },
  dataButtonToSearchRemitter: {
    className: "blue",
    text: "filing_new",
    disabled: false,
    onClick: () => {
      redirectNeWFiling();
    },
  },
  dataButtonRedirectToSearchRemitter: {
    className: "gray-blue",
    text: "find_addresser",
    disabled: false,
    onClick: () => {
      dataCorrespondenceReceived.stateViewFile = "step12";
    },
  },
  dataButtonRedirectToCreateRemitter: {
    className: "gray-mouse-blue",
    text: "create_addresser",
    disabled: false,
    onClick: () => {
      assignButtonNextData("continue", "/Buttons/right-arrow.svg", "step123");
    },
  },
  dataButtonRedirectToCreateFileAnonimous: {
    className: "gray-blue",
    text: "anonymous_filing",
    disabled: false,
    onClick: () => {
      redirectNeWFilingAnonimous();
    },
  },
  dataImgGoToBack: {
    id: "",
    name: "back",
    class: "icon-back",
    src: "/arrow-left.svg",
    type: "svg",
    alt: "",
    isActive: () => {}, // optional, currently used to add activate and deactivate the active class
    onClick: () => {
      validateNavegationImgBack();
    },
  },
  dataButtonGoToNext: {
    className: "blue",
    text: "continue",
    alt: "continue",
    url: "/Buttons/right-arrow.svg",
    disabled: false,
    reverse: true,
    fontSize: "",
    onClick: () => {
      validateNavegationButtonNext();
    },
  },
  dataButtonGoToBack: {
    className: "gray",
    text: "back",
    alt: "left-arrow",
    url: "/Buttons/left-arrow.svg",
    disabled: false,
    reverse: false,
    fontSize: "",
    onClick: () => {
      validateNavegationButtonBack();
    },
  },
  dataModalPdfViewer: {
    isActive: "",
    dataPdfViewer: {
      urlPdf: url_pdf,
      toolbar: { toolbar: false },
      onClose: () => {},
    },
  },
  dataTableRemitters: {
    data: [],
    dataButton: {
      className: "blue",
      text: "new",
      alt: "new",
      url: "/Buttons/icon-add.svg",
      reverse: true,
      disabled: false,
      onClick: () => {
        redirectCreateRemitter();
      },
    },
    dataInputSearch: {
      dataInput: {
        id: "",
        name: "",
        classInputEmail: "",
        model: "",
        type: "",
        placeholder: "search_remitters",
        disabled: false,
        onClick: () => {},
      },
      dataImg: {
        id: "",
        name: "",
        class: " icon",
        src: "/icon-lupa-general.svg",
        type: "",
        alt: "",
        onClick: () => {},
      },
    },
  },
  dataModalConfirmation: {
    isActive: "",
    dataText: {
      classText: "",
      text: "",
      disabled: false,
      onClick: () => {},
    },
    dataButton: {
      className: "blue",
      text: "close",
      alt: "close",
      url: "/Buttons/decline.svg",
      reverse: true,
      disabled: false,
      iconSize: "short",
      onClick: () => {
        closeModalConfirmation();
      },
    },
  },
  dataModalAlert: {
    isActive: "",
    dataButton: {
      className: "blue",
      text: "close",
      alt: "close",
      url: "/Buttons/decline.svg",
      iconSize: "short",
      reverse: false,
      disabled: false,
      onClick: () => { dataCorrespondenceReceived.dataModalAlert.isActive = '';},
    },
    dataText: {
      classText: "",
      text: "this_is_the_description",
      disabled: false,
      onClick: () => {},
    },
  },
  dataCreatedFilin: {
    dataImgQR: {
      id: "",
      name: "",
      class: "",
      src: "",
      type: "png",
      alt: "",
      onClick: () => {},
    },
    filing_code: "",
    filing_date: " ",
    remitter: "",
    type_of_filing: "",
    subject: "",
  },
  dataFilingFlow: {
    stateResponseFiling: false, // = true for see view response filing final step.
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
          dataCorrespondenceReceived.dataFilingFlow.dataInputFiles.dataModalListDocuments.isActive =
            false;
        },
      },
      openModalDocs: () => {
        dataCorrespondenceReceived.dataFilingFlow.dataInputFiles.dataModalListDocuments.isActive =
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
      reverser: false,
      disabled: false,
      onClick: () => {
        closeModalAssignFiling();
      },
    },
    dataButtonSend: {
      className: "blue",
      text: "assign",
      alt: "assign",
      url: "/Buttons/icon-assign.svg",
      reverse: true,
      disabled: false,
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
      onClick: () => {},
      placeholder: "select_dependency",
      model: "",
      options: [],
    },
    dataSelectUser: {
      id: "",
      name: "userUser",
      className: "",
      disabled: true, //disabled temporaly
      onChange: (data: any) => {
        idUser.value = data.target.value;
      },
      onClick: () => {},
      placeholder: "select_user",
      model: "",
      options: [],
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
        dataCorrespondenceReceived.dataModalResponseFiling.isActive =
          !dataCorrespondenceReceived.dataModalResponseFiling.isActive;
        dataCorrespondenceReceived.dataModalResponseFiling.stateViewFile =
          "step1";
        dataCorrespondenceReceived.dataModalResponseFiling.dataButtonBack.url =
          "/Buttons/left-arrow.svg";
        dataCorrespondenceReceived.dataModalResponseFiling.dataPdfViewer.urlPdf =
          "";
        resetModalResponseFiling();
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
  dataFormTrd: {
    serie: "",
    subserie: "",
    documentary_type: "",
  },
  dataTableCorrespondenceReceived: {
    stateLoadData: true,
    validateSubmenu: false,
    data: [],
    dataInputSearch: {
      dataInput: {
        id: "",
        name: "",
        classInputEmail: "",
        model: "",
        type: "text",
        placeholder: "search_filing",
        disabled: false,
        required: false,
        onClick: () => {},
        onChange: (value: any) => {
          searchFilingsList(value, 1);
        },
      },
      dataImg: {
        id: "",
        name: "",
        class: " icon",
        src: "/icon-lupa-general.svg",
        type: "",
        alt: "",
        onClick: () => {},
      },
    },
    dataTooltipIcons: [
      { //Assign user record action
        text: UtilsServices.capitalizeFirstLetter(`${t("assign_user_record")}`),
        src: '/Buttons/icon-assign.svg',
        color: 'blue',
        alt: 'assign',
        show: ({data = [] as any[]}) => { return data.includes('assign_user_record') },
        onClick: ({data = {}}) => { dataCorrespondenceReceived.dataTableCorrespondenceReceived.actionsMenu('assign_user_record', data) },
      },
      { //Record response filing action
        text: UtilsServices.capitalizeFirstLetter(`${t("record_response_filing")}`),
        src: '/Buttons/icon-send.svg',
        color: 'blue',
        alt: 'response',
        show: ({data = [] as any[]}) => { return data.includes('record_response_filing') },
        onClick: ({data = {}as any}) => { 
          getFilingSelected(data.filings[data.filings.length - 1]);
          getCodeFilingByMenu(data.filings[data.filings.length - 1].filing_code);
          dataCorrespondenceReceived.dataTableCorrespondenceReceived.actionsMenu('record_response_filing', data) 
        },
      },
      { //Revert assignment record action
        text: UtilsServices.capitalizeFirstLetter(`${t("revert_assignment_record")}`),
        src: '/Buttons/icon-refresh.svg',
        color: 'blue',
        alt: 'revert',
        show: ({data = [] as any[]}) => { return data.includes('revert_assignment_record') },
        onClick: ({data = {}}) => { dataCorrespondenceReceived.dataTableCorrespondenceReceived.actionsMenu('revert_assignment_record', data) },
      },
      { // Aprove record action
        text: UtilsServices.capitalizeFirstLetter(`${t("action_approve_assignment_quoue_continue")}`),
        src: '/Buttons/icon-aprove-filing.svg',
        color: 'blue',
        alt: 'aprove',
        show: ({data = [] as any[]}) => { return data.includes('action_approve_assignment_quoue_continue') },
        onClick: ({data = {}}) => { dataCorrespondenceReceived.dataTableCorrespondenceReceived.actionsMenu('action_approve_assignment_quoue_continue', data) },
      },
      { // Review record action
        text: UtilsServices.capitalizeFirstLetter(`${t("action_review_assignment_quoue_continue")}`),
        src: '/Buttons/icon-review.svg',
        color: 'blue',
        alt: 'review',
        show: ({data = [] as any[]}) => { return data.includes('action_review_assignment_quoue_continue') },
        onClick: ({data = {}}) => { dataCorrespondenceReceived.dataTableCorrespondenceReceived.actionsMenu('action_review_assignment_quoue_continue', data) },
      },
      { // Sign record action
        text: UtilsServices.capitalizeFirstLetter(`${t("action_sign_assignment_quoue_continue")}`),
        src: '/Buttons/icon-check.svg',
        color: 'blue',
        alt: 'sign',
        show: ({data = [] as any[]}) => { return data.includes('action_sign_assignment_quoue_continue') },
        onClick: ({data = {}}) => { dataCorrespondenceReceived.dataTableCorrespondenceReceived.actionsMenu('action_sign_assignment_quoue_continue', data) },
      },
    ],
    actionsMenu: (action: any, record: any) => {
      idRecord.value = record.id;
      validateActionToFiling(action, record);
    },
    openFiling: () => {},
  },
  dataPaginator: {
    page: 1,
    page_size: 10,
    total_pages: "",
    pagination_options: [
      {
        number: 10,
        active: false,
      },
      {
        number: 20,
        active: false,
      },
      {
        number: 30,
        active: false,
      },
      {
        number: 50,
        active: false,
      },
    ],
    getService: (value: any) => {
      searchFilingsList(
        dataCorrespondenceReceived.dataTableCorrespondenceReceived
          .dataInputSearch.dataInput.model,
        value
      );
    },
   
  },
  redirectToSearchRemitter: () => {
    dataCorrespondenceReceived.stateViewFile = "step12";
  },
  redirectToCreateRemitter: () => {
    assignButtonNextData("continue", "/Buttons/right-arrow.svg", "step123");
  },
  redirectToCreateFileAnonimous: () => {},
   dataModalResponseFile:{
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
    }
});

/**
 * todo METHODS
 *
 * ?LIFE CICLES
 */

// Ciclos de vida del componente
onBeforeMount(() => {});

onMounted(() => {
  callServices();
  // getDataIdentificationTypes();
});

watch(() => dataCorrespondenceReceived.dataPaginator.page_size, () => {
  searchFilingsList(dataCorrespondenceReceived.dataTableCorrespondenceReceived.dataInputSearch.dataInput.model, 1);
});

onBeforeUpdate(() => {});

onUpdated(() => {});

onBeforeUnmount(() => {});

onUnmounted(() => {});

watch(store.uploadedFiles, (newFiles: any, oldFiles) => {
  filesArrayFilingForm.value = [...newFiles];
  dataCorrespondenceReceived.dataFilingFlow.dataInputFiles.counterFiles =
    filesArrayFilingForm.value.length;
});

/**
 * TODO FUNCTIONS SET AND GET
 */

function callServices() {
  searchFilingsList("", 1); //Call function for get all filings exist on data base.
  // getParentDependences();
  // addCurrentUserToActionsModal();
}















function closeResponseModal() {
  dataCorrespondenceReceived.dataModalResponseFile.isActive = false;
}


function validateButtonContinue() {
  switch (dataCorrespondenceReceived.dataModalResponseFile.stateView) {
    case "step1":
      if (dataCorrespondenceReceived.dataModalResponseFile.isFirstSection == false) {
        console.log(
          "dataCorrespondenceReceived.dataModalResponseFile.shippingMode",
          dataCorrespondenceReceived.dataModalResponseFile.shippingMode
        );
        switch (dataCorrespondenceReceived.dataModalResponseFile.howContinue) {
          case "reply":
            if (dataCorrespondenceReceived.dataModalResponseFile.shippingMode == "") {
              //Capture error if in case
              openModalAlert("choose_mode");
              FormValidators.getValidationForm(
                "modal-response-file__wrapper__content__address"
              );
            } else if (
              dataCorrespondenceReceived.dataModalResponseFile.dataSelectListActionUsers.usersSelecteds
                .length == 0
            ) {
              openModalAlert("choose_users");
            } else if (
              dataCorrespondenceReceived.dataModalResponseFile.shippingMode == "othersandme" &&
              !hasCurrentUserAndOthersWithAction(
                dataCorrespondenceReceived.dataModalResponseFile.dataSelectListActionUsers.usersSelecteds
              )
            ) {
              openModalAlert("choose_users");
            } else {
              dataCorrespondenceReceived.dataModalResponseFile.stateView = "step12";
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
      dataCorrespondenceReceived.dataModalResponseFile.isFirstSection = false;
      break;
    case "step12":
      if (
        !dataCorrespondenceReceived.dataModalResponseFile.dataSelectListActionUsers.stateEditorText &&
        store.uploadedFiles.length == 0
      ) {
        openModalAlert("upload_file");
        return;
      }
      if (dataCorrespondenceReceived.dataModalResponseFile.isTrdView == true) {
        dataCorrespondenceReceived.dataModalResponseFile.stateView = "step123";
      }
      dataCorrespondenceReceived.dataModalResponseFile.isTrdView = true;
      scrollToSection("trd-form-component");
      break;

    case "step123":
      break;

    default:
      break;
  }
}
function validateButtonBack() {
  console.log(dataCorrespondenceReceived.dataModalResponseFile.stateView);
  switch (dataCorrespondenceReceived.dataModalResponseFile.stateView) {
    case "step1":
      closeResponseModal();
      break;
    case "step12":
      console.log("step2");

      dataCorrespondenceReceived.dataModalResponseFile.stateView = "step1";
      break;
    case "step123":
      dataCorrespondenceReceived.dataModalResponseFile.isActive = false;
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
async function selectDependenceInputChangeResponseFile(data: any) {
  /* const arrayData: any = [];
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
    dataCorrespondenceReceived.dataModalResponseFile.assign.dataSelectUser.options =
      arrayData;
    dataCorrespondenceReceived.dataModalResponseFile.assign.dataSelectUser.disabled =
      false;
  } catch (error) {
    console.error(error, "error selectDependenceInputChange");
    dataCorrespondenceReceived.dataModalResponseFile.assign.dataSelectUser.options =
      [];
    dataCorrespondenceReceived.dataModalResponseFile.assign.dataSelectUser.disabled =
      true;
  } */
}











function setFirstViewTablesFilings() {
  assignButtonNextData("continue", "/Buttons/right-arrow.svg", "step1");
  dataCorrespondenceReceived.state = false;

  //Todo: Put all state or validations for hidde and just show the first view
  dataCorrespondenceReceived.dataFilingFlow.stateResponseFiling = false;
  dataCorrespondenceReceived.dataFilingFlow.stateViewFileAnonimous = false;
}

function validateNavigationNextResponse() {
  switch (dataCorrespondenceReceived.dataModalResponseFiling.stateViewFile) {
    case "step1":
      dataCorrespondenceReceived.dataModalResponseFiling.stateViewFile =
        "step12";
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.text =
        "continue";
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.url =
        "/Buttons/right-arrow.svg";
      break;
    case "step12":
      if (getValidationFormActionUsers()) {
        dataCorrespondenceReceived.dataModalResponseFiling.stateViewFile =
          "step123";
        dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.text =
          "continue";
        dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.url =
          "/Buttons/right-arrow.svg";
      }
      break;
    case "step123":
      if (FormValidators.getValidationForm("modal-response-filing__document")) {
        dataCorrespondenceReceived.dataModalResponseFiling.stateViewFile =
          "step1234";
        dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.text =
          "continue";
        dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.url =
          "/Buttons/right-arrow.svg";
        dataCorrespondenceReceived.dataModalResponseFiling
          .dataSelectListActionUsers.stateEditorText &&
          dataCorrespondenceReceived.dataModalResponseFiling.dataDocumentCreator.setDataPage();
      }
      break;
    case "step1234":
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.text =
        "create_filing";
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.url =
        null;
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonBack.text =
        "finalize";
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonBack.url =
        null;
      responseFiling();
      break;
    default:
      break;
  }
}

function getValidationFormActionUsers() {
  let ans = true;
  if (
    dataCorrespondenceReceived.dataModalResponseFiling.dataSelectListActionUsers
      .usersSelecteds.length == 0
  ) {
    openModalAlert("at_least_one_user_must_be_selected");
    dataCorrespondenceReceived.dataModalAlert.dataButton.onClick = () => {
      dataCorrespondenceReceived.dataModalAlert.isActive = "hidde";
    };
    ans = false;
  } else if (!FormValidators.getValidationForm("table__row__cell")) {
    openModalAlert("all_inputs_empy");
    dataCorrespondenceReceived.dataModalAlert.dataButton.onClick = () => {
      dataCorrespondenceReceived.dataModalAlert.isActive = "hidde";
    };
    ans = false;
  }
  return ans;
}

function validateNavigationBackResponse() {
  switch (dataCorrespondenceReceived.dataModalResponseFiling.stateViewFile) {
    case "step1":
      dataCorrespondenceReceived.dataModalResponseFiling.isActive =
        !dataCorrespondenceReceived.dataModalResponseFiling.isActive;
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.text =
        "continue";
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.url =
        "/Buttons/right-arrow.svg";
      dataCorrespondenceReceived.dataModalResponseFiling.dataPdfViewer.urlPdf =
        "";
      resetModalResponseFiling();
      break;
    case "step12":
      dataCorrespondenceReceived.dataModalResponseFiling.stateViewFile =
        "step1";
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.text =
        "continue";
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.url =
        "/Buttons/right-arrow.svg";
      break;
    case "step123":
      dataCorrespondenceReceived.dataModalResponseFiling.stateViewFile =
        "step12";
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.text =
        "continue";
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.url =
        "/Buttons/right-arrow.svg";
      break;
    case "step1234":
      dataCorrespondenceReceived.dataModalResponseFiling.stateViewFile =
        "step123";
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.text =
        "continue";
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.url =
        "/Buttons/right-arrow.svg";
      break;
    case "step12345":
      dataCorrespondenceReceived.dataModalResponseFiling.isActive =
        !dataCorrespondenceReceived.dataModalResponseFiling.isActive;
      dataCorrespondenceReceived.dataModalResponseFiling.stateViewFile =
        "step1";
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.text =
        "continue";
      dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.url =
        "/Buttons/right-arrow.svg";
      callServices();

      break;
    default:
      break;
  }
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

function responseFiling() {
  dataCorrespondenceReceived.dataModalResponseFiling.stateLoadForm = true;
  const formData: any = new FormData();
  const usersReview: any[] =
    dataCorrespondenceReceived.dataModalResponseFiling.dataSelectListActionUsers.usersSelecteds
      ?.filter((data: any) => data.action === "review")
      .map((data: any) => data.email);
  const usersAprove: any[] =
    dataCorrespondenceReceived.dataModalResponseFiling.dataSelectListActionUsers.usersSelecteds
      ?.filter((data: any) => data.action === "aprove")
      .map((data: any) => data.email);
  const usersSign: any[] =
    dataCorrespondenceReceived.dataModalResponseFiling.dataSelectListActionUsers.usersSelecteds
      ?.filter((data: any) => data.action === "sign")
      .map((data: any) => data.email);
  formData.append("type_of_filing", "2");
  formData.append(
    "subject",
    dataCorrespondenceReceived.dataModalResponseFiling.subject
  );
  formData.append(
    "type_response",
    dataCorrespondenceReceived.dataModalResponseFiling.dataSelectListActionUsers
      .stateEditorText
      ? "001"
      : "002"
  ); // editor or pdf
  formData.append(
    "response_sent",
      !dataCorrespondenceReceived.dataModalResponseFiling.dataSelectListActionUsers
        .stateEditorText
      ? dataCorrespondenceReceived.dataModalResponseFiling.contentDocument
      : JSON.stringify(valueEditor.value)
  );
  formData.append(
    "addressee",
    dataCorrespondenceReceived.dataModalResponseFiling.idRemitter
  );

  dataCorrespondenceReceived.dataModalResponseFiling.dataFormTrd.serie != "" &&
    dataCorrespondenceReceived.dataModalResponseFiling.dataFormTrd.serie !=
      null &&
    formData.append(
      "serie",
      dataCorrespondenceReceived.dataModalResponseFiling.dataFormTrd.serie
    );
  dataCorrespondenceReceived.dataModalResponseFiling.dataFormTrd.subserie !=
    "" &&
    dataCorrespondenceReceived.dataModalResponseFiling.dataFormTrd.subserie !=
      null &&
    formData.append(
      "subserie",
      dataCorrespondenceReceived.dataModalResponseFiling.dataFormTrd.subserie
    );
  dataCorrespondenceReceived.dataModalResponseFiling.dataFormTrd
    .documentary_type != "" &&
    dataCorrespondenceReceived.dataModalResponseFiling.dataFormTrd
      .documentary_type != null &&
    formData.append(
      "documentary_type",
      dataCorrespondenceReceived.dataModalResponseFiling.dataFormTrd
        .documentary_type
    );

  usersReview.length > 0 &&
    formData.append("review_users", JSON.stringify(usersReview));
  usersAprove.length > 0 &&
    formData.append("approver_users ", JSON.stringify(usersAprove));
  usersSign.length > 0 &&
    formData.append("signer_users ", JSON.stringify(usersSign));

  ActionServices.responseFiling(idRecord.value, formData)
    .then((response: any) => {
      dataCorrespondenceReceived.dataModalResponseFiling.stateLoadForm = false;
      openModalConfirmation("the_filing_was_responsed_successfully");
      dataCorrespondenceReceived.dataModalResponseFiling.stateViewFile =
        "step12345";

      dataCorrespondenceReceived.dataModalResponseFiling.dataResumeFiling.url =
        response.data.response.filing_qr;
      dataCorrespondenceReceived.dataModalResponseFiling.dataResumeFiling.subject =
        response.data.response.subject;
      dataCorrespondenceReceived.dataModalResponseFiling.dataResumeFiling.filing_number =
        response.data.response.filing_code;
      dataCorrespondenceReceived.dataModalResponseFiling.dataResumeFiling.creation_date =
        response.data.response.filing_date;
      dataCorrespondenceReceived.dataModalResponseFiling.dataResumeFiling.email =
        response.data.response.addressee;
      dataCorrespondenceReceived.dataModalResponseFiling.dataResumeFiling.response_mode =
        "Document";
      urlPdfCertificated.value = response.data.response.filing_certificate;
      urlPdfSticker.value = response.data.response.filing_sticker;
    })
    .catch((error: any) => {
      dataCorrespondenceReceived.dataModalResponseFiling.stateLoadForm = false;
      console.error(error);
      /* 
                openModalAlert(error.response.data.error.details[0]); */
    });
}

async function selectDependenceInputChange(data: any) {
 /*  const arrayData: any = [];
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
    dataCorrespondenceReceived.dataModalAssignFiling.dataSelectUser.options =
      arrayData;
    dataCorrespondenceReceived.dataModalAssignFiling.dataSelectUser.disabled =
      false;
  } catch (error) {
    console.error(error, "error selectDependenceInputChange");
    dataCorrespondenceReceived.dataModalAssignFiling.dataSelectUser.options =
      [];
    dataCorrespondenceReceived.dataModalAssignFiling.dataSelectUser.disabled =
      true;
    idUser.value = "";
  } */
}

async function assignFiling() {
  //This function it's called by emits, review where get alls emits by component function emited setData by editor text atom.
  const formData = new FormData();
  formData.append("user_id", idUser.value);
  formData.append(
    "comments",
    dataCorrespondenceReceived.dataModalAssignFiling.comments
  );
  dataCorrespondenceReceived.dataModalAssignFiling.dataButtonSend.disabled =
    true;
  const response = await ActionServices.sendAssingData(
    idRecord.value,
    formData
  );
  if (response.data.status_code == 400 || response.data.error) {
    dataCorrespondenceReceived.dataModalAlert = {
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
          dataCorrespondenceReceived.dataModalAlert.isActive = "hidde";
        },
      },
    };
    dataCorrespondenceReceived.dataModalAssignFiling.dataButtonSend.disabled =
      false;
  }
  if (response.data.status_code == 200 || response.data.response) {
    dataCorrespondenceReceived.dataModalConfirmation = {
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
          dataCorrespondenceReceived.dataModalConfirmation.isActive = "hidde";
          dataCorrespondenceReceived.dataModalAssignFiling.isActive = false;
          dataCorrespondenceReceived.dataModalAssignFiling.dataButtonSend.disabled =
            false;
          setFirstViewTablesFilings();
          searchFilingsList("", 1);
        },
      },
    };
  }
  resetModalAssignFiling();
  setFirstViewTablesFilings();
}

function downloadFilingPdfCertificated() {
  DataFlowServices.downloadPdf(urlPdfCertificated.value)
    .catch((error: any) => {
      console.error('Error al descargar el PDF:', error);
      openModalAlert("something_happened_try_later");
    });
}

function downloadFilingPdfSticker() {
  DataFlowServices.downloadPdf(urlPdfSticker.value)
    .catch((error: any) => {
      console.error('Error al descargar el PDF:', error);
      openModalAlert("something_happened_try_later");
    });
}

async function getParentDependences() {
  /* await DependenceServices.getParentDependences()
    .then(async (response: any) => {
      dataCorrespondenceReceived.dataModalAssignFiling.dataSelectDependence.options = 
        response.map((element: any) => { 
          return {
            value: element.code,
            label: element.name
        }});
    })
    .catch((error: any) => {
      console.error(error)
    }); */
}

function getFilingSelected(data: any) {
  if (data.remitter) {
    dataCorrespondenceReceived.dataModalResponseFiling.idRemitter =
      data.remitter.email;
  } else {
    dataCorrespondenceReceived.dataModalResponseFiling.idRemitter =
      store.getEmailUser();
  }
}

function getFileFilingForm(index: any) {
  fileFilingForm.value = index;

  const reader = new FileReader();
  reader.readAsDataURL(filesArrayFilingForm.value[index]);
  reader.onload = () => {
    const base64String = reader.result as string;
    openModalPdfViewer(base64String);
  };
}

function getDocumentFiling(file: any) {
  console.log('ARCHIVO!!!!!',file);
  console.log('TIENDA!!!!!!',store.uploadedFiles);
  
  formData.append("document", file);
}

async function addCurrentUserToActionsModal() {
  /* UserServices.getUserLogged()
    .then((response: any) => {
      dataCorrespondenceReceived.dataModalResponseFiling.dataSelectListActionUsers.usersSelecteds[0] =
        {
          name: response.first_name,
          email: response.email,
          dependence: response.dependence?.name || null,
          action: "no_action",
          is_current_user: true,
        };
    })
    .catch((error) => {
      dataCorrespondenceReceived.dataModalResponseFiling.dataSelectListActionUsers.usersSelecteds =
        [];
    }); */
}

function getUser(user: any) {
  dataCorrespondenceReceived.id_remitter = user;
  console.log(  dataCorrespondenceReceived.id_remitter);
  console.log(  user);
  
  assignButtonNextData("create_filing", "/Buttons/right-arrow.svg", "step1234");
}

async function searchFilingsList(searched_value: any, page: any) {
  dataCorrespondenceReceived.dataTableCorrespondenceReceived.data = [];
  dataCorrespondenceReceived.dataTableCorrespondenceReceived.stateLoadData =
    true;
  RecordsServices.getAllFiles(searched_value, page, dataCorrespondenceReceived.dataPaginator.page_size)
    .then((response: any) => {
      console.log(response);
      
      dataCorrespondenceReceived.dataPaginator.page = page;
      dataCorrespondenceReceived.dataPaginator.total_pages =
        response.total_pages;
      dataCorrespondenceReceived.dataTableCorrespondenceReceived.stateLoadData =
        false;
      if (response.results.length > 0) {
      console.log(response);
        dataCorrespondenceReceived.dataTableCorrespondenceReceived.data =
          response.results.map((data: any) => ({
            ...data,
            isMenuOpen: false,
          }));
      console.log(dataCorrespondenceReceived.dataTableCorrespondenceReceived.data);
      }
    })
    .catch((error: any) => {
      dataCorrespondenceReceived.dataTableCorrespondenceReceived.stateLoadData =
        false;
      console.error("Error fetching data:", error);
    });
}

/**
 * TODO FUNCTIONS SEND
 */

async function sendDataCreateRemitter() {
  const data: any = {};
  if (getValidationForm("create-remitter-form__content__form")) {
    dataCorrespondenceReceived.stateCreateRemmiter = false;
      Object.assign(data, {
        name:
          dataCorrespondenceReceived.dataCreateRemitterForm.form.name,
      });

      Object.assign(data, {
        email: dataCorrespondenceReceived.dataCreateRemitterForm.form.email,
      });

    UserServices.createRemitter(data)
      .then((response: any) => {
          console.log(response);
          
        dataCorrespondenceReceived.id_remitter = response.email;
        resetRemitterForm();
        dataCorrespondenceReceived.dataModalConfirmation = {
          isActive: "show",
          dataText: {
            classText: "big",
            text: "the_remitter_was_created",
            disabled: false,
            onClick: () => {},
          },
          dataButton: {
            className: "blue",
            text: "continue",
            alt: "continue",
            url: "/Buttons/right-arrow.svg",
            reverse: true,
            disabled: false,
            onClick: () => {
              dataCorrespondenceReceived.dataModalConfirmation.isActive =
                "hidde";
              assignButtonNextData(
                "create_filing",
                "/Buttons/right-arrow.svg",
                "step1234"
              );
            },
          },
        };
        dataCorrespondenceReceived.stateCreateRemmiter = true;
      })
      .catch((error) => {
        dataCorrespondenceReceived.dataModalConfirmation.isActive = "hidde";
        console.error(error,'error');
        dataCorrespondenceReceived.dataModalAlert = {
          isActive: "show",
          dataText: {
            classText: "center",
            text:
              "an_error_has_occurred_please_try_again_later",
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
              dataCorrespondenceReceived.dataModalAlert.isActive = "hidde";
            },
          },
        };
      });
  } else {
    dataCorrespondenceReceived.dataModalAlert = {
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
          dataCorrespondenceReceived.dataModalAlert.isActive = "hidde";
        },
      },
    };
  }
}

async function sendDataCreateFiling() {
  console.log(store.uploadedFiles,'store.uploadedFiles 1');

  if (getValidationForm("filing__container__create-filing__form")) {
    console.log(store.uploadedFiles,'store.uploadedFiles 2');
    dataCorrespondenceReceived.dataFilingFlow.stateCreatedFilin = false;
      
      formData.append(
        "subject",
        dataCorrespondenceReceived.dataFilingFlow.dataFormFiling.subject
      );
      
      
      
      formData.append("user_asigned", dataCorrespondenceReceived.id_remitter);
      
      

      store.uploadedFiles.forEach((file: any) => {
        formData.append("document", file);
      });
      console.log(store.uploadedFiles,'store.uploadedFiles 2.1');
      FilingServices.createFiling(formData)
        .then((response: any) => {
          console.log(store.uploadedFiles,'store.uploadedFiles 14');
          filing_code_filing.value = response.filing_code; //Must be encapsulated for be used globaly on this component and be used
          idRecord.value = response.record_id;
          urlPdfCertificated.value = response.filing_certificate;
          urlPdfSticker.value = response.filing_sticker;
          dataCorrespondenceReceived.dataModalConfirmation = {
            isActive: "show",
            dataText: {
              classText: "big",
              text: "the_filing_was_successfully_created",
              disabled: false,
              onClick: () => {},
            },
            dataButton: {
              className: "blue",
              text: "continue",
              alt: "continue",
              url: "/Buttons/right-arrow.svg",
              reverse: true,
              disabled: false,
              onClick: () => {
                console.log(store.uploadedFiles,'store.uploadedFiles 15');
                dataCorrespondenceReceived.dataFilingFlow.stateCreatedFilin =
                  true; //State filing created view
                dataCorrespondenceReceived.dataModalConfirmation.isActive =
                  "hidde"; //Hidde modal confirmation with text-
                dataCorrespondenceReceived.dataFilingFlow.stateResponseFiling =
                  true; //State for view and show view Response filing.
                assignButtonNextData(
                  "classify",
                  "/Buttons/right-arrow.svg",
                  "step1234"
                );
                // Button back
                dataCorrespondenceReceived.dataButtonGoToBack.text = "finalize";
                dataCorrespondenceReceived.dataButtonGoToBack.url = "/Buttons/icon-check.svg";
                dataCorrespondenceReceived.dataButtonGoToBack.className= "blue";
              },
            },
          };
          dataCorrespondenceReceived.dataFilingFlow.dataResponse.dataImgQR.src =
            response.filing_qr;
          dataCorrespondenceReceived.dataFilingFlow.dataResponse.filing_code =
            filing_code_filing.value;
          dataCorrespondenceReceived.dataFilingFlow.dataResponse.filing_date =
            response.filing_date;
          dataCorrespondenceReceived.dataFilingFlow.dataResponse.remitter =
            response.remitter
              ? response.remitter.contact_name
                ? response.remitter.contact_name
                : response.remitter.first_name
                ? response.remitter.first_name +
                  " " +
                  response.remitter.last_name
                : response.remitter.email
              : "anonymous_person";
          dataCorrespondenceReceived.dataFilingFlow.dataResponse.type_of_filing =
            response.type_of_filing.name;
          dataCorrespondenceReceived.dataFilingFlow.dataResponse.presentation_mode =
            response.presentation_mode.label;
          dataCorrespondenceReceived.dataFilingFlow.dataResponse.subject =
            response.subject;
          searchFilingsList("", 1); 
          formData = new FormData();
          dataCorrespondenceReceived.dataFilingFlow.stateViewFileAnonimous =
            false;
        })
        .catch((error: any) => {
          dataCorrespondenceReceived.dataModalAlert = {
            isActive: "show",
            dataText: {
              classText: "center",
              text:
                error?.response.data.error.details[0] ??
                "an_error_has_occurred_please_try_again_later",
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
                dataCorrespondenceReceived.dataModalAlert.isActive = "hidde";
                dataCorrespondenceReceived.dataFilingFlow.stateCreatedFilin =
                  true;
              },
            },
          };
        });
  } else {
    console.log(store.uploadedFiles,'store.uploadedFiles 11');
    dataCorrespondenceReceived.dataModalAlert = {
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
          dataCorrespondenceReceived.dataModalAlert.isActive = "hidde";
        },
      },
    };
  }
}

/**
 * TODO FUNCTIONS VALIDATIONS
 */

function validateFormAssignFiling() {
  if (getValidationForm("modal-assign-filing__content")) {
    assignFiling();
  } else {
    dataCorrespondenceReceived.dataModalAlert = {
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
          dataCorrespondenceReceived.dataModalAlert.isActive = "hidde";
        },
      },
    };
  }
}

function openModalPdfViewer(data: any) {
  dataCorrespondenceReceived.dataModalPdfViewer = {
    isActive: "show",
    dataPdfViewer: {
      urlPdf: data,
      toolbar: { toolbar: false },
      onClose: () => {},
    },
  };
}

function openModalResponseFiling(data: any) {
  dataCorrespondenceReceived.dataModalResponseFiling.contentDocument =
      data?.description; 
  if (!data.documents || data.documents.length === 0) {
    // Si no hay documentos, muestra la descripcion en el modal y ocultar el visor PDF
    dataCorrespondenceReceived.dataModalResponseFiling.stateViewPdf = false;
    dataCorrespondenceReceived.dataModalResponseFiling.contentDocument =
      data.description; // Mostrar la descripción
  } else {
    // Si hay documentos, muestra el visor PDF y ocultar la descripcion
    FilesServices.getDocumentContent(data.documents[0].url)
      .then((response: any) => {
        dataCorrespondenceReceived.dataModalResponseFiling.stateViewPdf = true;
        dataCorrespondenceReceived.dataModalResponseFiling.dataPdfViewer.urlPdf =
          response;
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
  dataCorrespondenceReceived.dataModalResponseFiling.isActive = true;
  dataCorrespondenceReceived.dataModalResponseFiling.dataButtonBack.text =
    "back";
  dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext.text =
    "continue";
}
function openModalResponseFile(data: any) {
  console.log(data);
  dataCorrespondenceReceived.dataModalResponseFile.isActive = true;
  /* dataCorrespondenceReceived.dataModalResponseFiling.contentDocument =
      data?.description; 
  if (!data.documents || data.documents.length === 0) {
    // Si no hay documentos, muestra la descripcion en el modal y ocultar el visor PDF
    dataCorrespondenceReceived.dataModalResponseFiling.stateViewPdf = false;
    dataCorrespondenceReceived.dataModalResponseFiling.contentDocument =
      data.description; // Mostrar la descripción
  } else { */
    // Si hay documentos, muestra el visor PDF y ocultar la descripcion
    FilesServices.getDocumentContent(data.documents[0].url)
      .then((response: any) => {
        dataCorrespondenceReceived.dataModalResponseFile.dataPdfViewer.urlPdf =
          response;
      })
      .catch((error: any) => {
        console.error(error);
      });
  // }
}

function dataModalResponseFiling() {
  dataCorrespondenceReceived.dataModalResponseFiling.isActive = false;
}

function openModalAlert(text: string) {
  dataCorrespondenceReceived.dataModalAlert.isActive = "show";
  dataCorrespondenceReceived.dataModalAlert.dataText.text = text;
}

function closeModalAssignFiling() {
  dataCorrespondenceReceived.dataModalAssignFiling.isActive = false;
  resetModalAssignFiling();
}

function resetModalAssignFiling() {
  dataCorrespondenceReceived.dataModalAssignFiling.dataSelectDependence.model =
    "";
  dataCorrespondenceReceived.dataModalAssignFiling.dataSelectUser.model = "";
  dataCorrespondenceReceived.dataModalAssignFiling.dataSelectUser.options = [
    { value: "", label: "" },
  ];
  dataCorrespondenceReceived.dataModalAssignFiling.dataSelectUser.disabled =
    true;
  dataCorrespondenceReceived.dataModalAssignFiling.comments = "";
}

function openModalAssignFiling() {
  dataCorrespondenceReceived.dataModalAssignFiling.isActive = true;
}

function validateNavegationButtonBack() {
  switch (dataCorrespondenceReceived.stateViewFile) {
    case "step123":
      resetRemitterForm();
      assignButtonNextData(
        "continue",
        "/Buttons/right-arrow.svg",
        "step12");
      break;
    case "step1234":
      if (dataCorrespondenceReceived.dataFilingFlow.stateResponseFiling) {
        dataCorrespondenceReceived.dataFilingFlow.stateResponseFiling = false;
        dataCorrespondenceReceived.state = false;
      } else {
        assignButtonNextData(
          "continue",
          "/Buttons/right-arrow.svg",
          "step1");
        dataCorrespondenceReceived.dataFilingFlow.stateResponseFiling = false;
        dataCorrespondenceReceived.dataFilingFlow.stateViewFileAnonimous = 
          false;
        resetFilingForm();
        resetRemitterForm();
      }
      break;
    case "step12345":
      assignButtonNextData(
        "classify",
        "/Buttons/right-arrow.svg",
        "step1234"
      );
      // Button back
      dataCorrespondenceReceived.dataButtonGoToBack.text = "finalize";
      dataCorrespondenceReceived.dataButtonGoToBack.url = "/Buttons/icon-check.svg";
      dataCorrespondenceReceived.dataButtonGoToBack.className= "blue";
      break;
    default:
      break;
  }
}

function validateNavegationImgBack() {
  switch (dataCorrespondenceReceived.stateViewFile) {
    case "step1":
      dataCorrespondenceReceived.state = false;
      break;
    case "step12":
      dataCorrespondenceReceived.stateViewFile = "step1";
      break;
    default:
      break;
  }
}

function validateNavegationButtonNext() {
  switch (dataCorrespondenceReceived.stateViewFile) {
    case "step123":
      sendDataCreateRemitter();
      break;
    case "step1234":
      console.log(store.uploadedFiles,'store.uploadedFiles 8');
      if (dataCorrespondenceReceived.dataFilingFlow.stateResponseFiling) {
        console.log(store.uploadedFiles,'store.uploadedFiles 10');
        sendFileToAPI();
        resetFilingForm();
        assignButtonNextData("classify", "/Buttons/icon-check.svg", "step12345");
        dataCorrespondenceReceived.dataButtonGoToBack.text = "back";
        dataCorrespondenceReceived.dataButtonGoToBack.url = "/Buttons/left-arrow.svg";
        dataCorrespondenceReceived.dataButtonGoToBack.className= "";
      } else {
        sendDataCreateFiling();
        console.log(store.uploadedFiles,'store.uploadedFiles 9');
      }
      break;
    case "step12345":
      console.log(store.uploadedFiles,'store.uploadedFiles 6');
      if(getValidationForm("trd-container__form-trd")){
          console.log(store.uploadedFiles,'store.uploadedFiles 7');
          assignTrd();
      }
    break;
    default:
      break;
  }
}

async function sendFileToAPI() {
  const formData = new FormData();
  const file = store.uploadedFiles[0]; // Assuming the first file in the array is to be sent
  if (!file) {
    console.error("No se encontro el archivo para ser enviado a la API de clasificacion");
    return;
  }
  formData.append('file', file);  // Ensure the API expects a "file" field
  
  FilesServices.sendClassifyFiles(formData)
  .then((response: any) => {
      dataCorrespondenceReceived.adviceClasification.stateResponse = true;
      dataCorrespondenceReceived.adviceClasification.document = response.document;
      dataCorrespondenceReceived.adviceClasification.predicted_categories = response.predicted_categories;
    })
    .catch((error: any) => {
      console.error("Error al enviar el archivo a la API de clasificacion:", error);
    });
}

async function getCodeFilingByMenu(code: any) {
  filing_code_filing.value = code;
}

function getValidationForm(className: string) {
  //This function could be reused in anothers components pages
  const state: any = ref(true); //state boolean for response true or false
  const fieldsContainer: any = document.querySelector("." + className); //Get element by class
  console.log(store.uploadedFiles,'store.uploadedFiles 4');
  if (!fieldsContainer) {
    return false;
  }
  const inputsAndSelects = fieldsContainer.querySelectorAll(
    "input[required], select[required],textarea[required]"
  ); // update all inputs that any form need it, all inputs that its called here, must have property required

  inputsAndSelects.forEach((field: any) => {
    field.classList.remove("empty");

    if (!field.value.trim()) {
      state.value = false;
      field.classList.add("empty");
    }
  });

  return state.value;
}
/**
 * TODO FUNCTIONS REDIRECTS AND NAVEGATIONS
 */
function validateActionToFiling(action: string, record: any) {
  switch (action) {
    case "assign_user_record":
      openModalAssignFiling();
      break;

    case "record_response_filing":
      // openModalResponseFiling(record.filings[record.filings.length - 1]);
      console.log('openModalResponseFile');
      openModalResponseFile(record.filings[record.filings.length - 1]);
      break;
    case "sign_record":
      break;
    default:
      if (action.includes("continue")) {
        openModalAction(
          action,
          record.filings[0],
          record.id
        );
      } else {
        actionFiling(action, record.id);
      }
      break;
  }
}

function openModalAction(action: any, filling: any, idRecord: any) {
  //Modal
  let action1 = action.replace("continue", "decline");
  let responseAction = findUrlImageForOpenModalAction(action);
  FilesServices.getDocumentContent(
    filling.documents[filling.documents.length - 1].url
  )
    .then((response: any) => {
      dataCorrespondenceReceived.dataModalAction.dataPdfViewer.urlPdf =
        response;
    })
    .catch((error) => {
      console.error(error);
    });
  dataCorrespondenceReceived.dataModalAction.isActive = true;
  dataCorrespondenceReceived.dataModalAction.title = action;
  dataCorrespondenceReceived.dataModalAction.dataButtonAction1 = {
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
  dataCorrespondenceReceived.dataModalAction.dataButtonAction2 = {
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
  dataCorrespondenceReceived.dataModalAction.isActive = false;
  dataCorrespondenceReceived.dataModalAction.dataPdfViewer.urlPdf = "";
  dataCorrespondenceReceived.dataModalAction.messageBox = false;
  dataCorrespondenceReceived.dataModalAction.comments = "";
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

function actionFiling(action: string, id: any) {
  const formData = new FormData();
  formData.append(
    "comments",
    dataCorrespondenceReceived.dataModalAction.comments
  );
  ActionServices.actionFiling(id, action, formData)
    .then((response: any) => {
      openModalConfirmation("action_performed_succesfully");
    })
    .catch((error: any) => {});
}

function redirectCreateRemitter() {
  assignButtonNextData("continue", "/Buttons/right-arrow.svg", "step123");
}

function redirectNeWFiling() {
  dataCorrespondenceReceived.state = true;
  dataCorrespondenceReceived.stateViewFile = "step1";
}

function redirectNeWFilingAnonimous() {
  dataCorrespondenceReceived.dataFilingFlow.stateViewFileAnonimous = true;
  assignButtonNextData("create_filing", "/Buttons/right-arrow.svg", "step1234");
}

function openModalConfirmation(text: string, flag:boolean = true): void {
  dataCorrespondenceReceived.dataModalConfirmation.isActive = "show";
  dataCorrespondenceReceived.dataModalConfirmation.dataText.text = text;
    if(flag){
      callServices();
    }
}

function closeModalConfirmation() {
  dataCorrespondenceReceived.dataModalConfirmation.isActive = "hidde";
}

function assignButtonNextData(text: any, url: any, step: any, iconSize?: any) {
  dataCorrespondenceReceived.dataButtonGoToNext.text = text;
  dataCorrespondenceReceived.dataButtonGoToNext.url = url;
  dataCorrespondenceReceived.stateViewFile = step;
  switch (iconSize) {
    case "large":
      dataCorrespondenceReceived.dataButtonGoToNext.iconSize = "large";
      break;
    case "short":
      dataCorrespondenceReceived.dataButtonGoToNext.iconSize = "short";
      break;
    default:
      dataCorrespondenceReceived.dataButtonGoToNext.iconSize = null;
      break;
  }
}

function assignTrd() {
  const data: any = {
    serie: dataCorrespondenceReceived.dataFormTrd.serie,
    subserie: dataCorrespondenceReceived.dataFormTrd.subserie,
    documentary_type: dataCorrespondenceReceived.dataFormTrd.documentary_type
  }
  TrdServices.assignTRdToFiling(dataCorrespondenceReceived.dataFilingFlow.dataResponse.filing_code, data)
    .then((response: any) => {
      openModalConfirmation("the_trd_was_correctly_assigned_to_the_file", false)
    })
    .catch((error: any) => {
      console.error(error)
      openModalAlert(error.error.details[0])
    });
}

function resetRemitterForm() {
  dataCorrespondenceReceived.dataCreateRemitterForm.form = {
    personType: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    second_last_name: '',
    identification_type: '',
    identification_number: '',
    contact_name: '',
    social_reason: '',
    nit_number: '',
    country: '',
    department: '',
    city: '',
    address: '',
    phone_number: '',
    email: '',
  }
}

function resetFilingForm() {
  dataCorrespondenceReceived.dataFilingFlow.dataFormFiling = {
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
  };
  store.clearUploadedFiles();
  dataCorrespondenceReceived.dataFilingFlow.dataInputFiles.counterFiles = 0;
}

function resetModalResponseFiling() {

    dataCorrespondenceReceived.dataModalResponseFiling.isActive= false;
    dataCorrespondenceReceived.dataModalResponseFiling.subject= "";
    dataCorrespondenceReceived.dataModalResponseFiling.idRemitter= "";
    dataCorrespondenceReceived.dataModalResponseFiling.stateLoadForm= false;
    dataCorrespondenceReceived.dataModalResponseFiling.stateViewFile= "step1";
    dataCorrespondenceReceived.dataModalResponseFiling.stateViewDocument= false;
    dataCorrespondenceReceived.dataModalResponseFiling.contentDocument= "";
    dataCorrespondenceReceived.dataModalResponseFiling.stateViewResume= false;
    dataCorrespondenceReceived.dataModalResponseFiling.stateViewPdf= true;
    dataCorrespondenceReceived.dataModalResponseFiling.dataButtonNext= {
      className: "blue",
      text: "continue",
      alt: "continue",
      url: "/Buttons/right-arrow.svg",
      reverse: true,
      disabled: false,
      onClick: () => {
        validateNavigationNextResponse();
      },
    };
    dataCorrespondenceReceived.dataModalResponseFiling.dataButtonBack= {
      className: "",
      text: "back",
      alt: "continue",
      url: "/Buttons/left-arrow.svg",
      reverse: false,
      disabled: false,
      onClick: () => {
        validateNavigationBackResponse();
      },
    };
    dataCorrespondenceReceived.dataModalResponseFiling.dataImgGoToBack= {
      id: "",
      name: "back",
      class: "icon-button",
      src: "/icon-close.svg",
      type: "svg",
      alt: "",
      isActive: () => {}, // optional, currently used to add activate and deactivate the active class
      onClick: () => {
        dataCorrespondenceReceived.dataModalResponseFiling.isActive =
          !dataCorrespondenceReceived.dataModalResponseFiling.isActive;
        dataCorrespondenceReceived.dataModalResponseFiling.stateViewFile =
          "step1";
        dataCorrespondenceReceived.dataModalResponseFiling.dataButtonBack.url =
          "/Buttons/left-arrow.svg";
        dataCorrespondenceReceived.dataModalResponseFiling.dataPdfViewer.urlPdf =
          "";
        resetModalResponseFiling();
      },
    };
    dataCorrespondenceReceived.dataModalResponseFiling.dataPdfViewer= {
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
    };
    dataCorrespondenceReceived.dataModalResponseFiling.dataFormTrd= {
      typeFlow: 2,
      serie: "",
      subserie: "",
      documentary_type: "",
    };
    dataCorrespondenceReceived.dataModalResponseFiling.dataResumeFiling= {
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
    };

  addCurrentUserToActionsModal();
}

</script>

<style scoped src="./CorrespondenceReceived.page.scss"></style>
