'use client';
import { useState, useEffect } from 'react';
export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { /* fetch logic */ }, [url]);
  return { data, loading };
}
