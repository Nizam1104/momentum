-- Enable RLS on all tables
ALTER TABLE "public"."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Day" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Note" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."TaskCompletion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Goal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."DailyGoal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Habit" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."HabitLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."TimeEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Tag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."NoteTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ProjectTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."TaskTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."GoalTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."HabitTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Template" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Achievement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."UserAchievement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."LearningTopic" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."LearningConcept" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."LearningTopicTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."LearningConceptTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."VerificationToken" ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- USER TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own profile"
ON "public"."User"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own profile"
ON "public"."User"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own profile"
ON "public"."User"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (id = (auth.jwt() ->> 'sub'));

-- ===========================================
-- LEARNING TOPIC TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own learning topics"
ON "public"."LearningTopic"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own learning topics"
ON "public"."LearningTopic"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own learning topics"
ON "public"."LearningTopic"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'))
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own learning topics"
ON "public"."LearningTopic"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ===========================================
-- LEARNING CONCEPT TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own learning concepts"
ON "public"."LearningConcept"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own learning concepts"
ON "public"."LearningConcept"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own learning concepts"
ON "public"."LearningConcept"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'))
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own learning concepts"
ON "public"."LearningConcept"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ===========================================
-- LEARNING TOPIC TAG TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own learning topic tags through topics"
ON "public"."LearningTopicTag"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."LearningTopic" lt
    WHERE lt.id = "LearningTopicTag"."topicId"
    AND lt."userId" = (auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Users can insert learning topic tags for own topics"
ON "public"."LearningTopicTag"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."LearningTopic" lt
    WHERE lt.id = "LearningTopicTag"."topicId"
    AND lt."userId" = (auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Users can update learning topic tags for own topics"
ON "public"."LearningTopicTag"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."LearningTopic" lt
    WHERE lt.id = "LearningTopicTag"."topicId"
    AND lt."userId" = (auth.jwt() ->> 'sub')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."LearningTopic" lt
    WHERE lt.id = "LearningTopicTag"."topicId"
    AND lt."userId" = (auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Users can delete learning topic tags for own topics"
ON "public"."LearningTopicTag"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."LearningTopic" lt
    WHERE lt.id = "LearningTopicTag"."topicId"
    AND lt."userId" = (auth.jwt() ->> 'sub')
  )
);

-- ===========================================
-- LEARNING CONCEPT TAG TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own learning concept tags through concepts"
ON "public"."LearningConceptTag"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."LearningConcept" lc
    WHERE lc.id = "LearningConceptTag"."conceptId"
    AND lc."userId" = (auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Users can insert learning concept tags for own concepts"
ON "public"."LearningConceptTag"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."LearningConcept" lc
    WHERE lc.id = "LearningConceptTag"."conceptId"
    AND lc."userId" = (auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Users can update learning concept tags for own concepts"
ON "public"."LearningConceptTag"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."LearningConcept" lc
    WHERE lc.id = "LearningConceptTag"."conceptId"
    AND lc."userId" = (auth.jwt() ->> 'sub')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM "public"."LearningConcept" lc
    WHERE lc.id = "LearningConceptTag"."conceptId"
    AND lc."userId" = (auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Users can delete learning concept tags for own concepts"
ON "public"."LearningConceptTag"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."LearningConcept" lc
    WHERE lc.id = "LearningConceptTag"."conceptId"
    AND lc."userId" = (auth.jwt() ->> 'sub')
  )
);

-- ===========================================
-- DAY TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own days"
ON "public"."Day"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own days"
ON "public"."Day"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own days"
ON "public"."Day"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own days"
ON "public"."Day"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ===========================================
-- NOTE TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own notes"
ON "public"."Note"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "Note"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    ) OR
    EXISTS (
        SELECT 1 FROM "public"."Project" WHERE "Project".id = "Note"."projectId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    ) OR
    EXISTS (
        SELECT 1 FROM "public"."Category" WHERE "Category".id = "Note"."categoryId" AND "Category"."userId" = (auth.jwt() ->> 'sub')
    ) OR
    ("dayId" IS NULL AND "projectId" IS NULL AND "categoryId" IS NULL)
);

CREATE POLICY "Users can insert own notes"
ON "public"."Note"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    ("dayId" IS NULL OR EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "Note"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )) AND
    ("projectId" IS NULL OR EXISTS (
        SELECT 1 FROM "public"."Project" WHERE "Project".id = "Note"."projectId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    )) AND
    ("categoryId" IS NULL OR EXISTS (
        SELECT 1 FROM "public"."Category" WHERE "Category".id = "Note"."categoryId" AND "Category"."userId" = (auth.jwt() ->> 'sub')
    ))
);

CREATE POLICY "Users can update own notes"
ON "public"."Note"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "Note"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    ) OR
    EXISTS (
        SELECT 1 FROM "public"."Project" WHERE "Project".id = "Note"."projectId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    ) OR
    EXISTS (
        SELECT 1 FROM "public"."Category" WHERE "Category".id = "Note"."categoryId" AND "Category"."userId" = (auth.jwt() ->> 'sub')
    ) OR
    ("dayId" IS NULL AND "projectId" IS NULL AND "categoryId" IS NULL)
);

