import { useEffect } from "react";
import { APP_VERSION } from "../app.config";

export const useInitApp = () => {
  useEffect(() => {
    const current_version = localStorage.getItem("appVersion");

    if (!current_version) {
      localStorage.setItem("appVersion", APP_VERSION);
      return;
    }

    if (current_version !== APP_VERSION) {
      localStorage.clear();
      localStorage.setItem("appVersion", APP_VERSION);
      window.location.reload();
    }
  }, []);
};
