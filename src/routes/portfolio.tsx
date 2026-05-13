import { createFileRoute, redirect } from "@tanstack/react-router";
import { PortfolioScreen } from "@/screens/PortfolioScreen";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/portfolio")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "My Portfolio — PataFedha" },
      { name: "description", content: "Track your investments and growth in real time." },
    ],
  }),
  component: PortfolioScreen,
});
