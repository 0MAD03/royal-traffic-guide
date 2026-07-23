const searchInput = document.querySelector("#ruleSearch");
const lawCards = Array.from(document.querySelectorAll(".law-card"));
const emptyState = document.querySelector("#emptyState");

function normalize(value) {
  return value.trim().toLowerCase();
}

searchInput?.addEventListener("input", () => {
  const term = normalize(searchInput.value);
  let visibleCount = 0;

  lawCards.forEach((card) => {
    const haystack = normalize(`${card.textContent} ${card.dataset.keywords || ""}`);
    const isVisible = term === "" || haystack.includes(term);
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount !== 0;
});

document.querySelectorAll(".quiz-card").forEach((card) => {
  const result = card.querySelector("strong");
  const answer = card.dataset.answer;

  card.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const isCorrect = button.dataset.choice === answer;
      card.classList.toggle("incorrect", !isCorrect);
      result.textContent = isCorrect ? "正解。教本の規定と一致します。" : "不正解。該当条文を確認してください。";
    });
  });
});
