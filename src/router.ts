import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import authGuard from './guards/authGuard.guard';
import { isAuth } from './guards/isAuth.guard';
import userAccess from './guards/userAccess.guard';
import GeneralSearchPage from './components/pages/general-search/GeneralSearch.page.vue';
import hasPermissions from './guards/hasPermissions.guard';
import Test from './components/pages/Test.vue';
import ZonaAmer from './components/pages/ZonaAmer.page.vue';

// Pre login
const Home = () => import('./components/pages/home/Home.page.vue');
/* 
const Home = () => import('./components/pages/home/Home.page.vue');
const SendVerificationCode = () => import('./components/pages/send-verification-code/SendVerificationCode.page.vue');
const ResetPassword = () => import('./components/pages/reset-password/ResetPassword.page.vue');
const CorrespondenceWebPage = () => import('./components/pages/correspondence-web/CorrespondenceWeb.page.vue');
const ConsultationRecordPage = () => import('./components/pages/consultation-record/ConsultationRecord.page.vue');

// Inside home Module
const Dashboard = () => import('./components/pages/dashboard/Dashboard.page.vue');
const Profile = () => import('./components/pages/profile/Profile.page.vue');

// Correspondence Module
const CorrespondenceReceived = () => import('./components/pages/correspondence-received/CorrespondenceReceived.page.vue');
const CorrespondenceReceivedExu = () => import('./components/pages/correspondence-received-exu/CorrespondenceReceivedExu.page.vue');
const CorrespondenceSent = () => import('./components/pages/correspondence-sent/CorrespondenceSent.page.vue');
const CorrespondenceEmail = () => import('./components/pages/correspondence-email/CorrespondenceEmail.page.vue');
const Historical = () => import('./components/pages/historical/Historical.page.vue');
const Filing = () => import('./components/pages/filing/Filing.page.vue');

// Files Records Module
const Files = () => import('./components/pages/files/Files.page.vue');
const CentralFiles = () => import('./components/pages/central-files/CentralFiles.page.vue');
const HistoricalFiles = () => import('./components/pages/historical-files/HistoricalFiles.page.vue');
const UploadFiles = () => import('./components/pages/upload-files/UploadFiles.page.vue');
const Records = () => import('./components/pages/records/Records.page.vue');
const File = () => import('./components/pages/file/file.page.vue')
const Record = () => import('./components/pages/record/Record.page.vue');
const FilesJson = () => import('./components/pages/files/FilesJson.page.vue')
const Portfolio = () => import('./components/pages/portfolio/Portfolio.page.vue');

// Administration Tenant Module
const Entities = () => import('./components/pages/entities/Entities.page.vue');
const Entity = () => import('./components/pages/entity/Entity.page.vue');
const User = () => import('./components/pages/user/User.page.vue');
const UserInfo = () => import('./components/pages/user-info/UserInfo.page.vue');
const Dependence = () => import('./components/pages/dependences/Dependences.page.vue');
const Roles = () => import('./components/pages/roles/Roles.page.vue');
const Role = () => import('./components/pages/role/Role.page.vue');
const TypesFiling = () => import('./components/pages/types-filing/TypeFiling.page.vue');
const EmailConfiguration = () => import('./components/pages/email-configuration/EmailConfiguration.page.vue');
// const TypeFiling = () => import('./components/pages/type-filing/TypeFiling.page.vue');

// TRD Module
const Series = () => import('./components/pages/series/Series.page.vue');
const Subseries = () => import('./components/pages/subseries/Subseries.page.vue');
const TypeDocumental = () => import('./components/pages/type-documental/TypeDocumental.page.vue');
const Trd = () => import('./components/pages/trd/Trd.page.vue'); */

