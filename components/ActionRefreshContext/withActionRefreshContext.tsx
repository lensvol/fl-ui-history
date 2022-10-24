import React, { Component, ComponentType } from "react";
import ActionRefreshContext, {
  IActionRefreshContextValues,
} from "./ActionRefreshContext";

export default function <T>(WrappedComponent: ComponentType<T>) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  return class ComponentWithActionRefreshComponent extends Component<
    Partial<T>
  > {
    public static displayName = `withActionRefreshContext(${displayName})`;

    render() {
      return (
        <ActionRefreshContext.Consumer>
          {(values: IActionRefreshContextValues) => (
            <WrappedComponent {...values} {...(this.props as T)} />
          )}
        </ActionRefreshContext.Consumer>
      );
    }
  };
}
