/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Palette, Info, ChevronRight, Grid2X2, Sparkles, Filter, Camera, Upload, X, Search, MousePointer2, GitCommit, Repeat, Maximize2, Zap, Share2, MousePointerClick } from 'lucide-react';
import { useState, useMemo, useRef, ChangeEvent, useEffect } from 'react';

// --- Types ---

interface ColorScheme {
  id: string;
  name: string;
  petals: { name: string; hex: string };
  stamen: { name: string; hex: string };
  stem: { name: string; hex: string };
  category: string;
  mood: keyof typeof MOOD_MAP;
  material?: string;
  description?: string;
}

const MOOD_MAP = {
  RED: { label: 'Stimulating', hex: '#FF0000' },
  ORANGE: { label: 'Enthusiasm', hex: '#FFA500' },
  YELLOW: { label: 'Happiness', hex: '#FFFF00' },
  GREEN: { label: 'Acceptance', hex: '#008000' },
  BLUE: { label: 'Calmness', hex: '#0000FF' },
  INDIGO: { label: 'Balance', hex: '#4B0082' },
  VIOLET: { label: 'Knowledge', hex: '#EE82EE' },
  WHITE: { label: 'Pureness', hex: '#FFFFFF' },
  BLACK: { label: 'Authority', hex: '#000000' },
  BROWN: { label: 'Reliability', hex: '#A52A2A' }
};

interface ThemeGuide {
  name: string;
  palettes: string[];
}

interface EventGuide {
  category: string;
  themes: ThemeGuide[];
}

interface FlowerType {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  icon: string;
}

interface TwistingTechnique {
  id: string;
  category: string;
  name: string;
  description: string;
  visualType: 'basic' | 'lock' | 'loop' | 'pinch' | 'tulip' | 'roll' | 'bird' | 'hook' | 'air' | 'weave' | 'spiral' | 'raisin' | 'stuffing' | 'split';
}

interface CustomFlowerConfig {
  flowerTypeId: string;
  colorPaletteId: string;
}

// --- Data ---

const BASIC_FLOWER_TYPES: FlowerType[] = [
  {
    id: 'classic-5-petal',
    name: 'Classic 5-Petal Flower',
    description: 'Kiểu hoa phổ biến nhất, tạo hình từ 2 bong bóng (1 hoa, 1 cành).',
    characteristics: ['Thanh lịch', 'Dễ phối màu', 'Phù hợp mọi sự kiện'],
    icon: '✿'
  },
  {
    id: 'tulip-twist',
    name: 'Tulip Twist Bloom',
    description: 'Hoa Tulip chân thực, sử dụng kỹ thuật nút thắt giấu bên trong.',
    characteristics: ['Sang trọng', 'Nhỏ gọn', 'Thường dùng cho bó hoa cưới'],
    icon: '🌷'
  },
  {
    id: 'daisy-blossom',
    name: 'Daisy Blossom',
    description: 'Biến thể với cánh dẹp hơn, thường có 4 hoặc 6 cánh.',
    characteristics: ['Cute', 'Ngọt ngào', 'Tiệc sinh nhật trẻ em'],
    icon: '🌼'
  },
  {
    id: 'ribbon-rose',
    name: 'The Ribbon Rose',
    description: 'Hoa hồng xoắn phức tạp từ bong bóng 160 hoặc 260.',
    characteristics: ['Cao cấp', 'Tinh tế', 'Đòi hỏi kỹ thuật cao'],
    icon: '🌹'
  },
  {
    id: 'lily-trumpet',
    name: 'Lily Trumpet',
    description: 'Hoa Loa Kèn với hình dáng dài, loa rộng tạo điểm nhấn.',
    characteristics: ['Độc đáo', 'Tạo chiều cao', 'Điểm nhấn nghệ thuật'],
    icon: '⚜️'
  },
  {
    id: 'sunflower-giant',
    name: 'Giant Sunflower',
    description: 'Sử dụng bong bóng vàng cỡ lớn và nhụy nâu tạo hình bánh xe.',
    characteristics: ['Rực rỡ', 'Kích thước lớn', 'Năng lượng tích cực'],
    icon: '🌻'
  },
  {
    id: 'classic-leaf',
    name: 'Classic Leaf Twist',
    description: 'Lá bong bóng tạo hình từ kỹ thuật loop twist kinh điển.',
    characteristics: ['Nền tảng', 'Thêm sức sống', 'Tạo sự cân bằng'],
    icon: '🍃'
  },
  {
    id: 'spiral-stem',
    name: 'Spiral Stem',
    description: 'Cành hoa xoắn ốc tạo hiệu ứng chuyển động mềm mại.',
    characteristics: ['Bay bổng', 'Nghệ thuật', 'Trang trí phòng tiệc'],
    icon: '🌀'
  },
  {
    id: 'exotic-orchid',
    name: 'Exotic Orchid',
    description: 'Tạo hình kỳ công với các cánh hoa không đối xứng và nhụy dài.',
    characteristics: ['Quý phái', 'Kỹ thuật cao', 'Dành cho sự kiện cao cấp'],
    icon: '🌸'
  },
  {
    id: 'calla-lily',
    name: 'Calla Lily',
    description: 'Sử dụng bong bóng 350 hoặc 646 để tạo hình phễu đặc trưng.',
    characteristics: ['Tối giản', 'Hiện đại', 'Đường nét mượt mà'],
    icon: '🐚'
  },
  {
    id: 'bird-of-paradise',
    name: 'Bird of Paradise',
    description: 'Sự kết hợp màu sắc tương phản rực rỡ và hình dáng góc cạnh.',
    characteristics: ['Ấn tượng', 'Nhiệt đới', 'Cấu trúc mạnh mẽ'],
    icon: '🐦'
  },
  {
    id: 'lavender-sprig',
    name: 'Lavender Sprig',
    description: 'Tập hợp các cụm nhỏ màu tím trên cành xanh mảnh.',
    characteristics: ['Nhẹ nhàng', 'Hương đồng nội', 'Tạo độ dày cho bó hoa'],
    icon: '🌾'
  },
  {
    id: 'monstera-leaf',
    name: 'Monstera Leaf',
    description: 'Lá xẻ bản to, tạo hình phức tạp từ nhiều đoạn bong bóng nối nhau.',
    characteristics: ['Trendy', 'Vibe nhiệt đới', 'Điểm xanh nghệ thuật'],
    icon: '🌿'
  },
  {
    id: 'fern-foliage',
    name: 'Fern Foliage',
    description: 'Cành lá dài với nhiều lá nhỏ đối xứng, tạo sự mềm mại.',
    characteristics: ['Tự nhiên', 'Mềm mại', 'Che lấp khoảng trống'],
    icon: '🌲'
  },
  {
    id: 'baby-breath',
    name: 'Baby\'s Breath',
    description: 'Các hạt trắng nhỏ li ti xen kẽ giữa các bông hoa chính.',
    characteristics: ['Tinh khôi', 'Bổ trợ', 'Làm nổi bật hoa chính'],
    icon: '✨'
  },
  {
    id: 'poppy-red',
    name: 'Vibrant Poppy',
    description: 'Cánh hoa mỏng, bản to với tâm đen tuyền đặc trưng.',
    characteristics: ['Nổi bật', 'Rực rỡ', 'Phong cách nghệ thuật'],
    icon: '🌺'
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    description: 'Các cụm hoa nhỏ 5 cánh màu hồng nhạt trên cành nâu.',
    characteristics: ['Thanh tao', 'Nhẹ nhàng', 'Vibe Nhật Bản'],
    icon: '🌸'
  },
  {
    id: 'tropical-hibiscus',
    name: 'Tropical Hibiscus',
    description: 'Hoa dâm bụt với nhụy dài vươn ra ngoài đầy ấn tượng.',
    characteristics: ['Nhiệt đới', 'Phóng khoáng', 'Màu sắc rực rỡ'],
    icon: '🍧'
  },
  {
    id: 'lotus-sacred',
    name: 'Sacred Lotus',
    description: 'Tạo hình nhiều lớp cánh xếp chồng lên nhau hướng lên trên.',
    characteristics: ['Thanh khiết', 'Tâm linh', 'Cấu trúc đối xứng'],
    icon: '🪷'
  },
  {
    id: 'hydrangea-cluster',
    name: 'Hydrangea Cluster',
    description: 'Tập hợp hàng chục quả bóng nhỏ tạo thành một khối cầu hoa.',
    characteristics: ['Đồ sộ', 'Phức tạp', 'Làm nền cực tốt'],
    icon: '🍇'
  },
  {
    id: 'ivy-vine',
    name: 'Ivy Vine',
    description: 'Dây leo với các lá nhỏ rủ xuống mềm mại.',
    characteristics: ['Mềm mại', 'Dây leo', 'Trang trí cổng chào'],
    icon: '🍃'
  },
  {
    id: 'eucalyptus-sprig',
    name: 'Eucalyptus Sprig',
    description: 'Lá tròn màu xanh bạc xếp đối xứng trên cành thẳng.',
    characteristics: ['Hiện đại', 'Tây Âu', 'Màu sắc trung tính'],
    icon: '🌿'
  },
  {
    id: 'poinsettia-star',
    name: 'Poinsettia Star',
    description: 'Hoa trạng nguyên với các lá đỏ rực xếp hình ngôi sao.',
    characteristics: ['Lễ hội', 'Ấm áp', 'Đặc trưng Giáng sinh'],
    icon: '⭐'
  },
  {
    id: 'curly-willow',
    name: 'Curly Willow',
    description: 'Cành liễu xoắn uốn lượn tạo nét tự nhiên, hoang dã.',
    characteristics: ['Mộc mạc', 'Tự nhiên', 'Tạo đường nét dẫn dắt'],
    icon: '🌾'
  },
  {
    id: 'succulent-rosette',
    name: 'Succulent Rosette',
    description: 'Tạo hình sen đá với cánh dày, mọng nước và xếp lớp khít.',
    characteristics: ['Độc đáo', 'Bền bỉ', 'Phong cách tối giản'],
    icon: '🌵'
  },
  {
    id: 'pansy-face',
    name: 'Pansy Face',
    description: 'Sự kết hợp màu sắc độc đáo trên cùng một cánh hoa để tạo diện mạo giống khuôn mặt.',
    characteristics: ['Nghệ thuật', 'Sắc sảo', 'Thú vị'],
    icon: '🎭'
  },
  {
    id: 'magnolia-grand',
    name: 'Magnolia Grand',
    description: 'Cánh hoa trắng muốt, to bản và dày dặn, tỏa ra từ tâm hoa.',
    characteristics: ['Thanh lịch', 'Cổ điển', 'Sang trọng'],
    icon: '⚪'
  },
  {
    id: 'daffodil-trumpet',
    name: 'Daffodil Trumpet',
    description: 'Cấu trúc gồm một vòng cánh hoa và một phễu loa kèn ở giữa.',
    characteristics: ['Mùa xuân', 'Vui tươi', 'Cấu trúc độc đáo'],
    icon: '🎺'
  },
  {
    id: 'bluebell-droop',
    name: 'Bluebell Droop',
    description: 'Những bông hoa nhỏ hình chuông rủ xuống từ cành cong mềm mại.',
    characteristics: ['E lệ', 'Mềm mại', 'Phong cách hoang dã'],
    icon: '🔔'
  },
  {
    id: 'protea-king',
    name: 'King Protea',
    description: 'Loại hoa lớn nhất với cấu trúc cánh nhọn bao quanh một tâm hình cầu khổng lồ.',
    characteristics: ['Quyền lực', 'Ấn tượng mạnh', 'Tiêu điểm trung tâm'],
    icon: '👑'
  },
  {
    id: 'anemone-dark-eye',
    name: 'Anemone Dark Eye',
    description: 'Cánh hoa dẹt đơn lớp xung quanh một tâm màu đen huyền bí.',
    characteristics: ['Tương phản', 'Hiện đại', 'Nghệ thuật'],
    icon: '👁️'
  },
  {
    id: 'peony-ruffle',
    name: 'Ruffled Peony',
    description: 'Hoa mẫu đơn với vô số nếp gấp bong bóng nhỏ tạo độ phồng cực đại.',
    characteristics: ['Lộng lẫy', 'Nhiều lớp', 'Bung nở rực rỡ'],
    icon: '🪷'
  },
  {
    id: 'carnation-frill',
    name: 'Frilled Carnation',
    description: 'Sử dụng kỹ thuật "pinch twist" liên tục để tạo viền răng cưa cho cánh hoa.',
    characteristics: ['Tỉ mỉ', 'Kết cấu dày', 'Phổ biến cho bó hoa'],
    icon: '🧁'
  },
  {
    id: 'palm-frond',
    name: 'Palm Frond',
    description: 'Lá cọ bản dài với các khía lá sâu, tạo vibe bãi biển nhiệt đới.',
    characteristics: ['Kích thước lớn', 'Phóng khoáng', 'Dễ nhận diện'],
    icon: '🌴'
  },
  {
    id: 'bamboo-shoot',
    name: 'Bamboo Shoot',
    description: 'Cành thẳng có các đốt đặc trưng, mang lại cảm giác Zen thanh tịnh.',
    characteristics: ['Tối giản', 'Góc cạnh', 'Phương Đông'],
    icon: '🎍'
  },
  {
    id: 'thistle-wild',
    name: 'Wild Thistle',
    description: 'Khối cầu nhọn màu tím với các lá gai góc xung quanh.',
    characteristics: ['Góc cạnh', 'Cá tính', 'Tạo điểm nhấn lạ'],
    icon: '🎇'
  },
  {
    id: 'wheat-stalk',
    name: 'Golden Wheat',
    description: 'Các hạt bóng nhỏ xếp đối xứng trên cành dài màu vàng kim.',
    characteristics: ['Mộc mạc', 'Sung túc', 'Phụ kiện decor tuyệt vời'],
    icon: '🌾'
  },
  {
    id: 'wisteria-waterfall',
    name: 'Wisteria Waterfall',
    description: 'Chuỗi hoa rủ dài biểu tượng cho sự lãng mạn, thường dùng cho trần tiệc cưới.',
    characteristics: ['Hoành tráng', 'Mềm mại', 'Phong cách thần tiên'],
    icon: '🍇'
  },
  {
    id: 'anthurium-heart',
    name: 'Anthurium Heart',
    description: 'Hoa hồng môn với lá bắc hình trái tim bóng bẩy và nhụy vươn thẳng.',
    characteristics: ['Đồ họa', 'Mạnh mẽ', 'Vibe Hawaii'],
    icon: '❤️'
  },
  {
    id: 'iris-majestic',
    name: 'Majestic Iris',
    description: 'Cấu trúc 3 cánh rủ - 3 cánh đứng phức tạp, đòi hỏi độ chuẩn xác cao.',
    characteristics: ['Quý tộc', 'Kỳ công', 'Ý nghĩa hoàng gia'],
    icon: '🟣'
  },
  {
    id: 'snapdragon-spike',
    name: 'Snapdragon Spike',
    description: 'Dãy hoa xếp chồng dọc theo thân, tạo điểm nhấn cao cho bó hoa.',
    characteristics: ['Cao lớn', 'Đa dạng màu', 'Tạo cấu trúc tầng'],
    icon: '🐉'
  },
  {
    id: 'marigold-dense',
    name: 'Ruffled Marigold',
    description: 'Hoa vạn thọ với hàng trăm nếp gấp nhỏ, biểu tượng của sự bền bỉ.',
    characteristics: ['Dày dặn', 'Ấm áp', 'Màu sắc rực cháy'],
    icon: '🟠'
  },
  {
    id: 'maple-leaf-autumn',
    name: 'Autumn Maple',
    description: 'Lá phong với nhiều thùy nhọn, chuyển màu từ cam sang đỏ đậm.',
    characteristics: ['Mùa thu', 'Trữ tình', 'Nghệ thuật xẻ lá'],
    icon: '🍁'
  },
  {
    id: 'cactus-flower-desert',
    name: 'Desert Cactus Bloom',
    description: 'Bông hoa rực rỡ mọc ra từ thân xương rồng gai góc.',
    characteristics: ['Tương phản', 'Sống động', 'Phong cách Mexico'],
    icon: '🌵'
  },
  {
    id: 'pine-needle-sprig',
    name: 'Pine Needle Sprig',
    description: 'Cành thông với các lá kim mảnh, phụ kiện không thể thiếu cho decor mùa đông.',
    characteristics: ['Gai góc', 'Bền bỉ', 'Hơi thở phương Bắc'],
    icon: '🌲'
  },
  {
    id: 'pampas-grass-feathery',
    name: 'Feathery Pampas',
    description: 'Cỏ lau mềm mại với phần bông xù, cực kỳ phổ biến trong phong cách trang trí Boho.',
    characteristics: ['Bohemian', 'Mềm mại', 'Tông màu trung tính'],
    icon: '🌾'
  },
  {
    id: 'holly-berry',
    name: 'Holly & Berry',
    description: 'Sự kết hợp giữa lá răng cưa xanh đậm và những quả mọng đỏ tròn trịa.',
    characteristics: ['Giáng sinh', 'Tươi tắn', 'Tương phản mạnh'],
    icon: '🍒'
  },
  {
    id: 'spider-mum-exotic',
    name: 'Spider Mum',
    description: 'Bông đại đóa với hàng chục cánh hoa mảnh, dài và uốn cong ở đầu.',
    characteristics: ['Phức tạp', 'Lộng lẫy', 'Điểm sáng Á Đông'],
    icon: '🕸️'
  },
  {
    id: 'gladiolus-tower',
    name: 'Towering Gladiolus',
    description: 'Nhánh hoa cao vút với các bông hoa nở dần từ dưới lên trên.',
    characteristics: ['Hùng vĩ', 'Hướng thượng', 'Tạo độ cao'],
    icon: '🎋'
  },
  {
    id: 'forget-me-not',
    name: 'Forget-Me-Not',
    description: 'Những bông hoa nhỏ xíu màu xanh dương với tâm vàng rực rỡ.',
    characteristics: ['Nhỏ bé', 'Đáng yêu', 'Màu xanh độc đáo'],
    icon: '💙'
  },
  {
    id: 'oak-leaf-sturdy',
    name: 'Sturdy Oak',
    description: 'Lá sồi với các đường cong đặc trưng, biểu tượng của sự bền bỉ.',
    characteristics: ['Vững chãi', 'Tự nhiên', 'Phong cách rừng xanh'],
    icon: '🌳'
  },
  {
    id: 'bleeding-heart',
    name: 'Bleeding Heart',
    description: 'Chuỗi hoa hình trái tim rủ xuống đẹp mắt và đầy cảm xúc.',
    characteristics: ['Lãng mạn', 'Độc bản', 'Kỹ thuật treo'],
    icon: '💔'
  },
  {
    id: 'agave-sculptural',
    name: 'Sculptural Agave',
    description: 'Lá dày, nhọn và mọng nước xếp thành hình hoa thị lớn.',
    characteristics: ['Cứng cáp', 'Hiện đại', 'Không cần bảo trì'],
    icon: '🔱'
  }
];

