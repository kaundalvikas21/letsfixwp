/**
 * Whether this browser can actually run a WebGL component, checked before one is mounted.
 *
 * Promoted out of `CtaShader` in Task 102, when a second component needed the same question answered.
 * The reason it exists at all is written there: `@paper-design/shaders-react` throws
 * `Paper Shaders: WebGL is not supported in this browser` as an uncaught promise rejection, which no
 * error boundary catches because it is not a render error. The visitor would get a console error and a
 * blank canvas. Detecting first means they get neither, and the fallback underneath is a complete design.
 *
 * Who has no WebGL: the browser these changes were written in, and any visitor whose GPU is on a driver
 * blocklist, who has hardware acceleration off, or whose privacy setting disables the context.
 *
 * Ask for the version the component will actually request: a browser with WebGL 1 and no 2 passes
 * `hasWebGl` and still fails a renderer that calls `getContext("webgl2")`.
 *
 * **One canvas, and the context is handed back.** A browser allows only a handful of live contexts, about
 * sixteen, and the home page spends two of them on real ones. The first version of this took a context
 * type per call and so built a second canvas whenever the first type was missing, which is the case on
 * exactly the machines that can least afford it. Both types are now tried on one canvas, as the original
 * in `CtaShader` did, and the winner is released through `WEBGL_lose_context` rather than left for the
 * collector. The canvas is never attached to the document.
 */
const probe = (...types: ("webgl" | "webgl2")[]) => {
  try {
    const canvas = document.createElement("canvas");
    for (const type of types) {
      const gl = canvas.getContext(type);
      if (gl) {
        // `getContext` called with a union of type names widens to `RenderingContext`, which covers the 2D
        // context too. The `in` check narrows it back to the two WebGL ones without asserting a cast.
        if ("getExtension" in gl) gl.getExtension("WEBGL_lose_context")?.loseContext();
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
};

export const hasWebGl = () => probe("webgl2", "webgl");
export const hasWebGl2 = () => probe("webgl2");
