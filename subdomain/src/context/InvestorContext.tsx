"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchInvestor, type Investor } from "@/lib/api";

interface InvestorContextValue {
  investor: Investor | null;
  loading: boolean;
}

const InvestorContext = createContext<InvestorContextValue>({
  investor: null,
  loading: true,
});

export function useInvestor() {
  return useContext(InvestorContext);
}

function detectSubdomain(): string {
  if (typeof window === "undefined") return "";
  const hostname = window.location.hostname; // e.g. "masterise.bds-clickhome.com" or "localhost"
  const parts = hostname.split(".");
  // If there are more than 2 parts, the first part is the subdomain
  // e.g. "masterise.bds-clickhome.com" → ["masterise", "bds-clickhome", "com"]
  if (parts.length >= 3) {
    return parts[0];
  }
  // On localhost or bare domain, return empty string → backend will use first investor
  return "";
}

export function InvestorProvider({ children }: { children: React.ReactNode }) {
  const [investor, setInvestor] = useState<Investor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subdomain = detectSubdomain();
    fetchInvestor(subdomain).then((data) => {
      // Backend (Astrotomic Translatable) already puts name/short_description
      // at the root level of the response, so no extra parsing needed.
      setInvestor(data);
      setLoading(false);
    });
  }, []);

  return (
    <InvestorContext.Provider value={{ investor, loading }}>
      {children}
    </InvestorContext.Provider>
  );
}
