import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast({ title: "Vui lòng điền đầy đủ thông tin", variant: "destructive" });
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast({ title: "Mật khẩu không khớp", variant: "destructive" });
      return;
    }

    // TODO: connect to backend
    toast({ title: isLogin ? "Đăng nhập thành công! 🎉" : "Đăng ký thành công! 🎉" });
    navigate("/");
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 paper-texture">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Heart className="w-8 h-8 text-primary mx-auto mb-3" />
          <p className="font-handwritten text-xl text-cinnabar mb-1">Chào mừng bạn</p>
          <h1 className="font-display text-4xl font-bold text-foreground">
            {isLogin ? "Đăng Nhập" : "Đăng Ký"}
          </h1>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          whileHover={{ rotate: 0, scale: 1.01 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative bg-paper rounded-2xl p-8 shadow-card"
        >
          {/* Tape */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-gold-light/70 rounded-sm rotate-[-2deg]" />

          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-display text-sm font-semibold text-foreground">
                Tên đăng nhập
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background/50 border-border font-body"
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-display text-sm font-semibold text-foreground">
                Mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-border font-body pr-10"
                  maxLength={100}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label htmlFor="confirmPassword" className="font-display text-sm font-semibold text-foreground">
                    Xác nhận mật khẩu
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-background/50 border-border font-body"
                    maxLength={100}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              className="w-full font-display text-base font-bold rounded-full shadow-button active:translate-y-1 active:shadow-none transition-all"
              size="lg"
            >
              {isLogin ? "Đăng Nhập ✨" : "Đăng Ký ✨"}
            </Button>
          </form>
        </motion.div>

        {/* Toggle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center font-body text-sm text-muted-foreground mt-8"
        >
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setConfirmPassword("");
            }}
            className="font-semibold text-primary hover:underline underline-offset-4 transition-colors"
          >
            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </motion.p>
      </div>
    </section>
  );
};

export default Auth;
