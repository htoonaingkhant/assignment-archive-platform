import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_semester_subjects_study_year" AS ENUM('first-year', 'second-year', 'third-year', 'fourth-year', 'fifth-year');
  DROP INDEX "academicYear_major_semester_subject_idx";
  ALTER TABLE "semester_subjects" ADD COLUMN "study_year" "enum_semester_subjects_study_year" DEFAULT 'first-year' NOT NULL;
  ALTER TABLE "semester_subjects" ALTER COLUMN "study_year" DROP DEFAULT;
  CREATE UNIQUE INDEX "academicYear_major_studyYear_semester_subject_idx" ON "semester_subjects" USING btree ("academic_year_id","major_id","study_year","semester","subject_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "academicYear_major_studyYear_semester_subject_idx";
  CREATE UNIQUE INDEX "academicYear_major_semester_subject_idx" ON "semester_subjects" USING btree ("academic_year_id","major_id","semester","subject_id");
  ALTER TABLE "semester_subjects" DROP COLUMN "study_year";
  DROP TYPE "public"."enum_semester_subjects_study_year";`)
}
