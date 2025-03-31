
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { Conversation, Message, PronunciationFeedback, ApiResponse } from '@/types/backend';
import { v4 as uuidv4 } from 'uuid';

export const conversationService = {
  // Get all conversations for a user
  async getUserConversations(): Promise<Conversation[]> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        throw new Error(authError ? handleSupabaseError(authError) : 'User not found');
      }
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', authData.user.id)
        .order('updated_at', { ascending: false });
      
      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      // Convert conversations from snake_case to camelCase
      const conversations: Conversation[] = data.map(conv => ({
        id: conv.id,
        userId: conv.user_id,
        title: conv.title,
        language: conv.language,
        createdAt: conv.created_at,
        updatedAt: conv.updated_at,
        messages: [], // Messages will be loaded separately when needed
      }));
      
      return conversations;
    } catch (error: any) {
      console.error('Get user conversations error:', error);
      throw error;
    }
  },
  
  // Get a single conversation with its messages
  async getConversation(conversationId: string): Promise<Conversation> {
    try {
      // Get the conversation
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      
      if (convError || !convData) {
        throw new Error(convError ? handleSupabaseError(convError) : 'Conversation not found');
      }
      
      // Get the messages for this conversation
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true });
      
      if (messagesError) {
        throw new Error(handleSupabaseError(messagesError));
      }
      
      // Convert messages from snake_case to camelCase
      const messages: Message[] = messagesData.map(msg => ({
        id: msg.id,
        conversationId: msg.conversation_id,
        sender: msg.sender as "user" | "ai",
        text: msg.text,
        audioUrl: msg.audio_url || undefined,
        timestamp: msg.timestamp,
        pronunciation: msg.pronunciation_feedback as PronunciationFeedback | undefined,
      }));
      
      // Create and return the conversation
      const conversation: Conversation = {
        id: convData.id,
        userId: convData.user_id,
        title: convData.title,
        language: convData.language,
        createdAt: convData.created_at,
        updatedAt: convData.updated_at,
        messages,
      };
      
      return conversation;
    } catch (error: any) {
      console.error('Get conversation error:', error);
      throw error;
    }
  },
  
  // Create a new conversation
  async createConversation(title: string, language: string): Promise<Conversation> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        throw new Error(authError ? handleSupabaseError(authError) : 'User not found');
      }
      
      const now = new Date().toISOString();
      const conversationId = uuidv4();
      
      // Create the conversation
      const { error: convError } = await supabase
        .from('conversations')
        .insert({
          id: conversationId,
          user_id: authData.user.id,
          title,
          language,
          created_at: now,
          updated_at: now,
        });
      
      if (convError) {
        throw new Error(handleSupabaseError(convError));
      }
      
      // Create initial AI greeting message
      const initialMessage = {
        id: uuidv4(),
        conversation_id: conversationId,
        sender: 'ai',
        text: `¡Hola! Soy tu tutor de ${language}. ¿Cómo estás hoy?`,
        timestamp: now,
      };
      
      const { error: msgError } = await supabase
        .from('messages')
        .insert(initialMessage);
      
      if (msgError) {
        throw new Error(handleSupabaseError(msgError));
      }
      
      // Return the new conversation
      return {
        id: conversationId,
        userId: authData.user.id,
        title,
        language,
        createdAt: now,
        updatedAt: now,
        messages: [{
          id: initialMessage.id,
          conversationId,
          sender: 'ai',
          text: initialMessage.text,
          timestamp: now,
        }],
      };
    } catch (error: any) {
      console.error('Create conversation error:', error);
      throw error;
    }
  },
  
  // Add a message to a conversation and get AI response
  async sendMessage(conversationId: string, text: string, audioUrl?: string): Promise<Message[]> {
    try {
      const now = new Date().toISOString();
      
      // Add the user message
      const userMessageId = uuidv4();
      const userMessage = {
        id: userMessageId,
        conversation_id: conversationId,
        sender: 'user',
        text,
        audio_url: audioUrl || null,
        timestamp: now,
      };
      
      const { error: userMsgError } = await supabase
        .from('messages')
        .insert(userMessage);
      
      if (userMsgError) {
        throw new Error(handleSupabaseError(userMsgError));
      }
      
      // Update conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: now })
        .eq('id', conversationId);
      
      // Get AI response (this would call an Edge Function in production)
      // For now we'll use a mock response
      const aiResponse = await this.getMockAIResponse(text);
      
      // Add the AI response
      const aiMessageId = uuidv4();
      const aiMessage = {
        id: aiMessageId,
        conversation_id: conversationId,
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toISOString(),
      };
      
      const { error: aiMsgError } = await supabase
        .from('messages')
        .insert(aiMessage);
      
      if (aiMsgError) {
        throw new Error(handleSupabaseError(aiMsgError));
      }
      
      // Return both messages
      return [
        {
          id: userMessageId,
          conversationId,
          sender: 'user',
          text,
          audioUrl,
          timestamp: now,
        },
        {
          id: aiMessageId,
          conversationId,
          sender: 'ai',
          text: aiResponse,
          timestamp: aiMessage.timestamp,
        }
      ];
    } catch (error: any) {
      console.error('Send message error:', error);
      throw error;
    }
  },
  
  // Delete a conversation
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      // Delete associated messages first
      const { error: msgError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId);
      
      if (msgError) {
        throw new Error(handleSupabaseError(msgError));
      }
      
      // Delete the conversation
      const { error: convError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);
      
      if (convError) {
        throw new Error(handleSupabaseError(convError));
      }
      
      return true;
    } catch (error: any) {
      console.error('Delete conversation error:', error);
      throw error;
    }
  },
  
  // Analyze pronunciation (mock implementation)
  async analyzePronunciation(audioBlob: Blob, text: string): Promise<PronunciationFeedback> {
    try {
      // This would be implemented as an Edge Function that calls a speech API
      // For now, we return mock feedback
      return {
        score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
        feedback: this.getMockPronunciationFeedback(Math.floor(Math.random() * 40) + 60),
        detailedFeedback: {
          accuracy: Math.floor(Math.random() * 40) + 60,
          fluency: Math.floor(Math.random() * 40) + 60,
          intonation: Math.floor(Math.random() * 40) + 60,
        }
      };
    } catch (error: any) {
      console.error('Analyze pronunciation error:', error);
      throw error;
    }
  },
  
  // Helper methods for mock responses
  async getMockAIResponse(userText: string): Promise<string> {
    // Simple mock responses based on keywords
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('hola') || lowerText.includes('hello')) {
      return '¡Hola! ¿Cómo estás hoy?';
    } else if (lowerText.includes('bien') || lowerText.includes('good')) {
      return '¡Me alegro! ¿Qué quieres hacer hoy?';
    } else if (lowerText.includes('mal') || lowerText.includes('bad')) {
      return 'Lo siento. ¿Puedo hacer algo para ayudarte?';
    } else if (lowerText.includes('gracias') || lowerText.includes('thank')) {
      return 'De nada. Es un placer ayudarte a aprender español.';
    } else if (lowerText.includes('?')) {
      return '¡Buena pregunta! Vamos a explorar eso más a fondo.';
    } else {
      // Get a random response
      const responses = [
        '¡Interesante! Cuéntame más sobre eso.',
        '¿Podrías elaborar un poco más?',
        'Entiendo. ¿Quieres practicar más con este tema?',
        'Tu español está mejorando. Sigamos practicando.',
        '¿Tienes alguna pregunta sobre lo que acabamos de discutir?',
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  },
  
  getMockPronunciationFeedback(score: number): string {
    if (score >= 90) {
      return '¡Excelente pronunciación! Suenas muy natural.';
    } else if (score >= 80) {
      return 'Muy buena pronunciación. Sigue así.';
    } else if (score >= 70) {
      return 'Buena pronunciación. Practica un poco más la entonación.';
    } else {
      return 'Tu pronunciación es entendible, pero necesitas más práctica con ciertos sonidos.';
    }
  },
};
