import { motion } from "framer-motion";

interface BalloonProps {
  color?: string;
  size?: number;
  className?: string;
  delay?: number;
}

const BalloonSvg = ({ color = "hsl(5, 75%, 45%)", size = 60, className = "", delay = 0 }: BalloonProps) => (
  <motion.svg
    width={size}
    height={size * 1.6}
    viewBox="0 0 60 96"
    fill="none"
    className={className}
    animate={{ y: [0, -12, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <ellipse cx="30" cy="28" rx="24" ry="28" fill={color} />
    <ellipse cx="30" cy="28" rx="24" ry="28" fill="white" opacity="0.15" />
    <ellipse cx="22" cy="18" rx="6" ry="8" fill="white" opacity="0.2" transform="rotate(-15 22 18)" />
    <polygon points="30,56 26,62 34,62" fill={color} />
    <path d="M30 62 Q32 72 28 82 Q26 88 30 96" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6" />
  </motion.svg>
);

export const BalloonCluster = ({ className = "" }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <BalloonSvg color="hsl(5, 75%, 45%)" size={50} className="absolute -left-4 top-0" delay={0} />
    <BalloonSvg color="hsl(35, 85%, 60%)" size={42} className="absolute left-6 -top-6" delay={0.5} />
    <BalloonSvg color="hsl(5, 75%, 55%)" size={38} className="absolute left-16 top-2" delay={1} />
    <BalloonSvg color="hsl(25, 70%, 50%)" size={45} className="absolute left-10 -top-12" delay={0.8} />
    <BalloonSvg color="hsl(350, 65%, 55%)" size={35} className="absolute -left-2 -top-14" delay={1.2} />
  </div>
);

export default BalloonSvg;
