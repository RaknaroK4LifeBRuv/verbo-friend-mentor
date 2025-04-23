
import { supabase } from "@/integrations/supabase/client";

export async function sendAIChat(messages: {role: "system"|"user"|"assistant", content: string}[]) {
  const { data, error } = await supabase.functions.invoke("ai-chatbot", {
    body: { messages }
  });
  if (error) {
    throw new Error(error.message);
  }
  return data.content;
}
