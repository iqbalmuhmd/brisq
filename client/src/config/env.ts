import "server-only";

const gatewayUrl = process.env.GATEWAY_URL;

if (!gatewayUrl) {
  throw new Error("GATEWAY_URL is not set.");
}

export const env = {
  gatewayUrl,
};