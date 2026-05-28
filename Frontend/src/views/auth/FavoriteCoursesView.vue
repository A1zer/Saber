<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import CourseSection from "../../components/CourseSection.vue";

const route = useRoute();

interface Course {
  id: number;
  title: string;
  description: string;
  image_url: string;
  author: string;
  status: string;
}

const favoriteCourses = ref<Course[]>([]);
const isLoading = ref(true);
const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchFavorites = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${backendUrl}/api/courses/favorites`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to load favorite courses.');

    const data = await response.json();
    favoriteCourses.value = data.favorites;
  } catch (err) {
    console.error("Error fetching favorite courses:", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchFavorites();
});

// Watcher zajistí, že když student překlikne z "My Courses" na "Favorites", data se okamžitě stáhnou čerstvá
watch(
    () => route.path,
    () => {
      if (route.name === 'favorites') {
        fetchFavorites();
      }
    }
);
</script>

<template>
  <section class="content-container">
    <div class="favorites-pane">
      <div v-if="isLoading" class="favorites-loading">Loading your favorite courses...</div>

      <div v-else-if="favoriteCourses.length === 0" class="no-favorites-box">
        <div class="star-empty-icon">☆</div>
        <h3>Your favorites list is empty</h3>
        <p>Explore our library and click "Add to favorites" on courses you love!</p>
      </div>

      <!--    <div v-else class="courses-grid-layout">-->
      <!--      &lt;!&ndash; Opakování karet kurzů podle vašeho designu &ndash;&gt;-->
      <!--      <div-->
      <!--          v-for="course in favoriteCourses"-->
      <!--          :key="course.id"-->
      <!--          class="course-card-item"-->
      <!--          @click="goToCourseDetail(course.id)"-->
      <!--      >-->
      <!--        <div class="course-thumbnail-box" :style="{ backgroundImage: `url(${course.image_url})` }">-->
      <!--          <span class="card-author-tag">By {{ course.author }}</span>-->
      <!--        </div>-->
      <!--        <div class="course-card-details">-->
      <!--          <h4>{{ course.title }}</h4>-->
      <!--          <p class="course-card-desc">{{ course.description }}</p>-->
      <!--          <div class="card-footer-action">-->
      <!--            <span class="view-course-link">View Details &rarr;</span>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--    </div>-->
      <CourseSection
          title="My Favorites"
          subtitle="Top courses in Creative & Tech"
          :courses="favoriteCourses"
          :is-loading="isLoading"
      >
      </CourseSection>
    </div>
  </section>
</template>

<style scoped>
.favorites-pane {
  margin-top: 20px;
  animation: fadeIn 0.3s ease-in-out;
}

.courses-grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  padding: 10px 0;
}

.course-card-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.course-card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.course-thumbnail-box {
  height: 160px;
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 15px;
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

.course-card-details {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.course-card-details h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 10px 0;
}

.course-card-desc {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.4;
  margin: 0 0 20px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
}

.card-footer-action {
  border-top: 1px solid #f1f5f9;
  padding-top: 15px;
  text-align: right;
}

.view-course-link {
  font-size: 0.85rem;
  font-weight: 700;
  color: #2563eb;
}

.no-favorites-box {
  text-align: center;
  padding: 60px 20px;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  max-width: 500px;
  margin: 40px auto;
}

.star-empty-icon {
  font-size: 3.5rem;
  color: #94a3b8;
  margin-bottom: 15px;
}

.no-favorites-box h3 {
  font-size: 1.3rem;
  color: #334155;
  margin: 0 0 8px 0;
}

.no-favorites-box p {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>