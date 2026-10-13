import { redirect } from 'next/navigation';
import { ArenaWorkLogo } from '@/components/brand/arena-work-logo';
import { updatePasswordAction } from '@/features/auth/actions/password-reset';
import { createClient } from '@/lib/supabase/server';

const inputClass =
  'mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-base outline-none ring-primary focus:ring-2';

const errors: Record<string, string> = {
  invalid: 'A senha precisa ter pelo menos 8 caracteres.',
  mismatch: 'As senhas não coincidem.',
  weak: 'Senha fraca. Use pelo menos 8 caracteres, misturando letras e números.',
  same: 'A nova senha precisa ser diferente da anterior.',
  failed: 'Não foi possível salvar a nova senha agora. Tente novamente.',
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/forgot-password?error=expired');

  const { error } = await searchParams;
  const message = error ? (errors[error] ?? errors.failed) : null;

  return (
    <main className="bg-background grid min-h-dvh place-items-center px-4 py-10">
      <section className="border-border bg-card w-full max-w-sm rounded-3xl border p-6 shadow-2xl shadow-black/40 sm:p-8">
        <ArenaWorkLogo priority className="mx-auto mb-8 h-auto w-44" />
        <h1 className="text-3xl font-black tracking-tight">Nova senha.</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          Escolha uma nova senha para {data.user.email}.
        </p>

        <form action={updatePasswordAction} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            Nova senha
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
              className={inputClass}
            />
          </label>
          <label className="block text-sm font-medium">
            Confirme a nova senha
            <input
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={72}
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
            Salvar nova senha
          </button>
        </form>
      </section>
    </main>
  );
}
