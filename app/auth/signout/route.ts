import { createClient } from '@/src/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();

  if (claimsData?.claims) {
    await supabase.auth.signOut();
  }

  revalidatePath('/', 'layout');
  return NextResponse.json({ success: true });
}
