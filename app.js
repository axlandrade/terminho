const TERM_WORDS = [
  "AMORA",
  "BALDE",
  "CAIXA",
  "DOIDO",
  "FESTA",
  "GOSTO",
  "LIVRO",
  "MUNDO",
  "NOITE",
  "PRAIA",
  "RISOS",
  "SORTE",
  "TARDE",
  "VENTO",
  "ZEBRA",
  "BRISA",
  "CHAVE",
  "DENTE",
  "FOLHA",
  "GRITO",
  "JUNTO",
  "LIMAO",
  "MELAO",
  "NUVEM",
  "OLHAR",
  "PEDRA",
  "QUASE",
  "RADIO",
  "SOLAR",
  "TERRA",
  "UNIAO",
  "VALSA",
  "XAMPU",
];

const CONTEXT_PUZZLES = [
  {
    target: "CAFE",
    hint: "Costuma aparecer em pausa, conversa e manha.",
    close: [
      "CAPPUCCINO",
      "EXPRESSO",
      "BARISTA",
      "GRAO",
      "XICARA",
      "CAFETERIA",
      "COADOR",
      "LEITE",
      "ACUCAR",
      "MANHA",
      "BOLO",
      "PAO",
      "MESA",
      "TRABALHO",
      "ENERGIA",
      "BEBIDA",
      "QUENTE",
      "AMARGO",
      "AROMA",
      "TORRADO",
    ],
  },
  {
    target: "PRAIA",
    hint: "Tem cheiro de descanso, sol e caminho para a agua.",
    close: [
      "AREIA",
      "MAR",
      "ONDA",
      "SOL",
      "GUARDA-SOL",
      "BIQUINI",
      "CONCHA",
      "MERGULHO",
      "VERAO",
      "TOALHA",
      "CALOR",
      "VIAGEM",
      "FERIAS",
      "LITORAL",
      "SAL",
      "BRONZE",
      "CHINELO",
      "SORVETE",
      "BARRACA",
      "PISCINA",
    ],
  },
  {
    target: "CINEMA",
    hint: "Escurece a sala e acende uma historia.",
    close: [
      "FILME",
      "TELA",
      "PIPOCA",
      "SESSAO",
      "ATOR",
      "DIRETOR",
      "INGRESSO",
      "CADEIRA",
      "TRAILER",
      "ROTEIRO",
      "DRAMA",
      "COMEDIA",
      "CAMERA",
      "HOLLYWOOD",
      "ESTREIA",
      "SALA",
      "SOM",
      "PROJETOR",
      "ROMANCE",
      "SERIE",
    ],
  },
  {
    target: "JARDIM",
    hint: "Fica melhor quando alguem rega e tem paciencia.",
    close: [
      "FLOR",
      "PLANTA",
      "REGADOR",
      "GRAMA",
      "TERRA",
      "VASO",
      "SEMENTE",
      "FOLHA",
      "ADUBO",
      "ROSA",
      "HORTA",
      "ARVORE",
      "QUINTAL",
      "VERDE",
      "PERFUME",
      "SOL",
      "CHUVA",
      "PODA",
      "RAIZ",
      "NATUREZA",
    ],
  },
];

