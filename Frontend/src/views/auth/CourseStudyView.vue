<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import { useRoute, useRouter } from 'vue-router';

import BadgeModal from '../../components/BadgeModal.vue';

const route = useRoute();
const router = useRouter();
const courseId = route.params.id;

const course = ref<any>(null);
const lessons = ref<any[]>([]);
const reviews = ref<any[]>([]);
const currentLesson = ref<any>(null); // Právě hrající lekce
const isLoading = ref(true);
const activeBottomTab = ref('overview');
const isFavorite = ref(false);

// Automaticky přepočítá procenta pokroku pokaždé, když se změní stav lekcí
const coursePercentage = computed(() => {
  if (!lessons.value || lessons.value.length === 0) return 0;

  const completedCount = lessons.value.filter(l => l.is_completed === 1).length;
  return Math.round((completedCount / lessons.value.length) * 100);
});

// Reaktivní stav pro řízení vyskakovacího okna
const isBadgeModalOpen = ref(false);
const activeBadgeData = ref<any>(null);

const videoDurations = ref<Record<number, string>>({});

// Pomocná funkce, která převede sekundy (např. 135) na formát "2:15"
const formatDuration = (seconds: number): string => {
  if (isNaN(seconds) || seconds === Infinity) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Funkce, která na pozadí otevře video soubor a bleskově vytáhne čas z hlavičky
const loadVideoDuration = (lessonId: number, videoUrl: string) => {
  if (!videoUrl) {
    videoDurations.value[lessonId] = 'Text'; // Fallback pro textové lekce / kvízy
    return;
  }

  const video = document.createElement('video');
  video.src = videoUrl;
  video.preload = 'metadata'; // DŮLEŽITÉ: Stáhne pouze kilobajty hlavičky souboru, ne celé video

  video.onloadedmetadata = () => {
    videoDurations.value[lessonId] = formatDuration(video.duration);
    video.remove(); // Vyčistíme paměť prohlížeče
  };

  video.onerror = () => {
    videoDurations.value[lessonId] = '--:--';
    video.remove();
  };
};

const toggleFavorite = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`http://localhost:3000/api/courses/${courseId}/favorite`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const result = await response.json();
      isFavorite.value = result.isFavorite; // Přepne stav podle backendu (true/false)
    }
  } catch (err) {
    console.error("Chyba při ukládání do oblíbených:", err);
  }
};

