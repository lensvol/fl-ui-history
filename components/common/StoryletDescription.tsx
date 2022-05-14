import { UI_INTEGRATION_REGEX } from 'features/content-behaviour-integration/constants';
import React, {
  useEffect,
  useRef,
} from 'react';
import DomManipulationContext, { DomManipulationContextValue } from 'components/DomManipulationContext';

interface Props {
  text: string,
  containerClassName?: string,
}

export default function StoryletDescription({ text, containerClassName }: Props) {
  return (
    <DomManipulationContext.Consumer>
      {value => (
        <StoryletDescriptionInner
          {...value}
          text={text}
          containerClassName={containerClassName}
        />
      )}
    </DomManipulationContext.Consumer>
  );
}

StoryletDescription.displayName = 'StoryletDescription';

function StoryletDescriptionInner({
  text,
  containerClassName,
  onOpenSubscriptionModal,
}: Props & DomManipulationContextValue) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const smo = ref.current?.querySelector('[data-purpose="open-subscription-modal"]') as HTMLElement;
    smo?.addEventListener('click', onOpenSubscriptionModal);
    if (smo) {
      smo.classList.add('link--inverse');
      smo.style.cursor = 'pointer';
    }
    return () => {
      smo?.removeEventListener('click', onOpenSubscriptionModal);
    };
  }, [ref, onOpenSubscriptionModal]);

  return (
    <p
      className={containerClassName}
      ref={ref}
      dangerouslySetInnerHTML={{ __html: text.replace(UI_INTEGRATION_REGEX, '').trim() }}
    />
  );
}

StoryletDescriptionInner.displayName = 'StoryletDescriptionInner';
