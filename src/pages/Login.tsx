import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  // 如果環境變數未設定，提示錯誤並跳過
  if (!kimiAuthUrl || !appID) {
    console.error("Missing OAuth configuration:", { kimiAuthUrl, appID });
    alert("OAuth 配置未設定，請檢查 .env 檔案\n需要設置：VITE_KIMI_AUTH_URL、VITE_APP_ID");
    return "#";
  }

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const navigate = useNavigate();

  // 開發模式自動跳過登入
  useEffect(() => {
    if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === "true") {
      console.log("[Dev Mode] Skipping login, redirecting to dashboard...");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              const url = getOAuthUrl();
              if (url !== "#") {
                window.location.href = url;
              }
            }}
          >
            Sign in with Kimi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