const TWISTING_TECHNIQUES: TwistingTechnique[] = [
  {
    id: 'basic-twist',
    category: 'I. Nhóm kỹ thuật tạo bóng đơn',
    name: 'Basic Twist (Xoắn cơ bản)',
    description: 'Nắm một đoạn bóng và vặn xoay theo một hướng để chia bóng thành 2 phần. Đây là bước nền tảng để chia nhỏ cây bong bóng.',
    visualType: 'basic'
  },
  {
    id: 'multiple-basic-twist',
    category: 'I. Nhóm kỹ thuật tạo bóng đơn',
    name: 'Multiple Basic Twist (Xoắn chuỗi liên tiếp)',
    description: 'Vặn liên tiếp nhiều quả bóng đơn (như chuỗi xúc xích). Phải giữ quả đầu và quả cuối để không bị tuột.',
    visualType: 'basic'
  },
  {
    id: 'beaded-twist',
    category: 'I. Nhóm kỹ thuật tạo bóng đơn',
    name: 'Beaded Twist (Xoắn chuỗi hạt tiểu)',
    description: 'Tạo hàng loạt các quả bóng tròn cực nhỏ liên tiếp nhau, thường dùng để trang trí đường viền hoặc làm chuỗi vòng cổ cho nhân vật.',
    visualType: 'basic'
  },
  {
    id: 'lock-twist',
    category: 'II. Nhóm kỹ thuật khóa phom',
    name: 'Lock Twist (Xoắn khóa)',
    description: 'Vặn 2 quả bóng đơn liên tiếp, gập chúng lại rồi xoắn chung 2 mối vặn ở đầu và đuôi với nhau. Dùng để khóa tai hoặc chân động vật.',
    visualType: 'lock'
  },
  {
    id: 'loop-twist',
    category: 'II. Nhóm kỹ thuật khóa phom',
    name: 'Loop / Fold Twist (Xoắn vòng/Cánh hoa)',
    description: 'Gập một đoạn bóng dài thành hình chữ C rồi xoắn khóa mối giao nhau lại. Thường dùng làm cánh hoa hoặc tai thỏ.',
    visualType: 'loop'
  },
  {
    id: 'pinch-twist',
    category: 'III. Nhóm kỹ thuật nâng cao',
    name: 'Pinch / Ear Twist (Xoắn bóp/Xoắn tai)',
    description: 'Vặn một quả bóng tròn nhỏ, kéo nhẹ nó tách ra khỏi thân rồi xoắn tròn quanh trục chính nó. Dùng bẻ góc vuông hoặc làm đài hoa.',
    visualType: 'pinch'
  },
  {
    id: 'side-pinch-twist',
    category: 'III. Nhóm kỹ thuật nâng cao',
    name: 'Side Pinch Twist (Xoắn bóp cạnh)',
    description: 'Một biến thể của Pinch Twist nhưng được thực hiện ở mặt bên của mối nối, giúp tạo ra các góc xoay linh hoạt hơn cho các chi tiết nhỏ.',
    visualType: 'pinch'
  },
  {
    id: 'split-twist',
    category: 'III. Nhóm kỹ thuật nâng cao',
    name: 'Split Twist (Xoắn chẻ)',
    description: 'Chia một quả bóng đơn đã vặn sẵn thành hai phần bằng nhau bằng cách bóp ở giữa và xoắn ngược lại. Dùng tạo hình khớp nối đối xứng.',
    visualType: 'split'
  },
  {
    id: 'tulip-twist',
    category: 'III. Nhóm kỹ thuật nâng cao',
    name: 'Tulip / Apple Twist (Xoắn nhét tâm)',
    description: 'Đẩy nút thắt vào sâu bên trong quả bóng, bóp chặt từ bên ngoài rồi vặn xoắn để khóa lại. Tạo hình quả táo hoặc đầu hoa tulip.',
    visualType: 'tulip'
  },
  {
    id: 'roll-through',
    category: 'III. Nhóm kỹ thuật nâng cao',
    name: 'Roll-Through (Xoắn luồn qua tâm)',
    description: 'Đưa một quả bóng đơn ấn xuyên qua khoảng trống giữa hai quả bóng khác để khóa chặt phom và thay đổi vị trí bộ phận.',
    visualType: 'roll'
  },
  {
    id: 'bird-body-twist',
    category: 'III. Nhóm kỹ thuật nâng cao',
    name: 'Bird Body Twist (Xoắn thân chim)',
    description: 'Vặn 3 quả bóng đơn dài bằng nhau, sau đó luồn quả thứ 3 vào giữa khoảng của quả 1 và 2 để tạo khối thân 3 cạnh dày dặn.',
    visualType: 'bird'
  },
  {
    id: 'hook-twist',
    category: 'III. Nhóm kỹ thuật nâng cao',
    name: 'Hook / S-Twist (Xoắn tạo độ cong)',
    description: 'Bóp đẩy hơi kết hợp vuốt mạnh để uốn cong thanh bóng đứng thẳng thành hình dấu hỏi (?), dùng làm đuôi hoặc cổ thiên nga.',
    visualType: 'hook'
  },
  {
    id: 'raisin-twist',
    category: 'III. Nhóm kỹ thuật nâng cao',
    name: 'Raisin Twist (Xoắn hạt bí / Xoắn hạt nhét)',
    description: 'Sử dụng một nút thắt bóng cũ hoặc hạt nhỏ bỏ vào trong bóng, sau đó bóp lấy hạt đó từ bên ngoài và vặn để tạo điểm nối cố định.',
    visualType: 'raisin'
  },
  {
    id: 'basket-weave',
    category: 'V. Nhóm kỹ thuật dệt & Phối đa bóng',
    name: 'Basket Weave (Dệt giỏ)',
    description: 'Đan xen kẽ nhiều thanh bóng đơn lại với nhau tạo thành bề mặt phẳng hoặc cong, thường dùng làm giỏ hoa hoặc tường bong bóng.',
    visualType: 'weave'
  },
  {
    id: 'braiding',
    category: 'V. Nhóm kỹ thuật dệt & Phối đa bóng',
    name: 'Braiding (Tết bóng)',
    description: 'Kết hợp 3 hoặc 4 quả bóng đơn để tết lại như tết tóc, tạo nên các thanh bóng dày, chịu lực tốt và có họa tiết xoắn bắt mắt.',
    visualType: 'weave'
  },
  {
    id: 'spiral-twist',
    category: 'V. Nhóm kỹ thuật dệt & Phối đa bóng',
    name: 'Spiral / Helix Twist (Xoắn ốc)',
    description: 'Quấn hai hoặc nhiều thanh bóng quanh nhau hoặc quanh một trục để tạo hình lò xo hoặc cột trang trí xoắn lượn.',
    visualType: 'spiral'
  },
  {
    id: 'double-stuffing',
    category: 'VI. Nhóm kỹ thuật lồng bóng',
    name: 'Double Stuffing (Lồng bóng đôi)',
    description: 'Lồng một quả bóng vào trong quả bóng khác (thường là khác màu) để tạo ra các tông màu tùy chỉnh, độc bản và tăng độ bền.',
    visualType: 'stuffing'
  },
  {
    id: 'gumball-stuffing',
    category: 'VI. Nhóm kỹ thuật lồng bóng',
    name: 'Gumball Stuffing (Lồng bóng trang trí)',
    description: 'Đưa các quả bóng nhỏ, kim tuyến hoặc phụ kiện vào trong một quả bóng trong suốt lớn hơn để tạo hiệu ứng thị giác sang trọng.',
    visualType: 'stuffing'
  },
  {
    id: 'burping',
    category: 'VII. Nhóm kỹ thuật điều phối hơi',
    name: 'Burping (Xả hơi)',
    description: 'Hé ngón tay xả bớt một chút áp lực khí trước khi buộc nút để bóng mềm, dễ vặn hơn và giảm nguy cơ nổ bóng.',
    visualType: 'air'
  },
  {
    id: 'squeeze',
    category: 'VII. Nhóm kỹ thuật điều phối hơi',
    name: 'Squeeze (Bóp mềm)',
    description: 'Dùng tay bóp dọc thân bóng để đẩy hơi về phía đuôi, giải tỏa áp lực giúp bóng không bị nổ khi thực hiện các mối vặn phức tạp.',
    visualType: 'air'
  },
  {
    id: 'marrying',
    category: 'VII. Nhóm kỹ thuật điều phối hơi',
    name: 'Marrying / Connecting (Nối bóng)',
    description: 'Kỹ thuật nối hai đầu bong bóng khác nhau lại bằng các mối vặn Pinch Twist hoặc nút thắt để tạo các tác phẩm quy mô lớn.',
    visualType: 'air'
  }
];

const PALETTES: ColorScheme[] = [
  {
    id: 'midnight-royal',
    name: 'Midnight Royal',
    petals: { name: 'Xanh Navy (Midnight)', hex: '#000080' },
    stamen: { name: 'Vàng Chrome (Gold)', hex: '#FFD700' },
    stem: { name: 'Đen (Matte Black)', hex: '#1A1A1A' },
    category: 'Royal Luxe',
    mood: 'INDIGO'
  },
  {
    id: 'vintage-rose',
    name: 'Vintage Rose',
    petals: { name: 'Hồng tro (Dusty Rose)', hex: '#C08081' },
    stamen: { name: 'Hồng gương (Rose Gold)', hex: '#B76E79' },
    stem: { name: 'Nâu gỗ (Wood)', hex: '#5D4037' },
    category: 'Vintage Dream',
    mood: 'VIOLET'
  },
  {
    id: 'golden-empire',
    name: 'Golden Empire',
    petals: { name: 'Cát vàng (Golden Sand)', hex: '#E3C16F' },
    stamen: { name: 'Vàng Chrome (Gold Chrome)', hex: '#FFD700' },
    stem: { name: 'Nâu đồng (Bronze)', hex: '#804A00' },
    category: 'Royal Luxe',
    mood: 'YELLOW'
  },
  {
    id: 'ocean-pearl',
    name: 'Ocean Pearl',
    petals: { name: 'Xanh đá (Slate Blue)', hex: '#708090' },
    stamen: { name: 'Bạc Chrome (Silver Chrome)', hex: '#C0C0C0' },
    stem: { name: 'Xanh rêu khói (Smoky Moss Green)', hex: '#4F5D4F' },
    category: 'Modern Chrome',
    mood: 'BLUE'
  },
  {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    petals: { name: 'Tím nhạt (Lavender)', hex: '#E6E6FA' },
    stamen: { name: 'Trắng ngọc trai (Pearl White)', hex: '#F0F0F0' },
    stem: { name: 'Xanh lá xám (Sage Matte)', hex: '#8A9A5B' },
    category: 'Pastel Paradise',
    mood: 'VIOLET'
  },
  {
    id: 'silver-sky',
    name: 'Silver Sky',
    petals: { name: 'Xanh da trời nhạt (Cloud Blue)', hex: '#ADD8E6' },
    stamen: { name: 'Bạc Chrome (Silver Chrome)', hex: '#C0C0C0' },
    stem: { name: 'Xám nhạt (Light Grey)', hex: '#D3D3D3' },
    category: 'Modern Chrome',
    mood: 'BLUE'
  },
  {
    id: 'champagne-glow',
    name: 'Champagne Glow',
    petals: { name: 'Kem ánh vàng (Champagne)', hex: '#F7E7CE' },
    stamen: { name: 'Trắng ngọc trai (Pearl White)', hex: '#F8F8FF' },
    stem: { name: 'Vàng nhạt (Light Yellow)', hex: '#FFFACD' },
    category: 'Royal Luxe',
    mood: 'WHITE'
  },
  {
    id: 'emerald-mist',
    name: 'Emerald Mist',
    petals: { name: 'Xanh ngọc lục bảo (Emerald)', hex: '#046307' },
    stamen: { name: 'Trắng sữa (Milky White)', hex: '#F5F5F5' },
    stem: { name: 'Vàng nhạt (Light Yellow)', hex: '#FFFACD' },
    category: 'Nature Harmony',
    mood: 'GREEN'
  },
  {
    id: 'blush-pearl',
    name: 'Blush Pearl',
    petals: { name: 'Hồng phấn (Blush Pink)', hex: '#FFB6C1' },
    stamen: { name: 'Trắng ngọc trai (Pearl White)', hex: '#FAF9F6' },
    stem: { name: 'Vàng hồng (Rose Gold)', hex: '#E0AC69' },
    category: 'Pastel Paradise',
    mood: 'WHITE'
  },
  {
    id: 'cocoa-dream',
    name: 'Cocoa Dream',
    petals: { name: 'Nâu socola (Chocolate Brown)', hex: '#4B2D1B' },
    stamen: { name: 'Kem sữa (Cream White)', hex: '#FFF5E1' },
    stem: { name: 'Vàng đồng (Bronze Gold)', hex: '#B8860B' },
    category: 'Nature Harmony',
    mood: 'BROWN'
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    petals: { name: 'Hồng pastel (Candy Pink)', hex: '#FFD1DC' },
    stamen: { name: 'Xanh pastel (Candy Blue)', hex: '#B2E2F2' },
    stem: { name: 'Trắng sữa (Milky White)', hex: '#FDF5E6' },
    category: 'Pastel Paradise',
    mood: 'VIOLET'
  },
  {
    id: 'baby-sky',
    name: 'Baby Sky',
    petals: { name: 'Xanh da trời nhạt (Baby Blue)', hex: '#87CEEB' },
    stamen: { name: 'Trắng (White)', hex: '#FFFFFF' },
    stem: { name: 'Vàng pastel (Baby Yellow)', hex: '#FFF9E3' },
    category: 'Pastel Paradise',
    mood: 'BLUE'
  },
  {
    id: 'mint-cloud',
    name: 'Mint Cloud',
    petals: { name: 'Xanh bạc hà (Mint Green)', hex: '#98FF98' },
    stamen: { name: 'Trắng (White)', hex: '#FFFFFF' },
    stem: { name: 'Vàng nhạt (Light Yellow)', hex: '#FFFDD0' },
    category: 'Pastel Paradise',
    mood: 'GREEN'
  },
  {
    id: 'peach-cream',
    name: 'Peach Cream',
    petals: { name: 'Cam pastel (Peach)', hex: '#FFDAB9' },
    stamen: { name: 'Hồng phấn (Blush Pink)', hex: '#FFC0CB' },
    stem: { name: 'Trắng ngọc trai (Pearl White)', hex: '#FFF9F0' },
    category: 'Pastel Paradise',
    mood: 'ORANGE'
  },
  {
    id: 'lilac-dream',
    name: 'Lilac Dream',
    petals: { name: 'Tím pastel (Lilac)', hex: '#D8BFD8' },
    stamen: { name: 'Trắng sữa (Milky White)', hex: '#F5F5F5' },
    stem: { name: 'Hồng nhạt (Pale Pink)', hex: '#FFE4E1' },
    category: 'Pastel Paradise',
    mood: 'VIOLET'
  },
  {
    id: 'rose-gold-luxe',
    name: 'Rose Gold Luxe',
    petals: { name: 'Hồng gương (Rose Gold)', hex: '#B76E79' },
    stamen: { name: 'Trắng ngọc trai (Pearl White)', hex: '#FDFDFD' },
    stem: { name: 'Nâu đồng (Bronze)', hex: '#CD7F32' },
    category: 'Modern Chrome',
    mood: 'ORANGE'
  },
  {
    id: 'silver-frost',
    name: 'Silver Frost',
    petals: { name: 'Bạc Chrome (Silver Chrome)', hex: '#C0C0C0' },
    stamen: { name: 'Trắng (White)', hex: '#FFFFFF' },
    stem: { name: 'Xám khói (Smoky Grey)', hex: '#4A4A4A' },
    category: 'Modern Chrome',
    mood: 'BLACK'
  },
  {
    id: 'gold-majesty',
    name: 'Gold Majesty',
    petals: { name: 'Vàng Chrome (Gold Chrome)', hex: '#FFD700' },
    stamen: { name: 'Trắng sữa (Milky White)', hex: '#FDF5E6' },
    stem: { name: 'Nâu đồng (Bronze)', hex: '#8B4513' },
    category: 'Royal Luxe',
    mood: 'YELLOW'
  },
  {
    id: 'copper-shine',
    name: 'Copper Shine',
    petals: { name: 'Đồng ánh kim (Metallic Copper)', hex: '#B87333' },
    stamen: { name: 'Kem (Cream)', hex: '#FFFDD0' },
    stem: { name: 'Nâu gỗ (Wood Brown)', hex: '#814141' },
    category: 'Modern Chrome',
    mood: 'BROWN'
  },
  {
    id: 'forest-whisper',
    name: 'Forest Whisper',
    petals: { name: 'Xanh rêu (Moss Green)', hex: '#4B5320' },
    stamen: { name: 'Nâu đất (Earthy Brown)', hex: '#5C4033' },
    stem: { name: 'Trắng ngà (Ivory White)', hex: '#FFFFF0' },
    category: 'Nature Harmony',
    mood: 'GREEN'
  },
  {
    id: 'sage-harmony',
    name: 'Sage Harmony',
    petals: { name: 'Xanh lá xám (Sage Green)', hex: '#8A9A5B' },
    stamen: { name: 'Trắng sữa (Milky White)', hex: '#F5F5F5' },
    stem: { name: 'Vàng kem (Creamy Yellow)', hex: '#FFFACD' },
    category: 'Nature Harmony',
    mood: 'GREEN'
  },
  {
    id: 'sandstone',
    name: 'Sandstone',
    petals: { name: 'Be cát (Sandstone)', hex: '#C2B280' },
    stamen: { name: 'Nâu nhạt (Tan)', hex: '#D2B48C' },
    stem: { name: 'Trắng ngọc trai (Pearl White)', hex: '#FAF9F6' },
    category: 'Nature Harmony',
    mood: 'BROWN'
  },
  {
    id: 'ruby-velvet',
    name: 'Ruby Velvet',
    petals: { name: 'Đỏ Ruby (Ruby Red)', hex: '#A50021' },
    stamen: { name: 'Vàng Chrome (Gold Chrome)', hex: '#FFD700' },
    stem: { name: 'Đen (Matte Black)', hex: '#1A1A1A' },
    category: 'Royal Luxe',
    mood: 'RED'
  },
  {
    id: 'midnight-stardust',
    name: 'Midnight Stardust',
    petals: { name: 'Tím đậm (Deep Purple)', hex: '#301934' },
    stamen: { name: 'Bạc Chrome (Silver Chrome)', hex: '#C0C0C0' },
    stem: { name: 'Đen (Matte Black)', hex: '#1A1A1A' },
    category: 'Royal Luxe',
    mood: 'INDIGO'
  },
  {
    id: 'frosty-morning',
    name: 'Frosty Morning',
    petals: { name: 'Xanh băng (Ice Blue)', hex: '#A5F2F3' },
    stamen: { name: 'Trắng (White)', hex: '#FFFFFF' },
    stem: { name: 'Bạc Chrome (Silver Chrome)', hex: '#C0C0C0' },
    category: 'Modern Chrome',
    mood: 'WHITE'
  },
  {
    id: 'autumn-gold',
    name: 'Autumn Gold',
    petals: { name: 'Cam cháy (Burnt Orange)', hex: '#CC5500' },
    stamen: { name: 'Nâu đồng (Bronze)', hex: '#CD7F32' },
    stem: { name: 'Nâu đậm (Dark Brown)', hex: '#3B2F2F' },
    category: 'Vintage Dream',
    mood: 'ORANGE'
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    petals: { name: 'Hồng anh đào (Cherry Pink)', hex: '#FFB7C5' },
    stamen: { name: 'Vàng nhạt (Soft Yellow)', hex: '#FFFACD' },
    stem: { name: 'Nâu gỗ (Wood)', hex: '#5D4037' },
    category: 'Nature Harmony',
    mood: 'WHITE'
  },
  {
    id: 'ocean-deep',
    name: 'Ocean Deep',
    petals: { name: 'Xanh cổ vịt (Dark Teal)', hex: '#00474B' },
    stamen: { name: 'Bạc Chrome (Silver Chrome)', hex: '#C0C0C0' },
    stem: { name: 'Xám đá (Slate Grey)', hex: '#708090' },
    category: 'Nature Harmony',
    mood: 'BLACK'
  },
  {
    id: 'lemon-sorbet',
    name: 'Lemon Sorbet',
    petals: { name: 'Vàng chanh (Lemon Yellow)', hex: '#FAFA33' },
    stamen: { name: 'Trắng (White)', hex: '#FFFFFF' },
    stem: { name: 'Xanh lá nhạt (Light Green)', hex: '#90EE90' },
    category: 'Pastel Paradise',
    mood: 'YELLOW'
  },
  {
    id: 'plum-luxury',
    name: 'Plum Luxury',
    petals: { name: 'Tím mận (Plum)', hex: '#8E4585' },
    stamen: { name: 'Kem (Champagne)', hex: '#F7E7CE' },
    stem: { name: 'Nâu đồng (Bronze)', hex: '#804A00' },
    category: 'Royal Luxe',
    mood: 'INDIGO'
  }
];

