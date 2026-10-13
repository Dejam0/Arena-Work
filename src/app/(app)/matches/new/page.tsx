import Link from 'next/link';
import { RegisterMatchForm } from '@/features/matches/components/register-match-form';
import { requireUser } from '@/lib/auth/require-user';

export default async function NewMatchPage() {
  const { userId, profile, supabase } = await requireUser();
  const [{ data: opponents }, { count: pendingCount }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, name')
      .eq('is_active', true)
      .neq('id', userId)
      .order('name'),
    supabase
      .from('match_participants')
      .select('match_id, matches!inner(status, created_by)', { count: 'exact', head: true })
      .eq('profile_id', userId)
      .eq('matches.status', 'pending_confirmation')
      .neq('matches.created_by', userId),
  ]);

  if (pendingCount) {
    return (
      <section className="mx-auto max-w-xl">
        <p className="text-primary text-xs font-black tracking-[0.28em]">REGISTRAR</p>
        <h1 className="mt-2 text-3xl font-black">Responda antes de registrar</h1>
        <div
          role="status"
          className="border-warning/40 bg-warning/10 mt-8 rounded-3xl border p-5 sm:p-7"
        >
          <p className="text-warning text-sm leading-6">
            {pendingCount === 1
              ? 'Tem 1 resultado registrado contra você aguardando sua resposta.'
              : `Tem ${pendingCount} resultados registrados contra você aguardando sua resposta.`}{' '}
            Aceite ou recuse o placar para liberar o registro de novas partidas.
          </p>
          <Link
            href="/notifications"
            className="bg-primary mt-6 block w-full rounded-xl px-5 py-4 text-center font-black text-white"
          >
            Ver notificações
          </Link>
        </div>
      </section>
    );
  }

  return <RegisterMatchForm currentPlayerName={profile.name} opponents={opponents ?? []} />;
}
