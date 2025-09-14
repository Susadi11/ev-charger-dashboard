import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div class="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
    <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
      <div class="flex justify-center space-x-8 mb-8">
        <a href="https://vite.dev" target="_blank" class="transition-transform hover:scale-110">
          <img src="${viteLogo}" class="h-24 w-24" alt="Vite logo" />
        </a>
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" class="transition-transform hover:scale-110">
          <img src="${javascriptLogo}" class="h-24 w-24" alt="JavaScript logo" />
        </a>
      </div>
      <h1 class="text-4xl font-bold text-white mb-8">EV Charger Dashboard</h1>
      <div class="bg-white/20 rounded-xl p-6 mb-6">
        <button id="counter" type="button" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"></button>
      </div>
      <p class="text-gray-300 text-sm">
        Click on the Vite logo to learn more
      </p>
    </div>
  </div>
`

setupCounter(document.querySelector('#counter'))
