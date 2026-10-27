import {
  Command,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "../api/axios";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleOnchange = (e) => {
    try {
      const { name, value } = e.target;

      setFormData((prev) => ({ ...prev, [name]: value }));
    } catch (error) {
      console.log(error.message);
    }
  };

  //  handle google success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await Axios.post(
        "/auth/google",
        {
          credential: credentialResponse.credential,
        },
        {
          withCredentials: true,
        },
      );

      toast.success("Google login successful! Welcome back.");
      navigate("/tasks");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/auth/login", formData, {
        withCredentials: true,
      });

      toast.success("Login Successful! wellcome back");
      navigate("/tasks");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#080914] text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-violet-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-[130px]" />

      <div className="relative mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-2">
        {/* Left Side — Branding */}
        <section className="relative hidden flex-col justify-between overflow-hidden border-r border-white/[0.06] px-10 py-10 lg:flex xl:px-16">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.07] via-transparent to-indigo-500/[0.05]" />

          {/* Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 shadow-lg shadow-violet-950/30">
              <Command size={23} className="text-violet-300" />
            </div>

            <span className="text-2xl font-bold tracking-tight">
              taskflow<span className="text-violet-400">.</span>
            </span>
          </div>

          {/* Main Content */}
          <div className="relative z-10 mx-auto w-full max-w-lg py-3">
            <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-4 py-2 text-xs font-medium text-violet-300">
              <Sparkles size={14} />
              YOUR WORKSPACE, REIMAGINED
            </div>

            <h1 className="text-4xl font-semibold leading-[1.2] tracking-tight xl:text-4xl">
              Good to have
              <br />
              you{" "}
              <span className="bg-gradient-to-r from-violet-300 to-indigo-400 bg-clip-text text-transparent">
                back.
              </span>
            </h1>

            <p className="mt-3 max-w-md text-sm leading-7 text-slate-400 xl:text-base">
              Your tasks, projects, and progress are waiting for you. Pick up
              where you left off and make today count.
            </p>

            {/* Dashboard Preview */}
            <div className="mt-5 rounded-2xl border border-white/[0.09] bg-[#10111f]/90 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">YOUR WORKSPACE</p>
                  <h3 className="mt-1 text-lg font-semibold">
                    Project overview
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                  <Layers3 size={20} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Stay Focused
                  </div>
                  <p className="mt-2 text-xl font-semibold">
                    Your next achievement starts with one small step.
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Stay Focused
                  </div>
                  <p className="mt-2 text-xl font-semibold">
                    Small steps lead to big results.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-emerald-400"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      Design system updates
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      UI / Development
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                    Done
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-violet-400/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      Build authentication UI
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Frontend / React
                    </p>
                  </div>
                  <span className="rounded-full bg-violet-400/10 px-2.5 py-1 text-[10px] font-medium text-violet-300">
                    Active
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-white/[0.06] pt-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Weekly productivity</span>
                  <span className="font-medium text-violet-300">75%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-violet-500 to-indigo-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-600">
            <span>© 2026 TaskFlow</span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} />
              Built for focused work
            </span>
          </div>
        </section>

        {/* Right Side — Login Form UI */}
        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-10 lg:px-12 xl:px-20">
          <div className="w-full max-w-md rounded-3xl border border-violet-400/20 bg-gradient-to-br from-[#151528]/95 via-[#10111f]/95 to-[#111323]/95 p-5 sm:p-8 shadow-2xl shadow-violet-950/30 ring-1 ring-white/[0.04] backdrop-blur-xl transition-all duration-300 hover:border-violet-400/30">
            {/* Mobile Logo */}
            <div className="mb-8 sm:mb-12 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                <Command size={21} className="text-violet-300" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                taskflow<span className="text-violet-400">.</span>
              </span>
            </div>

            {/* Heading */}
            <div className="mb-7 sm:mb-9">
              <div className="mb-4 sm:mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/10">
                <Zap size={23} className="text-violet-300" />
              </div>

              <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-2.5 sm:mt-3 text-sm leading-6 text-slate-400">
                Sign in to your account to continue your journey.
              </p>
            </div>

            {/* Google Button — UI Only */}
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

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/[0.09]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-600">
                Or continue with email
              </span>
              <div className="h-px flex-1 bg-white/[0.09]" />
            </div>

            {/* Form UI Only */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2.5 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <div className="group relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-violet-400"
                  />
                  <input
                    onChange={handleOnchange}
                    name="email"
                    value={formData.email}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/[0.09] bg-[#10111f]/80 py-3.5 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 hover:border-white/[0.15] focus:border-violet-500/60 focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>
                </div>

                <div className="group relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-violet-400"
                  />
                  <input
                    onChange={handleOnchange}
                    name="password"
                    value={formData.password}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/[0.09] bg-[#10111f]/80 py-3.5 pl-12 pr-12 text-sm text-white outline-none transition-all placeholder:text-slate-600 hover:border-white/[0.15] focus:border-violet-500/60 focus:ring-4 focus:ring-violet-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  id="remember"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-white/20 bg-[#10111f] accent-violet-500"
                />
                <label
                  htmlFor="remember"
                  className="cursor-default text-xs text-slate-400"
                >
                  Remember me on this device
                </label>
              </div>

              {/* Submit Button — UI Only */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-900/40"
              >
                Sign in to your account
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            {/* Sign Up Link — Visual Only */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to={"/signUp"}
                className="cursor-default font-semibold text-violet-400"
              >
                Create an account
              </Link>
            </p>

            {/* Mobile Footer */}
            <div className="mt-12 flex items-center justify-center gap-2 text-xs text-slate-600 lg:hidden">
              <ShieldCheck size={14} />
              Secure workspace for your productivity
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
