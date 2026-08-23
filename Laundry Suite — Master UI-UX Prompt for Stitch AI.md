# Laundry Suite — Master UI/UX Prompt

## ROLE

You are a senior Product Designer, UX Architect, and SaaS UI Designer.

Design a production-quality SaaS application called **Laundry Suite**, an all-in-one business operating platform for laundry businesses in Indonesia.

The product is a **multi-tenant SaaS platform** used by:

- Laundry owners
- Tenant administrators
- Outlet managers
- Cashiers
- Production staff
- QC staff
- Couriers
- Finance/accounting staff
- HR/payroll staff
- Marketing/CRM staff
- Inventory staff

There is also a separate responsive PWA experience for:

- Laundry customers
- Couriers

---

# 1. PRODUCT CONTEXT

Laundry Suite helps laundry businesses manage their entire business from one platform.

The platform includes:

- POS
- Order Management
- Customer Management
- Production Management
- Barcode / QR Tracking
- Quality Control
- Pickup & Delivery
- Courier Management
- CRM
- Membership
- Loyalty
- Voucher & Promotions
- Inventory
- Supplier Management
- Employee Management
- Attendance
- Payroll
- Commission
- Accounting
- ERP
- Reporting
- Analytics
- WhatsApp notifications
- SaaS subscription management

The product must work for:

- Small single-outlet laundries
- Growing multi-outlet laundries
- Large laundry businesses
- Laundry chains
- Franchise businesses

The core product principle is:

> **Simple for small laundry businesses, powerful enough for enterprise.**

---

# 2. BRAND

## Brand Name

**Laundry Suite**

Always use the brand name as:

> Laundry Suite

Do not use:

- LaundrySuite
- Laundry-Suite
- Laundry suite

unless required for technical URLs or code.

---

# 3. BRAND POSITIONING

Primary positioning:

> **The Operating Suite for Laundry Businesses**

Indonesian positioning:

> **Satu Platform untuk Mengelola Seluruh Bisnis Laundry**

Brand promise:

> **Laundry Suite membuat bisnis laundry lebih mudah dikelola, lebih terukur, dan siap berkembang.**

---

# 4. BRAND PERSONALITY

The visual and UX personality should be:

- Modern
- Clean
- Professional
- Friendly
- Reliable
- Intelligent
- Efficient
- Scalable

The interface should feel like a modern premium SaaS product.

Reference the quality level and design maturity of products such as:

- Linear
- Stripe
- Notion
- Vercel
- Shopify Admin
- modern fintech dashboards

Do NOT copy their interfaces.

Use them only as inspiration for:

- clarity,
- hierarchy,
- spacing,
- information density,
- component quality,
- interaction patterns.

---

# 5. VISUAL DIRECTION

The primary visual identity is:

> **WHITE + BLUE**

The interface should be predominantly white with blue used as the primary brand and action color.

Avoid making the entire interface blue.

The product should feel:

> Clean like a modern laundry business.  
> Trustworthy like financial software.  
> Modern like a premium SaaS product.

---

# 6. COLOR SYSTEM

Use this initial color system.

## Primary

```text
Primary Blue: #2563EB
Deep Blue: #1D4ED8
```

## Supporting Blue

```text
Light Blue: #EFF6FF
Very Light Blue: #F8FBFF
```

## Neutral

```text
Dark Navy: #0F172A
White: #FFFFFF
Background: #F8FAFC
Border: #E2E8F0
Muted Text: #64748B
```

## Semantic Colors

Use semantic colors only when they communicate meaning.

```text
Success: Green
Warning: Amber
Error: Red
Info: Blue
```

Do not use semantic colors as decorative colors.

---

# 7. COLOR PRINCIPLES

The approximate visual balance should be:

- 70% white / neutral
- 20% blue / light blue
- 10% dark text and semantic states

Blue should primarily be used for:

- Primary CTA
- Active navigation
- Links
- Selected states
- Important metrics
- Focus states
- Progress indicators
- Brand elements

