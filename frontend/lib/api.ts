import { getAccessToken, setAccessToken, clearAccessToken } from "./auth";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function doFetch(input: RequestInfo, init?: RequestInit) {
  const token = getAccessToken();

  const headersObj: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init && init.headers ? (init.headers as Record<string, string>) : {}),
  };

  if (token) {
    headersObj["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(BASE + input, {
    ...(init || {}),
    headers: headersObj as HeadersInit,
    credentials: "include", // important to send httpOnly cookie
  });

  if (res.status === 401) {
    // try refresh
    const refreshed = await attemptRefresh();
    if (refreshed) {
      // retry original request
      const token2 = getAccessToken();
      if (token2) headersObj["Authorization"] = `Bearer ${token2}`;
      return fetch(BASE + input, {
        ...(init || {}),
        headers: headersObj as HeadersInit,
        credentials: "include",
      });
    }
  }

  return res;
}

async function attemptRefresh() {
  try {
    const res = await fetch(BASE + "/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      // log response body to help debugging (400/401 etc.)
      try {
        const text = await res.text();
        console.debug("refresh failed", { status: res.status, body: text });
      } catch {
        // ignore
      }
      clearAccessToken();
      return false;
    }

    const data = await res.json();
    if (data.access_token) {
      setAccessToken(data.access_token);
      return true;
    }

    return false;
  } catch {
    clearAccessToken();
    return false;
  }
}

export { doFetch as apiFetch };
