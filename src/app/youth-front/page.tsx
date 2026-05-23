import Link from 'next/link';
import { ArrowRight, CheckCircle2, Megaphone, ShieldCheck, Trophy, Users, MessageCircle, AlertTriangle, Leaf, Mic, FileText, MapPin, Zap, X } from 'lucide-react';
import { Navbar } from '../../components/Navbar';

const joinHref = '/youth-front/join';

const starterMission = [
  'Complete OTP verification.',
  'Choose your track.',
  'Join your district group.',
  'Invite 3 youth using your referral link.',
  'Report one real issue with photo or video proof.',
  'Help build or join a 10-member Youth Action Cell.',
];

const roles = [
  { icon: AlertTriangle, title: 'Issue Reporter', desc: 'Report real problems from your area: roads, water, garbage, electricity, corruption, campus problems, forest destruction and public service failure.' },
  { icon: Megaphone, title: 'Digital Volunteer', desc: 'Create reels, posters, memes, explainers, stories and campaign content.' },
  { icon: Users, title: 'Ground Volunteer', desc: 'Help with membership drives, public discussions, meetings, surveys and local activities.' },
  { icon: Leaf, title: 'Environment Volunteer', desc: 'Work on jungle bachao, water conservation, cleanliness, pollution and green drives.' },
  { icon: FileText, title: 'Research Volunteer', desc: 'Help with policy notes, RTI, data, reports and issue documentation.' },
  { icon: Mic, title: 'Public Speaker', desc: 'Join debates, discussions, live sessions and local public communication.' },
];

const growthLevels = [
  { level: 'Supporter', desc: 'You joined and verified your identity.' },
  { level: 'Contributor', desc: 'You invited youth or reported your first issue.' },
  { level: 'Active Volunteer', desc: 'You completed regular tasks.' },
  { level: 'Youth Action Cell Member', desc: 'You became part of a local 10-member team.' },
  { level: 'Youth Action Cell Captain', desc: 'You helped lead a verified local cell.' },
  { level: 'District Youth Organiser', desc: 'You helped coordinate multiple local cells.' },
  { level: 'State Youth Fellow', desc: 'You became part of the future leadership pipeline.' },
];

const cellRoles = [
  'Cell Captain',
  'Vice Captain',
  'Membership Lead',
  'Digital Creator',
  'Meme / Creative Lead',
  'Issue Reporter',
  'Event Lead',
  'Environment Lead',
  'Documentation Lead',
  'Discipline Lead',
];

const prohibitedActions = [
  'Violence',
  'Hate speech',
  'Fake news',
  'Harassment',
  'Threats',
  'Caste abuse',
  'Communal targeting',
  'Doxxing',
  'Personal attacks without verified proof',
];

