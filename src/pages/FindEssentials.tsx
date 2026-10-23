import { useState, useCallback } from 'react';
import { MapPin, Navigation, Search, Loader2, AlertTriangle, Store, Crosshair, ExternalLink, ChevronDown, MapPinned } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NearbyPlace {
  id: number;
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  distance?: number;
  tags: Record<string, string>;
}

type Status = 'idle' | 'loading' | 'error' | 'permission-denied' | 'no-results' | 'success';

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

async function searchNearbyPharmacies(lat: number, lon: number): Promise<NearbyPlace[]> {
  const radius = 5000;
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="pharmacy"](around:${radius},${lat},${lon});
      node["shop"="chemist"](around:${radius},${lat},${lon});
      node["healthcare"="pharmacy"](around:${radius},${lat},${lon});
    );
    out body;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'data=' + encodeURIComponent(query),
  });

  if (!response.ok) throw new Error('Search request failed');

  const data = await response.json();
  const places: NearbyPlace[] = (data.elements || [])
    .filter((el: { tags?: Record<string, string> }) => el.tags && (el.tags.name || el.tags['name:en']))
    .map((el: { id: number; lat: number; lon: number; tags: Record<string, string> }) => ({
      id: el.id,
      name: el.tags['name:en'] || el.tags.name || 'Pharmacy',
      displayName: el.tags['addr:full'] || el.tags['addr:housenumber']
        ? `${el.tags['addr:housenumber'] || ''} ${el.tags['addr:street'] || ''}, ${el.tags['addr:city'] || ''}`.trim()
        : el.tags.name || 'Pharmacy',
      lat: el.lat,
      lon: el.lon,
      tags: el.tags,
      distance: haversine(lat, lon, el.lat, el.lon),
    }))
    .sort((a: NearbyPlace, b: NearbyPlace) => (a.distance || 0) - (b.distance || 0))
    .slice(0, 15);

  return places;
}

async function ipGeolocate(): Promise<{ lat: number; lon: number }> {
  const res = await fetch('https://ipapi.co/json/');
  if (!res.ok) throw new Error('IP geolocation failed');
  const data = await res.json();
  if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
    throw new Error('IP geolocation returned no coordinates');
  }
  return { lat: data.latitude, lon: data.longitude };
}



