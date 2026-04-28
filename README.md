# 🧙‍♂️ O Mago Contador

**Autores:** Luis Felipe Veronezi Bernardo e Leonardo Antoniassi

---

## 📖 Sobre o Jogo
"O Mago Contador" é um jogo web educativo e imersivo com elementos de RPG, desenvolvido especialmente para crianças em fase de alfabetização matemática (cerca de 6 anos de idade). 

O objetivo do jogo é ajudar o Mestre Alquimista a criar poções mágicas para curar os habitantes do vilarejo. Para isso, a criança precisará ler, contar as quantidades exatas de ingredientes mágicos pedidos e colocá-los no caldeirão. 

### 🌟 Principais Funcionalidades
- **Desenvolvimento Cognitivo:** Estimula a contagem ativa, reconhecimento de números (de 1 a 10) e associação de quantidades.
- **Progressão em RPG:** O jogo possui 5 fases temáticas (Cozinha Mágica, Jardim, Torre, Caverna e Salão). Ao concluir cada fase, o personagem da criança evolui visualmente, ganhando novos equipamentos mágicos (Colar, Robe, Chapéu e Cajado).
- **Feedback Emocional Visuais:** Os personagens (criados via SVG modular) reagem aos acertos com pulos e sorrisos, e aos erros com expressões de frustração, ajudando a guiar a criança.
- **Design Lúdico e Acessível:** Layout pensado para toques em tablets, com botões grandes, ícones fofos (emojis) e uma linguagem de texto bem simples e doce.
- **Trilha Sonora Integrada:** Músicas de fundo e efeitos sonoros imersivos gerados proceduralmente de forma nativa pelo navegador usando a *Web Audio API*.

---

## 🛠️ Como Rodar o Jogo Localmente

Este projeto foi construído utilizando **HTML5**, **CSS3**, **TypeScript** e **Vite**. O jogo não utiliza "assets" pesados (como grandes arquivos `.png` ou `.mp3`), o que o torna incrivelmente rápido e leve.

### Pré-requisitos
Você precisará ter o gerenciador de pacotes **npm** e o [Node.js](https://nodejs.org/) instalados em seu computador.

### Passos para Instalação

1. Abra o terminal na pasta raiz do projeto (`mago-contador`).
2. Instale as dependências necessárias executando:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. O terminal exibirá um link local (geralmente `http://localhost:5173/`). Acesse esse link através do seu navegador (Chrome, Firefox, Safari) para jogar!

### Como Publicar o Jogo (Produção)
Se desejar gerar a versão final para publicar o jogo na internet (em serviços como Vercel, Netlify ou GitHub Pages), execute o comando:
```bash
npm run build
```
Isso criará uma pasta chamada `/dist` com os arquivos finais minificados e otimizados prontos para hospedagem em qualquer servidor web estático.

---
*Divirta-se criando poções mágicas e salvando o mundo!* ✨

