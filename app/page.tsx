import { ProductFamily } from "@/components/family/product-family";

export const revalidate = 3600;

export default function Home() {
  return <ProductFamily />;
}
