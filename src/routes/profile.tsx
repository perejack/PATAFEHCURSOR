import { createFileRoute, redirect } from "@tanstack/react-router";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/profile")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Profile — PataFedha" },
      { name: "description", content: "Your account and referrals." },
    ],
  }),
  component: ProfileScreen,
});