const EVENT_GUIDE: EventGuide[] = [
  {
    category: '💍 Cưới hỏi / Kỷ niệm',
    themes: [
      { name: 'Elegant Romance', palettes: ['Vintage Rose', 'Champagne Glow', 'Blush Pearl', 'Rose Gold Luxe'] },
      { name: 'Royal Wedding', palettes: ['Midnight Royal', 'Golden Empire', 'Ruby Velvet', 'Plum Luxury'] },
      { name: 'Garden Love', palettes: ['Lavender Mist', 'Sage Harmony', 'Cherry Blossom'] }
    ]
  },
  {
    category: '🎂 Sinh nhật / Cá nhân',
    themes: [
      { name: 'Sweet Pastel', palettes: ['Cotton Candy', 'Peach Cream', 'Lilac Dream', 'Lemon Sorbet'] },
      { name: 'Ocean Breeze', palettes: ['Baby Sky', 'Ocean Pearl', 'Frosty Morning'] },
      { name: 'Midnight Party', palettes: ['Midnight Stardust', 'Midnight Royal', 'Silver Frost'] }
    ]
  },
  {
    category: '🏢 Khai trương / Doanh nghiệp',
    themes: [
      { name: 'Golden Success', palettes: ['Golden Empire', 'Gold Majesty', 'Copper Shine'] },
      { name: 'Modern Tech', palettes: ['Silver Sky', 'Silver Frost', 'Ocean Deep'] },
      { name: 'Nature Harmony', palettes: ['Forest Whisper', 'Sandstone', 'Sage Harmony'] }
    ]
  },
  {
    category: '🎉 Lễ hội / Nghệ thuật',
    themes: [
      { name: 'Fantasy Glow', palettes: ['Emerald Mist', 'Lavender Mist', 'Midnight Stardust'] },
      { name: 'Tropical Joy', palettes: ['Mint Cloud', 'Peach Cream', 'Lemon Sorbet'] },
      { name: 'Classic Glamour', palettes: ['Midnight Royal', 'Rose Gold Luxe', 'Ruby Velvet'] },
      { name: 'Autumn Vibe', palettes: ['Autumn Gold', 'Sandstone', 'Cocoa Dream'] }
    ]
  }
];

// --- Components ---

const BalloonFlower = ({ petals, stamen, stem, scale = 1, texture = 'Matte' }: { petals: string; stamen: string; stem: string; scale?: number; texture?: string }) => {
  const petalsData = [
    { rotation: 0, x: 0, y: -45, radialAt: '50% 35%' },      // Top
    { rotation: 72, x: 42, y: -15, radialAt: '25% 35%' },    // Top Right
    { rotation: 144, x: 26, y: 35, radialAt: '35% 45%' },    // Bottom Right
    { rotation: 216, x: -26, y: 35, radialAt: '65% 45%' },   // Bottom Left
    { rotation: 288, x: -42, y: -15, radialAt: '75% 35%' },   // Top Left
  ];

  // Texture styling logic
  const getPetalStyle = (p: any) => {
    let background = `radial-gradient(circle at ${p.radialAt}, ${petals} 0%, ${petals} 40%, rgba(0,0,0,0.7) 100%)`;
    let shadow = `inset 3px 3px 12px rgba(255,255,255,0.25), 0 8px 20px rgba(0,0,0,0.5)`;
    
    if (texture === 'Chrome') {
      background = `radial-gradient(circle at ${p.radialAt}, #fff 0%, ${petals} 20%, ${petals} 60%, #000 100%)`;
      shadow = `inset 4px 4px 15px rgba(255,255,255,0.6), 0 10px 25px rgba(0,0,0,0.6)`;
    } else if (texture === 'Pastel') {
      background = `radial-gradient(circle at ${p.radialAt}, ${petals} 0%, ${petals} 60%, rgba(255,255,255,0.3) 100%)`;
      shadow = `inset 2px 2px 10px rgba(255,255,255,0.4), 0 5px 15px rgba(0,0,0,0.2)`;
    }

    return {
      backgroundColor: petals,
      transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`,
      background,
      boxShadow: shadow
    };
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center transition-all duration-300 pointer-events-none"
      style={{ 
        width: `${180 * scale}px`, 
        height: `${240 * scale}px`,
        transform: `scale(${scale})`
      }}
    >
      {/* Background Glow */}
      <div 
        className="absolute w-32 h-32 blur-3xl opacity-10 rounded-full top-1/4"
        style={{ backgroundColor: petals }}
      />
      
      {/* Flower Head */}
      <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
        {petalsData.map((p, i) => (
          <div
            key={i}
            className="absolute w-16 h-22 rounded-[100%] border border-white/5"
            style={getPetalStyle(p)}
          />
        ))}
        
        {/* Stamen (Center) */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full z-10 border border-white/20"
          style={{
            backgroundColor: stamen,
            background: `radial-gradient(circle at 35% 35%, ${stamen}, #000000aa)`,
            boxShadow: `inset 2px 2px 6px rgba(255,255,255,0.5), 0 0 20px ${stamen}55`
          }}
        />
      </div>

      {/* Stem */}
      <div 
        className="w-3 h-24 rounded-full relative"
        style={{
          backgroundColor: stem,
          background: `linear-gradient(to right, #000000aa, ${stem}, #000000aa)`,
          boxShadow: `0 2px 10px rgba(0,0,0,0.4)`
        }}
      >
        {/* Leaves */}
        <div 
          className="absolute top-6 -left-8 w-12 h-6 rounded-full rotate-[20deg]"
          style={{ 
            backgroundColor: stem,
            background: `radial-gradient(circle at 40% 40%, ${stem}, #000)`,
            boxShadow: `inset 1px 1px 4px rgba(255,255,255,0.15)`
          }}
        />
        <div 
          className="absolute top-12 -right-8 w-12 h-6 rounded-full -rotate-[20deg]"
          style={{ 
            backgroundColor: stem,
            background: `radial-gradient(circle at 60% 40%, ${stem}, #000)`,
            boxShadow: `inset -1px 1px 4px rgba(255,255,255,0.15)`
          }}
        />
      </div>
    </div>
  );
};

const ColorSwatch = ({ name, color, label }: { name: string; color: string; label: string }) => (
  <div className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-0 grow">
    <div className="flex flex-col">
      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 mb-0.5">{label}</span>
      <span className="text-xs font-serif italic text-white/80 truncate max-w-[140px]">{name}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{color.replace('#', '')}</span>
      <div 
        className="w-10 h-3 rounded-sm border border-white/10"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

const TechniqueIllustration = ({ type }: { type: string }) => {
  const getIllustration = () => {
    switch (type) {
      case 'basic':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-full text-brand-accent/40 fill-current overflow-visible">
            <motion.rect 
              x="10" y="25" width="35" height="10" rx="5" 
              initial={{ scaleX: 0.8 }} animate={{ scaleX: 1 }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <circle cx="50" cy="30" r="3" className="fill-brand-accent animate-pulse" />
            <motion.rect 
              x="55" y="25" width="35" height="10" rx="5" 
              initial={{ scaleX: 0.8 }} animate={{ scaleX: 1 }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1 }}
            />
          </svg>
        );
      case 'lock':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent/40 fill-current overflow-visible">
            <motion.path 
              d="M50 50 Q75 25 50 10 Q25 25 50 50" 
              initial={{ rotate: -5 }} animate={{ rotate: 5 }} transition={{ repeat: Infinity, duration: 2, repeatType: "mirror" }}
            />
            <motion.path 
              d="M50 50 Q75 75 50 90 Q25 75 50 50" 
              initial={{ rotate: 5 }} animate={{ rotate: -5 }} transition={{ repeat: Infinity, duration: 2, repeatType: "mirror" }}
            />
            <circle cx="50" cy="50" r="4" className="fill-brand-accent" />
          </svg>
        );
      case 'loop':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent/40 fill-current overflow-visible">
            <motion.path 
              d="M50 90 C10 90 10 10 50 10 C90 10 90 90 50 90" 
              stroke="white" strokeWidth="2" fill="none"
              strokeDasharray="4 2"
              animate={{ strokeDashoffset: [0, -6] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <path d="M50 90 C20 90 20 20 50 20 C80 20 80 90 50 90" />
            <circle cx="50" cy="90" r="4" className="fill-brand-accent" />
          </svg>
        );
      case 'pinch':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent/40 fill-current overflow-visible">
            <rect x="20" y="45" width="25" height="10" rx="5" />
            <motion.circle 
              cx="50" cy="50" r="10" 
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} transition={{ repeat: Infinity, duration: 4 }}
            />
            <rect x="55" y="45" width="25" height="10" rx="5" />
          </svg>
        );
      case 'tulip':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent/40 fill-current overflow-visible">
            <path d="M30 80 Q50 95 70 80 C85 60 85 20 50 10 C15 20 15 60 30 80" />
            <motion.circle 
              cx="50" cy="40" r="5" className="fill-white"
              animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
            />
            <rect x="48" y="75" width="4" height="20" rx="2" className="fill-brand-accent/20" />
          </svg>
        );
      case 'roll':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent/40 fill-current overflow-visible">
            <rect x="10" y="40" width="80" height="10" rx="5" className="opacity-20" />
            <rect x="10" y="55" width="80" height="10" rx="5" className="opacity-20" />
            <motion.circle 
              cx="50" cy="52.5" r="8" className="fill-brand-accent"
              animate={{ x: [-20, 20, -20] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
          </svg>
        );
      case 'bird':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent/40 fill-current overflow-visible">
            <rect x="20" y="30" width="60" height="10" rx="5" />
            <rect x="20" y="45" width="60" height="10" rx="5" />
            <rect x="20" y="60" width="60" height="10" rx="5" />
            <motion.path 
              d="M20 40 L20 70 M80 40 L80 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 2 }}
            />
          </svg>
        );
      case 'hook':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent/40 fill-current">
            <motion.path 
              d="M30 80 Q30 20 70 20" stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round"
              initial={{ pathLength: 0.8 }} animate={{ pathLength: 1 }} transition={{ repeat: Infinity, duration: 2, repeatType: "mirror" }}
            />
          </svg>
        );
      case 'air':
        return (
           <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent/40 fill-current overflow-visible">
              <motion.path 
                d="M10 50 L40 50 M60 50 L90 50" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5"
                animate={{ strokeDashoffset: [0, 10] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              <motion.circle 
                cx="50" cy="50" r="15" 
                animate={{ scale: [0.8, 1.1, 0.8] }} transition={{ repeat: Infinity, duration: 2 }}
              />
           </svg>
        );
      case 'split':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent/40 fill-current overflow-visible">
            <motion.path 
              d="M50 50 L30 30 M50 50 L70 30 M50 50 L30 70 M50 50 L70 70" 
              stroke="currentColor" strokeWidth="8" strokeLinecap="round"
              animate={{ rotate: [0, 90, 0] }} transition={{ repeat: Infinity, duration: 4 }}
            />
            <circle cx="50" cy="50" r="10" className="fill-brand-accent/20" />
          </svg>
        );
      case 'raisin':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent/40 fill-current overflow-visible">
            <rect x="20" y="40" width="60" height="20" rx="10" className="opacity-30" />
            <motion.circle 
              cx="50" cy="50" r="6" className="fill-brand-accent"
              animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }}
            />
            <path d="M45 50 L55 50 M50 45 L50 55" stroke="white" strokeWidth="2" />
          </svg>
        );
      case 'weave':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent/40 fill-current overflow-visible">
            {[0, 20, 40, 60, 80].map(x => (
              <rect key={`v-${x}`} x={x + 5} y="10" width="10" height="80" rx="5" className="opacity-20" />
            ))}
            {[20, 40, 60].map(y => (
              <motion.rect 
                key={`h-${y}`} x="10" y={y + 5} width="80" height="10" rx="5"
                initial={{ x: -10 }} animate={{ x: 0 }} transition={{ repeat: Infinity, duration: 2, repeatType: "mirror" }}
              />
            ))}
          </svg>
        );
      case 'spiral':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent/40 fill-current overflow-visible">
            <motion.path 
              d="M50 10 Q70 30 50 50 Q30 70 50 90" 
              stroke="currentColor" strokeWidth="10" fill="none" strokeLinecap="round"
              animate={{ d: ["M50 10 Q70 30 50 50 Q30 70 50 90", "M50 10 Q30 30 50 50 Q70 70 50 90"] }}
              transition={{ repeat: Infinity, duration: 2, repeatType: "mirror" }}
            />
            <motion.path 
              d="M50 10 Q30 30 50 50 Q70 70 50 90" 
              stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.3"
              animate={{ d: ["M50 10 Q30 30 50 50 Q70 70 50 90", "M50 10 Q70 30 50 50 Q30 70 50 90"] }}
              transition={{ repeat: Infinity, duration: 2, repeatType: "mirror" }}
            />
          </svg>
        );
      case 'stuffing':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent/40 fill-current overflow-visible">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" className="opacity-30" />
            <motion.circle 
              cx="50" cy="50" r="25" 
              animate={{ scale: [0.9, 1.1, 0.9] }} transition={{ repeat: Infinity, duration: 3 }}
            />
            <motion.circle 
              cx="50" cy="40" r="4" className="fill-white/40"
              animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ repeat: Infinity, duration: 2 }}
            />
          </svg>
        );
      default:
        return <Zap size={24} />;
    }
  };

  return (
    <div className="w-24 h-24 flex items-center justify-center p-4">
      {getIllustration()}
    </div>
  );
};

const TECHNIQUE_DATA: Record<string, any> = {
  'daisy-blossom': {
    name: 'Daisy Blossom',
    ratios: { petals: 45, center: 10, foliage: 45 },
    methods: [
      {
        id: 'loop-method',
        name: 'Sequential Loop Twist',
        desc: 'Tạo từng cánh đơn lẻ tuần tự. Dễ kiểm soát kích thước.',
        steps: [
          { title: 'Bơm & Xả', desc: 'Bơm bóng 260 chừa đuôi 5cm, xả hơi mềm.', visual: 'inflate' },
          { title: 'Cánh 1 & 2', desc: 'Tạo hai vòng lặp đầu tiên sát nút thắt.', visual: 'petals-2' },
          { title: 'Cánh 3 & 4', desc: 'Tiếp tục xoắn thêm hai vòng lặp đối xứng.', visual: 'petals-4' },
          { title: 'Cánh 5 & 6', desc: 'Hoàn thiện vòng 6 cánh đều nhau.', visual: 'petals-6' },
          { title: 'Xoay qua tâm', desc: 'Luồn bóng thừa qua tâm để khóa phom.', visual: 'center-lock' }
        ]
      },
      {
        id: 'chain-method',
        name: 'Chain & Fold (Gập chuỗi)',
        desc: 'Tạo chuỗi 6 bóng cơ bản rồi gập khóa. Nhanh và đồng đều.',
        steps: [
          { title: 'Chuỗi x6', desc: 'Xoắn 6 quả bóng nhỏ cơ bản (Basic Twist) liên tiếp.', visual: 'chain' },
          { title: 'Nối vòng', desc: 'Buộc đầu và cuối lại tạo thành một vòng tròn.', visual: 'ring' },
          { title: 'Gập đôi', desc: 'Gập ngang vòng tròn, chia thành 2 cụm 3 cánh.', visual: 'fold-ring' },
          { title: 'Xoắn khóa', desc: 'Vặn xoắn tại điểm giữa để tạo hình 6 cánh.', visual: 'final-twist' }
        ]
      },
      {
        id: 'pair-method',
        name: 'Parallel Pairs (Cụm đôi)',
        desc: 'Tạo 3 cụm bóng đôi rồi ghép lại. Kết cấu rất chắc chắn.',
        steps: [
          { title: 'Cụm đôi x3', desc: 'Tạo 3 cặp bóng xoắn khóa (Lock Twist) riêng biệt.', visual: 'pairs' },
          { title: 'Ghép cụm', desc: 'Xếp chồng 3 cụm chéo nhau tại tâm.', visual: 'stack' },
          { title: 'Khóa tâm', desc: 'Xoắn khóa tất cả tại giao điểm trung tâm.', visual: 'center-fix' },
          { title: 'Tinh chỉnh', desc: 'Cân đối các cánh hoa theo góc 60 độ.', visual: 'align' }
        ]
      }
    ]
  },
  'tulip-twist': {
    name: 'Tulip Twist Bloom',
    ratios: { petals: 40, center: 10, foliage: 50 },
    methods: [
      {
        id: 'apple-method',
        name: 'Apple/Tulip Twist',
        desc: 'Kỹ thuật giấu nút thắt kinh điển để tạo hình nụ hoa Tulip.',
        steps: [
          { title: 'Nút thắt thắt', desc: 'Bơm bóng và thắt nút thật sát đầu bơm.', visual: 'inflate' },
          { title: 'Nhét tâm', desc: 'Dùng ngón trỏ đẩy nút thắt sâu vào lòng bóng.', visual: 'push-in' },
          { title: 'Bóp giữ', desc: 'Tay kia bóp chặt nút thắt từ bên ngoài.', visual: 'grab-node' },
          { title: 'Xoắn khóa', desc: 'Rút ngón tay và xoắn vài vòng để khóa nút lại.', visual: 'twist-lock' }
        ]
      }
    ]
  },
  'ribbon-rose': {
    name: 'The Ribbon Rose',
    ratios: { petals: 60, center: 5, foliage: 35 },
    methods: [
      {
        id: 'petal-wrap',
        name: 'Petal Wrapping',
        desc: 'Cuộn bóng 160 quanh trục để tạo lớp cánh hồng mềm mại.',
        steps: [
          { title: 'Lõi hoa', desc: 'Tạo một quả bóng nhỏ làm tâm (Pinch Twist).', visual: 'core' },
          { title: 'Uốn cánh', desc: 'Uốn bóng cong nhẹ quanh lõi để tạo lớp đầu.', visual: 'wrap-1' },
          { title: 'Xoay trục', desc: 'Tiếp tục cuộn các lớp to dần ra ngoài.', visual: 'wrap-2' },
          { title: 'Khóa chân', desc: 'Sử dụng Pinch Twist ở cuống để cố định phom.', visual: 'lock-base' }
        ]
      }
    ]
  },
  'classic-leaf': {
    name: 'Classic Leaf Twist',
    ratios: { petals: 0, center: 0, foliage: 100 },
    methods: [
      {
        id: 'leaf-loop',
        name: 'Simple Leaf Loop',
        desc: 'Kỹ thuật tạo lá nhanh với các vòng lặp đơn.',
        steps: [
          { title: 'Vòng lặp (Loop)', desc: 'Tạo một vòng lặp dài khoảng 15cm.', visual: 'leaf-loop-svg' },
          { title: 'Bóp dẹt', desc: 'Bóp nhẹ điểm giữa vòng lặp để tạo dáng lá.', visual: 'pinch-leaf' },
          { title: 'Xoắn chân', desc: 'Xoắn khóa vào cành hoa hoặc thân chính.', visual: 'connect' }
        ]
      }
    ]
  },
  'monstera-leaf': {
    name: 'Monstera Leaf',
    ratios: { petals: 0, center: 0, foliage: 100 },
    methods: [
      {
        id: 'skeleton-method',
        name: 'Inner Skeleton',
        desc: 'Tạo khung xương cho lá Monstera bản to.',
        steps: [
          { title: 'Khung chính', desc: 'Tạo 3 Loop Twist dài xếp lớp.', visual: 'skeleton' },
          { title: 'Đan luồn', desc: 'Luồn thanh bóng phụ qua các khe để tạo độ xẻ.', visual: 'weave-inner' },
          { title: 'Siết phom', desc: 'Dùng Pinch Twist khóa các điểm nối bản to.', visual: 'secure' }
        ]
      }
    ]
  },
  'sunflower-giant': {
    name: 'Giant Sunflower',
    ratios: { petals: 50, center: 30, foliage: 20 },
    methods: [
      {
        id: 'wheel-method',
        name: 'Wheel Construction',
        desc: 'Kỹ thuật bánh xe cho hoa hướng dương khổng lồ.',
        steps: [
          { title: 'Nhụy lớn', desc: 'Tạo một vòng tròn bóng 646 màu nâu.', visual: 'ring-large' },
          { title: 'Cánh đan', desc: 'Đan các vòng lặp vàng liên tiếp quanh nhụy.', visual: 'wheel-petals' },
          { title: 'Khóa nan', desc: 'Kết nối các cánh vào khung nhụy trung tâm.', visual: 'lock-spoke' }
        ]
      }
    ]
  },
  'lily-trumpet': {
    name: 'Lily Trumpet',
    ratios: { petals: 50, center: 10, foliage: 40 },
    methods: [
      {
        id: 'trumpet-flare',
        name: 'Trumpet Flare',
        desc: 'Tạo hình loa kèn loe rộng đặc trưng.',
        steps: [
          { title: 'Thân phễu', desc: 'Bơm một phần bóng 350.', visual: 'inflate-fat' },
          { title: 'Xoắn kèn', desc: 'Thực hiện Tulip Twist cực sâu để tạo lòng kèn.', visual: 'deep-tulip' },
          { title: 'Uốn loe', desc: 'Bẻ nhẹ vành để tạo độ loe tự nhiên.', visual: 'flare-rim' }
        ]
      }
    ]
  },
  'lavender-sprig': {
    name: 'Lavender Sprig',
    ratios: { petals: 70, center: 0, foliage: 30 },
    methods: [
      {
        id: 'cluster-method',
        name: 'Beaded Clusters',
        desc: 'Tạo chuỗi hạt nhỏ mô phỏng hoa Oải Hương.',
        steps: [
          { title: 'Chuỗi hạt', desc: 'Xoắn liên tiếp các quả bóng 160 tý hon.', visual: 'tiny-beads' },
          { title: 'Gập khúc', desc: 'Gập chuỗi theo hình zích zắc dọc cành.', visual: 'zigzag' },
          { title: 'Bện cành', desc: 'Xoắn khóa vào thanh bóng xanh 160 mảnh.', visual: 'braid-stem' }
        ]
      }
    ]
  },
  'spiral-stem': {
    name: 'Spiral Stem',
    ratios: { petals: 0, center: 0, foliage: 100 },
    methods: [
      {
        id: 'helix-method',
        name: 'Helix Winding',
        desc: 'Tạo cành xoắn ốc nghệ thuật.',
        steps: [
          { title: 'Trục lõi', desc: 'Dùng một thanh bóng hoặc que làm tâm.', visual: 'core-stem' },
          { title: 'Quấn helix', desc: 'Bơm bóng và quấn quanh trục đều tay.', visual: 'winding' },
          { title: 'Định hình', desc: 'Rút trục và giữ hơi để phom xoắn ổn định.', visual: 'spiral-final' }
        ]
      }
    ]
  },
  'exotic-orchid': {
    name: 'Exotic Orchid',
    ratios: { petals: 60, center: 10, foliage: 30 },
    methods: [
      {
        id: 'asymmetric-method',
        name: 'Asymmetric Petals',
        desc: 'Kỹ thuật tạo cánh hoa Lan đa dạng phom.',
        steps: [
          { title: 'Cánh lớn', desc: 'Tạo 2 Loop Twist bản to hơi lệch.', visual: 'big-loops' },
          { title: 'Môi hoa', desc: 'Dùng Pinch Twist nhỏ màu đậm làm môi.', visual: 'orchid-lip' },
          { title: 'Nhụy dài', desc: 'Kéo dài một đoạn bóng nhỏ uốn cong.', visual: 'stamen' }
        ]
      }
    ]
  },
  'calla-lily': {
    name: 'Calla Lily',
    ratios: { petals: 50, center: 15, foliage: 35 },
    methods: [
      {
        id: 'funnel-method',
        name: 'Funnel Shape',
        desc: 'Tạo hình phễu đặc trưng của hoa Rum.',
        steps: [
          { title: 'Bóng 350', desc: 'Sử dụng bóng cỡ lớn để tạo độ vồng.', visual: 'inflate-fat' },
          { title: 'Gập phễu', desc: 'Gập bóng bao quanh nhụy vàng trung tâm.', visual: 'funnel-fold' },
          { title: 'Khóa cuống', desc: 'Xoắn khóa chặt tại gốc bằng Pinch Twist.', visual: 'lock-base' }
        ]
      }
    ]
  },
  'bird-of-paradise': {
    name: 'Bird of Paradise',
    ratios: { petals: 50, center: 20, foliage: 30 },
    methods: [
      {
        id: 'geometric-method',
        name: 'Angular Layering',
        desc: 'Xếp lớp các góc cạnh rực rỡ.',
        steps: [
          { title: 'Mào cam', desc: 'Xếp 3 đoạn bóng cam theo hình rẻ quạt.', visual: 'orange-crest' },
          { title: 'Lưỡi xanh', desc: 'Chèn đoạn bóng xanh dương nhọn phía trước.', visual: 'blue-tongue' },
          { title: 'Bệ đỡ', desc: 'Dùng bóng xanh lá bản to làm bệ đỡ.', visual: 'green-base' }
        ]
      }
    ]
  },
  'fern-foliage': {
    name: 'Fern Foliage',
    ratios: { petals: 0, center: 0, foliage: 100 },
    methods: [
      {
        id: 'spine-method',
        name: 'Symmetrical spine',
        desc: 'Tạo đối xứng dọc theo sống lá.',
        steps: [
          { title: 'Sống lá', desc: 'Một thanh bóng 160 thẳng dài.', visual: 'spine' },
          { title: 'Cặp lá', desc: 'Thêm từng cặp Loop Twist nhỏ đối xứng.', visual: 'leaf-pairs' },
          { title: 'Vuốt nhọn', desc: 'Bóp nhẹ đầu mỗi lá để tạo độ nhọn.', visual: 'sharpen' }
        ]
      }
    ]
  },
  'baby-breath': {
    name: "Baby's Breath",
    ratios: { petals: 80, center: 0, foliage: 20 },
    methods: [
      {
        id: 'bead-cloud-method',
        name: 'Cloud of Beads',
        desc: 'Tạo đám mây hạt trắng li ti.',
        steps: [
          { title: 'Chuỗi hạt trắng', desc: 'Xoắn hàng loạt hạt bóng trắng 160.', visual: 'white-beads' },
          { title: 'Chia nhánh', desc: 'Tách chuỗi thành nhiều nhánh nhỏ.', visual: 'branching' },
          { title: 'Điểm xuyết', desc: 'Cài xen kẽ vào các khe hở của bó hoa.', visual: 'insert' }
        ]
      }
    ]
  }
};