const CONEXO_PUZZLES = [
  {
    groups: [
      {
        name: "Coisas de padaria",
        words: ["PAO", "BOLO", "SONHO", "BROA"],
      },
      {
        name: "Podem ser de baralho",
        words: ["COPAS", "OUROS", "ESPADAS", "PAUS"],
      },
      {
        name: "Comecam com corpo",
        words: ["CABECEIRA", "BRACADA", "PEZINHO", "OLHEIRA"],
      },
      {
        name: "No ceu",
        words: ["NUVEM", "ESTRELA", "LUA", "COMETA"],
      },
    ],
  },
  {
    groups: [
      {
        name: "Temperos",
        words: ["SAL", "ALHO", "CEBOLA", "PIMENTA"],
      },
      {
        name: "Itens de escritorio",
        words: ["CLIPS", "LAPIS", "PASTA", "REGUA"],
      },
      {
        name: "Palavras com dupla leitura",
        words: ["MANGA", "BANCO", "VELA", "PLANTA"],
      },
      {
        name: "Coisas de festa",
        words: ["BEXIGA", "DOCINHO", "CONVITE", "MUSICA"],
      },
    ],
  },
  {
    groups: [
      {
        name: "Cores",
        words: ["AZUL", "ROSA", "PRETO", "VERDE"],
      },
      {
        name: "Partes da casa",
        words: ["SALA", "QUARTO", "COZINHA", "VARANDA"],
      },
      {
        name: "Podem ser doces",
        words: ["PUDIM", "MEL", "GELEIA", "BRIGADEIRO"],
      },
      {
        name: "Sons humanos",
        words: ["RISADA", "SUSPIRO", "GRITO", "CANTO"],
      },
    ],
  },
];

const TERM_ROWS = 6;
const TERM_COLS = 5;
const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

const state = {
  currentGame: "termooo",
  term: null,
  context: null,
  conexo: null,
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .toUpperCase();
}

function randomIndex(length) {
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % length;
  }

  return Math.floor(Math.random() * length);
}

function pickRandom(list) {
  return list[randomIndex(list.length)];
}

function shuffle(items, salt = 0) {
  const copy = [...items];
  const saltNumber = Number.isFinite(salt) ? Math.trunc(Math.abs(salt)) : 0;
  let seed = (randomIndex(233280) + saltNumber + 97) % 233280;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const swapIndex = seed % (index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function switchGame(game) {
  state.currentGame = game;
  $$(".tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.game === game));
  $$(".game-view").forEach((view) => {
    view.classList.toggle("is-active", view.dataset.view === game);
  });
  window.location.hash = game;
}

function initTabs() {
  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => switchGame(tab.dataset.game));
  });

  const initial = window.location.hash.replace("#", "");
  if (["termooo", "contexto", "conexo"].includes(initial)) {
    switchGame(initial);
  }
}

function initTerm() {
  state.term = {
    answer: pickRandom(TERM_WORDS),
    guesses: [],
    current: "",
    done: false,
    keyStatus: {},
  };

  renderTerm();
}

function buildTermKeyStatus(guesses, answer) {
  return guesses.reduce((keyStatus, guess) => {
    evaluateGuess(guess, answer).forEach((result, index) => {
      const letter = guess[index];
      const previous = keyStatus[letter];
      if (previous === "correct") return;
      if (previous === "present" && result === "absent") return;
      keyStatus[letter] = result;
    });
    return keyStatus;
  }, {});
}

function renderTerm() {
  const board = $("#term-board");
  const { guesses, current, answer, done } = state.term;
  board.innerHTML = "";

  for (let row = 0; row < TERM_ROWS; row += 1) {
    const guess = guesses[row] || (row === guesses.length ? current : "");
    const evaluation = guesses[row] ? evaluateGuess(guesses[row], answer) : [];
    for (let col = 0; col < TERM_COLS; col += 1) {
      const tile = document.createElement("div");
      tile.className = "letter-tile";
      tile.textContent = guess[col] || "";
      if (guess[col]) tile.classList.add("is-filled");
      if (evaluation[col]) {
        tile.classList.add(evaluation[col]);
        tile.setAttribute(
          "aria-label",
          `${guess[col]}: ${termResultLabels[evaluation[col]]}`,
        );
        tile.title = termResultLabels[evaluation[col]];
      }
      board.append(tile);
    }
  }

  const status = $("#term-status");
  if (done && guesses.at(-1) === answer) {
    status.textContent = `Acertou em ${guesses.length} tentativa${guesses.length === 1 ? "" : "s"}. Recarregue para sortear outra palavra.`;
  } else if (done) {
    status.textContent = `A palavra era ${answer}. Recarregue para sortear outra palavra.`;
  } else {
    status.textContent = "Tente descobrir a palavra sorteada.";
  }

  renderTermFeedback();
  renderKeyboard();
}

