"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { itemsApi } from "@/lib/api";
import type { Item } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";

function moneyBR(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ItemDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const it = await itemsApi.get(id);
        setItem(it);
      } catch (e: any) {
        setErr(e?.message || "Falha ao carregar item.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const total = useMemo(() => {
    if (!item) return 0;
    return item.quantidade * item.preco;
  }, [item]);

  async function remove() {
    if (!confirm("Tem certeza que deseja excluir este item?")) return;
    setDeleting(true);
    setErr(null);
    try {
      await itemsApi.remove(id);
      router.push("/items");
    } catch (e: any) {
      setErr(e?.message || "Falha ao excluir item.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <div style={{ padding: 24 }}>Carregando...</div>;
  if (err) return <div style={{ padding: 24 }}>{err}</div>;
  if (!item) return <div style={{ padding: 24 }}>Item não encontrado.</div>;

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Link href="/items" style={{ textDecoration: "none", color: "white", opacity: 0.85 }}>
        ← Voltar
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 style={{ fontSize: 44, fontWeight: 900, margin: 0 }}>{item.nome}</h1>
            <span
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 900,
                background: item.status === "ACTIVE" ? "rgba(37,99,235,0.25)" : "rgba(148,163,184,0.20)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {item.status === "ACTIVE" ? "Ativo" : "Inativo"}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Link
            href={`/items/${item.id}/edit`}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "#1d4ed8",
              color: "white",
              textDecoration: "none",
              fontWeight: 900,
            }}
          >
            Editar
          </Link>

          <button
            onClick={remove}
            disabled={deleting}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "white",
              cursor: deleting ? "not-allowed" : "pointer",
              fontWeight: 900,
            }}
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>

      {err && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(239,68,68,0.35)",
            background: "rgba(239,68,68,0.10)",
          }}
        >
          {err}
        </div>
      )}

      <div
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        <section style={card}>
          <h2 style={h2}>Informações do item</h2>
          <div style={{ opacity: 0.9, lineHeight: 1.6 }}>
            <div>
              <strong>Descrição:</strong> {item.descricao || "-"}
            </div>
            <div>
              <strong>SKU:</strong> {item.sku}
            </div>
            <div>
              <strong>Categoria:</strong> {item.categoriaNome}
            </div>
          </div>
        </section>

        <section style={card}>
          <h2 style={h2}>Estoque</h2>
          <div style={{ opacity: 0.8 }}>Quantidade atual</div>
          <div style={{ fontSize: 34, fontWeight: 900, marginTop: 6 }}>{item.quantidade} un</div>
        </section>

        <section style={card}>
          <h2 style={h2}>Valores</h2>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <div style={{ opacity: 0.8 }}>Preço unitário</div>
            <div style={{ fontWeight: 900 }}>{moneyBR(item.preco)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <div style={{ opacity: 0.8 }}>Total em estoque</div>
            <div style={{ fontWeight: 900 }}>{moneyBR(total)}</div>
          </div>
        </section>
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  padding: 16,
};

const h2: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 900,
  marginBottom: 10,
};