"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "../../lib/api";
import { canInitiateDonationPayment, parseDonationPaymentConfig } from "../../lib/donationPayment";
import type { DonationPaymentConfig } from "../../lib/donationPayment";

type PaymentConfigState = {
  config: DonationPaymentConfig | null;
  status: "loading" | "ready" | "error";
};

export function useDonationPaymentConfig() {
  const [state, setState] = useState<PaymentConfigState>({ config: null, status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10_000);
    fetchApi("donations/payment-config", {
      skipAuth: true,
      cache: "no-store",
      cacheTtlMs: 0,
      suppressErrorLog: true,
      signal: controller.signal,
    })
      .then(parseDonationPaymentConfig)
      .then((config) => {
        if (active) setState({ config, status: "ready" });
      })
      .catch(() => {
        if (active) setState({ config: null, status: "error" });
      })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [attempt]);

  const retry = () => {
    setState({ config: null, status: "loading" });
    setAttempt((current) => current + 1);
  };

  return {
    ...state,
    canPay: state.status === "ready" && canInitiateDonationPayment(state.config),
    retry,
  };
}
