export default function createStaticUpgradeDOM(document) {
  const container = document.createElement('div');
  container.classList.add('error-boundary__content');

  const header = document.createElement('h1');
  header.classList.add('heading', 'heading--1');
  header.innerText = 'Fallen London has updated!';

  const firstParagraph = document.createElement('p');
  firstParagraph.innerHTML = `
  Please refresh the page to continue.
  `;

  const buttonContainer = document.createElement('div');
  buttonContainer.style.marginBottom = '.5rem';
  buttonContainer.style.marginTop = '.5rem';
  buttonContainer.style.textAlign = 'center';

  const reloadButton = document.createElement('button');
  reloadButton.classList.add('button', 'button--primary');
  reloadButton.innerHTML = 'Refresh';
  reloadButton.addEventListener('click', () => window.location.reload(true));
  buttonContainer.appendChild(reloadButton);

  container.appendChild(header);
  container.appendChild(firstParagraph);
  container.appendChild(buttonContainer);

  return container;
}
