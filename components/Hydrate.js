"use client";
import { useEffect, useState } from "react";

export default function Hydrate({ children }) {
  const [isHydrated, setIsHydrated] = useState(false);

  //Wait till Nextjs rehydration completes
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  return (
    <>{isHydrated ? <body className="">{children}</body> : <body></body>}</>
  );
}
