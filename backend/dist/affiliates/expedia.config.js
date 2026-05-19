"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpediaAffiliateConfig = getExpediaAffiliateConfig;
function getExpediaAffiliateConfig() {
    return {
        clickref: process.env.EXPEDIA_AFFILIATE_CLICKREF ?? "1110l3WXq3Wy",
        affcid: process.env.EXPEDIA_AFFILIATE_AFFCID ??
            "US.DIRECT.PHG.1110l32648.1101l81954",
        refId: process.env.EXPEDIA_AFFILIATE_REF_ID ?? "1110l3WXq3Wy",
        myAd: process.env.EXPEDIA_AFFILIATE_MY_AD ??
            "AFF.US.DIRECT.PHG.1110l32648.1101l81954",
        afflid: process.env.EXPEDIA_AFFILIATE_AFFLID ?? "1110l3WXq3Wy",
        affdtl: process.env.EXPEDIA_AFFILIATE_AFFDTL ?? "PHG.1110l3WXq3Wy.PZBIGiKZjG",
        siteid: process.env.EXPEDIA_SITE_ID ?? "1",
        langid: process.env.EXPEDIA_LANG_ID ?? "1033",
    };
}
//# sourceMappingURL=expedia.config.js.map