const handleVideoEnded = async (lesson: any) => {
  if (lesson.is_completed === 1) {

    // AUTOMATICKE PRESKAKOVANI
    // console.log("Tato lekce už je splněná v paměti. Pouze přepínám na další video.");

    // const currentIndex = lessons.value.findIndex(l => l.id === lesson.id);
    // if (currentIndex !== -1 && currentIndex + 1 < lessons.value.length) {
    //   currentLesson.value = lessons.value[currentIndex + 1]; // Přidáno .value
    // }
    return; // Vyskočíme, abychom zbytečně netrápili server
  }

  console.log(`Video skončilo! Automaticky ukládám pokrok pro lekci: ${lesson.title}`);

  try {
    const token = localStorage.getItem("auth_token");

    // Voláme tvé čisté REST API s metodou PUT
    const response = await fetch(`http://localhost:3000/api/courses/${courseId}/lessons/${lesson.id}/progress`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Nepodařilo se automaticky uložit pokrok.");

    const result = await response.json();

    // TENTO ŘÁDEK JE KLÍČOVÝ: Změní 0 na 1 a disabled checkbox se okamžitě zaškrtne!
    lesson.is_completed = 1;

    console.log(`Lekce úspěšně dokončena. Nový stav kurzu: ${result.percentage}%`);


    // ZPRACOVÁNÍ NOVÝCH ODZNAKŮ Z BACKENDU
    if (result.newBadges && result.newBadges.length > 0) {
      // Pokud uživatel získal více odznaků naráz (např. lekce + kurz),
      // vezmeme pro ukázku ten první. (Případně je můžete řadit do fronty).
      activeBadgeData.value = result.newBadges[0];
      isBadgeModalOpen.value = true; // Způsobí okamžité plynulé vyjetí okna
    }

    if (result.statusId === 3) {
      courseProgressState.value = 3; // Uzamkneme lokální stav proti přepisování

      // Vyhodíme slavnostní alert pro uživatele
      alert(`🎉 Congratulations! You've successfully completed the course "${course.value?.title || ''}"!`);
    }

    // const currentIndex = lessons.value.findIndex(l => l.id === lesson.id);
    // if (currentIndex !== -1 && currentIndex + 1 < lessons.value.length) {
    //   currentLesson.value = lessons.value[currentIndex + 1];
    // }


  } catch (err) {
    console.error("Chyba při automatickém ukládání:", err);
  }
};

const courseProgressState = ref<number>(1);

const fetchStudyData = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to load study environment.');

    const data = await response.json();
    course.value = data.course;
    lessons.value = data.lessons;
    reviews.value = data.reviews;

    if (data.course) {
      isFavorite.value = data.course.is_favorite === 1;

      if (data.course.progress_state_id) {
        courseProgressState.value = data.course.progress_state_id;
      }
    }

    // DYNAMICKÝ KROK: Spustíme zjištění délek pro všechny načtené lekce
    if (lessons.value && lessons.value.length > 0) {
      lessons.value.forEach((lesson: any) => {
        loadVideoDuration(lesson.id, lesson.video_url);
      });
    }

    // Jako první video automaticky pustíme první lekci v pořadí
    if (lessons.value.length > 0) {
      currentLesson.value = lessons.value[0];
    }
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const selectLesson = (lesson: any) => {
  currentLesson.value = lesson;
};

onMounted(() => {
  fetchStudyData();
});
</script>

<template>
  <div class="study-mode-wrapper">
    <div v-if="isLoading" class="study-loading">Loading classroom...</div>

    <template v-else-if="course">
      <!-- Horní černá lišta přehrávače podle Figmy -->
      <header class="study-header">
        <div class="header-left">
          <button @click="router.push({ name: 'course-detail', params: { id: courseId } })" class="exit-btn">&larr;</button>
          <span class="course-name-title">{{ course.title }}</span>
        </div>
        <div class="header-right">
          <span class="action-item">🏆 {{ coursePercentage }}% Progress</span>
          <span
              @click="toggleFavorite"
              class="action-item favorite-btn"
              :class="{ 'is-active-favorite': isFavorite }"
          >
          <!-- Pokud je oblíbený, ukáže plnou žlutou hvězdu, jinak běžnou -->
          {{ isFavorite ? '⭐ Favorite' : '☆ Add to favorites' }}
          </span>
        </div>
      </header>

      <!-- Hlavní dvousloupcový split přehrávače -->
      <div class="study-body-grid">

        <!-- Levá část: Video a Spodní záložky -->
        <div class="video-workspace">
          <div class="video-container-box">
            <!-- Vnořené video z databáze (pokud lesson nemá video, ukáže se náhradní placeholder) -->
            <video
                v-if="currentLesson && currentLesson.video_url"
                :src="currentLesson.video_url"
                controls
                autoplay
                @ended="handleVideoEnded(currentLesson)"
                class="actual-video-player"
            ></video>
            <div v-else class="video-placeholder-empty">
              <div class="play-icon-shape">&#9654;</div>
              <p>No video available for this lesson.</p>
            </div>
          </div>

          <!-- Spodní záložky Overview / Reviews -->
          <div class="bottom-details-tabs">
            <div class="tabs-buttons-row">
              <button @click="activeBottomTab = 'overview'" :class="{ active: activeBottomTab === 'overview' }">Overview</button>
              <button @click="activeBottomTab = 'reviews'" :class="{ active: activeBottomTab === 'reviews' }">Reviews</button>
            </div>

            <div class="tabs-inner-pane">
              <div v-if="activeBottomTab === 'overview'" class="pane-text">
                <h2>{{ currentLesson?.title || course.title }}</h2>
                <p>{{ currentLesson?.description || 'No description provided for this lesson.' }}</p>
                <hr />
                <p class="instructor-info">Instructor: <strong>{{ course.author }}</strong></p>
              </div>

              <div v-else class="pane-reviews">
                <div v-for="review in reviews" :key="review.id" class="pane-review-card">
                  <strong>{{ review.username }} <span class="review-stars">⭐ {{ review.rating }}</span></strong>
                  <p>{{ review.comment }}</p>
                </div>
                <div v-if="reviews.length === 0" class="pane-no-data">No feedback left yet.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pravá část: Seznam obsahu lekcí (Playlist) -->
        <div class="playlist-sidebar-pane">
          <div class="playlist-header-box">
            <h3>Content</h3>
          </div>
          <div class="playlist-section-title">Section 1: First Steps</div>

          <div class="playlist-items-scroll">
            <!-- Smyčka pro vykreslení lekcí z databáze -->
            <div
                v-for="lesson in lessons"
                :key="lesson.id"
                class="playlist-row-item"
                :class="{ playing: currentLesson?.id === lesson.id }"
                @click="selectLesson(lesson)"
            >
              <div class="row-checkbox-status">
                <input
                    type="checkbox"
                    :key="lesson.id"
                   :checked="lesson.is_completed === 1"
                    disabled
                    class="locked-checkbox"
                />
              </div>
              <div class="row-info-content">
                <span class="row-title-text">{{ lesson.order_index }}. {{ lesson.title }}</span>
                <span class="row-duration-text">
                   ▶ {{ videoDurations[lesson.id] || 'Loading...' }}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>
  <BadgeModal
      :isOpen="isBadgeModalOpen"
      :badgeData="activeBadgeData"
      @close="isBadgeModalOpen = false"
  />
  </div>
</template>

<style scoped>
.study-mode-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
  font-family: sans-serif;
}

