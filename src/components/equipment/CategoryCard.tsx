"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { track } from "@/lib/analytics";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/inventory/${category.slug}`}
      onClick={() => track({ name: "category_click", category: category.slug })}
      className="group block h-full rounded-card border border-line bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-electric hover:shadow-lift"
    >
      <EquipmentImage image={category.image} kind={category.slug} alt={category.name} />
      <h3 className="display mt-4 text-center text-xl text-charcoal">{category.shortName}</h3>
      <p className="mt-1 flex items-center justify-center gap-1 text-sm font-semibold text-navy group-hover:text-electric">
        View Inventory <ArrowRight className="size-4" aria-hidden />
      </p>
    </Link>
  );
}
