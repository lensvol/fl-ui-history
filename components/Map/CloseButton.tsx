import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

function usePortal(id: string, containerClassName?: string) {
  const rootElementRef = React.useRef(document.createElement('div'));

  if (containerClassName) {
    rootElementRef.current.classList.add(containerClassName);
  }

  useEffect(() => {
    const parentElement = document.querySelector(`#${id}`);
    const closedOverRef = rootElementRef;
    parentElement!.appendChild(closedOverRef.current);
    return () => closedOverRef.current.remove();
  }, [id]);

  return rootElementRef.current;
}

interface Props {
  onClick: (_: any) => void,
}

export const CloseButtonContainer: React.FC<Props> = (props) => {
  const target = usePortal('close-map-button-root', 'map__close-button-container');
  return ReactDOM.createPortal(<CloseButton {...props} />, target);
}

export const CloseButton: React.FC<Props> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="map__close-button"
  >
    <i className="fa fa-compass fa-3x icon--has-transition" />
  </button>
);

export default CloseButtonContainer;