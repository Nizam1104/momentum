"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRoadStore } from "@/stores/road";
import { createRoad, deleteRoad } from "@/lib/serverActions/road";
import type { Road, RoadStatus, Milestone } from "@prisma/client";
import RoadDetail from "./RoadDetail";

interface RoadWithMilestones extends Road {
  milestones: Milestone[];
}

const statusColors = {
  ACTIVE: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  ON_HOLD: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
  ARCHIVED: "bg-gray-100 text-gray-800",
} as const;

export default function RoadManagement() {
  const { data: session } = useSession();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: undefined as Date | undefined,
    dueDate: undefined as Date | undefined,
  });

  const {
    roads,
    loading,
    error,
    addRoad,
    fetchRoads,
  } = useRoadStore();

  useEffect(() => {
    if (session?.user?.id) {
      fetchRoads(session.user.id);
    }
  }, [session?.user?.id, fetchRoads]);

  useEffect(() => {
    // Auto-select first road when roads are loaded
    if (roads.length > 0 && !selectedRoadId) {
      setSelectedRoadId(roads[0].id);
    }
  }, [roads, selectedRoadId]);

  const handleCreateRoad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    if (!formData.title.trim()) {
      // Store doesn't have setError method for custom errors, so we'll handle it differently
      return;
    }

    try {
      const newRoad = await createRoad({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
      });

      const roadWithMilestones: RoadWithMilestones = {
        ...newRoad,
        milestones: [],
      };

      addRoad(roadWithMilestones);
      setIsCreateDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        startDate: undefined,
        dueDate: undefined,
      });
    } catch (err) {
      // Error will be handled by the user seeing the operation failed
      console.error("Failed to create road:", err);
    }
  };

  const handleDeleteRoad = async (roadId: string) => {
    if (!confirm("Are you sure you want to delete this road? This will also delete all milestones.")) {
      return;
    }

    try {
      await deleteRoad(roadId);
      // Refresh roads list using the store's fetchRoads method
      if (session?.user?.id) {
        await fetchRoads(session.user.id);
      }
      // Clear selection if deleted road was selected
      if (selectedRoadId === roadId) {
        setSelectedRoadId(null);
      }
    } catch (err) {
      // Error will be shown in the store's error state
      console.error("Failed to delete road:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Roads</h2>
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="animate-pulse space-y-2">
                <div className="h-4 rounded w-3/4"></div>
                <div className="h-3 rounded w-1/2"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-2">
                <div className="h-3 rounded w-full"></div>
                <div className="h-2 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Roads</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Road
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Road</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateRoad} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter road title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter road description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dueDate}
                        onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Road"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {roads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No roads yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first road to start tracking your journey with milestones.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Road
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Road Cards */}
          <div className="lg:col-span-1 space-y-2">
            <div className="space-y-2">
              {roads.map((road) => (
                <RoadCard
                  key={road.id}
                  road={road}
                  isSelected={selectedRoadId === road.id}
                  onSelect={() => setSelectedRoadId(road.id)}
                  onDelete={handleDeleteRoad}
                />
              ))}
            </div>
          </div>

          {/* Right Content - Selected Road Details */}
          <div className="lg:col-span-2">
            {selectedRoadId ? (
              <RoadDetail
                road={roads.find(r => r.id === selectedRoadId)!}
                onClose={() => setSelectedRoadId(null)}
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Select a Road</h3>
                    <p className="text-gray-600">
                      Choose a road from the left to view and manage its details.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface RoadCardProps {
  road: RoadWithMilestones;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (roadId: string) => void;
}

function RoadCard({ road, isSelected, onSelect, onDelete }: RoadCardProps) {
  const completedMilestones = road.milestones.filter(m => m.isCompleted).length;
  const totalMilestones = road.milestones.length;

  return (
    <Card
      className={`hover:shadow-md transition-shadow cursor-pointer ${
        isSelected ? 'ring-1' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium mb-1 truncate">{road.title}</CardTitle>
            {road.description && (
              <p className="text-xs text-gray-600 line-clamp-2">{road.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
            <Badge className={statusColors[road.status as RoadStatus]} variant="secondary">
              {road.status.toLowerCase().replace("_", " ").slice(0, 3)}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(road.id);
              }}
              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 h-6 w-6"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {totalMilestones > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Progress</span>
                <span>{completedMilestones}/{totalMilestones}</span>
              </div>
              <Progress value={road.progress} className="h-1" />
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              {road.startDate && (
                <span>{format(new Date(road.startDate), "MMM d")}</span>
              )}
              {road.dueDate && (
                <span>→ {format(new Date(road.dueDate), "MMM d")}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}