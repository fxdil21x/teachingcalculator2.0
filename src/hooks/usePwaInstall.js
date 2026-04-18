import { useEffect, useState } from "react";

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
      console.log("Install prompt captured");
    };
    
    window.addEventListener("beforeinstallprompt", handler);
    
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isAndroid = /android/i.test(navigator.userAgent);
    
    console.log("Install clicked. iOS:", isIOS, "Android:", isAndroid, "Installable:", isInstallable);
    
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log("User choice:", outcome);
        if (outcome === "accepted") {
          console.log("App installed successfully");
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
        return;
      } catch (err) {
        console.error("Install prompt error:", err);
      }
    }
    
    if (isIOS) {
      window.alert(
        "To install on iOS:\n\n" +
        "1. Tap the Share button (⬆️) at the bottom\n" +
        "2. Scroll down and tap 'Add to Home Screen'\n" +
        "3. Tap 'Add' to confirm"
      );
      return;
    }
    
    if (isAndroid) {
      window.alert(
        "To install on Android:\n\n" +
        "1. Tap the menu (⋮) at the bottom right\n" +
        "2. Tap 'Install app' or 'Add to Home Screen'\n" +
        "3. Tap 'Install' to confirm"
      );
      return;
    }
    
    window.alert(
      "To install:\n\n" +
      "1. Click the menu (⋮)\n" +
      "2. Click 'Install app'\n" +
      "3. Click 'Install' to confirm"
    );
  };

  return { install, isInstallable };
}