//Definition routes - it about BD of Backend
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  }

  ,
  {
    path: '/test',
    component: Test
  },
  {
    path: '/slc-enterprice',
    component: ZonaAmer
  }


  ,
  /* 
  {
    path: '/login/:user?',
    component: Login,
    beforeEnter: isAuth
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
      // Inside home Module
      {
        path: '/home',
        redirect: '/home/dashboard'
      },
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

      // Correspondence Module
      {
        path: 'correspondence',
        beforeEnter: [userAccess],
        children: [
          {
            path: 'received',
            component: CorrespondenceReceived,
            meta: { permission: 'view_record' },
          },
          {
            path: 'requests',
            component: CorrespondenceSent,
            meta: { permission: 'view_sent' },
          },
          {
            path: 'my-requests',
            component: CorrespondenceReceivedExu,
            meta: { permission: 'view_accepted_user' },
          },
          {
            path: 'email',
            component: CorrespondenceEmail,
            meta: { permission: 'view_email' },
          },
          {
            path: 'historical',
            component: Historical,
            meta: { permission: 'view_historical' },
          },
          {
            path: '/:pathMatch(.*)*',
            redirect: '/home/dashboard'
          }
        ]
      },
      {
        path: 'filing/:id',
        component: Filing,
        meta: { permission: 'view_filing' },
      },

      // Files Records Module
      {
        path: 'files_records',
        beforeEnter: [userAccess],
        children: [
          {
            path: '',
            component: Files,
            meta: { permission: 'view_files' },
          },
          {
            path: 'central_files',
            component: CentralFiles,
            meta: { permission: 'view_central_files' },
          },
          {
            path: 'historical_files',
            component: HistoricalFiles,
            meta: { permission: 'view_historical_files' },
          },
          {
            path: ':id',
            component: File,
            meta: { permission: 'view_files' },
          },
          {
            path: 'upload_files',
            component: UploadFiles,
            meta: { permission: ['create_file', 'charge_massive_file'] },
          },
          {
            path: 'records',
            component: Records,
            meta: { permission: 'view_records' },
          },
          {
            path: 'search-files',
            component: FilesJson,
            meta: { permission: 'view_search_files' },
          },
          {
            path: 'folders',
            component: Portfolio,
            meta: { permission: 'view_records' }, // Add the appropriate permission here
          },
          {
            path: '/:pathMatch(.*)*',
            redirect: '/home/dashboard'
          }
        ]
      },
      {
        path: 'record/:id',
        component: Record
      },

      // Administration Tenant Module
      {
        path: 'administration-tenant',
        beforeEnter: [userAccess],
        children: [
          {
            path: 'entities',
            component: Entities,
            meta: { permission: 'view_entities' },
          },
          {
            path: 'entity',
            component: Entity,
            meta: { permission: 'view_entities' },
          },
          {
            path: 'entity/:id',
            component: Entity,
            meta: { permission: 'view_entities' },
          },
          {
            //! Must be imporve User is a view of list users, not a just one.
            path: 'users',
            component: User,
            meta: { permission: 'view_users' },
          },
          {
            path: 'user/:id',
            component: UserInfo,
            meta: { permission: 'view_users' },
          },
          {
            path: 'email-configuration',
            component: EmailConfiguration,
            meta: { permission: 'view_emails_connections' },
          },
          {
            path: '/:pathMatch(.*)*',
            redirect: '/home/dashboard'
          }
        ]
      },
      {
        path: 'dependences',
        beforeEnter: [userAccess],
        component: Dependence,
        meta: { permission: 'view_dependences' },
      },
      {
        path: 'roles',
        beforeEnter: [userAccess],
        component: Roles,
        meta: { permission: 'view_roles' },
      },
      {
        path: 'role/:id',
        beforeEnter: [userAccess],
        component: Role,
        meta: { permission: 'view_roles' },
      },
      {
        path: 'role',
        beforeEnter: [userAccess],
        component: Role,
        meta: { permission: 'view_roles' },
      },
      {
        path: 'type_of_filing',
        beforeEnter: [userAccess],
        component: TypesFiling,
        meta: { permission: 'view_type_of_filing' },
      },

      // TRD Module
      {
        path: 'series',
        component: Series,
        meta: { permission: 'view_series' },
      },
      {
        path: 'subseries',
        component: Subseries,
        meta: { permission: 'view_subseries' },
      },
      {
        path: 'type_documental',
        component: TypeDocumental,
        meta: { permission: 'view_type_documental' },
      },
      {
        path: 'trd',
        component: Trd,
        meta: { permission: 'view_trd' },
      },

      // other
       {
         path: 'test',
         component: Test
       },
      
      {
        path: '/:pathMatch(.*)*',
        redirect: '/home/dashboard'
      }
    ]
  },*/

  {
    path: '/:pathMatch(.*)*',
    redirect: '/test'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiredPermissions = to.meta.permission;

  if (requiredPermissions) {
    const permissionsArray = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    const hasPermission = permissionsArray.some(permission => hasPermissions.validator(permission));

    if (!hasPermission) {
      return next('/home/dashboard');
    }
  }

  next();
});

export default router;