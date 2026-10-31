import React, { useState } from 'react';
import { useNSS } from '../context/NSSContext.tsx';
import { Shield, KeyRound, Mail, Lock, User, Phone, BookOpen, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { currentUser, loginWithPassword, loginWithOtp, sendOtpEmail, signup, switchUserForDemo, users } = useNSS();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Login states
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Signup states
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  // Step 1: Email & Password
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  // Step 2: Name & Phone number first
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  // Step 3: Academic details: Class/Grade (FYJC/SYJC), Stream (Science/Arts), Division (Arts: A-D, Science: A-F), Roll Number
  const [grade, setGrade] = useState<'FYJC' | 'SYJC'>('FYJC');
  const [stream, setStream] = useState<'Science' | 'Arts'>('Science');
  const [division, setDivision] = useState('A');
  const [rollNumber, setRollNumber] = useState('');
  const [signupSuccessId, setSignupSuccessId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStreamChange = (newStream: 'Science' | 'Arts') => {
    setStream(newStream);
    if (newStream === 'Arts' && !['A', 'B', 'C', 'D'].includes(division)) {
      setDivision('A');
    }
  };

  const availableDivisions = stream === 'Arts'
    ? ['A', 'B', 'C', 'D']
    : ['A', 'B', 'C', 'D', 'E', 'F'];

  // If already logged in, do not display
  if (currentUser) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (loginMethod === 'password') {
      const res = await loginWithPassword(loginEmail, loginPassword);
      if (!res.success) {
        setLoginError(res.error || 'Login failed');
      }
    } else {
      const res = await loginWithOtp(loginEmail, loginOtp);
      if (!res.success) {
        setLoginError(res.error || 'Invalid OTP code');
      }
    }
  };

  const handleRequestOtp = async () => {
    if (!loginEmail.trim()) {
      setLoginError('Please enter your email to receive the OTP code.');
      return;
    }
    setIsSendingOtp(true);
    setLoginError(null);
    const res = await sendOtpEmail(loginEmail);
    setIsSendingOtp(false);
    if (res.success) {
      setSimulatedOtpNotice(res.simulatedOtp);
      setLoginOtp(res.simulatedOtp); // Pre-fill for instant seamless developer testing
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (signupStep === 1) {
      if (!signupEmail.trim() || !signupPassword.trim()) {
        setLoginError('Please enter a valid email and password.');
        return;
      }
      setSignupStep(2);
    } else if (signupStep === 2) {
      if (!fullName.trim() || !phone.trim()) {
        setLoginError('Please enter your full name and phone number.');
        return;
      }
      setSignupStep(3);
    }
  };

  const handleFinishSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim()) {
      setLoginError('Please provide your college roll number.');
      return;
    }

    setIsSubmitting(true);
    setLoginError(null);

    try {
      const created = await signup({
        email: signupEmail.trim(),
        password: signupPassword,
        fullName: fullName.trim(),
        phone: phone.trim(),
        grade,
        stream,
        division,
        rollNumber: rollNumber.trim(),
      });
      setSignupSuccessId(created.volunteerId);
    } catch {
      setLoginError('Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#123B75] to-[#1565C0] p-6 text-white text-center relative">
          <div className="w-14 h-14 mx-auto rounded-full bg-white p-1 flex items-center justify-center mb-3 shadow-md">
            <img src="/nss-logo.png" alt="NSS Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <h2 className="font-heading text-2xl font-bold tracking-tight">SynchroNSS</h2>
          <p className="text-blue-100 text-xs font-medium mt-0.5">Ramnivas Ruia College NSS Unit</p>
          <p className="text-blue-200 text-[11px] italic">Not me, but you • Volunteer Portal</p>

          {/* Toggle between Login and Sign Up */}
          <div className="flex bg-white/15 p-1 rounded-xl mt-4 border border-white/20 max-w-xs mx-auto">
            <button
              onClick={() => { setMode('login'); setLoginError(null); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'login' ? 'bg-white text-[#123B75] shadow-xs' : 'text-blue-100 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setLoginError(null); setSignupStep(1); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                mode === 'signup' ? 'bg-white text-[#123B75] shadow-xs' : 'text-blue-100 hover:text-white'
              }`}
            >
              New Volunteer Sign Up
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {loginError}
            </div>
          )}

          {/* --- LOGIN FORM --- */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Method switch: Password or OTP */}
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Authentication Type:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('password')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      loginMethod === 'password'
                        ? 'bg-[#EAF4FF] text-[#1565C0]'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('otp')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                      loginMethod === 'otp'
                        ? 'bg-[#EAF4FF] text-[#1565C0]'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Email OTP
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. aarav.d@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {loginMethod === 'password' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      6-Digit Email OTP
                    </label>
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={isSendingOtp}
                      className="text-xs text-[#1565C0] hover:underline font-semibold"
                    >
                      {isSendingOtp ? 'Sending...' : 'Send OTP'}
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value)}
                      placeholder="Enter 6-digit verification code"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono tracking-widest focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none"
                    />
                  </div>

                  {simulatedOtpNotice && (
                    <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center justify-between">
                      <span>Verification OTP: <strong>{simulatedOtpNotice}</strong></span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-mono">Simulated</span>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#1565C0] hover:bg-[#123B75] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                Sign In to Volunteer Portal
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Instant One-Click Demo Access for Web Testing */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Instant Demo Personas
                  </span>
                  <span className="text-[10px] bg-blue-50 text-[#1565C0] font-semibold px-2 py-0.5 rounded-full">
                    One-Click
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => switchUserForDemo('user_aarav_001')}
                    className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200/60 text-center transition cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-[#1565C0] block truncate">Aarav (FYJC)</span>
                    <span className="text-[9px] text-slate-500 block truncate">Volunteer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => switchUserForDemo('user_riya_002')}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/60 text-center transition cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-amber-800 block truncate">Riya (SYJC)</span>
                    <span className="text-[9px] text-slate-500 block truncate">Core Team</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => switchUserForDemo('user_po_vedant_003')}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200/60 text-center transition cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-rose-800 block truncate">Prof. Vedant</span>
                    <span className="text-[9px] text-slate-500 block truncate">PO Tier</span>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* --- SIGN UP MULTI-STEP FORM --- */}
          {mode === 'signup' && (
            <div>
              {/* Progress Stepper */}
              <div className="flex items-center justify-between mb-5 px-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    signupStep >= 1 ? 'bg-[#1565C0] text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    1
                  </span>
                  <span className="text-[11px] font-semibold text-slate-700">Account</span>
                </div>
                <div className="w-8 h-0.5 bg-slate-200"></div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    signupStep >= 2 ? 'bg-[#1565C0] text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    2
                  </span>
                  <span className="text-[11px] font-semibold text-slate-700">Identity</span>
                </div>
                <div className="w-8 h-0.5 bg-slate-200"></div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    signupStep >= 3 ? 'bg-[#1565C0] text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    3
                  </span>
                  <span className="text-[11px] font-semibold text-slate-700">Academic</span>
                </div>
              </div>

              {/* STEP 1: Email and Password */}
              {signupStep === 1 && (
                <form onSubmit={handleNextStep} className="space-y-3.5">
                  <p className="text-xs text-slate-500 mb-2">
                    Enter your email and password to begin creating your unique encrypted NSS volunteer account.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="your.email@college.edu"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#1565C0] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#1565C0] outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#1565C0] hover:bg-[#123B75] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                  >
                    Continue to Identity Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* STEP 2: Name and Phone number first */}
              {signupStep === 2 && (
                <form onSubmit={handleNextStep} className="space-y-3.5">
                  <p className="text-xs text-slate-500 mb-2">
                    Your full name and registration timestamp will be encrypted into your permanent Volunteer ID.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Aarav Deshpande"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#1565C0] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#1565C0] outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#1565C0] hover:bg-[#123B75] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Next: Academic Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Academic Details (Grade, Stream, Division, Roll Number) */}
              {signupStep === 3 && (
                <form onSubmit={handleFinishSignup} className="space-y-3">
                  <p className="text-xs text-slate-500 mb-1">
                    Provide your college batch credentials:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Class / Grade</label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value as 'FYJC' | 'SYJC')}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:ring-1 focus:ring-[#1565C0]"
                      >
                        <option value="FYJC">FYJC</option>
                        <option value="SYJC">SYJC</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Stream</label>
                      <select
                        value={stream}
                        onChange={(e) => handleStreamChange(e.target.value as 'Science' | 'Arts')}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:ring-1 focus:ring-[#1565C0]"
                      >
                        <option value="Science">Science (Div A–F)</option>
                        <option value="Arts">Arts (Div A–D)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Division ({stream === 'Arts' ? 'A to D' : 'A to F'})
                      </label>
                      <select
                        value={division}
                        onChange={(e) => setDivision(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white outline-none focus:ring-1 focus:ring-[#1565C0]"
                      >
                        {availableDivisions.map((div) => (
                          <option key={div} value={div}>
                            Division {div}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">College Roll Number</label>
                      <input
                        type="text"
                        required
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="e.g. 17"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-[#1565C0] outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-900 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#1565C0] shrink-0 mt-0.5" />
                    <span>
                      You will join as <strong>Volunteer Rank</strong> by default. Promotion to Core Team can be granted by Programme Officers (PO).
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSignupStep(2)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 rounded-xl bg-[#1565C0] hover:bg-[#123B75] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
                    >
                      {isSubmitting ? 'Encrypting & Generating ID...' : 'Complete Sign Up'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
