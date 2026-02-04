export const copyToClipboard = (text: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if (!text) {
            reject("没有可复制的内容");
            return;
        }
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => resolve(true))
                .catch(() => reject("复制失败, 请手动复制"));
        } else {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand("copy");
                resolve(true);
            } catch {
                reject("复制失败, 请手动复制");
            } finally {
                document.body.removeChild(textarea);
            }
        }
    });
};
