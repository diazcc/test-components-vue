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
        <nav class="table-correspondence-received__nav-options">
            <MultiSelectAtom :dataMultiSelect="dataMultiSelect" @onChange="applyFilters"/>
            <InputSearch :dataInputSearch="dataTableCorrespondenceReceived.dataInputSearch" />
        </nav>
        <table class="table" @scroll="UtilsServices.handleScroll(dataResults)">
            <thead class="table__row table--header">
                <th class="table__row__cell">{{ t('item') }}</th>
                <th class="table__row__cell">{{ t('subject') }}</th>
                <th class="table__row__cell">{{ t('filing_number') }}</th>
                <th class="table__row__cell" >
                    {{ dataTableCorrespondenceReceived.validateSubmenu ? t('remitter') :
                        t('addressee') }}
                </th>
                <th class="table__row__cell">{{ t('from') }}</th>
                <th class="table__row__cell">{{ t('email') }}</th>
                <th class="table__row__cell">{{ t('date_of_filing') }}</th>
                <th class="table__row__cell">{{ t('state') }}</th>
                <th class="table__row__cell">{{ t('actions') }}
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
            <tbody v-else class="table__row" v-for="(data, index) in dataResults" :key="index">
                <td class="table__row__cell">
                    {{ index + 1 }}
                </td>
                <td class="table__row__cell table__row__cell--left-align">
                    {{ data?.filings ? data?.filings[data?.filings.length - 1]?.subject : data?.subject }}
                </td>
                <td class="table__row__cell">
                    <span>{{ data?.filings ? data.filings[data?.filings.length - 1]?.filing_code :
                        data?.filing_code }}</span>
                </td>
                <td class="table__row__cell table__row__cell--left-align">
                    {{ data?.filings ? remitterName(data.filings[data?.filings.length - 1]?.remitter) :
                        (data?.remitter ? remitterName(data?.remitter) : remitterName(data)) }}
                </td>
                <td class="table__row__cell table__row__cell--left-align">
                    {{ data.filings ? t(data.filings[data?.filings.length - 1].creation_medium) :
                        t(data.creation_medium)
                    }}
                </td>
                <td class="table__row__cell table__row__cell--left-align">
                    {{ data.filings ? (data.filings[data?.filings.length - 1]?.remitter ?
                        data.filings[data?.filings.length - 1]?.remitter.email : t('did_not_specify')) : data.remitter ?
                        data.remitter.email : t('did_not_specify') }}
                </td>
                <td class="table__row__cell">
                    <span v-if="data?.filings != undefined">{{ data?.filings[0].filing_date }}</span>
                    <span v-else>{{ data.filing_date }}</span>
                </td>
                <td class="table__row__cell table__row__cell--positon-relative">
                    <p
                        :class="'table__row__cell__status table__row__cell__status--' + UtilsServices.getColorByPercentage(data.filings ? data.filings[0]?.percentage_of_relationship_matrix : data.percentage_of_relationship_matrix, data?.status?.code || data?.related_record_info?.status_display.code)">
                        {{ data?.status_display ? t(data?.status_display.label || 'null') :
                            t(data?.related_record_info?.status_display.label || 'N/A') }}
                    </p>
                    <div class="icon-container">
                        <span
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
                        </span>
                        <DotIcon
                            :class="'icon-container__dot-icon icon-container__dot-icon--' + UtilsServices.getColorByPercentage(data.filings ? data.filings[0]?.percentage_of_relationship_matrix : data.percentage_of_relationship_matrix, data?.status?.code || data?.related_record_info?.status_display.code)"
                            :status="UtilsServices.getColorByPercentage(data.filings ? data.filings[0]?.percentage_of_relationship_matrix : data.percentage_of_relationship_matrix, data?.status?.code || data?.related_record_info?.status_display.code)" />
                    </div>
                </td>
                <td class="table__row__cell table__row--img">
                    <TooltipIcon v-if="dataTooltipIconView.show()" :dataTooltipIcon="dataTooltipIconView" @click="dataTooltipIconView.onClick({data: data})"/>
                    <TooltipIcon v-if="dataTableCorrespondenceReceived.validateSubmenu && dataTableCorrespondenceReceived?.dataTooltipIcons[0].show({data: data.user_actions})" :dataTooltipIcon="dataTableCorrespondenceReceived?.dataTooltipIcons[0]" @click="dataTableCorrespondenceReceived?.dataTooltipIcons[0].onClick({data: data})"/>
                    <TooltipIcon v-if="dataTableCorrespondenceReceived.validateSubmenu && dataTableCorrespondenceReceived?.dataTooltipIcons[1].show({data: data.user_actions})" :dataTooltipIcon="dataTableCorrespondenceReceived?.dataTooltipIcons[1]" @click="dataTableCorrespondenceReceived?.dataTooltipIcons[1].onClick({data: data})"/>
                    <TooltipIcon v-if="dataTableCorrespondenceReceived.validateSubmenu && dataTableCorrespondenceReceived?.dataTooltipIcons[2].show({data: data.user_actions})" :dataTooltipIcon="dataTableCorrespondenceReceived?.dataTooltipIcons[2]" @click="dataTableCorrespondenceReceived?.dataTooltipIcons[2].onClick({data: data})"/>
                    <TooltipIcon v-if="dataTableCorrespondenceReceived.validateSubmenu && dataTableCorrespondenceReceived?.dataTooltipIcons[3].show({data: data.user_actions})" :dataTooltipIcon="dataTableCorrespondenceReceived?.dataTooltipIcons[3]" @click="dataTableCorrespondenceReceived?.dataTooltipIcons[3].onClick({data: data})"/>
                    <TooltipIcon v-if="dataTableCorrespondenceReceived.validateSubmenu && dataTableCorrespondenceReceived?.dataTooltipIcons[4].show({data: data.user_actions})" :dataTooltipIcon="dataTableCorrespondenceReceived?.dataTooltipIcons[4]" @click="dataTableCorrespondenceReceived?.dataTooltipIcons[4].onClick({data: data})"/>
                    <TooltipIcon v-if="dataTableCorrespondenceReceived.validateSubmenu && dataTableCorrespondenceReceived?.dataTooltipIcons[5].show({data: data.user_actions})" :dataTooltipIcon="dataTableCorrespondenceReceived?.dataTooltipIcons[5]" @click="dataTableCorrespondenceReceived?.dataTooltipIcons[5].onClick({data: data})"/>
                </td>
            </tbody>
        </table>
    </section>
