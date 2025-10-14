"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type GAListenerProps = {
  children: React.ReactNode;
};

export default function GAListener({ children }: GAListenerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Hydration後のみ動かす
    if (typeof window === "undefined") return;

    const url = pathname + (searchParams.toString() ? `?${searchParams}` : "");
    if (typeof window.gtag === "function") {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  // ✅ 子要素を返す（描画に影響なし）
  return <>{children}</>;
}
