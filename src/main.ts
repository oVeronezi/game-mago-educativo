import './style.css';
import { GameLogic, PHASES } from './game.ts';
import { playSuccessSound, playErrorSound, startBackgroundMusic, playDropSound, playCauldronBubble, updateAudioPhase } from './audio.ts';

const game = new GameLogic();
const app = document.querySelector<HTMLDivElement>('#app')!;

let selectedIngredient = '';
let selectedAmount = 0;

function generateBackgroundStars() {
  for (let i = 0; i < 40; i++) {
    const star = document.createElement('div');
    star.className = 'bg-star';
    const size = Math.random() * 4 + 2; 
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    document.body.appendChild(star);
  }
}

function createSparkles(x: number, y: number) {
  for (let i = 0; i < 30; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
    sparkle.style.setProperty('--ty', `${(Math.random() - 0.5) * 200}px`);
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
  }
}

// --------------------------------------------------------
// Character SVG Generator (Modular Body with Emotions)
// --------------------------------------------------------
type Emotion = 'normal' | 'happy' | 'sad';

function renderCharacterSVG(type: 'boy' | 'girl' | 'alien', equip: { necklace: boolean, robe: boolean, hat: boolean, staff: boolean }, emotion: Emotion = 'normal', cssClass: string = '') {
   const skinColor = type === 'alien' ? '#55efc4' : (type === 'boy' ? '#ffeaa7' : '#fab1a0');
   const baseRobe = type === 'alien' ? '#636e72' : '#74b9ff';
   
   // Modular parts
   const necklaceLayer = equip.necklace ? `<circle cx="50" cy="55" r="5" fill="#ffd700" filter="drop-shadow(0 0 2px yellow)" />` : '';
   const robeLayer = equip.robe ? `<path d="M20,60 L80,60 L90,130 L10,130 Z" fill="#6c5ce7"/>` : `<path d="M30,60 L70,60 L80,120 L20,120 Z" fill="${baseRobe}"/>`;
   const hatLayer = equip.hat ? `<path d="M10,35 L90,35 L50,0 Z" fill="#81ecec"/><ellipse cx="50" cy="35" rx="45" ry="10" fill="#00cec9"/>` : '';
   const staffLayer = equip.staff ? `<rect x="85" y="40" width="6" height="90" fill="#d63031"/><circle cx="88" cy="35" r="10" fill="#ffeaa7" filter="drop-shadow(0 0 5px gold)" />` : '';

   // Face specifics based on emotion
   let face = '';
   
   if(type === 'boy') {
      if (emotion === 'normal') {
          face = `<circle cx="40" cy="40" r="3" fill="#2d3436"/><circle cx="60" cy="40" r="3" fill="#2d3436"/><path d="M45,48 Q50,53 55,48" stroke="#2d3436" fill="transparent" stroke-width="2"/>`;
      } else if (emotion === 'happy') {
          face = `<path d="M37,40 Q40,37 43,40" stroke="#2d3436" fill="transparent" stroke-width="2"/><path d="M57,40 Q60,37 63,40" stroke="#2d3436" fill="transparent" stroke-width="2"/><path d="M45,48 Q50,55 55,48 Z" fill="#2d3436"/>`;
      } else if (emotion === 'sad') {
          face = `<circle cx="40" cy="40" r="3" fill="#2d3436"/><circle cx="60" cy="40" r="3" fill="#2d3436"/><path d="M45,51 Q50,46 55,51" stroke="#2d3436" fill="transparent" stroke-width="2"/>`;
      }
   }
   else if(type === 'girl') {
      if (emotion === 'normal') {
          face = `<circle cx="40" cy="40" r="3" fill="#2d3436"/><circle cx="60" cy="40" r="3" fill="#2d3436"/><path d="M45,50 Q50,55 55,50" stroke="#e17055" fill="transparent" stroke-width="3"/>`;
      } else if (emotion === 'happy') {
          face = `<path d="M37,40 Q40,37 43,40" stroke="#2d3436" fill="transparent" stroke-width="2"/><path d="M57,40 Q60,37 63,40" stroke="#2d3436" fill="transparent" stroke-width="2"/><path d="M45,48 Q50,58 55,48 Z" fill="#e17055"/>`;
      } else if (emotion === 'sad') {
          face = `<circle cx="40" cy="40" r="3" fill="#2d3436"/><circle cx="60" cy="40" r="3" fill="#2d3436"/><path d="M45,52 Q50,47 55,52" stroke="#e17055" fill="transparent" stroke-width="3"/>`;
      }
   }
   else if(type === 'alien') {
      if (emotion === 'normal') {
          face = `<ellipse cx="35" cy="40" rx="8" ry="12" fill="#2d3436" transform="rotate(-15 35 40)"/><ellipse cx="65" cy="40" rx="8" ry="12" fill="#2d3436" transform="rotate(15 65 40)"/><path d="M48,52 Q50,53 52,52" stroke="#00b894" fill="transparent" stroke-width="2"/>`;
      } else if (emotion === 'happy') {
          face = `<ellipse cx="35" cy="40" rx="8" ry="5" fill="#2d3436" transform="rotate(-15 35 40)"/><ellipse cx="65" cy="40" rx="8" ry="5" fill="#2d3436" transform="rotate(15 65 40)"/><path d="M45,52 Q50,58 55,52 Z" fill="#00b894"/>`;
      } else if (emotion === 'sad') {
          face = `<ellipse cx="35" cy="40" rx="8" ry="8" fill="#2d3436" transform="rotate(-15 35 40)"/><ellipse cx="65" cy="40" rx="8" ry="8" fill="#2d3436" transform="rotate(15 65 40)"/><path d="M48,54 Q50,51 52,54" stroke="#00b894" fill="transparent" stroke-width="2"/>`;
      }
   }

   return `
   <svg viewBox="0 0 100 140" class="svg-avatar ${cssClass}">
      <!-- Body/Robe -->
      ${robeLayer}
      <!-- Arms -->
      <path d="M20,60 L10,90" stroke="${skinColor}" stroke-width="8" stroke-linecap="round"/>
      <path d="M80,60 L90,90" stroke="${skinColor}" stroke-width="8" stroke-linecap="round"/>
      <!-- Necklace -->
      ${necklaceLayer}
      <!-- Head -->
      <circle cx="50" cy="40" r="20" fill="${skinColor}" />
      <!-- Face -->
      ${face}
      <!-- Hat -->
      ${hatLayer}
      <!-- Staff -->
      ${staffLayer}
   </svg>`;
}