CREATE POLICY "Users can delete own notes"
ON "public"."Note"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "Note"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    ) OR
    EXISTS (
        SELECT 1 FROM "public"."Project" WHERE "Project".id = "Note"."projectId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    ) OR
    EXISTS (
        SELECT 1 FROM "public"."Category" WHERE "Category".id = "Note"."categoryId" AND "Category"."userId" = (auth.jwt() ->> 'sub')
    ) OR
    ("dayId" IS NULL AND "projectId" IS NULL AND "categoryId" IS NULL)
);

-- ===========================================
-- PROJECT TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own projects"
ON "public"."Project"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own projects"
ON "public"."Project"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own projects"
ON "public"."Project"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own projects"
ON "public"."Project"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ===========================================
-- TASK TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own tasks"
ON "public"."Task"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Project" WHERE "Project".id = "Task"."projectId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can insert own tasks"
ON "public"."Task"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM "public"."Project" WHERE "Project".id = "Task"."projectId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can update own tasks"
ON "public"."Task"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Project" WHERE "Project".id = "Task"."projectId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can delete own tasks"
ON "public"."Task"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Project" WHERE "Project".id = "Task"."projectId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    )
);

-- ===========================================
-- TASK COMPLETION TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own task completions"
ON "public"."TaskCompletion"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "TaskCompletion"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can insert own task completions"
ON "public"."TaskCompletion"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "TaskCompletion"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can update own task completions"
ON "public"."TaskCompletion"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "TaskCompletion"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can delete own task completions"
ON "public"."TaskCompletion"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "TaskCompletion"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )
);

-- ===========================================
-- GOAL TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own goals"
ON "public"."Goal"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own goals"
ON "public"."Goal"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own goals"
ON "public"."Goal"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own goals"
ON "public"."Goal"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ===========================================
-- DAILY GOAL TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own daily goals"
ON "public"."DailyGoal"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "DailyGoal"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can insert own daily goals"
ON "public"."DailyGoal"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "DailyGoal"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can update own daily goals"
ON "public"."DailyGoal"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "DailyGoal"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can delete own daily goals"
ON "public"."DailyGoal"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "DailyGoal"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )
);

-- ===========================================
-- HABIT TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own habits"
ON "public"."Habit"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own habits"
ON "public"."Habit"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own habits"
ON "public"."Habit"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own habits"
ON "public"."Habit"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ===========================================
-- HABIT LOG TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own habit logs"
ON "public"."HabitLog"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "HabitLog"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can insert own habit logs"
ON "public"."HabitLog"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "HabitLog"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can update own habit logs"
ON "public"."HabitLog"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "HabitLog"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can delete own habit logs"
ON "public"."HabitLog"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "HabitLog"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )
);

