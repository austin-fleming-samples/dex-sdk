import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    <REDACTED>TopMenu?: {
      $el: HTMLElement | undefined;
      insert: () => void;
    };
  }
}

export const UniversalNavigationHeader: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const $bar = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://<REDACTED>-top-menu.pages.dev/bundle.min.js";
    script.async = true;
    script.addEventListener("load", () => setLoaded(true));
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!$bar.current || !loaded || !window.<REDACTED>TopMenu) return;
    $bar.current.id = "unfi-network-menu";
    window.<REDACTED>TopMenu.insert();
  }, [$bar, loaded]);

  return <div ref={$bar} data-theme="light" data-uselogo="false"></div>;
};
