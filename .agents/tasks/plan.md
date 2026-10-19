# Implementation Plan

## Overview
Three independent features: (1) seed faculties/departments, (2) admin UI upgrades for courses + auth fix, (3) carryover CGPA support. Features can be implemented in any order — they touch different files with no shared dependencies.

---

- [ ] 1. **Seed script — create `scripts/seed-faculties-departments.ts`**
      Write a standalone TSX script that connects to MongoDB via `process.env.DATABASE_URL`, then upserts all 11 faculties and their departments using `findOneAndUpdate({ code }, data, { upsert: true, new: true })`. Faculty codes: FAGRIC, FBMS, FCMS, FCOMP, FEDU, FENG, FHUM, FLAW, FMS, FSCI, FSOC. Each department record needs `name`, `code`, and `facultyId` (the ObjectId string of the parent faculty). Departments for FSCI/Biochemistry must use code `BCHSCI` to avoid clashing with FBMS/Biochemistry (BCH). Follow the exact pattern in `scripts/seed-cs-courses.ts`: import mongoose + dotenv, call `dotenv.config()`, connect, loop with existence check, log results, close connection.
      Files: `scripts/seed-faculties-departments.ts`
      Verify: `npx tsx scripts/seed-faculties-departments.ts` — prints "[+] Created/Skipped" lines for all 11 faculties and 56 departments, exits cleanly.

---

- [ ] 2. **Fix admin auth — allow any admin role on faculties, departments, courses pages**
      In `app/admin/faculties/page.tsx`, `app/admin/departments/page.tsx`, and `app/admin/courses/page.tsx`, change the `checkAuthorization` function: replace `if (data.isSuperAdmin)` with `if (data.isAdmin)`. Update the "Access Denied" message to say "Only admins can manage [faculties/departments/courses]." instead of "Only super admins…".
      Files: `app/admin/faculties/page.tsx`, `app/admin/departments/page.tsx`, `app/admin/courses/page.tsx`
      Verify: `npx tsc --noEmit` — no TypeScript errors.

---

- [ ] 3. **Fix API auth — allow any admin to POST courses**
      In `app/api/courses/route.ts`, remove the `canModifyAcademicData()` call and import. Replace with a direct session check: `const session = await getServerSession(authOptions); if (!session || session.user.role !== 'ADMIN') { return NextResponse.json({ error: "Admin access required" }, { status: 403 }) }`. Add `dbConnect()` call after the check (currently it only runs when `canModify` is true).
      Files: `app/api/courses/route.ts`
      Verify: `npx tsc --noEmit` — no TypeScript errors.

---

- [ ] 4. **Admin courses page — add faculty/department filter + isCarryOver checkbox**
      In `app/admin/courses/page.tsx`:
      a. Add `faculties` state (already fetched in `fetchData` alongside departments). Add `selectedFacultyId` and `selectedDepartmentId` state strings (default `""`).
      b. Add a Faculty selector and a Department selector (filtered to selected faculty) above the course list. When `selectedDepartmentId` changes, re-fetch `/api/courses?departmentId=<id>` (replace the current all-courses fetch). When no department is selected, show an empty list with a prompt to select a department.
      c. Add `isCarryOver: false` to `formData` initial state. Add an "Is Carryover Course?" checkbox (using `<Input type="checkbox">` or a Radix `Checkbox`) to the create/edit form, bound to `formData.isCarryOver`. Include `isCarryOver` in the course card display as a badge alongside the existing "Elective" badge.
      d. Add `isCarryOver` to the `Course` interface.
      Files: `app/admin/courses/page.tsx`
      Verify: `npx tsc --noEmit` — no TypeScript errors.

---

