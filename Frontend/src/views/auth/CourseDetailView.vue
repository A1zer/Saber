<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import { useRoute, useRouter } from 'vue-router';

import BadgeModal from "../../components/BadgeModal.vue";

const route = useRoute();
const router = useRouter();
const courseId = route.params.id;

// 2. OPRAVENO: Změněno z any[] na Review[] – TypeScript už chybu nevyhodí;
const course = ref<any>(null);
const lessons = ref<any[]>([]);
const reviews = ref<any[]>([]);
const isLoading = ref(true);
const activeTab = ref('overview'); // Přepínání záložek spodního textu

const currentUserId = ref<number | null>(null);

// --- REAKTIVNÍ STAV PRO FORMULÁŘ RECENZE ---
const newRating = ref<number>(5);
const hoverRating = ref<number>(0);
const newComment = ref<string>('');
const isSubmittingReview = ref<boolean>(false);
const reviewError = ref<string>('');

// Reaktivní stav pro řízení vyskakovacího okna
const isBadgeModalOpen = ref(false);
const activeBadgeData = ref<any>(null);

const fetchCourseDetail = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem("auth_token");

    // 1. Zjistíme ID aktuálně přihlášeného uživatele
    const meResponse = await fetch('http://localhost:3000/api/users/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (meResponse.ok) {
      const userData = await meResponse.json();
      currentUserId.value = userData.id; // Uložíme si tvoje ID z databáze
    }

    // 2. Načteme data kurzu
    const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to load course details.');

    const data = await response.json();
    course.value = data.course;
    lessons.value = data.lessons;
    reviews.value = data.reviews; // Vue sem správně přiřadí pole objektů s user_id
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// DŮLEŽITÁ PODMÍNKA: Porovná přihlášeného uživatele s tvůrcem kurzu
const isAuthorOfThisCourse = computed(() => {
  if (!course.value || !currentUserId.value) return false;
  return course.value.creator_user_id === currentUserId.value;
});

const isEditing = ref<boolean>(false);

