export type AffiliatePayload = {
    full_name: string;
    email: string;
    country_code?: string;
    phone?: string;
    country: string;
    gov_or_business_id?: string | null;
    strategy: string;
    portfolio_links?: string;
    motivation: string;
    other_programs?: string;
};

export async function submitAffiliateApplication(p: AffiliatePayload) {
    const res = await fetch(`/api/affiliate/apply`, {      // <= proxy
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(p),
    });
    if (!res.ok) {
        let msg = "Failed to submit application";
        try { const j = await res.json(); msg = j?.error || j?.message || msg; } catch { }
        throw new Error(msg);
    }
    return res.json();
}
