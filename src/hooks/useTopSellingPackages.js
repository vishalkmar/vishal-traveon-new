import { useState, useEffect } from 'react';
import { getApiV1Base } from '../utils/apiUrl.js';

/**
 * Returns the set of gtxPkgIds that are marked as top-selling.
 */
export const useTopSellingPackages = () => {
  const [topSellingIds, setTopSellingIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTopSelling();
  }, []);

  const fetchTopSelling = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${getApiV1Base()}/package-config/top-selling`);
      if (!res.ok) { setTopSellingIds(new Set()); return; }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setTopSellingIds(new Set(data.data.map(Number)));
      } else {
        setTopSellingIds(new Set());
      }
    } catch {
      setTopSellingIds(new Set());
    } finally {
      setLoading(false);
    }
  };

  const isTopSelling = (gtxPkgId) => topSellingIds.has(Number(gtxPkgId));

  return { topSellingIds, isTopSelling, loading, refresh: fetchTopSelling };
};
