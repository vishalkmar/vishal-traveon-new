import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './PackageConfiguration.css';
import { getApiV1Base } from '../../utils/apiUrl.js';

function extractCountriesFromPackages(rows) {
  const countries = new Map();
  rows.forEach((pkg) => {
    const ids = String(pkg.countryIds ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const names = String(pkg.countries || '')
      .split(',')
      .map((s) => s.trim());
    ids.forEach((id, idx) => {
      if (!countries.has(id)) {
        countries.set(id, names[idx] || id);
      }
    });
  });
  return Array.from(countries.entries())
    .map(([id, name]) => ({ id, name: String(name).trim() || id }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function packageHasCountryId(pkg, countryId) {
  if (!countryId) return true;
  const cid = String(countryId).trim();
  const ids = String(pkg.countryIds ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return ids.includes(cid);
}

async function fetchDisabledGtxSet(base) {
  try {
    const res = await fetch(`${base}/package-config?status=false`);
    if (!res.ok) return new Set();
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) return new Set();
    return new Set(data.data.map((p) => Number(p.gtxPkgId)));
  } catch {
    return new Set();
  }
}

function filterPackagesClient(rows, countryId, statusFilter, searchString, disabledGtx) {
  let filtered = rows;
  if (countryId) {
    filtered = filtered.filter((p) => packageHasCountryId(p, countryId));
  }

  const mapped = filtered.map((pkg) => ({
    id: null,
    packageId: pkg.id,
    packageName: pkg.name,
    gtxPkgId: pkg.gtxPkgId,
    minPrice: pkg.minPrice,
    maxPrice: pkg.maxPrice,
    createdAt: pkg.createdAt,
    isEnabled: !disabledGtx.has(Number(pkg.gtxPkgId)),
  }));

  let out = mapped;
  if (statusFilter === 'true' || statusFilter === 'false') {
    const want = statusFilter === 'true';
    out = out.filter((r) => r.isEnabled === want);
  }
  if (searchString.trim()) {
    const q = searchString.trim().toLowerCase();
    out = out.filter(
      (r) =>
        String(r.packageName || '').toLowerCase().includes(q) ||
        String(r.gtxPkgId).includes(q)
    );
  }
  return out;
}

export default function PackageConfiguration() {
  const [packages, setPackages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchString, setSearchString] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toggleLoadingId, setToggleLoadingId] = useState(null);

  /** null = probing, 'config' = package-config API, 'packages' = fallback from /packages */
  const [apiMode, setApiMode] = useState(null);
  const [allPackagesRaw, setAllPackagesRaw] = useState([]);
  const [disabledGtx, setDisabledGtx] = useState(() => new Set());

  const base = useMemo(() => getApiV1Base(), []);

  // Detect backend: package-config vs packages-only (older Railway deploys)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const probe = await fetch(`${base}/package-config/countries`);
        if (cancelled) return;
        if (probe.ok) {
          const j = await probe.json();
          setApiMode('config');
          if (j.success && Array.isArray(j.data)) setCountries(j.data);
          return;
        }

        setApiMode('packages');
        const [pkgRes, disabledSet] = await Promise.all([
          fetch(`${base}/packages?limit=500&page=1`),
          fetchDisabledGtxSet(base),
        ]);
        if (cancelled) return;
        setDisabledGtx(disabledSet);
        const pkgJson = await pkgRes.json().catch(() => ({}));
        const rows = Array.isArray(pkgJson?.data) ? pkgJson.data : [];
        setAllPackagesRaw(rows);
        setCountries(extractCountriesFromPackages(rows));
        if (!pkgRes.ok) {
          setError('Failed to load packages');
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setApiMode('packages');
          setError('Failed to connect to API');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [base]);

  const loadTableConfigMode = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (selectedCountry) params.set('countryId', selectedCountry);
      if (statusFilter) params.set('status', statusFilter);
      if (searchString.trim()) params.set('searchString', searchString.trim());

      const url = params.toString()
        ? `${base}/package-config?${params.toString()}`
        : `${base}/package-config`;

      const response = await fetch(url);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.message || 'Failed to load packages');
        setPackages([]);
        return;
      }

      if (data.success && Array.isArray(data.data)) {
        setPackages(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to load packages');
        setPackages([]);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages');
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }, [base, selectedCountry, statusFilter, searchString]);

  useEffect(() => {
    if (apiMode !== 'config') return;
    loadTableConfigMode();
  }, [apiMode, loadTableConfigMode]);

  useEffect(() => {
    if (apiMode !== 'packages') return;
    setPackages(
      filterPackagesClient(
        allPackagesRaw,
        selectedCountry,
        statusFilter,
        searchString,
        disabledGtx
      )
    );
  }, [apiMode, allPackagesRaw, selectedCountry, statusFilter, searchString, disabledGtx]);

  const handleToggleStatus = async (gtxPkgId, currentEnabled) => {
    const token = localStorage.getItem('token');
    setToggleLoadingId(gtxPkgId);
    try {
      const response = await fetch(`${base}/package-config/${gtxPkgId}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ isEnabled: !currentEnabled }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 404) {
        alert(
          'Toggle API is not available on this server. Redeploy the backend with the latest code (package-config routes) to enable this.'
        );
        return;
      }

      if (response.status === 401 || response.status === 403) {
        alert(
          data.message ||
            'Admin login required. Log in again so your session token is sent with the toggle request.'
        );
        return;
      }

      if (data.success) {
        const nextDisabled = new Set(disabledGtx);
        if (!currentEnabled) {
          nextDisabled.delete(Number(gtxPkgId));
        } else {
          nextDisabled.add(Number(gtxPkgId));
        }
        setDisabledGtx(nextDisabled);

        setPackages((prev) =>
          prev.map((pkg) =>
            pkg.gtxPkgId === gtxPkgId ? { ...pkg, isEnabled: !currentEnabled } : pkg
          )
        );
      } else {
        alert(data.message || 'Error updating package status');
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('Failed to update package status');
    } finally {
      setToggleLoadingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAmount = (amount) => {
    if (amount == null || amount === '') return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  const formatAmountCell = (minPrice, maxPrice) => {
    if (minPrice == null && maxPrice == null) return 'N/A';
    const a = formatAmount(minPrice);
    const b = formatAmount(maxPrice);
    if (a === b || maxPrice == null) return a;
    if (minPrice == null) return b;
    return `${a} – ${b}`;
  };

  const isRowEnabled = (pkg) => pkg.isEnabled !== false;

  const showTableLoading = apiMode === null || (apiMode === 'config' && loading);

  return (
    <div className="package-config-container">
      <h2>Package Configuration</h2>

      {apiMode === 'packages' && (
        <div className="package-config-banner">
          Package list is loaded from the packages API. For full admin controls, deploy the latest backend so{' '}
          <code>/api/v1/package-config</code> is available on Railway.
        </div>
      )}

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="pkg-country-filter">Filter by Country:</label>
          <select
            id="pkg-country-filter"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">All Countries</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="pkg-status-filter">Status:</label>
          <select
            id="pkg-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="pkg-search">Search:</label>
          <input
            id="pkg-search"
            type="text"
            placeholder="Search by package name or ID..."
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showTableLoading && <div className="loading">Loading packages...</div>}

      {!showTableLoading && packages.length > 0 ? (
        <div className="table-wrapper">
          <table className="package-table">
            <thead>
              <tr>
                <th>Package Name</th>
                <th>GTS Package ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={String(pkg.gtxPkgId)}>
                  <td>{pkg.packageName || 'N/A'}</td>
                  <td>{pkg.gtxPkgId}</td>
                  <td>{formatAmountCell(pkg.minPrice, pkg.maxPrice)}</td>
                  <td>{formatDate(pkg.createdAt)}</td>
                  <td>
                    <label
                      className="pkg-switch"
                      title={isRowEnabled(pkg) ? 'Visible on site' : 'Hidden from site'}
                    >
                      <input
                        type="checkbox"
                        checked={isRowEnabled(pkg)}
                        disabled={toggleLoadingId === pkg.gtxPkgId}
                        onChange={() => handleToggleStatus(pkg.gtxPkgId, isRowEnabled(pkg))}
                      />
                      <span className="pkg-slider" />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !showTableLoading && <div className="no-data">No packages found</div>
      )}
    </div>
  );
}
