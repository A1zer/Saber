<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import WeeklyStreakCard from "../../components/WeeklyStreakCard.vue";
import CourseSection from "../../components/CourseSection.vue";

const router = useRouter();
const route = useRoute();

// Reaktivní proměnné, kam se uloží data z databáze
const createdCourses = ref([]);
const inProgressCourses = ref([]);
const completedCourses = ref([]);
const publicCourses = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

const canCreateCourses = ref(false);
const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Funkce, která okamžitě stáhne personalizovaná data pro přihlášeného uživatele
const fetchDashboardData = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem("auth_token");

    // 1. Zjistíme informace o přihlášeném uživateli z opraveného /me endpointu
    const meResponse = await fetch(`${backendUrl}/api/users/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (meResponse.ok) {
      const userData = await meResponse.json();
      // Uložíme si hodnotu true/false, kterou posílá backend
      canCreateCourses.value = userData.canCreateCourses;
    }

    // 2. Stáhneme kurzy pro dashboard
    const response = await fetch(`${backendUrl}/api/courses/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Nepodařilo se načíst vaše kurzy z databáze.');
    }

    const data = await response.json();

    // Uložíme data z DB do reaktivních proměnných
    createdCourses.value = data.created || [];
    inProgressCourses.value = data.inProgress || [];
    completedCourses.value = data.completed || [];
    publicCourses.value = data.all || [];

  } catch (err: any) {
    console.error(err);
    errorMessage.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

// KLÍČOVÝ KROK: Spustí se OKAMŽITĚ, jakmile se stránka po přihlášení vykreslí
onMounted(() => {
  fetchDashboardData();
});

watch(
    () => route.path,
    () => {
      fetchDashboardData();
    }
);
</script>

<template>
  <div class="main-content">
    <!-- Levý navigační panel -->
    <nav class="sidebar">
      <!-- Váš obsah sidebaru -->
    </nav>

    <!-- Karta s týdenní aktivitou -->
    <div class="content-container">
      <WeeklyStreakCard />
    </div>

    <!-- Hlavní scrollovací oblast s obsahem -->
    <div class="scroll-section">
      <div class="content">

        <!-- Sekce s úspěchy -->
<!--        <section class="overview">-->
<!--          <div class="achievements">-->
<!--            <div class="achievements-header">-->
<!--              <div>-->
<!--                <h2>Recent Achievements</h2>-->
<!--              </div>-->
<!--              <div>-->
<!--                <a href="mainAchievements.html" class="button primary">View All</a>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </section>-->

        <!-- Chybová zpráva z databáze (pokud nějaká nastane) -->
        <div v-if="errorMessage" class="db-error-message">
          {{ errorMessage }}
        </div>

        <!-- 2. DYNAMICKÉ SEKCE NAHRAZUJÍCÍ STARÝ STATICKÝ KÓD -->

        <!-- Sekce 1: Created (Zobrazí zelené tlačítko a načtené vytvořené kurzy) -->
        <div class="content-container">
          <CourseSection
              v-if="canCreateCourses"
              title="Created"
              :courses="createdCourses"
              :is-loading="isLoading"
              :show-create-button="true"
              :is-author="true"
          />
        </div>

        <hr v-if="canCreateCourses" />

        <!-- Sekce 2: In Progress (Zobrazí rozpracované kurzy i s progress barem) -->
        <div class="content-container">
          <CourseSection
              title="In Progress"
              :courses="inProgressCourses"
              :is-loading="isLoading"
              :show-progress="true"
          />
        </div>

        <hr />

        <!-- Sekce 3: Discover / Our Selection (Zde zatím necháváme obecný přehled) -->

        <div class="content-container">
          <div class="discover-bg-wrapper">
            <CourseSection
                title="Discover"
                subtitle="Top courses in Creative & Tech"
                :courses="publicCourses"
                :is-loading="isLoading"
            >
              <template #subtitle>
                Top courses in <router-link to="/courses/creative-tech">Creative & Tech</router-link>
              </template>
            </CourseSection>
          </div>
        </div>

        <hr v-if="completedCourses && completedCourses.length > 0" />

        <!-- NOVÁ SEKCE: Completed (Zobrazí se pouze, pokud uživatel nějaký kurz dokončil) -->
        <div class="content-container">
          <CourseSection
              v-if="completedCourses && completedCourses.length > 0"
              title="Completed"
              :courses="completedCourses"
              :is-loading="isLoading"
              :show-progress="true"
          />
        </div>

      </div>

      <!-- Vlastní scrollbar -->
      <div class="custom-scrollbar">
        <div class="thumb"></div>
      </div>
    </div>

    <!-- Pravý panel s notifikacemi -->
<!--    <aside class="extra"><h2>Notifications</h2></aside>-->
  </div>
</template>

<style scoped>

.discover-bg-wrapper {
  background-image: url('../../assets/background_logo_light.svg');
  background-repeat: no-repeat;
  background-position: center;
}
</style>