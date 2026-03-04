# GHWC Data Mapping — Google Sheets → Supabase

## Source Sheets

### 1. Time Bank Master (Google Sheet with 3 tabs)

**Tab: "Co-op time bank"** → `transactions` table
| Sheet Column | DB Field | Notes |
|---|---|---|
| Facebook Name | `member_id` (lookup) | Match to members by display_name |
| Role | — | Not imported (informational only) |
| Date | `activity_date` | Parse from M/D/YYYY |
| Month | `month` | |
| Year | `year` | |
| Category | `category_id` (lookup) | Match to categories by name |
| Description | `description` | |
| Hours Earned | `hours` where type='earned' | |
| Hours Used | `hours` where type='used' | |
| Hours Donated | `hours` where type='donated' | |
| Hours Available | — | NOT imported — recalculated from balances view |

**Tab: "Hours Summary"** → Not imported. Used for reconciliation only (Step 2.4).

**Tab: "Onboarded Participant list"** → Not imported directly. Cross-reference only.

### 2. Participants Review (Google Sheet) → `members` table
| Sheet Column | DB Field | Notes |
|---|---|---|
| PARTICIPANT NAME | `first_name` + `last_name` | Split on first space |
| FACEBOOK NAME | `display_name` | Key for matching to transactions |
| PARTICIPANT EMAIL | `email` | |
| Date Last Updated | `onboarded_date` | |
| Status Next Steps | `status` | See mapping below |
| Role | `role` | See mapping below |

**Columns ignored:** Phone, Referred By, Facebook User Type, Joined FB Group, Date Left Facebook, Notes, skills to share, and all onboarding checklist columns.

## Status Mapping

| Google Sheet Value | `members.status` |
|---|---|
| 0-Onboarding Complete | `active` |
| 1-Pending Time Bank | `pending` |
| 2-Pending Records Search | `pending` |
| 3-Requirements Missing | `pending` |
| 4-Pending Email Welcome | `pending` |

## Role Mapping

| Google Sheet Value | `members.role` |
|---|---|
| Participant | `member` |
| Advisory Board | `member` |
| Leadership | `admin` |
| Executive | `admin` |

> **Ask GHWC:** Who is the Time Bank manager? The `manager` role doesn't exist in the spreadsheet — it needs to be manually assigned to the person(s) who approve hours.

## Transaction Type Logic

Each row in the "Co-op time bank" tab can generate 1-3 transaction records:
- If `Hours Earned` has a value → create transaction with `type='earned'`
- If `Hours Used` has a value → create transaction with `type='used'`
- If `Hours Donated` has a value → create transaction with `type='donated'`

All transaction `hours` values are stored as positive numbers. The `type` field indicates direction. The `balances` view calculates: earned - used - donated = available.
