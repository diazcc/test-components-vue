<template>
    <UserInfoTemplate :dataUserInfo="dataUserInfo" />
</template>

<script setup lang="ts">
import UserInfoTemplate from '../../templates/user-info/UserInfo.template.vue';
import { reactive, onMounted } from 'vue';
import { accessStore } from '../../../store';
import { useRouter } from 'vue-router';
import UserServices from '../../../services/UserServices';
import FilingServices from '../../../services/FilingServices';
import RoleServices from '../../../services/RoleServices';
import DependenceServices from '../../../services/DependenceServices';
import LocalizationServices from '../../../services/LocalizationServices';
import { useRoute } from 'vue-router';
import FormValidators from '../../../validators/FormValidators';

const route: any = useRoute();
const router = useRouter();
const store = accessStore();
const userId: any = route.params.id;
const dataUserInfo: any = reactive({
    stateEditForm: false,
    stateLoadForm: false,
    form: {
        id: '',
        first_name: '',
        second_name: '',
        last_name: '',
        second_last_name: '',
        select_identification_type: '',
        identification_number: '',
        country: '',
        department: '',
        city: '',
        address: '',
        email: '',
        active: '',
        birthday: '',
        dependence: '',
        role: '',
    },
    dataButtonEdit:
    {
        className: '',
        text: 'edit',
        url: '/Buttons/icon-edit.svg',
        alt: 'edit',
        reverse: true,
        disabled: false,
        iconSize: "large",
        onClick: () => {
            setEditForm();
        }
    },
    dataButtonNext:
    {
        className: 'blue',
        text: 'save',
        url: '/Buttons/icon-save.svg',
        atl: 'save',
        reverse: true,
        disabled: false,
        onClick: () => {
            try {
                saveDataUser();
            } catch (error) {
                console.error('Error handling button click:', error);
            }
        }
    },
    dataButtonBack:
    {
        className: '',
        text: 'cancel',
        url: '/Buttons/decline.svg',
        iconSize: 'short',
        atl: 'decline',
        reverse: false,
        disabled: false,
        onClick: () => {         
            dataUserInfo.stateEditForm = false;
            getInfo();
            FormValidators.disableAllFields("user-info__content__card") 
        }
    },
    dataImgGoBack: {
        id: '',
        name: 'back',
        class: 'icon-back',
        src: '/arrow-left.svg',
        type: 'svg',
        alt: '',
        isActive: () => { }, // optional, currently used to add activate and deactivate the active class
        onClick: () => {
            router.push('/home/administration-tenant/users');
        }
    },
    dataModalConfirmation: {
        isActive: '',
        dataButton: {
            className: 'blue',
            text: 'close',
            disabled: false,
            onClick: () => { closeModalConfirmation() }
        },
        dataText: {
            classText: '',
            text: 'hla',
            disabled: false,
            onClick: () => { }
        }
    },
    dataModalAlert: {
        isActive: '',
        dataButton: {
            className: '',
            text: 'close',
            disabled: false,
            onClick: () => { closeModalAlert() }
        },
        dataText: {
            classText: '',
            text: '',
            disabled: false,
            onClick: () => { }
        }
    },
    dataSelectRole: {
        id: '',
        name: '',
        className: '',
        disabled: true,
        onChange: (data: any) => {
        },
        onClick: () => { },
        placeholder: 'select_role',
        model: '',
        options: [

        ]
    },
    dataSelectCountry: {
        id: '',
        name: '',
        className: '',
        disabled: true,
        onChange: (data: any) => {
            setDataSelectCountry(data.target.value, data.target.options[data.target.selectedIndex].label)
        },
        onClick: () => { },
        placeholder: 'select_country',
        model: '',
        options: [

        ]
    },
    dataSelectDepartment: {
        id: '',
        name: '',
        className: '',
        disabled: true,
        onChange: (data: any) => {
            setDataSelectDepartament(data.target.value, data.target.options[data.target.selectedIndex].label)
        },
        onClick: () => { },
        placeholder: 'select_department',
        model: '',
        options: [
        ]
    },
    dataSelectCity: {
        id: '',
        name: '',
        className: '',
        disabled: true,
        onChange: (data: any) => {
            setDataSelectCity(data.target.value, data.target.options[data.target.selectedIndex].label)
        },
        onClick: () => { },
        placeholder: 'select_city',
        model: '',
        options: [
        ]
    },
    dataSelectDependence: {
        id: '',
        name: '',
        className: '',
        disabled: true,
        onChange: (data: any) => {

        },
        onClick: () => { },
        placeholder: 'select_dependence',
        model: '',
        options: [

        ]
    },
    dataSelectIdentificationType: {
        id: '',
        name: '',
        className: '',
        disabled: true,
        onChange: (data: any) => {
        },
        onClick: () => { },
        placeholder: 'select_identification_type',
        model: '',
        options: [
        ]
    }
});

onMounted(() => {
    getInfo();
})

function getInfo() {
    getIdType();
    getDataUser()
    getDataCountries();
    getAllRoles();
}

