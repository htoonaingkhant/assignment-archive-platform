import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "study_years" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "sort_order" numeric NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    INSERT INTO "study_years" ("name", "sort_order") VALUES
      ('First Year', 1),
      ('Second Year', 2),
      ('Third Year', 3),
      ('Fourth Year', 4),
      ('Fifth Year', 5);

    DROP INDEX "academicYear_major_studyYear_semester_subject_idx";
    ALTER TABLE "semester_subjects" ADD COLUMN "study_year_id" integer;

    UPDATE "semester_subjects" AS semester_subject
    SET "study_year_id" = study_year."id"
    FROM "study_years" AS study_year
    WHERE study_year."sort_order" = CASE semester_subject."study_year"
      WHEN 'first-year' THEN 1
      WHEN 'second-year' THEN 2
      WHEN 'third-year' THEN 3
      WHEN 'fourth-year' THEN 4
      WHEN 'fifth-year' THEN 5
    END;

    ALTER TABLE "semester_subjects" ALTER COLUMN "study_year_id" SET NOT NULL;
    ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "study_years_id" integer;

    CREATE UNIQUE INDEX "study_years_name_idx" ON "study_years" USING btree ("name");
    CREATE UNIQUE INDEX "study_years_sort_order_idx" ON "study_years" USING btree ("sort_order");
    CREATE INDEX "study_years_updated_at_idx" ON "study_years" USING btree ("updated_at");
    CREATE INDEX "study_years_created_at_idx" ON "study_years" USING btree ("created_at");

    ALTER TABLE "semester_subjects"
      ADD CONSTRAINT "semester_subjects_study_year_id_study_years_id_fk"
      FOREIGN KEY ("study_year_id") REFERENCES "public"."study_years"("id")
      ON DELETE set null ON UPDATE no action;
    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_study_years_fk"
      FOREIGN KEY ("study_years_id") REFERENCES "public"."study_years"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "semester_subjects_study_year_idx" ON "semester_subjects" USING btree ("study_year_id");
    CREATE INDEX "payload_locked_documents_rels_study_years_id_idx" ON "payload_locked_documents_rels" USING btree ("study_years_id");
    CREATE UNIQUE INDEX "academicYear_major_studyYear_semester_subject_idx"
      ON "semester_subjects" USING btree ("academic_year_id", "major_id", "study_year_id", "semester", "subject_id");

    ALTER TABLE "semester_subjects" DROP COLUMN "study_year";
    DROP TYPE "public"."enum_semester_subjects_study_year";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_semester_subjects_study_year" AS ENUM(
      'first-year', 'second-year', 'third-year', 'fourth-year', 'fifth-year'
    );

    ALTER TABLE "semester_subjects"
      ADD COLUMN "study_year" "enum_semester_subjects_study_year" DEFAULT 'first-year' NOT NULL;

    UPDATE "semester_subjects" AS semester_subject
    SET "study_year" = (CASE study_year."sort_order"
      WHEN 1 THEN 'first-year'
      WHEN 2 THEN 'second-year'
      WHEN 3 THEN 'third-year'
      WHEN 4 THEN 'fourth-year'
      WHEN 5 THEN 'fifth-year'
      ELSE 'first-year'
    END)::"enum_semester_subjects_study_year"
    FROM "study_years" AS study_year
    WHERE study_year."id" = semester_subject."study_year_id";

    ALTER TABLE "semester_subjects" ALTER COLUMN "study_year" DROP DEFAULT;
    DROP INDEX "academicYear_major_studyYear_semester_subject_idx";
    ALTER TABLE "semester_subjects"
      DROP CONSTRAINT "semester_subjects_study_year_id_study_years_id_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT "payload_locked_documents_rels_study_years_fk";
    DROP INDEX "semester_subjects_study_year_idx";
    DROP INDEX "payload_locked_documents_rels_study_years_id_idx";
    ALTER TABLE "semester_subjects" DROP COLUMN "study_year_id";
    ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "study_years_id";
    DROP TABLE "study_years";

    CREATE UNIQUE INDEX "academicYear_major_studyYear_semester_subject_idx"
      ON "semester_subjects" USING btree ("academic_year_id", "major_id", "study_year", "semester", "subject_id");
  `)
}
