import { useState, useEffect } from 'react';
import { getApiV1Base } from '../utils/apiUrl.js';

/**
 * Hook to manage disabled packages globally.
 * Uses package-config when deployed; if 404, no packages are treated as disabled.
 */
export const useDisabledPackages = () => {
  const [disabledPackages, setDisabledPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDisabledPackages();

    const interval = setInterval(() => {
      fetchDisabledPackages();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchDisabledPackages = async () => {
    try {
      setLoading(true);
      const base = getApiV1Base();
      const response = await fetch(`${base}/package-config?status=false`);

      if (!response.ok) {
        setDisabledPackages([]);
        return;
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const disabledIds = data.data.map((pkg) => Number(pkg.gtxPkgId));
        setDisabledPackages(disabledIds);
      } else {
        setDisabledPackages([]);
      }
    } catch (err) {
      console.error('Error fetching disabled packages:', err);
      setDisabledPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const isPackageEnabled = (gtxPkgId) => {
    const id = Number(gtxPkgId);
    return !disabledPackages.includes(id);
  };

  const refreshDisabledPackages = () => {
    fetchDisabledPackages();
  };

  return {
    disabledPackages,
    isPackageEnabled,
    refreshDisabledPackages,
    loading
  };
};
