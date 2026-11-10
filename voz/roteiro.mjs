// Só a parte do roteiro que a narração usa. No kit de vídeo, esta função vive em src/roteiro.mjs.
/** Trechos que recebem voz: abertura, cada cena e fechamento, na ordem do vídeo. */
export function trechos(r) {
  const lista = [];
  if (r.abertura?.fala) lista.push({ id: 'abertura', fala: r.abertura.fala });
  for (const c of r.cenas ?? []) if (c.fala) lista.push({ id: c.id, fala: c.fala });
  if (r.fechamento?.fala) lista.push({ id: 'fechamento', fala: r.fechamento.fala });
  return lista;
}