Do not use blue everywhere.

---

# 8. TYPOGRAPHY

Use:

> **Inter**

Typography should be highly readable and optimized for SaaS dashboards.

Suggested hierarchy:

```text
Display: 48–64px
H1: 36–48px
H2: 28–36px
H3: 20–24px
Body: 14–16px
Small: 12–13px
```

Use font weight intentionally:

- Regular: body
- Medium: labels
- Semibold: headings and important values
- Bold: only for major emphasis

Avoid excessive bold text.

---

# 9. DESIGN PRINCIPLES

## 9.1 Clarity First

Users should immediately understand:

- where they are,
- what is happening,
- what requires attention,
- what action they can take.

## 9.2 Information-Rich but Not Overwhelming

Laundry Suite is an operational system.

The interface needs enough information for business users without becoming visually crowded.

## 9.3 Action-Oriented

Important actions should always be obvious.

Examples:

- Create Order
- Add Customer
- Assign Courier
- Update Status
- Record Payment
- Add Inventory
- Create Campaign

## 9.4 Consistency

The same interaction should look and behave the same across the entire product.

## 9.5 Progressive Disclosure

Do not show advanced ERP functionality to users who do not need it.

## 9.6 Responsive by Default

The main admin application should work well on:

- Desktop
- Laptop
- Tablet

Customer and courier experiences should be optimized for mobile PWA.

---

# 10. APPLICATION STRUCTURE

The main admin application should use a desktop SaaS layout.

Recommended structure:

```text
┌─────────────────────────────────────────────────────────────┐
│ Top Header                                      User / Bell │
├───────────────┬─────────────────────────────────────────────┤
│               │                                             │
│ Sidebar       │ Main Content                                │
│               │                                             │
│ Dashboard     │                                             │
│ Orders        │                                             │
│ Production    │                                             │
│ Delivery      │                                             │
│ Customers     │                                             │
│ Inventory     │                                             │
│ People        │                                             │
│ Finance       │                                             │
│ Reports       │                                             │
│               │                                             │
│ Settings      │                                             │
│               │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

---

# 11. SIDEBAR

The primary navigation should contain:

```text
Dashboard

Operations
  Orders
  Production
  Quality Control

Delivery
  Pickup
  Delivery
  Couriers

Customers
  Customers
  Membership
  Loyalty
  Promotions
  Campaigns

Inventory
  Inventory
  Purchasing
  Suppliers

People
  Employees
  Attendance
  Payroll
  Commission

Finance
  Accounting
  Cash & Bank
  Receivables
  Payables
  Expenses

Reports

Settings
```

The navigation should support:

- Active state
- Collapsed state
- Group labels
- Badges
- Notification indicators
- Permission-based visibility

Users must only see modules they have permission to access.

---

# 12. TENANT / OUTLET SWITCHER

Laundry Suite is multi-tenant and multi-outlet.

The header should provide a clear outlet context.

Example:

```text
Laundry Suite

[Bersih Jaya ▼]
[Jakarta Selatan ▼]
```

The user should always understand:

> Which tenant and outlet am I currently viewing?

For users with multi-outlet permissions, allow switching between:

- Current outlet
- Multiple selected outlets
- All outlets

Do not make outlet context ambiguous.

---

# 13. TOP HEADER

Header should contain:

- Tenant/outlet switcher
- Search
- Notifications
- Help
- User profile

Optional:

- Quick create button

Example:

```text
[Bersih Jaya ▼] [Jakarta ▼]

Search anything...             🔔   ?   [Budi ▼]
```

---

# 14. GLOBAL SEARCH

Design a global search pattern.

Search should eventually support:

- Orders
- Customers
- Employees
- Products
- Inventory
- Invoices

Example:

```text
Search orders, customers, invoices...
```

Results should be grouped by entity type.

---

# 15. BUTTON SYSTEM

Primary button:

> Blue background + white text

Secondary:

> White background + blue/dark text + border

Tertiary:

> Text button

Danger:

> Red only for destructive actions

Examples:

```text
[+ Create Order]

