<script setup>
import PhotoCard from './PhotoCard.vue'
</script>
<template>
  <section class="seccion-layout">
    <div class="texto-seccion">
      <h2>¿Cuánto aprendiste?</h2>
      <p class="lead">Repasa las ideas clave del pensamiento computacional.</p>
    </div>
    <div class="visual-seccion">
      <div class="fila">
        <PhotoCard src="/media/quiz-repaso.jpg" alt="Personas conversando sobre un tema frente a sus computadoras" caption="Repasa los conceptos" />
        <div class="glass panel">
          <div class="est" role="img" aria-label="Cinco estrellas"><span v-for="n in 5" :key="n">★</span></div>
          <p class="estado">Pensamiento computacional</p>
          <div class="acc">
            <button class="gbtn" type="button" disabled>Iniciar evaluación</button>
            <button class="gbtn suave" type="button" disabled>Reiniciar</button>
          </div>
        </div>
        <PhotoCard src="/media/quiz-prueba.jpg" alt="Equipo compartiendo ideas en una reunión de trabajo" caption="Pon a prueba tus ideas" />
      </div>
    </div>
  </section>
</template>
<style scoped>
.fila{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,2.2fr) minmax(0,.8fr);gap:.75rem;align-items:center;justify-items:center;width:100%;margin:0 auto}
.panel{padding:2rem;text-align:center;width:100%}
.est span{font-size:clamp(2.2rem,8vw,3.6rem);color:rgba(255,255,255,.25);display:inline-block;transition:color .4s}
.est .on{color:var(--sol);text-shadow:0 0 18px rgba(255,210,63,.8);animation:pop .6s var(--rebote)}
.estado{font-size:1.4rem;font-weight:700;margin:.6rem 0 1.2rem}
.acc{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
@keyframes pop{from{transform:scale(0) rotate(-120deg)}}
@media(max-width:900px){.fila{grid-template-columns:1fr;max-width:620px}.fila>:nth-child(2){order:-1}}
</style>
