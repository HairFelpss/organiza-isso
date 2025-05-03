// Funções auxiliares para datas padrão
export const getDefaultStartDate = () => {
  const date = new Date();
  // 7 dias atrás
  date.setDate(date.getDate() - 7);
  // Início do dia (00:00:00)
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getDefaultEndDate = () => {
  const date = new Date();
  // 3 meses à frente
  date.setMonth(date.getMonth() + 3);
  // Fim do dia (23:59:59)
  date.setHours(23, 59, 59, 999);
  return date;
};
