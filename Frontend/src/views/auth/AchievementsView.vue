<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import {useRoute} from "vue-router";

interface Achievement {
  id: number;
  name: string;
  description: string;
  image_url: string;
  date_earned: string | null;
  is_earned: number;
}

const route = useRoute();
const achievements = ref<Achievement[]>([]);
const isLoading = ref(true);
const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const fetchAchievements = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${backendUrl}/api/users/me/achievements`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to load achievements.');

    const data = await response.json();
    achievements.value = data.badges;
  } catch (err) {
    console.error("Error fetching achievements:", err);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

onMounted(() => {
  fetchAchievements();
});

watch(
    () => route.path,
    () => {
      if (route.name === 'achievements') {
        fetchAchievements();
      }
    }
);
</script>

<template>
  <section class="content-container">
    <div class="achievements-pane">
      <div v-if="isLoading" class="achievements-loading">Loading achievements...</div>

      <div v-else class="achievements-grid-layout">
        <div
            v-for="badge in achievements"
            :key="badge.id"
            class="dashboard-badge-card"
            :class="{ 'badge-locked': !badge.is_earned }"
        >
          <div class="badge-visual-container">
            <!-- Obrázek odznaku načtený z backendu -->
            <img
                :src="badge.image_url"
                :alt="badge.name"
                class="badge-render-img"
            />
            <!-- Malý zámeček pro uzamčené odznaky -->
            <div v-if="!badge.is_earned" class="badge-lock-indicator">🔒</div>
          </div>

          <div class="badge-text-details">
            <h4>{{ badge.name }}</h4>
            <p>{{ badge.description }}</p>

            <!-- Zobrazení stavu (Získané vs Uzamčené) -->
            <span v-if="badge.is_earned" class="badge-date-tag">
            Earned: {{ formatDate(badge.date_earned) }}
          </span>
            <span v-else class="badge-locked-tag">Locked</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-container {
  margin: 2rem;
}

.achievements-pane {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1200px;

  animation: fadeIn 0.3s ease-in-out;
}

.achievements-grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  padding: 10px 0;
}

.dashboard-badge-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
}

.dashboard-badge-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.badge-visual-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
}

.badge-render-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.dashboard-badge-card.badge-locked .badge-render-img {
  filter: grayscale(100%);
  opacity: 0.4;
}

.badge-lock-indicator {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: #1f2937;
  color: #ffffff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.badge-text-details h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 6px 0;
}

.badge-text-details p {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 15px 0;
  min-height: 36px;
  line-height: 1.3;
}

.badge-date-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #16a34a;
  background: #f0fdf4;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid #bbf7d0;
}

.badge-locked-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>