function saveDataUser() {
    if (FormValidators.getValidationForm('user-info__content')) {
        dataUserInfo.stateLoadForm = true;
        dataUserInfo.stateEditForm = false;
        FormValidators.disableAllFields('user-info__content');

        const formData = new FormData();

        if (dataUserInfo.form.first_name != '' && dataUserInfo.form.first_name != null) formData.append('first_name', dataUserInfo.form.first_name);
        if (dataUserInfo.form.second_name != '' && dataUserInfo.form.second_name != null) formData.append('second_name', dataUserInfo.form.second_name);
        if (dataUserInfo.form.last_name != '' && dataUserInfo.form.last_name != null) formData.append('last_name', dataUserInfo.form.last_name);
        if (dataUserInfo.form.second_last_name != '' && dataUserInfo.form.second_last_name != null) formData.append('second_last_name', dataUserInfo.form.second_last_name);
        if (dataUserInfo.dataSelectIdentificationType.model != '' && dataUserInfo.dataSelectIdentificationType.model != null) formData.append('identification_type', dataUserInfo.dataSelectIdentificationType.model);
        if (dataUserInfo.form.identification_number != '' && dataUserInfo.form.identification_number != null) formData.append('identification_number', dataUserInfo.form.identification_number);
        if (dataUserInfo.dataSelectCountry.model != '' && dataUserInfo.dataSelectCountry.model != null) formData.append('country', dataUserInfo.dataSelectCountry.model);
        if (dataUserInfo.dataSelectDepartment.model != '' && dataUserInfo.dataSelectDepartment.model != null) formData.append('department', dataUserInfo.dataSelectDepartment.model);
        if (dataUserInfo.dataSelectCity.model != '' && dataUserInfo.dataSelectCity.model != null) formData.append('city', dataUserInfo.dataSelectCity.model);
        if (dataUserInfo.form.address != '' && dataUserInfo.form.address != null) formData.append('address', dataUserInfo.form.address);
        if (dataUserInfo.form.email != '' && dataUserInfo.form.email != null) formData.append('email', dataUserInfo.form.email);
        formData.append('is_active', dataUserInfo.form.active);
        if (dataUserInfo.form.phone_number != '' && dataUserInfo.form.phone_number != null) formData.append('phone_number', dataUserInfo.form.phone_number);
        if (dataUserInfo.form.birthday != '' && dataUserInfo.form.birthday != null) formData.append('date_of_birth', dataUserInfo.form.birthday);
        if (dataUserInfo.dataSelectDependence.model != '' && dataUserInfo.dataSelectDependence.model != null) formData.append('dependence', dataUserInfo.dataSelectDependence.model);
        if (dataUserInfo.dataSelectRole.model != '' && dataUserInfo.dataSelectRole.model != null) formData.append('role', dataUserInfo.dataSelectRole.model);

        UserServices.saveData(formData, dataUserInfo.form.id)
            .then((response: any) => {
                openModalConfirmation('the_user_data_was_saved_succesfully');
                dataUserInfo.stateLoadForm = false;
            })
            .catch((error: any) => {
                console.error(error);
            })

    } else {
        openModalAlert('empty_inputs');
    }
}

function setEditForm() {
    dataUserInfo.stateEditForm = true;
    FormValidators.removeDisabledFromForm('user-info__content');
}

async function getParentDependences() {
    await DependenceServices.getParentDependences()
        .then(async (response: any) => {
            dataUserInfo.dataSelectDependence.options = response.map((element: any) => { 
                return {
                    value: element.code,
                    label: element.name
                }});
        })
        .catch((error: any) => {
            console.error(error)
        });
}

function getIdType() {
    UserServices.getIdType()
        .then((response: [] | any) => {
            response.map((value: any) => {
                dataUserInfo.dataSelectIdentificationType.options.push({
                    value: value.code,
                    label: value.label
                })
            })
        })
        .catch((error: any) => {
            console.error(error);
        })
}

function getAllRoles() {
    let data: {}[] = [];
    RoleServices.getAllRoles(true)
        .then((response: any) => {
            response.results.map((value: any) => {
                data.push(
                    {
                        value: value.id, //! Must be value.id, check with backend manager 
                        label: value.name
                    }
                )
            })
            dataUserInfo.dataSelectRole.options = data;
        })
        .catch((error: any) => {
            console.error();

        })
}

