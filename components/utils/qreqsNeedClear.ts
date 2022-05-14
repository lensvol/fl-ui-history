export default function qreqsNeedClear(el: Element) {
  if (!el.querySelector('.buttons')) {
    return false;
  }
  const containerInnerWidth = el.clientWidth - pixelify(el, 'padding-left') - pixelify(el, 'padding-left');
  // Things work a bit more reliably if we just make this a constant;
  // it's a known value anyway since card sizes are a basic part of the design
  const cardWidth = 130;
  const buttons: ChildNode[] = Array.from(el.querySelector('.buttons')?.childNodes ?? []);
  // Work out how long the qreqs would be if we had them all on a single line
  const buttonsWidth = [...buttons].reduce((acc, childNode) => {
    const el2 = childNode as Element;
    const elementWidth = el2.clientWidth + pixelify(el2 as Element, 'margin-left') + pixelify(el2, 'margin-right');
    return acc + elementWidth;
  }, 0);
  return (containerInnerWidth - cardWidth) <= buttonsWidth;
}

export function pixelify(el: Element, attr: any) {
  return Number(window.getComputedStyle(el)[attr].replace('px', ''));
}