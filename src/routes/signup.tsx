import { createFileRoute } from "@tanstack/react-router";
import { AuthScreen } from "@/screens/AuthScreen";

export const Route = createFileRoute("/signup")({
  component: () => <AuthScreen mode="signup" />,
});
