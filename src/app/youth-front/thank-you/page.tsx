import Link from 'next/link';
import { CheckCircle2, Copy, MessageCircle, Users, Download } from 'lucide-react';
import { Navbar } from '../../../components/Navbar';

export default function YouthFrontThankYouPage() {
  return (
    <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 lg:px-8 py-14">
        <section className="rounded-[36px] border border-[#BBF7D0] bg-white p-8 lg:p-12 text-center shadow-[0px_20px_60px_rgba(0,0,0,0.08)]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#DCFCE7]">
            <CheckCircle2 className="text-[#16A34A]" size={44} />
          </div>
          <h1 className="mt-7 text-4xl lg:text-6xl font-black tracking-[-0.05em]">Welcome to PGP Youth Front</h1>
          <p className="mt-4 text-lg font-semibold text-[#587E67]">You are now part of #CockroachCampusMovement.</p>

          <div className="mt-8 rounded-2xl bg-[#DCFCE7] p-6 text-left">
            <div className="text-xl font-black text-[#04330B] mb-4">Your first mission:</div>
            <div className="mt-4 grid gap-3">
              {[
                'Join your district WhatsApp group.',
                'Invite 3 youth using your referral link.',
                'Report one real issue from your area.',
                'Choose your role.',
                'Help build a 10-member Youth Action Cell.',
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-white p-4 font-bold">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#16A34A] text-white text-sm">{index + 1}</span>
                  <span className="text-[#04330B]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-8 text-lg font-black text-[#04330B]">Your work starts now.</p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/youth-front/my-dashboard" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#04330B] px-7 py-4 font-black text-white">
              Go to Dashboard
            </Link>
            <Link href="/youth-front/report-issue" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#BBF7D0] bg-white px-7 py-4 font-black text-[#04330B]">
              <Users size={20} /> Report First Issue
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-[#587E67]">
            Check your dashboard for your referral link and district WhatsApp group.
          </p>
        </section>
      </main>
    </div>
  );
}
