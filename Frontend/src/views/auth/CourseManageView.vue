<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const courseId = route.params.id;

const course = ref<any>(null);
const lessons = ref<any[]>([]);
const isLoading = ref(true);

// Formulářová data pro novou lekce
const lessonTitle = ref('');
const lessonDescription = ref('');
const selectedVideoFile = ref<File | null>(null);
const isUploading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const fetchManagementData = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to load course details.');

    const data = await response.json();
    course.value = data.course;
    lessons.value = data.lessons;
  } catch (err) {
    console.error(err);
    errorMessage.value = "Chyba při načítání dat kurzu.";
  } finally {
    isLoading.value = false;
  }
};

const handleVideoChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedVideoFile.value = target.files[0];
  }
};

const handleAddLesson = async () => {
  if (!lessonTitle.value || !selectedVideoFile.value) {
    errorMessage.value = "Název a video soubor jsou povinné!";
    return;
  }

  try {
    isUploading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    const token = localStorage.getItem("auth_token");
    const formData = new FormData();
    formData.append("title", lessonTitle.value);
    formData.append("description", lessonDescription.value);
    formData.append("video", selectedVideoFile.value);

    const response = await fetch(`http://localhost:3000/api/courses/${courseId}/lessons`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData // Nepoužíváme Content-Type header, prohlížeč si ho u FormData nastaví sám včetně boundary boundary
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message || 'Upload failed');

    successMessage.value = "Lekce byla úspěšně nahrána a uložena!";
    lessonTitle.value = '';
    lessonDescription.value = '';
    selectedVideoFile.value = null;

    // Obnovíme seznam lekcí
    await fetchManagementData();

  } catch (err: any) {
    console.error(err);
    errorMessage.value = err.message || "Nepodařilo se nahrát video.";
  } finally {
    isUploading.value = false;
  }
};

const handleDeleteCourse = async () => {
  // Bezpečnostní otázka pro uživatele
  const confirmDelete = window.confirm(
      `Opravdu chcete kompletně smazat kurz "${course.value?.title}"? Tato akce je nevratná a smaže všechna nahraná videa i pokroky studentů!`
  );

  if (!confirmDelete) return;

  try {
    isUploading.value = true; // Použijeme stávající loader pro zamezení klikání
    errorMessage.value = '';
    successMessage.value = '';

    const token = localStorage.getItem("auth_token");
    const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Smazání selhalo');

    alert("Kurz byl úspěšně smazán.");
    // Po smazání kurzu přesměrujeme lektora zpět na dashboard
    router.push({ name: 'my-courses' });

  } catch (err: any) {
    console.error(err);
    errorMessage.value = err.message || "Nepodařilo se smazat kurz.";
    isUploading.value = false;
  }
};

onMounted(() => {
  fetchManagementData();
});
</script>

