# Subject Planner Test Report — Week 10

**Tester:** Ansh Sharma  
**Feature:** Subject planner and timetable workflow  
**Test type:** Manual UI test  
**Class:** Grade 2 · Class A  
**Term:** Fall term  
**Status:** Passed

## 1. Test Objective

Verify that a user can add a subject to a class, assign a teacher, schedule a lesson, and view the saved lesson in the weekly timetable.

## 2. Test Environment

- Class: Grade 2 · Class A
- Subject added: English
- Teacher: Demo Teacher Lee
- Other subject shown: Mathematics
- Lesson time: Tuesday, 10:00–11:00 AM
- School term: Fall term
- Time zone displayed: Nepal time (NPT)

## 3. Test Steps

1. Open the class planner and the **Subjects and timetable** section.
2. Select English from the Grade 2 subject library.
3. Add English as a class subject.
4. Choose a teacher and confirm the subject.
5. Drag the English class-subject card to Tuesday at 10:00 AM.
6. Review the lesson details and save the lesson.
7. Verify the saved lesson and class subjects in the weekly timetable.

## 4. Test Results

| Test ID | Test Case | Expected Result | Result |
|---|---|---|---|
| TC-01 | Open the class planner | Subject library, class subjects, and weekly timetable are displayed. | Pass |
| TC-02 | Select English from the subject library | The add-subject dialog opens and identifies English. | Pass |
| TC-03 | Assign a teacher and confirm | English is added to the class with the selected teacher. | Pass |
| TC-04 | Schedule an English lesson | The lesson form shows English, Tuesday, and 10:00–11:00 AM. | Pass |
| TC-05 | Save the lesson | The lesson appears in the weekly timetable at the selected day and time. | Pass |
| TC-06 | Review the saved timetable | Saved subjects and lessons are visible in the planner. | Pass |
| TC-07 | Review the additional planner states | Subject selection and Mathematics-only planner states are shown. | Pass |

## 5. Summary

The screenshots document the subject-planner workflow: adding English to the class, selecting a teacher, scheduling a Tuesday lesson, and viewing the saved timetable. The tested workflow completed successfully.

## 6. Screenshots

Place the seven screenshots in `classroom/week10/images/` using the filenames below. The links are relative to this report file. If you save the images in a different folder or use different filenames, update the links accordingly.

### Screenshot 1 — Planner with Mathematics lessons

[![Subject planner showing Mathematics in the class and weekly timetable] <img width="1717" height="847" alt="01 before only mathematics - Copy" src="https://github.com/user-attachments/assets/21f44579-2ec9-47c2-be56-e53713bd1d8b" />


### Screenshot 2 — Add class subject dialog

[![Add class subject dialog for English with teacher selection] <img width="1006" height="846" alt="02 step 1 popup english" src="https://github.com/user-attachments/assets/92cfca39-27b5-488f-91a1-c2053a326691" />


### Screenshot 3 — Add lesson dialog

[![Add lesson dialog showing English on Tuesday from 10:00 AM to 11:00 AM] <img width="1042" height="853" alt="03 add lesson popup" src="https://github.com/user-attachments/assets/e3bc94fa-75b4-4176-a94b-dd12ac571f24" />

### Screenshot 4 — English added to the class

[![Class subjects area showing English and Mathematics with their teachers] <img width="1056" height="845" alt="04 english linked with lee" src="https://github.com/user-attachments/assets/acc3f2c2-693a-42a0-bf4a-c2691584b576" />

### Screenshot 5 — Timetable after saving

[![Saved timetable showing Mathematics on Sunday and Monday and English on Tuesday](images/subject-planner-05-timetable-saved.png)](images/subject-planner-05-timetable-saved.png)

### Screenshot 6 — Mathematics-only class subject view

[![Planner showing Mathematics as the only class subject](images/subject-planner-06-mathematics-only.png)](images/subject-planner-06-mathematics-only.png)

### Screenshot 7 — English selected in the subject library

[![Planner showing English selected in the subject library while Mathematics remains a class subject](images/subject-planner-07-english-selected.png)](images/subject-planner-07-english-selected.png)

## 7. Final Result

**Pass.** The subject planner supported adding a class subject, assigning a teacher, creating a lesson, and displaying the saved lesson in the weekly timetable.
