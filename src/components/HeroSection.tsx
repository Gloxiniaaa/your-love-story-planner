import { motion } from "framer-motion";
import { BalloonCluster } from "./BalloonSvg";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden paper-texture px-4">
    {/* Background decoration */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-10 right-10 opacity-30">
        <BalloonCluster />
      </div>
      <div className="absolute bottom-20 left-10 opacity-20">
        <BalloonCluster />
      </div>
    </div>

    <div className="relative z-10 text-center max-w-3xl mx-auto">
      {/* Handwritten label */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-handwritten text-2xl text-cinnabar mb-2"
      >
        Chúng mình sắp cưới!
      </motion.p>

      {/* Couple names */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className="font-display text-6xl sm:text-7xl md:text-8xl font-bold text-foreground leading-tight mb-4"
      >
        Minh <span className="text-cinnabar">&</span> Anh
      </motion.h1>

      {/* Date */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="flex items-center justify-center gap-4 mb-8"
      >
        <div className="h-px w-16 bg-cinnabar/30" />
        <p className="font-body text-lg text-muted-foreground tracking-widest uppercase">15 · 12 · 2025</p>
        <div className="h-px w-16 bg-cinnabar/30" />
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="font-handwritten text-xl text-muted-foreground mb-10"
      >
        "Cuộc phiêu lưu vĩ đại nhất bắt đầu từ một tiếng 'Dạ'"
      </motion.p>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98, y: 2 }}
        className="bg-primary text-primary-foreground px-10 py-4 rounded-2xl shadow-button active:shadow-none active:translate-y-[2px] transition-all font-body font-semibold text-lg"
      >
        Bắt Đầu Lên Kế Hoạch ✨
      </motion.button>

      {/* Floating balloon cluster anchored to the title area */}
      <motion.div
        className="absolute -top-8 right-0 sm:right-12"
        animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <BalloonCluster />
      </motion.div>
    </div>

    {/* Polaroid photos */}
    <motion.div
      className="absolute left-4 sm:left-12 top-1/4 hidden md:block"
      initial={{ opacity: 0, rotate: -8, x: -40 }}
      animate={{ opacity: 1, rotate: -6, x: 0 }}
      transition={{ duration: 1, delay: 0.8 }}
    >
      <div className="bg-paper p-3 pb-10 rounded shadow-card rotate-[-6deg] w-44">
        <div className="w-full h-32 bg-muted rounded-sm flex items-center justify-center">
          <span className="text-4xl">💑</span>
        </div>
        <p className="font-handwritten text-sm text-center mt-2 text-muted-foreground">Ngày đầu tiên</p>
      </div>
    </motion.div>

    <motion.div
      className="absolute right-4 sm:right-16 bottom-1/4 hidden md:block"
      initial={{ opacity: 0, rotate: 5, x: 40 }}
      animate={{ opacity: 1, rotate: 4, x: 0 }}
      transition={{ duration: 1, delay: 1 }}
    >
      <div className="bg-paper p-3 pb-10 rounded shadow-card rotate-[4deg] w-44">
        <div className="w-full h-32 bg-muted rounded-sm flex items-center justify-center">
          <span className="text-4xl">💍</span>
        </div>
        <p className="font-handwritten text-sm text-center mt-2 text-muted-foreground">Lời hứa</p>
      </div>
    </motion.div>
  </section>
);

export default HeroSection;
