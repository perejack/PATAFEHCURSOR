import { createFileRoute, redirect } from "@tanstack/react-router";
import { HomeScreen } from "@/screens/HomeScreen";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/app")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Dashboard — PataFedha" },
      { name: "description", content: "Your PataFedha dashboard: portfolio, live earnings, and investments." },
    ],
  }),
  component: HomeScreen,
});
