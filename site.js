(function siteLocaleInit() {
  const select = document.getElementById("countrySelect");
  if (!select) return;

  const countries = [
    { code: "KR", label: "대한민국 (한국어)", locale: "ko-KR" },
    { code: "US", label: "United States (English)", locale: "en-US" },
    { code: "GB", label: "United Kingdom (English)", locale: "en-GB" },
    { code: "CA", label: "Canada (English)", locale: "en-CA" },
    { code: "AU", label: "Australia (English)", locale: "en-AU" },
    { code: "IN", label: "India (English)", locale: "en-IN" },
    { code: "JP", label: "Japan (Japanese)", locale: "ja-JP" },
    { code: "CN", label: "China (Chinese)", locale: "zh-CN" },
    { code: "TW", label: "Taiwan (Chinese)", locale: "zh-TW" },
    { code: "FR", label: "France (French)", locale: "fr-FR" },
    { code: "DE", label: "Germany (German)", locale: "de-DE" },
    { code: "ES", label: "Spain (Spanish)", locale: "es-ES" },
    { code: "MX", label: "Mexico (Spanish)", locale: "es-MX" },
    { code: "BR", label: "Brazil (Portuguese)", locale: "pt-BR" },
    { code: "PT", label: "Portugal (Portuguese)", locale: "pt-PT" },
    { code: "IT", label: "Italy (Italian)", locale: "it-IT" },
    { code: "RU", label: "Russia (Russian)", locale: "ru-RU" },
    { code: "SA", label: "Saudi Arabia (Arabic)", locale: "ar-SA" },
    { code: "TR", label: "Turkey (Turkish)", locale: "tr-TR" },
    { code: "ID", label: "Indonesia (Indonesian)", locale: "id-ID" },
    { code: "VN", label: "Vietnam (Vietnamese)", locale: "vi-VN" },
    { code: "TH", label: "Thailand (Thai)", locale: "th-TH" }
  ];

  select.innerHTML = countries
    .map((item) => `<option value="${item.code}">${item.label}</option>`)
    .join("");

  function toSiteLang(countryCode) {
    return countryCode === "KR" ? "ko" : "en";
  }

  function applyCountry(countryCode) {
    const selected = countries.find((item) => item.code === countryCode) || countries[1];
    const siteLang = toSiteLang(selected.code);
    window.__siteLocale = selected.locale;
    window.__siteLang = siteLang;
    document.documentElement.lang = siteLang;
    localStorage.setItem("siteCountry", selected.code);
    localStorage.setItem("siteLang", siteLang);
    window.dispatchEvent(new CustomEvent("site-language-change", {
      detail: { countryCode: selected.code, locale: selected.locale, lang: siteLang }
    }));
    applyStaticText(siteLang);
  }

  function applyStaticText(siteLang) {
    const localeLabel = document.querySelector(".locale-label");
    if (localeLabel) {
      localeLabel.textContent = siteLang === "ko" ? "🌐 국가/언어" : "🌐 Country/Language";
    }

    const heroTitle = document.getElementById("heroTitle");
    const heroSubtitle = document.getElementById("heroSubtitle");
    const heroMeta = document.getElementById("heroMeta");
    if (!heroTitle || !heroSubtitle || !heroMeta) return;

    if (siteLang === "ko") {
      heroTitle.textContent = "AI 카테고리별 추천 사이트 모음";
      heroSubtitle.innerHTML = '핵심 AI를 카테고리별로 비교 정리했고 <span class="highlight">중요 정보는 노란색</span>으로 표시했습니다.';
      heroMeta.textContent = "📌 기준일: 2026-03-05 (UTC) · 가격/정책은 수시 변경 가능";
      return;
    }

    heroTitle.textContent = "AI Tools by Category";
    heroSubtitle.innerHTML = 'Compare top AI tools in one place, and see <span class="highlight">important info highlighted in yellow</span>.';
    heroMeta.textContent = "📌 Updated: 2026-03-05 (UTC) · Pricing and policies may change";
  }

  const savedCountry = localStorage.getItem("siteCountry");
  const initialCountry = countries.some((item) => item.code === savedCountry)
    ? savedCountry
    : "KR";

  select.value = initialCountry;
  applyCountry(initialCountry);

  select.addEventListener("change", (event) => {
    applyCountry(event.target.value);
  });
})();
