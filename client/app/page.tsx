import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0e1e13] via-[#00bfff]/10 to-[#00ff88]/10 overflow-hidden">
      {/* Abstract green blurred circles and rings */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Blurred circles */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-[#00ff88]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-60px] w-96 h-96 bg-[#00bfff]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-[#00ff88]/10 rounded-full blur-2xl" />
        {/* Outlined rings */}
        <div className="absolute top-24 left-1/2 w-32 h-32 border-2 border-[#00ff88]/20 rounded-full opacity-50 animate-pulse" />
        <div className="absolute bottom-24 right-1/3 w-24 h-24 border-2 border-[#00bfff]/10 rounded-full opacity-40" />
        <div className="absolute bottom-10 left-1/5 w-16 h-16 border border-[#00ff88]/10 rounded-full opacity-30" />
        {/* Decorative dots */}
        <div className="absolute top-16 right-24 flex gap-2">
          <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
          <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
          <span className="w-1.5 h-1.5 bg-white/10 rounded-full" />
        </div>
        <div className="absolute bottom-20 left-24 flex gap-2">
          <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
          <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
        </div>
      </div>
      {/* Logo at top left */}
      <div className="absolute top-8 left-10 z-10 flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#00ff88] bg-gradient-to-br from-[#0e1e13] via-[#00bfff]/30 to-[#00ff88]/30 flex items-center justify-center">
          <Image
            src="https://img.freepik.com/premium-photo/vibrant-ai-logo-design-with-bright-engaging-colors_1222399-79257.jpg"
            alt="EchoRay Logo"
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
        <span className="ml-3 text-2xl font-bold text-white tracking-widest drop-shadow-lg select-none">
          EchoRay
        </span>
      </div>
      {/* Centered card */}
      <div className="relative z-10 bg-[#0e1e13]/80 p-10 md:p-16 rounded-2xl shadow-2xl w-full max-w-xl border border-[#00ff88]/30 backdrop-blur-md text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-widest drop-shadow-lg">
          Welcome to{" "}
          <span className="text-[#00ff88]">EchoRay</span>
        </h1>
        <p className="text-[#e0ffe7] text-lg md:text-xl mb-10 font-medium">
          Imagine building your dream website-just by chatting. EchoRay empowers you to describe your ideas, collaborate in real-time, and watch AI bring your vision to life. Effortless, interactive, and uniquely yours.
        </p>
        <Link
          href="/signin"
          className="inline-block px-8 py-4 rounded-lg border-2 border-[#00ff88] text-[#00ff88] font-bold text-xl tracking-wide shadow-lg hover:bg-[#00ff88] hover:text-[#0e1e13] transition-all duration-200"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
