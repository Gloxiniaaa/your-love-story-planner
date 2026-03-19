import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { login, register } from "@/api/Auth/api";

type Mode = "login" | "register";

function useModeFromUrl(): [Mode, (m: Mode) => void] {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = useMemo<Mode>(() => {
    const p = new URLSearchParams(location.search);
    return p.get("mode") === "register" ? "register" : "login";
  }, [location.search]);

  const setMode = (m: Mode) => {
    const p = new URLSearchParams(location.search);
    p.set("mode", m);
    navigate({ pathname: "/auth", search: p.toString() }, { replace: true });
  };

  return [mode, setMode];
}

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [mode, setMode] = useModeFromUrl();
  const redirectTo = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get("redirect") || "/";
  }, [location.search]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const sessionExpired = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return p.get("session_expired") === "true";
  }, [location.search]);

  const canSubmit = username.trim().length > 0 && password.trim().length > 0 && !busy;

  const onSubmit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    try {
      if (mode === "register") {
        await register({ username: username.trim(), password });
        toast({
          title: "Tạo tài khoản thành công",
          description: "Bạn có thể đăng nhập ngay bây giờ.",
        });
        setMode("login");
        setPassword("");
        return;
      }

      const tokens = await login({ username: username.trim(), password });
      localStorage.setItem("access_token", tokens.accessToken);
      localStorage.setItem("refresh_token", tokens.refreshToken);
      // toast({
      //   title: "Đăng nhập thành công",
      //   description: "Chào mừng bạn quay lại.",
      // });
      navigate(redirectTo, { replace: true });
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.title ||
        e?.message ||
        "Có lỗi xảy ra, vui lòng thử lại.";
      toast({
        variant: "destructive",
        title: mode === "register" ? "Đăng ký thất bại" : "Đăng nhập thất bại",
        description: String(msg),
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen paper-texture flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-paper/90 backdrop-blur-sm rounded-3xl shadow-warm p-6 sm:p-8"
      >
        <div className="text-center mb-6">
          <p className="font-handwritten text-xl text-cinnabar mb-2">
            {mode === "register" ? "Bắt đầu hành trình" : "Chào mừng trở lại"}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            {mode === "register" ? "Tạo tài khoản" : "Đăng nhập"}
          </h1>
          {sessionExpired && (
            <p className="font-body text-sm text-destructive mt-3">
              Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 bg-muted rounded-2xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-body font-semibold transition-colors ${
              mode === "login" ? "bg-paper shadow-card text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-body font-semibold transition-colors ${
              mode === "register"
                ? "bg-paper shadow-card text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Đăng ký
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-body text-sm text-muted-foreground mb-1 block">Tài khoản</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
          </div>
          <div>
            <label className="font-body text-sm text-muted-foreground mb-1 block">Mật khẩu</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              onKeyDown={(e) => {
                if (e.key === "Enter") onSubmit();
              }}
            />
          </div>

          <Button className="w-full rounded-2xl" onClick={onSubmit} disabled={!canSubmit}>
            {busy ? "Đang xử lý…" : mode === "register" ? "Tạo tài khoản" : "Đăng nhập"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/", { replace: true })}
              className="font-body text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
            >
              Quay về trang chính
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;

