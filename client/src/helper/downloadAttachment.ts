import { APIs } from "./apis.ts";

export const downloadAttachment = async (filename: string) => {
  const url = `${globalThis.location.origin}${
    APIs.DownloadAttachment(filename)
  }`;
  const fallbackUrl = String(import.meta.env.VITE_FALLBACK_ATTACHMENT_URL);

  try {
    let response = await fetch(url);

    if (!response.ok) {
      console.warn(`Primary API failed. Falling back to old API.`);

      if (!fallbackUrl) {
        throw new Error("Primary API failed and fallback API does not exist.");
      }

      response = await fetch(`${fallbackUrl}/${filename}`);

      if (!response.ok) {
        throw new Error(`Both primary and fallback APIs failed.`);
      }
    }

    const blob = await response.blob();
    const downloadUrl = globalThis.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    globalThis.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.error(`Download failed: ${err}`);
  }
};
