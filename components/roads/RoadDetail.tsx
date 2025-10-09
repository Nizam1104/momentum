"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useRoadStore } from "@/stores/road";
import { createMilestone, updateMilestone, deleteMilestone } from "@/lib/serverActions/road";
import type { Road, Milestone } from "@prisma/client";

interface RoadDetailProps {
  road: Road & { milestones: Milestone[] };
  onClose?: () => void;
}

const statusColors = {
  ACTIVE: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  ON_HOLD: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
  ARCHIVED: "bg-gray-100 text-gray-800",
} as const;

export default function RoadDetail({ road }: RoadDetailProps) {
  const [isCreateMilestoneOpen, setIsCreateMilestoneOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const { addMilestone, updateMilestone: updateMilestoneInStore, deleteMilestone: deleteMilestoneFromStore } = useRoadStore();

  const completedMilestones = road.milestones.filter(m => m.isCompleted).length;
  const totalMilestones = road.milestones.length;

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const newMilestone = await createMilestone({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        roadId: road.id,
      });

      addMilestone(road.id, newMilestone);
      setIsCreateMilestoneOpen(false);
      setFormData({ title: "", description: "" });
    } catch (error) {
      console.error("Error creating milestone:", error);
    }
  };

  const handleUpdateMilestone = async (milestone: Milestone, updates: Partial<Milestone>) => {
    try {
      // Extract only the fields expected by updateMilestone function
      const updateData = {
        title: updates.title,
        description: updates.description || undefined,
        isCompleted: updates.isCompleted,
        completedAt: updates.completedAt || undefined,
        order: updates.order,
      };

      const updatedMilestone = await updateMilestone(milestone.id, updateData);
      updateMilestoneInStore(road.id, milestone.id, updatedMilestone);
      setEditingMilestone(null);
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const handleDeleteMilestone = async (milestone: Milestone) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;

    try {
      await deleteMilestone(milestone.id);
      deleteMilestoneFromStore(road.id, milestone.id);
    } catch (error) {
      console.error("Error deleting milestone:", error);
    }
  };

  const handleToggleMilestone = async (milestone: Milestone) => {
    await handleUpdateMilestone(milestone, {
      isCompleted: !milestone.isCompleted,
    });
  };

  return (
    <Card className="">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{road.title}</CardTitle>
            </div>
            {road.description && (
              <p className="text-gray-600 mt-2">{road.description}</p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
          {/* Road Info */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
              <Badge className={statusColors[road.status]}>
                {road.status.toLowerCase().replace("_", " ")}
              </Badge>
            </div>

            <div className="flex-1 min-w-[200px]">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Progress</h4>
              <div className="space-y-2">
                <Progress value={road.progress} className="h-2" />
                <p className="text-sm text-gray-600">
                  {completedMilestones} of {totalMilestones} milestones
                </p>
              </div>
            </div>

            {road.startDate && (
              <div className="flex-1 min-w-[200px]">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Start Date</h4>
                <p className="text-sm">{format(new Date(road.startDate), "MMM d, yyyy")}</p>
              </div>
            )}

            {road.dueDate && (
              <div className="flex-1 min-w-[200px]">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Due Date</h4>
                <p className="text-sm">{format(new Date(road.dueDate), "MMM d, yyyy")}</p>
              </div>
            )}
          </div>

          {/* Milestones */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Milestones</h3>
              <Button
                size="sm"
                onClick={() => setIsCreateMilestoneOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            </div>
            {road.milestones.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-500 mb-4">No milestones yet. Add your first milestone to get started.</p>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateMilestoneOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Milestone
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {road.milestones.map((milestone) => (
                  <MilestoneItem
                    key={milestone.id}
                    milestone={milestone}
                    isEditing={editingMilestone?.id === milestone.id}
                    onToggle={() => handleToggleMilestone(milestone)}
                    onEdit={(milestone) => setEditingMilestone(milestone)}
                    onSave={(updates) => handleUpdateMilestone(milestone, updates)}
                    onCancel={() => setEditingMilestone(null)}
                    onDelete={() => handleDeleteMilestone(milestone)}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>

      {/* Create Milestone Dialog */}
      <Dialog open={isCreateMilestoneOpen} onOpenChange={setIsCreateMilestoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Milestone</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateMilestone} className="space-y-4">
            <div>
              <Label htmlFor="milestone-title">Title *</Label>
              <Input
                id="milestone-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter milestone title"
                required
              />
            </div>
            <div>
              <Label htmlFor="milestone-description">Description</Label>
              <Textarea
                id="milestone-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter milestone description"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateMilestoneOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Milestone
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

interface MilestoneItemProps {
  milestone: Milestone;
  isEditing: boolean;
  onToggle: () => void;
  onEdit: (milestone: Milestone) => void;
  onSave: (updates: Partial<Milestone>) => void;
  onCancel: () => void;
  onDelete: () => void;
}

function MilestoneItem({
  milestone,
  isEditing,
  onToggle,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: MilestoneItemProps) {
  const [editData, setEditData] = useState({
    title: milestone.title,
    description: milestone.description || "",
  });

  const handleSave = () => {
    if (!editData.title.trim()) return;

    onSave({
      title: editData.title.trim(),
      description: editData.description.trim() || undefined,
    });
  };

  if (isEditing) {
    return (
      <div className="p-3 border border-blue-200 rounded-lg space-y-2">
        <div>
          <Input
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            placeholder="Milestone title"
          />
        </div>
        <div>
          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            placeholder="Milestone description"
            rows={2}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Item variant="outline">
      <ItemContent>
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={milestone.isCompleted}
            onCheckedChange={onToggle}
          />
          <ItemTitle className={milestone.isCompleted ? "line-through text-gray-500" : ""}>
            {milestone.title}
          </ItemTitle>
          {milestone.isCompleted && (
            <span className="text-xs bg-green-100 text-green-800 rounded-md px-2">
              Done
            </span>
          )}
        </div>
        {milestone.description && (
          <ItemDescription className={milestone.isCompleted ? "text-gray-400" : ""}>
            {milestone.description}
          </ItemDescription>
        )}
      </ItemContent>
      <ItemActions>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(milestone)}
          className="text-blue-600"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:text-red-800 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </ItemActions>
    </Item>
  );
}