<template >
    <HomeTemplate :dataHomeTemplate="dataHomeTemplate"/>
</template>
<script setup lang="ts">
import HomeTemplate from "../../templates/home/Home.template.vue";
import { onBeforeMount, onBeforeUnmount, onMounted, reactive } from "vue";
import LoginService from "../../../services/testService"; //TODO MUST BE IMPROVE OR UPDATE !!!!!!!
import UserService from "../../../services/UserServices";
import { useRouter } from "vue-router";
import { accessStore } from '../../../store/index';
import constants from "../../../constants/index";


const router = useRouter();
const store = accessStore();
const dataHomeTemplate: any = reactive({
  askDocugate: false,
  dataHeaderOrganism: {
    dataUserMenuHeader: {
      classUserMenuHeader: "",
      dataUserListMenuHeader: {
        class: "",
        redirectEditPerfil: () => { },
        logOut: () => { },
      },
      dataText: {
        classText: "",
        text: "Email",
        disabled: false,
        onClick: () => { },
      },
      dataImg: {
        id: "",
        name: "password",
        class: "",
        src: "",
        type: "png",
        alt: "",
        disabled: false,
        onClick: () => { },
      },
      showMenu: () => { },
    },
    dataImgLogo: {
      id: "",
      name: "",
      class: "all-space",
      src: "/logos/docugate-ai-bwhite.svg",
      type: "png",
      alt: "",
      onClick: () => { },
    },
    dataInputSearch: {
      dataInput: {
        id: "",
        name: "",
        classInputEmail: "",
        model: "",
        type: "",
        placeholder: "ask_docugate",
        disabled: false,
        onClick: () => {
          redirectToSearch();
         },
      },
      dataImg: {
        id: "",
        name: "",
        class: " icon",
        src: "/icon-lupa-general.svg",
        type: "",
        alt: "",
        onClick: () => { dataHomeTemplate.askDocugate = true; },
      },
    },
    dataNavegationOptionsHeader: {
      enable: true,
      dataCardNotificationsCalendar: {
        isActive: false,

        dataText: {
          classText: "",
          text: "",
          disabled: false,
          onClick: () => { router.push('home/correspondence') },
        },
        dataImg: {
          id: "",
          name: "",
          class: " icon",
          src: "/icon-header-calendario.svg",
          type: "png",
          alt: "",
          onClick: () => { },
        },
        onClick: () => {
          router.push('/home/dashboard')

        }
      },
      dataCardNotificationsInbox: {
        isActive: false,
        dataText: {
          classText: "",
          text: "2",
          disabled: false,
          onClick: () => {


          },
        },
        dataImg: {
          id: "",
          name: "",
          class: " icon",
          src: "/icon-header-bandeja-cards.svg",
          type: "png",
          alt: "",
          onClick: () => { },
        },
        onClick: () => {
          router.push('/home/correspondence/received')

        }
      },
      dataCardNotificationsGeneral: {
        isActive: false,
        dataText: {
          classText: "",
          text: "",
          disabled: false,
          onClick: () => { },
        },
        dataImg: {
          id: "",
          name: "",
          class: " icon",
          src: "/icon-header-campana-notificaciones.svg",
          type: "png",
          alt: "",
          onClick: () => { },
        },
        onClick: () => {

        }
      },
      dataCardNotificationsConfig: {
        isActive: false,
        dataText: {
          classText: "",
          text: "",
          disabled: false,
          onClick: () => {
          },
        },
        dataImg: {
          id: "",
          name: "",
          class: " icon",
          src: "/icon-header-configuracion.svg",
          type: "png",
          alt: "",
          onClick: () => {
          },
        },
        onClick: () => {
          router.push('/home/administration-tenant/entities')
        }
      },
    },
    dataMenuConfigHeader: { //THIS MENU WAS DELETE FROM VIEW, ITS USELESSS
      isActive: false,
      isActiveTRD: false,
      onClickDependences: () => {
        router.push("/home/dependences");
        dataHomeTemplate.dataHeaderOrganism.dataMenuConfigHeader.isActive = false; //Close menu after click
      },
      onClickUsers: () => {
        router.push("/home/user");
        dataHomeTemplate.dataHeaderOrganism.dataMenuConfigHeader.isActive = false;
      },
      onClickRoles: () => {
        router.push("/home/roles");
        dataHomeTemplate.dataHeaderOrganism.dataMenuConfigHeader.isActive = false;
      },
      onClickTrd: () => {
        dataHomeTemplate.dataHeaderOrganism.dataMenuConfigHeader.isActiveTRD = true;
      }

    },
    entrepriceLogo: '/logos/logo-Suntic2.png',
  },
  dataFooterOrganism: {
    isLogged: true,
  },
  dataMenu: {
    path: {}
  },
});



