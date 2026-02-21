"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { categoriesApi, itemsApi } from "@/lib/api";
import type { Category, ItemStatus } from "@/lib/types";

const pageWrap: React.CSSProperties = { padding: 28, color: "#fff" };
const titleRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12 };
const backBtn: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 800,
  fontSize: 16,
  padding: 0,
  opacity: 0.9,
};

const h1Style: React.CSSProperties = { fontSize: 44, fontWeight: 800, margin: 0, letterSpacing: -0.5 };
const subStyle: React.CSSProperties = { marginTop: 6, opacity: 0.75 };

const grid: React.CSSProperties = {
  marginTop: 18,
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: 16,
};

const card: React.CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  padding: 18,
};

const sectionTitle: React.CSSProperties = { fontSize: 18, fontWeight: 900, margin: 0 };
const sectionDesc: React.CSSProperties = { marginTop: 4, opacity: 0.75, fontSize: 13 };

const row2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 };
const row3: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 12 };

const label: React.CSSProperties = { display: "block", fontWeight: 800, marginBottom: 8 };
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(0,0,0,0.25)",
  color: "#fff",
  outline: "none",
};

const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 110, resize: "vertical" };
const selectStyle: React.CSSProperties = inputStyle;

const primaryBtn: React.CSSProperties = {
  width: "100%",
  background: "#1e66ff",
  color: "#fff",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  fontWeight: 900,
  cursor: "pointer",
};

const ghostBtn: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  color: "#fff",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  fontWeight: 900,
  cursor: "pointer",
  marginTop: 10,
  opacity: 0.9,
};

export default function NewItemPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ quantidade e preco como string pra não “prender” o 0
  const [form, setForm] = useState({
    nome: "",
    sku: "",
    descricao: "",
    quantidade: "",
    preco: "",
    status: "ACTIVE" as ItemStatus,
    categoriaId: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        setLoading(true);
        const cat = await categoriesApi.list();
        setCategories(cat);
      } catch (e: any) {
        setError(e?.message ?? "Falha ao carregar categorias.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const canSave = useMemo(() => {
    const qtdOk = form.quantidade !== "" && !isNaN(Number(form.quantidade));
    const precoOk = form.preco !== "" && !isNaN(Number(form.preco.replace(",", ".")));
    return (
      form.nome.trim().length > 0 &&
      form.sku.trim().length > 0 &&
      form.categoriaId > 0 &&
      qtdOk &&
      precoOk
    );
  }, [form]);

  async function submit() {
    if (!canSave || saving) return;

    try {
      setSaving(true);
      setError(null);

      const quantidadeNumber = form.quantidade === "" ? 0 : Number(form.quantidade);

      const precoNumber =
        form.preco === ""
          ? 0
          : Number(form.preco.replace(/\./g, "").replace(",", "."));

      await itemsApi.create({
        nome: form.nome.trim(),
        sku: form.sku.trim(),
        descricao: form.descricao?.trim() ? form.descricao.trim() : null,
        quantidade: quantidadeNumber,
        preco: precoNumber,
        status: form.status,
        categoriaId: form.categoriaId,
      });

      router.push("/items");
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Falha ao criar item.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={pageWrap}>
      <div style={titleRow}>
        <button type="button" style={backBtn} onClick={() => router.push("/items")}>
          ← Voltar
        </button>
      </div>

      <h1 style={h1Style}>Novo Item</h1>
      <div style={subStyle}>Adicione um novo item ao inventário</div>

      {error && <div style={{ marginTop: 14, color: "#ffb3b3" }}>{error}</div>}

      <div style={grid}>
        {/* COLUNA ESQUERDA */}
        <div style={{ display: "grid", gap: 16 }}>
          <div style={card}>
            <h2 style={sectionTitle}>Informações Básicas</h2>
            <div style={sectionDesc}>Dados principais do item</div>

            <div style={row2}>
              <div>
                <label style={label}>Nome *</label>
                <input
                  style={inputStyle}
                  value={form.nome}
                  onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
                  placeholder="Nome do item"
                />
              </div>

              <div>
                <label style={label}>SKU / Código *</label>
                <input
                  style={inputStyle}
                  value={form.sku}
                  onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                  placeholder="Código único do item"
                />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={label}>Descrição</label>
              <textarea
                style={textareaStyle}
                value={form.descricao}
                onChange={(e) => setForm((p) => ({ ...p, descricao: e.target.value }))}
                placeholder="Descreva o item em detalhes"
              />
            </div>
          </div>

          <div style={card}>
            <h2 style={sectionTitle}>Classificação</h2>
            <div style={sectionDesc}>Categoria do item</div>

            <div style={row2}>
              <div>
                <label style={label}>Categoria *</label>
                <select
                  style={selectStyle}
                  value={form.categoriaId}
                  onChange={(e) => setForm((p) => ({ ...p, categoriaId: Number(e.target.value) }))}
                  disabled={loading}
                >
                  <option value={0}>Selecione uma categoria</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={label}>Localização</label>
                <select style={selectStyle} disabled value="—">
                  <option value="—">—</option>
                </select>
              </div>
            </div>
          </div>

          <div style={card}>
            <h2 style={sectionTitle}>Estoque e Preço</h2>
            <div style={sectionDesc}>Quantidade e valores</div>

            <div style={row2}>
              <div>
                <label style={label}>Quantidade *</label>
                <input
                  style={inputStyle}
                  inputMode="numeric"
                  value={form.quantidade}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    setForm((p) => ({ ...p, quantidade: v }));
                  }}
                  placeholder="0"
                />
              </div>

              <div>
                <label style={label}>Preço Unitário *</label>
                <input
                  style={inputStyle}
                  inputMode="decimal"
                  value={form.preco}
                  onChange={(e) => {
                    let v = e.target.value.replace(/[^\d,]/g, "");
                    const parts = v.split(",");
                    if (parts.length > 2) v = `${parts[0]},${parts.slice(1).join("")}`;
                    setForm((p) => ({ ...p, preco: v }));
                  }}
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div style={{ display: "grid", gap: 16 }}>
          <div style={card}>
            <h2 style={sectionTitle}>Status</h2>
            <div style={sectionDesc}>Situação do item</div>

            <div style={{ marginTop: 12 }}>
              <select
                style={selectStyle}
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as ItemStatus }))}
              >
                <option value="ACTIVE">Ativo</option>
                <option value="INACTIVE">Inativo</option>
              </select>
            </div>

            <button
              type="button"
              style={{ ...primaryBtn, marginTop: 14, opacity: saving ? 0.7 : 1 }}
              onClick={submit}
              disabled={!canSave || saving}
              title={!canSave ? "Preencha os campos obrigatórios." : "Criar item"}
            >
              {saving ? "Criando..." : "Criar Item"}
            </button>

            <button type="button" style={ghostBtn} onClick={() => router.push("/items")}>
              Cancelar
            </button>
          </div>

          <div style={card}>
            <h2 style={sectionTitle}>Imagens</h2>
            <div style={sectionDesc}>Opcional</div>

            <div
              style={{
                marginTop: 12,
                borderRadius: 14,
                border: "1px dashed rgba(255,255,255,0.18)",
                padding: 18,
                textAlign: "center",
                opacity: 0.85,
              }}
            >
              Clique para adicionar imagens
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}