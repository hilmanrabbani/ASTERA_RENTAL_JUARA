'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Printer, Download, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { rupiah } from '@/lib/utils';
import InvoicePDF, { type InvoiceData } from '@/components/invoice/InvoicePDF';

export default function InvoicePage() {
  const params = useParams<{ kode: string }>();
  const [order, setOrder] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_code', params.kode)
        .single();

      if (error) console.error(error);
      else setOrder(data as InvoiceData);
      setLoading(false);
    })();
  }, [params.kode]);

  const downloadPDF = async () => {
    if (!order) return;
    setPdfLoading(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const blob = await pdf(<InvoicePDF order={order} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${order.order_code}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Gagal download PDF:', err);
      alert('Gagal generate PDF. Coba lagi.');
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="text-xl font-bold">Invoice tidak ditemukan</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white"
        >
          <ArrowLeft size={16} /> Kembali ke Home
        </Link>
      </div>
    );
  }

  const tanggalOrder = new Date(order.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-bold transition hover:border-gold hover:text-gold"
        >
          <ArrowLeft size={15} /> Kembali
        </Link>

        <button
          onClick={downloadPDF}
          disabled={pdfLoading}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:shadow-glow disabled:opacity-60"
        >
          {pdfLoading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Menyiapkan PDF…
            </>
          ) : (
            <>
              <Download size={15} /> Download PDF
            </>
          )}
        </button>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-bold transition hover:border-gold hover:text-gold"
        >
          <Printer size={15} /> Print
        </button>
      </div>

      {/* Preview Invoice */}
      <div className="rounded-3xl border border-line bg-surface/60 p-8 backdrop-blur-xl">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-brand-600">
              Astera Rental Bandung
            </h1>
            <p className="mt-1 text-sm text-muted">
              Jl. Hantap Raya, Babakan Surabaya
              <br />
              Kec. Kiaracondong, Kota Bandung
            </p>
            <p className="mt-1 text-sm text-muted">
              WA: 0812-2300-5912 · tamidbedul69@gmail.com
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-gold">
              INVOICE
            </p>
            <p className="mt-1 text-lg font-extrabold">{order.order_code}</p>
            <p className="mt-1 text-sm text-muted">{tanggalOrder}</p>
          </div>
        </div>

        {/* Customer & Car */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Ditagihkan Kepada:
            </p>
            <p className="mt-2 font-bold">{order.full_name}</p>
            <p className="text-sm text-muted">{order.whatsapp}</p>
            <p className="text-sm text-muted">{order.address}</p>
            <p className="text-sm text-muted">KTP: {order.ktp_number}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Detail Sewa:
            </p>
            <p className="mt-2 font-bold">{order.car_name}</p>
            <p className="text-sm text-muted">
              Mulai: {order.start_date} · {order.start_time}
            </p>
            <p className="text-sm text-muted">
              Selesai: {order.end_date} · {order.end_time}
            </p>
            <p className="text-sm text-muted">
              Layanan:{' '}
              {order.service_type === 'dengan_sopir' ? 'Dengan Sopir' : 'Lepas Kunci'}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-8 overflow-hidden rounded-xl border border-line">
          <table className="w-full">
            <thead className="bg-line/30">
              <tr className="text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-4 py-3">Deskripsi</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Harga</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line">
                <td className="px-4 py-4">
                  <p className="font-bold">Sewa {order.car_name}</p>
                  <p className="text-xs text-muted">
                    {order.start_date} s/d {order.end_date}
                  </p>
                </td>
                <td className="px-4 py-4 text-right">{order.duration_days} hari</td>
                <td className="px-4 py-4 text-right">{rupiah(order.price_per_day)}</td>
                <td className="px-4 py-4 text-right font-bold">
                  {rupiah(order.total_price)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="mt-6 flex justify-end border-t-2 border-gold/40 pt-4">
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              Total
            </p>
            <p className="text-2xl font-extrabold text-gold">
              {rupiah(order.total_price)}
            </p>
          </div>
        </div>

        {/* Payment */}
        <div className="mt-6 rounded-2xl border-2 border-gold/40 bg-gold/5 p-5">
          <div className="flex items-center gap-2 text-gold">
            <CheckCircle2 size={18} />
            <p className="font-extrabold uppercase tracking-wider">
              Metode Pembayaran
            </p>
          </div>
          <p className="mt-3 text-lg font-extrabold">💵 BAYAR DI TEMPAT (COD)</p>
          <p className="mt-2 text-sm text-muted">
            Pembayaran dilakukan saat pengambilan mobil atau saat mobil diantar ke lokasi
            Anda. Silakan siapkan uang tunai sejumlah total tagihan.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-line pt-6 text-center text-xs text-muted">
          <p>Terima kasih telah mempercayai Astera Rental Bandung.</p>
          <p className="mt-1">
            Invoice ini dibuat otomatis oleh sistem · Tidak perlu tanda tangan
          </p>
        </div>
      </div>
    </div>
  );
}