-- ===========================================
-- TIME ENTRY TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own time entries"
ON "public"."TimeEntry"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
    ("dayId" IS NULL OR EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "TimeEntry"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )) AND
    ("projectId" IS NULL OR EXISTS (
        SELECT 1 FROM "public"."Project" WHERE "Project".id = "TimeEntry"."projectId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    )) AND
    ("taskId" IS NULL OR EXISTS (
        SELECT 1 FROM "public"."Task"
        JOIN "public"."Project" ON "Project".id = "Task"."projectId"
        WHERE "Task".id = "TimeEntry"."taskId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    ))
);

CREATE POLICY "Users can insert own time entries"
ON "public"."TimeEntry"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    ("dayId" IS NULL OR EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "TimeEntry"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )) AND
    ("projectId" IS NULL OR EXISTS (
        SELECT 1 FROM "public"."Project" WHERE "Project".id = "TimeEntry"."projectId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    )) AND
    ("taskId" IS NULL OR EXISTS (
        SELECT 1 FROM "public"."Task"
        JOIN "public"."Project" ON "Project".id = "Task"."projectId"
        WHERE "Task".id = "TimeEntry"."taskId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    ))
);

CREATE POLICY "Users can update own time entries"
ON "public"."TimeEntry"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
    ("dayId" IS NULL OR EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "TimeEntry"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )) AND
    ("projectId" IS NULL OR EXISTS (
        SELECT 1 FROM "public"."Project" WHERE "Project".id = "TimeEntry"."projectId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    )) AND
    ("taskId" IS NULL OR EXISTS (
        SELECT 1 FROM "public"."Task"
        JOIN "public"."Project" ON "Project".id = "Task"."projectId"
        WHERE "Task".id = "TimeEntry"."taskId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    ))
);

CREATE POLICY "Users can delete own time entries"
ON "public"."TimeEntry"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    ("dayId" IS NULL OR EXISTS (
        SELECT 1 FROM "public"."Day" WHERE "Day".id = "TimeEntry"."dayId" AND "Day"."userId" = (auth.jwt() ->> 'sub')
    )) AND
    ("projectId" IS NULL OR EXISTS (
        SELECT 1 FROM "public"."Project" WHERE "Project".id = "TimeEntry"."projectId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    )) AND
    ("taskId" IS NULL OR EXISTS (
        SELECT 1 FROM "public"."Task"
        JOIN "public"."Project" ON "Project".id = "Task"."projectId"
        WHERE "Task".id = "TimeEntry"."taskId" AND "Project"."userId" = (auth.jwt() ->> 'sub')
    ))
);

-- ===========================================
-- CATEGORY TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own categories"
ON "public"."Category"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own categories"
ON "public"."Category"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own categories"
ON "public"."Category"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own categories"
ON "public"."Category"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ===========================================
-- TAG TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own tags"
ON "public"."Tag"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own tags"
ON "public"."Tag"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own tags"
ON "public"."Tag"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own tags"
ON "public"."Tag"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ===========================================
-- TAG RELATIONSHIP TABLE POLICIES
-- ===========================================

-- Note Tags
CREATE POLICY "Users can view own note tags"
ON "public"."NoteTag"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Tag" WHERE "Tag".id = "NoteTag"."tagId" AND "Tag"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can insert own note tags"
ON "public"."NoteTag"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM "public"."Tag" WHERE "Tag".id = "NoteTag"."tagId" AND "Tag"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can delete own note tags"
ON "public"."NoteTag"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Tag" WHERE "Tag".id = "NoteTag"."tagId" AND "Tag"."userId" = (auth.jwt() ->> 'sub')
    )
);

-- Project Tags
CREATE POLICY "Users can view own project tags"
ON "public"."ProjectTag"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Tag" WHERE "Tag".id = "ProjectTag"."tagId" AND "Tag"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can insert own project tags"
ON "public"."ProjectTag"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM "public"."Tag" WHERE "Tag".id = "ProjectTag"."tagId" AND "Tag"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can delete own project tags"
ON "public"."ProjectTag"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Tag" WHERE "Tag".id = "ProjectTag"."tagId" AND "Tag"."userId" = (auth.jwt() ->> 'sub')
    )
);

-- Task Tags
CREATE POLICY "Users can view own task tags"
ON "public"."TaskTag"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Tag" WHERE "Tag".id = "TaskTag"."tagId" AND "Tag"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can insert own task tags"
ON "public"."TaskTag"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM "public"."Tag" WHERE "Tag".id = "TaskTag"."tagId" AND "Tag"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can delete own task tags"
ON "public"."TaskTag"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Tag" WHERE "Tag".id = "TaskTag"."tagId" AND "Tag"."userId" = (auth.jwt() ->> 'sub')
    )
);

-- Goal Tags
CREATE POLICY "Users can view own goal tags"
ON "public"."GoalTag"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Tag" WHERE "Tag".id = "GoalTag"."tagId" AND "Tag"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can insert own goal tags"
ON "public"."GoalTag"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM "public"."Tag" WHERE "Tag".id = "GoalTag"."tagId" AND "Tag"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can delete own goal tags"
ON "public"."GoalTag"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Tag" WHERE "Tag".id = "GoalTag"."tagId" AND "Tag"."userId" = (auth.jwt() ->> 'sub')
    )
);

-- Habit Tags
CREATE POLICY "Users can view own habit tags"
ON "public"."HabitTag"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Tag" WHERE "Tag".id = "HabitTag"."tagId" AND "Tag"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can insert own habit tags"
ON "public"."HabitTag"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM "public"."Tag" WHERE "Tag".id = "HabitTag"."tagId" AND "Tag"."userId" = (auth.jwt() ->> 'sub')
    )
);

CREATE POLICY "Users can delete own habit tags"
ON "public"."HabitTag"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "public"."Tag" WHERE "Tag".id = "HabitTag"."tagId" AND "Tag"."userId" = (auth.jwt() ->> 'sub')
    )
);

-- ===========================================
-- TEMPLATE TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own templates"
ON "public"."Template"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own templates"
ON "public"."Template"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own templates"
ON "public"."Template"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own templates"
ON "public"."Template"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ===========================================
-- ACHIEVEMENT TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own achievements"
ON "public"."Achievement"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own achievements"
ON "public"."Achievement"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own achievements"
ON "public"."Achievement"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own achievements"
ON "public"."Achievement"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ===========================================
-- USER ACHIEVEMENT TABLE POLICIES
-- ===========================================

CREATE POLICY "Users can view own user achievements"
ON "public"."UserAchievement"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own user achievements"
ON "public"."UserAchievement"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own user achievements"
ON "public"."UserAchievement"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own user achievements"
ON "public"."UserAchievement"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ===========================================
-- AUTH TABLES POLICIES (NextAuth/AuthJS)
-- ===========================================

-- Account table - users can only access their own accounts
CREATE POLICY "Users can view own accounts"
ON "public"."Account"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own accounts"
ON "public"."Account"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own accounts"
ON "public"."Account"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own accounts"
ON "public"."Account"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- Session table - users can only access their own sessions
CREATE POLICY "Users can view own sessions"
ON "public"."Session"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own sessions"
ON "public"."Session"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own sessions"
ON "public"."Session"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own sessions"
ON "public"."Session"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- VerificationToken table - allow authenticated users to manage verification tokens
