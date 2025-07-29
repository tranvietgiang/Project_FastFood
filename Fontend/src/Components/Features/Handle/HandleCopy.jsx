// components/HandleCopy.jsx
import { useEffect } from "react";

export default function HandleCopy({ text, setCopiedText }) {
  useEffect(() => {
    if (!text) return;
    console.log(text);

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedText(`✅ Đã copy: ${text}`);
        setTimeout(() => setCopiedText(""), 2000);
      })
      .catch(() => {
        setCopiedText("❌ Không thể copy!");
        setTimeout(() => setCopiedText(""), 2000);
      });
  }, [text]);

  return null;
}
