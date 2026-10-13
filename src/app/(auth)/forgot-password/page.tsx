import Link from 'next/link';
import { ArenaWorkLogo } from '@/components/brand/arena-work-logo';
import { requestPasswordResetAction } from '@/features/auth/actions/password-reset';

const inputClass =
  'mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-base outline-none ring-primary focus:ring-2';

const errors: Record<string, string> = {
  invalid: 'Informe um e-mail válido.',
  expired: 'O link de recuperação expirou ou já foi usado. Peça um novo abaixo.',
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; status?: string }>;
}) {
  const { error, status } = await searchParams;
  const message = error ? (errors[error] ?? errors.invalid) : null;

  return (
    <main className="bg-background grid min-h-dvh place-items-center px-4 py-10">
      <section className="border-border bg-card w-full max-w-sm rounded-3xl border p-6 shadow-2xl shadow-black/40 sm:p-8">
        <ArenaWorkLogo priority className="mx-auto mb-8 h-auto w-44" />
        <h1 className="text-3xl font-black tracking-tight">Esqueceu a senha?</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Informe o e-mail da sua conta e enviaremos um link para criar uma nova senha.
        </p>

        {status === 'sent' ? (
          <p
            role="status"
            className="border-warning/40 bg-warning/10 text-warning mt-6 rounded-xl border p-3 text-sm leading-6"
          >
            Se existir uma conta com esse e-mail, o link de recuperação chega em instantes. Confira
            também o spam.
          </p>
        ) : (
          <form action={requestPasswordResetAction} className="mt-6 space-y-4">
            <label className="block text-sm font-medium">
              E-mail
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className={inputClass}
              />
            </label>
            {message ? (
              <p role="alert" className="text-danger text-sm">
                {message}
              </p>
            ) : null}
            <button
              type="submit"
              className="bg-primary text-primary-foreground w-full rounded-xl px-4 py-3.5 text-sm font-black transition hover:brightness-110"
            >
              Enviar link
            </button>
          </form>
        )}

        <Link
          href="/login"
          className="text-muted-foreground mt-6 block text-center text-sm font-bold hover:text-white"
        >
          Voltar para o login
        </Link>
      </section>
    </main>
  );
}