.study-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 16px;
  color: #64748b;
}

.study-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #111111;
  color: #ffffff;
  padding: 16px 24px;
  border-bottom: 1px solid #222222;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.exit-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.exit-btn:hover {
  background: #222222;
}

.course-name-title {
  font-weight: 600;
  font-size: 16px;
}

.header-right {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #94a3b8;
}

.action-item {
  cursor: pointer;
  transition: color 0.2s;
}

.action-item:hover {
  color: #ffffff;
}

.favorite-btn {
  cursor: pointer;
  transition: color 0.2s;
}
.favorite-btn:hover {
  color: #eab308; /* Zlatá barva při najetí myší */
}
.is-active-favorite {
  color: #eab308;
  font-weight: bold;
}

.study-body-grid {
  display: grid;
  grid-template-columns: 3fr 1fr;
  flex: 1;
  overflow: hidden;
}

.video-workspace {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: #f8fafc;
}

.video-container-box {
  height: 60vh;
  width: 100%;
  aspect-ratio: 16/9;
  background: #1e293b;
  position: relative;
}

.actual-video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-placeholder-empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.play-icon-shape {
  font-size: 48px;
  color: #ffffff;
  margin-bottom: 12px;
  opacity: 0.8;
}

.bottom-details-tabs {
  padding: 24px;
  background: #ffffff;
  flex: 1;
}

.tabs-buttons-row {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 16px;
}

.tabs-buttons-row button {
  background: none;
  border: none;
  padding: 8px 0;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.tabs-buttons-row button.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.tabs-inner-pane {
  padding: 8px 0;
}

.pane-text h2 {
  font-size: 22px;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.pane-text p {
  color: #334155;
  line-height: 1.6;
  font-size: 15px;
}

.pane-text hr {
  border: 0;
  border-top: 1px solid #e2e8f0;
  margin: 20px 0;
}

.instructor-info {
  font-size: 14px;
  color: #475569;
}

.pane-review-card {
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.pane-review-card strong {
  color: #1e293b;
  display: flex;
  justify-content: space-between;
}

.review-stars {
  color: #f59e0b;
}

.pane-review-card p {
  margin: 4px 0 0 0;
  color: #475569;
  font-size: 14px;
}

.pane-no-data {
  color: #64748b;
  font-style: italic;
}

.playlist-sidebar-pane {
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
}

.playlist-header-box {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.playlist-header-box h3 {
  margin: 0;
  font-size: 16px;
  color: #0f172a;
}

.playlist-section-title {
  background: #f1f5f9;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: bold;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
}

.playlist-items-scroll {
  flex: 1;
  overflow-y: auto;
}

.playlist-row-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.2s;
}

.playlist-row-item:hover {
  background: #f8fafc;
}

.playlist-row-item.playing {
  background: #f1f5f9;
}

.row-checkbox-status {
  padding-top: 2px;
}

.row-checkbox-status input {
  cursor: pointer;
}

.locked-checkbox {
  cursor: not-allowed;
  opacity: 1 !important; /* Vynutíme plnou viditelnost i při disabled */
  accent-color: #2e7d32; /* Tvá ověřená zelená barva pro zaškrtnutý stav */
  width: 16px;
  height: 16px;
}

.row-info-content {
  flex: 1;
}

.row-title-text {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  display: block;
  line-height: 1.4;
}

.row-duration-text {
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
  display: block;
}
</style>