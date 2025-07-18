<template>
  <section
    :class="
      'modal-response-file modal-response-file--' +
      (dataModalResponseFile.isActive ? 'active' : '')
    "
  >
    <article class="modal-response-file__wrapper">


      <header class="modal-response-file__wrapper__header">
        <h1 class="modal-response-file__wrapper__header__title">
          {{ t("Modulo de respuesta") }}
        </h1>

        <ol class="modal-response-file__wrapper__header__content-process">
          <li :class="stepByStepClassComputed"></li>
          <li
            :class="
              'modal-response-file__wrapper__header__content-process__pointer modal-response-file__wrapper__header__content-process__pointer--' +
              (dataModalResponseFile.stateView.includes('step1')
                ? 'focused'
                : '')
            "
            :style="{ '--bg-color': bgColor[0] }"
          >
            1
          </li>
          <li
            :class="
              'modal-response-file__wrapper__header__content-process__pointer modal-response-file__wrapper__header__content-process__pointer--' +
              (dataModalResponseFile.stateView.includes('step12')
                ? 'focused'
                : '')
            "
            :style="{ '--bg-color': bgColor[1] }"
          >
            2
          </li>
          <li
            :class="
              'modal-response-file__wrapper__header__content-process__pointer modal-response-file__wrapper__header__content-process__pointer--' +
              (dataModalResponseFile.stateView.includes('step123')
                ? 'focused'
                : '')
            "
            :style="{ '--bg-color': bgColor[2] }"
          >
            3
          </li>
        </ol>
      </header>
      <article
        class="modal-response-file__wrapper__content"
        :style="{
          'padding-bottom':
            dataModalResponseFile.isFirstSection  || dataModalResponseFile.stateView == 'step123'
              ? '0rem'
              : '56vh',
        }"
      >
        <template v-if="dataModalResponseFile.stateView == 'step1'">
          <CardInformationFilingMolecule
            :dataCardInformationFiling="
              dataModalResponseFile.dataCardInformationFiling
            "
          />

          <section
            class="modal-response-file__wrapper__content__address"
            v-if="dataModalResponseFile.isFirstSection == false"
          >
            <p
              class="modal-response-file__wrapper__content__address__label"
              id="how_do_you_want_to_continue"
            >
              {{ t("how_do_you_want_to_continue") }}
            </p>
            <ul class="modal-response-file__wrapper__content__address__form">
              <li
                class="modal-response-file__wrapper__content__address__form__card"
              >
                <p>{{ t("reply_filing") }}</p>
                <input
                  type="radio"
                  name="how_continue"
                  value="reply"
                  v-model="dataModalResponseFile.howContinue"
                  @click="scrollToSection('destination')"
                  required
                />
              </li>
              <li
                class="modal-response-file__wrapper__content__address__form__card"
              >
                <p>{{ t("assign_filing") }}</p>
                <input
                  type="radio"
                  name="how_continue"
                  value="assign"
                  v-model="dataModalResponseFile.howContinue"
                  required
                  @click="scrollToSection('assign')"
                />
              </li>
            </ul>
            <template
              v-if="dataModalResponseFile.howContinue == 'reply'"
              ref="destination"
            >
              <p
                class="modal-response-file__wrapper__content__address__label"
                id="destination"
              >
                {{ t("who_answers") }}:
              </p>
              <select
                name=""
                id=""
                class="input input--form"
                v-model="dataModalResponseFile.shippingMode"
                required
              >
                <option selected disabled value="">
                  {{ t("who_answers") }}
                </option>
                <option value="me">{{ t("me") }}</option>
                <option value="others">{{ t("others") }}</option>
                <option value="othersandme">{{ t("othersandme") }}</option>
              </select>
            </template>
            <template
              v-if="
                dataModalResponseFile.shippingMode != '' &&
                dataModalResponseFile.howContinue == 'reply'
              "
            >
              <p class="modal-response-file__wrapper__content__address__label" id="recipients">
                {{ t("select_the_department_and_the_user_who_will_perform_the_review_approve_or_sign_action") }}:
              </p>
              <SelectListActionUsersOrganism
                :dataSelectListActionUsers="
                  dataModalResponseFile.dataSelectListActionUsers
                "
                :mode="dataModalResponseFile.shippingMode"
              />
            </template>
          <template v-if="dataModalResponseFile.howContinue == 'assign'">
            <p
                class="modal-response-file__wrapper__content__address__label"
                id="assign"
              >
                {{ t("assign") }}:
              </p>
              <SelectAtom :dataSelect="dataModalResponseFile.assign.dataSelectDependence"  required/>
              <SelectAtom :dataSelect="dataModalResponseFile.assign.dataSelectUser" required />
              <textarea :placeholder="t('comments')+'...'" v-model="dataModalResponseFile.assign.comments"></textarea>
          </template>
          </section>
        </template>
        <section
          class="modal-response-file__wrapper__content__address"
           :style="{
          'padding-bottom': 
            dataModalResponseFile.isTrdView == false 
              ? '0rem'
              : '45vh',
        }"
          v-if="dataModalResponseFile.stateView == 'step12'"
        >
          <p
            class="modal-response-file__wrapper__content__address__label"
            id="destination"
          >
            {{ t("select_the_department_and_the_user_who_will_perform_the_review_approve_or_sign_action") }}:
          </p>
          <input
            type="text"
            name="how_continue"
            class="input input--form"
            :placeholder="t('subject')"
            required
          />
          <table
            class="table"
            v-if="
              !dataModalResponseFile.dataSelectListActionUsers.stateEditorText
            "
          >
            <thead class="table__row table--header">
              <th class="table__row__cell">{{ t("name") }}</th>
              <th class="table__row__cell">{{ t("actions") }}</th>
            </thead>
            <tbody
              class="table__row table--only-row bg-blue bg-blue--interactive"
              @click="triggerFileInput()"
            >
              <td class="table__row__cell">
                <p>
                  {{ t("upload_file") }}
                </p>
                <img
                  src="/Buttons/icon-upload.svg"
                  class="color-invert-negative"
                  alt=""
                />
              </td>
            </tbody>
            <tbody
              v-for="(file, index) in uploadedFiles"
              :key="index"
              class="table__row"
            >
              <td class="table__row__cell table__row__cell--left-align">
                {{ file.name }}
              </td>
              <td class="table__row__cell table__row--img">
                <TooltipIcon
                  v-if="dataTooltipIcons[0].show(file)"
                  :dataTooltipIcon="dataTooltipIcons[0]"
                  @click="
                    dataTooltipIcons[0].onClick({ index: index, file: file })
                  "
                />
                <TooltipIcon
                  v-if="dataTooltipIcons[1].show(file)"
                  :dataTooltipIcon="dataTooltipIcons[1]"
                  @click="
                    dataTooltipIcons[1].onClick({ index: index, file: file })
                  "
                />
              </td>
            </tbody>

            <input
              type="file"
              ref="fileInput"
              @change="handleFileChange"
              style="display: none"
              multiple
            />
          </table>
          <DocumentCreatorOrganism
            :data-document-creator="dataModalResponseFile.dataDocumentCreator"
            @sendDataEditor="getSendDataEditor"
            v-else
          />
          <FormTrdOrganism
            :dataFormTrd="dataModalResponseFile.dataFormTrd"
            v-if="dataModalResponseFile.isTrdView == true"
          />
          
        </section>
        <ResumeFilingOrganism :dataResumeFiling="dataModalResponseFile.dataResumeFiling" v-if="dataModalResponseFile.stateView == 'step123'" />
      </article>
      <section class="modal-response-file__wrapper__actions">
        <ButtonAtom :dataButton="dataModalResponseFile.dataButtonBack" />
        <ButtonAtom :dataButton="dataModalResponseFile.dataButtonContinue" />
      </section>
    </article>
  </section>
