<script setup lang="ts">
import CourseCard from './CourseCard.vue';
import {router} from "../router";

interface Course {
  id: number;
  title: string;
  description: string;
  image_url: string;
  tag?: string;
  progress?: number;
  author: string;
  status: string;
}

defineProps<{
  title: string;
  subtitle?: string;
  courses: Course[];
  showProgress?: boolean;
  showCreateButton?: boolean;
  isLoading?: boolean;
}>();
</script>

<template>
  <section class="dashboard-section">
    <!-- Hlavička sekce -->
    <div class="section-header">
      <div class="header-titles">
        <div class="title-wrapper">
          <h2 class="section-title">{{ title }}</h2>
          <button class="more-button">more &gt;</button>
        </div>
<!--        <h3 v-if="subtitle" class="section-subtitle">{{ subtitle }}</h3>-->
        <h3 class="section-subtitle">
          <slot name="subtitle"></slot>
        </h3>
      </div>

      <button
          v-if="showCreateButton"
          @click="router.push({ name: 'create-course' })"
          class="create-course-btn"
      >
        Create a New Course
      </button>
    </div>

    <!-- Stav načítání – schová pouze karty v této konkrétní sekci -->
    <div v-if="isLoading" class="section-loading">
      Načítám kurzy...
    </div>

    <!-- Mřížka kurzů -->
    <div class="courses-grid">
      <CourseCard
          v-for="course in courses"
          :key="course.id"
          :course="course"
          :show-progress="showProgress"
      />
    </div>
  </section>
</template>

<style scoped>
.dashboard-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3rem 0;
  margin: 0 auto;
  max-width: 1200px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Zarovnání prvků do jedné roviny */
  margin-bottom: 24px;
}

.title-wrapper {
  display: flex;
  gap: 1rem;
  justify-content: start;
  align-items: end;
}

.header-left-side {
  display: flex;
  align-items: center;
  gap: 16px; /* Mezera mezi "Created" a "more >" */
}

.section-title {
  //font-weight: 500;
  color: var(--text-black);
  margin: 0;
}

.section-subtitle {
  margin: 1rem 0;
}

.section-subtitle :deep(a) {
  font-size: inherit;
  color: var(--accent);
  text-decoration: none;
  font-weight: 700;
}

.more-button {
  background: var(--background-white);
  border: 2px solid #a3a3a3;
  padding: 6px 14px;
  border-radius: 6px;
  font-family: "Raleway", serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-black);
}

.more-button:hover {
  background: #f8fafc;
}

/* Zelené tlačítko přesně podle vašeho obrázku */
.create-course-btn {
  background-color: var(--accent);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.create-course-btn:hover {
  background-color: #215c24;
}

.section-loading {
  padding: 40px;
  text-align: center;
  color: #64748b;
  border: 1px dashed #e2e8f0;
  border-radius: 12px;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(260px, 1fr));
  //grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  gap: 20px;


}
</style>