export default function createMaintenanceModeDOM(document, backAt) {
  const container = document.createElement("div");
  container.classList.add("error-boundary__content");

  const header = document.createElement("h1");
  header.classList.add("heading", "heading--1");
  header.style.textAlign = "center";
  header.style.marginBottom = "1rem";
  header.innerText = "Fallen London is undergoing scheduled maintenance";

  // We may not have been told when we're coming back
  const returnTime = backAt ? `by ${backAt}` : "shortly";

  const firstParagraph = document.createElement("p");
  firstParagraph.innerHTML = `We&rsquo;re making some changes. Fallen London should be back ${returnTime}.`;

  const secondParagraph = document.createElement("p");
  secondParagraph.innerText =
    "Thank you for your patience, delicious friends. All shall be well.";

  container.appendChild(header);
  container.appendChild(firstParagraph);
  container.appendChild(secondParagraph);

  return container;
}
