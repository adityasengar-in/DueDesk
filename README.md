# DueDesk

A fee & installment collection tracker for small service businesses — gyms, tuition centers, coaching institutes, hostels — that currently track recurring fees in a notebook, Excel, or WhatsApp and routinely lose track of who's paid and who's overdue.

## Problem

Small businesses with recurring fees (monthly gym membership, term-wise tuition fees) have no lightweight tool between "notebook" and "full accounting software." Late payments go unnoticed until someone checks manually.

## What it does (v1)

- Owner logs in (Google OAuth)
- Owner adds a member/student with a total fee, split into installments with due dates
- Dashboard shows total collected, pending, and overdue amounts at a glance
- Payment status per installment is marked manually (paid/unpaid)
- History view of completed fee plans
- **Automated reminders**: each installment gets two scheduled alerts — 7 days before its due date and 2 days before — sent by email (WhatsApp as a stretch goal) to the member, naming the amount and due date

## Explicitly out of scope for v1

- Real payment gateway integration (installments are marked paid manually)
- Member-side login/role (owner-only app)
- Multi-tenant "rooms" or invite-based access

These are natural v2 additions once the core is working.

## Tech stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB (or MySQL)
- Auth: Google OAuth
- Reminders: scheduled job (node-cron or a hosted cron trigger) + email via Nodemailer/SendGrid

## Data model

**User** (owner) — googleId, name, email

**Member** — ownerId, name, email/phone, notes

**FeePlan** — ownerId, memberId, totalAmount, installmentCount, startDate, frequency

**Installment** — feePlanId, amount, dueDate, status (pending/paid/overdue), paidAt, reminder7dSentAt, reminder2dSentAt

## Reminder logic (daily job)

1. Query installments with status = pending
2. If `dueDate - today == 7` and `reminder7dSentAt` is null → send reminder, set `reminder7dSentAt`
3. If `dueDate - today == 2` and `reminder2dSentAt` is null → send reminder, set `reminder2dSentAt`
4. If `dueDate < today` and status = pending → set status = overdue

## Roadmap

- v1: owner-only, manual payment marking, email reminders
- v2: WhatsApp reminders (Meta Cloud API), real payment gateway (Razorpay sandbox), member-facing view