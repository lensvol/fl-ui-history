// Change these!
// const TWITTER_URL = 'https://twitter.com/failbettergames/status/1235127888904687617';
// const TWITTER_URL = 'https://twitter.com/failbettergames/status/1257940665910124545';

export default function createMaintenanceModeDOM(document, backAt) {
  const container = document.createElement('div');
  container.classList.add('error-boundary__content');

  const header = document.createElement('h1');
  header.classList.add('heading', 'heading--1');
  header.style.textAlign = 'center';
  header.style.marginBottom = '1rem';
  header.innerText = 'Fallen London is undergoing scheduled maintenance';

  const firstParagraph = document.createElement('p');
  firstParagraph.innerHTML = `
  We're making some changes. \
  `;

  // We may not have been told when we're coming back
  if (backAt) {
    firstParagraph.innerHTML += `
      Fallen London should be back by ${backAt} GMT. \
  `;
  } else {
    firstParagraph.innerHTML += `
      Fallen London should be back shortly. \
  `;
  }

  if (process.env.REACT_APP_MAINTENANCE_LINK_URL) {
    firstParagraph.innerHTML += `
  See <a href="${process.env.REACT_APP_MAINTENANCE_LINK_URL}" target="_blank">here</a> \
  for more updates.
  `;
  }

  const secondParagraph = document.createElement('p');
  secondParagraph.innerText = `
  Thank you for your patience, delicious friends. \
  All shall be well.
  `;

  container.appendChild(header);
  container.appendChild(firstParagraph);
  container.appendChild(secondParagraph);

  return container;
}
