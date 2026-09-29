export type CarStatus = 'available' | 'rented' | 'maintenance';

export interface Car {
  id: string;
  name: string;
  brand: string;
  category: string;
  image_url: string;
  transmission: string;
  capacity: number;
  price_per_day: number;
  status: CarStatus;
  description: string;
  is_featured: boolean;
}

export const dummyCars: Car[] = [
  {
    id: 'car-001',
    name: 'Toyota Avanza',
    brand: 'Toyota',
    category: 'MPV',
    image_url:
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=1200&q=80',
    transmission: 'Matic',
    capacity: 7,
    price_per_day: 350000,
    status: 'available',
    description: 'MPV keluarga yang nyaman dan irit untuk perjalanan dalam & luar kota.',
    is_featured: true,
  },
  {
    id: 'car-002',
    name: 'Honda Brio',
    brand: 'Honda',
    category: 'City Car',
    image_url:
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80',
    transmission: 'Matic',
    capacity: 5,
    price_per_day: 300000,
    status: 'available',
    description: 'City car lincah dan hemat BBM, cocok untuk mobilitas perkotaan.',
    is_featured: true,
  },
  {
    id: 'car-003',
    name: 'Toyota Innova Zenix',
    brand: 'Toyota',
    category: 'MPV',
    image_url:
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80',
    transmission: 'Matic',
    capacity: 7,
    price_per_day: 650000,
    status: 'available',
    description: 'MPV premium dengan kabin lega, cocok untuk perjalanan bisnis & keluarga.',
    is_featured: true,
  },
  {
    id: 'car-004',
    name: 'Mitsubishi Pajero Sport',
    brand: 'Mitsubishi',
    category: 'SUV',
    image_url:
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80',
    transmission: 'Matic',
    capacity: 7,
    price_per_day: 850000,
    status: 'available',
    description: 'SUV tangguh dengan performa tinggi untuk segala medan.',
    is_featured: false,
  },
  {
    id: 'car-005',
    name: 'Toyota Alphard',
    brand: 'Toyota',
    category: 'Luxury',
    image_url:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
    transmission: 'Matic',
    capacity: 7,
    price_per_day: 2000000,
    status: 'available',
    description: 'MPV mewah dengan kenyamanan kelas eksekutif untuk tamu VIP.',
    is_featured: true,
  },
  {
    id: 'car-006',
    name: 'Daihatsu Terios',
    brand: 'Daihatsu',
    category: 'SUV',
    image_url:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80',
    transmission: 'Manual',
    capacity: 7,
    price_per_day: 450000,
    status: 'rented',
    description: 'SUV ringkas 7 penumpang dengan konsumsi BBM efisien.',
    is_featured: false,
  },
  {
    id: 'car-007',
    name: 'Honda HR-V',
    brand: 'Honda',
    category: 'SUV',
    image_url:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80',
    transmission: 'Matic',
    capacity: 5,
    price_per_day: 550000,
    status: 'available',
    description: 'SUV compact modern dengan desain sporty dan kabin premium.',
    is_featured: false,
  },
  {
    id: 'car-008',
    name: 'Suzuki Ertiga',
    brand: 'Suzuki',
    category: 'MPV',
    image_url:
      'https://images.unsplash.com/photo-1493238792000-8113da705763?w=1200&q=80',
    transmission: 'Matic',
    capacity: 7,
    price_per_day: 380000,
    status: 'available',
    description: 'MPV keluarga dengan kabin luas dan harga sewa terjangkau.',
    is_featured: false,
  },
];