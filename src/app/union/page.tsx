import Link from 'next/link';
import { ArrowRight, Users, Shield, FileText, Phone } from 'lucide-react';
import { Navbar } from '../../components/Navbar';

export default function UnionPage() {
  return (
    <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#04330B] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(187,247,208,0.18),transparent_32%)]" />
          <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24">
            <h1 className="text-4xl lg:text-7xl font-black tracking-[-0.05em] leading-[0.95]">
              PGP Union Network
            </h1>
            <p className="mt-5 text-2xl lg:text-3xl font-bold text-[#BBF7D0]">
              Strength in Unity
            </p>
            <p className="mt-6 max-w-3xl text-lg text-white/78 leading-8">
              PGP Union Network empowers unorganized workers — e-rickshaw drivers, gig workers, street vendors, and daily wage earners — to organize, protect their rights, and build collective strength.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link href="/union/join" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#22C55E] px-7 py-4 font-black text-[#04330B] shadow-xl shadow-black/20">
                Join Union <ArrowRight size={20} />
              </Link>
              <Link href="/union/login" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-4 font-black text-white">
                Login <Users size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* What is Union Network */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">What is PGP Union Network?</h2>
          <div className="rounded-[32px] bg-white border border-[#DDEEE4] p-8 lg:p-12">
            <p className="text-lg text-[#04330B] font-semibold leading-8 mb-4">
              Unorganized workers are the backbone of our economy, yet they have no collective voice, no legal protection, and no bargaining power.
            </p>
            <p className="text-lg text-[#04330B] font-bold leading-8 mb-4">
              PGP Union Network brings these workers together into a unified force.
            </p>
            <div className="grid gap-3 mt-6">
              <div className="flex items-center gap-3 font-bold text-[#04330B]">
                <Shield size={20} className="text-[#16A34A]" /> Legal protection and rights awareness
              </div>
              <div className="flex items-center gap-3 font-bold text-[#04330B]">
                <Users size={20} className="text-[#16A34A]" /> Collective bargaining power
              </div>
              <div className="flex items-center gap-3 font-bold text-[#04330B]">
                <FileText size={20} className="text-[#16A34A]" /> Digital ID cards and documentation
              </div>
              <div className="flex items-center gap-3 font-bold text-[#04330B]">
                <Phone size={20} className="text-[#16A34A]" /> Direct communication and support
              </div>
            </div>
          </div>
        </section>

        {/* Who can join */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">Who can join?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'E-rickshaw drivers',
              'Gig workers',
              'Street vendors',
              'Daily wage earners',
              'Construction workers',
              'Domestic workers',
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-white border border-[#DDEEE4] p-5 font-bold text-[#04330B]">
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">Union Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Digital ID Card', desc: 'Get an official union ID card with your photo and details' },
              { title: 'Legal Support', desc: 'Access to legal advice and support for workplace issues' },
              { title: 'Collective Voice', desc: 'Your voice matters when thousands stand together' },
              { title: 'Government Representation', desc: 'Direct channel to raise issues with authorities' },
            ].map((benefit) => (
              <div key={benefit.title} className="rounded-2xl bg-white border border-[#DDEEE4] p-6">
                <h3 className="text-xl font-black text-[#04330B]">{benefit.title}</h3>
                <p className="mt-3 text-[#587E67] font-semibold leading-7">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-[#04330B] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(187,247,208,0.18),transparent_32%)]" />
          <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24 text-center">
            <h2 className="text-3xl lg:text-5xl font-black mb-6">Together we are stronger</h2>
            <p className="max-w-3xl mx-auto text-lg text-white/78 leading-8 mb-8">
              Alone we are vulnerable. Together we are powerful. Join the PGP Union Network today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/union/join" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#22C55E] px-8 py-4 font-black text-[#04330B] shadow-xl shadow-black/20">
                Join Union <ArrowRight size={20} />
              </Link>
              <Link href="/union/login" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-8 py-4 font-black text-white">
                Member Login <Users size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