// --------------------------------------------------------
// Views
// --------------------------------------------------------

function renderViewIntro() {
  app.innerHTML = `
    <div class="view active">
      <h1>O Chamado Mágico</h1>
      <div class="intro-dialogue">
        <div style="font-size: 5rem; margin-bottom: 20px;">🧓🔮</div>
        "Olá! Eu sou o Mestre.<br><br>
        Muitas pessoas estão dodóis. Nós precisamos fazer poções mágicas para curar todo mundo!<br><br>
        Você me ajuda a contar os ingredientes mágicos?"
      </div>
      <button class="btn" id="acceptMissionBtn">Sim, eu ajudo! 🌟</button>
    </div>
  `;
  document.getElementById('acceptMissionBtn')?.addEventListener('click', () => {
     playSuccessSound();
     startBackgroundMusic();
     renderView1();
  });
}

function renderView1() {
  app.innerHTML = `
    <div class="view active" id="view1">
      <h1>Escolha seu Personagem!</h1>
      <div class="chars-container">
        <div class="char-card" data-type="boy">
          ${renderCharacterSVG('boy', {necklace:false, robe:false, hat:false, staff:false})}
          <div class="char-name">Mago Menino</div>
        </div>
        <div class="char-card" data-type="girl">
          ${renderCharacterSVG('girl', {necklace:false, robe:false, hat:false, staff:false})}
          <div class="char-name">Maga Menina</div>
        </div>
        <div class="char-card" data-type="alien">
          ${renderCharacterSVG('alien', {necklace:false, robe:false, hat:false, staff:false})}
          <div class="char-name">Mago ET</div>
        </div>
      </div>
    </div>
  `;
  
  document.querySelectorAll('.char-card').forEach(card => {
    card.addEventListener('click', (e) => {
      game.playerType = (e.currentTarget as HTMLElement).dataset.type as any;
      playSuccessSound();
      renderView2();
    });
  });
}

function renderView2() {
  app.innerHTML = `
    <div class="view active" id="view2">
      <div class="chosen-avatar-container">
         ${renderCharacterSVG(game.playerType, game.equipment, 'happy', 'anim-jump')}
      </div>
      <input type="text" class="name-input" id="playerName" placeholder="Qual é o seu nome, mago?" autocomplete="off" />
      <button class="btn" id="startAdventureBtn">Começar Aventura! 🌟</button>
    </div>
  `;
  
  document.getElementById('startAdventureBtn')?.addEventListener('click', () => {
    const nameInput = (document.getElementById('playerName') as HTMLInputElement).value.trim();
    if (nameInput) {
      game.playerName = nameInput;
      playSuccessSound();
      game.startPhase(0);
      updateAudioPhase(game.currentPhase.id);
      renderView3();
    } else {
      playErrorSound();
    }
  });
}

