declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export const trackEvent = (eventName: string, data?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window?.dataLayer) {
    window?.dataLayer.push({
      event: eventName,
      ...data,
    });
  }
};
