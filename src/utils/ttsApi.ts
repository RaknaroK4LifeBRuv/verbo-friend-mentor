
import { supabase } from "@/lib/supabase";

export async function speakWithAI(text: string, voice?: string): Promise<string | null> {
  if (!text) return null;
  const { data, error } = await supabase.functions.invoke("text-to-speech", {
    body: { text, voice },
  });

  if (error) {
    console.error("TTS error", error);
    return null;
  }
  if (!data?.audioContent) return null;

  // Create audio URL from base64
  const audioBlob = b64toBlob(data.audioContent, "audio/mp3");
  return URL.createObjectURL(audioBlob);
}

function b64toBlob(b64Data: string, contentType: string) {
  const byteCharacters = atob(b64Data);
  const byteNumbers = new Array(byteCharacters.length)
    .fill(0)
    .map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}