function updateSidePanelSVG(emotion: Emotion, cssClass: string) {
   const svgContainer = document.getElementById('sidePanelSvgContainer');
   if (svgContainer) {
      svgContainer.innerHTML = renderCharacterSVG(game.playerType, game.equipment, emotion, cssClass);
   }
}

function renderView3() {
  document.body.dataset.theme = `phase-${game.currentPhase.id}`;
  
  app.innerHTML = `
    <div class="view active gameplay-layout">
      <!-- Side HUD com personagem de corpo inteiro -->
      <div class="side-panel">
         <div id="sidePanelSvgContainer">
            ${renderCharacterSVG(game.playerType, game.equipment, 'normal')}
         </div>
         <div class="hero-name">${game.playerName}</div>
         <div class="hero-title">${game.currentPhase.title}</div>
      </div>

      <!-- Main Gameplay Area -->
      <div class="main-panel">
        <header>
          ${game.currentPhase.local} - Rodada ${game.currentRound}/${game.maxRounds}
        </header>

        <div class="master-container">
          <div class="master-emoji">🧓🔮</div>
          <div class="speech-bubble">${game.playerName}, coloque ${game.targetAmount} ${game.targetIngredient} no caldeirão!</div>
        </div>

        <div class="ingredients-area">
          ${game.availableIngredients.map(ing => `
            <div class="ingredient-btn" data-ing="${ing}">${ing}</div>
          `).join('')}
        </div>

        <div class="cauldron-area" id="cauldronArea">
          <div class="cauldron-contents">
            ${game.cauldronItems.map((item, i) => `<div class="cauldron-item" style="animation-delay: ${i*0.1}s">${item}</div>`).join('')}
          </div>
          <div class="cauldron-emoji">🫕</div>
        </div>

        ${game.cauldronItems.length > 0 ? `<button class="btn" id="throwPotionBtn">Jogar a Poção! ✨</button>` : `<button class="btn" id="clearCauldronBtn">Limpar 🧹</button>`}
      </div>

      <!-- Modal Overlay -->
      <div class="modal-overlay" id="ingredientModal">
        <div class="modal-content">
          <h2>Quantos você quer adicionar?</h2>
          <div class="modal-ingredient" id="modalEmoji"></div>
          <div class="numbers-grid" id="modalNumbers"></div>
          <button class="btn" id="addIngredientBtn">Adicionar ao Caldeirão 🫕</button>
          <br><br>
          <button class="btn" style="background:#ff4757;font-size:1.2rem;border-color:#ff6b81;" id="cancelModalBtn">Cancelar</button>
        </div>
      </div>
    </div>
  `;

  if (game.cauldronItems.length > 0) playDropSound();

  document.querySelectorAll('.ingredient-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      selectedIngredient = (e.currentTarget as HTMLElement).dataset.ing!;
      selectedAmount = 1;
      playDropSound();
      openModal();
    });
  });

  document.getElementById('clearCauldronBtn')?.addEventListener('click', () => {
     game.clearCauldron();
     renderView3();
  });

  document.getElementById('throwPotionBtn')?.addEventListener('click', (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const cauldronArea = document.getElementById('cauldronArea')!;
    playCauldronBubble();
    cauldronArea.classList.add('bubbling');
    
    // Desabilita botão para não clicar duas vezes
    btn.disabled = true;
    
    setTimeout(() => {
      if (game.checkCauldron()) {
         playSuccessSound();
         updateSidePanelSVG('happy', 'anim-jump'); // Feedback Emocional Positivo
         
         const rect = btn.getBoundingClientRect();
         createSparkles(rect.left + rect.width/2, rect.top + rect.height/2);
         
         const mainPanel = document.querySelector('.main-panel')!;
         mainPanel.innerHTML = `
             <h2>Incrível, ${game.playerName}! A poção funcionou! 🎉</h2>
             <div class="celebration-icon" style="font-size: 6rem;">✨</div>
         `;
         
         setTimeout(() => {
            const nextAction = game.advanceRound();
            if (nextAction === 'GAME_COMPLETE') renderViewFinalStory();
            else if (nextAction === 'PHASE_COMPLETE') renderViewPhaseEnd();
            else renderView3();
         }, 2500);
         
      } else {
         playErrorSound();
         updateSidePanelSVG('sad', 'anim-shake-sad'); // Feedback Emocional Negativo
         
         const mainPanel = document.querySelector('.main-panel')!;
         mainPanel.innerHTML = `
             <h2>Ops! Deu errado! Vamos tentar de novo! 💪</h2>
             <div class="frog-error" style="font-size: 6rem;">🐸</div>
         `;
         game.clearCauldron();
         setTimeout(() => { renderView3(); }, 3000);
      }
    }, 1000);
  });

  document.getElementById('cancelModalBtn')?.addEventListener('click', closeModal);
  document.getElementById('addIngredientBtn')?.addEventListener('click', () => {
    if(selectedAmount > 0) {
      game.addToCauldron(selectedIngredient, selectedAmount);
      closeModal();
      renderView3(); 
    }
  });
}

