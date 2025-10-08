-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Day" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Note" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LearningTopic" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LearningConcept" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Road" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Milestone" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USER TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view own profile"
ON "User"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own profile"
ON "User"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (id = (auth.jwt() ->> 'sub'))
WITH CHECK (id = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own profile"
ON "User"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (id = (auth.jwt() ->> 'sub'));

-- ============================================================================
-- DAY TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view own days"
ON "Day"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own days"
ON "Day"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own days"
ON "Day"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'))
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own days"
ON "Day"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ============================================================================
-- NOTE TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view own notes"
ON "Note"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own notes"
ON "Note"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own notes"
ON "Note"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'))
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own notes"
ON "Note"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ============================================================================
-- PROJECT TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view own projects"
ON "Project"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own projects"
ON "Project"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own projects"
ON "Project"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'))
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own projects"
ON "Project"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ============================================================================
-- TASK TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view own tasks"
ON "Task"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own tasks"
ON "Task"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own tasks"
ON "Task"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'))
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own tasks"
ON "Task"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));


-- ============================================================================
-- CATEGORY TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view own categories"
ON "Category"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own categories"
ON "Category"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own categories"
ON "Category"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'))
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own categories"
ON "Category"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ============================================================================
-- LEARNING TOPIC TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view own learning topics"
ON "LearningTopic"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own learning topics"
ON "LearningTopic"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own learning topics"
ON "LearningTopic"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'))
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own learning topics"
ON "LearningTopic"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ============================================================================
-- LEARNING CONCEPT TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view own learning concepts"
ON "LearningConcept"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own learning concepts"
ON "LearningConcept"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own learning concepts"
ON "LearningConcept"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'))
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own learning concepts"
ON "LearningConcept"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ============================================================================
-- ROAD TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view own roads"
ON "Road"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own roads"
ON "Road"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own roads"
ON "Road"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'))
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own roads"
ON "Road"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ============================================================================
-- MILESTONE TABLE POLICIES
-- ============================================================================

CREATE POLICY "Users can view own milestones"
ON "Milestone"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  "roadId" IN (
    SELECT id FROM "Road"
    WHERE "userId" = (auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Users can insert own milestones"
ON "Milestone"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
  "roadId" IN (
    SELECT id FROM "Road"
    WHERE "userId" = (auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Users can update own milestones"
ON "Milestone"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
  "roadId" IN (
    SELECT id FROM "Road"
    WHERE "userId" = (auth.jwt() ->> 'sub')
  )
)
WITH CHECK (
  "roadId" IN (
    SELECT id FROM "Road"
    WHERE "userId" = (auth.jwt() ->> 'sub')
  )
);

CREATE POLICY "Users can delete own milestones"
ON "Milestone"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
  "roadId" IN (
    SELECT id FROM "Road"
    WHERE "userId" = (auth.jwt() ->> 'sub')
  )
);

-- ============================================================================
-- ACCOUNT TABLE POLICIES (Auth.js)
-- ============================================================================

CREATE POLICY "Users can view own accounts"
ON "Account"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own accounts"
ON "Account"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own accounts"
ON "Account"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'))
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own accounts"
ON "Account"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ============================================================================
-- SESSION TABLE POLICIES (Auth.js)
-- ============================================================================

CREATE POLICY "Users can view own sessions"
ON "Session"
AS PERMISSIVE
FOR SELECT
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own sessions"
ON "Session"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own sessions"
ON "Session"
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'))
WITH CHECK ("userId" = (auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own sessions"
ON "Session"
AS PERMISSIVE
FOR DELETE
TO authenticated
USING ("userId" = (auth.jwt() ->> 'sub'));

-- ============================================================================
-- VERIFICATION TOKEN TABLE POLICIES (Auth.js)
-- ============================================================================

-- Verification tokens need special handling as they're used before authentication
CREATE POLICY "Anyone can view verification tokens"
ON "VerificationToken"
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY "Anyone can insert verification tokens"
ON "VerificationToken"
AS PERMISSIVE
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Anyone can delete verification tokens"
ON "VerificationToken"
AS PERMISSIVE
FOR DELETE
TO public
USING (true);