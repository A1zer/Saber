<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  // Vrátí uživatele na předchozí stránku v historii prohlížeče
  router.back();
};

const goHome = () => {
  // Fallback návrat přímo na domovskou stránku
  router.push('/dashboard');
};
</script>

<template>
  <div class="wip-container">
    <div class="wip-card">
      <!-- Ikona montážního klíče / rozpracovanosti -->
      <div class="wip-icon">🚧</div>

      <h1 class="wip-title">Under Construction</h1>
      <p class="wip-message">
        We are currently working hard on this page. Shovels are flying, code is typing, but it's not quite ready yet!
      </p>

      <div class="wip-actions">
        <button @click="goBack" class="btn btn-secondary">
          &larr; Go Back
        </button>
        <button @click="goHome" class="btn btn-primary">
          Back to Home
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wip-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
  padding: 20px;
  background-color: #f8fafc;
}

.wip-card {
  max-width: 500px;
  width: 100%;
  text-align: center;
  background: var(--background-white);
  padding: 40px 32px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.wip-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: pulse 2s infinite ease-in-out;
}

.wip-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px 0;
}

.wip-message {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 32px 0;
}

.wip-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s, transform 0.1s;
}

.btn:active {
  transform: scale(0.98);
}

.btn-secondary {
  background: var(--background);
  color: #334155;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-primary {
  background: var(--accent);
  color: var(--background-white);
}

.btn-primary:hover {
  background: #215c24;
}

/* Jemná animace pro ikonu stavebních prací */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}
</style>