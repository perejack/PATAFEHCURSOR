import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProductDetailScreen } from "@/screens/ProductDetailScreen";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/invest/$productId")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/login" });
  },
  component: ProductDetailScreen,
});
