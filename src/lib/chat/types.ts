/** What the chat session is told about the visitor's situation. */
export type ChatContext = { page: string; problem?: string; site?: string };

/** One vendor. load() resolves once the widget can be opened, with its default bubble hidden. */
export type ChatProvider = {
  name: string;
  load: () => Promise<void>;
  open: (ctx: ChatContext) => void;
  close: () => void;
};

/** Injects a vendor script once; resolves on load, rejects on error (blocked by an extension, offline, CSP). */
export function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`chat script failed: ${src}`));
    document.head.appendChild(s);
  });
}

// Vendor globals are untyped by design: each adapter touches only the calls its vendor documents.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const w = () => window as unknown as Record<string, any>;
