"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CheckoutAutoInner() {
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const serviceId = params.get("serviceId");
  const bypass = params.get("bypass");

  useEffect(() => {
    if (!serviceId) {
      setError("Missing serviceId");
      return;
    }
    (async () => {
      try {
        const url = bypass ? `/api/checkout?bypass=${encodeURIComponent(bypass)}` : "/api/checkout";
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serviceId, bypass }),
        });
        const data = await res.json().catch(() => ({}));
        if (data?.url) {
          window.location.href = data.url as string;
        } else {
          setError((data?.error as string) || "Failed to create checkout session");
        }
      } catch {
        setError("Failed to create checkout session");
      }
    })();
  }, [serviceId, bypass]);

  return (
    <section className="section-padding">
      <div className="container-max text-center text-white">
        {!error ? (
          <div>Preparing checkout…</div>
        ) : (
          <div>
            <div className="mb-4">{error}</div>
            <Link className="valorant-button" href="/#services">Back to Services</Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default function CheckoutAutoPage() {
  return (
    <Suspense fallback={<section className="section-padding"><div className="container-max text-center text-white">Preparing checkout…</div></section>}>
      <CheckoutAutoInner />
    </Suspense>
  );
}


