export const validateSubUrl = (url: string) => {
  if (!url || url.trim() === "") {
    return { valid: false, message: "订阅链接不能为空" };
  }
  const hasValidFormat = /^(ss|ssr|vmess|trojan|hysteria|tuic|sip008|vless):\/\//.test(url) ||
                         /^https?:\/\//.test(url) ||
                         /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]+$/.test(url);
  if (!hasValidFormat) {
    return { valid: false, message: "订阅链接格式可能不正确" };
  }
  return { valid: true };
};

export const validateRequiredFields = (form: { sourceSubUrl: string; clientType: string }) => {
  if (!form.sourceSubUrl || !form.clientType) {
    return { valid: false, message: "订阅链接与客户端为必填项" };
  }
  const subUrlValidation = validateSubUrl(form.sourceSubUrl);
  if (!subUrlValidation.valid) {
    return subUrlValidation;
  }
  return { valid: true };
};
