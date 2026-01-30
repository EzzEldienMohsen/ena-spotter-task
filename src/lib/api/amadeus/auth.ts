import axios, { AxiosError } from 'axios';

interface TokenData {
  access_token: string;
  expires_in: number;
  token_type: string;
  expiresAt: number;
}

let tokenData: TokenData | null = null;

export async function getAccessToken(): Promise<string> {
  if (tokenData && isTokenValid()) {
    return tokenData.access_token;
  }

  return await refreshToken();
}

export function isTokenValid(): boolean {
  if (!tokenData) return false;
  return Date.now() < tokenData.expiresAt - 60000; // 1 minute buffer
}

export async function refreshToken(): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_AMADEUS_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_AMADEUS_API_SECRET;
  const apiUrl = process.env.NEXT_PUBLIC_AMADEUS_API_URL;

  if (!apiKey || !apiSecret || !apiUrl) {
    throw new Error('Amadeus API credentials are not configured');
  }

  try {
    const response = await axios.post(
      `${apiUrl}/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: apiKey,
        client_secret: apiSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    tokenData = {
      ...response.data,
      expiresAt: Date.now() + response.data.expires_in * 1000,
    };

    return tokenData!.access_token;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Failed to get access token:', axiosError.response?.data || axiosError.message);
    throw new Error('Failed to authenticate with Amadeus API');
  }
}