</template>
<script setup lang="ts">
import { ModalResponseFile } from "../../../../interfaces/ModalResponseFile.interface";
import { useI18n } from "vue-i18n";
import ButtonAtom from "../../../atoms/button/Button.atom.vue";
import ResumeFilingOrganism from '../../../organisms/resume-filing/ResumeFiling.organism.vue';
import DocumentCreatorOrganism from "../../../organisms/document-creator/DocumentCreator.organism.vue";
import FormTrdOrganism from "../../../organisms/form-trd/FormTrd.organism.vue";
import { computed, reactive, ref, watch , onMounted} from "vue";
import UtilsServices from "../../../../services/UtilsServices";
import UserServices from "../../../../services/UserServices";
import DependenceServices from "../../../../services/DependenceServices";
import { accessStore } from "../../../../store";
import TooltipIcon from "../../../atoms/tooltip-icon/TooltipIcon.atom.vue";
import CardInformationFilingMolecule from "../../card-information-filing/CardInformationFiling.molecule.vue";
import SelectListActionUsersOrganism from "../../../organisms/select-list-action-users/SelectListActionUsers.organism.vue";
import SelectAtom from "../../../atoms/select/Select.atom.vue";

const fileInput = ref<HTMLElement | null>(null);
const emits = defineEmits(["sendDataEditor"]);
const store = accessStore();
let uploadedFiles: any = reactive(store.uploadedFiles);
const { t, te } = useI18n();
const bgColor: any = ref(
  UtilsServices.colorGenerator(5, [0, 108, 216], [255, 147, 39])
);
const dataTooltipIcons: any = ref([
  {
    text: `${t("view")} ${t("file")}`,
    src: "/Buttons/icon-view.svg",
    color: "blue",
    alt: "view",
    show: (data: any) => {
      return data?.url == null || store.isPdfUrl(data?.url);
    },
    onClick: ({ index = 0, file = "" }) => {
      props.dataModalResponseFile.dataCardInformationFiling.openFile(file);
    },
  },
  {
    text: `${t("delete")} ${t("file")}`,
    src: "/Buttons/icon-delete.svg",
    color: "red",
    alt: "delete",
    show: (data: any) => {
      return data?.url == null || store.isPdfUrl(data?.url);
    },
    onClick: ({ index = 0, file = "" }) => {
     store.removeUploadedFile(index);
      console.log("uploadedFiles", uploadedFiles);
    },
  }
]);
const stateClassMap: any = {
  step1: "step1",
  step12: "step12",
  step123: "step123",
};
function getSendDataEditor(data: any) {
  emits("sendDataEditor", data);
}
const props: any = defineProps<{
  dataModalResponseFile: ModalResponseFile;
}>();
const stepByStepClassComputed = computed(() => {
  const baseClass: string =
    "modal-response-file__wrapper__header__content-process__line";
  const dynamicClass =
    stateClassMap[props.dataModalResponseFile.stateView] || "";
  return `${baseClass} ${baseClass}--${dynamicClass}`;
});
async function addCurrentUserToActionsModal() {
  UserServices.getUserLogged()
    .then((response: any) => {
      console.log(
        "props.dataModalResponseFile.dataSelectListActionUsers.usersSelecteds",
        props.dataModalResponseFile.dataSelectListActionUsers.usersSelecteds
      );
      if (
        props.dataModalResponseFile.dataSelectListActionUsers.usersSelecteds
          .length > 0
      ) {
        console.log("response", response);

        props.dataModalResponseFile.dataSelectListActionUsers.usersSelecteds[0] =
          reactive({
            name: response.first_name,
            email: response.email,
            dependence: response.dependence?.name || null,
            action: "no_action",
            is_current_user: true,
          });
      } else {
        props.dataModalResponseFile.dataSelectListActionUsers.usersSelecteds.push(
          {
            name: response.first_name,
            email: response.email,
            dependence: response.dependence?.name || null,
            action: "no_action",
            is_current_user: true,
          }
        );
      }
    })
    .catch((error) => {
      props.dataModalResponseFile.dataSelectListActionUsers.usersSelecteds = [];
    });
}

