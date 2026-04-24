export interface Phase {
  id: number;
  local: string;
  title: string;
  min: number;
  max: number;
}

export const PHASES: Phase[] = [
  { id: 1, local: 'Cozinha Mágica', title: 'Aprendiz', min: 1, max: 3 },
  { id: 2, local: 'Jardim Encantado', title: 'Alquimista', min: 1, max: 5 },
  { id: 3, local: 'Torre das Estrelas', title: 'Feiticeiro', min: 1, max: 7 },
  { id: 4, local: 'Caverna dos Cristais', title: 'Mago', min: 1, max: 9 },
  { id: 5, local: 'Salão do Mestre', title: 'Mestre Supremo', min: 1, max: 10 }
];

export const INGREDIENTS = ['🐸', '🍄', '🍎', '💎', '🧪', '🦇', '🕷️', '🌿', '🔮', '✨'];

export class GameLogic {
  playerName: string = '';
  playerType: 'boy' | 'girl' | 'alien' = 'boy';
  
  currentPhaseIndex: number = 0;
  currentRound: number = 1;
  maxRounds: number = 3;

  targetIngredient: string = '';
  targetAmount: number = 0;
  
  cauldronItems: string[] = [];
  availableIngredients: string[] = [];

  get currentPhase() {
    return PHASES[this.currentPhaseIndex];
  }

  get equipment() {
    return {
      necklace: this.currentPhaseIndex >= 1, // Phase 2
      robe: this.currentPhaseIndex >= 2,     // Phase 3
      hat: this.currentPhaseIndex >= 3,      // Phase 4
      staff: this.currentPhaseIndex >= 4     // Phase 5
    }
  }

  startPhase(index: number) {
    this.currentPhaseIndex = index;
    this.currentRound = 1;
    this.startRound();
  }

  startRound() {
    this.cauldronItems = [];
    const phase = this.currentPhase;
    this.targetAmount = Math.floor(Math.random() * (phase.max - phase.min + 1)) + phase.min;
    
    // Choose random ingredient
    this.targetIngredient = INGREDIENTS[Math.floor(Math.random() * INGREDIENTS.length)];
    
    // Generate available ingredients (target + 2 random distractors)
    const set = new Set<string>();
    set.add(this.targetIngredient);
    while(set.size < 3) {
       set.add(INGREDIENTS[Math.floor(Math.random() * INGREDIENTS.length)]);
    }
    this.availableIngredients = Array.from(set).sort(() => Math.random() - 0.5);
  }

  addToCauldron(ingredient: string, amount: number) {
     for(let i=0; i<amount; i++) {
        this.cauldronItems.push(ingredient);
     }
  }

  clearCauldron() {
      this.cauldronItems = [];
  }

  checkCauldron(): boolean {
     if (this.cauldronItems.length !== this.targetAmount) return false;
     for (let item of this.cauldronItems) {
        if (item !== this.targetIngredient) return false;
     }
     return true;
  }

  advanceRound(): 'NEXT_ROUND' | 'PHASE_COMPLETE' | 'GAME_COMPLETE' {
    this.currentRound++;
    if (this.currentRound > this.maxRounds) {
      if (this.currentPhaseIndex === PHASES.length - 1) {
         return 'GAME_COMPLETE';
      } else {
         return 'PHASE_COMPLETE';
      }
    }
    this.startRound();
    return 'NEXT_ROUND';
  }
}
