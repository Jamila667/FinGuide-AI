import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8 max-w-7xl mx-auto" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight">FinGuide AI</span>
            </Link>
          </div>
          <div className="flex flex-1 justify-end items-center gap-4">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="text-sm font-semibold leading-6 text-white bg-slate-900 px-5 py-2.5 rounded-full hover:bg-slate-800 transition-colors"
              >
                Boshqaruv paneliga o'tish &rarr;
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold leading-6 text-slate-900 hover:text-slate-600 transition-colors hidden sm:block">
                  Kirish
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-semibold leading-6 text-white bg-slate-900 px-5 py-2.5 rounded-full hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Boshlash &rarr;
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="relative isolate pt-14">
        {/* Decorative background */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#cbd5e1] to-[#94a3b8] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
        </div>

        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl text-balance">
                Moliyaviy kelajagingizni aqlli boshqaring
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 text-balance">
                FinGuide AI — sizning shaxsiy moliyaviy yordamchingiz. Daromad va xarajatlarni kuzatib boring, maqsadlar qo'ying va sun'iy intellekt orqali ekspert maslahatlarini oling.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href={session?.user ? "/dashboard" : "/login"}
                  className="rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-all hover:scale-105"
                >
                  Hozirroq boshlash
                </Link>
                <a href="#features" className="text-sm font-semibold leading-6 text-slate-900 group flex items-center gap-2">
                  Batafsil ma'lumot <span aria-hidden="true" className="group-hover:translate-y-1 transition-transform">↓</span>
                </a>
              </div>
            </div>
            
            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 max-w-5xl mx-auto shadow-2xl">
                <div className="bg-white rounded-md shadow-sm ring-1 ring-slate-900/10 overflow-hidden relative" style={{ paddingBottom: '56.25%' }}>
                   {/* This is a mockup placeholder for the app screenshot */}
                   <div className="absolute inset-0 flex items-center justify-center bg-slate-50 flex-col border-4 border-white rounded-lg shadow-inner overflow-hidden">
                     {/* Window header */}
                     <div className="w-full h-10 bg-slate-100 flex items-center px-4 gap-2 border-b border-slate-200">
                        <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                        <div className="ml-4 w-48 h-4 bg-white rounded-md mx-auto border border-slate-200"></div>
                     </div>
                     {/* Window body */}
                     <div className="flex-1 w-full flex">
                       {/* Sidebar */}
                       <div className="w-1/4 h-full bg-white border-r border-slate-200 p-4 space-y-4 pt-6">
                         <div className="w-full h-8 bg-slate-100 rounded-md"></div>
                         <div className="w-3/4 h-8 bg-slate-50 rounded-md"></div>
                         <div className="w-5/6 h-8 bg-slate-50 rounded-md"></div>
                         <div className="w-4/5 h-8 bg-slate-50 rounded-md"></div>
                       </div>
                       {/* Main Content */}
                       <div className="w-3/4 h-full bg-slate-50 p-6 space-y-6">
                         {/* Header */}
                         <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                           <div className="w-32 h-6 bg-slate-200 rounded-md"></div>
                           <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                         </div>
                         {/* Stats Row */}
                         <div className="flex gap-4">
                           <div className="w-1/3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                             <div className="w-16 h-3 bg-slate-100 rounded"></div>
                             <div className="w-24 h-6 bg-emerald-500/20 rounded"></div>
                           </div>
                           <div className="w-1/3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                             <div className="w-16 h-3 bg-slate-100 rounded"></div>
                             <div className="w-24 h-6 bg-slate-800 rounded"></div>
                           </div>
                           <div className="w-1/3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                             <div className="w-16 h-3 bg-slate-100 rounded"></div>
                             <div className="w-24 h-6 bg-slate-200 rounded"></div>
                           </div>
                         </div>
                         {/* Charts Row */}
                         <div className="flex gap-4 h-40">
                           <div className="w-2/3 h-full bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-end gap-2">
                             <div className="w-1/6 h-[60%] bg-slate-200 rounded-t-md"></div>
                             <div className="w-1/6 h-[80%] bg-slate-800 rounded-t-md"></div>
                             <div className="w-1/6 h-[40%] bg-slate-200 rounded-t-md"></div>
                             <div className="w-1/6 h-[90%] bg-slate-800 rounded-t-md"></div>
                             <div className="w-1/6 h-[50%] bg-slate-200 rounded-t-md"></div>
                             <div className="w-1/6 h-[70%] bg-slate-800 rounded-t-md"></div>
                           </div>
                           <div className="w-1/3 h-full bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
                             <div className="w-24 h-24 rounded-full border-8 border-slate-800 border-r-slate-200"></div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div id="features" className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 bg-slate-50">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-slate-900">Imkoniyatlar</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-balance">
              Barcha moliyaviy vositalar bitta joyda
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Pulni tejash va to'g'ri sarflash endi qiyin emas. FinGuide yordamida har bir so'mingiz hisob-kitobli bo'ladi.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-start">
                <div className="rounded-lg bg-slate-100 p-3 mb-4 ring-1 ring-slate-200">
                  <svg className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                  </svg>
                </div>
                <dt className="text-xl font-semibold leading-7 text-slate-900">Chuqur Analitika</dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">Daromad va xarajatlaringizni toifalarga bo'lib, oylik va yillik o'sishingizni vizual tarzda ko'ring.</dd>
              </div>

              <div className="flex flex-col items-start">
                <div className="rounded-lg bg-slate-100 p-3 mb-4 ring-1 ring-slate-200">
                  <svg className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                </div>
                <dt className="text-xl font-semibold leading-7 text-slate-900">Jamg'arma Maqsadlari</dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">Yangi mashina, uy yoki sayohat uchun o'z oldingizga maqsad qo'ying va natijani kuzatib boring.</dd>
              </div>

              <div className="flex flex-col items-start">
                <div className="rounded-lg bg-slate-100 p-3 mb-4 ring-1 ring-slate-200">
                  <svg className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                  </svg>
                </div>
                <dt className="text-xl font-semibold leading-7 text-slate-900">AI Maslahatchi</dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">Shaxsiy moliyaviy muammolaringiz bo'yicha sun'iy intellektdan maslahatlar va yo'nalishlar oling.</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 py-10 text-center">
        <p className="text-slate-400 text-sm">© {new Date().getFullYear()} FinGuide AI. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  );
}