/**
 * 
 * TODO ############### FUNCTIONS ###############
 */
onBeforeMount(() => {
  setDataHeader();
});

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  const userData = await LoginService.getMe();
  if (userData) {
    store.userData = userData; 
    getModulesMenu(store.userData);
    getUserLogged();
  } else {
    console.error("Error al obtener los datos del usuario");
    logOut(); 
  }
});



onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

function getUserLogged() {
  UserService.getMe()
    .then((response: any) => {
      store.setIdUser(response.id);
      store.setEmailUser(response.email)
      dataHomeTemplate.dataHeaderOrganism.dataUserMenuHeader.dataText.text = response.first_name;
    })
    .catch((error: any) => {
      console.error(error);
    })
}

function getModulesMenu(user: any) {
  const socket = new WebSocket(constants["DEFAULT_WEB_SOCKET_URL"]);
  socket.onopen = () => {
    console.log('WebSocket connection established');

    socket.send(JSON.stringify({
      id: user.id, 
      email: user.email, 
      role: user.role
    }));
  };

  // Evento cuando se recibe un mensaje
  socket.onmessage = (event) => {
    const response = JSON.parse(event.data);

    if (response.status === 'success') {
      if (response.response.notification_type === 'assigned_record') {
        console.log(response);
        
        console.log(`Se ha asignado el record ${response.response.record_id} al usuario!`);
        return;
      }

      const arrayDataMenu: any[] = [];
      localStorage.setItem('permits', response.response.permits);
      response.response.modules.map((data: any, index:any) => {
        if (data != null) {
          arrayDataMenu.push({
            ...data,
            state: false,
            templateColor: store.getColor()[index]?.template //templateAzul
          });
        }
      });
      dataHomeTemplate.dataMenu.path = arrayDataMenu;
    } else {
      console.error('Error in WebSocket response:', response.message);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}



function setDataHeader() {
  dataHomeTemplate.dataHeaderOrganism.dataUserMenuHeader = {
    classUserMenuHeader: "",
    dataUserListMenuHeader: {
      class: "",
      redirectEditPerfil: () => {
        router.push("/home/profile");

      },
      logOut: () => {
        logOut();
      },
    },
    dataText: {
      classText: "bold",
      text: "Andres Diaz",
      disabled: false,
      onClick: () => { },
    },
    dataImg: {
      id: "",
      name: "password",
      class: "icon-user",
      src: "/user.png",
      type: "png",
      alt: "",
      disabled: false,
      onClick: () => { },
    },
    showMenu: () => {
      dataHomeTemplate.dataHeaderOrganism.dataUserMenuHeader.classUserMenuHeader =
        "focused";
      dataHomeTemplate.dataHeaderOrganism.dataUserMenuHeader.dataUserListMenuHeader.class =
        "show";
    },
  };
}




function logOut() {
  LoginService.logOut().finally(() => {

    router.push("/login"); //  -- --- -- - - - TEMPORALY - - -- -- - - 

  });
}

function handleClickOutside(event: any) {
  const menuHeader = document.getElementById("menuHeader");
  if (menuHeader && !menuHeader.contains(event.target)) {
    // El clic ocurrió fuera de la sección
    dataHomeTemplate.dataHeaderOrganism.dataUserMenuHeader.classUserMenuHeader =
      "";
    dataHomeTemplate.dataHeaderOrganism.dataUserMenuHeader.dataUserListMenuHeader.class =
      "";
  }
}

function redirectToSearch() {
  router.push("/home/search");
}

</script>
<style scoped src="./Home.page.scss"></style>