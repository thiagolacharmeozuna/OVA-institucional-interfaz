<script setup>
import PhotoCard from './PhotoCard.vue'
defineEmits(['ir'])
</script>
<template>
  <section class="hero">
    <div class="centro glass">
      <p class="chip">Tutorial 100% libre de esperanza innecesaria</p>
      <h1>Pensamiento computacional</h1>
      <h3>y resolución de problemas</h3>
      <p class="lead">Aprende a resolver problemas antes de que ellos te resuelvan a ti.</p>
      <button class="gbtn" v-ripple @click="$emit('ir', 1)">Empezar (no hay vuelta atrás)</button>
    </div>
    <PhotoCard src="/media/resolucion-problemas.jpg" alt="Computadora con código en la pantalla, lista para resolver un problema" caption="Pensar · programar · resolver" />
  </section>
</template>
<style scoped>
.hero{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:clamp(2rem,6vw,5rem);align-items:center;max-width:1200px;margin:0 auto}
.centro{padding:2rem 1.5rem;text-align:left;display:grid;justify-items:start;gap:.4rem}
h1{font-size:clamp(2rem,5vw,3.4rem);background:linear-gradient(90deg,#fff,var(--sol));-webkit-background-clip:text;background-clip:text;color:transparent}
h3{opacity:.85;font-weight:500}
.chip{background:rgba(255,210,63,.2);border:1px solid rgba(255,210,63,.5);border-radius:999px;padding:.2rem 1rem;font-size:.9rem;animation:gel 3s infinite}
.lead{margin:.4rem 0 1rem;text-align:left}
@keyframes gel{0%,100%{transform:scale(1)}30%{transform:scale(1.07,.94)}60%{transform:scale(.97,1.04)}}
@media(max-width:780px){.hero{grid-template-columns:1fr}}
</style>
