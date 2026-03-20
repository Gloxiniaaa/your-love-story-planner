import { motion } from "framer-motion";
import { Heart, Users, Calendar, Wallet, Lightbulb, Camera } from "lucide-react";

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: "home", label: "Trang Chủ", icon: Heart },
  { id: "milestones", label: "Cột Mốc", icon: Calendar },
  { id: "guests", label: "Khách Mời", icon: Users },
  { id: "photos", label: "Ảnh Cưới", icon: Camera },
  { id: "expenses", label: "Chi Phí", icon: Wallet },
  { id: "tips", label: "Mẹo Hay", icon: Lightbulb },
];

const Navigation = ({ activeSection, onNavigate }: NavigationProps) => (
  <motion.nav
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-paper/90 backdrop-blur-md rounded-2xl shadow-warm px-2 py-2 flex gap-1"
    style={{ willChange: "transform" }}
  >
    {navItems.map((item) => {
      const Icon = item.icon;
      const isActive = activeSection === item.id;
      return (
        <motion.button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-colors ${
            isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon size={20} />
          <span className="text-[10px] font-body font-medium">{item.label}</span>
        </motion.button>
      );
    })}
  </motion.nav>
);

export default Navigation;
