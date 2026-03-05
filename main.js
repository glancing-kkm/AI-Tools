const cardsEl = document.getElementById("cards");
const chipsEl = document.getElementById("categoryChips");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const state = {
  tools: [],
  selectedCategory: "전체",
  searchText: "",
  sortBy: "default"
};

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
      <p class="meta-row" title="${tool.freeHow}"><b>🆓 방법</b> ${oneLine(tool.freeHow)}</p>
      <p class="meta-row" title="${tool.freeScope}"><b>📦 범위</b> ${oneLine(tool.freeScope)}</p>
      <div class="actions">
        <a class="btn" href="${tool.link}" target="_blank" rel="noopener noreferrer" title="${tool.link}">🔗 사이트 이동</a>
      </div>
    </article>
  `;
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
