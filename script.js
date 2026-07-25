class LawCardElement extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered === "true") return;

    const number = this.getAttribute("number") || "";
    const title = this.getAttribute("title") || "";
    const points = this.innerHTML.trim();

    this.dataset.rendered = "true";
    this.innerHTML = `
      <span class="article-number">${number}</span>
      <h3>${title}</h3>
      <ul class="article-points">
        ${points}
      </ul>
    `;
  }
}

customElements.define("law-card", LawCardElement);

const searchInputs = Array.from(document.querySelectorAll("[data-rule-search]"));
const searchInput = document.querySelector("#ruleSearch");
const lawCards = Array.from(document.querySelectorAll(".law-card"));
const chapters = Array.from(document.querySelectorAll(".chapter"));
const sectionHeadings = Array.from(document.querySelectorAll("#principles > .section-heading"));
const navigationLinks = Array.from(document.querySelectorAll(".toc-links a, .fixed-nav a"));
const emptyState = document.querySelector("#emptyState");

function normalize(value) {
  return value.normalize("NFKC").trim().toLowerCase();
}

function setFilteredOut(element, shouldHide) {
  element.hidden = shouldHide;
  element.classList.toggle("search-hidden", shouldHide);
}

function syncSearchInputs(value, sourceInput) {
  searchInputs.forEach((input) => {
    if (input !== sourceInput) {
      input.value = value;
    }
  });
}

function applySearchFilter(value) {
  const term = normalize(value);
  const isSearching = term !== "";
  let visibleCount = 0;

  lawCards.forEach((card) => {
    const haystack = normalize(card.textContent || "");
    const isVisible = !isSearching || haystack.includes(term);
    setFilteredOut(card, !isVisible);
    if (isVisible) visibleCount += 1;
  });

  chapters.forEach((chapter) => {
    const hasVisibleCard = Array.from(chapter.querySelectorAll(".law-card")).some((card) => !card.hidden);
    setFilteredOut(chapter, isSearching && !hasVisibleCard);
  });

  sectionHeadings.forEach((heading) => {
    let hasVisibleChapter = false;
    let node = heading.nextElementSibling;

    while (node && !node.classList.contains("section-heading")) {
      if (node.classList.contains("chapter") && !node.hidden) {
        hasVisibleChapter = true;
        break;
      }
      node = node.nextElementSibling;
    }

    setFilteredOut(heading, isSearching && !hasVisibleChapter);
  });

  navigationLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const target = href?.startsWith("#") ? document.querySelector(href) : null;
    const shouldHide = isSearching && target && target.classList.contains("search-hidden");
    setFilteredOut(link, Boolean(shouldHide));
  });

  emptyState.hidden = visibleCount !== 0;
}

searchInputs.forEach((input) => {
  input.addEventListener("input", () => {
    syncSearchInputs(input.value, input);
    applySearchFilter(input.value);
  });
});
