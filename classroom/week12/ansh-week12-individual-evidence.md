# Ansh Sharma — Week 12 individual evidence receipt

**Student:** Ansh Sharma (`@anshsharma123`)  
**Week:** 12 — QA follow-through  
**Date of recorded phone test:** November 19, 2026  
**Linked issue:** [#83 — phone subject assignment and compact mobile administration text](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83)

## My contribution

I performed and reported a focused deployed-site subject-persistence retest on an **iPhone 16 Pro running iOS 27.0.1 in Safari**. The test was carried forward from my Week 11 report, where a subject assignment appeared saved but disappeared after refresh.

### Test performed

1. Opened **Grade 6 · Class A (Room 101)** in Subjects & timetable.
2. Selected **Discrete Mathematics**.
3. Selected **Farhan Khan (T06)** as the subject teacher and confirmed the assignment.
4. Confirmed that Discrete Mathematics and Farhan Khan appeared in Class subjects.
5. Refreshed Safari and checked the Class subjects list again.

### Result

**Passed in this tested scope.** Discrete Mathematics with Farhan Khan remained visible in Grade 6 · Class A after the reported Safari refresh.

## Evidence

- [Full retest procedure, result and scope](ansh-subject-persistence-retest.md)
- [Before confirmation screenshot](evidence/ansh-subject-persistence-retest/01-assignment-form.jpg)
- [Saved-before-refresh screenshot](evidence/ansh-subject-persistence-retest/02-saved-before-refresh.jpg)
- [Present-after-refresh screenshot](evidence/ansh-subject-persistence-retest/03-present-after-refresh.jpg)
- [Week 11 original failing observation](../week11/ansh-iphone-subject-persistence.md)
- [Issue #83 discussion and owner follow-up](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team1/issues/83)

## What this evidence does and does not show

This is a passing Grade 6 · Class A retest. It does **not** prove every possible subject/teacher combination is fixed: the Week 11 failure involved Moral Education with Hari Adhikari, while this retest used Discrete Mathematics with Farhan Khan. The issue owner retains the closure decision for #83.

I did not claim code implementation, root-cause diagnosis, or another teammate's work as my own. My evidenced contribution is the physical-phone test, screenshots, refresh observation, and report of the result.

## Handoff explanation

If asked, I can explain: a saved-looking subject assignment must remain visible after a fresh page load; the test checks that behaviour by adding a subject/teacher, refreshing Safari, and reading the Class subjects list again.

## AI-use note

AI assistance organized this receipt and its links. The iPhone actions, screenshots, refresh observation, and reported result were performed or confirmed by Ansh Sharma.

