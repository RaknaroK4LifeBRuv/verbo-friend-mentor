
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { PerformanceMetric } from '@/types/backend';
import { v4 as uuidv4 } from 'uuid';

export const performanceService = {
  // Record a new performance metric
  async recordPerformanceMetric(category: string, score: number, details?: any): Promise<PerformanceMetric> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        throw new Error(authError ? handleSupabaseError(authError) : 'User not found');
      }
      
      const metricId = uuidv4();
      const now = new Date().toISOString();
      
      // Insert the metric
      const { error } = await supabase
        .from('performance_metrics')
        .insert({
          id: metricId,
          user_id: authData.user.id,
          date: now,
          category,
          score,
          details: details || null,
        });
      
      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      // Return the new metric
      return {
        id: metricId,
        userId: authData.user.id,
        date: now,
        category: category as any,
        score,
        details,
      };
    } catch (error: any) {
      console.error('Record performance metric error:', error);
      throw error;
    }
  },
  
  // Get all performance metrics for the current user
  async getUserPerformanceMetrics(): Promise<PerformanceMetric[]> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        throw new Error(authError ? handleSupabaseError(authError) : 'User not found');
      }
      
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', authData.user.id)
        .order('date', { ascending: false });
      
      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      // Convert from snake_case to camelCase
      const metrics: PerformanceMetric[] = data.map(metric => ({
        id: metric.id,
        userId: metric.user_id,
        date: metric.date,
        category: metric.category as any,
        score: metric.score,
        details: metric.details,
      }));
      
      return metrics;
    } catch (error: any) {
      console.error('Get user performance metrics error:', error);
      throw error;
    }
  },
  
  // Get performance metrics by category
  async getMetricsByCategory(category: string): Promise<PerformanceMetric[]> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        throw new Error(authError ? handleSupabaseError(authError) : 'User not found');
      }
      
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', authData.user.id)
        .eq('category', category)
        .order('date', { ascending: false });
      
      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      // Convert from snake_case to camelCase
      const metrics: PerformanceMetric[] = data.map(metric => ({
        id: metric.id,
        userId: metric.user_id,
        date: metric.date,
        category: metric.category as any,
        score: metric.score,
        details: metric.details,
      }));
      
      return metrics;
    } catch (error: any) {
      console.error('Get metrics by category error:', error);
      throw error;
    }
  },
  
  // Get performance metrics for a date range
  async getMetricsForDateRange(startDate: string, endDate: string): Promise<PerformanceMetric[]> {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authData.user) {
        throw new Error(authError ? handleSupabaseError(authError) : 'User not found');
      }
      
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('user_id', authData.user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });
      
      if (error) {
        throw new Error(handleSupabaseError(error));
      }
      
      // Convert from snake_case to camelCase
      const metrics: PerformanceMetric[] = data.map(metric => ({
        id: metric.id,
        userId: metric.user_id,
        date: metric.date,
        category: metric.category as any,
        score: metric.score,
        details: metric.details,
      }));
      
      return metrics;
    } catch (error: any) {
      console.error('Get metrics for date range error:', error);
      throw error;
    }
  },
  
  // Get performance summary
  async getPerformanceSummary(): Promise<any> {
    try {
      const metrics = await this.getUserPerformanceMetrics();
      
      // Calculate averages by category
      const categorySummary: Record<string, { count: number, total: number, average: number }> = {};
      
      metrics.forEach(metric => {
        if (!categorySummary[metric.category]) {
          categorySummary[metric.category] = { count: 0, total: 0, average: 0 };
        }
        
        categorySummary[metric.category].count++;
        categorySummary[metric.category].total += metric.score;
        categorySummary[metric.category].average = 
          categorySummary[metric.category].total / categorySummary[metric.category].count;
      });
      
      // Group metrics by day for trend analysis
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      const recentMetrics = metrics.filter(m => new Date(m.date) >= thirtyDaysAgo);
      
      const dailyAverages: Record<string, { count: number, total: number, average: number }> = {};
      
      recentMetrics.forEach(metric => {
        const date = metric.date.split('T')[0]; // Get YYYY-MM-DD part
        
        if (!dailyAverages[date]) {
          dailyAverages[date] = { count: 0, total: 0, average: 0 };
        }
        
        dailyAverages[date].count++;
        dailyAverages[date].total += metric.score;
        dailyAverages[date].average = dailyAverages[date].total / dailyAverages[date].count;
      });
      
      // Convert to arrays for the frontend
      const categoryData = Object.keys(categorySummary).map(category => ({
        category,
        average: categorySummary[category].average,
        count: categorySummary[category].count,
      }));
      
      const trendData = Object.keys(dailyAverages).map(date => ({
        date,
        average: dailyAverages[date].average,
        count: dailyAverages[date].count,
      }));
      
      return {
        categoryData: categoryData.sort((a, b) => a.category.localeCompare(b.category)),
        trendData: trendData.sort((a, b) => a.date.localeCompare(b.date)),
        overallAverage: metrics.length > 0 
          ? metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length 
          : 0,
        totalSessions: metrics.length,
      };
    } catch (error: any) {
      console.error('Get performance summary error:', error);
      throw error;
    }
  },
};