function getDataUser() {
    UserServices.getUser(userId)
        .then(async (response: any) => {
            // dataUserInfo.dataSelectRole.model = response.role;
            dataUserInfo.form = {

                id: response.id || null,
                first_name: response.first_name || null,
                second_name: response.second_name || null,
                last_name: response.last_name || null,
                second_last_name: response.second_last_name || null,
                identification_type: response.identification_type || null,
                identification_number: response.identification_number || null,
                country: response.country?.id || null,
                department: response.department?.id || null,
                city: response.city?.id || null,
                address: response.address || null,
                email: response.email || null,
                active: response.is_active || null,
                birthday: response.date_of_birth || null,
                dependence: response.dependence?.name || null,
                phone_number: response.phone_number || null,
                role: response.role?.name || null

            }

            getParentDependences();
            if (response.dependence.code != '') dataUserInfo.dataSelectDependence.model = response.dependence.code;
            if (response.role.id != '') dataUserInfo.dataSelectRole.model = response.role.id;
            if (response.identification_type.code != '') dataUserInfo.dataSelectIdentificationType.model = response.identification_type.code;
            if (response.country.id != '') dataUserInfo.dataSelectCountry.model = response.country.id;
            if (response.country.id != '') dataUserInfo.dataSelectCountry.options[0] = response.country.name;
            if (response.department.id != '') dataUserInfo.dataSelectDepartment.model = response.department.id;
            if (response.department.id != '') dataUserInfo.dataSelectDepartment.options[0] = response.department.name
            if (response.city.id != '') dataUserInfo.dataSelectCity.model = response.city.id;
            if (response.city.id != '') dataUserInfo.dataSelectCity.options[0] = response.city.name
            if (response.country.id) {
                await getDataDepartments(response.country.id);
            }
            if (response.department.id) {
                await getDataCities(response.department.id);
            }
        })
        .catch((error: any) => {
            console.error();
        })
}

async function getDataCountries() {

    const arrayData: any = [];
    try {
        const response = await LocalizationServices.getCountries()


        if (response.error) {
            console.error('error usuario', response.data);
        }
        response.response.forEach((element: any) => {
            arrayData.push({
                value: element.id,
                label: element.name
            });
        });
        dataUserInfo.dataSelectCountry.options = arrayData;

    } catch (error) {
        console.error(error, 'error selectDependenceInputChange');
        dataUserInfo.dataSelectCountry.options = [];
    }

}


async function getDataDepartments(countryId = null) {
    LocalizationServices.getCountriesStates(countryId)
        .then(async (response: any) => {
            dataUserInfo.dataSelectDepartment.options = response.response.map((data: any) => ({
                value: data.id,
                label: data.name
            }))
        })
        .catch((error: any) => {
            console.error(error)
            openModalAlert('something_happened_try_later')
        })
}

async function getDataCities(departmentId = null) {
    const arrayData: any = [];

    try {
        const response = await LocalizationServices.getStatesCities(departmentId);

        if (response.error) {
            console.error('error usuario', response.data);
        }
        response.response.forEach((element: any) => {
            arrayData.push({
                value: element.id,
                label: element.name
            });
        });
        dataUserInfo.dataSelectCity.options = arrayData;
    } catch (error) {
        console.error(error, 'Error en getDataDepartments');
        dataUserInfo.dataSelectDepartment.options = [];
    }
}


async function setDataSelectCountry(data: any, label: any) {

    dataUserInfo.form.country = label

    const arrayData: any = [];
    try {
        const response = await LocalizationServices.getCountriesStates(data)
        if (response.error) {
            console.error('error usuario', response.data);
        }

        response.response.forEach((element: any) => {
            arrayData.push({
                value: element.id,
                label: element.name
            });
        });

        dataUserInfo.dataSelectDepartment.options = arrayData;
        dataUserInfo.dataSelectDepartment.disabled = false;
        dataUserInfo.dataSelectCity.options = arrayData;
        dataUserInfo.dataSelectCity.disabled = false;
    } catch (error) {
        console.error(error, 'error selectDependenceInputChange');
        dataUserInfo.dataSelectDepartment.options = [];
        dataUserInfo.dataSelectDepartment.disabled = true;
        dataUserInfo.dataSelectCity.options = [];
        dataUserInfo.dataSelectCity.disabled = true;

    }

}

async function setDataSelectDepartament(data: any, label: string) {

    dataUserInfo.form.department = label

    const arrayData: any = [];
    try {
        const response = await LocalizationServices.getStatesCities(data)
        if (response.error) {
            console.error('error usuario', response.data);
        }

        response.response.forEach((element: any) => {
            arrayData.push({
                value: element.id,
                label: element.name
            });
        });

        dataUserInfo.dataSelectCity.options = arrayData;
        dataUserInfo.dataSelectCity.disabled = false;
    } catch (error) {
        console.error(error, 'error selectDependenceInputChange');
        dataUserInfo.dataSelectCity.options = [];
        dataUserInfo.dataSelectCity.disabled = true;

    }

}

function setDataSelectCity(data: any, label: any) {
    dataUserInfo.form.city = label
}

function openModalAlert(text: string): void {
    dataUserInfo.dataModalAlert.isActive = 'show';
    dataUserInfo.dataModalAlert.dataText.text = text;
}

function closeModalAlert() {
    dataUserInfo.dataModalAlert.isActive = 'hidde';
    dataUserInfo.dataModalAlert.dataText.text = '';
}

function openModalConfirmation(text: string): void {
    dataUserInfo.dataModalConfirmation.isActive = 'show';
    dataUserInfo.dataModalConfirmation.dataText.text = text;
    getDataUser();

}

function closeModalConfirmation() {
    dataUserInfo.dataModalConfirmation.isActive = 'hidde';
    dataUserInfo.dataModalConfirmation.dataText.text = '';
}

</script>

<style scoped src="./UserInfo.page.scss"></style>