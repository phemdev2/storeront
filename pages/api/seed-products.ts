// /pages/api/seed-products.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";
import { sampleProducts } from "@/lib/sampleProducts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { data, error } = await supabase.from("products").insert(sampleProducts);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ data });
}