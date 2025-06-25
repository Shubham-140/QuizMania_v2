"use client";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { useRouter } from "next/navigation";

const Error = () => {
  const lightMode = useSelector((state: RootState) => state.mode.lightMode);
  const router = useRouter();

  return (
    <div
      className={`min-h-screen p-4 md:p-8 flex justify-center items-center font-sans ${
        lightMode
          ? "bg-gradient-to-br from-green-50 via-green-100 to-green-200"
          : "bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-700"
      }`}
    >
      <div
        className={`w-full max-w-4xl rounded-xl md:rounded-2xl p-6 md:p-12 backdrop-blur-sm border relative overflow-hidden text-center ${
          lightMode
            ? "bg-white/95 border-slate-200 shadow-xl shadow-black/5"
            : "bg-slate-900/95 border-slate-600 shadow-xl shadow-black/30"
        }`}
      >
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500 z-10"></div>

        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-500 rounded-full flex justify-center items-center mx-auto mb-6">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>

          {/* Error Text */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-2 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Oops!
          </h1>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h2
            className={`text-2xl md:text-4xl font-bold mb-4 ${
              lightMode ? "text-gray-900" : "text-white"
            }`}
          >
            Something Went Wrong
          </h2>
          <p
            className={`text-base md:text-lg leading-relaxed max-w-2xl mx-auto ${
              lightMode ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Don&apos;t worry! Even the best quiz masters stumble sometimes.
            Let&apos;s get you back to the quiz action where everything works
            perfectly.
          </p>
        </div>

        {/* Decorative Error Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Info 1 */}
          <div
            className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            <div className="w-12 h-12 bg-red-500 rounded-xl flex justify-center items-center mb-4 mx-auto">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3
              className={`text-lg font-bold mb-2 ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Temporary Issue
            </h3>
            <p
              className={`text-sm ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              This is likely a temporary glitch
            </p>
          </div>

          {/* Info 2 */}
          <div
            className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex justify-center items-center mb-4 mx-auto">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
              </svg>
            </div>
            <h3
              className={`text-lg font-bold mb-2 ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              Quick Recovery
            </h3>
            <p
              className={`text-sm ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              A refresh usually fixes most issues
            </p>
          </div>

          {/* Info 3 */}
          <div
            className={`border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
              lightMode
                ? "bg-white/95 border-slate-200 hover:shadow-lg hover:shadow-black/5"
                : "bg-slate-900/95 border-slate-600 hover:shadow-lg hover:shadow-black/20"
            }`}
          >
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex justify-center items-center mb-4 mx-auto">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3
              className={`text-lg font-bold mb-2 ${
                lightMode ? "text-gray-900" : "text-white"
              }`}
            >
              We&apos;re On It
            </h3>
            <p
              className={`text-sm ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Our team monitors all issues closely
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button
            className={`px-6 md:px-8 py-3 md:py-4 rounded-full border-none bg-emerald-500 text-white font-semibold text-base md:text-lg cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
              lightMode
                ? "shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
                : "shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30"
            }`}
            onClick={() => router.push("/")}
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error;