async function handleFileChange(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  if (inputElement.files) {
    for (let i = 0; i < inputElement.files.length; i++) {
      const file = inputElement.files[i];
      await store.addUploadedFile(file); //Use  store for save all files elected about input file. check store for be used
    }

    inputElement.value = "";
  }
}

function triggerFileInput() {
  fileInput.value?.click();
}
function scrollToSection(id: string) {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 0);
}
async function getParentDependences() {
  await DependenceServices.getParentDependences()
    .then(async (response: any) => {
      console.log(response,'response');
      props.dataModalResponseFile.assign.dataSelectDependence.options = 
        response.map((element: any) => { 
          return {
            value: element.code,
            label: element.name
        }});
    })
    .catch((error: any) => {
      console.error(error)
    });
}


function callServices(){
  getParentDependences()
}
onMounted(() => {
  callServices()
});
watch(
  () => props.dataModalResponseFile.shippingMode,
  (newValue, oldValue) => {
    if(newValue!= ''){
      scrollToSection("recipients");
    }
    switch (newValue) {
      case "me":
      case "othersandme":
        console.log("newValue", newValue);
        addCurrentUserToActionsModal();
        break;
      case "others":
        props.dataModalResponseFile.dataSelectListActionUsers.usersSelecteds =
          [];
        break;
      default:
        break;
    }
  }
);
</script>
<style lang="" src="./ModalResponseFile.molecule.scss"></style>
