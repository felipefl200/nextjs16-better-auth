export interface ParsedUserAgent {
  browser: string;
  os: string;
  friendlyName: string;
  deviceType: "desktop" | "mobile";
}

export function parseUserAgent(uaString?: string | null): ParsedUserAgent {
  if (!uaString) {
    return {
      browser: "Navegador",
      os: "Dispositivo Desconhecido",
      friendlyName: "Navegador Desconhecido",
      deviceType: "desktop",
    };
  }

  let os = "Sistema Desconhecido";
  if (uaString.includes("Windows")) os = "Windows";
  else if (uaString.includes("Mac OS X") || uaString.includes("Macintosh")) os = "macOS";
  else if (uaString.includes("Android")) os = "Android";
  else if (uaString.includes("iPhone") || uaString.includes("iPad")) os = "iOS";
  else if (uaString.includes("Linux")) os = "Linux";

  let browser = "Navegador";
  if (uaString.includes("Edg/")) browser = "Microsoft Edge";
  else if (uaString.includes("Chrome/") && !uaString.includes("Edg/")) browser = "Chrome";
  else if (uaString.includes("Safari/") && !uaString.includes("Chrome/")) browser = "Safari";
  else if (uaString.includes("Firefox/")) browser = "Firefox";
  else if (uaString.includes("OPR/") || uaString.includes("Opera/")) browser = "Opera";

  const isMobile = os === "Android" || os === "iOS" || uaString.includes("Mobile");

  return {
    browser,
    os,
    friendlyName: `${browser} no ${os}`,
    deviceType: isMobile ? "mobile" : "desktop",
  };
}
