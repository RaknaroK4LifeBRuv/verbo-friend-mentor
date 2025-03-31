
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { User } from '@/types/backend';

export const authService = {
  // Register a new user
  async register(email: string, password: string, name: string, nativeLanguage: string = 'English', learningLanguage: string = 'Spanish', proficiencyLevel: string = 'Beginner') {
    try {
      // 1. Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });
      
      if (authError) {
        throw new Error(handleSupabaseError(authError));
      }
      
      if (!authData.user) {
        throw new Error('User registration failed');
      }
      
      // The user profile will be created automatically via database trigger
      
      // 2. Fetch the complete user profile
      return await this.getUserProfile();
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Login an existing user
  async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      // Fetch user profile after successful login
      return await this.getUserProfile();
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Logout the current user
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      return true;
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  // Get the current user's profile
  async getUserProfile(): Promise<User> {
    try {
      // Get the current authenticated user
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        throw new Error(authError ? handleSupabaseError(authError) : 'User not found');
      }
      
      // Get the user's profile from the users table
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (profileError || !profileData) {
        throw new Error(profileError ? handleSupabaseError(profileError) : 'User profile not found');
      }
      
      // Convert from snake_case to camelCase for frontend use
      const user: User = {
        id: profileData.id,
        email: profileData.email,
        name: profileData.name,
        nativeLanguage: profileData.native_language,
        learningLanguage: profileData.learning_language,
        proficiencyLevel: profileData.proficiency_level,
        avatarUrl: profileData.avatar_url || undefined,
        createdAt: profileData.created_at,
      };
      
      return user;
    } catch (error: any) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },
  
  // Update user profile
  async updateUser(userData: Partial<User>): Promise<User> {
    try {
      // Get the current authenticated user
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        throw new Error(authError ? handleSupabaseError(authError) : 'User not found');
      }
      
      // Prepare the data for update (convert camelCase to snake_case)
      const updateData: any = {};
      if (userData.name) updateData.name = userData.name;
      if (userData.nativeLanguage) updateData.native_language = userData.nativeLanguage;
      if (userData.learningLanguage) updateData.learning_language = userData.learningLanguage;
      if (userData.proficiencyLevel) updateData.proficiency_level = userData.proficiencyLevel;
      if (userData.avatarUrl) updateData.avatar_url = userData.avatarUrl;
      
      // Update the user profile
      const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', authData.user.id);
      
      if (updateError) {
        throw new Error(handleSupabaseError(updateError));
      }
      
      // Return the updated user profile
      return await this.getUserProfile();
    } catch (error: any) {
      console.error('Update user error:', error);
      throw error;
    }
  },
  
  // Check if a user is currently authenticated
  async isAuthenticated(): Promise<boolean> {
    const { data, error } = await supabase.auth.getSession();
    return !error && !!data.session;
  }
};
