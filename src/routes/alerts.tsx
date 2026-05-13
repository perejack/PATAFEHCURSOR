import { createFileRoute, redirect } from "@tanstack/react-router";
import { AlertsScreen } from "@/screens/AlertsScreen";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/alerts")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Alerts — PataFedha" },
      { name: "description", content: "Latest activity, payouts and market updates." },
    ],
  }),
  component: AlertsScreen,
});
