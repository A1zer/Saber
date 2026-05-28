<script setup lang="ts">

// Definice vlastností, které komponent přijímá zvenčí
defineProps<{
    isOpen: boolean;
    badgeData: {
    name: string;
    description: string;
    image_url: string;
  } | null;
}>();

// Definice událostí, které komponent posílá rodiči
const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-backdrop-overlay" @click.self="closeModal">
      <div class="modal-badge-window">
        <!-- Efekt záření za odznakem -->
        <div class="badge-glow-effect"></div>

        <div class="modal-badge-header">
          <span class="achievement-unlocked-tag">🏆 ACHIEVEMENT UNLOCKED</span>
          <button @click="closeModal" class="close-x-btn">&times;</button>
        </div>

        <div class="modal-badge-body">
          <div class="badge-avatar-wrapper">
            <!-- Obrázek odznaku přímo z backend URL adresy -->
            <img :src="badgeData?.image_url" :alt="badgeData?.name" class="badge-pulse-img" />
          </div>
          <h2>{{ badgeData?.name }}</h2>
          <p>{{ badgeData?.description }}</p>
        </div>

        <div class="modal-badge-footer">
          <button @click="closeModal" class="modal-claim-btn">Awesome!</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Pozadí přes celou obrazovku s jemným rozostřením (backdrop-filter) */
.modal-backdrop-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.75); /* Tmavě modro-šedá jako Figma */
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Vždy úplně nahoře */
}

/* Okno samotného odznaku */
.modal-badge-window {
  background: #1e293b; /* Tmavé prémiové pozadí */
  border: 1px solid rgba(255, 215, 0, 0.2); /* Jemný zlatý okraj */
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
  padding: 30px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  text-align: center;
  color: #f8fafc;
  overflow: hidden;
}

/* Magické zlaté záření na pozadí odznaku */
.badge-glow-effect {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(234, 179, 8, 0.15) 0%, rgba(234, 179, 8, 0) 70%);
  pointer-events: none;
}

.modal-badge-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.achievement-unlocked-tag {
  font-size: 0.8rem;
  font-weight: 800;
  color: #eab308; /* Zlatá barva */
  letter-spacing: 1.5px;
}

.close-x-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s;
}

.close-x-btn:hover {
  color: #f1f5f9;
}

.badge-avatar-wrapper {
  width: 130px;
  height: 130px;
  margin: 0 auto 20px auto;
  position: relative;
}

.badge-pulse-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: float 3s ease-in-out infinite;
}

.modal-badge-body h2 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #ffffff;
}

.modal-badge-body p {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 30px;
}

/* Stylové Figma tlačítko */
.modal-claim-btn {
  width: 100%;
  background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
  color: #0f172a;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(234, 179, 8, 0.2);
  transition: transform 0.1s, box-shadow 0.2s;
}

.modal-claim-btn:hover {
  box-shadow: 0 6px 20px rgba(234, 179, 8, 0.4);
  transform: translateY(-1px);
}

.modal-claim-btn:active {
  transform: translateY(1px);
}

/* ANIMACE 1: Jemné vznášení odznaku ve vzduchu */
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
}

/* ANIMACE 2: Plynulé zatmění a vyskočení modalu (Vue Transitions) */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-badge-window {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); /* Bounce efekt */
}

.modal-fade-leave-active .modal-badge-window {
  transition: transform 0.2s ease;
}

.modal-fade-enter-from .modal-badge-window {
  transform: scale(0.8) translateY(20px);
}

.modal-fade-leave-to .modal-badge-window {
  transform: scale(0.9) translateY(10px);
}
</style>