import { createFileRoute, redirect } from "@tanstack/react-router";
import { MyHoldingScreen } from "@/screens/MyHoldingScreen";
import { getCurrentUser } from "@/lib/auth";

export const Route = createFileRoute("/my/$productId")({
  beforeLoad: async () => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "My Investment — PataFedha" },
      { name: "description", content: "Live performance of your investment, growing every second." },
    ],
  }),
  component: MyHoldingScreen,
});
