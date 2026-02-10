import { LoginForm } from './_components/login-form';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 mb-4">
            <Image
              src="/logo.png"
              alt="StockCare Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">StockCare</h1>
          <p className="text-slate-400 mt-2 text-sm">Gestion intelligente de stock pharmaceutique</p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-sm text-slate-500">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