- [ ] 5. **Model updates — add `isCarryOver` to Course, `carryOverCourses` to Student, `isCarryOver` + index fix to Result**
      a. `models/Course.ts`: Add `isCarryOver: { type: Boolean, default: false }` to `CourseSchema`. Add `isCarryOver?: boolean` to `ICourse` interface.
      b. `models/Student.ts`: Add `carryOverCourses` array field to the schema:
         ```ts
         carryOverCourses: [{
           courseId: { type: String, ref: 'Course' },
           level: Number,
           semester: Number,
           originalSession: String
         }]
         ```
         Add `carryOverCourses?: Array<{ courseId: string; level: number; semester: number; originalSession: string }>` to `IStudent`.
      c. `models/Result.ts`: Add `isCarryOver: { type: Boolean, default: false }` to `ResultSchema`. Add `isCarryOver?: boolean` to `IResult`. **Remove** the unique compound index `{ studentId, courseId, sessionId, semester }` and replace it with a non-unique index `{ studentId: 1, courseId: 1 }` to allow retakes in the same session. Keep the existing `{ studentId: 1, level: 1, semester: 1 }` and `{ studentId: 1 }` indexes.
      Files: `models/Course.ts`, `models/Student.ts`, `models/Result.ts`
      Verify: `npx tsc --noEmit` — no TypeScript errors.

---

- [ ] 6. **Create `lib/cgpa.ts` — carryover-aware CGPA calculation**
      Export a single function `calculateCGPA(results: Array<{ courseId: string; gradePoint: number; creditUnits: number }>): number`. Implementation: group results by `courseId`, keep only the entry with the highest `gradePoint` per course (the best attempt), then compute `sum(gradePoint * creditUnits) / sum(creditUnits)`. Return `0` if the deduplicated array is empty.
      Files: `lib/cgpa.ts`
      Verify: `npx tsc --noEmit` — no TypeScript errors.

---

- [ ] 7. **Update analytics page — use `calculateCGPA` for cumulative, keep `calculateGPA` for per-semester**
      In `app/dashboard/analytics/page.tsx`:
      a. Add import: `import { calculateCGPA } from "@/lib/cgpa"`.
      b. Change the CGPA calculation at line ~97 from `calculateGPA(student.results.map(...))` to `calculateCGPA(student.results.map(r => ({ courseId: r.courseId, gradePoint: r.gradePoint, creditUnits: r.creditUnits })))`.
      c. Leave the per-semester `gpa` calculation inside `semesterData` using the existing `calculateGPA` — that is intentionally not deduplicated (it reflects semester performance, not cumulative).
      d. Remove the `calculateGPA` import only if it is no longer used anywhere else in the file; otherwise keep it.
      Files: `app/dashboard/analytics/page.tsx`
      Verify: `npx tsc --noEmit` — no TypeScript errors.

---

- [ ] 8. **Update results API — accept `isCarryOver`, skip duplicate check for retakes**
      In `app/api/results/route.ts`:
      a. Add `isCarryOver: z.boolean().optional().default(false)` to `resultSchema`.
      b. In the POST handler, change the duplicate-result check: wrap it so it only runs when `validatedData.isCarryOver !== true`. For carryover results, skip the `Result.findOne` check entirely and proceed directly to create.
      c. Pass `isCarryOver: validatedData.isCarryOver` to `Result.create(...)`.
      Files: `app/api/results/route.ts`
      Verify: `npx tsc --noEmit` — no TypeScript errors.

---

- [ ] 9. **Update add-result form — add "Is Carryover?" checkbox**
      In `app/dashboard/results/add/page.tsx`:
      a. Add `isCarryOver: false` to the `formData` state object.
      b. Add a checkbox field below the score input, labelled "Is this a carryover course?" bound to `formData.isCarryOver`.
      c. Include `isCarryOver: formData.isCarryOver` in the POST body of `handleSubmit`.
      Files: `app/dashboard/results/add/page.tsx`
      Verify: `npx tsc --noEmit` — no TypeScript errors.

---

- [ ] 10. **Full TypeScript check + cleanup**
       Run `npx tsc --noEmit` across the whole project and fix any remaining type errors introduced by the changes above (e.g., `IResult` missing `isCarryOver` propagated to consumers, `ICourse` missing `isCarryOver` in admin page type).
       Files: any file reporting TS errors
       Verify: `npx tsc --noEmit` exits with code 0 and no errors.
