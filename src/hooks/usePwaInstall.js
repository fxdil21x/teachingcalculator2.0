import { useEffect, useState } from "react";

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      setDeferredPrompt(null);
      return;
    }
    if (isIOS) {
      window.alert("To install:\n\nTap Share (⬆️) -> Add to Home Screen");
      return;
    }
    window.alert("To install:\n\nTap menu (⋮) -> Add to Home Screen");
  };

  return { install };
}