const termResultLabels = {
  correct: "letra no lugar certo",
  present: "letra existe, mas esta em outro lugar",
  absent: "letra nao esta na palavra",
};

function renderTermFeedback() {
  const feedback = $("#term-feedback");
  const { guesses, answer } = state.term;

  if (guesses.length === 0) {
    feedback.textContent = "Depois de enviar, cada letra ganha uma cor.";
    return;
  }

  const lastGuess = guesses.at(-1);
  const counts = evaluateGuess(lastGuess, answer).reduce(
    (summary, result) => {
      summary[result] += 1;
      return summary;
    },
    { correct: 0, present: 0, absent: 0 },
  );

  feedback.textContent = `Ultima: ${counts.correct} no lugar, ${counts.present} em outro lugar, ${counts.absent} nao tem.`;
}

function renderKeyboard() {
  const keyboard = $("#term-keyboard");
  keyboard.innerHTML = "";

  KEY_ROWS.forEach((row, rowIndex) => {
    const rowElement = document.createElement("div");
    rowElement.className = "key-row";

    if (rowIndex === 2) {
      rowElement.append(createKey("ENTER", "is-wide", "↵", "Enviar"));
    }

    row.split("").forEach((letter) => rowElement.append(createKey(letter)));

    if (rowIndex === 2) {
      rowElement.append(createKey("⌫", "is-wide"));
    }

    keyboard.append(rowElement);
  });
}

function createKey(label, extraClass = "", displayLabel = label, accessibleLabel = label) {
  const key = document.createElement("button");
  key.type = "button";
  key.className = `word-key ${extraClass}`.trim();
  key.textContent = displayLabel;
  key.setAttribute("aria-label", accessibleLabel);
  key.disabled = state.term.done;
  key.addEventListener("click", () => handleTermInput(label));

  const status = state.term.keyStatus[label];
  if (status) key.classList.add(status);
  return key;
}

function evaluateGuess(guess, answer) {
  const result = Array(TERM_COLS).fill("absent");
  const remaining = answer.split("");

  for (let index = 0; index < TERM_COLS; index += 1) {
    if (guess[index] === answer[index]) {
      result[index] = "correct";
      remaining[index] = null;
    }
  }

  for (let index = 0; index < TERM_COLS; index += 1) {
    if (result[index] === "correct") continue;
    const foundAt = remaining.indexOf(guess[index]);
    if (foundAt !== -1) {
      result[index] = "present";
      remaining[foundAt] = null;
    }
  }

  return result;
}

function handleTermInput(input) {
  const term = state.term;
  if (term.done) {
    showToast("Rodada encerrada. Recarregue para sortear outra palavra.");
    return;
  }

  if (input === "ENTER") {
    submitTermGuess();
    return;
  }

  if (input === "⌫" || input === "BACKSPACE") {
    term.current = term.current.slice(0, -1);
    renderTerm();
    return;
  }

  const letter = normalize(input).slice(0, 1);
  if (letter && term.current.length < TERM_COLS) {
    term.current += letter;
    renderTerm();
  }
}

function submitTermGuess() {
  const term = state.term;
  if (term.current.length < TERM_COLS) {
    showToast("Faltam letras.");
    return;
  }

  const guess = term.current;
  const evaluation = evaluateGuess(guess, term.answer);
  term.guesses.push(guess);
  term.current = "";

  evaluation.forEach((result, index) => {
    const letter = guess[index];
    const previous = term.keyStatus[letter];
    if (previous === "correct") return;
    if (previous === "present" && result === "absent") return;
    term.keyStatus[letter] = result;
  });

  if (guess === term.answer || term.guesses.length === TERM_ROWS) {
    term.done = true;
  }

  renderTerm();
}

