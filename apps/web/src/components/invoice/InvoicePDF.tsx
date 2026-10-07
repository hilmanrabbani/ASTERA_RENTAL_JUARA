import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: '#bfa048',
    paddingBottom: 16,
    marginBottom: 20,
  },
  brand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 6,
  },
  brandSub: {
    fontSize: 9,
    color: '#64748b',
    lineHeight: 1.5,
  },
  invoiceLabel: {
    fontSize: 9,
    color: '#bfa048',
    letterSpacing: 3,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'right',
  },
  invoiceCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'right',
    marginBottom: 2,
  },
  invoiceDate: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'right',
  },
  sectionGrid: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sectionHalf: {
    flex: 1,
    paddingRight: 10,
  },
  sectionLabel: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  customerName: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  text: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.6,
  },
  table: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 10,
  },
  colDesc: { flex: 3, paddingHorizontal: 8 },
  colQty: { flex: 1, paddingHorizontal: 8, textAlign: 'right' },
  colPrice: { flex: 1.5, paddingHorizontal: 8, textAlign: 'right' },
  colTotal: { flex: 1.5, paddingHorizontal: 8, textAlign: 'right' },
  tableHeaderText: {
    fontSize: 8,
    color: '#64748b',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#bfa048',
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 20,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#bfa048',
  },
  paymentBox: {
    marginTop: 20,
    padding: 14,
    borderWidth: 2,
    borderColor: '#bfa048',
    borderRadius: 6,
    backgroundColor: '#fef9e7',
  },
  paymentTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  paymentMethod: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  paymentNote: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    fontSize: 8,
    color: '#94a3b8',
  },
});

export interface InvoiceData {
  order_code: string;
  car_name: string;
  full_name: string;
  whatsapp: string;
  address: string;
  ktp_number: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  duration_days: number;
  service_type: string;
  price_per_day: number;
  total_price: number;
  status: string;
  created_at: string;
}

const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n || 0);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default function InvoicePDF({ order }: { order: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Astera Rental Bandung</Text>
            <Text style={styles.brandSub}>
              Jl. Hantap Raya, Babakan Surabaya
              {'\n'}
              Kec. Kiaracondong, Kota Bandung
              {'\n'}
              WA: 0812-2300-5912 · tamidbedul69@gmail.com
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceLabel}>INVOICE</Text>
            <Text style={styles.invoiceCode}>{order.order_code}</Text>
            <Text style={styles.invoiceDate}>{formatDate(order.created_at)}</Text>
          </View>
        </View>

        <View style={styles.sectionGrid}>
          <View style={styles.sectionHalf}>
            <Text style={styles.sectionLabel}>Ditagihkan Kepada</Text>
            <Text style={styles.customerName}>{order.full_name}</Text>
            <Text style={styles.text}>{order.whatsapp}</Text>
            <Text style={styles.text}>{order.address}</Text>
            <Text style={styles.text}>KTP: {order.ktp_number}</Text>
          </View>
          <View style={styles.sectionHalf}>
            <Text style={styles.sectionLabel}>Detail Sewa</Text>
            <Text style={styles.customerName}>{order.car_name}</Text>
            <Text style={styles.text}>
              Mulai: {order.start_date} · {order.start_time}
            </Text>
            <Text style={styles.text}>
              Selesai: {order.end_date} · {order.end_time}
            </Text>
            <Text style={styles.text}>
              Layanan:{' '}
              {order.service_type === 'dengan_sopir' ? 'Dengan Sopir' : 'Lepas Kunci'}
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.colDesc}>
              <Text style={styles.tableHeaderText}>Deskripsi</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={styles.tableHeaderText}>Qty</Text>
            </View>
            <View style={styles.colPrice}>
              <Text style={styles.tableHeaderText}>Harga</Text>
            </View>
            <View style={styles.colTotal}>
              <Text style={styles.tableHeaderText}>Total</Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.colDesc}>
              <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                Sewa {order.car_name}
              </Text>
              <Text style={{ fontSize: 8, color: '#64748b', marginTop: 2 }}>
                {order.start_date} s/d {order.end_date}
              </Text>
            </View>
            <View style={styles.colQty}>
              <Text style={styles.text}>{order.duration_days} hari</Text>
            </View>
            <View style={styles.colPrice}>
              <Text style={styles.text}>{rupiah(order.price_per_day)}</Text>
            </View>
            <View style={styles.colTotal}>
              <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                {rupiah(order.total_price)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>{rupiah(order.total_price)}</Text>
        </View>

        <View style={styles.paymentBox}>
          <Text style={styles.paymentTitle}>METODE PEMBAYARAN</Text>
          <Text style={styles.paymentMethod}>BAYAR DI TEMPAT (COD)</Text>
          <Text style={styles.paymentNote}>
            Pembayaran dilakukan saat pengambilan mobil atau saat mobil diantar ke
            lokasi Anda. Silakan siapkan uang tunai sejumlah total tagihan.
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>Terima kasih telah mempercayai Astera Rental Bandung.</Text>
          <Text style={{ marginTop: 3 }}>
            Invoice ini dibuat otomatis oleh sistem · Tidak perlu tanda tangan
          </Text>
          <Text style={{ marginTop: 4, fontWeight: 'bold' }}>
            Dicetak: {formatDate(new Date().toISOString())}
          </Text>
        </View>
      </Page>
    </Document>
  );
}