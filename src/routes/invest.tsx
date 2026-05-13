import { createFileRoute, redirect } from "@tanstack/react-router";
import { InvestScreen } from "@/screens/InvestScreen";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/invest")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Invest — PataFedha" },
      { name: "description", content: "Choose your investment from KES 250. M-Pesa Plus, KCB Wekeza, Equity Jijengee and more." },
    ],
  }),
  component: InvestScreen,
});
