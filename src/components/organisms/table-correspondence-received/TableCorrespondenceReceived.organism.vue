<!-- 
    dataTableCorrespondenceReceived: {
            stateLoadData: true,
            validateSubmenu: true,
            data: [],
            dataInputSearch: {
                dataInput: {
                    id: '',
                    name: '',
                    classInputEmail: '',
                    model: '',
                    type: 'text',
                    placeholder: 'search_filing',
                    disabled: false,
                    required: false,
                    onClick: () => { },
                    onChange: (value: any) => {
                    }
                },
                dataImg: {
                    id: '',
                    name: '',
                    class: ' icon',
                    src: '/icon-lupa-general.svg',
                    type: '',
                    alt: '',
                    onClick: () => { }
                }

            },
            actionsMenu: (action: any, record: any) => {
                
            },
            openFiling: () => {

            }
        },
 -->

<template>
    <section class="table-correspondence-received">
        
        <table class="table" @scroll="UtilsServices.handleScroll(dataResults)">
            <thead class="table__row table--header">
                <th class="table__row__cell">{{ t('item') }}</th>
                <th class="table__row__cell">{{ t('subject') }}</th>
                <th class="table__row__cell" >
                    {{ dataTableCorrespondenceReceived.validateSubmenu ? t('remitter') :
                        t('addressee') }}
                </th>
                <th class="table__row__cell">{{ t('email') }}</th>
                <th class="table__row__cell">{{ t('date_of_filing') }}</th>
                <th class="table__row__cell">{{ t('state') }}</th>
                <th class="table__row__cell" v-if="dataTableCorrespondenceReceived.validateSubmenu">{{ t('actions') }}
                </th>
            </thead>
            <tbody class="table__row table--only-row loading-component"
                v-if="dataTableCorrespondenceReceived.stateLoadData">
                <td class="table__row__cell ">
                    {{ t('loading') }}
                </td>
            </tbody>
            <tbody class="table__row table--only-row"
                v-else-if="dataResults.length < 1">
                <td class="table__row__cell">{{ t('no_filing') }}</td>
            </tbody>
            <tbody v-else class="table__row" v-for="(data, index) in dataResults" :key="index" @click="router.push('/home/filing/'+data?.id)">
                <td class="table__row__cell" >
                    {{ index + 1 }}
                </td>
                <td class="table__row__cell table__row__cell--left-align" >
                    {{ data?.subject }}
                </td>
                <td class="table__row__cell table__row__cell--left-align" >
                    {{ data?.creator_user ? data?.creator_user : 'remitterName(data)' }}
                </td>
                <td class="table__row__cell table__row__cell--left-align" >
                    {{ data.email ?? t('did_not_specify') }}
                </td>
                <td class="table__row__cell" >
                    <span v-if="data?.date_created != undefined">{{ data?.date_created }}</span>
                    <span v-else>{{ data.date_created }}</span>
                </td>
                <td class="table__row__cell table__row__cell--positon-relative" >
                    {{ t(data.status) ?? t('pending') }}
                    <!-- <p
                        :class="'table__row__cell__status table__row__cell__status--' + UtilsServices.getColorByPercentage(data.filings ? data.filings[0]?.percentage_of_relationship_matrix : data.percentage_of_relationship_matrix, data?.status?.code || data?.related_record_info?.filing_info.status_display.code)">
                        {{ data?.filing_info.status_display ? t(data?.filing_info.status_display == 'in_process' ? 'unanswered'  : 'null') :
                            t(data?.related_record_info?.filing_info.status_display.label == 'in_process' ? 'unanswered'  : 'N/A') }}
                    </p> -->
                    <div class="icon-container">
                        <!-- <span
                            :class="'tooltip' + (dataTableCorrespondenceReceived.validateSubmenu ? '' : ' tooltip--table-sent')"
                            v-if="UtilsServices.getColorByPercentage(data.filings ? data.filings[0]?.percentage_of_relationship_matrix : data.percentage_of_relationship_matrix, data?.status?.code || data?.related_record_info?.status_display.code) == 'status-red'">
                            {{ t("filing_expiring_soon") }}:
                            {{ data.filings ?
                                (
                                    data?.filings[0]?.days_left.days == 0 ?
                                        (Math.floor(data?.filings[0]?.days_left.seconds / 3600) + " " + t('hours')) :
                                        (data?.filings[0]?.days_left.days + " " + t('days'))
                                ) :
                                (
                                    data?.days_left.days == 0 ?
                                        (Math.floor(data?.days_left?.seconds / 3600) + " " + t('hours')) :
                                        (data?.days_left?.days + " " + t('days'))
                                )

                            }}
                        </span>
                        <span
                            :class="'tooltip' + (dataTableCorrespondenceReceived.validateSubmenu ? '' : ' tooltip--table-sent')"
                            v-if="UtilsServices.getColorByPercentage(data.filings ? data.filings[0]?.percentage_of_relationship_matrix : data.percentage_of_relationship_matrix, data?.status?.code || data?.related_record_info?.status_display.code) == 'status-black'">
                            {{ t("filing_expired") }} {{ t("for") }}
                            {{ data.filings ?
                                (
                                    data?.filings[0]?.days_left.days == 0 ?
                                        (Math.floor(data?.filings[0]?.days_left.seconds / 3600) + " " + t('hours')) :
                                        (data?.filings[0]?.days_left.days + " " + t('days'))
                                ) :
                                (
                                    data?.days_left.days == 0 ?
                                        (Math.floor(data?.days_left?.seconds / 3600) + " " + t('hours')) :
                                        (data?.days_left?.days + " " + t('days'))
                                )

                            }}
                        </span> -->
                       <!--  <DotIcon
                            :class="'icon-container__dot-icon icon-container__dot-icon--' + UtilsServices.getColorByPercentage(data.filings ? data.filings[0]?.percentage_of_relationship_matrix : data.percentage_of_relationship_matrix, data?.status?.code || data?.related_record_info?.status_display.code)"
                            :status="UtilsServices.getColorByPercentage(data.filings ? data.filings[0]?.percentage_of_relationship_matrix : data.percentage_of_relationship_matrix, data?.status?.code || data?.related_record_info?.status_display.code)" /> -->
                    </div>
                </td>
                <td class="table__row__cell table__row__cell--positon-relative" v-if="dataTableCorrespondenceReceived.validateSubmenu" >
                    <!-- <ul v-if="data.isMenuOpen" class="table__row__cell__menu" :id="'table__row__cell__menu-' + index">
                        <div v-for="(action, indexAction) in data.user_actions" :key="indexAction">
                            <li @click="dataTableCorrespondenceReceived.actionsMenu(action, data)"
                                v-if="!arrayActionsDecline.includes(action)">
                                <img :src="iconsButtonMenu[action] ?? ''" alt="">
                                <p>
                                    {{ t(action) }}
                                </p>
                            </li>
                        </div>
                    </ul>
                    <button
                        :class="['table__row__cell__button', { 'table__row__cell__button--focused': data.isMenuOpen }]"
                        @click="toggleMenu(data, $event, index)">
                        <img src="/icon-arrow-item-menu-padre-white.svg">
                    </button> -->
                </td>
            </tbody>
        </table>
    </section>
