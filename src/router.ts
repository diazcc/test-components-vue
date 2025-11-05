import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import authGuard from './guards/authGuard.guard';
import { isAuth } from './guards/isAuth.guard';
import userAccess from './guards/userAccess.guard';
import GeneralSearchPage from './components/pages/general-search/GeneralSearch.page.vue';
import hasPermissions from './guards/hasPermissions.guard';
import Test from './components/pages/Test.vue';
import { accessStore } from './store/index';
import RenderLoadingPage from './components/pages/render-loading/RenderLoading.page.vue';

const Login = () => import('./components/pages/login/Login.page.vue');
const Home = () => import('./components/pages/home/Home.page.vue');
const SendVerificationCode = () => import('./components/pages/send-verification-code/SendVerificationCode.page.vue');
const ResetPassword = () => import('./components/pages/reset-password/ResetPassword.page.vue');
const CorrespondenceWebPage = () => import('./components/pages/correspondence-web/CorrespondenceWeb.page.vue');
const ConsultationRecordPage = () => import('./components/pages/consultation-record/ConsultationRecord.page.vue');

const Dashboard = () => import('./components/pages/dashboard/Dashboard.page.vue');
const Profile = () => import('./components/pages/profile/Profile.page.vue');

const CorrespondenceReceived = () => import('./components/pages/correspondence-received/CorrespondenceReceived.page.vue');
const CorrespondenceReceivedExu = () => import('./components/pages/correspondence-received-exu/CorrespondenceReceivedExu.page.vue');
const CorrespondenceSent = () => import('./components/pages/correspondence-sent/CorrespondenceSent.page.vue');
const CorrespondenceEmail = () => import('./components/pages/correspondence-email/CorrespondenceEmail.page.vue');
const Historical = () => import('./components/pages/historical/Historical.page.vue');
const Filing = () => import('./components/pages/filing/Filing.page.vue');

const Files = () => import('./components/pages/files/Files.page.vue');
const CentralFiles = () => import('./components/pages/central-files/CentralFiles.page.vue');
const HistoricalFiles = () => import('./components/pages/historical-files/HistoricalFiles.page.vue');
const UploadFiles = () => import('./components/pages/upload-files/UploadFiles.page.vue');
const File = () => import('./components/pages/file/file.page.vue')
const Record = () => import('./components/pages/record/Record.page.vue');
const FilesJson = () => import('./components/pages/files/FilesJson.page.vue')
const Portfolio = () => import('./components/pages/portfolio/Portfolio.page.vue');

const Entities = () => import('./components/pages/entities/Entities.page.vue');
const Entity = () => import('./components/pages/entity/Entity.page.vue');
const User = () => import('./components/pages/user/User.page.vue');
const UserInfo = () => import('./components/pages/user-info/UserInfo.page.vue');
const Dependence = () => import('./components/pages/dependences/Dependences.page.vue');
const Roles = () => import('./components/pages/roles/Roles.page.vue');
const Role = () => import('./components/pages/role/Role.page.vue');
const TypesFiling = () => import('./components/pages/types-filing/TypeFiling.page.vue');
const EmailConfiguration = () => import('./components/pages/email-configuration/EmailConfiguration.page.vue');

const Series = () => import('./components/pages/series/Series.page.vue');
const Subseries = () => import('./components/pages/subseries/Subseries.page.vue');
const TypeDocumental = () => import('./components/pages/type-documental/TypeDocumental.page.vue');
const Trd = () => import('./components/pages/trd/Trd.page.vue');

const routes: RouteRecordRaw[] = [
  /* {
    path: '/',
    redirect: () => '/loading'
  }, */
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/loading',
    component: RenderLoadingPage,
  },
  {
    path: '/login/:user?',
    component: Login,
  },
  {
    path: '/new-password',
    component: ResetPassword
  },
  {
    path: '/send-verification',
    component: SendVerificationCode
  },
  {
    path: '/filing',
    component: CorrespondenceWebPage
  },
  {
    path: '/consultation-record',
    component: ConsultationRecordPage
  },
  {
    path: '/home',
    component: Home,
    meta: { requiresAuth: true },
    beforeEnter: [authGuard],
    children: [
      /* {
        path: '',
        redirect: (to) => {
          const tenant = to.params.tenant as string;
          console.log(`[ROUTER REDIRECT] Home base redirect - tenant param:`, tenant, 'full to object:', to);
          return `/${tenant}/home/dashboard`;
        }
      }, */
      {
        path: 'search',
        component: GeneralSearchPage
      },
      {
        path: 'profile',
        component: Profile
      },
      {
        path: 'dashboard',
        component: Dashboard,
        beforeEnter: userAccess,
      },

      {
        path: 'correspondence',
        children: [
          {
            path: 'received',
            component: CorrespondenceReceived,
          },
          {
            path: 'requests',
            component: CorrespondenceSent,
          },
          {
            path: 'my-requests',
            component: CorrespondenceReceivedExu,
          },
          {
            path: 'email',
            component: CorrespondenceEmail,
          },
          {
            path: 'historical',
            component: Historical,
          }
        ]
      },
      {
        path: 'filing/:id',
        component: Filing,
      },

      {
        path: 'files_records',
        children: [
          {
            path: '',
            component: Files,
          },
          /* {
            path: 'ocr_files',
            component: OCRFiles,
          }, */
          {
            path: 'central_files',
            component: CentralFiles,
          },
          {
            path: 'historical_files',
            component: HistoricalFiles,
          },
          {
            path: ':id',
            component: File,
          },
          {
            path: 'upload_files',
            component: UploadFiles,
          },
         /*  {
            path: 'records',
            component: FoldersNavigation,
          }, */
          {
            path: 'search-files',
            component: FilesJson,
          },
          {
            path: 'folders',
            component: Portfolio,
          }
        ]
      },
      {
        path: 'record/:id',
        component: Record
      },

      {
        path: 'administration-tenant',
        children: [
          {
            path: 'entities',
            component: Entities,
          },
          {
            path: 'entity',
            component: Entity,
          },
          {
            path: 'entity/:id',
            component: Entity,
          },
          {
            path: 'users',
            component: User,
          },
          {
            path: 'user/:id',
            component: UserInfo,
          },
          {
            path: 'email-configuration',
            component: EmailConfiguration,
          }
        ]
      },
      {
        path: 'dependences',
        component: Dependence,
      },
      {
        path: 'roles',
        component: Roles,
      },
      {
        path: 'role/:id',
        component: Role,
      },
      {
        path: 'role',
        component: Role,
      },
      {
        path: 'type_of_filing',
        component: TypesFiling,
      },

      {
        path: 'series',
        component: Series,
      },
      {
        path: 'subseries',
        component: Subseries,
      },
      {
        path: 'type_documental',
        component: TypeDocumental,
      },
      {
        path: 'trd',
        component: Trd,
      },

       {
         path: 'test',
         component: Test
       },
       /* {
         path: 'test-view',
         component: TestView
       }, */
      
    ]
  },
  /* {
    path: '/:pathMatch(.*)*',
    redirect: (to) => {
      console.log(`[ROUTER REDIRECT] Global catchall redirect - path:`, to.path, 'full to object:', to);
      return '/loading';
    }
  } */
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;