import { RegisterForm } from './_components/register-form';
import Link from 'next/link';

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
            <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-lg dark:bg-gray-900">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-800 dark:text-white">Créer un compte</h1>
                <RegisterForm />
                <div className="mt-4 text-center text-sm">
                    Déjà un compte ?{' '}
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Se connecter
                    </Link>
                </div>
            </div>
        </div>
    );
}