</template>

<script setup lang="ts">
// Import vue libraries
import { nextTick, onMounted, onUnmounted, reactive, Ref, ref, watch } from "vue";
import { useRouter } from 'vue-router'
// import { useNavigationWithTenant } from '../../../composables/useNavigationWithTenant';;
import { useI18n } from 'vue-i18n';

// Import components
import InputSearch from '../../molecules/input-search/InputSearch.molecule.vue';
import DotIcon from "../../atoms/dot-icon/DotIcon.atom.vue";
import MultiSelectAtom from "../../atoms/multi-select/MultiSelect.atom.vue";
import TooltipIcon from "../../atoms/tooltip-icon/TooltipIcon.atom.vue";

// Import services
import UtilsServices from "../../../services/UtilsServices";

// Define props, emits and configuration
const { t } = useI18n();
const router = useRouter();
// const { navigateTo } = useNavigationWithTenant();
// const validateSubmenu: any = ref();
const props = defineProps(['dataTableCorrespondenceReceived','isSearch']);
const emits = defineEmits(['codeFiling', 'filingSelectedMenu']);

// Define variables 
const selectedFilter = ref('');
const arrayActionsDecline = ref(['action_approve_assignment_quoue_decline', 'action_review_assignment_quoue_decline', 'action_sign_assignment_quoue_decline']);
const search = ref("");
const selectedFilters = ref<Array<string>>([]);
const dataResults: Ref<any> = ref([]);

const filters = [
    'all',
    'approved',
    'review',
    'signed',
    'in_process',
    'in_review',
    'in_approval',
    'in_signature',
    'web_filing',
    'email_filing'
];
const iconsButtonMenu : any = {
  assign: "/Buttons/icon-assign.svg",
  response: "/Buttons/icon-send.svg",
  view: "/Buttons/icon-open.svg",
  respond: "/Buttons/icon-send.svg",
  revert: "/Buttons/icon-refresh.svg",
  aprove: "/Buttons/icon-aprove-filing.svg",
  review: "/Buttons/icon-review.svg",
  sign: "/Buttons/icon-check.svg"
};
const dataMultiSelectFilings = reactive( {
    title: "filters",
    model: [],
    options: []
})

const dataMultiSelect =  reactive({
    title: "filters",
    model: [],
    options: filters.map((value: any) => ({
        text: value,
        value: value,
        checked: false
    }))
})

onMounted(async () => {
    document.addEventListener("click", outSideArea);
    applyFilters([]);
});

onUnmounted(() => {
    document.removeEventListener("click", outSideArea);
});

const outSideArea = (event: any) => {
    if (!event.target.closest('.table__row__cell__menu')) {
        closeMenus();
    }
};

