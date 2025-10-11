"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import type { Milestone } from "@prisma/client";

interface MilestoneData {
  title: string;
  description?: string;
}

interface BulkMilestonesProps {
  roadId: string;
  onSuccess?: (milestones: Milestone[]) => void;
  onCancel?: () => void;
}

export default function BulkMilestones({ roadId, onSuccess, onCancel }: BulkMilestonesProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<MilestoneData[] | null>(null);
  const [isValidJSON, setIsValidJSON] = useState(false);

  const validateAndParseJSON = (input: string): { data: MilestoneData[] | null; error: string | null } => {
    try {
      if (!input.trim()) {
        return { data: null, error: null };
      }

      const parsed = JSON.parse(input);

      if (!Array.isArray(parsed)) {
        return { data: null, error: "Input must be an array of milestone objects" };
      }

      if (parsed.length === 0) {
        return { data: null, error: "Array cannot be empty" };
      }

      const milestones: MilestoneData[] = [];
      const errors: string[] = [];

      parsed.forEach((item, index) => {
        if (typeof item !== 'object' || item === null) {
          errors.push(`Item ${index + 1}: Must be an object`);
          return;
        }

        if (!item.title || typeof item.title !== 'string' || item.title.trim() === '') {
          errors.push(`Item ${index + 1}: Must have a non-empty title`);
        } else {
          const milestone: MilestoneData = {
            title: item.title.trim(),
            description: item.description && typeof item.description === 'string'
              ? item.description.trim()
              : undefined
          };
          milestones.push(milestone);
        }
      });

      if (errors.length > 0) {
        return { data: null, error: errors.join('; ') };
      }

      return { data: milestones, error: null };
    } catch {
      return { data: null, error: "Invalid JSON format" };
    }
  };

  const handleInputChange = (value: string) => {
    setJsonInput(value);
    setValidationError(null);

    if (!value.trim()) {
      setPreviewData(null);
      setIsValidJSON(false);
      return;
    }

    const result = validateAndParseJSON(value);
    if (result.error) {
      setValidationError(result.error);
      setPreviewData(null);
      setIsValidJSON(false);
    } else if (result.data) {
      setPreviewData(result.data);
      setIsValidJSON(true);
    }
  };

  const handleGenerate = async () => {
    if (!isValidJSON || !previewData) return;

    setIsProcessing(true);
    setValidationError(null);

    try {
      const response = await fetch('/api/roads/milestones/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roadId,
          milestones: previewData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create milestones');
      }

      const result = await response.json();
      onSuccess?.(result.milestones);
      setJsonInput("");
      setPreviewData(null);
      setIsValidJSON(false);
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : "Failed to create milestones");
    } finally {
      setIsProcessing(false);
    }
  };

  const loadExample = () => {
    const example = [
      { title: "Complete project setup", description: "Initialize repository and configure development environment" },
      { title: "Design database schema", description: "Create ERD and define relationships" },
      { title: "Implement authentication", description: "Add user login and registration functionality" },
      { title: "Build API endpoints", description: "Create RESTful API for core features" },
      { title: "Develop frontend", description: "Build responsive user interface" },
      { title: "Testing and QA", description: "Write tests and fix bugs" },
      { title: "Deploy to production", description: "Launch the application" }
    ];
    setJsonInput(JSON.stringify(example, null, 2));
    handleInputChange(JSON.stringify(example, null, 2));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Create Milestones
          </CardTitle>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="json-input">JSON Input</Label>
          <div className="text-sm text-gray-600 mb-2">
            Enter an array of milestone objects. Only &quot;title&quot; is required.
          </div>
          <Textarea
            id="json-input"
            value={jsonInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={`[
  { "title": "First milestone", "description": "Optional description" },
  { "title": "Second milestone" }
]`}
            rows={10}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={loadExample}>
            Load Example
          </Button>
          <div className="flex items-center gap-2 text-sm">
            {isValidJSON ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-600">Valid JSON</span>
              </>
            ) : jsonInput.trim() ? (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-600">Invalid</span>
              </>
            ) : null}
          </div>
        </div>

        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {previewData && (
          <div>
            <Label>Preview ({previewData.length} milestones)</Label>
            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
              {previewData.map((milestone, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded border">
                  <div className="font-medium text-sm">{milestone.title}</div>
                  {milestone.description && (
                    <div className="text-xs text-gray-600 mt-1">{milestone.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            onClick={handleGenerate}
            disabled={!isValidJSON || !previewData || isProcessing}
          >
            {isProcessing ? "Creating..." : `Create ${previewData?.length || 0} Milestones`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}