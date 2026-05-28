import { APIs } from "./apis.ts";

export const downloadAttachment = async (filename: string) => {
  const url = `${globalThis.location.origin}${
    APIs.DownloadAttachment(filename)
  }`;
  const fallbackUrl = String(import.meta.env.VITE_FALLBACK_ATTACHMENT_URL);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`Primary API failed. Falling back to old API via new tab.`);

      if (!fallbackUrl) {
        throw new Error("Primary API failed and fallback API does not exist.");
      }

      globalThis.open(`${fallbackUrl}/${filename}`, "_blank");
      return;
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
