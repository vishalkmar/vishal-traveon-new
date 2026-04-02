import { useState, useEffect } from 'react';
import { getApiV1Base } from '../utils/apiUrl.js';

/**
 * Hook to check if a package is enabled or disabled
 * @param {number} gtxPkgId - The GTX Package ID
 * @returns {boolean} - true if enabled, false if disabled
 */
export const usePackageStatus = (gtxPkgId) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!gtxPkgId) return;

    const checkPackageStatus = async () => {
      setLoading(true);
      try {
        const base = getApiV1Base();
        const response = await fetch(`${base}/package-config/${gtxPkgId}`);
        if (!response.ok) {
          setIsEnabled(true);
          return;
        }
        const data = await response.json();
        if (data.success && data.data) {
          setIsEnabled(data.data.isEnabled !== false);
        } else {
          setIsEnabled(true);
        }
      } catch (error) {
        console.error('Error checking package status:', error);
        setIsEnabled(true);
      } finally {
        setLoading(false);
      }
    };

    checkPackageStatus();
  }, [gtxPkgId]);

  return { isEnabled, loading };
};

export const checkPackageStatus = async (gtxPkgId) => {
  try {
    const base = getApiV1Base();
    const response = await fetch(`${base}/package-config/${gtxPkgId}`);
    if (!response.ok) {
      return true;
    }
    const data = await response.json();
    if (data.success && data.data) {
      return data.data.isEnabled !== false;
    }
    return true;
  } catch (error) {
    console.error('Error checking package status:', error);
    return true;
  }
};

export const filterEnabledPackages = async (packages) => {
  const enabledPackages = [];

  for (const pkg of packages) {
    const enabled = await checkPackageStatus(pkg.gtxPkgId);
    if (enabled) {
      enabledPackages.push(pkg);
    }
  }

  return enabledPackages;
};

export default { usePackageStatus, checkPackageStatus, filterEnabledPackages };
