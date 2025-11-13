import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DaySchedule {
  day_of_week: number;
  is_open: boolean;
  opening_time: string;
  closing_time: string;
  slot_duration_minutes: number;
}

export const useWeeklySchedule = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_schedule')
        .select('*')
        .order('day_of_week');

      if (error) throw error;
      setSchedule(data || []);
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScheduleForDay = (dayOfWeek: number) => {
    return schedule.find(s => s.day_of_week === dayOfWeek);
  };

  return { schedule, loading, getScheduleForDay };
};
