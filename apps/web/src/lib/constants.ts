export const CONTACT = {
  whatsappRaw: '6281223005912',
  whatsappDisplay: '0812-2300-5912',
  instagram: 'https://www.instagram.com/astera.bdg/',
  email: 'tamidbedul69@gmail.com',
  address: 'Jl. Hantap Raya, Babakan Surabaya, Kec. Kiaracondong, Kota Bandung, Jawa Barat 40281',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=3JMX%2BWPC+Bandung',
  mapsEmbed: 'https://www.google.com/maps?q=3JMX%2BWPC+Bandung&z=17&output=embed',
};

export const WA_LINK = `https://wa.me/${CONTACT.whatsappRaw}`;
export const IG_LINK = CONTACT.instagram;
export const MAIL_LINK = `mailto:${CONTACT.email}?subject=Informasi%20Rental%20Mobil%20Astera`;

export const CATEGORIES = ['City Car', 'MPV', 'SUV', 'Luxury', 'Van'] as const;