[Export]

[Cancel]

[Delete]
```

Buttons should have:

- Hover
- Active
- Disabled
- Loading
- Focus

states.

---

# 16. CARDS

Cards should be:

- White
- Subtle border
- Minimal shadow
- Medium radius

Avoid excessive floating cards.

Use cards for:

- KPI
- Summary
- Operational status
- Important information
- Dashboard widgets

---

# 17. TABLES

Tables are extremely important for Laundry Suite.

They should support:

- Sorting
- Filtering
- Search
- Pagination
- Column visibility
- Row selection
- Bulk actions
- Status badges
- Inline actions

Example order table:

```text
Order ID | Customer | Outlet | Service | Status | Total | Due Date
```

Use compact but readable row height.

---

# 18. STATUS SYSTEM

Laundry Suite has many operational states.

Create a consistent status badge system.

Examples:

```text
Received
Washing
Drying
Ironing
QC
Packing
Ready
Delivered
Completed
Cancelled
Overdue
```

Status should be recognizable through:

- Label
- Subtle color
- Optional icon

Do not rely on color alone.

---

# 19. FORM DESIGN

Forms should prioritize speed.

Use:

- Clear labels
- Helpful placeholders
- Inline validation
- Logical grouping
- Required field indicators
- Smart defaults
- Autocomplete
- Searchable dropdowns

Avoid extremely long forms.

For complex workflows use:

- Stepper
- Sections
- Tabs
- Progressive disclosure

---

# 20. MODAL DESIGN

Use modals for:

- Quick create
- Confirmation
- Small forms
- Quick actions

Do not put very complex workflows into small modals.

Use full-page workflows for:

- Large orders
- Payroll
- Accounting
- Complex configuration

---

# 21. EMPTY STATES

Every major page must have a useful empty state.

Example:

```text
No orders yet

Start your first laundry order to see it here.

[Create Order]
```

Empty states should explain:

1. What is missing.
2. Why it matters.
3. What the user should do next.

---

# 22. LOADING STATES

Use:

- Skeleton loading
- Inline loading
- Button loading

Avoid unnecessary full-screen loading.

---

# 23. ERROR STATES

Errors must be:

- Clear
- Actionable
- Human-readable

Example:

> Payment could not be completed.

> Check the payment method and try again.

[Try Again]

Avoid technical messages such as:

> Error 500: Internal Server Error.

---

# 24. DASHBOARD DESIGN

The owner dashboard is the primary reference screen.

Create a premium business dashboard containing:

## KPI Cards

- Today's Revenue
- Today's Orders
- Pending Orders
- Customers
- Outstanding Payments

## Production

- Washing
- Drying
- Ironing
- QC
- Packing

## SLA

- On Time
- At Risk
- Overdue

## Delivery

- Pickup Today
- Delivery Today
- Active Couriers

## Revenue

- Revenue trend
- Revenue by outlet
- Revenue by service

## Customer

- New customers
- Returning customers
- Membership
- Retention

The dashboard should prioritize actionable information over decorative charts.

---

# 25. POS DESIGN

POS is a high-frequency workflow.

Design for:

> **Speed + accuracy**

Main flow:

```text
Customer
→ Service
→ Weight / Item
→ Price
→ Discount
→ Payment
→ Receipt
```

The POS should minimize clicks.

Important elements:

- Customer search
- Quick customer creation
- Service selection
- Weight input
- Item quantity
- Price calculation
- Discount
- Voucher
- Deposit
- Payment method
- Balance due
- QR / barcode generation
- Receipt

---

# 26. PRODUCTION BOARD

Design a visual production workflow.

Use a Kanban-style layout:

```text
RECEIVED
WASHING
DRYING
IRONING
QC
PACKING
READY
```

Each order card should show:

- Order ID
- Customer
- Bag count
- Service
- Due time
- SLA status
- Priority
- Assigned staff

Express orders must be visually distinguishable.

---

# 27. BARCODE / QR WORKFLOW

Design interactions for scanning.

Flow:

```text
Scan QR
↓
Identify Order / Bag
↓
Show Current Status
↓
Show Next Action
↓
Confirm
↓
Update Status
```

The UI should make scanning extremely fast for production staff.

---

# 28. DELIVERY DESIGN

Delivery dashboard should show:

- Pickup jobs
- Delivery jobs
- Courier availability
- Active jobs
- Failed jobs
- Rescheduled jobs

Courier assignment should support:

- Manual assignment
- Auto assignment

Auto assignment factors:

- Location
- Distance
- Shift
- Capacity
- Workload

---

# 29. CUSTOMER PWA

The customer experience should be mobile-first.

Primary navigation:

```text
Home
Orders
Pickup
Rewards
Profile
```

Home screen:

```text
Hi, Budi 👋

