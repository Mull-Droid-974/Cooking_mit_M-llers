import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const ROW_ID = "family";

export async function GET() {
  try {
    const { data, error } = await getClient()
      .from("family_state")
      .select("state")
      .eq("id", ROW_ID)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = row not found
    return NextResponse.json({ state: data?.state ?? null });
  } catch {
    return NextResponse.json({ state: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const state = await request.json();
    const { error } = await getClient()
      .from("family_state")
      .upsert({ id: ROW_ID, state, updated_at: new Date().toISOString() });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
