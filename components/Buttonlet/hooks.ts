import classnames from "classnames";
import getImageClassByType from "components/Buttonlet/getImageClassByType";
import { useMemo } from "react";

export function useButtonletClassName(
  className: string | undefined,
  disabled: boolean | undefined,
  focused: boolean | undefined,
  local: boolean | undefined,
  onClick: ((args?: any) => any) | undefined,
  type: string
) {
  return useMemo(
    () =>
      classnames(
        "buttonlet",
        "fa-stack",
        type !== "delete-contact" && "fa-lg",
        disabled || onClick === undefined
          ? "buttonlet-disabled"
          : "buttonlet-enabled",
        local && "buttonlet-local",
        focused && "buttonlet--focused",
        className
      ),
    [className, disabled, focused, local, onClick, type]
  );
}

export function useCircleClassName(
  className: string | undefined,
  override: boolean | undefined
) {
  return useMemo(
    () =>
      classnames(
        className,
        "fa fa-circle fa-stack-2x",
        override && "buttonlet-override-circle"
      ),
    [className, override]
  );
}

export function useIconClassName(
  className: string | undefined,
  override: boolean | undefined,
  spin: boolean | undefined,
  type: string
) {
  return useMemo(
    () =>
      classnames(
        className,
        "fa fa-inverse fa-stack-1x",
        getImageClassByType(type),
        override && "buttonlet-override-stack",
        spin && "fa-spin"
      ),
    [className, override, spin, type]
  );
}
