import React from 'react';
import classnames from 'classnames';

type Props = {
  children: React.ReactNode,
  className?: string,
  fl?: boolean,
  icon: string,
  onClick: () => void,
};

export default function NavItem({
  children,
  className,
  fl,
  icon,
  onClick,
}: Props) {
  return (
    <li className="sidemenu__nav-item">
      <button
        className="button--link sidemenu__nav-link"
        onClick={onClick}
        type="button"
      >
        <i className={classnames(makeClassName({ fl, icon }), className)} />
        {' '}
        {children}
      </button>
    </li>
  );
}

function makeClassName({ fl, icon }: Pick<Props, 'fl' | 'icon' >) {
  if (fl) {
    return `fl-ico fl-ico-${icon} sidemenu__nav-icon sidemenu__nav-icon--fl-ico`;
  }
  return `fa fa-${icon} sidemenu__nav-icon`;
}
