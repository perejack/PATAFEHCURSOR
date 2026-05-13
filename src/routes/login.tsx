import { createFileRoute } from "@tanstack/react-router";
import { AuthScreen } from "@/screens/AuthScreen";

export const Route = createFileRoute("/login")({
  component: () => <AuthScreen mode="login" />,
});
