<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import BgLiquid from './components/BgLiquid.vue'
import HeroSection from './components/HeroSection.vue'
import PillarsSection from './components/PillarsSection.vue'
import ExampleSection from './components/ExampleSection.vue'
import MissionsSection from './components/MissionsSection.vue'
import QuizSection from './components/QuizSection.vue'
import ResourcesSection from './components/ResourcesSection.vue'

const vistas = [
  { id: 'inicio', label: 'Inicio', c: HeroSection }, { id: 'conceptos', label: 'Conceptos', c: PillarsSection },
  { id: 'ejemplo', label: 'Ejemplo', c: ExampleSection }, { id: 'actividades', label: 'Actividades', c: MissionsSection },
  { id: 'autoevaluacion', label: 'Autoevaluación', c: QuizSection }, { id: 'recursos', label: 'Recursos', c: ResourcesSection }
]
const n = ref(0)
const loading = ref(true)
const actual = computed(() => vistas[n.value])
const ir = i => (n.value = Math.max(0, Math.min(vistas.length - 1, i)))
let timer
let buttonAudio
let backgroundAudio

const startBackgroundAudio = () => {
  if (!backgroundAudio || !backgroundAudio.paused) return
  backgroundAudio.play().catch(() => {})
}

const playButtonSound = event => {
  if (!event.target.closest?.('button') || !buttonAudio) return
  buttonAudio.currentTime = 0
  buttonAudio.play().catch(() => {})
}

onMounted(() => {
  backgroundAudio = new Audio('/media/Alan_Walker_-_The_Spectre_PrimeMusic.cc_(mp3.pm).mp3')
  backgroundAudio.loop = true
  backgroundAudio.preload = 'auto'
  backgroundAudio.volume = 0.1
  startBackgroundAudio()
  document.addEventListener('click', startBackgroundAudio)

  buttonAudio = new Audio('/media/erro.mp3')
  buttonAudio.preload = 'auto'
  buttonAudio.volume = 0.9
  document.addEventListener('click', playButtonSound)
  timer = window.setTimeout(() => {
    loading.value = false
  }, 700)
})

onBeforeUnmount(() => {
  window.clearTimeout(timer)
  document.removeEventListener('click', startBackgroundAudio)
  document.removeEventListener('click', playButtonSound)
  backgroundAudio?.pause()
  buttonAudio?.pause()
})
</script>

<template>
  <Transition name="boot">
    <div v-if="loading" class="boot-screen" role="status" aria-live="polite" aria-label="Cargando experiencia NOX">
      <div class="boot-orbit orbit-a"></div>
      <div class="boot-orbit orbit-b"></div>
      <div class="boot-core">
        <div class="boot-mark"><span>N</span><i>O</i><span>X</span></div>
        <p class="boot-caption">Neural learning interface</p>
        <div class="boot-bar"><span></span></div>
        <p class="boot-status"><b></b> INICIANDO VIAJE</p>
      </div>
      <span class="boot-coordinate coordinate-a">NOX // 01</span>
      <span class="boot-coordinate coordinate-b">PENSAR · CREAR · RESOLVER</span>
    </div>
  </Transition>

  <div class="app-shell">
    <BgLiquid v-if="!loading" />
    <header class="nav glass">
      <span class="logo"><span class="logo-mark">NOX</span> <span class="logo-text">Piensa&nbsp;Bit</span></span>
      <nav aria-label="Secciones del OVA">
        <button v-for="(v, i) in vistas" :key="v.id" :class="{ on: i === n }" :aria-current="i === n ? 'page' : null" v-ripple @click="ir(i)">{{ v.label }}</button>
      </nav>
    </header>
    <main>
      <Transition name="fade" mode="out-in">
        <component :is="actual.c" :key="actual.id" @ir="ir" />
      </Transition>
    </main>
  </div>
</template>

