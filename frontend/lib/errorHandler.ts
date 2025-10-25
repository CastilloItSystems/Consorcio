import Swal from "sweetalert2";

type HandleErrorOptions = {
  showAlert?: boolean;
  toast?: boolean;
  title?: string;
};

export function handleError(err: unknown, opts?: HandleErrorOptions) {
  const showAlert = opts?.showAlert ?? true;
  let message = "An unexpected error occurred";
  let code: number | undefined;

  try {
    if (!err) {
      message = "Unknown error";
    } else if (typeof err === "string") {
      message = err;
    } else if (err instanceof Error) {
      message = err.message || message;
    } else if (typeof err === "object") {
      const eObj = err as Record<string, unknown>;
      // try known shapes (axios / fetch / Error-like) using safe index access
      const maybeResponse = eObj["response"] as Record<string, unknown> | undefined;
      const maybeData = maybeResponse
        ? (maybeResponse["data"] as Record<string, unknown> | undefined)
        : (eObj["data"] as Record<string, unknown> | undefined);

      if (
        maybeData &&
        typeof maybeData === "object" &&
        "message" in maybeData &&
        typeof (maybeData as Record<string, unknown>)["message"] === "string"
      ) {
        message = (maybeData as Record<string, unknown>)["message"] as string;
      } else if ("message" in eObj && typeof eObj["message"] === "string") {
        message = eObj["message"] as string;
      }

      if ("status" in eObj && typeof eObj["status"] === "number") {
        code = eObj["status"] as number;
      } else if (
        maybeResponse &&
        "status" in maybeResponse &&
        typeof maybeResponse["status"] === "number"
      ) {
        code = maybeResponse["status"] as number;
      }
    }
  } catch (parseErr) {
    // ignore parsing errors and fall back to generic message
    console.error("handleError parsing failure:", parseErr);
  }

  // Log to console for local debugging
  console.error("[handleError]", { err, message, code });

  // Optional: report to Sentry if it's initialized globally
  try {
    const maybeSentry = (
      globalThis as unknown as { Sentry?: { captureException?: (e: unknown) => void } }
    ).Sentry;
    if (maybeSentry && typeof maybeSentry.captureException === "function") {
      maybeSentry.captureException(err);
    }
  } catch (reportErr) {
    // ignore reporting errors
    console.error("handleError: failed to report to Sentry:", reportErr);
  }

  if (showAlert) {
    const title = opts?.title ?? "Error";
    if (opts?.toast) {
      void Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title,
        text: message,
        showConfirmButton: false,
        timer: 4000,
      });
    } else {
      void Swal.fire({
        icon: "error",
        title,
        text: message,
      });
    }
  }

  return { message, code };
}

export default handleError;
