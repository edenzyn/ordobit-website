import { initializeHeader, renderHeader } from "../../components/header.js";

const header = document.getElementById("site-header");
header.innerHTML = renderHeader({ active: "landing" });
initializeHeader(header);

const tabButtons = [...document.querySelectorAll(".tab")];
const tabPanels = [...document.querySelectorAll(".panel")];

const activateTab = (activeButton) => {
  tabButtons.forEach((button) => {
    const isActive = button === activeButton;
    button.classList.toggle("on", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.tabIndex = isActive ? 0 : -1;
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.id === activeButton.dataset.p;
    panel.classList.toggle("on", isActive);
    panel.hidden = !isActive;
  });
};

tabButtons.forEach((button, index) => {
  button.addEventListener("click", () => activateTab(button));
  button.addEventListener("keydown", (event) => {
    const lastIndex = tabButtons.length - 1;
    const nextIndex = event.key === "ArrowRight"
      ? (index + 1) % tabButtons.length
      : event.key === "ArrowLeft"
        ? (index - 1 + tabButtons.length) % tabButtons.length
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? lastIndex
            : null;

    if (nextIndex === null) return;
    event.preventDefault();
    tabButtons[nextIndex].focus();
    activateTab(tabButtons[nextIndex]);
  });
});

if (tabButtons.length) {
  activateTab(tabButtons.find((button) => button.classList.contains("on")) || tabButtons[0]);
}

const currencyButtons = [...document.querySelectorAll(".cur button")];
const prices = [...document.querySelectorAll(".p")];

currencyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currencyButtons.forEach((option) => {
      const isActive = option === button;
      option.classList.toggle("on", isActive);
      option.setAttribute("aria-pressed", String(isActive));
    });

    prices.forEach((price) => {
      const value = price.dataset[button.dataset.c];
      if (value) price.textContent = value;
    });
  });
});