</template>

<script setup lang="ts">

// Import vue libraries
import { nextTick, onMounted, onUnmounted, Ref, ref, watch } from "vue";
import { useRouter } from 'vue-router';
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
// const validateSubmenu: any = ref();
const props = defineProps(['dataTableCorrespondenceReceived']);
const emits = defineEmits(['codeFiling', 'filingSelectedMenu']);

// Define variables 
const selectedFilter = ref('');
const arrayActionsDecline = ref(['action_approve_assignment_quoue_decline', 'action_review_assignment_quoue_decline', 'action_sign_assignment_quoue_decline']);
const search = ref("");
const selectedFilters = ref<Array<string>>([]);
const dataResults: Ref<any> = ref([]);
const dataTooltipIconView: Ref<any> = ref(
    {
        text: UtilsServices.capitalizeFirstLetter(`${t("view")} ${t("radication")}`),
        src: '/Buttons/icon-summary.svg',
        color: 'blue',
        alt: 'view',
        show: () => { return true; },
        onClick: ({data = {}}) => { validateMenuOpen(data) },
    },
);

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

const dataMultiSelect = {
    title: "filters",
    model: [],
    options: filters.map((value: any) => ({
        text: value,
        value: value,
        checked: false
    }))
}

// Define functions and methods
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
    if (dataResults.value.some((data: any) => data.isMenuOpen)) {
        dataResults.value.forEach((data: any) => {
            data.isMenuOpen = false;
        })
    }
    item.isMenuOpen = !item.isMenuOpen
    emits("codeFiling", item.filings[item.filings.length - 1].filing_code);
    emits("filingSelectedMenu", item.filings[item.filings.length - 1]);
    event.stopPropagation();
    nextTick(() => {
        checkMenuOverflow(index);
    });
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

function applyFilter() {
    dataResults.value = [];
    selectedFilter.value == 'all' ? (() => {
        dataResults.value = props.dataTableCorrespondenceReceived.data;
    })() : (() => {
        dataResults.value = filterData(props.dataTableCorrespondenceReceived.data, selectedFilter.value)
    })()
}

function validateMenuOpen(data: any) {
    if (!data.isMenuOpen) {
        router.push('/home/filing/' + (data.id ?? data.record_id));
    }
}

watch(() => props.dataTableCorrespondenceReceived.data,
    (filings: any) => {
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