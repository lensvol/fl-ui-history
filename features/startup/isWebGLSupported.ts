let supported: boolean | undefined;

/**
 * Helper for checking for WebGL support. Ganked directly from PIXI source
 *
 * @memberof PIXI.utils
 * @function isWebGLSupported
 * @return {boolean} Is WebGL supported.
 */
export default function isWebGLSupported(): boolean {
  if (typeof supported === "undefined") {
    supported = (function supported(): boolean {
      const contextOptions = {
        stencil: true,
        failIfMajorPerformanceCaveat: true,
      };

      try {
        if (!window.WebGLRenderingContext) {
          return false;
        }

        const canvas = document.createElement("canvas");
        let gl: WebGLRenderingContext | null = (canvas.getContext(
          "webgl",
          contextOptions
        ) ||
          canvas.getContext(
            "experimental-webgl",
            contextOptions
          )) as WebGLRenderingContext;

        const success = !!gl?.getContextAttributes()?.stencil;

        if (gl) {
          const loseContext = gl.getExtension("WEBGL_lose_context");

          if (loseContext) {
            loseContext.loseContext();
          }
        }

        gl = null;

        return success;
      } catch (e) {
        return false;
      }
    })();
  }

  return supported;
}
