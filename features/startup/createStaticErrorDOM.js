import Config from 'configuration';

export default function createStaticErrorDOM(document) {
  const container = document.createElement('div');
  container.classList.add('error-boundary__content');

  const header = document.createElement('h1');
  header.classList.add('heading', 'heading--1');
  header.innerText = 'Our apologies!';

  const firstParagraph = document.createElement('p');
  firstParagraph.innerText = `Something terrible has happened. \
  Perhaps a server has shattered in a spray of sparks, \
  or a database flared and guttered like a dying star. \
  More likely the Bazaar has hiccupped, or twitched in its sleep, \
  and you are the victim of inexplicable but transient circumstances.`;

  const secondParagraph = document.createElement('p');
  secondParagraph.classList.add('error-boundary__p--link');
  secondParagraph.innerHTML = `<a href="/">If you click here, all will likely be well.</a>`;

  const thirdParagraph = document.createElement('p');
  thirdParagraph.innerText = `\
    If the problem persists, do let us know as much information as possible —\
  username, browser and what you were trying to do —\
  at:\
  `;

  const fourthParagraph = document.createElement('p');
  fourthParagraph.classList.add('error-boundary__p--link');
  fourthParagraph.innerHTML = `<a href="mailto:fallenlondonredesign@failbettergames.com">fallenlondonredesign@failbettergames.com</a>`;

  const fifthParagraph = document.createElement('p');
    fifthParagraph.innerHTML = `You're using version <b>${Config.version}</b> of Fallen London.`;

  container.appendChild(header);
  container.appendChild(firstParagraph);
  container.appendChild(secondParagraph);
  container.appendChild(thirdParagraph);
  container.appendChild(fourthParagraph);
  container.appendChild(fifthParagraph);

  return container;
}
