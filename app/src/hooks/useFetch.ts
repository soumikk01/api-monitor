'use client';
import { useState, useEffect } from 'react';
export function useFetch<T>(url: string) {
  const [data] = useState<T | null>(null);
  const [loading] = useState(true);
  useEffect(() => { /* fetch logic */ }, [url]);
  return { data, loading };
}
