<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Course {
  id: number;
  title: string;
  description: string;
  image_url: string;
  tag?: string;
  progress?: number; // Číslo pro šířku progress baru (0-100)
  author: string;   // Jméno autora z JOINu tabulky users
  status: string;   // Textový status vygenerovaný z CASE podmínky v SQL
}

defineProps<{
  course: Course;
  showProgress?: boolean;
  isAuthor?: boolean;
}>();

const router = useRouter();

const goToCourse = (courseId: number) => {
  router.push({ name: 'course-detail', params: { id: courseId } });
};

</script>

<template>
  <div class="course-card" @click="goToCourse(course.id)">
    <!-- Obrázek s tagem a progress overlayem -->
    <div class="card-image-wrapper">
      <div class="course-thumbnail-box" :style="{ backgroundImage: `url(${course.image_url})` }">
        <span class="card-author-tag">Category</span>

      <!-- Tag (např. coding) -->
      <span v-if="course.tag" class="card-tag">{{ course.tag }}</span>

      <!-- Progress Bar Overlay (pouze pro sekci In Progress) -->
      <div v-if="showProgress && course.progress !== undefined" class="progress-overlay">
        <span class="progress-percentage">{{ course.progress }}%</span>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" :style="{ width: course.progress + '%' }"></div>
        </div>
      </div>
      </div>
    </div>

    <!-- Obsah karty -->
    <div class="card-content">
      <h4 class="course-title">{{ course.title }}</h4>
      <p class="course-description">{{ course.description }}</p>

      <!-- Spodní řádek s autorem a statusem -->
      <div class="card-footer">
        <span class="course-author">Created by: <strong>{{ course.author }}</strong></span>
        <span v-if="course.status" class="course-status">{{ course.status }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.course-card {
  cursor: pointer;
  background: var(--background-white);
  border: 1px solid #c5c5c5;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  width: 260px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.course-card:hover {
  //transform: translateY(-4px);
  //box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-image-wrapper {
  position: relative;
  height: 170px;
  width: 100%;
  //background-color: #f1f5f9;
  padding: 12px 12px 0 12px;
}

.course-thumbnail-box {
  position: relative;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  object-fit: cover;
  border-radius: 5px;
  padding: 8px;
  overflow: hidden;
}

.card-author-tag {
  background: rgba(15, 23, 42, 0.8);
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.card-tag {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
}

/* Stylování progress baru přes obrázek */
.progress-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.progress-percentage {
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
}

.progress-bar-bg {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #ffffff;
}

/* Textový obsah */
.card-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  & > * {
    padding: 0 4px;
  }
}

.course-title {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: var(--text-black);
}

.course-description {
  height: 44px;
  font-size: 12px;
  color: #64748b;
  margin: 0 0 16px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Patička karty */
.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
}

.course-author {
  font-size: 11px;
  color: var(--text-black);
}

.course-status {
  font-size: 10px;
  color: #94a3b8;
  border: 1px solid #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
  background: #f8fafc;
}
</style>