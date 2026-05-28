<script setup lang="ts">
import { ref } from 'vue';

// Mock data pro dny v týdnu (v reálné aplikaci přijdou z API / storu)
const days = ref([
  { label: 'Mo', completed: true },
  { label: 'Tu', completed: true },
  { label: 'We', completed: true },
  { label: 'Th', completed: false },
  { label: 'Fr', completed: false },
  { label: 'Sa', completed: false },
  { label: 'Su', completed: false },
]);

const currentStreak = ref(0);
</script>

<template>
  <div class="streak-card">
    <!-- Nadpis komponenty -->
    <h3 class="streak-title">Weekly Streak</h3>

    <!-- Řada s dny v týdnu -->
    <div class="days-container">
      <div
          v-for="(day, index) in days"
          :key="index"
          :class="['day-circle', day.completed ? 'completed' : 'pending']"
      >
        {{ day.label }}
      </div>
    </div>

    <!-- Informační text -->
    <p class="streak-info">
      Complete 1 lesson per day to start your streak!
    </p>

    <!-- Spodní statistika a ikona -->
    <div class="streak-stats">
      <!-- Šedá SVG ikona plamínku podle předlohy -->
      <svg
          class="streak-icon"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
      </svg>

      <div class="streak-count">{{ currentStreak }} weeks</div>
      <div class="streak-label">Current streak</div>
    </div>
  </div>
</template>

<style scoped>
.streak-card {
  max-width: 900px; /* Široký design podle obrázku */
  margin: 4rem auto;
  padding: 40px;
  background-color: var(--background-white);
  border: 2px solid var(--background-alt);
  border-radius: 24px; /* Hodně zaoblené rohy */
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
}

/* Nadpis */
.streak-title {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  margin-top: 0;
  margin-bottom: 24px;
}

/* Kontejner pro kolečka */
.days-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

/* Základní vzhled kolečka pro den */
.day-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* Třída pro SPLNĚNÝ den (Tmavě zelená) */
.day-circle.completed {
  background-color: var(--accent);
  color: var(--text);
}

/* Třída pro ČEKAJÍCÍ den (Šedá) */
.day-circle.pending {
  background-color: var(--background-alt);
  color: var(--text-black);
}

/* Text uprostřed */
.streak-info {
  font-size: 16px;
  color: #1a1a1a;
  margin-top: 0;
  margin-bottom: 24px;
}

/* Spodní sekce s plamínkem */
.streak-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

/* Ikona plamínku */
.streak-icon {
  width: 40px;
  height: 40px;
  color: #cbd5e1; /* Světle šedá linka */
  margin-bottom: 8px;
}

/* Počet týdnů */
.streak-count {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
}

/* Popisek pod číslem */
.streak-label {
  font-size: 14px;
  color: #71717a;
}
</style>