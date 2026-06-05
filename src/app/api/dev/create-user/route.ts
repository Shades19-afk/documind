import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { email, password, displayName } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const admin = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    );

    // Create user via admin API and auto-confirm email to avoid email send rate limits in dev
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      user_metadata: { display_name: displayName ?? null },
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
