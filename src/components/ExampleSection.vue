<script setup>
import VideoSlot from './VideoSlot.vue'
import PhotoCard from './PhotoCard.vue'
</script>
<template>
  <section class="seccion-layout">
    <div class="texto-seccion">
      <h2>Mira cómo funciona</h2>
      <p class="lead">Observa cómo se organiza un problema paso a paso.</p>
    </div>
    <div class="visual-seccion">
      <div class="fila">
        <PhotoCard src="/media/ejemplo-equipo.jpg" alt="Equipo colaborando para analizar un problema de programación" caption="Resolver en equipo" />
        <div class="glass tv"><VideoSlot title="Ejemplo guiado" /></div>
        <PhotoCard src="/media/ejemplo-analisis.jpg" alt="Equipo de trabajo revisando información en sus computadoras" caption="Analizar y probar" />
      </div>
    </div>
  </section>
</template>
<style scoped>
.fila{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,2.2fr) minmax(0,.8fr);gap:.75rem;align-items:center;justify-items:center;width:100%;margin:0 auto}
.tv{padding:12px;width:100%}
@media(max-width:900px){.fila{grid-template-columns:1fr;max-width:620px}.fila>:nth-child(2){order:-1}}
</style>
