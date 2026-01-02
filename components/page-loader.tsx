"use client";

import { useEffect, useState } from "react";

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-white transition-opacity duration-500">
      <div className="relative flex flex-col items-center">
        {/* Animated prayer hands icon */}
        {/* <div className="animate-pulse-slow mb-8">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-800"
          >
            <path
              d="M12 2L11.5 7.5M12 2L12.5 7.5M12 2V7.5M11.5 7.5C11 9.5 10 11 8 12.5C6 14 4.5 15.5 4 17.5C3.5 19.5 4 21 5.5 21.5C7 22 8.5 21 9.5 19.5C10.5 18 11 16.5 11.5 14.5V7.5ZM12.5 7.5C13 9.5 14 11 16 12.5C18 14 19.5 15.5 20 17.5C20.5 19.5 20 21 18.5 21.5C17 22 15.5 21 14.5 19.5C13.5 18 13 16.5 12.5 14.5V7.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div> */}

        {/* Loading spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-purple-700 rounded-full animate-spin"></div>
        </div>

        {/* Loading text */}
        <p className="mt-6 text-black text-md font-normal tracking-wider animate-fade-in-out">
          flying upward...
        </p>
      </div>
    </div>
  );
}