const remitterName = (remitter: any) => {
    if (!remitter) {
        return t('anonymous_person');
    }

    if (remitter.contact_name) {
        return remitter.contact_name;
    }

    if (remitter.first_name && remitter.last_name) {
        return `${remitter.first_name} ${remitter.last_name}`;
    }

    if (remitter.addressee) {
        return remitter.addressee;
    }

    return remitter.email || t('anonymous_person');
};

const toggleMenu = (item: any, event: any, index: any) => {
    if (props.dataTableCorrespondenceReceived.validateSubmenu) {
        
        // DEBUG: Log completo del item
        console.log('🔍 toggleMenu - Item completo:', item);
        console.log('🔍 toggleMenu - user_actions:', item.user_actions);
        console.log('🔍 toggleMenu - Cantidad de acciones:', item.user_actions?.length);
        console.log('🔍 toggleMenu - isMenuOpen antes:', item.isMenuOpen);
        
        if (dataResults.value.some((data: any) => data.isMenuOpen)) {
            dataResults.value.forEach((data: any) => {
                data.isMenuOpen = false;
            })
        }
        item.isMenuOpen = !item.isMenuOpen
        
        console.log('🔍 toggleMenu - isMenuOpen después:', item.isMenuOpen);
        
       /*  emits("codeFiling", item.filings[item.filings.length - 1].filing_code);
        emits("filingSelectedMenu", item.filings[item.filings.length - 1]); */
        event.stopPropagation();
        nextTick(() => {
            checkMenuOverflow(index);
        });
        return;
    }
    validateMenuOpen(item);
};

const closeMenus = () => {
    for (const data of dataResults.value) {
        data.isMenuOpen = false;
    }
};

const checkMenuOverflow = (index: any) => {
    const elementMenu: any = document.getElementById(`table__row__cell__menu-${index}`);
    const flexTable: any = document.querySelector('.table');
    if (elementMenu && flexTable) {
        const menuRect = elementMenu.getBoundingClientRect();
        const flexTableRect = flexTable.getBoundingClientRect();
        if (menuRect.bottom > flexTableRect.bottom) {
            const overflowAmount = menuRect.bottom - flexTableRect.bottom;
            elementMenu.style.top = `calc(0% - ${overflowAmount + 10}px)`;
        }
    }
};
function validateMenuOpen(data: any) {
    if (!data.isMenuOpen) {
        // Si el filing tiene expediente_info, navegar al expediente
        if (data.expediente_info?.id) {
            // navigateTo('/home/filing/' + data.expediente_info.id);
        } 
        // Si tiene parent_folder (ID del expediente), usarlo
        else if (data.filing_info.id) {
            // navigateTo('/home/filing/' + data.filing_info.id);
        }
        // Si tiene record_id (para compatibilidad con datos legacy), usarlo
        else if (data.record_id) {
            // navigateTo('/home/filing/' + data.record_id);
        }
        // Si no pertenece a ningún expediente, mostrar el filing individual
        // (esto requeriría una página diferente o una lógica diferente)
        else {
            console.warn('Filing', data.id, 'no pertenece a ningún expediente');
            // Por ahora, intentar con el ID del filing
            // navigateTo('/home/filing/' + data.id);
        }
    }
}
function applyFilter() {
    dataResults.value = [];
    selectedFilter.value == 'all' ? (() => {
        dataResults.value = props.dataTableCorrespondenceReceived.data;
    })() : (() => {
        dataResults.value = filterData(props.dataTableCorrespondenceReceived.data, selectedFilter.value)
    })()
}



watch(() => props.dataTableCorrespondenceReceived.data,
    (filings: any) => {
        dataMultiSelectFilings.options = filings.map((filing: any) => {
            return {
                text: filing.filing_code,
                value: filing.filing_code,
                checked: false
            }
        } );
        applyFilters(dataMultiSelect.model)
    }
)

function applyFilters(selectedOptions: Array<{ value: any }>) {
    selectedFilters.value = selectedOptions.map(option => option.value);

    if (selectedFilters.value.includes('all') || selectedFilters.value.length < 1) {
        dataResults.value = props.dataTableCorrespondenceReceived.data;
    } else {
        dataResults.value = props.dataTableCorrespondenceReceived.data.filter((item: any) => {
            const statusDisplay = item?.status_display?.label ??
                item?.status_display ??
                item?.related_record_info?.status_display?.label;

            return selectedFilters.value.some(filter => {
                const hasMatchingStatus = statusDisplay == filter;
                const hasMatchingMedium = item?.creation_medium == filter;
                return hasMatchingStatus || hasMatchingMedium;
            });
        });
    }
}

const filterData: Function = (data: any, filter: any) => {
    return data.filter((item: any) => {
        const hasMatchingStatus = filter ? item?.status_display?.label == filter : true;
        const hasMatchingMedium = item?.filings && item?.filings?.length > 0 &&
            item?.filings[item?.filings?.length - 1]?.creation_medium == filter;
        return hasMatchingStatus || hasMatchingMedium;
    });
};

</script>

<style scoped src="./TableCorrespondenceReceived.organism.scss"></style>