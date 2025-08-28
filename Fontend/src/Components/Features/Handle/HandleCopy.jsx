// components/HandleCopy.jsx
import { useEffect } from "react";

export default function HandleCopy({ text, setCopiedText }) {
  useEffect(() => {
    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedText(`✅ Đã sao chép mã RTL: ${text}`);
        setTimeout(() => setCopiedText(""), 2000);
      })
      .catch(() => {
        setCopiedText("❌ Không thể copy!");
        setTimeout(() => setCopiedText(""), 2000);
      });
  }, [text, setCopiedText]);

  return null;
}
