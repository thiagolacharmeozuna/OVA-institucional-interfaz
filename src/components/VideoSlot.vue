<script setup>
// Para usar un video real: <VideoSlot src="/media/ejemplo.mp4" poster="/media/portada.jpg" />
defineProps({ src: String, poster: String, title: { type: String, default: 'Video' } })
</script>
<template>
  <figure class="tv">
    <video v-if="src" :src="src" :poster="poster" controls preload="metadata" :aria-label="title"></video>
    <button v-else class="vacio" type="button" disabled :aria-label="title">
      <span class="pantalla"><span class="playbtn">▶</span></span>
      <small>{{ title }}</small>
    </button>
  </figure>
</template>
<style scoped>
.tv{margin:0;border:8px solid var(--azul);border-radius:32px;overflow:hidden;background:var(--azul);box-shadow:0 14px 0 rgba(20,42,122,.25);aspect-ratio:16/9}
video{width:100%;height:100%;display:block}
.vacio{all:unset;display:grid;place-items:center;width:100%;height:100%;color:#fff;text-align:center}
.pantalla{display:grid;place-items:center;width:100%;height:100%;grid-area:1/1;position:relative;background:repeating-linear-gradient(45deg,#2563eb 0 24px,#3b82f6 24px 48px);background-size:68px 68px}
.vacio small{grid-area:1/1;align-self:end;padding:.6rem;background:rgba(20,42,122,.85);width:100%}
.vacio:disabled{opacity:1;cursor:default}
.playbtn{position:relative;z-index:1;width:68px;height:68px;border-radius:50%;background:var(--nar);display:grid;place-items:center;font-size:1.6rem;box-shadow:0 6px 0 #c2570a}
</style>
