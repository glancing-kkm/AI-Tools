const cardsEl = document.getElementById("cards");
const chipsEl = document.getElementById("categoryChips");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const popularCombosEl = document.getElementById("popularCombos");
const recommendedCombosEl = document.getElementById("recommendedCombos");

const state = {
  tools: [],
  selectedCategory: "전체",
  searchText: "",
  sortBy: "default"
};

const paidSignals = {
  ChatGPT: { score: 100, label: "매우 높음" },
  Gemini: { score: 97, label: "매우 높음" },
  "Microsoft Copilot": { score: 95, label: "매우 높음" },
  "Meta AI": { score: 93, label: "매우 높음" },
  "GitHub Copilot": { score: 94, label: "매우 높음" },
  Grammarly: { score: 90, label: "매우 높음" },
  "Canva AI": { score: 89, label: "매우 높음" },
  "Notion AI": { score: 84, label: "높음" },
  Perplexity: { score: 80, label: "높음" },
  Claude: { score: 78, label: "높음" },
  Midjourney: { score: 76, label: "높음" },
  "DALL·E": { score: 75, label: "높음" },
  "Adobe Firefly": { score: 74, label: "높음" },
  Runway: { score: 72, label: "중간" },
  Synthesia: { score: 71, label: "중간" },
  "HeyGen": { score: 69, label: "중간" },
  Zapier: { score: 70, label: "중간" },
  Make: { score: 66, label: "중간" },
  "n8n": { score: 65, label: "중간" },
  "Power Automate": { score: 64, label: "중간" },
  ElevenLabs: { score: 63, label: "중간" },
  Murf: { score: 62, label: "중간" },
  LOVO: { score: 61, label: "중간" },
  Otter: { score: 60, label: "중간" },
  Fireflies: { score: 58, label: "중간" },
  DeepL: { score: 57, label: "중간" },
  "Google Translate": { score: 56, label: "중간" },
  Papago: { score: 55, label: "중간" },
  "Leonardo AI": { score: 54, label: "중간" },
  Suno: { score: 52, label: "중간" },
  "Amazon Q Developer": { score: 51, label: "중간" },
  Tabnine: { score: 50, label: "중간" },
  Udio: { score: 47, label: "낮음" },
  "Kling AI": { score: 46, label: "낮음" },
  Pika: { score: 44, label: "낮음" },
  Windsurf: { score: 43, label: "낮음" },
  "PlayHT": { score: 41, label: "낮음" },
  "DreamStudio": { score: 40, label: "낮음" },
  Elicit: { score: 39, label: "낮음" },
  Consensus: { score: 38, label: "낮음" },
  "You.com": { score: 37, label: "낮음" },
  "Wolfram|Alpha": { score: 36, label: "낮음" },
  "Stable Audio": { score: 35, label: "낮음" },
  AIVA: { score: 35, label: "낮음" },
  Soundraw: { score: 34, label: "낮음" },
  "Lokalise AI": { score: 34, label: "낮음" },
  Smartcat: { score: 33, label: "낮음" },
  Gamma: { score: 33, label: "낮음" },
  Cursor: { score: 32, label: "낮음" },
  Tome: { score: 31, label: "낮음" },
  "Beautiful.ai": { score: 30, label: "낮음" },
  "Figma AI": { score: 29, label: "낮음" },
  Fathom: { score: 28, label: "낮음" },
  "tl;dv": { score: 27, label: "낮음" },
  Avoma: { score: 26, label: "낮음" },
  Jasper: { score: 42, label: "낮음" },
  QuillBot: { score: 45, label: "낮음" },
  Writer: { score: 31, label: "낮음" },
  "Airtable AI": { score: 48, label: "낮음" },
  "Speechify Studio": { score: 49, label: "중간" }
};

const popularCombos = [
  { name: "ChatGPT + Perplexity + Notion AI", why: "초안 작성, 사실 검증, 문서 정리를 한 흐름으로 처리" },
  { name: "Gemini + Perplexity + DeepL", why: "검색 보강, 근거 확인, 번역까지 빠르게 연결" },
  { name: "GitHub Copilot + ChatGPT + Cursor", why: "코딩 자동완성, 디버깅, 코드베이스 탐색을 분업" },
  { name: "Midjourney + Runway + ElevenLabs", why: "이미지/영상/보이스를 연결해 콘텐츠 제작 속도 향상" },
  { name: "Suno + Canva AI + Runway", why: "음원, 썸네일, 숏폼 영상을 빠르게 묶어 발행" }
];

const recommendedCombos = [
  { name: "입문자: ChatGPT + Canva AI + DeepL", why: "기획, 디자인, 번역까지 쉬운 조합으로 시작 가능" },
  { name: "학생/연구: Gemini + Consensus + Notion AI", why: "자료 탐색, 근거 확인, 노트 정리를 한 번에 처리" },
  { name: "1인 마케터: Perplexity + Notion AI + Runway", why: "리서치, 콘텐츠 캘린더, 영상 제작까지 한 번에 구성" },
  { name: "개발자: GitHub Copilot + Claude + Zapier", why: "코딩 생산성 + 문서화 + 운영 자동화가 균형적" },
  { name: "회의 많은 팀: Otter + Fireflies + Notion AI", why: "회의록 수집, 요약, 액션 아이템 정리에 효율적" }
];

