import {createRouter, createWebHistory} from "vue-router";
import HomeView from "../views/public/HomeView.vue";
import CoursesView from "../views/public/CoursesView.vue";
import CommunitiesView from "../views/public/CommunitiesView.vue";

import LoginView from "../views/public/LoginView.vue";
import SignupView from "../views/public/SignupView.vue";

import DashboardView from "../views/auth/DashboardView.vue";
import CreateCourseView from "../views/auth/CreateCourseView.vue";

import WorkInProgressView from "../views/public/WorkInProgressView.vue";
import CourseDetailView from "../views/auth/CourseDetailView.vue";
import CourseStudyView from "../views/auth/CourseStudyView.vue";
import CourseManageView from "../views/auth/CourseManageView.vue";
import AchievementsView from "../views/auth/AchievementsView.vue";
import FavoriteCoursesView from "../views/auth/FavoriteCoursesView.vue";
import TeachOnSaberView from "../views/auth/TeachOnSaberView.vue";

const routes = [
  {
    path: '/',
    component: () => import('../layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'courses', name: 'courses', component: CoursesView },
      { path: 'communities', name: 'communities', component: CommunitiesView },
      { path: 'login', name: 'login', component: LoginView, meta: { hideFooter: true }  },
      { path: 'signup', name: 'signup', component: SignupView, meta: { hideFooter: true }  },
    ]
  },

  // 2. DASHBOARD / AUTH SEKCE (Všechno uvnitř používá AuthLayout s bílým headerem)
  {
    path: '/dashboard',
    component: () => import('../layouts/AuthLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'my-courses' } },

      // VNOŘENÁ SKUPINA - Tyto adresy mají v sobě navíc ČERNÝ PROUŽEK DASHBOARDU
      {
        path: '', // Prázdná cesta znamená, že adresy budou navazovat přímo: /dashboard/my-courses
        component: () => import('../layouts/DashboardLayout.vue'),
        children: [
          { path: 'my-courses', name: 'my-courses', component: DashboardView },
          { path: 'favorites', name: 'favorites', component: FavoriteCoursesView },
          { path: 'wishlist', name: 'wishlist', component: WorkInProgressView },
          { path: 'certifications', name: 'certifications', component: WorkInProgressView },
          { path: 'achievements', name: 'achievements', component: AchievementsView },
        ]
      },

      { path: '/find-courses', name: 'find-courses', component: WorkInProgressView },
      { path: '/subscribe', name: 'subscribe', component: WorkInProgressView },
      { path: '/teach', name: 'teach', component: TeachOnSaberView },

      { path: 'create-course', name: 'create-course', component: CreateCourseView },
      { path: 'course/:id', name: 'course-detail', component: CourseDetailView, props: true },
        // Způsobí, že ID z URL adresy se automaticky předá do komponenty jako vlastnost (prop)
      { path: '/course/:id/learn', name: 'course-study', component: CourseStudyView, meta: { hideFooter: true }  },
      { path: 'course/:id/manage', name: 'course-manage', component: CourseManageView, props: true, meta: { hideFooter: true }  }
    ]
  },

  // 3. SAMOSTATNÉ STRÁNKY NA ČISTÉM POZADÍ (Blank Layout)
  // ◄── STRÁNKA 2: STUDIJNÍ REŽIM (mimo všechny layouty, absolutně čisté pozadí)




  {
    // Zachytí jakoukoliv neexistující adresu (např. /subscribe, /support)
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: WorkInProgressView
  }
];

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// HLAVNÍ STRÁŽCE ROUTOVÁNÍ (Navigation Guard)
router.beforeEach((to, _from) => {
  const isAuthenticated = !!localStorage.getItem("auth_token");

  // Pokud stránka vyžaduje přihlášení a uživatel přihlášen není
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: "login" };
  }
});
