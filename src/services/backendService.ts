import axios from 'axios';

export const getBackendVersion = async (backendUrl: string) => {
  const url = `${backendUrl.substring(0, backendUrl.length - 5)}/version`;
  const { data } = await axios.get(url);
  return data.replace(/backend\n$/gm, "").replace("subconverter", "");
};

export const fetchConfig = async (url: string) => {
  const response = await fetch(url, { method: "GET", redirect: "follow" });
  return response.url;
};
