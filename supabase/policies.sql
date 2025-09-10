-- RLS Policies for TimeTable and TimeTableActivity

-- Enable RLS on TimeTable
ALTER TABLE "TimeTable" ENABLE ROW LEVEL SECURITY;

-- Enable RLS on TimeTableActivity
ALTER TABLE "TimeTableActivity" ENABLE ROW LEVEL SECURITY;

-- TimeTable Policies
-- Policy for SELECT: Users can only view their own timetables
CREATE POLICY "Users can view own timetables" ON "TimeTable"
  FOR SELECT
  USING ("userId" = (auth.jwt() ->> 'sub'::text));

-- Policy for INSERT: Users can only create their own timetables
CREATE POLICY "Users can create own timetables" ON "TimeTable"
  FOR INSERT
  WITH CHECK ("userId" = (auth.jwt() ->> 'sub'::text));

-- Policy for UPDATE: Users can only update their own timetables
CREATE POLICY "Users can update own timetables" ON "TimeTable"
  FOR UPDATE
  USING ("userId" = (auth.jwt() ->> 'sub'::text))
  WITH CHECK ("userId" = (auth.jwt() ->> 'sub'::text));

-- Policy for DELETE: Users can only delete their own timetables
CREATE POLICY "Users can delete own timetables" ON "TimeTable"
  FOR DELETE
  USING ("userId" = (auth.jwt() ->> 'sub'::text));

-- TimeTableActivity Policies
-- Policy for SELECT: Users can only view activities from their own timetables
CREATE POLICY "Users can view own timetable activities" ON "TimeTableActivity"
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "TimeTable"
      WHERE "TimeTable"."id" = "TimeTableActivity"."timeTableId"
      AND "TimeTable"."userId" = (auth.jwt() ->> 'sub'::text)
    )
  );

-- Policy for INSERT: Users can only create activities in their own timetables
CREATE POLICY "Users can create activities in own timetables" ON "TimeTableActivity"
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "TimeTable"
      WHERE "TimeTable"."id" = "TimeTableActivity"."timeTableId"
      AND "TimeTable"."userId" = (auth.jwt() ->> 'sub'::text)
    )
  );

-- Policy for UPDATE: Users can only update activities in their own timetables
CREATE POLICY "Users can update activities in own timetables" ON "TimeTableActivity"
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM "TimeTable"
      WHERE "TimeTable"."id" = "TimeTableActivity"."timeTableId"
      AND "TimeTable"."userId" = (auth.jwt() ->> 'sub'::text)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM "TimeTable"
      WHERE "TimeTable"."id" = "TimeTableActivity"."timeTableId"
      AND "TimeTable"."userId" = (auth.jwt() ->> 'sub'::text)
    )
  );

-- Policy for DELETE: Users can only delete activities from their own timetables
CREATE POLICY "Users can delete activities from own timetables" ON "TimeTableActivity"
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM "TimeTable"
      WHERE "TimeTable"."id" = "TimeTableActivity"."timeTableId"
      AND "TimeTable"."userId" = (auth.jwt() ->> 'sub'::text)
    )
  );
