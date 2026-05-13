import { createFileRoute } from "@tanstack/react-router";
import { LandingScreen } from "@/screens/LandingScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PataFedha — Get Money. Kenya's #1 Micro-Investment Platform" },
      {
        name: "description",
        content:
          "Grow your money daily with PataFedha. Invest from KES 250 in M-Pesa Plus, KCB Wekeza, Safaricom Hisa and more. CBK licensed.",
      },
      { property: "og:title", content: "PataFedha — Get Money" },
      {
        property: "og:description",
        content: "Kenya's #1 micro-investment platform. Invest from KES 250.",
      },
    ],
  }),
  component: LandingScreen,
});
