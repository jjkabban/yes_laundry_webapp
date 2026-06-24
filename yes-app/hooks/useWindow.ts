import { useEffect, useState } from "react";

const getSize = () => {
  if (typeof window === "undefined")
    return { isMobile: false, isTablet: false, isDesktop: true };
  const size = window.innerWidth;
  return {
    isMobile: size <= 480,
    isTablet: size > 480 && size <= 768,
    isDesktop: size > 768,
  };
};

export default function useWindow() {
  const [sizes, setSizes] = useState(getSize);

  useEffect(() => {
    const handler = () => setSizes(getSize());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return sizes;
}