function shareTerm() {
  const term = state.term;
  const rows = term.guesses
    .map((guess) =>
      evaluateGuess(guess, term.answer)
        .map((result) => ({ correct: "🟩", present: "🟨", absent: "⬛" })[result])
        .join(""),
    )
    .join("\n");
  const text = `Terminho Termooo ${term.guesses.length}/${TERM_ROWS}\n${rows}`;

  navigator.clipboard
    ?.writeText(text)
    .then(() => showToast("Resultado copiado."))
    .catch(() => showToast("Nao consegui copiar automaticamente."));
}

function initContext() {
  const puzzle = pickRandom(CONTEXT_PUZZLES);
  state.context = {
    puzzle,
    guesses: [],
    done: false,
    hints: 0,
  };
  $("#context-input").value = "";
  renderContext();
}

function scoreContextGuess(rawGuess) {
  const puzzle = state.context.puzzle;
  const guess = normalize(rawGuess);
  const target = normalize(puzzle.target);

  if (guess === target) {
    return { word: guess, rank: 1, heat: 100, label: "acertou" };
  }

  const closeIndex = puzzle.close.map(normalize).indexOf(guess);
  if (closeIndex !== -1) {
    const rank = closeIndex + 2;
    const heat = Math.max(18, Math.round(96 - closeIndex * 4.1));
    return { word: guess, rank, heat, label: heatLabel(heat) };
  }

  const shared = [...new Set(guess)].filter((letter) => target.includes(letter)).length;
  const heat = Math.min(46, Math.max(4, shared * 8 + Math.abs(target.length - guess.length)));
  const rank = Math.max(22, 120 - heat);
  return { word: guess, rank, heat, label: heatLabel(heat) };
}

function heatLabel(heat) {
  if (heat >= 88) return "pegando fogo";
  if (heat >= 72) return "quente";
  if (heat >= 52) return "morno";
  if (heat >= 28) return "frio";
  return "gelado";
}

function submitContext(event) {
  event.preventDefault();
  const input = $("#context-input");
  const guess = normalize(input.value);

  if (!guess) {
    showToast("Digite um palpite.");
    return;
  }

  if (state.context.guesses.some((item) => item.word === guess)) {
    showToast("Esse ja foi.");
    input.value = "";
    return;
  }

  const result = scoreContextGuess(guess);
  state.context.guesses.unshift(result);
  input.value = "";

  if (result.heat === 100) {
    state.context.done = true;
  }

  renderContext();
}

function renderContext() {
  const context = state.context;
  const bestHeat = context.guesses.reduce((best, item) => Math.max(best, item.heat), 8);
  const heat = $("#context-heat");
  heat.style.height = `${bestHeat}%`;
  heat.style.width = `${bestHeat}%`;

  const status = $("#context-status");
  if (context.done) {
    status.textContent = `Boa. A palavra era ${context.puzzle.target}.`;
  } else if (context.hints > 0) {
    status.textContent = context.puzzle.hint;
  } else {
    status.textContent = "Aproxime-se da palavra secreta por associacao.";
  }

  const list = $("#context-guesses");
  list.innerHTML = "";
  context.guesses.forEach((guess) => {
    const item = document.createElement("li");
    item.className = "context-guess";
    item.innerHTML = `
      <span class="rank">#${guess.rank}</span>
      <span class="heat-bar"><span style="width: ${guess.heat}%"></span></span>
      <span class="heat-label">${guess.word} · ${guess.label}</span>
    `;
    list.append(item);
  });
}

function showContextHint() {
  state.context.hints += 1;
  renderContext();
}

function initConexo() {
  const puzzle = pickRandom(CONEXO_PUZZLES);
  const words = shuffle(
    puzzle.groups.flatMap((group, groupIndex) =>
      group.words.map((word) => ({
        word,
        groupIndex,
      })),
    ),
  );
  state.conexo = {
    puzzle,
    words,
    selected: [],
    solved: [],
    mistakes: 0,
    done: false,
  };
  renderConexo();
}

