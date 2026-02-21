export type Category = {
  id: number;
  nome: string;
  descricao?: string | null;
};

export type Item = {
  id: number;
  nome: string;
  sku: string;
  descricao?: string | null;
  quantidade: number;
  preco: number;
  status: string;
  categoriaId: number;
  categoriaNome: string;
};

export type ItemRequest = {
  nome: string;
  sku: string;
  descricao?: string | null;
  quantidade: number;
  preco: number;
  status: string;
  categoriaId: number;
};