<template>
  <div class="manage-page-container">
    <div class="back-link">
      <button @click="router.push({ name: 'my-courses' })" class="text-btn">&larr; Back to preview</button>
    </div>

    <div v-if="isLoading" class="loading-state">Načítám správu kurzu...</div>

    <div v-else-if="course" class="manage-layout">
      <div class="manage-header">
        <div class="header-split-row">
          <div>
            <h1>Manage course: <span class="highlight">{{ course.title }}</span></h1>
            <p class="subtitle">Here you can add educational videos and concepts for students</p>
          </div>

          <!-- NOVÉ: Červené tlačítko pro smazání kurzu -->
          <button
              @click="handleDeleteCourse"
              class="delete-course-btn"
              :disabled="isUploading"
          >
            🗑️ Delete Course
          </button>
        </div>
      </div>

      <div class="messages-zone">
        <div v-if="successMessage" class="msg success">{{ successMessage }}</div>
        <div v-if="errorMessage" class="msg error">{{ errorMessage }}</div>
      </div>

      <div class="manage-grid">
        <!-- Levá strana: Seznam nahraných lekcí -->
        <div class="lessons-list-pane">
          <h2>Course structure ({{ lessons.length }} lessons)</h2>
          <div v-if="lessons.length === 0" class="empty-syllabus">
            The course has no lessons yet. Use the form on the right to upload your first video!
          </div>
          <div v-else class="lessons-scroll-box">
            <div v-for="lesson in lessons" :key="lesson.id" class="lesson-manage-card">
              <div class="lesson-num">{{ lesson.order_index }}</div>
              <div class="lesson-info">
                <h3>{{ lesson.title }}</h3>
                <p>{{ lesson.description || 'Bez popisu.' }}</p>
                <span class="video-path">🎥 {{ lesson.video_url.split('/').pop() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pravá strana: Formulář pro nahrání videa -->
        <div class="upload-form-pane">
          <h2>Add new lesson</h2>
          <form @submit.prevent="handleAddLesson" class="clean-form">
            <div class="form-group">
              <label for="title">Lesson name *</label>
              <input type="text" id="title" v-model="lessonTitle" placeholder="E.g. 1. Introduction to editing" required />
            </div>

            <div class="form-group">
              <label for="desc">Description</label>
              <textarea id="desc" v-model="lessonDescription" rows="4" placeholder="Briefly describe what the student will learn in this video..."></textarea>
            </div>

            <div class="form-group">
              <label for="video">Video file * (.mp4, .mov)</label>
              <div class="file-input-wrapper">
                <input type="file" id="video" @change="handleVideoChange" accept="video/*" required />
              </div>
              <span v-if="selectedVideoFile" class="file-name-info">Chosen: {{ selectedVideoFile.name }}</span>
            </div>

            <button type="submit" class="submit-upload-btn" :disabled="isUploading">
              {{ isUploading ? 'Uploading video to the server...' : 'Upload Lesson' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.manage-page-container {
  padding: 32px;
  width: 100%;
}

.back-link {
  margin-bottom: 20px;
}

.text-btn {
  background: none;
  border: none;
  color: var(--accent);
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}

.text-btn:hover {
  text-decoration: underline;
}

.manage-header h1 {
  font-size: 28px;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.header-split-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.delete-course-btn {
  background-color: var(--background-dark);
  color: var(--text);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.delete-course-btn:hover:not(:disabled) {
  background-color: var(--background-black); /* Tmavší červená při najetí */
}

.delete-course-btn:disabled {
  background-color: #fca5a5;
  cursor: not-allowed;
}

.highlight {
  color: var(--accent);
}

.subtitle {
  color: #64748b;
  margin: 0 0 24px 0;
  font-size: 15px;
}

.manage-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  margin-top: 24px;
}

.lessons-list-pane,
.upload-form-pane {
  background: var(--background-white);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
}

.lessons-list-pane h2,
.upload-form-pane h2 {
  font-size: 18px;
  color: #1e293b;
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
}

.lessons-scroll-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 500px;
  overflow-y: auto;
}

.lesson-manage-card {
  display: flex;
  gap: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}

.lesson-num {
  background: var(--accent);
  color: var(--text);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
}

.lesson-info h3 {
  margin: 0 0 4px 0;
  font-size: 15px;
  color: #0f172a;
}

.lesson-info p {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
}

.video-path {
  font-size: 11px;
  color: #94a3b8;
  background: #ffffff;
  padding: 4px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.clean-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.form-group input[type="text"],
.form-group textarea {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.file-input-wrapper {
  border: 2px dashed #cbd5e1;
  padding: 20px;
  border-radius: 6px;
  text-align: center;
  background: #f8fafc;
}

.file-name-info {
  font-size: 12px;
  color: var(--accent);
  font-weight: 600;
}

.submit-upload-btn {
  background: var(--accent);
  color: #ffffff;
  border: none;
  padding: 12px;
  font-size: 14px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-upload-btn:hover:not(:disabled) {
  background: var(--accent-dark);
}

.submit-upload-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.messages-zone {
  margin-bottom: 16px;
}

.msg {
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.msg.success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.msg.error {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #991b1b;
}

.empty-syllabus {
  padding: 40px;
  text-align: center;
  color: #64748b;
  font-style: italic;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #64748b;
}
</style>