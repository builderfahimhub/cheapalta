/**
 * Utility to convert standard product URLs into affiliate links.
 * Replace placeholders with your actual affiliate IDs.
 */

export const AFFILIATE_CONFIG = {
  amazon: {
    tag: "cheapalta-20", // Replace with your Amazon Associate Tag
  },
  ebay: {
    campid: "5338900000", // Replace with your eBay Partner Network Campaign ID
  },
};

export function getAffiliateLink(originalUrl: string): string {
  try {
    const url = new URL(originalUrl);
    
    // Amazon Affiliate Logic
    if (url.hostname.includes("amazon.com")) {
      url.searchParams.set("tag", AFFILIATE_CONFIG.amazon.tag);
      return url.toString();
    }

    // eBay Affiliate Logic
    if (url.hostname.includes("ebay.com")) {
      // eBay often uses a redirect wrapper for affiliate links
      const encodedUrl = encodeURIComponent(originalUrl);
      return `https://rover.ebay.com/rover/1/711-53200-19255-0/1?mpre=${encodedUrl}&campid=${AFFILIATE_CONFIG.ebay.campid}&toolid=10001&customid=cheapalta`;
    }

    // Add more retailers as needed...

    return originalUrl;
  } catch (e) {
    return originalUrl;
  }
}