const startEditReview = (review: any) => {
  if (!review) return;
  newRating.value = review.rating;
  newComment.value = review.comment;
  isEditing.value = true;

  // Vizuální bonus: Plynule odroluje uživatele nahoru k formuláři
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const submitReview = async () => {
  if (!newComment.value.trim()) {
    reviewError.value = 'Please enter a comment.';
    return;
  }

  try {
    isSubmittingReview.value = true;
    reviewError.value = '';
    const token = localStorage.getItem("auth_token");

    // DŮLEŽITÝ ŘÁDEK: Vrátili jsme správné střídání metod podle toho, zda editujeme
    const method = isEditing.value ? 'PUT' : 'POST';

    const response = await fetch(`http://localhost:3000/api/courses/${courseId}/reviews`, {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rating: newRating.value,
        comment: newComment.value
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Failed to submit review.');
    }

    const result = await response.json();

    if (result.newBadges && result.newBadges.length > 0) {
      // Pokud uživatel získal více odznaků naráz (např. lekce + kurz),
      // vezmeme pro ukázku ten první. (Případně je můžete řadit do fronty).
      activeBadgeData.value = result.newBadges[0];
      isBadgeModalOpen.value = true; // Způsobí okamžité plynulé vyjetí okna
    }

    // 2. DRUHÁ VĚC: Potvrzení o úspěchu
    alert('🎉 Review saved successfully!');

    // 3. NA ÚPLNÝ KONEC: Vyčištění a znovunačtení dat, aby se Vue nepřekreslovalo dřív
    newComment.value = '';
    newRating.value = 5;
    isEditing.value = false;

    await fetchCourseDetail();

  } catch (err: any) {
    reviewError.value = err.message;
  } finally {
    isSubmittingReview.value = false;
  }
};

const deleteReview = async (reviewId: number) => {
  if (!confirm('Are you sure you want to delete your review?')) return;

  try {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`http://localhost:3000/api/courses/${courseId}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Failed to delete review.');
    }

    await fetchCourseDetail(); // Znovunačtení seznamu
    alert('🗑️ Review deleted successfully.');
  } catch (err: any) {
    alert(err.message);
  }
};

const startLearning = () => {
  // Přesměruje uživatele na čistou stránku studia
  router.push({ name: 'course-study', params: { id: courseId } });
};

// Funkce pro autory - skočí do správy videí
const manageCourse = () => {
  router.push({ name: 'course-manage', params: { id: courseId } });
};

onMounted(() => {
  fetchCourseDetail();
});
</script>

<template>
  <div class="detail-page-container">
    <div v-if="isLoading" class="loading">Loading details...</div>

    <div v-else-if="course" class="detail-layout">
      <div>
        <div class="hero-section" :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${course.image_url})` }">
          <div class="hero-content">
            <button @click="router.push({ name: 'my-courses'})" class="exit-btn">&larr;</button>
            <span class="author-tag">Created by {{ course.author }}</span>
            <h1 class="course-title">{{ course.title }}</h1>
            <p class="short-desc">{{ course.description }}</p>
            <button
                v-if="isAuthorOfThisCourse"
                @click="manageCourse"
                class="start-btn manage-mode-btn"
            >
              ⚙️ Manage Course
            </button>

            <button
                v-else
                @click="startLearning"
                class="start-btn"
            >
              Start Learning &rarr;
            </button>
          </div>
        </div>

        <div class="info-left">
          <div class="tabs-header">
            <button @click="activeTab = 'overview'" :class="{ active: activeTab === 'overview' }">Overview</button>
            <button @click="activeTab = 'reviews'" :class="{ active: activeTab === 'reviews' }">Reviews ({{ reviews.length }})</button>
          </div>

          <div class="tab-content">
            <!-- ZÁLOŽKA 1: OVERVIEW -->
            <div v-if="activeTab === 'overview'" class="overview-text">
              <h3>About this Course</h3>
              <p>{{ course.description }}</p>
            </div>

            <!-- ZÁLOŽKA 2: REVIEWS (Všechno v jedné sekci pod sebou) -->
            <div v-else class="reviews-list">
              <h3>Student Feedback</h3>

              <!-- A) FORMULÁŘ NA PSANÍ RECENZE (Zobrazí se studentům nahoře) -->
              <div v-if="!isAuthorOfThisCourse" class="add-review-box">
                <h4>Write a Review</h4>

                <div class="form-row">
                  <label>Your Rating:</label>
                  <div class="stars-rating-wrapper" @mouseleave="hoverRating = 0">
                    <span
                        v-for="star in 5"
                        :key="star"
                        class="interactive-star"
                        :class="{ 'is-active': (hoverRating || newRating) >= star }"
                        @mouseenter="hoverRating = star"
                        @click="newRating = star"
                    >
                      ★
                    </span>
                    <span class="rating-number-hint">({{ newRating }} / 5)</span>
                  </div>
                </div>

                <div class="form-row">
                  <textarea
                      v-model="newComment"
                      placeholder="What did you think about this course? What did you like or dislike?"
                      rows="3"
                  ></textarea>
                </div>

                <p v-if="reviewError" class="review-error">{{ reviewError }}</p>

                <button
                    @click="submitReview"
                    :disabled="isSubmittingReview"
                    class="post-review-btn"
                >
                  {{ isSubmittingReview ? 'Posting...' : 'Submit Review' }}
                </button>
              </div>

              <!-- B) SEZNAM VŠECH RECENZÍ OD STUDENTŮ -->
              <div v-if="reviews.length === 0" class="no-reviews">No reviews yet for this course.</div>

              <div v-for="review in reviews" :key="review.id" class="review-item">
                <div class="review-main-body">
                  <div class="review-meta">
                    <strong>{{ review.username }}</strong>
                    <span class="stars">⭐ {{ review.rating }}/5</span>
                  </div>
                  <p>{{ review.comment }}</p>
                </div>

                <div v-if="review && review.user_id === currentUserId" class="review-actions">
                  <button @click="startEditReview(review)" class="edit-btn-text">Edit</button>
                  <button @click="deleteReview(review.id)" class="delete-btn-text">Delete</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div>
        <!-- Pravý sloupec s přehledem osnovy -->
        <div class="info-right">
          <div class="syllabus-card">
            <h3>Course Content</h3>
            <span class="lessons-count">{{ lessons.length }} lessons</span>
            <ul class="syllabus-list">
              <li v-for="lesson in lessons" :key="lesson.id">
                <span class="index">{{ lesson.order_index }}.</span>
                <span class="lesson-title">{{ lesson.title }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  <BadgeModal
      :isOpen="isBadgeModalOpen"
      :badgeData="activeBadgeData"
      @close="isBadgeModalOpen = false"
  />
  </div>
</template>
<style scoped>
.detail-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.detail-page-container {
  padding: 24px;
  width: 100%;
}

.hero-section {
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  padding: 60px 40px;
  color: #ffffff;
  margin-bottom: 32px;
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

.hero-content {
  max-width: 800px;
}

.author-tag {
  font-size: 13px;
  color: #a7f3d0;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.course-title {
  font-size: 36px;
  font-weight: 800;
  margin: 8px 0 16px;
}

.short-desc {
  font-size: 16px;
  max-width: 600px;
  color: #cbd5e1;
  line-height: 1.5;
  margin-bottom: 24px;
}

.start-btn {
  background: var(--accent);
  color: #ffffff;
  border: none;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.start-btn:hover {
  background: var(--accent-dark);
}

.manage-mode-btn {
  background: #1e3a8a !important; /* Krásná tmavě modrá barva pro správu kurzu */
}
.manage-mode-btn:hover {
  background: #1e40af !important;
}


.info-left {
  background: #ffffff;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.tabs-header button {
  background: none;
  border: none;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.tabs-header button.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.tab-content {
  padding: 8px 24px;
}

.overview-text h3,
.reviews-list h3 {
  font-size: 20px;
  color: #0f172a;
  margin-bottom: 12px;
}

.overview-text p {
  color: #334155;
  line-height: 1.6;
}

.no-reviews {
  color: #64748b;
  font-style: italic;
}

.review-item {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.review-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.review-meta strong {
  color: #1e293b;
}

.stars {
  color: #f59e0b;
  font-weight: 600;
}

.review-item p {
  color: #475569;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.info-right {
  display: flex;
  flex-direction: column;
}

.syllabus-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
}

.syllabus-card h3 {
  font-size: 18px;
  color: #0f172a;
  margin: 0 0 4px 0;
}

.lessons-count {
  font-size: 13px;
  color: #64748b;
}

.syllabus-list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
}

.syllabus-list li {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

.syllabus-list li:last-child {
  border-bottom: none;
}

.index {
  color: #94a3b8;
  font-weight: bold;
}

.lesson-title {
  color: #334155;
  font-weight: 500;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #64748b;
  font-size: 16px;
}

/* NOVÉ STYLY PRO FORMULÁŘ RECENZÍ */
.add-review-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.add-review-box h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #1e293b;
}

.form-row {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.form-row select {
  width: 160px;
  padding: 6px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #ffffff;
  font-size: 14px;
}

.form-row textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  resize: vertical;
}

.review-error {
  color: #ef4444;
  font-size: 13px;
  margin: 0 0 12px 0;
}

.post-review-btn {
  background: #1e293b;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.post-review-btn:hover {
  background: #334155;
}

.post-review-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.stars-rating-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  user-select: none;
}

.interactive-star {
  font-size: 28px;
  color: #cbd5e1;
  cursor: pointer;
  transition: color 0.1s ease, transform 0.1s ease;
}

.interactive-star.is-active {
  color: #eab308;
}

.interactive-star:hover {
  transform: scale(1.15);
}

.rating-number-hint {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin-left: 8px;
}

.review-actions {
  display: flex;
  gap: 12px;
  align-self: flex-end;
  justify-content: flex-end;
}

.edit-btn-text, .delete-btn-text {
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  background-color: var(--background-dark);
}

.edit-btn-text {
  color: var(--text);
}


.delete-btn-text {
  color: var(--text);
}


.edit-btn-text:active, .delete-btn-text:active {
  transform: translateY(0);
}

</style>