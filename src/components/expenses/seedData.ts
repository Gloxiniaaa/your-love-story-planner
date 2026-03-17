import { Category } from "./types";

let _id = 1;
const id = () => String(_id++);

export const seedCategories: Category[] = [
  {
    id: id(),
    name: "Nghi thức & Lễ nghi truyền thống",
    emoji: "🏮",
    expenses: [
      { id: id(), name: "Lễ dạm ngõ (tráp, trà bánh, phong bì…)", estimateCost: 8000000, actualCost: 0, paid: false },
      { id: id(), name: "Lễ ăn hỏi (tráp 6–9–12 quả, tiền nạp tài, lễ vật…)", estimateCost: 30000000, actualCost: 0, paid: false },
      { id: id(), name: "Mâm quả cưới (trầu cau, rượu, bánh phu thê…)", estimateCost: 5000000, actualCost: 0, paid: false },
      { id: id(), name: "Đội bê tráp, người dẫn chương trình lễ ăn hỏi", estimateCost: 3000000, actualCost: 0, paid: false },
      { id: id(), name: "Phong bì lễ gia tiên, lễ bái tổ tiên", estimateCost: 2000000, actualCost: 0, paid: false },
      { id: id(), name: "Trang phục lễ gia tiên (áo dài, vest)", estimateCost: 10000000, actualCost: 0, paid: false },
    ],
  },
  {
    id: id(),
    name: "Trang phục cưới & Làm đẹp",
    emoji: "👗",
    expenses: [
      { id: id(), name: "Áo cưới / Váy cưới (mua hoặc thuê)", estimateCost: 15000000, actualCost: 0, paid: false },
      { id: id(), name: "Áo dài cưới (truyền thống)", estimateCost: 8000000, actualCost: 0, paid: false },
      { id: id(), name: "Vest / Suit chú rể", estimateCost: 10000000, actualCost: 0, paid: false },
      { id: id(), name: "Trang phục cho cha mẹ hai bên", estimateCost: 12000000, actualCost: 0, paid: false },
      { id: id(), name: "Trang điểm & làm tóc cô dâu", estimateCost: 5000000, actualCost: 0, paid: false },
      { id: id(), name: "Trang điểm & làm tóc cho mẹ", estimateCost: 2000000, actualCost: 0, paid: false },
      { id: id(), name: "Phụ kiện (nhẫn, vòng cổ, khuyên tai, trâm…)", estimateCost: 25000000, actualCost: 0, paid: false },
      { id: id(), name: "Giày cưới, tất, đồ lót định hình…", estimateCost: 3000000, actualCost: 0, paid: false },
    ],
  },
  {
    id: id(),
    name: "Chụp ảnh & Quay phim",
    emoji: "📸",
    expenses: [
      { id: id(), name: "Chụp ảnh cưới pre-wedding", estimateCost: 15000000, actualCost: 0, paid: false },
      { id: id(), name: "Chụp ảnh ngày cưới (lễ gia tiên + tiệc)", estimateCost: 8000000, actualCost: 0, paid: false },
      { id: id(), name: "Quay phim trọn gói (highlight + full)", estimateCost: 12000000, actualCost: 0, paid: false },
      { id: id(), name: "Album ảnh in, USB phim, ảnh phóng lớn", estimateCost: 5000000, actualCost: 0, paid: false },
      { id: id(), name: "Drone quay flycam", estimateCost: 3000000, actualCost: 0, paid: false },
    ],
  },
  {
    id: id(),
    name: "Địa điểm & Tiệc cưới",
    emoji: "🏛️",
    expenses: [
      { id: id(), name: "Thuê nhà hàng / trung tâm tiệc cưới", estimateCost: 20000000, actualCost: 0, paid: false },
      { id: id(), name: "Phí bàn tiệc (ăn + đồ uống)", estimateCost: 150000000, actualCost: 0, paid: false },
      { id: id(), name: "Phí đồ uống (rượu, bia, nước ngọt…)", estimateCost: 20000000, actualCost: 0, paid: false },
      { id: id(), name: "Phí phục vụ, setup bàn tiệc", estimateCost: 5000000, actualCost: 0, paid: false },
      { id: id(), name: "Phí thuê sảnh riêng / khu vực chụp ảnh", estimateCost: 10000000, actualCost: 0, paid: false },
      { id: id(), name: "Tiệc nhà trai / nhà gái (nếu tổ chức riêng)", estimateCost: 30000000, actualCost: 0, paid: false },
    ],
  },
  {
    id: id(),
    name: "Trang trí & Hoa cưới",
    emoji: "💐",
    expenses: [
      { id: id(), name: "Trang trí backdrop sân khấu", estimateCost: 10000000, actualCost: 0, paid: false },
      { id: id(), name: "Trang trí bàn tiệc, lối đi, cổng hoa", estimateCost: 8000000, actualCost: 0, paid: false },
      { id: id(), name: "Hoa cầm tay cô dâu", estimateCost: 2000000, actualCost: 0, paid: false },
      { id: id(), name: "Hoa cài áo cho chú rể & phụ huynh", estimateCost: 1000000, actualCost: 0, paid: false },
      { id: id(), name: "Hoa bàn thờ gia tiên, bàn lễ", estimateCost: 1500000, actualCost: 0, paid: false },
      { id: id(), name: "Phụ kiện trang trí (đèn, rèm, nến…)", estimateCost: 5000000, actualCost: 0, paid: false },
    ],
  },
  {
    id: id(),
    name: "Thiệp mời & In ấn",
    emoji: "💌",
    expenses: [
      { id: id(), name: "Thiệp cưới in (thiết kế + in)", estimateCost: 5000000, actualCost: 0, paid: false },
      { id: id(), name: "Thiệp cảm ơn / phong bì mừng cưới", estimateCost: 2000000, actualCost: 0, paid: false },
      { id: id(), name: "Menu tiệc in", estimateCost: 1000000, actualCost: 0, paid: false },
      { id: id(), name: "Bảng tên bàn, bảng chỉ dẫn", estimateCost: 1500000, actualCost: 0, paid: false },
      { id: id(), name: "Banner, standee, backdrop in", estimateCost: 3000000, actualCost: 0, paid: false },
    ],
  },
  {
    id: id(),
    name: "Âm thanh & Ánh sáng & MC",
    emoji: "🎤",
    expenses: [
      { id: id(), name: "Thuê DJ / ban nhạc sống", estimateCost: 8000000, actualCost: 0, paid: false },
      { id: id(), name: "MC dẫn chương trình ngày cưới", estimateCost: 5000000, actualCost: 0, paid: false },
      { id: id(), name: "Âm thanh, ánh sáng, màn hình LED", estimateCost: 10000000, actualCost: 0, paid: false },
      { id: id(), name: "Máy chiếu slideshow ảnh cưới", estimateCost: 2000000, actualCost: 0, paid: false },
      { id: id(), name: "Hiệu ứng khói, pháo hoa lạnh, bong bóng…", estimateCost: 3000000, actualCost: 0, paid: false },
    ],
  },
  {
    id: id(),
    name: "Xe đưa đón & Di chuyển",
    emoji: "🚗",
    expenses: [
      { id: id(), name: "Xe hoa (xe sang hoặc xe đời mới)", estimateCost: 5000000, actualCost: 0, paid: false },
      { id: id(), name: "Xe đưa đón cô dâu chú rể", estimateCost: 3000000, actualCost: 0, paid: false },
      { id: id(), name: "Xe chở đoàn nhà trai / nhà gái", estimateCost: 5000000, actualCost: 0, paid: false },
      { id: id(), name: "Xe đưa đón khách VIP", estimateCost: 2000000, actualCost: 0, paid: false },
    ],
  },
  {
    id: id(),
    name: "Quà tặng & Phong bì",
    emoji: "🎁",
    expenses: [
      { id: id(), name: "Phong bì mừng cho MC, nhiếp ảnh, trang trí…", estimateCost: 5000000, actualCost: 0, paid: false },
      { id: id(), name: "Quà cảm ơn khách mời (hộp quà nhỏ, socola…)", estimateCost: 8000000, actualCost: 0, paid: false },
      { id: id(), name: "Quà cho phù dâu, phù rể", estimateCost: 3000000, actualCost: 0, paid: false },
      { id: id(), name: "Quà biếu hai họ (nếu có phong tục)", estimateCost: 2000000, actualCost: 0, paid: false },
    ],
  },
  {
    id: id(),
    name: "Khác (phát sinh thường gặp)",
    emoji: "📋",
    expenses: [
      { id: id(), name: "Vé máy bay / khách sạn (nếu cưới xa quê)", estimateCost: 10000000, actualCost: 0, paid: false },
      { id: id(), name: "Ăn uống thử món trước tiệc", estimateCost: 2000000, actualCost: 0, paid: false },
      { id: id(), name: "Chi phí phát sinh (thời tiết, thêm bàn…)", estimateCost: 10000000, actualCost: 0, paid: false },
      { id: id(), name: "Bảo hiểm đám cưới", estimateCost: 2000000, actualCost: 0, paid: false },
      { id: id(), name: "Chi phí sau cưới (trăng mật, tiệc cảm ơn…)", estimateCost: 15000000, actualCost: 0, paid: false },
    ],
  },
];