Current Order
ORD-10291

Washing ✓
Drying ✓
Ironing ●
QC ○
Packing ○

Ready today at 17:00

[Track Order]
```

Customer should easily access:

- Order
- Pickup
- Delivery
- Membership
- Loyalty
- Voucher
- Wallet
- Order history
- Complaint
- Rating

---

# 30. COURIER PWA

The courier interface must be extremely simple.

Prioritize:

- Today's jobs
- Navigation
- Customer contact
- Pickup confirmation
- Delivery confirmation
- OTP
- Photo proof
- Status updates

Large touch targets.

Minimal typing.

Mobile-first.

---

# 31. CRM DESIGN

CRM dashboard should show:

```text
Total Customers
Active Customers
Inactive Customers
VIP Customers
New Customers
Returning Customers
```

Segments:

- High Value
- At Risk
- New
- Inactive
- Frequent
- VIP

Campaign creation should use a simple guided workflow.

---

# 32. MEMBERSHIP

Design membership management around:

- Tier
- Spending
- Points
- Benefits
- Expiry
- Customer count

Example:

```text
Bronze
1,820 members

Silver
420 members

Gold
165 members

Platinum
46 members
```

---

# 33. INVENTORY

Inventory dashboard:

```text
Total Stock Value

Low Stock
Out of Stock
Stock Movement
Purchase Orders
Consumption
Waste
```

Inventory item detail should show:

- Current stock
- Minimum stock
- Movement history
- Purchase history
- Consumption
- Cost

---

# 34. HR / PAYROLL

Employee dashboard:

```text
Employees
Attendance Today
Present
Late
Absent
On Leave
```

Payroll dashboard:

```text
Payroll Period
Gross Payroll
Commission
Deductions
Net Payroll
```

Payroll should be visually trustworthy and easy to review.

---

# 35. ACCOUNTING

Accounting should feel professional but not intimidating.

Dashboard:

```text
Revenue
Expenses
Gross Profit
Net Profit
Cash
Receivables
Payables
```

Modules:

- Chart of Accounts
- Journal
- General Ledger
- AR
- AP
- Cash & Bank
- Expenses
- Tax
- Financial Reports

Use clear financial hierarchy.

---

# 36. RESPONSIVE BEHAVIOR

## Desktop

Use:

- Full sidebar
- Multi-column dashboards
- Dense tables
- Advanced filtering

## Tablet

Use:

- Collapsible sidebar
- Responsive tables
- Reduced columns

## Mobile Admin

Use:

- Bottom navigation or compact sidebar
- Stacked cards
- Simplified tables
- Mobile forms

## Customer / Courier

Optimize primarily for:

> Mobile PWA.

---

# 37. ACCESSIBILITY

Design for WCAG-conscious accessibility.

Ensure:

- Sufficient color contrast
- Keyboard navigation
- Visible focus states
- Accessible labels
- Do not rely on color alone
- Large enough touch targets
- Clear error messages

---

# 38. DATA DENSITY

Laundry Suite is an operational SaaS.

Use a moderate-to-high information density for:

- Tables
- Production boards
- Order management
- Accounting

But maintain generous spacing for:

- Dashboard
- Marketing pages
- Customer PWA

---

# 39. MICROINTERACTIONS

Use subtle microinteractions for:

- Status updates
- Successful payment
- Order creation
- QR scan
- Delivery completion
- Inventory adjustment

Animations should be:

- Fast
- Subtle
- Functional

Avoid excessive animations.

---

# 40. UX PRINCIPLE: REDUCE CLICKS

High-frequency workflows should require as few interactions as possible.

Priority workflows:

### Create Order

Target:

> 3–5 major interaction steps.

### Update Production

Target:

> Scan → Confirm → Done.

### Courier Pickup

Target:

> Open Job → Navigate → Confirm Pickup.

### Payment

Target:

> Select Method → Confirm.

---

# 41. UX PRINCIPLE: SHOW THE NEXT ACTION

Whenever possible, the UI should answer:

> **"What should I do next?"**

Examples:

Order:

> **Ready for QC**

Production:

> **Scan next bag**

Courier:

> **Pickup at 12:30**

Finance:

> **3 invoices overdue**

Inventory:

> **5 items below minimum stock**

---

# 42. DESIGN SYSTEM COMPONENTS

Create reusable components for:

- Button
- Input
- Select
- Search
- Date picker
- Time picker
- Modal
- Drawer
- Tabs
- Card
- KPI card
- Table
- Pagination
- Badge
- Avatar
- Dropdown
- Tooltip
- Toast
- Alert
- Progress
- Stepper
- Timeline
- Kanban card
- Timeline event
- Empty state
- Skeleton
- Confirmation dialog

All components must follow the Laundry Suite visual system.

---

# 43. DESIGN CONSISTENCY

Every screen must use:

- Same spacing system
- Same typography
- Same border radius
- Same shadows
- Same button styles
- Same status styles
- Same navigation
- Same interaction patterns

Do not introduce arbitrary visual styles on individual pages.

---

# 44. DESIGN LANGUAGE

The final product should feel:

> **Clean + Blue + Premium + Operational + Trustworthy**

Think:

```text
Modern SaaS
     +