export default function YouthFrontPage() {
  return (
    <div className="min-h-screen bg-[#F5FBF7] text-[#04330B] font-['Familjen_Grotesk'] pt-[70px] lg:pt-[92px]">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#04330B] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(187,247,208,0.18),transparent_32%)]" />
          <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-[#BBF7D0]">
              <Megaphone size={18} /> #CockroachCampusMovement
            </div>
            <h1 className="mt-7 text-4xl lg:text-7xl font-black tracking-[-0.05em] leading-[0.95]">
              PGP Youth Front
            </h1>
            <p className="mt-5 text-2xl lg:text-3xl font-bold text-[#BBF7D0]">
              Don't just watch politics. Build change.
            </p>
            <p className="mt-6 max-w-3xl text-lg text-white/78 leading-8">
              PGP Youth Front is a Rajasthan-wide youth action network for students, first-time voters, unemployed youth, young professionals, creators, ward volunteers and village organisers.
            </p>
            <p className="mt-4 max-w-3xl text-lg text-white/78 leading-8">
              Join to report real issues, invite youth, create content, build local Youth Action Cells and become a future leader.
            </p>
            <div className="mt-8 rounded-2xl bg-white/10 p-6 border border-white/20">
              <div className="text-xl font-black text-[#BBF7D0] mb-3">Your first mission:</div>
              <div className="grid gap-2 text-white/90 font-semibold">
                <div>• Join. Verify. Choose your track. Invite 3 youth. Report one real issue. Build your local team.</div>
              </div>
            </div>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link href={joinHref} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#22C55E] px-7 py-4 font-black text-[#04330B] shadow-xl shadow-black/20">
                Join PGP Youth Front <ArrowRight size={20} />
              </Link>
              <Link href="/youth-front/report-issue" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-4 font-black text-white">
                Report an Issue <AlertTriangle size={20} />
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/60">
              18+ can join as active youth members. 16–17 can join only as civic associates for safe civic, awareness and environment activities.
            </p>
          </div>
        </section>

        {/* What is this movement? */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">What is #CockroachCampusMovement?</h2>
          <div className="rounded-[32px] bg-white border border-[#DDEEE4] p-8 lg:p-12">
            <p className="text-lg text-[#04330B] font-semibold leading-8 mb-4">
              When the system becomes dirty, corrupt and disconnected from ordinary people, youth cannot remain silent spectators.
            </p>
            <p className="text-lg text-[#04330B] font-bold leading-8 mb-4">
              #CockroachCampusMovement is the public campaign of PGP Youth Front.
            </p>
            <div className="grid gap-3 mt-6">
              <div className="flex items-center gap-3 font-bold text-[#04330B]">
                <X size={20} className="text-[#DC2626]" /> It is not a joke.
              </div>
              <div className="flex items-center gap-3 font-bold text-[#04330B]">
                <X size={20} className="text-[#DC2626]" /> It is not just a meme.
              </div>
              <div className="flex items-center gap-3 font-bold text-[#04330B]">
                <CheckCircle2 size={20} className="text-[#16A34A]" /> It is a symbol of survival, resistance and organised youth action.
              </div>
            </div>
            <p className="mt-6 text-lg text-[#04330B] font-semibold leading-8">
              We are building a new generation of local leaders who can expose real problems, organise people, protect democracy, defend nature and create pressure for change.
            </p>
          </div>
        </section>

        {/* Not only college students */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">This is not only for college students</h2>
          <p className="text-lg text-[#587E67] font-semibold mb-8">You can join from:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'College or university',
              'Coaching institute',
              'Ward or mohalla',
              'Village or panchayat',
              'Digital creator community',
              'Environment volunteer group',
              'Young professional network',
              'School, only as civic associate if age is 16–17',
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-white border border-[#DDEEE4] p-5 font-bold text-[#04330B]">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-[#DCFCE7] p-6 border border-[#BBF7D0]">
            <p className="text-lg font-black text-[#04330B]">
              Wherever 10 verified youth come together, a Youth Action Cell can begin.
            </p>
          </div>
        </section>

        {/* What will you do after joining? */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">What will you do after joining?</h2>
          <p className="text-xl font-bold text-[#587E67] mb-8">Your Starter Mission</p>
          <div className="grid gap-4">
            {starterMission.map((task, index) => (
              <div key={task} className="rounded-2xl bg-white border border-[#DDEEE4] p-6 flex gap-4">
                <div className="shrink-0 w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                  <span className="text-2xl font-black text-[#04330B]">{index + 1}</span>
                </div>
                <div className="flex-1 flex items-center">
                  <div className="text-lg font-bold text-[#04330B]">{task}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Choose your track */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">Choose your track</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div key={role.title} className="rounded-2xl bg-white border border-[#DDEEE4] p-6">
                <role.icon className="text-[#16A34A]" size={32} />
                <h3 className="mt-4 text-xl font-black text-[#04330B]">{role.title}</h3>
                <p className="mt-3 text-[#587E67] font-semibold leading-7">{role.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What happens to reported issues */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">Your issue will not disappear into a form</h2>
          <div className="rounded-[32px] bg-white border border-[#DDEEE4] p-8 lg:p-12">
            <p className="text-lg text-[#04330B] font-semibold leading-8 mb-6">
              When you report an issue, it enters the PGP Youth Front issue system.
            </p>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {['Submitted', 'Reviewed', 'Verified', 'Assigned', 'Sent to Authority / Public Campaign', 'Follow-up', 'Resolved or Escalated'].map((status, index) => (
                <div key={status} className="flex items-center">
                  <span className="px-3 py-2 rounded-lg bg-[#DCFCE7] text-[#04330B] font-bold text-sm">{status}</span>
                  {index < 6 && <ArrowRight size={16} className="mx-1 text-[#587E67]" />}
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-[#FEF3C7] p-4 border border-[#F59E0B]">
              <p className="text-[#04330B] font-semibold">
                Not every issue will become a public campaign. Repeated, verified and high-impact issues will be prioritised.
              </p>
            </div>
            <p className="mt-6 text-lg text-[#04330B] font-semibold leading-8">
              This helps PGP build a real people's issue map of Rajasthan.
            </p>
          </div>
        </section>

        {/* Youth Action Cell */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">Start a 10-member Youth Action Cell</h2>
          <p className="text-lg text-[#587E67] font-semibold mb-8">A Youth Action Cell can be formed in a:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {['Campus', 'Ward', 'Village', 'Mohalla', 'Coaching hub', 'Digital creator group', 'Environment group'].map((location) => (
              <div key={location} className="rounded-2xl bg-white border border-[#DDEEE4] p-4 font-bold text-[#04330B] text-center">
                {location}
              </div>
            ))}
          </div>
          <div className="rounded-[32px] bg-[#DCFCE7] border border-[#BBF7D0] p-8">
            <h3 className="text-xl font-black text-[#04330B] mb-4">A cell becomes active when it has:</h3>
            <div className="grid gap-3">
              {[
                '10 OTP-verified members',
                'One responsible captain',
                'One completed activity',
                'District-level approval',
              ].map((req) => (
                <div key={req} className="flex items-center gap-3 font-bold text-[#04330B]">
                  <CheckCircle2 size={20} className="text-[#16A34A]" /> {req}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10 roles in every cell */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">Every member gets a role</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {cellRoles.map((role) => (
              <div key={role} className="rounded-2xl bg-white border border-[#DDEEE4] p-4 font-bold text-[#04330B] text-center">
                {role}
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-[#04330B] p-6 text-white">
            <p className="text-lg font-black">This is not a crowd. This is an organised youth structure.</p>
          </div>
        </section>

        {/* Growth levels */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">Grow from member to leader</h2>
          <div className="space-y-4">
            {growthLevels.map((item, index) => (
              <div key={item.level} className="rounded-2xl bg-white border border-[#DDEEE4] p-6 flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                  <span className="text-xl font-black text-[#04330B]">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="text-xl font-black text-[#04330B]">{item.level}</div>
                  <div className="text-[#587E67] font-semibold mt-1">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Code of conduct */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <h2 className="text-3xl lg:text-5xl font-black mb-6">Discipline is non-negotiable</h2>
          <div className="rounded-[32px] bg-[#FEE2E2] border border-[#DC2626] p-8 lg:p-12">
            <p className="text-lg font-black text-[#DC2626] mb-6">PGP Youth Front does not allow:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {prohibitedActions.map((action) => (
                <div key={action} className="flex items-center gap-2 font-bold text-[#04330B]">
                  <X size={18} className="text-[#DC2626]" /> {action}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl bg-[#04330B] p-6 text-white">
              <p className="text-lg font-black">This movement is fearless, but responsible.</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-[#04330B] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.35),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(187,247,208,0.18),transparent_32%)]" />
          <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24 text-center">
            <h2 className="text-3xl lg:text-5xl font-black mb-6">Rajasthan needs youth who act</h2>
            <p className="max-w-3xl mx-auto text-lg text-white/78 leading-8 mb-8">
              Politics will not change by watching reels, complaining in private, or waiting for old parties to improve.
            </p>
            <div className="max-w-2xl mx-auto space-y-4 mb-8">
              <div className="text-lg font-bold text-[#BBF7D0]">Join PGP Youth Front.</div>
              <div className="text-lg font-bold text-[#BBF7D0]">Report real issues.</div>
              <div className="text-lg font-bold text-[#BBF7D0]">Build your local Youth Action Cell.</div>
              <div className="text-lg font-bold text-[#BBF7D0]">Become a change maker.</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={joinHref} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#22C55E] px-8 py-4 font-black text-[#04330B] shadow-xl shadow-black/20">
                Join PGP Youth Front <ArrowRight size={20} />
              </Link>
              <Link href="/youth-front/report-issue" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-8 py-4 font-black text-white">
                Report an Issue <AlertTriangle size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* Positioning line */}
        <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
          <div className="rounded-[32px] bg-[#DCFCE7] border border-[#BBF7D0] p-8 lg:p-12 text-center">
            <p className="text-xl lg:text-2xl font-black text-[#04330B] leading-8">
              PGP Youth Front is not just a student wing. It is a Rajasthan-wide youth action network for democracy, environment, clean governance and local leadership.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
