import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Circle,
  Command,
  Eye,
  EyeOff,
  Fingerprint,
  Layers3,
  LockKeyhole,
  Mail,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";
import Axios from "../api/axios.js";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/auth/register", formData);
      console.log(response.data);
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      toast.success("Account created successfully. Log In into your account");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // for google login

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await Axios.post(
        "/auth/google",
        {
          credential: credentialResponse.credential,
        },
        {
          withCredentials: true,
        },
      );

      toast.success(result.data.message);
      navigate("/tasks");
    } catch (error) {
      console.error(
        "Google signup failed:",
        error.response?.data?.message || error.message,
      );

      toast.error(
        error.response?.data?.message || "Google authentication failed",
      );
    }
  };

  const handleClick = () => {
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 1000);
  };
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#080914] text-white selection:bg-violet-500/30">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-violet-700/15 blur-[140px]" />
        <div className="absolute -right-32 bottom-0 h-[450px] w-[450px] rounded-full bg-indigo-600/15 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0b_1px,transparent_1px)] [background-size:26px_26px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between px-4 py-5 sm:px-10 lg:px-16">
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-600/25">
            <Command size={21} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight">
            task<span className="text-violet-400">flow</span>
            <span className="ml-1 text-violet-400">.</span>
          </span>
        </a>

        <div className="hidden items-center gap-2 text-sm text-slate-400 sm:flex">
          Already have an account?
          <Link
            to={"/login"}
            className="ml-1 font-semibold text-white transition hover:text-violet-300"
          >
            Log in <ArrowUpRight className="ml-1 inline" size={15} />
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <section className="relative z-10 mx-auto grid max-w-[1440px] items-center gap-8 px-4 pb-16 pt-6 sm:px-10 lg:grid-cols-2 lg:gap-12 lg:px-16 lg:pb-8 lg:pt-8">
        {/* Left: Brand storytelling */}
        <div className="mx-auto w-full max-w-xl lg:mx-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-4 py-2 text-xs font-medium tracking-wide text-violet-200">
            <Sparkles size={14} className="text-violet-400" />
            YOUR NEXT CHAPTER STARTS HERE
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>

          <h1 className="max-w-xl text-3xl font-semibold leading-[1.12] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
            Make room for
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
              meaningful work.
            </span>
          </h1>

          <p className="mt-1 max-w-md text-base leading-8 text-slate-400 sm:text-lg">
            Big ideas deserve better than sticky notes. Bring your tasks, plans,
            and progress together in one beautifully organized space.
          </p>

          {/* Original dashboard preview */}
          <div className="relative mt-4 max-w-lg">
            <div className="absolute -inset-5 rounded-[32px] bg-gradient-to-br from-violet-600/15 via-indigo-500/5 to-transparent blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.10] bg-[#111321]/90 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-5">
                <div>
                  <p className="text-xs text-slate-500">MONDAY, OCTOBER 19</p>
                  <h3 className="mt-2 text-lg font-semibold">Your workspace</h3>
                </div>
                <button
                  onClick={handleClick}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
                >
                  <Layers3 size={19} className="text-violet-300" />
                </button>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-200">
                  Today's focus
                </p>
                <span className="text-xs text-slate-500">
                  Keep up the momentum
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 rounded-xl border border-violet-400/20 bg-violet-500/[0.07] p-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-violet-500">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="flex-1 text-sm text-slate-300">
                    Plan the weekly roadmap
                  </span>
                  <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-300">
                    Done
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="h-5 w-5 shrink-0 rounded-md border border-slate-600" />
                  <span className="flex-1 text-sm text-slate-300">
                    Design the new experience
                  </span>
                  <span className="rounded-md bg-amber-400/10 px-2 py-1 text-[10px] font-medium text-amber-300">
                    In progress
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="h-5 w-5 shrink-0 rounded-md border border-slate-600" />
                  <span className="flex-1 text-sm text-slate-300">
                    Review project milestones
                  </span>
                  <span className="text-[10px] text-slate-500">4:30 PM</span>
                </div>
              </div>

              <div
                onClick={() => toast.success("Create acount first")}
                className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.07] bg-gradient-to-r from-violet-500/[0.09] to-indigo-500/[0.06] p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15">
                  <Sparkles size={17} className="text-violet-300" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-200">
                    Small steps. Big progress.
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    You're building momentum.
                  </p>
                </div>
                <ArrowUpRight size={17} className="ml-auto text-violet-300" />
              </div>
            </div>

            {/* Floating detail */}
            {showMessage && (
              <div className="absolute -right-3 -top-5 flex items-center gap-2 rounded-xl border border-white/10 bg-[#1a1b2c] px-3 py-2.5 shadow-xl sm:-right-7">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-[11px] font-medium">One step closer! ✨</p>
                  {/* <p className="text-[10px] text-slate-500">
                    Progress looks good on you.
                  </p> */}
                </div>
              </div>
            )}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              Stay organized
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              Focus on what matters
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-emerald-400" />
              Celebrate progress
            </span>
          </div>
        </div>

        {/* Right: Sign up form */}
        <div className="mx-auto w-full max-w-[450px] lg:ml-auto lg:mr-0">
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.11] bg-[#111321]/85 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8 md:p-10">
            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-violet-500/10 blur-[65px]" />

            <div className="relative">
              <p className="text-sm font-medium text-violet-300">
                GET STARTED — IT'S FREE
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-4xl">
                Create your account
              </h2>

              {/* Social sign-up visual */}

              <div className="flex justify-center mt-6 rounded-xl ">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error("Google sign-in failed");
                  }}
                  ux_mode="popup"
                  theme="outline"
                  size="large"
                  shape="rectangular"
                  text="signup_with"
                  width="320"
                />
              </div>

              <div className="my-5 flex items-center ">
                <div className="h-px flex-1 bg-white/[0.09]" />
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  or with email
                </span>
                <div className="h-px flex-1 bg-white/[0.09]" />
              </div>

              <form className="space-y-3" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="fullname"
                    className="mb-2.5 block text-xs font-medium text-slate-300"
                  >
                    Full name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    id="fullname"
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    className="w-full rounded-xl border border-white/[0.10] bg-[#090b17]/80 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2.5 block text-xs font-medium text-slate-300"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/[0.10] bg-[#090b17]/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2.5 block text-xs font-medium text-slate-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="w-full rounded-xl border border-white/[0.10] bg-[#090b17]/80 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1 flex-1 rounded-full bg-violet-500" />
                    <div className="h-1 flex-1 rounded-full bg-violet-500" />
                    <div className="h-1 flex-1 rounded-full bg-violet-500/25" />
                    <div className="h-1 flex-1 rounded-full bg-white/[0.08]" />
                    <span className="ml-1 text-[10px] text-violet-300">
                      Good
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 accent-violet-500"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs leading-5 text-slate-400"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-violet-300 hover:text-violet-200"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-violet-300 hover:text-violet-200"
                    >
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>

                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-600/30"
                >
                  Create my account
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-slate-500 sm:hidden">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-violet-300">
                  Log in
                </Link>
              </p>

              <div className="mt-7 flex items-center justify-center gap-2 border-t border-white/[0.07] pt-6 text-[11px] text-slate-500">
                <LockKeyhole size={13} />
                Your information stays private and secure.
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] tracking-wide text-slate-600">
            BUILT FOR YOUR NEXT BIG THING
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-6 text-xs text-slate-600 sm:flex-row sm:px-10 lg:px-16">
        <p>© 2026 TaskFlow. Make every day count.</p>
        <div className="flex gap-5">
          <a href="#" className="transition hover:text-slate-300">
            Privacy
          </a>
          <a href="#" className="transition hover:text-slate-300">
            Terms
          </a>
          <a href="#" className="transition hover:text-slate-300">
            Help center
          </a>
        </div>
      </footer>
    </main>
  );
}
