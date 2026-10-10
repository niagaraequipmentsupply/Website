"use client";
import { useEffect } from "react";
import { captureTouch } from "@/lib/attribution";

/** Records where this visit came from (UTM tags, click ids, referrer) so forms can carry it to the CRM. Renders nothing. */
export function Attribution() {
  useEffect(() => { captureTouch(); }, []);
  return null;
}
