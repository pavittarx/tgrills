"use client";

import { useState, useEffect } from "react";
import type React from "react"; // Added import for React

interface MobileOnlyNotificationProps {
  children: React.ReactNode;
}

export function MobileOnlyNotification({
  children,
}: MobileOnlyNotificationProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // Assuming 768px as the breakpoint for desktop
    };

    checkIfDesktop();
    window.addEventListener("resize", checkIfDesktop);

    return () => window.removeEventListener("resize", checkIfDesktop);
  }, []);

  if (isDesktop) {
    return (
      <div className="fixed inset-0 bg-yellow-600 text-white flex items-center justify-center z-50">
        <div className="text-center p-4  flex flex-col">
          <h1 className="text-4xl font-bold mb-4">Tandoori Grills</h1>
          <p className="text-xl mb-4">
            This site is only available on mobile devices.
          </p>
          <p className="text-lg">
            Please visit us on your smartphoneto explore our delicious
            offerings!
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
