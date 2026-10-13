import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.75.0";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});

async function getNetlifyUser(req: Request) {
  const authorization = req.headers.get("authorization");
  if (!authorization) return null;
  const response = await fetch("https://iadsder.org/.netlify/identity/user", {
    headers: { authorization }
  });
  return response.ok ? response.json() : null;
}

Deno.serve(async req => {
  const user = await getNetlifyUser(req);
  if (!user) return json({ error: "Inicia sesión como administrador." }, 401);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("comments")
      .select("id,nombre,filial,comentario,status,created_at,approved_at")
      .order("created_at", { ascending: false });
    if (error) return json({ error: "No se pudieron cargar los comentarios." }, 502);
    return json({ comments: data || [] });
  }

  if (req.method === "PATCH") {
    const input = await req.json().catch(() => ({}));
    if (!input.id || !["approved", "rejected"].includes(input.status)) {
      return json({ error: "Solicitud de moderación inválida." }, 400);
    }
    const update = {
      status: input.status,
      approved_at: input.status === "approved" ? new Date().toISOString() : null
    };
    const { data, error } = await supabase
      .from("comments")
      .update(update)
      .eq("id", input.id)
      .select("id,nombre,filial,comentario,status,created_at,approved_at")
      .single();
    if (error) return json({ error: "No se pudo guardar el cambio." }, 502);
    return json({ comment: data });
  }

  return json({ error: "Método no permitido." }, 405);
});
