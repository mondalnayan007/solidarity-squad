import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ShieldCheck, Loader2, ArrowRight, Trophy, UserRound, Mail } from "lucide-react";
import { useStore } from "../context/StoreContext";

const DEMO_OTP = "1971"; // Bangladesh independence year — demo code

export default function Login() {
  const { login, user, toast } = useStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const next = searchParams.get("next") || "/account";

  const [step, setStep] = useState("phone"); // phone → otp → profile
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => { document.title = "Login / Register | Solidarity Squad"; }, []);
  useEffect(() => { if (user) navigate(next, { replace: true }); }, [user]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (cooldown <= 0) return; const id = setInterval(() => setCooldown((c) => c - 1), 1000); return () => clearInterval(id); }, [cooldown]);

  const phoneValid = /^01[0-9]{9}$/.test(phone.replace(/-/g, ""));

  const sendOtp = () => {
    if (!phoneValid) return toast("Enter a valid 11-digit mobile (01XXXXXXXXX)");
    setBusy(true);
    setTimeout(() => { setBusy(false); setStep("otp"); setCooldown(30); toast(`OTP sent to ${phone} — demo code 1971`); }, 900);
  };

  const verifyOtp = (code) => {
    if ((code ?? otp.join("")) !== DEMO_OTP) return toast("Wrong OTP — hint: 1971");
    setBusy(true);
    setTimeout(() => { setBusy(false); setStep("profile"); }, 700);
  };

  const finish = () => {
    if (name.trim().length < 2) return toast("Please enter your name");
    login(name.trim(), phone, email.trim());
    navigate(next, { replace: true });
  };

  const otpInput = (i) => (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp]; nextOtp[i] = v; setOtp(nextOtp);
    if (v && i < 3) document.getElementById(`otp-${i + 1}`)?.focus();
    if (nextOtp.join("").length === 4) setTimeout(() => verifyOtp(nextOtp.join("")), 150);
  };

  const steps = useMemo(() => ["phone", "otp", "profile"], []);

  return (
    <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-line lg:grid-cols-2 mx-4 my-8 lg:mx-auto">
      {/* Brand panel */}
      <div className="hero-beam relative hidden flex-col justify-between p-10 text-white lg:flex">
        <Link to="/" className="flex w-max items-center gap-2 text-gold"><Trophy className="h-6 w-6" /><span className="font-display text-xl font-extrabold">SOLIDARITY SQUAD</span></Link>
        <div>
          <h1 className="font-display text-6xl font-extrabold leading-[0.95]">ONE SQUAD.<br />EVERY<br />SPORT.</h1>
          <p className="mt-4 max-w-xs text-sm text-white/85">Log in with just your phone — OTP only, no passwords to forget.</p>
          <ul className="mt-6 space-y-2 text-sm text-white/90">
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> Order history &amp; one-tap re-order</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> Live tracking &amp; SMS updates</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" /> Member prices &amp; early access to campaigns</li>
          </ul>
        </div>
        <p className="text-[11px] text-white/60">By continuing you agree to our Terms &amp; Privacy Policy.</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center bg-surf p-6 sm:p-10">
        <div className="mb-5 flex items-center gap-2" aria-hidden="true">
          {steps.map((s, i) => {
            const idx = steps.indexOf(step);
            return <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= idx ? "bg-brand" : "bg-line"}`} />;
          })}
        </div>

        {step === "phone" && (
          <>
            <h2 className="font-display text-4xl font-extrabold">LOGIN / <span className="text-brand">REGISTER</span></h2>
            <p className="mt-1 text-sm text-mut">Enter your mobile number — we&apos;ll text you a one-time code.</p>
            <label className="mt-6 mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-mut" htmlFor="login-phone">Mobile number</label>
            <div className="flex gap-2">
              <span className="grid h-12 w-16 place-items-center rounded-xl border border-line bg-bg font-bold">🇧🇩 +880</span>
              <input id="login-phone" value={phone} onChange={(e) => setPhone(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendOtp()} placeholder="01XXXXXXXXX" inputMode="numeric" autoFocus className="field h-12 flex-1 text-lg tracking-wider" />
            </div>
            <button onClick={sendOtp} disabled={busy || !phoneValid} className="btn-brand mt-4 h-12 w-full text-base disabled:opacity-50">
              {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Send OTP <ArrowRight className="h-5 w-5" /></>}
            </button>
            <p className="mt-3 text-center text-[11px] text-mut">New here? The same OTP creates your account automatically.</p>
          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="font-display text-4xl font-extrabold">ENTER <span className="text-brand">OTP</span></h2>
            <p className="mt-1 text-sm text-mut">Code sent to <b className="text-ink">{phone}</b>. Demo code: <b className="font-mono text-brand">1971</b></p>
            <div className="mt-6 flex justify-center gap-3">
              {otp.map((d, i) => (
                <input key={i} id={`otp-${i}`} value={d} onChange={otpInput(i)}
                  onKeyDown={(e) => e.key === "Backspace" && !d && i > 0 && document.getElementById(`otp-${i - 1}`)?.focus()}
                  inputMode="numeric" maxLength={1} autoFocus={i === 0} aria-label={`OTP digit ${i + 1}`}
                  className="h-16 w-14 rounded-2xl border border-line bg-bg text-center font-display text-3xl font-extrabold outline-none focus:border-brand focus:ring-2 focus:ring-brand/30" />
              ))}
            </div>
            <button onClick={() => verifyOtp()} disabled={busy || otp.join("").length < 4} className="btn-brand mt-5 h-12 w-full disabled:opacity-50">
              {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & continue"}
            </button>
            <button onClick={() => setStep("phone")} className="mt-3 text-center text-xs font-bold text-mut hover:text-ink">← Change number</button>
            <button onClick={sendOtp} disabled={cooldown > 0 || busy} className="mt-1 text-center text-xs font-bold text-brand disabled:text-mut">
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
            </button>
          </>
        )}

        {step === "profile" && (
          <>
            <h2 className="font-display text-4xl font-extrabold">ALMOST <span className="text-brand">THERE</span></h2>
            <p className="mt-1 text-sm text-mut">Tell us your name so we can personalize your orders.</p>
            <label className="mt-6 mb-1.5 flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-mut" htmlFor="login-name"><UserRound className="h-4 w-4" />Full name</label>
            <input id="login-name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && finish()} placeholder="e.g. Dulal Ahmed" autoFocus className="field h-12" />
            <label className="mt-3 mb-1.5 flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-mut" htmlFor="login-email"><Mail className="h-4 w-4" />Email (optional · invoices)</label>
            <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && finish()} placeholder="you@example.com" className="field h-12" />
            <button onClick={finish} className="btn-brand mt-4 h-12 w-full text-base">Enter the squad <ArrowRight className="h-5 w-5" /></button>
          </>
        )}
      </div>
    </div>
  );
}