const BalloonInventoryRatio = ({ ratios }: { ratios?: { petals: number; center: number; foliage: number } }) => {
  if (!ratios) return null;
  
  return (
    <div className="space-y-4 pt-4 border-t border-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 bg-brand-accent rounded-full" />
          <h4 className="text-[11px] font-mono text-white/50 uppercase tracking-widest font-bold">Balloon Inventory Ratio</h4>
        </div>
        <span className="text-[9px] text-white/20 font-mono italic">Pinterest Source Aggregation</span>
      </div>
      
      <div className="space-y-3">
        <div className="h-6 w-full flex rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 p-1">
          {ratios.petals > 0 && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${ratios.petals}%` }}
              className="h-full bg-brand-accent rounded-l-lg relative group flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <span className="text-[8px] font-bold text-white/80 z-10 opacity-0 group-hover:opacity-100 transition-opacity">{ratios.petals}%</span>
            </motion.div>
          )}
          {ratios.center > 0 && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${ratios.center}%` }}
              className="h-full bg-yellow-400 relative group flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <span className="text-[8px] font-bold text-black/60 z-10 opacity-0 group-hover:opacity-100 transition-opacity">{ratios.center}%</span>
            </motion.div>
          )}
          {ratios.foliage > 0 && (
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${ratios.foliage}%` }}
              className="h-full bg-green-500 rounded-r-lg relative group flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <span className="text-[8px] font-bold text-white/80 z-10 opacity-0 group-hover:opacity-100 transition-opacity">{ratios.foliage}%</span>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
              <span className="text-[9px] font-mono text-white/40">Cánh hoa</span>
            </div>
            <span className="text-[12px] font-bold text-white pl-3">{ratios.petals}%</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <span className="text-[9px] font-mono text-white/40">Nhị & Lõi</span>
            </div>
            <span className="text-[12px] font-bold text-white pl-3">{ratios.center}%</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[9px] font-mono text-white/40">Cành & Lá</span>
            </div>
            <span className="text-[12px] font-bold text-white pl-3">{ratios.foliage}%</span>
          </div>
        </div>
      </div>
      
      <p className="text-[10px] text-white/20 italic leading-relaxed font-sans border-l border-white/10 pl-3">
        Thống kê dựa trên phân tích hình ảnh thực tế từ Pinterest: Giúp bạn ước tính tỉ lệ bóng màu cần mua khi làm số lượng lớn.
      </p>
    </div>
  );
};

const TechniqueStepByStep = ({ typeId }: { typeId: string }) => {
  const data = TECHNIQUE_DATA[typeId];
  if (!data) return null;

  const [activeMethod, setActiveMethod] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const currentMethod = data.methods[activeMethod];

  useEffect(() => {
    setCurrentStep(0);
  }, [activeMethod]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % currentMethod.steps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeMethod, currentMethod.steps.length]);

  const renderVisual = (type: string) => {
    const color = "currentColor";
    switch (type) {
      case 'inflate':
        return (
          <svg viewBox="0 0 100 40" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.rect x="5" y="15" height="10" rx="5" initial={{ width: 0 }} animate={{ width: 80 }} transition={{ duration: 2, repeat: Infinity }} />
          </svg>
        );
      case 'inflate-fat':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.rect x="10" y="10" width="80" height="40" rx="20" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ duration: 1.5, repeat: Infinity }} />
          </svg>
        );
      case 'loop':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.path d="M50 80 C20 80 20 20 50 20 C80 20 80 80 50 80" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, repeat: Infinity }} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
            <circle cx="50" cy="80" r="4" className="fill-white" />
          </svg>
        );
      case 'repeat-loop':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60 overflow-visible">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.path key={i} d="M50 50 C50 20 70 20 70 35 C70 50 50 50 50 50" style={{ transformOrigin: '50px 50px', rotate: angle }} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.2, duration: 0.4 }} fill="none" stroke={color} strokeWidth="4" />
            ))}
          </svg>
        );
      case 'petals-2':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-70 overflow-visible">
            {[0, 60].map((angle, i) => (
              <motion.path 
                key={i} 
                d="M50 50 C50 15 80 15 80 35 C80 55 50 50 50 50" 
                style={{ transformOrigin: '50px 50px', rotate: angle }} 
                initial={{ opacity: 0, scale: 0, rotate: angle - 20 }} 
                animate={{ opacity: 1, scale: 1, rotate: angle }} 
                transition={{ delay: i * 0.4, type: 'spring', damping: 12 }} 
                fill="none" 
                stroke={color} 
                strokeWidth="7" 
                strokeLinecap="round"
              />
            ))}
            <motion.circle cx="50" cy="50" r="5" className="fill-white shadow-xl" animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
            <rect x="48" y="50" width="4" height="30" rx="2" className="opacity-30" />
          </svg>
        );
      case 'petals-4':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-70 overflow-visible">
            {[0, 60, 120, 180].map((angle, i) => (
              <motion.path 
                key={i} 
                d="M50 50 C50 15 80 15 80 35 C80 55 50 50 50 50" 
                style={{ transformOrigin: '50px 50px', rotate: angle }} 
                initial={{ opacity: i < 2 ? 1 : 0, scale: i < 2 ? 1 : 0.5 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: i >= 2 ? (i-2) * 0.4 : 0, type: 'spring' }}
                fill="none" 
                stroke={color} 
                strokeWidth="7" 
                strokeLinecap="round"
              />
            ))}
            <motion.g animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
              <circle cx="50" cy="50" r="4" className="fill-white" />
              <path d="M45 50 L55 50 M50 45 L50 55" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </motion.g>
          </svg>
        );
      case 'petals-6':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-80 overflow-visible">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.path 
                key={i} 
                d="M50 50 C50 15 80 15 80 35 C80 55 50 50 50 50" 
                style={{ transformOrigin: '50px 50px', rotate: angle }} 
                initial={{ opacity: i < 4 ? 1 : 0, scale: i < 4 ? 1 : 0.5 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: i >= 4 ? (i-4) * 0.4 : 0, type: 'spring' }}
                fill="none" 
                stroke={color} 
                strokeWidth="8" 
                strokeLinecap="round"
              />
            ))}
            <motion.circle 
              cx="50" 
              cy="50" 
              r="7" 
              className="fill-white" 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 1, type: 'spring' }}
            />
          </svg>
        );
      case 'center-lock':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }}>
              {[0, 60, 120, 180, 240, 300].map((a, i) => (
                <path key={i} d="M50 50 C50 20 70 20 70 35 C70 50 50 50 50 50" style={{ transformOrigin: '50px 50px', rotate: a }} />
              ))}
            </motion.g>
            <motion.circle cx="50" cy="50" r="5" className="fill-white" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
          </svg>
        );
      case 'chain':
        return (
          <svg viewBox="0 0 100 40" className="w-full h-full text-brand-accent fill-current opacity-60">
            {[0, 15, 30, 45, 60, 75].map((x, i) => (
              <motion.rect key={i} x={x+2} y="15" width="12" height="10" rx="5" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.2 }} />
            ))}
          </svg>
        );
      case 'pairs':
        return (
          <svg viewBox="0 0 100 60" className="w-full h-full text-brand-accent fill-current opacity-60">
            <rect x="20" y="25" width="25" height="10" rx="5" />
            <rect x="55" y="25" width="25" height="10" rx="5" />
            <circle cx="50" cy="30" r="3" className="fill-white" />
          </svg>
        );
      case 'stack':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            {[0, 60, 120].map((a, i) => (
              <motion.g key={i} style={{ transformOrigin: '50px 50px', rotate: a }} initial={{ y: i*10 - 10 }} animate={{ y: 0 }} transition={{ duration: 1 }}>
                <rect x="20" y="45" width="25" height="10" rx="5" />
                <rect x="55" y="45" width="25" height="10" rx="5" />
              </motion.g>
            ))}
          </svg>
        );
      case 'center-fix':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.g animate={{ rotate: [0, 90, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
              {[0, 60, 120, 180, 240, 300].map((a, i) => (
                <path key={i} d="M50 50 C50 25 65 25 65 37 C65 50 50 50 50 50" style={{ transformOrigin: '50px 50px', rotate: a }} />
              ))}
            </motion.g>
          </svg>
        );
      case 'align':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            {[0, 60, 120, 180, 240, 300].map((a, i) => (
              <motion.path key={i} d="M50 50 C50 20 75 20 75 35 C75 50 50 50 50 50" style={{ transformOrigin: '50px 50px', rotate: a }} animate={{ scale: [1, 1.05, 1] }} transition={{ delay: i*0.1, repeat: Infinity }} />
            ))}
          </svg>
        );
      case 'ring':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.circle cx="50" cy="50" r="35" stroke={color} strokeWidth="8" fill="none" strokeDasharray="15 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
          </svg>
        );
      case 'ring-large':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.circle cx="50" cy="50" r="25" stroke={color} strokeWidth="15" fill="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1 }} />
          </svg>
        );
      case 'wheel-petals':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <circle cx="50" cy="50" r="20" className="opacity-20" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => (
              <motion.rect key={i} x="48" y="5" width="4" height="25" rx="2" style={{ transformOrigin: '50px 50px', rotate: a }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i*0.1 }} />
            ))}
          </svg>
        );
      case 'fold-ring':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.ellipse cx="50" cy="50" rx="40" ry="15" initial={{ ry: 40 }} animate={{ ry: 10 }} transition={{ duration: 1.5, repeat: Infinity, repeatType: 'mirror' }} fill="none" stroke={color} strokeWidth="8" />
          </svg>
        );
      case 'final-twist':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.g animate={{ scale: [0.8, 1, 0.8] }} transition={{ repeat: Infinity, duration: 2 }}>
              {[0, 60, 120, 180, 240, 300].map((a, i) => (
                <path key={i} d="M50 50 C50 25 65 25 65 37 C65 50 50 50 50 50" style={{ transformOrigin: '50px 50px', rotate: a }} />
              ))}
            </motion.g>
          </svg>
        );
      case 'push-in':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <rect x="30" y="30" width="40" height="60" rx="20" className="opacity-40" />
            <motion.circle cx="50" cy="40" r="6" animate={{ y: [0, 25, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
          </svg>
        );
      case 'deep-tulip':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <path d="M20 20 L80 20 L50 90 Z" className="opacity-30" />
            <motion.circle cx="50" cy="25" r="8" animate={{ y: [0, 50, 0] }} transition={{ repeat: Infinity, duration: 3 }} />
          </svg>
        );
      case 'grab-node':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <rect x="35" y="40" width="30" height="50" rx="15" />
            <motion.path d="M25 55 L40 55 M75 55 L60 55" stroke="white" strokeWidth="4" animate={{ x: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 1 }} />
          </svg>
        );
      case 'twist-lock':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.g animate={{ rotate: [0, 180, 360] }} transition={{ repeat: Infinity, duration: 2 }}>
              <rect x="40" y="20" width="20" height="60" rx="10" />
              <circle cx="50" cy="50" r="4" className="fill-white" />
            </motion.g>
          </svg>
        );
      case 'core':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.circle cx="50" cy="50" r="10" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, duration: 2 }} />
            <path d="M48 50 L52 50 M50 48 L50 52" stroke="white" strokeWidth="2" />
          </svg>
        );
      case 'wrap-1':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <circle cx="50" cy="50" r="10" />
            <motion.path d="M50 40 Q70 40 70 50 Q70 60 50 60" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ repeat: Infinity, duration: 1.5 }} />
          </svg>
        );
      case 'wrap-2':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <circle cx="50" cy="50" r="15" className="opacity-40" />
            <motion.path d="M50 30 Q80 30 80 50 Q80 70 50 70 Q20 70 20 50 Q20 30 50 30" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ repeat: Infinity, duration: 2 }} />
          </svg>
        );
      case 'lock-base':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <path d="M30 30 Q50 20 70 30 L50 80 Z" className="opacity-30" />
            <motion.circle cx="50" cy="80" r="8" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }} />
          </svg>
        );
      case 'leaf-loop-svg':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.ellipse cx="50" cy="50" rx="15" ry="35" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, duration: 2 }} />
          </svg>
        );
      case 'skeleton':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            {[0, 20, 40].map((y, i) => (
              <motion.rect key={i} x="30" y={20+y} width="40" height="8" rx="4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i*0.2 }} />
            ))}
          </svg>
        );
      case 'tiny-beads':
        return (
          <svg viewBox="0 0 40 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            {[0, 10, 20, 30, 40, 50, 60, 70, 80].map((y, i) => (
              <motion.circle key={i} cx="20" cy={10+y} r="4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i*0.1 }} />
            ))}
          </svg>
        );
      case 'zigzag':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.path d="M50 10 L80 30 L20 50 L80 70 L50 90" fill="none" stroke={color} strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ repeat: Infinity, duration: 3 }} />
          </svg>
        );
      case 'spine':
        return (
          <svg viewBox="0 0 40 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.rect x="18" y="10" width="4" height="80" rx="2" initial={{ height: 0 }} animate={{ height: 80 }} transition={{ duration: 1.5 }} />
          </svg>
        );
      case 'winding':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <rect x="45" y="10" width="10" height="80" rx="5" className="opacity-20" />
            <motion.path d="M50 10 Q30 20 50 30 Q70 40 50 50 Q30 60 50 70 Q70 80 50 90" fill="none" stroke={color} strokeWidth="8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ repeat: Infinity, duration: 2 }} />
          </svg>
        );
      case 'white-beads':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-white/60 fill-current">
            <motion.g animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              {[...Array(8)].map((_, i) => (
                <circle key={i} cx={20 + Math.random()*60} cy={20 + Math.random()*60} r="3" />
              ))}
            </motion.g>
          </svg>
        );
      case 'core-stem':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-white/20 fill-current">
            <rect x="48" y="10" width="4" height="80" rx="2" />
          </svg>
        );
      case 'spiral-final':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.path d="M50 10 Q30 20 50 30 Q70 40 50 50 Q30 60 50 70 Q70 80 50 90" fill="none" stroke={color} strokeWidth="10" animate={{ strokeDashoffset: [0, 100] }} transition={{ repeat: Infinity, duration: 5 }} />
          </svg>
        );
      case 'big-loops':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.ellipse cx="40" cy="50" rx="20" ry="35" rotate="10" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1 }} />
            <motion.ellipse cx="65" cy="45" rx="15" ry="30" rotate="-15" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, duration: 1 }} />
          </svg>
        );
      case 'orchid-lip':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <circle cx="50" cy="50" r="25" className="opacity-20" />
            <motion.path d="M40 60 Q50 80 60 60" fill="none" stroke={color} strokeWidth="6" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
          </svg>
        );
      case 'stamen':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <circle cx="50" cy="50" r="10" />
            <motion.path d="M50 40 Q70 20 80 40" fill="none" stroke={color} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ repeat: Infinity, duration: 2 }} />
          </svg>
        );
      case 'funnel-fold':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.path d="M50 90 L20 30 Q50 10 80 30 Z" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} stroke={color} strokeWidth="4" fill="none" />
          </svg>
        );
      case 'orange-crest':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            {[0, 20, 40].map((a, i) => (
              <motion.path key={i} d="M30 80 L50 20 L70 80" style={{ transformOrigin: '50px 80px', rotate: a-20 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i*0.2 }} />
            ))}
          </svg>
        );
      case 'blue-tongue':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-blue-400 fill-current opacity-60">
            <motion.path d="M30 60 L70 40 L40 30 Z" initial={{ x: -20 }} animate={{ x: 0 }} transition={{ duration: 1 }} />
          </svg>
        );
      case 'leaf-pairs':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <rect x="49" y="10" width="2" height="80" />
            {[20, 40, 60].map((y, i) => (
              <motion.g key={i}>
                <circle cx="35" cy={y} r="8" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i*0.2 }} />
                <circle cx="65" cy={y} r="8" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i*0.2 }} />
              </motion.g>
            ))}
          </svg>
        );
      case 'connect':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <path d="M50 10 L50 90" stroke="white" strokeWidth="2" className="opacity-20" />
            <motion.circle cx="50" cy="50" r="10" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity }} />
          </svg>
        );
      case 'green-base':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-green-500 fill-current opacity-60">
            <motion.path d="M20 70 Q50 90 80 70 L50 50 Z" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} />
          </svg>
        );
      case 'petals-2':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.path d="M50 50 L30 20 Q50 10 70 20 Z" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} />
            <motion.path d="M50 50 L30 80 Q50 90 70 80 Z" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} />
            <circle cx="50" cy="50" r="4" className="fill-white/30" />
          </svg>
        );
      case 'petals-4':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            {[0, 90, 180, 270].map((a, i) => (
              <motion.path key={i} d="M50 50 L35 25 Q50 15 65 25 Z" style={{ transformOrigin: '50px 50px', rotate: a }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i*0.15 }} />
            ))}
            <circle cx="50" cy="50" r="4" className="fill-white/30" />
          </svg>
        );
      case 'petals-6':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            {[0, 60, 120, 180, 240, 300].map((a, i) => (
              <motion.path key={i} d="M50 50 L38 28 Q50 20 62 28 Z" style={{ transformOrigin: '50px 50px', rotate: a }} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i*0.1 }} />
            ))}
            <circle cx="50" cy="50" r="4" className="fill-white/30" />
          </svg>
        );
      case 'center-lock':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <circle cx="50" cy="50" r="35" className="opacity-10 stroke-white/20" fill="none" strokeWidth="1" strokeDasharray="4 4" />
            <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }}>
              {[0, 60, 120, 180, 240, 300].map((a, i) => (
                <path key={i} d="M50 50 L40 30 Q50 22 60 30 Z" style={{ transformOrigin: '50px 50px', rotate: a }} className="opacity-40" />
              ))}
            </motion.g>
            <motion.circle cx="50" cy="50" r="12" initial={{ scale: 0 }} animate={{ scale: 1.2 }} fill="white" className="opacity-80" />
          </svg>
        );
      case 'chain':
        return (
          <svg viewBox="0 0 120 40" className="w-full h-full text-brand-accent fill-current opacity-60">
            {[0, 20, 40, 60, 80, 100].map((x, i) => (
              <motion.circle key={i} cx={10+x} cy="20" r="8" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i*0.1 }} />
            ))}
          </svg>
        );
      case 'ring':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="10 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
            <motion.path d="M50 15 L50 25 M50 75 L50 85" stroke="white" strokeWidth="2" animate={{ scaleY: [1, 1.5, 1] }} transition={{ repeat: Infinity }} />
          </svg>
        );
      case 'fold-ring':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.path d="M20 50 Q50 10 80 50 Q50 90 20 50" fill="none" stroke="currentColor" strokeWidth="8" animate={{ d: ["M20 50 Q50 10 80 50 Q50 90 20 50", "M30 50 Q50 40 70 50 Q50 60 30 50"] }} transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }} />
          </svg>
        );
      case 'pairs':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            {[0, 120, 240].map((a, i) => (
              <motion.g key={i} style={{ transformOrigin: '50px 50px', rotate: a }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.3 }}>
                <circle cx="44" cy="40" r="8" />
                <circle cx="56" cy="40" r="8" />
              </motion.g>
            ))}
          </svg>
        );
      case 'stack':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            {[0, 60, 120].map((a, i) => (
              <motion.rect key={i} x="30" y="45" width="40" height="10" rx="5" style={{ transformOrigin: '50px 50px', rotate: a }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i*0.2 }} />
            ))}
          </svg>
        );
      case 'center-fix':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.circle cx="50" cy="50" r="20" className="opacity-20" fill="none" stroke="white" strokeWidth="4" animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} />
            <circle cx="50" cy="50" r="8" />
          </svg>
        );
      case 'align':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
             {[0, 60, 120, 180, 240, 300].map((a, i) => (
              <motion.path key={i} d="M50 50 L40 20 Q50 15 60 20 Z" style={{ transformOrigin: '50px 50px', rotate: a }} animate={{ rotate: a }} transition={{ delay: i*0.1 }} />
            ))}
          </svg>
        );
      case 'final-twist':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-brand-accent fill-current opacity-60">
            <motion.g animate={{ scale: [0.9, 1.1, 0.9] }} transition={{ repeat: Infinity, duration: 2 }}>
              {[0, 60, 120, 180, 240, 300].map((a, i) => (
                <path key={i} d="M50 50 L42 25 Q50 18 58 25 Z" style={{ transformOrigin: '50px 50px', rotate: a }} />
              ))}
            </motion.g>
            <circle cx="50" cy="50" r="6" className="fill-white" />
          </svg>
        );
      default: return null;
    }
  }

  return (
    <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-accent font-bold">{data.name} Masterclass</span>
          </div>
          <span className="text-[9px] font-mono text-white/20">Method {activeMethod + 1} of {data.methods.length}</span>
        </div>
        
        {data.methods.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {data.methods.map((method: any, idx: number) => (
              <button
                key={method.id}
                onClick={() => setActiveMethod(idx)}
                className={`px-4 py-2 rounded-full font-mono text-[9px] uppercase tracking-wider transition-all whitespace-nowrap border ${
                  activeMethod === idx 
                  ? 'bg-brand-accent text-black border-brand-accent' 
                  : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
                }`}
              >
                {method.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-black/60 backdrop-blur-md rounded-2xl p-8 border border-white/10 space-y-8 shadow-2xl">
        <div className="space-y-2">
          <h4 className="text-[14px] font-sans font-bold text-white tracking-tight">{currentMethod.name}</h4>
          <p className="text-[11px] text-white/40 font-mono italic leading-relaxed">{currentMethod.desc}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-40 h-40 flex-shrink-0 bg-white/[0.03] rounded-3xl p-6 flex items-center justify-center border border-white/10 shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            {renderVisual(currentMethod.steps[currentStep].visual)}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-xl bg-brand-accent/20 text-brand-accent flex items-center justify-center text-[12px] font-mono font-black border border-brand-accent/20">
                {currentStep + 1}
              </span>
              <h5 className="text-[13px] font-mono text-white uppercase tracking-[0.2em] font-black">
                {currentMethod.steps[currentStep].title}
              </h5>
            </div>
            <p className="text-[12px] text-white/60 leading-relaxed font-sans font-medium pl-12 border-l-2 border-brand-accent/10 py-1">
              {currentMethod.steps[currentStep].desc}
            </p>
          </div>
        </div>

        <BalloonInventoryRatio ratios={data.ratios} />

        <div className="flex gap-3 pl-12">
          {currentMethod.steps.map((_: any, i: number) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-700 ease-out ${
                i === currentStep ? 'bg-brand-accent w-12 shadow-[0_0_10px_rgba(var(--brand-accent-rgb),0.5)]' : 'bg-white/5 w-3'
              }`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const GlobalBalloonStatBar = () => {
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="w-full bg-black/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 relative group">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
        {/* Left: Legend & Label */}
        <div className="flex flex-col gap-1 min-w-[200px]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-brand-accent font-black tracking-tighter uppercase">Xu hướng từ Pinterest</span>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
          </div>
          <h3 className="text-[14px] font-sans font-bold text-white tracking-tight">Hướng dẫn chuẩn bị vật liệu</h3>
        </div>

        {/* Center: The Bar */}
        <div className="flex-1 w-full space-y-2">
          <div className="h-5 w-full flex rounded-full overflow-hidden border border-white/5 bg-white/5 p-1 shadow-inner">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: '55%' }}
              className="h-full bg-gradient-to-r from-brand-accent to-pink-500 rounded-l-full relative group"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[8px] font-black text-white">PETALS (55%)</span>
              </div>
            </motion.div>
            <motion.div 
              initial={{ width: 0 }} animate={{ width: '10%' }}
              className="h-full bg-yellow-400 relative group"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[8px] font-black text-black">CENTER (10%)</span>
              </div>
            </motion.div>
            <motion.div 
              initial={{ width: 0 }} animate={{ width: '35%' }}
              className="h-full bg-green-500 rounded-r-full relative group"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[8px] font-black text-white">FOLIAGE (35%)</span>
              </div>
            </motion.div>
          </div>
          
          <div className="flex justify-between text-[9px] font-mono text-white/40 uppercase tracking-[0.1em]">
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-brand-accent/50" />
              <span>Chiến lược phân bổ màu sắc (Cánh 55% - Nhụy 10% - Cành 35%)</span>
            </div>
            <div 
              className="relative flex items-center gap-1.5 cursor-help"
              onClick={() => setShowTips(!showTips)}
              onMouseEnter={() => setShowTips(true)}
              onMouseLeave={() => setShowTips(false)}
            >
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${showTips ? 'bg-brand-accent scale-150' : 'bg-brand-accent/50'}`} />
              <span className={`transition-colors underline decoration-brand-accent/20 underline-offset-4 ${showTips ? 'text-brand-accent' : 'text-white/60'}`}>Hướng dẫn phối hợp Màu chuẩn & Chrome</span>
              
              {/* Tooltip/Popup Guidance */}
              <AnimatePresence>
                {showTips && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-80 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl z-[100] origin-top-right"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <Zap size={14} className="text-brand-accent" />
                          <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Mẹo phối hợp chuyên nghiệp</h4>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setShowTips(false); }} className="text-white/20 hover:text-white transition-colors">
                          <X size={12} />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <p className="text-[10px] text-brand-accent font-bold italic">1. Nhấn nhá bằng Chrome (Highlights)</p>
                          <p className="text-[11px] text-white/60 leading-relaxed">Sử dụng Chrome cho nhụy hoa hoặc các chi tiết nhỏ để bắt sáng, tạo vẻ sang trọng mà không làm mất phom dáng tổng thể.</p>
                        </div>
                        <div className="space-y-1 border-t border-white/5 pt-2">
                          <p className="text-[10px] text-brand-accent font-bold italic">2. Tạo chiều sâu bằng tương phản</p>
                          <p className="text-[11px] text-white/60 leading-relaxed">Kết hợp cánh hoa màu Lì (Matte) with lớp lót hoặc nhụy Chrome giúp bông hoa có chiều sâu 3D and trông "thật" hơn dưới ánh đèn sân khấu.</p>
                        </div>
                        <div className="space-y-1 border-t border-white/5 pt-2">
                          <p className="text-[10px] text-brand-accent font-bold italic">3. Quy tắc 80/20</p>
                          <p className="text-[11px] text-white/60 leading-relaxed">Nên dùng 80% bóng tiêu chuẩn để đảm bảo độ bền and giữ hơi lâu, 20% Chrome là vừa đủ để tạo sự đột phá về thẩm mỹ.</p>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t border-brand-accent/10 bg-brand-accent/5 -mx-6 -mb-6 p-4 rounded-b-2xl">
                        <p className="text-[10px] text-brand-accent/80 italic font-medium">
                          * Gợi ý: Chrome Gold kết hợp cực tốt with Matte Red hoặc White cho các dịp lễ hội.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right: Color Chips */}
        <div className="flex items-center gap-6 border-l border-white/10 pl-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-mono text-white/40 uppercase font-black tracking-widest">Pinterest Essential Standard</span>
              <span className="px-1 py-0.5 rounded-[2px] bg-red-500/10 text-red-500 text-[6px] font-black uppercase tracking-tighter border border-red-500/20">Viral</span>
            </div>
            <div className="flex gap-3">
              {[
                { color: '#FFFFFF', name: 'White' },
                { color: '#FFFF00', name: 'Yellow' },
                { color: '#22C55E', name: 'Green' },
                { color: '#F472B6', name: 'Pink' }
              ].map((c) => (
                <div key={c.name} className="flex flex-col items-center gap-1">
                  <div className="w-5 h-5 rounded-full border border-white/10 shadow-inner" style={{ backgroundColor: c.color }} />
                  <span className="text-[7px] font-mono text-white/40 uppercase">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] font-mono text-brand-accent/60 uppercase font-black tracking-widest">Pinterest Essential Chromes</span>
              <span className="px-1 py-0.5 rounded-[2px] bg-brand-accent/10 text-brand-accent text-[6px] font-black uppercase tracking-tighter border border-brand-accent/20">Trending</span>
            </div>
            <div className="flex gap-3">
              {[
                { color: '#FFD700', name: 'Gold' },
                { color: '#C0C0C0', name: 'Silver' },
                { color: '#FFB7C5', name: 'Rose' },
                { color: '#50C878', name: 'Green' }
              ].map((c) => (
                <div key={c.name} className="flex flex-col items-center gap-1">
                  <div className="w-5 h-5 rounded-full ring-2 ring-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]" style={{ backgroundColor: c.color }} />
                  <span className="text-[7px] font-mono text-white/40 uppercase">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 hidden lg:flex">
            <span className="text-[8px] font-mono text-white/40 uppercase font-black tracking-widest">Global Top Sellers</span>
            <div className="flex gap-2 text-[9px] font-bold">
              <div className="flex flex-col gap-1">
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-center">Red</span>
                <span className="text-[6px] text-white/30 uppercase text-center font-mono">Standard</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="px-2 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 text-center">Gold</span>
                <span className="text-[6px] text-brand-accent uppercase text-center font-mono font-black animate-pulse">Chrome</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="px-2 py-0.5 rounded bg-lime-500/20 text-lime-400 border border-lime-500/30 text-center">Lime</span>
                <span className="text-[6px] text-white/30 uppercase text-center font-mono">Standard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [filter, setFilter] = useState<string | null>(null);
  const [themeFilter, setThemeFilter] = useState<string[] | null>(null);
  const [randomPalette, setRandomPalette] = useState<ColorScheme | null>(null);
  const [randomBouquet, setRandomBouquet] = useState<{ flowers: (ColorScheme & { flowerTypeId: string; typeIcon: string; typeName: string })[], leaves: string[], fillers: string[] } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isBouquetSpinning, setIsBouquetSpinning] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [analyzedBouquet, setAnalyzedBouquet] = useState<ColorScheme[] | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  
  const [isEnsembleBuilderOpen, setIsEnsembleBuilderOpen] = useState(false);
  const [customBouquetConfig, setCustomBouquetConfig] = useState<CustomFlowerConfig[]>([
    { flowerTypeId: 'classic-5-petal', colorPaletteId: 'random' }
  ]);
  const [selectedLeafIds, setSelectedLeafIds] = useState<string[]>(['classic-leaf']);
  const [selectedFillerIds, setSelectedFillerIds] = useState<string[]>(['baby-breath']);
  const [ensemblePaletteId, setEnsemblePaletteId] = useState<string>('random');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const prepareImageForUpload = (file: File): Promise<{ base64Data: string; mimeType: string }> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const img = new Image();
        img.onerror = () => {
          resolve({ base64Data: dataUrl.split(',')[1], mimeType: file.type || 'image/jpeg' });
        };
        img.onload = () => {
          const maxDim = 1400;
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ base64Data: dataUrl.split(',')[1], mimeType: file.type || 'image/jpeg' });
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          resolve({ base64Data: compressed.split(',')[1], mimeType: 'image/jpeg' });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });

  const handleImageScan = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingImage(true);
    setScanError(null);
    setRandomBouquet(null);
    setRandomPalette(null);

    try {
      const { base64Data, mimeType } = await prepareImageForUpload(file);

      const response = await fetch('/api/vision-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data, mimeType }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to analyze image.');
      }

      const results = Array.isArray(payload?.flowers) ? payload.flowers : [];
      const newBouquet: ColorScheme[] = results.map((item: any, i: number) => ({
        id: `scanned-${Date.now()}-${i}`,
        name: item.name,
        petals: { name: item.material, hex: item.petal_hex },
        stamen: { name: 'Center', hex: item.stamen_hex },
        stem: { name: 'Stem', hex: item.stem_hex },
        category: 'AI Scanned',
        mood: item.mood as keyof typeof MOOD_MAP,
        material: item.material
      }));

      setAnalyzedBouquet(newBouquet);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (error) {
      console.error("AI Scan failed:", error);
      setScanError(error instanceof Error ? error.message : "Failed to analyze image. Please try again with a clearer photo.");
    } finally {
      setIsAnalyzingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const categories = ['Royal Luxe', 'Vintage Dream', 'Modern Chrome', 'Pastel Paradise', 'Nature Harmony'];

  const filteredPalettes = useMemo(() => {
    if (themeFilter) {
      return PALETTES.filter(p => themeFilter.includes(p.name));
    }
    return filter ? PALETTES.filter(p => p.category === filter) : PALETTES;
  }, [filter, themeFilter]);

  const handleShuffle = () => {
    setIsSpinning(true);
    setThemeFilter(null);
    setFilter(null);
    
    // Simulate spin and "generation"
    setTimeout(() => {
      const moods = Object.keys(MOOD_MAP) as (keyof typeof MOOD_MAP)[];
      const selectedMoodKey = moods[Math.floor(Math.random() * moods.length)];
      const mood = MOOD_MAP[selectedMoodKey];
      
      // Procedural Generation Logic
      const adjectives = ['Ethereal', 'Mystic', 'Velvet', 'Primal', 'Cosmic', 'Golden', 'Radiant', 'Silent', 'Arctic', 'Tropical'];
      const nouns = ['Echo', 'Mist', 'Aura', 'Soul', 'Pulse', 'Veil', 'Breeze', 'Anchor', 'Flux', 'Dawn'];
      
      const randomHex = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      
      const proceduralPalette: ColorScheme = {
        id: `gen-${Date.now()}`,
        name: `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`,
        petals: { name: `Primary ${mood.label}`, hex: mood.hex === '#FFFFFF' ? '#F8F8F8' : (mood.hex === '#000000' ? '#121212' : mood.hex) },
        stamen: { name: 'Magic Highlight', hex: randomHex() },
        stem: { name: 'Organic Foundation', hex: Math.random() > 0.5 ? '#1A1A1A' : '#5D4037' },
        category: 'Modern Chrome',
        mood: selectedMoodKey
      };

      setRandomPalette(proceduralPalette);
      setIsSpinning(false);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }, 1500);
  };

  const handleBouquetShuffle = () => {
    setIsBouquetSpinning(true);
    setRandomPalette(null);
    setAnalyzedBouquet(null); // Clear any previous scan
    setThemeFilter(null);
    setFilter(null);

    setTimeout(() => {
      const THEMES = [
        // 1-10
        { name: 'Floral Symphony', desc: 'Romantic, luxury, and soft', dominant: { label: 'Vintage Rose', moods: ['RED', 'BROWN'], texture: 'Pastel' }, secondary: { label: 'Champagne Glow', moods: ['YELLOW', 'WHITE'], texture: 'Chrome' }, accent: { label: 'Blush Pearl', moods: ['VIOLET', 'WHITE'], texture: 'Matte' } },
        { name: 'Midnight Velvet', desc: 'Deep, mysterious, and elegant', dominant: { label: 'Indigo Night', moods: ['INDIGO', 'BLACK'], texture: 'Matte' }, secondary: { label: 'Silver Mist', moods: ['WHITE', 'BLUE'], texture: 'Chrome' }, accent: { label: 'Neon Orchid', moods: ['VIOLET', 'RED'], texture: 'Pastel' } },
        { name: 'Forest Whisper', desc: 'Organic, fresh, and grounded', dominant: { label: 'Evergreen', moods: ['GREEN', 'BROWN'], texture: 'Matte' }, secondary: { label: 'Sunbeam', moods: ['YELLOW', 'ORANGE'], texture: 'Pastel' }, accent: { label: 'Wild Berry', moods: ['RED', 'VIOLET'], texture: 'Chrome' } },
        { name: 'Imperial Gold', desc: 'Opulent, bold, and majestic', dominant: { label: 'Royal Amber', moods: ['ORANGE', 'YELLOW'], texture: 'Chrome' }, secondary: { label: 'Pure Ivory', moods: ['WHITE', 'BROWN'], texture: 'Matte' }, accent: { label: 'Crimson Jewel', moods: ['RED', 'BLACK'], texture: 'Chrome' } },
        { name: 'Cyber Neon', desc: 'Electric, futuristic, and high-energy', dominant: { label: 'Cyber Blue', moods: ['BLUE', 'INDIGO'], texture: 'Chrome' }, secondary: { label: 'Hot Pink', moods: ['RED', 'VIOLET'], texture: 'Chrome' }, accent: { label: 'Acid Lime', moods: ['GREEN', 'YELLOW'], texture: 'Matte' } },
        { name: 'Pastel Dreamscape', desc: 'Whimsical, light, and airy', dominant: { label: 'Cotton Candy', moods: ['WHITE', 'VIOLET'], texture: 'Pastel' }, secondary: { label: 'Mint Breeze', moods: ['GREEN', 'BLUE'], texture: 'Pastel' }, accent: { label: 'Peach Sorbet', moods: ['ORANGE', 'YELLOW'], texture: 'Matte' } },
        { name: 'Autumn Harvest', desc: 'Warm, rustic, and nostalgic', dominant: { label: 'Burnt Sienna', moods: ['BROWN', 'ORANGE'], texture: 'Matte' }, secondary: { label: 'Golden Grain', moods: ['YELLOW', 'WHITE'], texture: 'Pastel' }, accent: { label: 'Cider Apple', moods: ['RED', 'BROWN'], texture: 'Chrome' } },
        { name: 'Ocean Depths', desc: 'Serene, vast, and aquatic', dominant: { label: 'Deep Abyss', moods: ['BLUE', 'BLACK'], texture: 'Matte' }, secondary: { label: 'Coral Reef', moods: ['ORANGE', 'RED'], texture: 'Pastel' }, accent: { label: 'Pearl Silver', moods: ['WHITE', 'INDIGO'], texture: 'Chrome' } },
        { name: 'Desert Sunset', desc: 'Radiant, scorched, and adventurous', dominant: { label: 'Dune Sand', moods: ['BROWN', 'YELLOW'], texture: 'Matte' }, secondary: { label: 'Solar Flare', moods: ['ORANGE', 'RED'], texture: 'Chrome' }, accent: { label: 'Twilight Sky', moods: ['INDIGO', 'VIOLET'], texture: 'Pastel' } },
        { name: 'Nordic Winter', desc: 'Minimalist, sharp, and frozen', dominant: { label: 'Glacier Ice', moods: ['WHITE', 'BLUE'], texture: 'Chrome' }, secondary: { label: 'Boreal Grey', moods: ['BLACK', 'WHITE'], texture: 'Matte' }, accent: { label: 'Aurora Green', moods: ['GREEN', 'VIOLET'], texture: 'Chrome' } },
        
        // 11-20
        { name: 'Zen Garden', desc: 'Balanced, peaceful, and meditative', dominant: { label: 'Stone Grey', moods: ['BLACK', 'BROWN'], texture: 'Matte' }, secondary: { label: 'Bamboo Leaf', moods: ['GREEN', 'YELLOW'], texture: 'Pastel' }, accent: { label: 'Lotus White', moods: ['WHITE', 'VIOLET'], texture: 'Matte' } },
        { name: 'Galaxy Voyage', desc: 'Celestial, sparkling, and infinite', dominant: { label: 'Nebula Violet', moods: ['VIOLET', 'INDIGO'], texture: 'Chrome' }, secondary: { label: 'Dark Matter', moods: ['BLACK', 'BLUE'], texture: 'Matte' }, accent: { label: 'Star Dust', moods: ['WHITE', 'YELLOW'], texture: 'Chrome' } },
        { name: 'Vintage Carnival', desc: 'Playful, bold, and energetic', dominant: { label: 'Caravan Red', moods: ['RED', 'ORANGE'], texture: 'Matte' }, secondary: { label: 'Popcorn Yellow', moods: ['YELLOW', 'WHITE'], texture: 'Chrome' }, accent: { label: 'Showman Blue', moods: ['BLUE', 'INDIGO'], texture: 'Pastel' } },
        { name: 'Tropical Heat', desc: 'Exotic, vibrant, and lush', dominant: { label: 'Jungle Canopy', moods: ['GREEN', 'BLACK'], texture: 'Matte' }, secondary: { label: 'Flamingo Pink', moods: ['RED', 'VIOLET'], texture: 'Pastel' }, accent: { label: 'Mango Flash', moods: ['ORANGE', 'YELLOW'], texture: 'Chrome' } },
        { name: 'Victorian Mourning', desc: 'Deep, somber, and respectful', dominant: { label: 'Gothic Rose', moods: ['BLACK', 'BROWN'], texture: 'Matte' }, secondary: { label: 'Dusk Violet', moods: ['VIOLET', 'INDIGO'], texture: 'Pastel' }, accent: { label: 'Antique Silver', moods: ['WHITE', 'BLACK'], texture: 'Chrome' } },
        { name: 'Spring Equinox', desc: 'Rebirth, light, and airy', dominant: { label: 'Fresh Sprout', moods: ['GREEN', 'YELLOW'], texture: 'Pastel' }, secondary: { label: 'Daffodil', moods: ['YELLOW', 'ORANGE'], texture: 'Matte' }, accent: { label: 'Sky Flare', moods: ['BLUE', 'WHITE'], texture: 'Chrome' } },
        { name: 'Volcanic Edge', desc: 'Fiery, destructive, and intense', dominant: { label: 'Obsidian', moods: ['BLACK', 'BROWN'], texture: 'Matte' }, secondary: { label: 'Magma Flow', moods: ['RED', 'ORANGE'], texture: 'Chrome' }, accent: { label: 'Sulfur Glow', moods: ['YELLOW', 'GREEN'], texture: 'Chrome' } },
        { name: 'Lavender Fields', desc: 'Calm, floral, and aromatic', dominant: { label: 'Provence Bloom', moods: ['VIOLET', 'WHITE'], texture: 'Pastel' }, secondary: { label: 'Sage Leaf', moods: ['GREEN', 'BROWN'], texture: 'Matte' }, accent: { label: 'Evening Blue', moods: ['BLUE', 'INDIGO'], texture: 'Chrome' } },
        { name: 'Steampunk Gear', desc: 'Metallic, industrial, and vintage', dominant: { label: 'Burnished Copper', moods: ['BROWN', 'ORANGE'], texture: 'Chrome' }, secondary: { label: 'Iron Oxide', moods: ['RED', 'BLACK'], texture: 'Matte' }, accent: { label: 'Brass Clock', moods: ['YELLOW', 'WHITE'], texture: 'Chrome' } },
        { name: 'Candy Shop', desc: 'Sweet, neon, and sugary', dominant: { label: 'Gummy Pink', moods: ['RED', 'VIOLET'], texture: 'Pastel' }, secondary: { label: 'Blueberry fizz', moods: ['BLUE', 'WHITE'], texture: 'Chrome' }, accent: { label: 'Lemon Drop', moods: ['YELLOW', 'ORANGE'], texture: 'Matte' } },

        // 21-30
        { name: 'Deep Space', desc: 'Unending, dark, and speckled', dominant: { label: 'Void Black', moods: ['BLACK', 'INDIGO'], texture: 'Matte' }, secondary: { label: 'Supernova', moods: ['VIOLET', 'RED'], texture: 'Chrome' }, accent: { label: 'Pulsar White', moods: ['WHITE', 'BLUE'], texture: 'Chrome' } },
        { name: 'Emerald Empire', desc: 'Rich, green, and authoritative', dominant: { label: 'Jade Throne', moods: ['GREEN', 'BLACK'], texture: 'Matte' }, secondary: { label: 'Forest Gold', moods: ['YELLOW', 'BROWN'], texture: 'Chrome' }, accent: { label: 'White Tea', moods: ['WHITE', 'GREEN'], texture: 'Pastel' } },
        { name: 'Sakura Bloom', desc: 'Cherry blossoms, pink, and transient', dominant: { label: 'Petal Pink', moods: ['WHITE', 'RED'], texture: 'Pastel' }, secondary: { label: 'Dark Bark', moods: ['BROWN', 'BLACK'], texture: 'Matte' }, accent: { label: 'Spring Flare', moods: ['YELLOW', 'WHITE'], texture: 'Chrome' } },
        { name: 'Gothic Cathedral', desc: 'Dark stone, stained glass, and holy', dominant: { label: 'Stone Arch', moods: ['BLACK', 'BROWN'], texture: 'Matte' }, secondary: { label: 'Stained Rose', moods: ['RED', 'VIOLET'], texture: 'Chrome' }, accent: { label: 'Candle Light', moods: ['YELLOW', 'WHITE'], texture: 'Pastel' } },
        { name: 'Retro Wave', desc: '80s, purple-blue, and synth', dominant: { label: 'Laser Violet', moods: ['VIOLET', 'INDIGO'], texture: 'Chrome' }, secondary: { label: 'Cyan Grid', moods: ['BLUE', 'WHITE'], texture: 'Chrome' }, accent: { label: 'Sunset Orange', moods: ['ORANGE', 'RED'], texture: 'Matte' } },
        { name: 'Arctic Aurora', desc: 'Cool blues, dancing greens', dominant: { label: 'Ice Cave', moods: ['BLUE', 'WHITE'], texture: 'Matte' }, secondary: { label: 'Solar Wind', moods: ['GREEN', 'YELLOW'], texture: 'Chrome' }, accent: { label: 'Midnight Blue', moods: ['INDIGO', 'BLACK'], texture: 'Pastel' } },
        { name: 'Golden Hour', desc: 'warm light, long shadows', dominant: { label: 'Sun Drench', moods: ['ORANGE', 'YELLOW'], texture: 'Pastel' }, secondary: { label: 'Earth Tone', moods: ['BROWN', 'BLACK'], texture: 'Matte' }, accent: { label: 'Chrome Amber', moods: ['YELLOW', 'ORANGE'], texture: 'Chrome' } },
        { name: 'Toxic Swamp', desc: 'bubbling greens, hazardous', dominant: { label: 'Noxious Fog', moods: ['GREEN', 'BROWN'], texture: 'Matte' }, secondary: { label: 'Acid Leak', moods: ['YELLOW', 'GREEN'], texture: 'Chrome' }, accent: { label: 'Mutant Purple', moods: ['VIOLET', 'BLACK'], texture: 'Matte' } },
        { name: 'Porcelain Tea', desc: 'Delicate, white-blue, elegant', dominant: { label: 'Pure Porcelain', moods: ['WHITE', 'BLUE'], texture: 'Pastel' }, secondary: { label: 'Cobalt Ink', moods: ['BLUE', 'INDIGO'], texture: 'Chrome' }, accent: { label: 'Gold Rim', moods: ['YELLOW', 'ORANGE'], texture: 'Chrome' } },
        { name: 'Royal Court', desc: 'Velvet red, gold leaf', dominant: { label: 'Velvet Throne', moods: ['RED', 'BLACK'], texture: 'Matte' }, secondary: { label: 'Guilded Brocade', moods: ['YELLOW', 'BROWN'], texture: 'Chrome' }, accent: { label: 'Ermine White', moods: ['WHITE', 'BLACK'], texture: 'Pastel' } },

        // 31-40
        { name: 'Cyberpunk Night', desc: 'Rain-slicked streets, neon signs', dominant: { label: 'Asphalt', moods: ['BLACK', 'INDIGO'], texture: 'Matte' }, secondary: { label: 'Neon Sign', moods: ['VIOLET', 'BLUE'], texture: 'Chrome' }, accent: { label: 'Drip Green', moods: ['GREEN', 'YELLOW'], texture: 'Chrome' } },
        { name: 'Highland Mist', desc: 'Foggy greens, damp earth', dominant: { label: 'Heather', moods: ['VIOLET', 'BROWN'], texture: 'Pastel' }, secondary: { label: 'Loch Water', moods: ['BLUE', 'BLACK'], texture: 'Matte' }, accent: { label: 'Gorse Flower', moods: ['YELLOW', 'GREEN'], texture: 'Chrome' } },
        { name: 'Solar Eclipse', desc: 'Hidden sun, corona light', dominant: { label: 'Total Moon', moods: ['BLACK', 'INDIGO'], texture: 'Matte' }, secondary: { label: 'Corona Ray', moods: ['WHITE', 'YELLOW'], texture: 'Chrome' }, accent: { label: 'Star Flare', moods: ['BLUE', 'WHITE'], texture: 'Pastel' } },
        { name: 'Marshmallow Fluff', desc: 'Soft, white, pastel pink', dominant: { label: 'Powder Sugar', moods: ['WHITE', 'PINK'], texture: 'Pastel' }, secondary: { label: 'Strawberry Whip', moods: ['RED', 'WHITE'], texture: 'Pastel' }, accent: { label: 'Confetti', moods: ['YELLOW', 'BLUE'], texture: 'Chrome' } },
        { name: 'Iron Works', desc: 'Heavy metal, fire, sparks', dominant: { label: 'Cast Iron', moods: ['BLACK', 'BROWN'], texture: 'Matte' }, secondary: { label: 'Molten Steel', moods: ['ORANGE', 'RED'], texture: 'Chrome' }, accent: { label: 'Blue Spark', moods: ['BLUE', 'WHITE'], texture: 'Chrome' } },
        { name: 'Peacock Pride', desc: 'Iridescent blues and greens', dominant: { label: 'Tail Plume', moods: ['BLUE', 'GREEN'], texture: 'Chrome' }, secondary: { label: 'Deep Indigo', moods: ['INDIGO', 'BLACK'], texture: 'Matte' }, accent: { label: 'Eye Patch', moods: ['YELLOW', 'GREEN'], texture: 'Pastel' } },
        { name: 'Redwood Forest', desc: 'Ancient trees, deep mulch', dominant: { label: 'Ancient Bark', moods: ['BROWN', 'BLACK'], texture: 'Matte' }, secondary: { label: 'Needle Green', moods: ['GREEN', 'BROWN'], texture: 'Pastel' }, accent: { label: 'Sky Crack', moods: ['BLUE', 'WHITE'], texture: 'Chrome' } },
        { name: 'Champagne Toast', desc: 'Celebratory, sparkling', dominant: { label: 'Bubbly', moods: ['YELLOW', 'WHITE'], texture: 'Chrome' }, secondary: { label: 'Silk Gown', moods: ['WHITE', 'BROWN'], texture: 'Pastel' }, accent: { label: 'Maraschino', moods: ['RED', 'ORANGE'], texture: 'Matte' } },
        { name: 'Neon Jungle', desc: 'Bioluminescent, dense', dominant: { label: 'Deep Fern', moods: ['GREEN', 'BLACK'], texture: 'Matte' }, secondary: { label: 'Biolume', moods: ['BLUE', 'VIOLET'], texture: 'Chrome' }, accent: { label: 'Exotic Fruit', moods: ['ORANGE', 'YELLOW'], texture: 'Pastel' } },
        { name: 'Sapphire Seas', desc: 'Deep ocean, white crests', dominant: { label: 'Oceanic', moods: ['BLUE', 'BLACK'], texture: 'Matte' }, secondary: { label: 'Sea Foam', moods: ['WHITE', 'BLUE'], texture: 'Pastel' }, accent: { label: 'Golden Shell', moods: ['YELLOW', 'BROWN'], texture: 'Chrome' } },

        // 41-50
        { name: 'Desert Rose', desc: 'Dusty pink, dry sand', dominant: { label: 'Sand Dune', moods: ['BROWN', 'YELLOW'], texture: 'Matte' }, secondary: { label: 'Dusty Bloom', moods: ['PINK', 'WHITE'], texture: 'Pastel' }, accent: { label: 'Lizard Green', moods: ['GREEN', 'YELLOW'], texture: 'Chrome' } },
        { name: 'Midnight Carnival', desc: 'Dark magic, laughter', dominant: { label: 'Tent Shadow', moods: ['INDIGO', 'BLACK'], texture: 'Matte' }, secondary: { label: 'Cotton Candy', moods: ['RED', 'VIOLET'], texture: 'Pastel' }, accent: { label: 'Electric Spark', moods: ['YELLOW', 'WHITE'], texture: 'Chrome' } },
        { name: 'Frozen Tundra', desc: 'Permafrost, pale sun', dominant: { label: 'Frost Earth', moods: ['BROWN', 'WHITE'], texture: 'Matte' }, secondary: { label: 'Ice Sheet', moods: ['BLUE', 'WHITE'], texture: 'Chrome' }, accent: { label: 'Pale Ray', moods: ['YELLOW', 'WHITE'], texture: 'Pastel' } },
        { name: 'Ruby Romance', desc: 'Deep reds, passion', dominant: { label: 'Crimson Heart', moods: ['RED', 'BLACK'], texture: 'Matte' }, secondary: { label: 'Silky Blush', moods: ['PINK', 'WHITE'], texture: 'Pastel' }, accent: { label: 'Rubine Chrome', moods: ['RED', 'VIOLET'], texture: 'Chrome' } },
        { name: 'Onyx Elegance', desc: 'Pure black, sharp edges', dominant: { label: 'Pitch Black', moods: ['BLACK', 'INDIGO'], texture: 'Matte' }, secondary: { label: 'Silver Lining', moods: ['WHITE', 'BLACK'], texture: 'Chrome' }, accent: { label: 'Grey Mist', moods: ['BROWN', 'WHITE'], texture: 'Pastel' } },
        { name: 'Citrus Zest', desc: 'Tangy, bright fruit', dominant: { label: 'Orange Skin', moods: ['ORANGE', 'YELLOW'], texture: 'Matte' }, secondary: { label: 'Lime Juice', moods: ['GREEN', 'YELLOW'], texture: 'Pastel' }, accent: { label: 'Lemon Peel', moods: ['YELLOW', 'WHITE'], texture: 'Chrome' } },
        { name: 'Cosmic Horror', desc: 'Unfathomable, purple-black', dominant: { label: 'Eldritch', moods: ['BLACK', 'VIOLET'], texture: 'Matte' }, secondary: { label: 'Void Tear', moods: ['INDIGO', 'BLACK'], texture: 'Chrome' }, accent: { label: 'Eye Glow', moods: ['GREEN', 'YELLOW'], texture: 'Chrome' } },
        { name: 'Copper Canyon', desc: 'Eroded, warm, and metallic', dominant: { label: 'Basalt', moods: ['BROWN', 'BLACK'], texture: 'Matte' }, secondary: { label: 'Copper Vein', moods: ['ORANGE', 'BROWN'], texture: 'Chrome' }, accent: { label: 'Sky Streak', moods: ['BLUE', 'WHITE'], texture: 'Pastel' } },
        { name: 'Aurora Borealis', desc: 'Dancing lights in the north', dominant: { label: 'Night Sky', moods: ['INDIGO', 'BLACK'], texture: 'Matte' }, secondary: { label: 'Spirit Light', moods: ['GREEN', 'BLUE'], texture: 'Chrome' }, accent: { label: 'Star Flare', moods: ['WHITE', 'YELLOW'], texture: 'Pastel' } },
        { name: 'Sunset Boulevard', desc: 'Nostalgic, warm, and vibrant', dominant: { label: 'Asphalt', moods: ['BLACK', 'BROWN'], texture: 'Matte' }, secondary: { label: 'Solar Haze', moods: ['ORANGE', 'RED'], texture: 'Pastel' }, accent: { label: 'Neon Pulse', moods: ['VIOLET', 'BLUE'], texture: 'Chrome' } }
      ];
      
      const selectedGlobalPalette = ensemblePaletteId !== 'random' ? PALETTES.find(p => p.id === ensemblePaletteId) : null;
      
      const theme = selectedGlobalPalette 
        ? {
            name: `${selectedGlobalPalette.name} Ensemble`,
            desc: `A cohesive arrangement defined by the ${selectedGlobalPalette.name} palette.`,
            dominant: { label: 'Primary', texture: selectedGlobalPalette.material, moods: [selectedGlobalPalette.mood] },
            secondary: { label: 'Secondary', texture: selectedGlobalPalette.material, moods: [selectedGlobalPalette.mood] },
            accent: { label: 'Accent', texture: selectedGlobalPalette.material, moods: [selectedGlobalPalette.mood] }
          }
        : THEMES[Math.floor(Math.random() * THEMES.length)];

      const randomHex = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');

      const createFlower = (role: 'dominant' | 'secondary' | 'accent', idx: number) => {
        const config = (theme as any)[role];
        const moodKey = config.moods[Math.floor(Math.random() * config.moods.length)] as keyof typeof MOOD_MAP;
        const mood = MOOD_MAP[moodKey];
        
        // Randomly assign a flower type
        const flowerTypes = BASIC_FLOWER_TYPES.filter(t => getFlowerCategory(t.id) === 'flower');
        const randomType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
        
        // If we have a global palette, use its specific petal color, but maybe randomize stamen/stems
        const petalHex = selectedGlobalPalette ? selectedGlobalPalette.petals.hex : (mood.hex === '#FFFFFF' ? '#FDFDFD' : (mood.hex === '#000000' ? '#1A1A1A' : mood.hex));
        const petalName = selectedGlobalPalette ? selectedGlobalPalette.petals.name : config.texture;

        return {
          id: `bouquet-${Date.now()}-${idx}`,
          name: `${randomType.name} - ${config.label}`,
          petals: { name: petalName, hex: petalHex },
          stamen: { name: 'Highlight', hex: randomHex() },
          stem: { name: 'Natural Stem', hex: Math.random() > 0.5 ? '#1B2E1B' : '#3E2723' },
          category: theme.name,
          mood: moodKey,
          material: config.texture,
          description: theme.desc,
          flowerTypeId: randomType.id,
          typeIcon: randomType.icon,
          typeName: randomType.name
        };
      };

      // Apply 3-1-1 Rule
      const flowers = [
        createFlower('dominant', 0),
        createFlower('dominant', 1),
        createFlower('dominant', 2),
        createFlower('secondary', 3),
        createFlower('accent', 4)
      ];

      // Randomize foliage and fillers for "Quick Magic" to make it feel rich
      const allLeaves = BASIC_FLOWER_TYPES.filter(t => getFlowerCategory(t.id) === 'leaf').map(t => t.id);
      const allFillers = BASIC_FLOWER_TYPES.filter(t => getFlowerCategory(t.id) === 'filler').map(t => t.id);
      
      const randomLeaves = [...allLeaves].sort(() => 0.5 - Math.random()).slice(0, 2);
      const randomFillers = [...allFillers].sort(() => 0.5 - Math.random()).slice(0, 1);

      setRandomBouquet({ 
        flowers: flowers as any, 
        leaves: randomLeaves, 
        fillers: randomFillers 
      });
      setIsBouquetSpinning(false);
      
      if (isEnsembleBuilderOpen) {
        setSelectedLeafIds(randomLeaves);
        setSelectedFillerIds(randomFillers);
        setIsEnsembleBuilderOpen(false);
      }

      window.scrollTo({ top: 300, behavior: 'smooth' });
    }, 2000);
  };

  const handleCategoryFilter = (cat: string | null) => {
    setFilter(cat);
    setThemeFilter(null);
  };

  const handleThemeFilter = (palettes: string[]) => {
    setThemeFilter(palettes);
    setFilter(null);
  };

  const getFlowerCategory = (id: string): 'flower' | 'leaf' | 'filler' => {
    const leafKeywords = ['leaf', 'foliage', 'ivy', 'fern', 'eucalyptus', 'frond', 'bamboo', 'oak', 'agave', 'maple', 'pine'];
    const fillerKeywords = ['filler', 'sprig', 'breath', 'willow', 'succulent', 'stalk', 'pampas', 'berry', 'stem', 'lavender', 'spiral'];
    
    if (leafKeywords.some(k => id.toLowerCase().includes(k))) return 'leaf';
    if (fillerKeywords.some(k => id.toLowerCase().includes(k))) return 'filler';
    return 'flower';
  };

  const handleGenerateCustomEnsemble = () => {
    setIsBouquetSpinning(true);
    setRandomPalette(null);
    setAnalyzedBouquet(null);
    
    setTimeout(() => {
      const flowers = customBouquetConfig.map((conf, idx) => {
        const type = BASIC_FLOWER_TYPES.find(t => t.id === conf.flowerTypeId) || BASIC_FLOWER_TYPES[0];
        const palette = conf.colorPaletteId === 'random' 
          ? PALETTES[Math.floor(Math.random() * PALETTES.length)]
          : PALETTES.find(p => p.id === conf.colorPaletteId) || PALETTES[0];
        
        return {
          id: `custom-${Date.now()}-${idx}`,
          name: `${type.name} - ${palette.name}`,
          petals: palette.petals,
          stamen: palette.stamen,
          stem: palette.stem,
          category: 'Custom Ensemble',
          mood: palette.mood,
          material: palette.material || 'Matte',
          description: `Custom magic with ${selectedLeafIds.length} foliage and ${selectedFillerIds.length} accents.`,
          flowerTypeId: type.id,
          typeIcon: type.icon,
          typeName: type.name
        };
      });

      setRandomBouquet({
        flowers,
        leaves: selectedLeafIds,
        fillers: selectedFillerIds
      });
      setIsBouquetSpinning(false);
      setIsEnsembleBuilderOpen(false);
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans p-6 md:p-12">
      {/* Frame border like the design */}
      <div className="fixed inset-0 border-[20px] border-black pointer-events-none z-50 hidden xl:block" />
      
      {/* Header Section */}
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-baseline gap-6 border-b border-brand-border pb-6 relative z-10">
        {/* Decorative Background Image for Header (Tràn viền) */}
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-screen h-[800px] opacity-25 pointer-events-none z-[-1] overflow-hidden">
           <img 
             src="https://i.pinimg.com/736x/9b/38/2f/9b382f8f5a0c3833cc66ef2007f604b9.jpg"
             alt="Decorative Background"
             className="w-full h-full object-cover scale-110 object-[center_35%]"
             style={{ 
               filter: 'contrast(1.05) brightness(1.1) saturate(1.1)',
               maskImage: 'linear-gradient(to right, transparent, black 40%, black 60%, transparent), linear-gradient(to bottom, black 50%, transparent 95%)',
               WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%, black 60%, transparent), linear-gradient(to bottom, black 50%, transparent 95%)',
               maskComposite: 'intersect',
               WebkitMaskComposite: 'source-in'
             }}
             referrerPolicy="no-referrer"
           />
        </div>
        
        <div className="space-y-1">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-serif font-light tracking-tight lowercase"
          >
            The <span className="text-brand-accent italic font-normal">Color Anthology</span>
          </motion.h1>
          <p className="font-mono text-[9px] tracking-[0.3em] opacity-40 uppercase">
            Artistic Balloon Palette Guide // v2.4
          </p>
        </div>

          <div className="flex flex-col items-end gap-4">
            <div className="text-right font-mono text-[8px] leading-relaxed tracking-widest opacity-60">
              SYSTEM_STATUS: NOMINAL<br />
              COORD: 43.19.12 / 09.02.24
            </div>
            
            <div className="flex items-center gap-4">
              {/* Magic Shuffle Button */}
              <button 
                onClick={handleShuffle}
                disabled={isSpinning || isBouquetSpinning}
                className="group relative flex items-center gap-3 px-6 py-2 bg-brand-accent rounded-full text-brand-bg font-mono text-[10px] uppercase tracking-[0.2em] font-bold overflow-hidden transition-all hover:pr-8 active:scale-95 disabled:opacity-50"
              >
                <div className={`transition-transform duration-1000 ${isSpinning ? 'animate-spin' : 'group-hover:rotate-180'}`}>
                  <Sparkles size={14} />
                </div>
                <span>Magic Solo</span>
                <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={14} />
                </div>
              </button>

              {/* Bouquet Magic Button */}
              <button 
                onClick={() => setIsEnsembleBuilderOpen(!isEnsembleBuilderOpen)}
                disabled={isSpinning || isBouquetSpinning}
                className={`group relative flex items-center gap-3 px-6 py-2 border border-brand-accent/40 rounded-full font-mono text-[10px] uppercase tracking-[0.2em] font-bold overflow-hidden transition-all active:scale-95 disabled:opacity-50 ${isEnsembleBuilderOpen ? 'bg-brand-accent text-brand-bg' : 'text-brand-accent hover:bg-brand-accent hover:text-brand-bg'}`}
              >
                <div className={`transition-transform duration-1000 ${isBouquetSpinning ? 'animate-spin' : 'group-hover:rotate-12'}`}>
                  <Palette size={14} />
                </div>
                <span>{isEnsembleBuilderOpen ? 'Close Builder' : 'Ensemble Magic'}</span>
              </button>

              {/* AI Vision Button */}
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageScan} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSpinning || isBouquetSpinning || isAnalyzingImage}
                  className="group relative flex items-center gap-3 px-6 py-2 border border-brand-accent/40 rounded-full text-brand-accent font-mono text-[10px] uppercase tracking-[0.2em] font-bold overflow-hidden transition-all hover:bg-brand-accent hover:text-brand-bg active:scale-95 disabled:opacity-50"
                >
                  <div className={`transition-transform duration-1000 ${isAnalyzingImage ? 'animate-pulse' : 'group-hover:scale-110'}`}>
                    {isAnalyzingImage ? <Sparkles size={14} className="animate-spin" /> : <Camera size={14} />}
                  </div>
                  <span>{isAnalyzingImage ? 'Analyzing...' : 'Vision Scan'}</span>
                </button>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-wrap gap-4 justify-end">
                <div className="flex flex-wrap gap-3 overflow-x-auto pb-4 md:pb-0 scrollbar-hide border-r border-white/10 pr-4">
                {['All', ...categories].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryFilter(cat === 'All' ? null : cat)}
                    className={`text-[9px] uppercase tracking-[0.25em] transition-all pb-1 border-b-2 font-mono whitespace-nowrap ${
                      (cat === 'All' && !filter && !themeFilter) || filter === cat
                        ? 'border-brand-accent text-brand-accent'
                        : 'border-transparent text-white/30 hover:text-white/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Event Dropdown/Pills could go here, but let's use a themed approach */}
              <div className="flex items-center gap-2 group cursor-help relative">
                <Filter size={12} className="text-brand-accent" />
                <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Guide by Event</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <GlobalBalloonStatBar />

      {scanError && (
        <div className="max-w-7xl mx-auto mt-6 relative z-20">
          <div className="flex items-center justify-between gap-4 px-5 py-3 bg-red-500/10 border border-red-500/30 rounded text-xs font-mono text-red-300">
            <span>Vision Scan: {scanError}</span>
            <button onClick={() => setScanError(null)} className="text-red-300/60 hover:text-red-200 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto mb-12">
      </div>

        <section className="max-w-7xl mx-auto mb-12 relative z-10">
          <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide snap-x">
            {EVENT_GUIDE.map((ev) => (
              <div key={ev.category} className="shrink-0 space-y-3 snap-start border-l border-white/5 pl-4">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">{ev.category}</h4>
                <div className="flex gap-2">
                  {ev.themes.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => handleThemeFilter(theme.palettes)}
                      className={`px-3 py-1.5 rounded-sm text-[10px] font-serif italic transition-all border ${
                        themeFilter?.join(',') === theme.palettes.join(',')
                          ? 'bg-brand-accent border-brand-accent text-brand-bg'
                          : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ensemble Builder Interface */}
        <AnimatePresence>
          {isEnsembleBuilderOpen && (
            <motion.section 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-7xl mx-auto mb-20 relative z-10 overflow-hidden"
            >
              <div className="bg-white/[0.03] border border-white/10 p-8 rounded-lg">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-serif italic">Ensemble Builder</h2>
                    <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40">Custom Composition Tool</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleBouquetShuffle}
                      className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30 hover:text-brand-accent transition-colors flex items-center gap-2"
                    >
                      <Sparkles size={10} className={ensemblePaletteId !== 'random' ? 'text-brand-accent' : ''} />
                      {ensemblePaletteId === 'random' ? 'Quick Magic (Random)' : 'Quick Magic (Coordinated)'}
                    </button>
                    <X 
                      size={20} 
                      className="text-white/20 hover:text-white cursor-pointer" 
                      onClick={() => setIsEnsembleBuilderOpen(false)} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Column 1: Main Flowers */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-brand-accent">Bông hoa chính</h3>
                      <span className="text-[9px] text-white/20 font-mono italic">{customBouquetConfig.length}/5</span>
                    </div>
                    
                    <div className="space-y-4">
                      {customBouquetConfig.map((config, idx) => (
                        <div key={idx} className="bg-white/5 p-4 rounded-sm border border-white/5 space-y-3 relative group">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono text-white/40 uppercase">Flower #{idx + 1}</span>
                            {customBouquetConfig.length > 1 && (
                              <button 
                                onClick={() => setCustomBouquetConfig(prev => prev.filter((_, i) => i !== idx))}
                                className="text-white/20 hover:text-red-400"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                          
                          <select 
                            value={config.flowerTypeId}
                            onChange={(e) => {
                              const newConfig = [...customBouquetConfig];
                              newConfig[idx].flowerTypeId = e.target.value;
                              setCustomBouquetConfig(newConfig);
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs font-serif italic text-white/80 focus:outline-none focus:border-brand-accent/50"
                          >
                            {BASIC_FLOWER_TYPES.filter(t => getFlowerCategory(t.id) === 'flower').map(t => (
                              <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                            ))}
                          </select>

                          <select 
                            value={config.colorPaletteId}
                            onChange={(e) => {
                              const newConfig = [...customBouquetConfig];
                              newConfig[idx].colorPaletteId = e.target.value;
                              setCustomBouquetConfig(newConfig);
                            }}
                            className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs font-mono uppercase tracking-widest text-white/60 focus:outline-none focus:border-brand-accent/50"
                          >
                            <option value="random">Magic Color (Random)</option>
                            {PALETTES.map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                          </select>
                        </div>
                      ))}

                      {customBouquetConfig.length < 5 && (
                        <button 
                          onClick={() => setCustomBouquetConfig([...customBouquetConfig, { flowerTypeId: 'classic-5-petal', colorPaletteId: 'random' }])}
                          className="w-full py-3 border border-dashed border-white/10 hover:border-brand-accent/40 text-[9px] font-mono uppercase tracking-[0.2em] text-white/20 hover:text-brand-accent transition-all"
                        >
                          + Add Another Flower
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Column 2: Foliage & Fillers */}
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-brand-accent">Lá & Cành (Foliage)</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {BASIC_FLOWER_TYPES.filter(t => getFlowerCategory(t.id) === 'leaf').map(leaf => (
                          <button
                            key={leaf.id}
                            onClick={() => {
                              setSelectedLeafIds(prev => 
                                prev.includes(leaf.id) ? prev.filter(id => id !== leaf.id) : [...prev, leaf.id]
                              );
                            }}
                            className={`flex items-center gap-3 p-3 border transition-all text-left ${
                              selectedLeafIds.includes(leaf.id) 
                                ? 'bg-brand-accent/10 border-brand-accent/50 text-white' 
                                : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
                            }`}
                          >
                            <span className="text-lg">{leaf.icon}</span>
                            <span className="text-[10px] font-serif italic truncate">{leaf.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-brand-accent">Phụ kiện & Fillers</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {BASIC_FLOWER_TYPES.filter(t => getFlowerCategory(t.id) === 'filler').map(filler => (
                          <button
                            key={filler.id}
                            onClick={() => {
                              setSelectedFillerIds(prev => 
                                prev.includes(filler.id) ? prev.filter(id => id !== filler.id) : [...prev, filler.id]
                              );
                            }}
                            className={`flex items-center gap-3 p-3 border transition-all text-left ${
                              selectedFillerIds.includes(filler.id) 
                                ? 'bg-brand-accent/10 border-brand-accent/50 text-white' 
                                : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
                            }`}
                          >
                            <span className="text-lg">{filler.icon}</span>
                            <span className="text-[10px] font-serif italic truncate">{filler.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Global Config & Action */}
                  <div className="space-y-8 flex flex-col h-full">
                    <div className="space-y-6">
                       <h3 className="text-xs font-mono uppercase tracking-widest text-brand-accent">Phối màu chung</h3>
                       <p className="text-[9px] font-mono text-white/20 italic mb-4">Áp dụng một tone màu cho toàn bộ cành/lá/phụ kiện để tạo sự đồng điệu.</p>
                       <select 
                          value={ensemblePaletteId}
                          onChange={(e) => setEnsemblePaletteId(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded px-3 py-3 text-[10px] font-mono uppercase tracking-widest text-brand-accent focus:outline-none focus:border-brand-accent"
                        >
                          <option value="random">Auto-Balance (Magic)</option>
                          {PALETTES.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                    </div>

                    <div className="mt-auto pt-10 border-t border-white/5 space-y-4">
                      <div className="bg-brand-accent/5 p-4 border border-brand-accent/10 rounded">
                         <p className="text-[9px] font-mono text-brand-accent/80 italic leading-relaxed">
                            Nghệ thuật bong bóng đòi hỏi sự cân bằng giữa hoa chính và các chi tiết phụ. Hãy thử thêm lá Monstera cho cảm giác nhiệt đới hoặc Baby's Breath cho nét tinh khôi.
                         </p>
                      </div>
                      
                      <button 
                        onClick={handleGenerateCustomEnsemble}
                        disabled={isBouquetSpinning}
                        className="w-full group relative flex items-center justify-center gap-3 px-6 py-4 bg-brand-accent text-brand-bg font-mono text-xs uppercase tracking-[0.4em] font-bold overflow-hidden transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                      >
                         <Sparkles size={16} className={isBouquetSpinning ? 'animate-spin' : ''} />
                         <span>{isBouquetSpinning ? 'Creating...' : 'Assemble & Magic'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Random Selection Result */}
        <AnimatePresence>
          {randomPalette && !isSpinning && !randomBouquet && (
            <motion.section 
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-7xl mx-auto mb-20 relative z-10"
            >
              <div className="bg-brand-accent/[0.03] border border-brand-accent/30 p-8 md:p-12 rounded-[2px] flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Sparkles size={120} />
                </div>

                <div className="w-64 h-64 shrink-0 flex items-center justify-center bg-black/40 rounded-full border border-brand-accent/20">
                   <BalloonFlower 
                    petals={randomPalette.petals.hex}
                    stamen={randomPalette.stamen.hex}
                    stem={randomPalette.stem.hex}
                  />
                </div>

                <div className="grow space-y-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-brand-accent">Discovery Result</span>
                      <span className="px-2 py-0.5 bg-brand-accent/20 border border-brand-accent/40 rounded-full text-[8px] font-mono text-brand-accent uppercase tracking-widest">Unique Creation</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif italic">{randomPalette.name}</h2>
                  </div>

                  <div className="flex items-center gap-4 py-4 border-y border-white/5">
                    <div 
                      className="w-12 h-12 rounded-full border-2 border-brand-accent/20 flex items-center justify-center text-xl"
                      style={{ color: MOOD_MAP[randomPalette.mood].hex }}
                    >
                       {randomPalette.mood === 'WHITE' ? '✧' : '✦'}
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">Dominant Emotion</p>
                      <p className="text-xl font-serif">
                        {MOOD_MAP[randomPalette.mood].label} <span className="text-white/20 ml-2 italic text-sm">({randomPalette.mood})</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <p className="font-mono text-[8px] uppercase tracking-widest text-white/30">Petals</p>
                      <div className="space-y-1">
                        <p className="text-[11px] font-serif italic text-white/80 leading-none">{randomPalette.petals.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-[2px] border border-white/10 shadow-sm" style={{ backgroundColor: randomPalette.petals.hex }} />
                          <span className="font-mono text-[9px] text-white/40">{randomPalette.petals.hex}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-mono text-[8px] uppercase tracking-widest text-white/30">Stamen</p>
                      <div className="space-y-1">
                        <p className="text-[11px] font-serif italic text-white/80 leading-none">{randomPalette.stamen.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-[2px] border border-white/10 shadow-sm" style={{ backgroundColor: randomPalette.stamen.hex }} />
                          <span className="font-mono text-[9px] text-white/40">{randomPalette.stamen.hex}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-mono text-[8px] uppercase tracking-widest text-white/30">Stem</p>
                      <div className="space-y-1">
                        <p className="text-[11px] font-serif italic text-white/80 leading-none">{randomPalette.stem.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-[2px] border border-white/10 shadow-sm" style={{ backgroundColor: randomPalette.stem.hex }} />
                          <span className="font-mono text-[9px] text-white/40">{randomPalette.stem.hex}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setRandomPalette(null)}
                    className="text-[9px] font-mono uppercase tracking-widest text-white/40 hover:text-brand-accent transition-colors"
                  >
                    × Close Discovery
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {randomBouquet && !isBouquetSpinning && (
            <motion.section 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-7xl mx-auto mb-20 relative z-10"
            >
              <div className="bg-brand-accent/[0.03] border border-brand-accent/50 p-8 md:p-12 rounded-[4px] relative overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-16">
                  {/* Bouquet Visualization */}
                  <div className="relative w-full lg:w-1/2 aspect-square max-w-[500px] mx-auto bg-black/20 rounded-full border border-white/5 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        {/* Foliage (Leaves) - Background */}
                        {randomBouquet.leaves.map((leafId, lIdx) => {
                          const leaf = BASIC_FLOWER_TYPES.find(t => t.id === leafId);
                          if (!leaf) return null;
                          const lPos = [
                            { x: -120, y: 40, r: -45, s: 1.5 },
                            { x: 120, y: 40, r: 45, s: 1.5 },
                            { x: 0, y: 140, r: 0, s: 1.8 }
                          ][lIdx % 3];

                          return (
                            <div 
                              key={`leaf-${lIdx}`}
                              className="absolute transition-all duration-1000 opacity-20 group-hover:opacity-40"
                              style={{
                                top: '50%',
                                left: '50%',
                                transform: `translate(calc(-50% + ${lPos.x}px), calc(-50% + ${lPos.y}px)) rotate(${lPos.r}deg) scale(${lPos.s})`,
                                zIndex: 1
                              }}
                            >
                              <div className="text-6xl filter blur-[1px] grayscale">{leaf.icon}</div>
                            </div>
                          );
                        })}

                        {/* Fillers - Midground */}
                        {randomBouquet.fillers.map((fillerId, fIdx) => {
                          const filler = BASIC_FLOWER_TYPES.find(t => t.id === fillerId);
                          if (!filler) return null;
                          const fPos = [
                            { x: -50, y: -120, r: -20, s: 1.2 },
                            { x: 50, y: -120, r: 20, s: 1.2 }
                          ][fIdx % 2];

                          return (
                            <div 
                              key={`filler-${fIdx}`}
                              className="absolute transition-all duration-1000 opacity-40"
                              style={{
                                top: '50%',
                                left: '50%',
                                transform: `translate(calc(-50% + ${fPos.x}px), calc(-50% + ${fPos.y}px)) rotate(${fPos.r}deg) scale(${fPos.s})`,
                                zIndex: 5
                              }}
                            >
                              <div className="text-4xl text-brand-accent/50">{filler.icon}</div>
                            </div>
                          );
                        })}

                        {/* 5 Flowers in a bouquet arrangement */}
                        {[
                          { scale: 1.1, x: -75, y: -20, z: 10, rotate: -12, type: 'Dominant' },
                          { scale: 1.1, x: 75, y: -20, z: 10, rotate: 12, type: 'Dominant' },
                          { scale: 1.0, x: 0, y: 70, z: 15, rotate: 0, type: 'Dominant' },
                          { scale: 0.95, x: 0, y: -80, z: 5, rotate: 0, type: 'Secondary' },
                          { scale: 0.8, x: 0, y: -10, z: 30, rotate: 0, type: 'Accent' }
                        ].slice(0, randomBouquet.flowers.length).map((pos, idx) => (
                          <div 
                            key={randomBouquet.flowers[idx].id}
                            className="absolute transition-all duration-700" 
                            style={{ 
                              top: '50%', 
                              left: '50%', 
                              transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${pos.rotate}deg)`,
                              zIndex: pos.z
                            }}
                          >
                            <div className="relative group/flower">
                              <BalloonFlower 
                                petals={randomBouquet.flowers[idx].petals.hex}
                                stamen={randomBouquet.flowers[idx].stamen.hex}
                                stem={randomBouquet.flowers[idx].stem.hex}
                                texture={randomBouquet.flowers[idx].material}
                                scale={pos.scale * 0.75}
                              />
                              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/flower:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-[8px] font-mono text-white whitespace-nowrap border border-white/10">
                                {pos.type}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Descriptive Details */}
                  <div className="flex-1 space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-brand-accent">Ensemble Result</span>
                        <span className="px-2 py-0.5 bg-brand-accent/20 border border-brand-accent/40 rounded-full text-[8px] font-mono text-brand-accent uppercase tracking-widest">Ensemble Discovery</span>
                      </div>
                      <h2 className="text-4xl lg:text-6xl font-serif italic mb-2">{randomBouquet.flowers[0].category}</h2>
                      <div className="flex flex-wrap gap-2">
                        {randomBouquet.leaves.map(id => {
                          const leaf = BASIC_FLOWER_TYPES.find(t => t.id === id);
                          return (
                            <span key={id} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 text-[8px] font-mono uppercase text-white/40 border border-white/5">
                              <span className="text-xs">{leaf?.icon}</span>
                              {leaf?.name.split(' ')[0]}
                            </span>
                          );
                        })}
                        {randomBouquet.fillers.map(id => {
                          const filler = BASIC_FLOWER_TYPES.find(t => t.id === id);
                          return (
                            <span key={id} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 text-[8px] font-mono uppercase text-white/40 border border-white/5">
                              <span className="text-xs">{filler?.icon}</span>
                              {filler?.name.split(' ')[0]}
                            </span>
                          );
                        })}
                      </div>

                      {/* AI Visual Concept Slot */}
                      <div className="bg-brand-accent/5 border border-brand-accent/20 rounded p-5 mb-10 overflow-hidden relative group">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles size={12} className="text-brand-accent animate-pulse" />
                          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-brand-accent">AI Visual Inspiration</span>
                        </div>
                        
                        <div className="relative aspect-[16/7] w-full bg-black/40 rounded border border-white/5 overflow-hidden">
                           <img 
                              src={`https://picsum.photos/seed/${randomBouquet.flowers[0].id}/1200/500?blur=4&grayscale`}
                              alt="Atmospheric Background"
                              className="w-full h-full object-cover opacity-20 filter saturate-50"
                              referrerPolicy="no-referrer"
                           />
                           <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-t from-brand-bg/80 to-transparent">
                              <p className="text-xl md:text-2xl font-serif italic text-white/90 mb-3 tracking-wide leading-relaxed">
                                "Một tuyệt tác bong bóng {randomBouquet.flowers[0].typeName} sang trọng, phối hợp cùng các lớp lá {randomBouquet.leaves.length > 0 ? 'tự nhiên' : ''} và những điểm nhấn tinh tế."
                              </p>
                              <div className="flex items-center gap-4">
                                <div className="h-[1px] w-8 bg-brand-accent/30" />
                                <span className="text-[9px] font-mono uppercase tracking-[0.5em] text-brand-accent/60">Concept Visualization</span>
                                <div className="h-[1px] w-8 bg-brand-accent/30" />
                              </div>
                           </div>
                        </div>
                        
                        {/* Prompt Description for the user */}
                        <div className="mt-4 pt-4 border-t border-white/5">
                           <div className="flex items-center gap-2 mb-2">
                              <Search size={10} className="text-white/20" />
                              <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Master Composition Prompt</span>
                           </div>
                           <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest leading-relaxed">
                              A high-end professional balloon art sculpture. 
                              <span className="text-brand-accent"> Main Blooms:</span> {randomBouquet.flowers.map(f => `${f.typeName} (${f.petals.hex}, ${f.material} finish)`).join(', ')}. 
                              <span className="text-brand-accent"> Foliage:</span> {randomBouquet.leaves.length > 0 ? randomBouquet.leaves.map(id => BASIC_FLOWER_TYPES.find(t => t.id === id)?.name).join(', ') : 'None'}. 
                              <span className="text-brand-accent"> Accents:</span> {randomBouquet.fillers.length > 0 ? randomBouquet.fillers.map(id => BASIC_FLOWER_TYPES.find(t => t.id === id)?.name).join(', ') : 'None'}. 
                              Studio lighting, macro lens detail, depth of field, clean architectural background, 8k resolution, cinematic aesthetic.
                           </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                      {randomBouquet.flowers.map((flower, idx) => {
                        const roles = ['Dominant Foundation', 'Dominant Foundation', 'Dominant Foundation', 'Secondary Balance', 'Focal Accent'];
                        const role = roles[idx];
                        
                        return (
                          <div key={flower.id} className="group border-l border-white/10 pl-4 py-2 hover:border-brand-accent transition-colors">
                            <div className="flex items-center justify-between mb-1">
                               <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: flower.petals.hex }} />
                                  <span className="font-mono text-[9px] uppercase tracking-widest text-brand-accent/60">{role}</span>
                               </div>
                               <span className="text-lg opacity-40 group-hover:opacity-100 transition-opacity">{flower.typeIcon}</span>
                            </div>
                            <p className="text-lg font-serif italic text-white/90 group-hover:text-brand-accent transition-colors">
                               {flower.typeName}
                               <span className="text-[10px] font-mono text-white/20 uppercase tracking-tighter block mt-0.5">
                                  {flower.petals.name} • {flower.mood}
                               </span>
                            </p>
                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                               <div className="flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-[2px] border border-white/20" style={{ backgroundColor: flower.petals.hex }} />
                                  <span className="text-[9px] font-mono text-white/40 uppercase">{flower.petals.hex}</span>
                               </div>
                               <div className="flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: flower.stamen.hex }} />
                                  <span className="text-[10px] uppercase font-mono text-white/30 tracking-tighter">Center</span>
                               </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-8 flex items-center gap-6 border-t border-white/5">
                      <button 
                        onClick={() => setRandomBouquet(null)}
                        className="text-[9px] font-mono uppercase tracking-widest text-white/40 hover:text-brand-accent transition-colors"
                      >
                        × Dimiss Ensemble
                      </button>
                      <button 
                        onClick={handleBouquetShuffle}
                        className="text-[9px] font-mono uppercase tracking-widest text-brand-accent underline underline-offset-4 hover:opacity-70 transition-opacity"
                      >
                        New Harmony
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {analyzedBouquet && !isAnalyzingImage && (
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="max-w-7xl mx-auto mb-20 relative z-10"
            >
              <div className="bg-brand-accent/[0.05] border border-brand-accent/60 p-8 md:p-12 rounded-[4px] relative overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-16">
                  {/* Scanned Visualization */}
                  <div className="relative w-full lg:w-1/2 aspect-square max-w-[500px] mx-auto bg-black/40 rounded-full border border-brand-accent/20 flex items-center justify-center">
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full h-full">
                          {analyzedBouquet.map((flower, idx) => {
                            // Arrangement for up to 5 flowers
                            const layouts = [
                              { scale: 1.1, x: 0, y: 0, z: 20 },
                              { scale: 0.9, x: -90, y: -40, z: 10 },
                              { scale: 0.9, x: 90, y: -40, z: 10 },
                              { scale: 0.85, x: -70, y: 80, z: 5 },
                              { scale: 0.85, x: 70, y: 80, z: 5 },
                            ];
                            const pos = layouts[idx % layouts.length];
                            
                            return (
                              <div 
                                key={flower.id}
                                className="absolute transition-all duration-700" 
                                style={{ 
                                  top: '50%', 
                                  left: '50%', 
                                  transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                                  zIndex: pos.z
                                }}
                              >
                                <BalloonFlower 
                                  petals={flower.petals.hex}
                                  stamen={flower.stamen.hex}
                                  stem={flower.stem.hex}
                                  texture={flower.material}
                                  scale={pos.scale * 0.7}
                                />
                              </div>
                            );
                          })}
                        </div>
                     </div>
                     <div className="absolute -bottom-4 bg-brand-accent text-brand-bg px-4 py-1 font-mono text-[9px] uppercase tracking-widest rounded-full">
                        AI Reconstructed Bouquet
                     </div>
                  </div>

                  {/* Scanned Stats */}
                  <div className="flex-1 space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-brand-accent">Vision Scan</span>
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/40 rounded-full text-[8px] font-mono text-green-400 uppercase tracking-widest">
                          <Sparkles size={8} /> AI Verified
                        </span>
                      </div>
                      <h2 className="text-4xl lg:text-6xl font-serif italic mb-2">Image Extraction</h2>
                      <p className="text-white/40 font-mono text-[10px] tracking-widest uppercase">Detected {analyzedBouquet.length} organic components from your scan</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {analyzedBouquet.map((flower, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          key={flower.id} 
                          className="group bg-white/[0.02] border border-white/5 p-4 rounded hover:border-brand-accent/30 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                             <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">Comp #{idx + 1}</span>
                             <div className="px-1.5 py-0.5 rounded-sm bg-white/5 text-[7px] font-mono text-white/50">{flower.material}</div>
                          </div>
                          <p className="text-sm font-serif italic text-white/60 mb-3">{flower.name}</p>
                          <div className="flex gap-2">
                             <div className="flex-1 h-6 rounded-sm border border-white/10 overflow-hidden" title="Petals">
                                <div className="w-full h-full" style={{ backgroundColor: flower.petals.hex }} />
                             </div>
                             <div className="flex-1 h-6 rounded-sm border border-white/10 overflow-hidden" title="Stamen">
                                <div className="w-full h-full" style={{ backgroundColor: flower.stamen.hex }} />
                             </div>
                             <div className="flex-1 h-6 rounded-sm border border-white/10 overflow-hidden" title="Stem">
                                <div className="w-full h-full" style={{ backgroundColor: flower.stem.hex }} />
                             </div>
                          </div>
                          <div className="mt-2 flex justify-between">
                             <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">{flower.petals.hex}</span>
                             <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">{flower.mood}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="pt-8 flex items-center gap-6 border-t border-white/5">
                      <button 
                        onClick={() => setAnalyzedBouquet(null)}
                        className="text-[9px] font-mono uppercase tracking-widest text-white/40 hover:text-brand-accent transition-colors"
                      >
                        × Reset Scan
                      </button>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[9px] font-mono uppercase tracking-widest text-brand-accent underline underline-offset-4 hover:opacity-70 transition-opacity"
                      >
                        Scan Another
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
 
        {/* Balloon Twisting Masterclass */}
        <section className="max-w-7xl mx-auto mb-32 relative z-10 px-4 sm:px-0">
          <div className="mb-12 space-y-4 pt-20 border-t border-white/5">
             <div className="flex items-center gap-3">
                <Repeat size={14} className="text-brand-accent" />
                <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-brand-accent">Twisting Masterclass</h3>
             </div>
             <h2 className="text-4xl font-serif italic">Kỹ Thuật Xoắn Nghệ Thuật</h2>
             <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em] max-w-3xl leading-relaxed">
                Nền tảng của mọi tác phẩm vĩ đại nằm ở sự chuẩn xác trong từng mối xoắn. Từ những bước cơ bản đến các kỹ thuật nâng cao bậc thầy.
             </p>
          </div>

          <div className="space-y-16">
            {Array.from(new Set(TWISTING_TECHNIQUES.map(t => t.category))).map((category) => (
              <div key={category} className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-white/5" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-white/20 whitespace-nowrap">{category}</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {TWISTING_TECHNIQUES.filter(t => t.category === category).map((tech, idx) => (
                    <motion.div
                      key={tech.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="group bg-white/[0.02] border border-white/5 p-8 hover:bg-white/[0.03] hover:border-brand-accent/20 transition-all duration-700"
                    >
                      <div className="flex items-start justify-between mb-8">
                        <TechniqueIllustration type={tech.visualType} />
                        <div className="flex flex-col items-end">
                          <span className="text-[8px] font-mono text-white/10 group-hover:text-brand-accent/30 transition-colors uppercase">Tech_Idx</span>
                          <span className="text-sm font-mono text-white/5 group-hover:text-brand-accent/10 transition-colors">0{idx + 1}</span>
                        </div>
                      </div>

                      <h4 className="text-xl font-serif italic text-white/90 mb-4 group-hover:text-brand-accent transition-colors">
                        {tech.name}
                      </h4>
                      <p className="text-[11px] font-light text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                        {tech.description}
                      </p>

                      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex gap-1">
                           {[1, 2, 3].map(i => (
                             <div key={i} className={`w-1 h-1 rounded-full ${i <= (idx % 3 + 1) ? 'bg-brand-accent/40' : 'bg-white/5'}`} />
                           ))}
                        </div>
                        <span className="text-[8px] font-mono uppercase tracking-widest text-white/10">Verified Method</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Balloon Art Floral Anatomy */}
        <section className="max-w-7xl mx-auto mb-20 relative z-10">
          <div className="mb-10 space-y-2">
             <div className="flex items-center gap-3">
                <Grid2X2 size={14} className="text-brand-accent" />
                <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-brand-accent">Floral Anatomy</h3>
             </div>
             <h2 className="text-3xl font-serif italic">Kiểu Hoa Cơ Bản</h2>
             <p className="text-white/40 font-mono text-[9px] uppercase tracking-widest max-w-2xl leading-relaxed">
                Khám phá các hình dáng hoa đặc trưng trong nghệ thuật bong bóng, từ những cánh hoa cổ điển đến kỹ thuật xoắn phức tạp.
             </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {BASIC_FLOWER_TYPES.map((type, idx) => (
               <motion.div
                 key={type.id}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 viewport={{ once: true }}
                 className="group relative bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.04] hover:border-brand-accent/20 transition-all duration-500"
               >
                 <div className="text-3xl mb-6 opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                    {type.icon}
                 </div>
                 <h4 className="text-lg font-serif italic text-white/90 mb-3 group-hover:text-brand-accent transition-colors">
                    {type.name}
                 </h4>
                 <p className="text-xs text-white/50 leading-relaxed mb-6 font-light">
                    {type.description}
                 </p>
                 <div className="space-y-2 border-t border-white/5 pt-4">
                    {type.characteristics.map((char, cIdx) => (
                      <div key={cIdx} className="flex items-center gap-2">
                         <div className="w-1 h-1 rounded-full bg-brand-accent/30" />
                         <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">{char}</span>
                      </div>
                    ))}
                 </div>

                 {/* Interactive Techniques Masterclass */}
                 <TechniqueStepByStep typeId={type.id} />

                 {/* Decorative number */}
                 <div className="absolute top-4 right-4 font-mono text-[8px] text-white/10 group-hover:text-brand-accent/20 transition-colors">
                    0{idx + 1}
                 </div>
               </motion.div>
             ))}
          </div>
        </section>

      {/* Grid Layout */}
      <main className="max-w-7xl mx-auto relative z-10 pb-20">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode='popLayout'>
            {filteredPalettes.map((palette, index) => (
              <motion.div
                layout
                key={palette.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: index * 0.02 }}
                className="group relative bg-white/[0.03] border border-brand-border p-4 hover:bg-white/[0.05] transition-all duration-300 flex flex-col h-full"
              >
                {/* Status Bar */}
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                  <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">#{index + 1}</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-brand-accent/40" />
                    <div className="w-1 h-1 rounded-full bg-brand-accent/20" />
                  </div>
                </div>

                {/* Info & Visualization Toggle */}
                <div className="flex flex-col flex-1">
                  <h2 className="text-sm font-serif italic text-white/90 mb-4 group-hover:text-brand-accent transition-colors">
                    {palette.name}
                  </h2>

                  {/* Swatch-style color blocks */}
                  <div className="flex h-10 w-full mb-6 rounded-[2px] overflow-hidden border border-white/10">
                    <div className="flex-1" style={{ backgroundColor: palette.petals.hex }} />
                    <div className="flex-1" style={{ backgroundColor: palette.stamen.hex }} />
                    <div className="flex-1" style={{ backgroundColor: palette.stem.hex }} />
                  </div>
                  
                  <div className="flex flex-col gap-1 mb-6">
                    <ColorSwatch label="Petals" name={palette.petals.name} color={palette.petals.hex} />
                    <ColorSwatch label="Stamen" name={palette.stamen.name} color={palette.stamen.hex} />
                    <ColorSwatch label="Stem" name={palette.stem.name} color={palette.stem.hex} />
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 opacity-40 group-hover:opacity-100 transition-opacity flex justify-center h-28 grayscale group-hover:grayscale-0">
                  <BalloonFlower 
                    petals={palette.petals.hex}
                    stamen={palette.stamen.hex}
                    stem={palette.stem.hex}
                    scale={0.4}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Empty Slots */}
          {[...Array(2)].map((_, i) => (
             <div key={`empty-${i}`} className="border border-brand-border border-dashed opacity-10 flex items-center justify-center p-8 text-2xl font-light">
               +
             </div>
          ))}
        </motion.div>
      </main>

      {/* Footer Bar */}
      <footer className="max-w-7xl mx-auto mt-20 flex justify-between items-center text-[8px] font-mono uppercase tracking-[0.4em] opacity-30 border-t border-brand-border pt-8 pb-12 relative z-10">
        <span>Curated Collection // Series 01</span>
        <span className="hidden md:block italic">Aesthetic Engine — Designed for High Artistry</span>
        <span>Export: HEX / RGB / HSL</span>
      </footer>
    </div>
  );
}
