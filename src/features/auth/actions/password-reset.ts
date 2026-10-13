'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { publicEnv } from '@/lib/env/public';
import { logger } from '@/lib/logging/logger';
import { createClient } from '@/lib/supabase/server';

const requestSchema = z.object({ email: z.email() });

const updateSchema = z
  .object({
    password: z.string().min(8).max(72),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, { path: ['confirm'] });

export async function requestPasswordResetAction(formData: FormData) {
  const parsed = requestSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) redirect('/forgot-password?error=invalid');

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });

  // Unknown e-mails get the same answer as known ones, so the form doesn't reveal who is registered.
  if (error) logger.warn('auth.password_reset_request_failed', { code: error.code ?? null });

  redirect('/forgot-password?status=sent');
}

export async function updatePasswordAction(formData: FormData) {
  const parsed = updateSchema.safeParse({
    password: formData.get('password'),
    confirm: formData.get('confirm'),
  });

  if (!parsed.success) {
    const mismatch = parsed.error.issues.some((issue) => issue.path[0] === 'confirm');
    redirect(`/reset-password?error=${mismatch ? 'mismatch' : 'invalid'}`);
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/forgot-password?error=expired');

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    logger.warn('auth.password_update_failed', { code: error.code ?? null });
    const reason =
      error.code === 'weak_password' ? 'weak' : error.code === 'same_password' ? 'same' : 'failed';
    redirect(`/reset-password?error=${reason}`);
  }

  await supabase.auth.signOut();
  redirect('/login?status=password-reset');
}
