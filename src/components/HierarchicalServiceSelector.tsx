import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Clock, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SubService {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
  display_order: number;
}

interface PrimaryService {
  id: string;
  name: string;
  description: string;
  display_order: number;
  sub_services: SubService[];
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  display_order: number;
  primary_services: PrimaryService[];
}

interface Props {
  onServiceSelect: (subService: SubService, primaryService: PrimaryService, category: ServiceCategory) => void;
  selectedServiceId?: string;
}

export default function HierarchicalServiceSelector({ onServiceSelect, selectedServiceId }: Props) {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedPrimaryServices, setExpandedPrimaryServices] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Fetch all data in one go with joins
      const { data: categoriesData, error: catError } = await supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (catError) throw catError;

      const { data: primaryData, error: primError } = await supabase
        .from('primary_services')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (primError) throw primError;

      const { data: subData, error: subError } = await supabase
        .from('sub_services')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (subError) throw subError;

      // Build hierarchical structure
      const structured = categoriesData.map(cat => ({
        ...cat,
        primary_services: primaryData
          .filter(prim => prim.category_id === cat.id)
          .map(prim => ({
            ...prim,
            sub_services: subData.filter(sub => sub.primary_service_id === prim.id)
          }))
      }));

      setCategories(structured);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const togglePrimaryService = (primaryId: string) => {
    const newExpanded = new Set(expandedPrimaryServices);
    if (newExpanded.has(primaryId)) {
      newExpanded.delete(primaryId);
    } else {
      newExpanded.add(primaryId);
    }
    setExpandedPrimaryServices(newExpanded);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours} hr ${mins} mins`;
    if (hours > 0) return `${hours} hr`;
    return `${mins} mins`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading services...</div>;
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <div key={category.id} className="border border-amber-500/20 rounded-lg overflow-hidden">
          {/* Category Header */}
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full px-4 py-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {expandedCategories.has(category.id) ? (
                <ChevronDown className="h-5 w-5 text-amber-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-amber-500" />
              )}
              <span className="font-semibold text-lg">{category.name}</span>
              <span className="text-sm text-muted-foreground">
                ({category.primary_services.length})
              </span>
            </div>
          </button>

          {/* Primary Services */}
          {expandedCategories.has(category.id) && (
            <div className="bg-background/50">
              {category.primary_services.map((primaryService) => (
                <div key={primaryService.id} className="border-t border-amber-500/10">
                  {/* Primary Service Header */}
                  <button
                    onClick={() => togglePrimaryService(primaryService.id)}
                    className="w-full px-6 py-2.5 hover:bg-amber-500/5 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {expandedPrimaryServices.has(primaryService.id) ? (
                        <ChevronDown className="h-4 w-4 text-amber-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-amber-400" />
                      )}
                      <span className="font-medium">{primaryService.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({primaryService.sub_services.length})
                      </span>
                    </div>
                  </button>

                  {/* Sub-Services */}
                  {expandedPrimaryServices.has(primaryService.id) && (
                    <div className="bg-background/30">
                      {primaryService.sub_services.map((subService) => (
                        <button
                          key={subService.id}
                          onClick={() => onServiceSelect(subService, primaryService, category)}
                          className={`w-full px-10 py-3 hover:bg-amber-500/10 transition-colors flex items-center justify-between border-t border-amber-500/5 ${
                            selectedServiceId === subService.id ? 'bg-amber-500/20' : ''
                          }`}
                        >
                          <div className="flex flex-col items-start gap-1">
                            <span className="text-sm font-medium">{subService.name}</span>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(subService.duration_minutes)}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                £{subService.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="text-amber-500 font-semibold">
                            Select
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