function faviconUrl(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

function categories() {
  return ["전체", ...new Set(state.tools.map((tool) => tool.category))];
}

function matchSearch(tool, keyword) {
  if (!keyword) return true;
  const haystack = [
    tool.name,
    tool.category,
    tool.reason,
    tool.features.join(" "),
    tool.freeScope
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(keyword.toLowerCase());
}

function sortTools(list) {
  const sorted = [...list];
  if (state.sortBy === "free-first") {
    sorted.sort((a, b) => {
      if (a.pricing.hasFree !== b.pricing.hasFree) {
        return Number(b.pricing.hasFree) - Number(a.pricing.hasFree);
      }
      return a.pricing.monthlyUsdFrom - b.pricing.monthlyUsdFrom;
    });
  } else if (state.sortBy === "price-asc") {
    sorted.sort((a, b) => a.pricing.monthlyUsdFrom - b.pricing.monthlyUsdFrom);
  } else if (state.sortBy === "paid-subs-desc") {
    sorted.sort((a, b) => {
      const aScore = (paidSignals[a.name] && paidSignals[a.name].score) || 0;
      const bScore = (paidSignals[b.name] && paidSignals[b.name].score) || 0;
      return bScore - aScore;
    });
  }
  return sorted;
}

function filteredTools() {
  const byCategory = state.selectedCategory === "전체"
    ? state.tools
    : state.tools.filter((tool) => tool.category === state.selectedCategory);
  const bySearch = byCategory.filter((tool) => matchSearch(tool, state.searchText));
  return sortTools(bySearch);
}

function renderChips() {
  chipsEl.innerHTML = categories()
    .map(
      (category) => `
      <button class="chip ${state.selectedCategory === category ? "active" : ""}" data-category="${category}">
        ${category}
      </button>
    `
    )
    .join("");

  chipsEl.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.selectedCategory = chip.dataset.category;
      render();
    });
  });
}

function oneLine(text) {
  return String(text).replace(/\s+/g, " ").trim();
}

function cardTemplate(tool) {
  const featureLine = oneLine(tool.features.join(" · "));
  const paidSignal = (paidSignals[tool.name] && paidSignals[tool.name].label) || "데이터 없음";
  return `
    <article class="card">
      <div class="head">
        <img class="logo" src="${faviconUrl(tool.domain)}" alt="${tool.name} favicon" loading="lazy" />
        <div class="name-wrap">
          <h3 title="${tool.name}">${tool.name}</h3>
          <span class="tag" title="${tool.category}">${tool.category}</span>
        </div>
      </div>
      <p class="meta-row" title="${tool.reason}"><b>💡 이유</b> ${oneLine(tool.reason)}</p>
      <p class="meta-row" title="${featureLine}"><b>⚙️ 기능</b> ${featureLine}</p>
      <p class="meta-row" title="${tool.pricing.display}"><b>💰 가격</b> ${oneLine(tool.pricing.display)}</p>
      <p class="meta-row" title="${paidSignal}"><b>👥 유료지표</b> ${paidSignal}</p>
      <p class="meta-row" title="${tool.freeHow}"><b>🆓 방법</b> ${oneLine(tool.freeHow)}</p>
      <p class="meta-row" title="${tool.freeScope}"><b>📦 범위</b> ${oneLine(tool.freeScope)}</p>
      <div class="actions">
        <a class="btn" href="${tool.link}" target="_blank" rel="noopener noreferrer" title="${tool.link}">🔗 사이트 이동</a>
      </div>
    </article>
  `;
}

function comboTemplate(item) {
  return `
    <article class="combo-card">
      <p class="combo-name" title="${item.name}">${item.name}</p>
      <p class="combo-why" title="${item.why}">${item.why}</p>
    </article>
  `;
}

function renderCombos() {
  popularCombosEl.innerHTML = popularCombos.map(comboTemplate).join("");
  recommendedCombosEl.innerHTML = recommendedCombos.map(comboTemplate).join("");
}

function renderCards() {
  const list = filteredTools();
  if (list.length === 0) {
    cardsEl.innerHTML = `<p class="note">검색 결과가 없습니다. 다른 키워드를 입력해 주세요.</p>`;
    return;
  }

  cardsEl.innerHTML = list.map(cardTemplate).join("");
  cardsEl.insertAdjacentHTML(
    "beforeend",
    `<p class="note">🟡 기준일 2026-03-05. 가격/무료 정책은 수시 변경되므로 결제 전 공식 링크에서 재확인하세요.</p>`
  );
}

function bindControls() {
  searchInput.addEventListener("input", (event) => {
    state.searchText = event.target.value;
    renderCards();
  });

  sortSelect.addEventListener("change", (event) => {
    state.sortBy = event.target.value;
    renderCards();
  });
}

function render() {
  renderChips();
  renderCards();
  renderCombos();
}

async function init() {
  try {
    const response = await fetch("/data/ai-tools.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    state.tools = await response.json();
    bindControls();
    render();
  } catch (error) {
    cardsEl.innerHTML = `<p class="note">데이터 로드 실패: ${error.message}</p>`;
  }
}

init();
