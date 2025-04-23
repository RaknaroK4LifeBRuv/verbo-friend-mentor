
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { Json } from "@/types/database.types";

// Log activity and reward XP
export const logUserActivity = async (
  userId: string,
  activityType: string,
  xp: number = 10,
  metadata: Json = {}
) => {
  if (!userId) return;
  await supabase.from("user_activity").insert({
    id: uuidv4(),
    user_id: userId,
    activity_type: activityType,
    xp_earned: xp,
    metadata,
  });
};

// Unlock achievement for user
export const unlockAchievement = async (
  userId: string,
  achievementType: string
) => {
  if (!userId) return;
  // Get achievement id
  const { data: achievement } = await supabase
    .from("achievements")
    .select("id")
    .eq("type", achievementType)
    .single();
  if (!achievement?.id) return;

  // Check if already unlocked
  const { data: exists } = await supabase
    .from("user_achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_id", achievement.id)
    .maybeSingle();
  if (exists) return;

  await supabase.from("user_achievements").insert({
    user_id: userId,
    achievement_id: achievement.id,
  });
};

export const getUserProgress = async (userId: string) => {
  if (!userId) return null;
  const { data } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
};

export const getUserAchievements = async (userId: string) => {
  if (!userId) return [];
  const { data } = await supabase
    .from("user_achievements")
    .select("*, achievement:achievement_id(name, description, icon, xp_reward)")
    .eq("user_id", userId);
  return data ?? [];
};
