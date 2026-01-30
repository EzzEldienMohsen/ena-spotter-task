import Link from 'next/link';
import { IoAirplane, IoHome, IoLocationSharp, IoFlash, IoCheckmarkCircleSharp } from 'react-icons/io5';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
});

export default function RootNotFound() {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating Clouds */}
            <div className="absolute top-20 left-10 w-24 sm:w-32 h-12 sm:h-16 bg-base-content/5 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-40 right-20 w-32 sm:w-40 h-16 sm:h-20 bg-base-content/5 rounded-full blur-xl animate-float-delay"></div>
            <div className="absolute bottom-32 left-1/3 w-28 sm:w-36 h-14 sm:h-18 bg-base-content/5 rounded-full blur-xl animate-float"></div>

            {/* Decorative Circles */}
            <div className="absolute top-10 right-10 w-2 h-2 bg-primary/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-3 h-3 bg-secondary/30 rounded-full animate-pulse delay-300"></div>
            <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-accent/30 rounded-full animate-pulse delay-700"></div>
          </div>

          <div className="max-w-4xl w-full relative z-10">
            <div className="card bg-base-100/95 backdrop-blur-sm shadow-2xl border border-base-300">
              <div className="card-body items-center text-center p-8 md:p-12 lg:p-16">
                {/* Animated Airplane Icon */}
                <div className="mb-6 sm:mb-8 relative h-24 sm:h-32">
                  <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 100" preserveAspectRatio="xMidYMid meet">
                    <path
                      d="M 0,50 Q 100,20 200,50 T 400,50"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="10,5"
                      className="text-primary/30"
                    />
                  </svg>

                  <div className="relative animate-plane-fly h-full flex items-center justify-center">
                    <IoAirplane className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-primary drop-shadow-lg" />
                  </div>
                </div>

                {/* 404 Text */}
                <div className="mb-4">
                  <h1 className="text-7xl sm:text-8xl md:text-9xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
                    404
                  </h1>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-base-content">
                  Page Not Found
                </h2>

                <p className="text-base sm:text-lg text-base-content/70 mb-8 max-w-lg mx-auto leading-relaxed px-4">
                  Sorry, we couldn not find the page you are looking for. The page might have been moved, deleted, or never existed.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 w-full sm:w-auto px-4 sm:px-0">
                  <Link
                    href="/en"
                    className="btn btn-primary btn-lg gap-2 group w-full sm:w-auto"
                  >
                    <IoHome className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Go to Homepage
                  </Link>
                </div>

                {/* Quick Links */}
                <div className="text-sm text-base-content/60">
                  <p className="mb-2 font-semibold">Quick Links</p>
                  <div className="flex flex-wrap gap-2 justify-center items-center">
                    <Link href="/en" className="link link-primary link-hover">
                      English
                    </Link>
                    <span className="text-base-content/40">•</span>
                    <Link href="/ar" className="link link-primary link-hover">
                      العربية
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 px-4 sm:px-0">
              <div className="card bg-base-100/95 backdrop-blur-sm shadow-lg border border-base-300 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="card-body items-center text-center p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <IoLocationSharp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-primary">50+</div>
                  <div className="text-xs sm:text-sm text-base-content/70">Destinations</div>
                </div>
              </div>

              <div className="card bg-base-100/95 backdrop-blur-sm shadow-lg border border-base-300 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="card-body items-center text-center p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                    <IoFlash className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-secondary">Real-time</div>
                  <div className="text-xs sm:text-sm text-base-content/70">Search Results</div>
                </div>
              </div>

              <div className="card bg-base-100/95 backdrop-blur-sm shadow-lg border border-base-300 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div className="card-body items-center text-center p-4 sm:p-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                    <IoCheckmarkCircleSharp className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-accent">99.9%</div>
                  <div className="text-xs sm:text-sm text-base-content/70">Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
