
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ljnslfxrggmhbfxsqiny.supabase.co",
  "sb_publishable_hXbowr91W8LqXsBw7xovew__kxMctfS" // use service role for seeding
);

const products = [
  { name: "Wireless Headphones", description: "High-quality sound experience", price: 89.99 },
  { name: "Smart Watch", description: "Track your fitness and stay connected", price: 199.99 },
  { name: "Coffee Maker", description: "Brew perfect coffee every morning", price: 49.99 },
];

const seed = async () => {
  const { data, error } = await supabase
    .from("products")
    .insert(products)
    .select();

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Seeded:", data);
  }
};

seed();