<style>
.app-shell{position:relative;isolation:isolate}
.nav{position:sticky;top:0;z-index:20;margin:0;width:100%;display:flex;flex-direction:column;align-items:center;gap:.4rem;padding:.7rem 1rem;border-radius:0}
.logo{display:flex;align-items:center;gap:.55rem;font-weight:700;font-size:1.1rem;letter-spacing:.04em}
.logo-mark{display:inline-flex;align-items:center;justify-content:center;padding:.25rem .75rem;border-radius:999px;background:linear-gradient(135deg,rgba(255,138,31,.9),rgba(255,95,162,.8));box-shadow:0 0 18px rgba(255,138,31,.35);font-size:.75rem;letter-spacing:.2em}
.logo-text{color:var(--ink)}
.nav nav{display:flex;gap:.3rem;flex-wrap:wrap;justify-content:center}
.nav nav button{font:inherit;font-size:.95rem;color:var(--ink);background:transparent;border:0;border-radius:999px;padding:.35rem .9rem;cursor:pointer;position:relative;overflow:hidden;transition:background .35s,transform .25s var(--rebote)}
.nav nav button:hover{transform:translateY(-2px) scale(1.06)}
.nav nav .on{background:rgba(255,255,255,.28);box-shadow:inset 0 1px 1px rgba(255,255,255,.6)}
main{padding:2.5rem 1.25rem 1rem;min-height:calc(100vh - 120px)}
.fade-enter-active,.fade-leave-active{transition:opacity .3s ease,transform .3s ease}
.fade-enter-from{opacity:0;transform:translateY(16px)}
.fade-leave-to{opacity:0;transform:translateY(-12px)}
.boot-screen{position:fixed;inset:0;z-index:100;display:grid;place-items:center;background:radial-gradient(ellipse at 50% 45%,rgba(25,57,104,.58),transparent 45%),radial-gradient(circle at 75% 15%,rgba(255,95,162,.15),transparent 26%),linear-gradient(145deg,#050817 0%,#09142e 48%,#100a20 100%);overflow:hidden}
.boot-screen::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(124,230,200,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(124,230,200,.055) 1px,transparent 1px);background-size:46px 46px;mask-image:radial-gradient(ellipse at center,#000,transparent 72%);animation:gridDrift 18s linear infinite}
.boot-screen::after{content:"";position:absolute;inset:-35%;background:linear-gradient(110deg,transparent 42%,rgba(124,230,200,.07) 49%,rgba(255,255,255,.12) 50%,rgba(124,230,200,.07) 51%,transparent 58%);animation:scan 3.8s ease-in-out infinite}
.boot-core{position:relative;z-index:2;display:grid;justify-items:center;gap:.85rem;min-width:min(360px,calc(100vw - 48px));padding:2.4rem 2.5rem;border-radius:30px;text-align:center;background:linear-gradient(145deg,rgba(17,30,61,.84),rgba(8,13,31,.74));border:1px solid rgba(124,230,200,.24);box-shadow:0 25px 80px rgba(0,0,0,.55),0 0 55px rgba(79,123,255,.16),inset 0 1px rgba(255,255,255,.14);backdrop-filter:blur(18px);animation:coreRise .9s var(--rebote) both}
.boot-mark{display:flex;align-items:center;gap:.12em;font-size:clamp(3.2rem,10vw,5.1rem);font-weight:900;line-height:1;letter-spacing:.12em;color:#fff;text-shadow:0 0 22px rgba(124,230,200,.3);animation:bootPulse 1.4s ease-in-out infinite alternate}
.boot-mark i{display:grid;place-items:center;width:.78em;height:.78em;border:2px solid #7ce6c8;border-radius:50%;font-style:normal;color:#7ce6c8;box-shadow:0 0 26px rgba(124,230,200,.35);animation:coreSpin 8s linear infinite}
.boot-caption{font-size:.68rem;letter-spacing:.3em;text-transform:uppercase;opacity:.64;margin-top:-.45rem}
.boot-bar{width:min(240px,52vw);height:10px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden;position:relative}
.boot-bar span{display:block;width:38%;height:100%;border-radius:inherit;background:linear-gradient(90deg,#7ce6c8,#4f7bff,#ff8a1f,#ffd23f);box-shadow:0 0 16px rgba(124,230,200,.65);animation:loading 1.35s ease-in-out infinite}
.boot-status{display:flex;align-items:center;gap:.55rem;font-size:.72rem;letter-spacing:.22em;opacity:.82}
.boot-status b{width:7px;height:7px;border-radius:50%;background:#7ce6c8;box-shadow:0 0 12px #7ce6c8;animation:statusPulse .8s ease-in-out infinite alternate}
.boot-orbit{position:absolute;z-index:1;left:50%;top:50%;border:1px solid rgba(124,230,200,.15);border-radius:50%;pointer-events:none}
.orbit-a{width:min(66vw,620px);aspect-ratio:1;animation:coreSpin 28s linear infinite}
.orbit-b{width:min(82vw,780px);aspect-ratio:1;border-style:dashed;opacity:.58;animation:coreSpin 42s linear infinite reverse}
.boot-coordinate{position:absolute;z-index:2;font:600 .65rem/1.4 monospace;letter-spacing:.17em;color:rgba(234,241,255,.4)}
.coordinate-a{top:28px;left:30px}.coordinate-b{right:30px;bottom:28px}
.boot-enter-active,.boot-leave-active{transition:opacity .5s ease,transform .5s ease}
.boot-enter-from,.boot-leave-to{opacity:0;transform:scale(1.08)}
.boot-enter-to,.boot-leave-from{opacity:1;transform:scale(1)}
@keyframes bootPulse{0%{transform:scale(.96);filter:drop-shadow(0 0 0 rgba(255,138,31,0))}100%{transform:scale(1.05);filter:drop-shadow(0 0 18px rgba(255,138,31,.35))}}
@keyframes loading{0%{transform:translateX(-110%)}50%{transform:translateX(120%)}100%{transform:translateX(-110%)}}
@keyframes scan{0%{transform:translateX(-65%) rotate(-12deg)}100%{transform:translateX(65%) rotate(-12deg)}}
@keyframes gridDrift{to{background-position:46px 46px}}
@keyframes coreRise{from{opacity:0;transform:translateY(18px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes coreSpin{to{transform:translate(-50%,-50%) rotate(360deg)}}
@keyframes statusPulse{to{opacity:.35;transform:scale(.72)}}
@media(max-width:520px){.boot-coordinate{font-size:.55rem}.coordinate-a{top:18px;left:18px}.coordinate-b{right:18px;bottom:18px}.boot-core{padding:2rem 1.5rem}}
@media(prefers-reduced-motion:reduce){.boot-screen::before,.boot-screen::after,.boot-core,.boot-mark i,.boot-bar span,.boot-orbit,.boot-status b{animation:none}}
</style>
