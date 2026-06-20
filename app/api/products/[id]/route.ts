import type { NextRequest } from "next/server";
import { getProductById, getRelatedProducts } from "@/lib/products";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/products/[id]">,
) {
  const { id } = await ctx.params;
  const product = getProductById(id);

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json({
    product,
    related: getRelatedProducts(product, 8),
  });
}
