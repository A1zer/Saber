<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isVerifiedInstructor = ref(false);
const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const checkInstructorStatus = async () => {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    // Využijeme tvůj stávající endpoint /me, kde už posíláš canCreateCourses
    const response = await fetch(`${backendUrl}/api/users/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const userData = await response.json();
      isVerifiedInstructor.value = userData.canCreateCourses === true || userData.canCreateCourses === 1;
    }
  } catch (err) {
    console.error("Error checking instructor status:", err);
  }
};

const requestVerification = () => {
  window.location.href = "mailto:instructors@://saber.com Instructor Verification Request Request";
};

onMounted(() => {
  checkInstructorStatus();
});
</script>

<template>
  <div class="teach-page-container">
    <!-- Hero sekce -->
    <section class="teach-hero">
      <div class="hero-inner">
        <h1>Share your knowledge.<br><span class="highlight">Teach on Saber.</span></h1>
        <p class="hero-lead">
          Join our exclusive circle of instructors and help thousands of students reach their goals through micro-learning.
        </p>
      </div>
    </section>

    <!-- Tříkrokový proces schválení -->
    <section class="process-section">
      <div class="container">
        <h2 class="section-title">How to become an Instructor?</h2>
        <p class="section-subtitle">To maintain high-quality education, every instructor account must be manually verified by Saber administration.</p>

        <div class="process-steps-grid">
          <div class="step-card">
            <div class="step-num">01</div>
            <h3>Apply for Verification</h3>
            <p>Fill out your professional profile, links to your portfolio, and specify the topics you want to teach.</p>
          </div>

          <div class="step-card">
            <div class="step-num">02</div>
            <h3>Review Process</h3>
            <p>Our team will manually review your application within 48 hours to check your expertise and background.</p>
          </div>

          <div class="step-card">
            <div class="step-num">03</div>
            <h3>Start Teaching</h3>
            <p>Once verified, the <strong>"Create Course"</strong> tools will instantly unlock on your Dashboard.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Dynamická sekce podle stavu uživatele -->
    <section class="cta-section">
      <div class="cta-card">
        <template v-if="isVerifiedInstructor">
          <h3>You are a Verified Instructor!</h3>
          <p>Your account has all permissions active. You can start building your micro-learning curriculum right now.</p>
          <button @click="router.push({ name: 'my-courses' })" class="cta-btn">Go to Dashboard</button>
        </template>

        <template v-else>
          <h3>Ready to inspire others?</h3>
          <p>Submit your application today. Please contact our support team at <strong>instructors@saber.com</strong> with your portfolio.</p>
          <button @click="requestVerification" class="cta-btn -secondary">Contact Support</button>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>
.teach-page-container {
  width: 100%;
  font-family: sans-serif;
  background-color: #ffffff;
  color: #0f172a;
}

/* Hero sekce s moderním tmavým pozadím */
.teach-hero {
  background: #111111;
  color: #ffffff;
  padding: 100px 20px;
  text-align: center;
}

.hero-inner {
  max-width: 800px;
  margin: 0 auto;
}

.teach-hero h1 {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 20px 0;
}

.highlight {
  color: #eab308; /* Barva pro akcent */
}

.hero-lead {
  font-size: 1.2rem;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

/* Sekce s popisem procesu schválení */
.process-section {
  padding: 80px 20px;
  background: #f8fafc;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
}

.section-title {
  font-size: 2rem;
  text-align: center;
  font-weight: 700;
  margin: 0 0 10px 0;
}

.section-subtitle {
  text-align: center;
  color: #64748b;
  margin: 0 0 50px 0;
  font-size: 1rem;
}

.process-steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.step-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  position: relative;
}

.step-num {
  font-size: 2.5rem;
  font-weight: 900;
  color: #f1f5f9;
  position: absolute;
  top: 15px;
  right: 20px;
  user-select: none;
}

.step-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #0f172a;
  position: relative;
  z-index: 2;
}

.step-card p {
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.5;
  margin: 0;
}

/* Call to Action sekce dole */
.cta-section {
  padding: 60px 20px 100px 20px;
  display: flex;
  justify-content: center;
}

.cta-card {
  background: #1e293b;
  color: var(--text);
  max-width: 650px;
  width: 100%;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.cta-card h3 {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.cta-card p {
  color: #cbd5e1;
  font-size: 1rem;
  margin: 0 0 30px 0;
  line-height: 1.5;
}

.cta-btn {
  background: #eab308;
  color: #0f172a;
  border: none;
  padding: 14px 32px;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.cta-btn:hover {
  background: #ca8a04;
  transform: translateY(-1px);
}

.cta-btn.-secondary {
  background: #ffffff;
  color: #0f172a;
}
.cta-btn.-secondary:hover {
  background: #f1f5f9;
}
</style>