Business Dashboard
     +
Laundry Operations
     +
Indonesian Business Context
```

---

# 45. DO NOT DO

Do not:

- Overuse blue
- Use excessive gradients
- Use glassmorphism everywhere
- Use giant rounded cards everywhere
- Use excessive shadows
- Use playful cartoon laundry graphics
- Use overly decorative dashboards
- Use inconsistent icon styles
- Use excessive animation
- Make tables difficult to scan
- Hide important actions
- Make POS workflows slow

---

# 46. IMPORTANT PRODUCT CONTEXT

The application is multi-tenant.

Always account for:

```text
Platform
↓
Tenant
↓
Outlet
↓
User
```

The UI should make the current tenant and outlet context clear.

Users with appropriate permissions can switch between outlets.

Users without permission must never see data from unauthorized outlets.

---

# 47. DESIGN OUTPUT

Create a cohesive, production-quality Laundry Suite design system and application shell.

The initial design should include:

1. Login
2. Tenant onboarding
3. Main dashboard
4. Sidebar navigation
5. Header
6. Tenant/outlet switcher
7. Global search
8. KPI cards
9. Tables
10. Forms
11. Buttons
12. Status badges
13. Modals
14. Notifications
15. Empty states
16. Loading states
17. Error states
18. Responsive behavior

Also create representative screens for:

- Owner Dashboard
- Orders
- POS
- Production Board
- Delivery Dashboard
- Customers
- Inventory
- Employees
- Finance

---

# 48. FINAL DESIGN GOAL

The final interface should make a laundry owner think:

> **"Akhirnya semua bisnis laundry saya ada di satu tempat."**

The interface should make employees think:

> **"Saya langsung tahu apa yang harus saya kerjakan."**

The interface should make customers think:

> **"Saya tahu persis status laundry saya."**

And the overall product should communicate:

> **Laundry Suite is not just a laundry POS.**

> **Laundry Suite is the operating system for the entire laundry business.**