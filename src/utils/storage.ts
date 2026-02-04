export const getLocalStorageItem = (itemKey: string): string => {
  const now = +new Date();
  const ls = localStorage.getItem(itemKey);
  if (!ls) return "";
  const data = JSON.parse(ls);
  if (data.expire > now) return data.value;
  localStorage.removeItem(itemKey);
  return "";
};

export const setLocalStorageItem = (itemKey: string, itemValue: string) => {
  const ttl = parseInt(import.meta.env.VITE_CACHE_TTL || "3600");
  const now = +new Date();
  localStorage.setItem(
    itemKey,
    JSON.stringify({ setTime: now, ttl, expire: now + ttl * 1000, value: itemValue })
  );
};
