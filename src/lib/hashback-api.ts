// Proxied in dev via vite.config → `/api/hashback` → https://api.hashback.co.ke
// Production: configure the same proxy (e.g. Vercel rewrites in vercel.json).
const API_BASE_URL = "/api/hashback";

// Same credentials pattern as FrankSurvey; override with VITE_* in production.
const API_KEY = import.meta.env.VITE_HASHBACK_API_KEY ?? "h26212Lo1a8Jm";
const ACCOUNT_ID = import.meta.env.VITE_HASHBACK_ACCOUNT_ID ?? "HP674928";

export interface InitiateSTKPushRequest {
  api_key: string;
  account_id: string;
  amount: string;
  msisdn: string;
  reference: string;
}

export interface InitiateSTKPushResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  CustomerMessage?: string;
}

export interface CheckTransactionStatusRequest {
  api_key: string;
  account_id: string;
  checkoutid: string;
}

export interface CheckTransactionStatusResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: string;
  ResultDesc: string;
}

/**
 * Initiate STK Push to customer's M-Pesa
 */
export async function initiateSTKPush(
  amount: string,
  phoneNumber: string,
  reference: string,
): Promise<InitiateSTKPushResponse> {
  const msisdn = formatPhoneNumber(phoneNumber);

  if (import.meta.env.DEV) {
    console.log(
      "Hashback API key in use (masked):",
      `${API_KEY.slice(0, 5)}...${API_KEY.slice(-4)}`,
    );
  }

  const requestBody: InitiateSTKPushRequest = {
    api_key: API_KEY,
    account_id: ACCOUNT_ID,
    amount,
    msisdn,
    reference,
  };

  const response = await fetch(`${API_BASE_URL}/initiatestk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("STK Push Error Response:", response.status, errorText);
    throw new Error(`STK Push failed: ${response.status} - ${errorText}`);
  }

  const data: InitiateSTKPushResponse = await response.json();

  if (data.ResponseCode !== "0") {
    throw new Error(data.ResponseDescription || "STK Push failed");
  }

  return data;
}

export async function checkTransactionStatus(
  checkoutId: string,
): Promise<CheckTransactionStatusResponse> {
  const requestBody: CheckTransactionStatusRequest = {
    api_key: API_KEY,
    account_id: ACCOUNT_ID,
    checkoutid: checkoutId,
  };

  const response = await fetch(`${API_BASE_URL}/transactionstatus`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Status check failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function pollTransactionStatus(
  checkoutId: string,
  maxAttempts = 30,
  intervalMs = 3000,
): Promise<CheckTransactionStatusResponse> {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const checkStatus = async () => {
      try {
        attempts++;
        const status = await checkTransactionStatus(checkoutId);

        if (status.ResultCode === "0") {
          resolve(status);
          return;
        }

        if (attempts >= maxAttempts) {
          reject(new Error("Transaction polling timeout — please check status manually"));
          return;
        }

        setTimeout(checkStatus, intervalMs);
      } catch (error) {
        reject(error);
      }
    };

    void checkStatus();
  });
}

function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("0") && digits.length === 10) {
    return `254${digits.substring(1)}`;
  }

  if (digits.startsWith("254") && digits.length === 12) {
    return digits;
  }

  if ((digits.startsWith("7") || digits.startsWith("1")) && digits.length === 9) {
    return `254${digits}`;
  }

  return digits;
}

export function isValidPhoneNumber(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  return /^254[17]\d{8}$/.test(formatted);
}
