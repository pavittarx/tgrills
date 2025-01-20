export const getCatalogue = async () => {
  const res = await fetch("/api");
  const data = await res.json();
  return data;
};