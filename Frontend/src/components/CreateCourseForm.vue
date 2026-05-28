<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Reaktivní stav pro textová políčka formuláře
const title = ref('');
const description = ref('');
const courseTypeId = ref(1); // Výchozí typ kurzu (např. 1 = Public)

// Reaktivní stav pro vybraný soubor obrázku
const selectedFile = ref<File | null>(null);
const errorMessage = ref('');
const isSubmitting = ref(false);

// Funkce, která se spustí, když uživatel vybere soubor v počítači
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
};

// Hlavní funkce pro odeslání formuláře na backend
const submitCourse = async () => {
  errorMessage.value = '';

  // Základní validace
  if (!title.value || !description.value) {
    errorMessage.value = 'Prosím, vyplňte název a popis kurzu.';
    return;
  }

  isSubmitting.value = true;

  try {
    // 1. VYTVOŘENÍ OBJEKTU FORMDATA (Klíčový krok pro nahrávání souborů)
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('description', description.value);
    formData.append('course_type_id', courseTypeId.value.toString());

    // Pokud uživatel vybral soubor, přidáme ho pod klíčem 'image' (shoduje se s upload.single('image') na backendu)
    if (selectedFile.value) {
      formData.append('image', selectedFile.value);
    }

    // 2. NAČTENÍ AUTH TOKENU
    const token = localStorage.getItem('auth_token');

    // 3. ODESLÁNÍ NA BACKEND
    const response = await fetch('http://localhost:3000/api/courses/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // POZNÁMKA: U FormData NIKDY nepíšeme 'Content-Type': 'application/json'ani 'multipart/form-data'.
        // Prohlížeč si Content-Type se správným boundary vygeneruje sám.
      },
      body: formData // Místo JSON.stringify posíláme rovnou formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Nepodařilo se vytvořit kurz.');
    }

    // Úspěšně vytvořeno -> přesměrujeme zpět na dashboard
    router.back();

  } catch (err: any) {
    console.error('Chyba při odesílání kurzu:', err);
    errorMessage.value = err.message || 'Došlo k neočekávané chybě.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="form-container">
    <h2 class="form-title">Create a New Course</h2>

    <div v-if="errorMessage" class="error-banner">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="submitCourse" class="course-form">
      <!-- Název kurzu -->
      <div class="form-group">
        <label for="title">Course Title</label>
        <input
            v-model="title"
            type="text"
            id="title"
            placeholder="e.g. Web development for beginners"
            class="form-input"
        />
      </div>

      <!-- Popis kurzu -->
      <div class="form-group">
        <label for="description">Description</label>
        <textarea
            v-model="description"
            id="description"
            rows="4"
            placeholder="Describe what students will learn..."
            class="form-input"
        ></textarea>
      </div>

      <!-- Typ kurzu (Výběr) -->
      <div class="form-group">
        <label for="type">Course Access Type</label>
        <select v-model="courseTypeId" id="type" class="form-input select-input">
          <option :value="1">Public (Casual Users)</option>
          <option :value="2">Private (Accessible Only Through Link)</option>
        </select>
      </div>

      <!-- Nahrání obrázku -->
      <div class="form-group">
        <label for="image">Course Cover Image</label>
        <div class="file-input-wrapper">
          <input
              type="file"
              id="image"
              accept="image/*"
              @change="handleFileChange"
              class="file-input-hidden"
          />
          <label Desert for="image" class="file-input-label">
            {{ selectedFile ? 'Selected: ' + selectedFile.name : 'Choose an image...' }}
          </label>
        </div>
      </div>

      <!-- Tlačítka -->
      <div class="form-actions">
        <button type="button" @click="router.back()" class="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
          {{ isSubmitting ? 'Creating...' : 'Create Course' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  max-w-xl: 600px;
  //margin: 40px auto;
  padding: 32px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-top: 0;
  margin-bottom: 24px;
}

.course-form {
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

.form-input {
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: var(--accent);
}

textarea.form-input {
  resize: vertical;
}

/* Custom stylování pro nahrávání souboru */
.file-input-wrapper {
  position: relative;
}

.file-input-hidden {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-input-label {
  display: block;
  padding: 12px;
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: background 0.2s;
}

.file-input-hidden:hover + .file-input-label {
  background: #f1f5f9;
  border-color: var(--accent);
}

/* Tlačítka */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn-secondary {
  background: #f1f5f9;
  color: #334155;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-primary {
  background: var(--accent);
  color: var(--text);
}

.btn-primary:hover {
  background: var(--accent-dark);
}

.btn-primary:disabled {
  background: #a3e635;
  opacity: 0.6;
  cursor: not-allowed;
}

.error-banner {
  background: #fef2f2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>