function renderConexo() {
  const conexo = state.conexo;
  const status = $("#conexo-status");
  const remaining = 4 - conexo.mistakes;

  if (conexo.solved.length === 4) {
    status.textContent = "Todas as conexoes encontradas.";
  } else if (remaining <= 0) {
    status.textContent = "Fim de jogo. Revelei os grupos abaixo.";
  } else {
    status.textContent = "Selecione 4 palavras que tenham algo em comum.";
  }

  const mistakes = $("#conexo-mistakes");
  mistakes.innerHTML = "";
  for (let index = 0; index < 4; index += 1) {
    const dot = document.createElement("span");
    dot.className = "mistake-dot";
    if (index < conexo.mistakes) dot.classList.add("is-used");
    mistakes.append(dot);
  }

  const solved = $("#conexo-solved");
  solved.innerHTML = "";
  const solvedIndexes = new Set(conexo.solved);
  const shouldReveal = remaining <= 0;
  conexo.puzzle.groups.forEach((group, index) => {
    if (!solvedIndexes.has(index) && !shouldReveal) return;
    const groupElement = document.createElement("div");
    groupElement.className = "solved-group";
    groupElement.innerHTML = `<strong>${group.name}</strong><span>${group.words.join(", ")}</span>`;
    solved.append(groupElement);
  });

  const grid = $("#conexo-grid");
  grid.innerHTML = "";
  conexo.words
    .filter((item) => !solvedIndexes.has(item.groupIndex) && !shouldReveal)
    .forEach((item) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "connection-card";
      card.textContent = item.word;
      if (conexo.selected.includes(item.word)) card.classList.add("is-selected");
      card.addEventListener("click", () => toggleConexoWord(item.word));
      grid.append(card);
    });

  $("#conexo-submit").disabled =
    conexo.selected.length !== 4 || conexo.done || conexo.mistakes >= 4;
}

function toggleConexoWord(word) {
  const conexo = state.conexo;
  if (conexo.done || conexo.mistakes >= 4) return;

  if (conexo.selected.includes(word)) {
    conexo.selected = conexo.selected.filter((selected) => selected !== word);
  } else if (conexo.selected.length < 4) {
    conexo.selected.push(word);
  } else {
    showToast("So cabem 4 por vez.");
  }

  renderConexo();
}

function submitConexo() {
  const conexo = state.conexo;
  if (conexo.selected.length !== 4) return;

  const selectedItems = conexo.selected.map((word) =>
    conexo.words.find((item) => item.word === word),
  );
  const groupIndex = selectedItems[0].groupIndex;
  const isCorrect = selectedItems.every((item) => item.groupIndex === groupIndex);

  if (isCorrect && !conexo.solved.includes(groupIndex)) {
    conexo.solved.push(groupIndex);
    conexo.selected = [];
    showToast("Conexao encontrada.");
  } else {
    conexo.mistakes += 1;
    conexo.selected = [];
    showToast(conexo.mistakes >= 4 ? "Acabaram as tentativas." : "Nao foi dessa vez.");
  }

  conexo.done = conexo.solved.length === 4 || conexo.mistakes >= 4;
  renderConexo();
}

function shuffleConexo() {
  const conexo = state.conexo;
  conexo.words = shuffle(conexo.words, Date.now());
  renderConexo();
}

function bindEvents() {
  document.addEventListener("keydown", (event) => {
    if (state.currentGame !== "termooo") return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    if (event.key === "Enter") {
      handleTermInput("ENTER");
    } else if (event.key === "Backspace") {
      handleTermInput("BACKSPACE");
    } else if (/^[a-zA-Z]$/.test(event.key)) {
      handleTermInput(event.key);
    }
  });

  $("#term-share").addEventListener("click", shareTerm);
  $("#context-form").addEventListener("submit", submitContext);
  $("#context-reset").addEventListener("click", () => initContext());
  $("#context-hint").addEventListener("click", showContextHint);
  $("#conexo-reset").addEventListener("click", () => initConexo());
  $("#conexo-shuffle").addEventListener("click", shuffleConexo);
  $("#conexo-submit").addEventListener("click", submitConexo);
}

initTabs();
initTerm();
initContext();
initConexo();
bindEvents();
