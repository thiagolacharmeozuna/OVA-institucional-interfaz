import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// v-ripple: onda de luz (desvanecimiento) cada vez que se toca un botón
const ripple = {
  mounted(el) {
    el.addEventListener('pointerdown', e => {
      const r = el.getBoundingClientRect(), d = Math.max(r.width, r.height)
      const s = document.createElement('span')
      s.className = 'ripple'
      Object.assign(s.style, { width: d + 'px', height: d + 'px', left: e.clientX - r.left - d / 2 + 'px', top: e.clientY - r.top - d / 2 + 'px' })
      el.appendChild(s); setTimeout(() => s.remove(), 700)
    })
  }
}
createApp(App).directive('ripple', ripple).mount('#app')
