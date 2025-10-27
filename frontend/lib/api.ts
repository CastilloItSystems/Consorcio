import axios, { AxiosRequestConfig, isAxiosError } from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./auth";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Keep the same signature so callers don't need changes
async function doFetch(input: RequestInfo, init?: RequestInit) {
  const token = getAccessToken();
  console.log("token", token);

  const headersObj: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init && init.headers ? (init.headers as Record<string, string>) : {}),
  };

  if (token) {
    headersObj["Authorization"] = `Bearer ${token}`;
  }

  const axiosConfig: AxiosRequestConfig = {
    url: BASE + String(input),
    method: (init && init.method
      ? String(init.method).toLowerCase()
      : "get") as AxiosRequestConfig["method"],
    headers: headersObj,
    withCredentials: true,
    data: undefined,
  };

  const body = (init as RequestInit | undefined)?.body;
  if (body !== undefined && body !== null) {
    if (typeof body === "string") {
      try {
        axiosConfig.data = JSON.parse(body);
      } catch {
        axiosConfig.data = body;
      }
    } else {
      axiosConfig.data = body as unknown;
    }
  }

  try {
    const response = await axios(axiosConfig);
    console.log(response);
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: async () => response.data,
      text: async () =>
        typeof response.data === "string" ? response.data : JSON.stringify(response.data),
    };
  } catch (err: unknown) {
    // axios throws for non-2xx — handle response if available
    if (isAxiosError(err) && err.response) {
      const res = err.response;
      // if 401 try refresh flow
      if (res.status === 401) {
        const refreshed = await attemptRefresh();
        if (refreshed) {
          const token2 = getAccessToken();
          if (token2) headersObj["Authorization"] = `Bearer ${token2}`;
          const retryConfig = {
            ...axiosConfig,
            headers: { ...(axiosConfig.headers || {}), Authorization: headersObj["Authorization"] },
          };
          const retryResp = await axios(retryConfig);
          return {
            ok: retryResp.status >= 200 && retryResp.status < 300,
            status: retryResp.status,
            json: async () => retryResp.data,
            text: async () =>
              typeof retryResp.data === "string" ? retryResp.data : JSON.stringify(retryResp.data),
          };
        }
      }

      return {
        ok: false,
        status: res.status,
        json: async () => res.data,
        text: async () => (typeof res.data === "string" ? res.data : JSON.stringify(res.data)),
      };
    }

    // network or other error
    clearAccessToken();
    return {
      ok: false,
      status: 0,
      json: async () => null,
      text: async () => String(err),
    };
  }
}

async function attemptRefresh() {
  try {
    // withCredentials envía automáticamente las cookies (incluido refresh_token)
    // El backend actualizará la cookie con el nuevo refresh_token rotado
    const res = await axios.post(
      BASE + "/auth/refresh",
      {}, // Enviar objeto vacío en lugar de null
      { withCredentials: true },
    );

    if (res.status < 200 || res.status >= 300) {
      try {
        console.debug("refresh failed", { status: res.status, body: res.data });
      } catch {
        /* ignore */
      }
      clearAccessToken();
      return false;
    }

    const data = res.data;
    if (data && data.access_token) {
      setAccessToken(data.access_token);
      // El nuevo refresh_token ya fue actualizado en las cookies por el backend
      // No necesitamos manejarlo aquí ya que está en httpOnly cookie
      console.debug("Token refreshed successfully");
      return true;
    }

    return false;
  } catch (err: unknown) {
    if (isAxiosError(err) && err.response) {
      try {
        console.debug("refresh failed", { status: err.response.status, body: err.response.data });
      } catch {
        /* ignore */
      }
    } else {
      console.debug("refresh error", err && (err as Error).message ? (err as Error).message : err);
    }
    clearAccessToken();
    return false;
  }
}

export { doFetch as apiFetch };
