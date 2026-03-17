import { motion } from "framer-motion";

const tips = [
  {
    id: 1,
    title: "Chọn ngày lành tháng tốt",
    desc: "Hãy xem lịch âm và chọn ngày hoàng đạo. Tránh tháng 7 âm lịch nhé!",
    emoji: "📅",
    rotate: -2,
  },
  {
    id: 2,
    title: "Số tráp phải lẻ",
    desc: "Theo phong tục, số tráp ăn hỏi phải là số lẻ: 5, 7, 9 hoặc 11 tráp.",
    emoji: "🎁",
    rotate: 1,
  },
  {
    id: 3,
    title: "Chuẩn bị phong bì đỏ",
    desc: "Phong bì tiền mừng là truyền thống. Nhớ chuẩn bị đủ cho cả hai bên.",
    emoji: "🧧",
    rotate: -1.5,
  },
  {
    id: 4,
    title: "Thiệp cưới gửi sớm",
    desc: "Gửi thiệp trước ít nhất 2-3 tuần để khách sắp xếp thời gian.",
    emoji: "💌",
    rotate: 2,
  },
  {
    id: 5,
    title: "Đặt bàn dư 10%",
    desc: "Luôn đặt thêm bàn tiệc dự phòng cho khách không báo trước.",
    emoji: "🍽️",
    rotate: -1,
  },
  {
    id: 6,
    title: "Chụp ảnh pre-wedding",
    desc: "Đặt lịch chụp ảnh cưới trước 2-3 tháng để có thời gian chỉnh sửa.",
    emoji: "📸",
    rotate: 1.5,
  },
];

const WeddingTips = () => (
  <section className="min-h-screen py-20 px-4 paper-texture">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="font-handwritten text-xl text-cinnabar mb-2">Kinh nghiệm vàng</p>
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">Mẹo Hay Cho Đám Cưới</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip, i) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, y: 30, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: tip.rotate }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{ rotate: 0, scale: 1.03, y: -4 }}
            className="relative bg-paper rounded-2xl p-6 shadow-card cursor-default"
          >
            {/* Tape */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-5 bg-gold-light/70 rounded-sm rotate-[-1deg]" />
            <span className="text-3xl mb-3 block">{tip.emoji}</span>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{tip.title}</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center font-handwritten text-lg text-muted-foreground mt-16"
      >
        "Đám cưới hoàn hảo nhất là đám cưới có tình yêu" 💕
      </motion.p>
    </div>
  </section>
);

export default WeddingTips;