export function FindEssentials() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('idle');
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [manualQuery, setManualQuery] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  const [locationMethod, setLocationMethod] = useState<'gps' | 'ip' | null>(null);

  const performSearch = useCallback(async (lat: number, lon: number, method: 'gps' | 'ip') => {
    setCoords({ lat, lon });
    setLocationMethod(method);
    try {
      const results = await searchNearbyPharmacies(lat, lon);
      if (results.length === 0) {
        setStatus('no-results');
      } else {
        setPlaces(results);
        setStatus('success');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Could not reach the nearby-places service. You can still search in Google Maps below.');
    }
  }, []);

  const handleUseLocation = useCallback(() => {
    setStatus('loading');
    setErrorMsg('');

    if (!navigator.geolocation) {
      // No geolocation API — fall back to IP-based location immediately
      ipGeolocate()
        .then(({ lat, lon }) => performSearch(lat, lon, 'ip'))
        .catch(() => {
          setStatus('error');
          setErrorMsg('Could not determine your location. Try entering your city manually above.');
        });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        performSearch(latitude, longitude, 'gps');
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED || err.code === err.POSITION_UNAVAILABLE || err.code === err.TIMEOUT) {
          // GPS failed (permission denied, unavailable, or timeout) — try IP-based fallback
          ipGeolocate()
            .then(({ lat, lon }) => performSearch(lat, lon, 'ip'))
            .catch(() => {
              if (err.code === err.PERMISSION_DENIED) {
                setStatus('permission-denied');
              } else {
                setStatus('error');
                setErrorMsg('Could not access your precise location, and approximate location also failed. Try entering your city manually above.');
              }
            });
        } else {
          ipGeolocate()
            .then(({ lat, lon }) => performSearch(lat, lon, 'ip'))
            .catch(() => {
              setStatus('error');
              setErrorMsg('Could not access your location. Try entering your city manually above.');
            });
        }
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }, [performSearch]);

  const handleManualSearch = useCallback(async () => {
    const q = manualQuery.trim();
    if (!q) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (!geoResponse.ok) throw new Error('Geocoding failed');
      const geoData = await geoResponse.json();
      if (!geoData || geoData.length === 0) {
        setStatus('no-results');
        setErrorMsg('Could not find that location. Try a different search term.');
        return;
      }

      const { lat, lon } = geoData[0];
      setCoords({ lat: parseFloat(lat), lon: parseFloat(lon) });

      try {
        const results = await searchNearbyPharmacies(parseFloat(lat), parseFloat(lon));
        if (results.length === 0) {
          setStatus('no-results');
        } else {
          setPlaces(results);
          setStatus('success');
        }
      } catch {
        setStatus('error');
        setErrorMsg('Could not reach the nearby-places service. You can still search in Google Maps below.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Could not find that location. Try a different search term.');
    }
  }, [manualQuery]);

  const [gmQuery, setGmQuery] = useState('');

  const googleMapsSearchUrl = coords
    ? `https://www.google.com/maps/search/pharmacy+medical+store/@${coords.lat},${coords.lon},15z`
    : `https://www.google.com/maps/search/pharmacy+medical+store+${encodeURIComponent(gmQuery.trim() || manualQuery.trim() || 'near me')}`;

  const hasGmLocation = coords !== null;

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate('/help')}
        className="flex items-center gap-1.5 text-sm font-medium text-plum-400 transition-colors hover:text-plum-600"
      >
        <ChevronDown size={16} className="rotate-90" />
        Back to Help
      </button>

      <div>
        <h1 className="font-display text-2xl font-semibold text-plum-700">Find Nearby Period Essentials</h1>
        <p className="mt-1 text-sm text-plum-400">
          Locate pharmacies and medical stores near you that may stock pads, tampons, and menstrual cups.
        </p>
      </div>

      {/* Location card */}
      <div className="card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex-1 space-y-3">
            <button
              onClick={handleUseLocation}
              disabled={status === 'loading'}
              className="btn-primary w-full sm:w-auto"
            >
              {status === 'loading' && !manualQuery ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Crosshair size={18} />
              )}
              Use My Current Location
            </button>

            <div className="flex items-center gap-2 text-xs text-plum-300">
              <span className="h-px flex-1 bg-cream-200" />
              or search manually
              <span className="h-px flex-1 bg-cream-200" />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={manualQuery}
                onChange={e => setManualQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleManualSearch(); }}
                placeholder="Enter city or locality..."
                className="input-field flex-1 text-sm"
                aria-label="Manual location search"
              />
              <button
                onClick={handleManualSearch}
                disabled={status === 'loading' || !manualQuery.trim()}
                className="btn-secondary px-3"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-xl bg-mint-100 px-3 py-2">
          <MapPin size={14} className="mt-0.5 flex-shrink-0 text-mint-500" />
          <p className="text-[11px] leading-relaxed text-plum-400">
            Your location is used only to search for nearby stores and is never stored or tracked. We do not guarantee product availability — please call ahead to confirm.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {status === 'loading' && (
        <div className="card flex flex-col items-center gap-3 p-8 animate-fade-in">
          <Loader2 size={32} className="animate-spin text-coral-400" />
          <p className="text-sm text-plum-400">Searching for nearby pharmacies and medical stores...</p>
        </div>
      )}

      {/* Permission denied */}
      {status === 'permission-denied' && (
        <div className="space-y-3 animate-fade-in">
          <div className="card p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="mt-0.5 flex-shrink-0 text-coral-400" />
              <div>
                <h3 className="text-sm font-semibold text-plum-600">Location permission denied</h3>
                <p className="mt-1 text-sm text-plum-400">
                  We can't find nearby stores without your location. You can either enable location permission in your browser settings and try again, use the manual search above, or search in Google Maps below.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="space-y-3 animate-fade-in">
          <div className="card p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="mt-0.5 flex-shrink-0 text-coral-400" />
              <div>
                <h3 className="text-sm font-semibold text-plum-600">Something went wrong</h3>
                <p className="mt-1 text-sm text-plum-400">{errorMsg}</p>
              </div>
            </div>
          </div>
          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex w-full items-center justify-center gap-2"
          >
            <ExternalLink size={16} />
            Search in Google Maps instead
          </a>
        </div>
      )}

      {/* No results */}
      {status === 'no-results' && (
        <div className="space-y-3 animate-fade-in">
          <div className="card p-5">
            <div className="flex items-start gap-3">
              <Store size={20} className="mt-0.5 flex-shrink-0 text-plum-400" />
              <div>
                <h3 className="text-sm font-semibold text-plum-600">No stores found nearby</h3>
                <p className="mt-1 text-sm text-plum-400">
                  {errorMsg || "We couldn't find pharmacies or medical stores in this area. Try a wider search or use Google Maps to look for stores manually."}
                </p>
              </div>
            </div>
          </div>
          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex w-full items-center justify-center gap-2"
          >
            <ExternalLink size={16} />
            Search in Google Maps instead
          </a>
        </div>
      )}

      {/* Results */}
      {status === 'success' && places.length > 0 && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-plum-700">
                {places.length} {places.length === 1 ? 'store' : 'stores'} nearby
              </h2>
              {locationMethod === 'ip' && (
                <p className="mt-0.5 text-[11px] text-plum-300">
                  Approximate location based on your network — distances may be less precise.
                </p>
              )}
            </div>
            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium text-coral-500 hover:underline"
            >
              <ExternalLink size={12} />
              View all in Google Maps
            </a>
          </div>

          {places.map(place => {
            const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`;
            const phone = place.tags['phone'] || place.tags['contact:phone'];

            return (
              <div key={place.id} className="card p-4 transition-all hover:shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Store size={16} className="flex-shrink-0 text-coral-400" />
                      <h3 className="truncate text-sm font-semibold text-plum-600">{place.name}</h3>
                    </div>
                    {place.displayName && (
                      <p className="mt-1 text-xs text-plum-400">{place.displayName}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {place.distance !== undefined && (
                        <span className="badge bg-lavender-100 text-lavender-600">
                          <MapPin size={10} />
                          {formatDistance(place.distance)}
                        </span>
                      )}
                      {phone && (
                        <a href={`tel:${phone}`} className="badge bg-mint-100 text-mint-500 hover:bg-mint-200 transition-colors">
                          {phone}
                        </a>
                      )}
                      {place.tags['opening_hours'] && (
                        <span className="badge bg-cream-100 text-plum-400">
                          {place.tags['opening_hours'].split(';')[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-shrink-0 flex-col items-center gap-1 rounded-xl bg-coral-50 px-3 py-2 text-xs font-medium text-coral-500 transition-colors hover:bg-coral-100"
                    aria-label={`Get directions to ${place.name}`}
                  >
                    <Navigation size={18} />
                    Directions
                  </a>
                </div>
              </div>
            );
          })}

          <p className="pt-2 text-center text-[11px] text-plum-300">
            Results from OpenStreetMap. Store details may not be up to date — please call ahead to confirm product availability.
          </p>
        </div>
      )}

      {/* Persistent Google Maps fallback — always visible */}
      <div className="card p-5 animate-fade-in border-coral-200">
        <div className="mb-3 flex items-center gap-2">
          <MapPinned size={18} className="text-coral-400" />
          <h3 className="text-sm font-semibold text-plum-600">Search in Google Maps</h3>
        </div>

        {hasGmLocation ? (
          <p className="mb-3 text-xs text-plum-400">
            Open Google Maps to search for pharmacies and medical stores near your shared location.
          </p>
        ) : (
          <p className="mb-3 text-xs text-plum-400">
            Enter a city or locality to search for pharmacies and medical stores on Google Maps, or leave blank to search near you.
          </p>
        )}

        {!hasGmLocation && (
          <div className="mb-3 flex gap-2">
            <input
              type="text"
              value={gmQuery}
              onChange={e => setGmQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && gmQuery.trim()) window.open(googleMapsSearchUrl, '_blank', 'noopener,noreferrer'); }}
              placeholder="Enter city or locality for Google Maps..."
              className="input-field flex-1 text-sm"
              aria-label="Google Maps location search"
            />
          </div>
        )}

        <a
          href={googleMapsSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex w-full items-center justify-center gap-2"
        >
          <ExternalLink size={16} />
          {hasGmLocation ? 'Search nearby pharmacies on Google Maps' : 'Search in Google Maps'}
        </a>
      </div>
    </div>
  );
}
