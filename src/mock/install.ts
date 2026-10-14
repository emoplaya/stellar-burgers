// Перехватывает запросы к API бургерной. Если настоящий API не отвечает,
// приложение незаметно для остального кода переходит на демо-бэкенд.
import { handleMockRequest } from './server';

const PROBE_TIMEOUT_MS = 5000;

type TMode = 'real' | 'demo';

const listeners = new Set<(mode: TMode) => void>();
let currentMode: TMode | null = null;

export const onApiModeChange = (listener: (mode: TMode) => void) => {
  listeners.add(listener);
  if (currentMode) listener(currentMode);
  return () => {
    listeners.delete(listener);
  };
};

const setMode = (mode: TMode) => {
  currentMode = mode;
  listeners.forEach((listener) => listener(mode));
};

const forcedMode = (): TMode | null => {
  const param = new URLSearchParams(window.location.search).get('api');
  if (param === 'demo' || param === 'real') return param;
  if (process.env.API_MODE === 'demo' || process.env.API_MODE === 'real') {
    return process.env.API_MODE;
  }
  return null;
};

export const installApiFallback = (apiUrl: string | undefined) => {
  const base = (apiUrl || 'demo://api').replace(/\/$/, '');
  const realFetch = window.fetch.bind(window);

  const probe = async (): Promise<TMode> => {
    const forced = forcedMode();
    if (forced) return forced;
    if (!apiUrl) return 'demo';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    try {
      const res = await realFetch(`${base}/ingredients`, {
        signal: controller.signal
      });
      return res.ok ? 'real' : 'demo';
    } catch {
      return 'demo';
    } finally {
      clearTimeout(timer);
    }
  };

  let modePromise: Promise<TMode> | null = null;
  const getMode = () => {
    if (!modePromise) {
      modePromise = probe().then((mode) => {
        setMode(mode);
        if (mode === 'demo') {
          console.info(
            '[stellar-burgers] API недоступен, включен демо-режим с локальными данными'
          );
        }
        return mode;
      });
    }
    return modePromise;
  };

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url;

    if (!url.startsWith(base)) return realFetch(input, init);

    const mode = await getMode();
    if (mode === 'real') return realFetch(input, init);
    return handleMockRequest(url.slice(base.length), init);
  };

  getMode();
};
