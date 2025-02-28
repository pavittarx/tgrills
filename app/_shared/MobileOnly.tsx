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
      <div className="fixed inset-0 bg-gray-900 text-white flex items-center justify-center z-50">
        <div className="text-center p-6 max-w-md">
          <h1 className="text-3xl font-bold mb-4">Mobile Experience</h1>
          <p className="text-lg mb-4">
            Tandoori Grills is optimized for mobile devices.
          </p>
          <p className="text-md mb-6 text-gray-300">
            Our menu and ordering experience are best enjoyed on smartphones.
          </p>
          <div className="flex justify-center items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" 
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
