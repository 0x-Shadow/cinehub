import { useCallback, useEffect, useRef, useState } from "react";

const inflight = new Map();

export default function useTmdb(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const depsKey = JSON.stringify(deps);

  const load = useCallback(async () => {
    const key = fetcherRef.current.toString() + ":" + depsKey;
    setState((s) => ({ ...s, loading: true, error: null }));

    if (inflight.has(key)) {
      const data = await inflight.get(key);
      setState({ data, error: null, loading: false });
      return data;
    }

    const promise = fetcherRef.current()
      .then((data) => {
        inflight.delete(key);
        setState({ data, error: null, loading: false });
        return data;
      })
      .catch((error) => {
        inflight.delete(key);
        if (error?.name !== "AbortError") {
          setState({ data: null, error: error?.message ?? "Something went wrong", loading: false });
        }
        return null;
      });

    inflight.set(key, promise);
    return promise;
  }, [depsKey]);

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, error: null, loading: true });
    const key = fetcherRef.current.toString() + ":" + depsKey;

    const promise = fetcherRef.current()
      .then((data) => {
        if (!controller.signal.aborted) {
          inflight.delete(key);
          setState({ data, error: null, loading: false });
        }
        return data;
      })
      .catch((error) => {
        inflight.delete(key);
        if (!controller.signal.aborted) {
          setState({ data: null, error: error?.message ?? "Something went wrong", loading: false });
        }
        return null;
      });

    inflight.set(key, promise);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey]);

  const refresh = useCallback(() => {
    inflight.delete(fetcherRef.current.toString() + ":" + depsKey);
    return load();
  }, [load, depsKey]);

  return { ...state, refresh };
}
