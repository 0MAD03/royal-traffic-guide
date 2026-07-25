const searchInput = document.querySelector("#ruleSearch");
const lawCards = Array.from(document.querySelectorAll(".law-card"));
const emptyState = document.querySelector("#emptyState");

function normalize(value) {
  return value.normalize("NFKC").trim().toLowerCase();
}

searchInput?.addEventListener("input", () => {
  const term = normalize(searchInput.value);
  let visibleCount = 0;

  lawCards.forEach((card) => {
    const haystack = normalize(card.textContent || "");
    const isVisible = term === "" || haystack.includes(term);
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount !== 0;
});