function openModal() {
  const modal = document.getElementById('ingredientModal')!;
  document.getElementById('modalEmoji')!.innerText = selectedIngredient;
  const numbersGrid = document.getElementById('modalNumbers')!;
  numbersGrid.innerHTML = '';
  
  for(let i=1; i<=game.currentPhase.max; i++) {
     const nBtn = document.createElement('div');
     nBtn.className = 'num-btn' + (i === selectedAmount ? ' selected' : '');
     nBtn.innerText = i.toString();
     nBtn.onclick = () => {
        selectedAmount = i;
        document.querySelectorAll('.num-btn').forEach(b => b.classList.remove('selected'));
        nBtn.classList.add('selected');
        playDropSound();
     };
     numbersGrid.appendChild(nBtn);
  }
  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('ingredientModal')!.classList.remove('active');
}

function renderViewPhaseEnd() {
  playSuccessSound();
  
  const nextPhase = game.currentPhaseIndex + 1;
  const tempGame = new GameLogic();
  tempGame.currentPhaseIndex = nextPhase;
  
  app.innerHTML = `
    <div class="view active level-up-flash">
      <h1>Parabéns, ${game.playerName}!</h1>
      <h2>Você evoluiu e recebeu um novo equipamento!</h2>
      <div class="chosen-avatar-container">
         ${renderCharacterSVG(game.playerType, tempGame.equipment, 'happy', 'anim-jump')}
      </div>
      <h2>Agora você é um(a) ${PHASES[nextPhase].title}!</h2>
      <button class="btn" id="nextPhaseBtn">Avançar 🚀</button>
    </div>
  `;
  createSparkles(window.innerWidth/2, window.innerHeight/2);
  
  document.getElementById('nextPhaseBtn')?.addEventListener('click', () => {
     game.startPhase(nextPhase);
     updateAudioPhase(game.currentPhase.id);
     renderView3();
  });
}

// Etapa 1: Cutscene Narrativa de Fim
function renderViewFinalStory() {
  document.body.dataset.theme = 'phase-5';
  app.innerHTML = `
    <div class="view active">
      <h1>A Paz foi Restaurada!</h1>
      <div class="intro-dialogue" style="display:flex; flex-direction:column; align-items:center;">
        <div style="display:flex; gap: 30px; margin-bottom: 20px;">
           <div style="font-size: 5rem;">🧓</div>
           <div style="width:100px;">${renderCharacterSVG(game.playerType, game.equipment, 'happy')}</div>
        </div>
        "Nós conseguimos, ${game.playerName}!<br><br>
        Você contou muito bem e todas as poções deram certo!<br><br>
        Graças a você, todos os nossos amigos estão curados e felizes de novo. Você é um verdadeiro herói!"
      </div>
      <button class="btn" id="goToTrophyBtn">Receber Coroa 👑</button>
    </div>
  `;

  document.getElementById('goToTrophyBtn')?.addEventListener('click', () => {
     playSuccessSound();
     renderViewFinal();
  });
}

// Etapa 2: Troféu
function renderViewFinal() {
  app.innerHTML = `
    <div class="view active">
      <h1 style="color:var(--accent);">👑 Mestre das Poções!</h1>
      <h2>${game.playerName} salvou o mundo!</h2>
      <div class="chosen-avatar-container" style="margin:20px 0; transform: scale(1.5);">
         ${renderCharacterSVG(game.playerType, game.equipment, 'happy', 'anim-jump')}
      </div>
      <button class="btn" id="restartBtn">Jogar de Novo 🔄</button>
    </div>
  `;
  for(let i=0; i<8; i++) {
     setTimeout(() => createSparkles(Math.random()*window.innerWidth, Math.random()*window.innerHeight), i*400);
  }
  
  document.getElementById('restartBtn')?.addEventListener('click', () => {
     window.location.reload();
  });
}

// Inicia com o fundo animado
generateBackgroundStars();
// Começa a tela 0
renderViewIntro();
