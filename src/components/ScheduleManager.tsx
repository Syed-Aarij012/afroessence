import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Clock, Save, Calendar } from "lucide-react";

interface DaySchedule {
  id: string;
  day_of_week: number;
  is_open: boolean;
  opening_time: string;
  closing_time: string;
  slot_duration_minutes: number;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ScheduleManager = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const updateDay = (dayOfWeek: number, field: keyof DaySchedule, value: any) => {
    setSchedule(prev => prev.map(day => 
      day.day_of_week === dayOfWeek 
        ? { ...day, [field]: value }
        : day
    ));
  };

  const saveSchedule = async () => {
    setSaving(true);
    try {
      const updates = schedule.map(day => ({
        id: day.id,
        day_of_week: day.day_of_week,
        is_open: day.is_open,
        opening_time: day.opening_time,
        closing_time: day.closing_time,
        slot_duration_minutes: day.slot_duration_minutes
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('weekly_schedule')
          .update(update)
          .eq('id', update.id);

        if (error) throw error;
      }

      toast.success('Schedule updated successfully!');
      loadSchedule();
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-amber-500/20">
        <CardContent className="p-8 text-center">
          <Clock className="h-12 w-12 mx-auto mb-4 text-amber-500 animate-spin" />
          <p className="text-muted-foreground">Loading schedule...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-500/20 shadow-xl">
      <CardHeader className="border-b border-amber-500/20">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Calendar className="h-6 w-6 text-amber-500" />
          Weekly Schedule Management
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Set opening hours and time slot intervals for each day of the week
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {schedule.map((day) => (
            <Card key={day.day_of_week} className="border-amber-500/10 bg-card/50">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  {/* Day Name */}
                  <div className="md:col-span-1">
                    <h3 className="font-bold text-lg text-foreground">
                      {DAYS[day.day_of_week]}
                    </h3>
                  </div>

                  {/* Open/Closed Toggle */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={day.is_open}
                      onCheckedChange={(checked) => updateDay(day.day_of_week, 'is_open', checked)}
                      className="data-[state=checked]:bg-amber-500"
                    />
                    <Label className="text-sm">
                      {day.is_open ? 'Open' : 'Closed'}
                    </Label>
                  </div>

                  {/* Opening Time */}
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Opening Time</Label>
                    <Input
                      type="time"
                      value={day.opening_time || ''}
                      onChange={(e) => updateDay(day.day_of_week, 'opening_time', e.target.value)}
                      disabled={!day.is_open}
                      className="border-amber-500/20"
                    />
                  </div>

                  {/* Closing Time */}
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Closing Time</Label>
                    <Input
                      type="time"
                      value={day.closing_time || ''}
                      onChange={(e) => updateDay(day.day_of_week, 'closing_time', e.target.value)}
                      disabled={!day.is_open}
                      className="border-amber-500/20"
                    />
                  </div>

                  {/* Slot Duration */}
                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs text-muted-foreground">Time Slot (minutes)</Label>
                    <select
                      value={day.slot_duration_minutes}
                      onChange={(e) => updateDay(day.day_of_week, 'slot_duration_minutes', parseInt(e.target.value))}
                      disabled={!day.is_open}
                      className="w-full h-10 px-3 rounded-md border border-amber-500/20 bg-background text-foreground"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={saveSchedule}
            disabled={saving}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold px-8 shadow-lg shadow-amber-500/50"
          >
            {saving ? (
              <>
                <Clock className="mr-2 h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Save Schedule
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
