"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigateToTab = (basePath, tab) => {
    const url = `${basePath}?tab=${tab}`;
    router.push(url, { scroll: false });
  };

  const getCurrentTab = (defaultTab = "dashboard") => {
    return searchParams.get("tab") || defaultTab;
  };

  return {
    navigateToTab,
    getCurrentTab,
  };
}
