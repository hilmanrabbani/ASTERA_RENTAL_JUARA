import AnimatedBackground from '@/components/ui/AnimatedBackground';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingSocial from '@/components/layout/FloatingSocial';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main className="relative z-10 pt-28">{children}</main>
      <Footer />
      <FloatingSocial />
    </>
  );
}
