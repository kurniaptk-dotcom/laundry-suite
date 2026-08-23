# Product Requirements Document (PRD)
## Multi-Tenant Laundry SaaS Platform

**Status:** Product Definition  
**Target Market:** Indonesia  
**Platform:** Web Responsive + PWA  
**Business Model:** Multi-Tenant SaaS  
**Pricing Model:** Starter, Growth, Business

---

# 1. Executive Summary

Produk ini adalah platform **SaaS end-to-end untuk bisnis laundry** yang membantu pemilik laundry mengelola seluruh operasional bisnis dalam satu platform.

Platform mencakup:

- POS & Order Management
- Customer Management
- Production Management
- Barcode / QR Tracking
- Pickup & Delivery
- Courier Management
- CRM & Membership
- Loyalty Program
- Voucher & Promotion
- Inventory
- Employee Management
- Attendance
- Payroll
- Commission
- Accounting
- ERP
- Reporting & Analytics
- WhatsApp Integration

Platform dirancang sebagai **multi-tenant SaaS**, sehingga satu platform dapat digunakan oleh banyak bisnis laundry secara terisolasi.

Struktur utama:

```text
Platform
└── Tenant
    ├── Outlet
    ├── Users
    ├── Customers
    ├── Orders
    ├── Production
    ├── Delivery
    ├── CRM
    ├── Inventory
    ├── HR / Payroll
    └── Accounting / ERP
```

Satu tenant dapat memiliki satu atau banyak outlet.

---

# 2. Product Vision

> **Menjadi operating system utama bagi bisnis laundry Indonesia, dari order pelanggan hingga operasional, delivery, CRM, SDM, dan keuangan dalam satu platform.**

Produk tidak diposisikan sebagai sekadar aplikasi kasir.

Positioning:

> **All-in-one Operating System for Laundry Businesses**

---

# 3. Problem Statement

Bisnis laundry menghadapi berbagai masalah operasional:

1. Pencatatan order masih manual.
2. Sulit memantau status cucian.
3. Kesalahan transaksi dan pencatatan.
4. Pengelolaan kurir belum terstruktur.
5. Pelanggan tidak mengetahui status laundry.
6. Laporan penjualan sulit dibuat.
7. Pencatatan keuangan terpisah dari operasional.
8. Payroll dan komisi karyawan dilakukan secara manual.
9. Inventory bahan laundry sulit dipantau.
10. Membership pelanggan belum terkelola dengan baik.
11. Tidak ada CRM yang terintegrasi.
12. Owner multi-outlet kesulitan memonitor performa setiap outlet.
13. Proses pickup & delivery sulit dikoordinasikan.
14. Sulit mengetahui bottleneck pada proses produksi.
15. Sulit menghitung profitabilitas bisnis secara akurat.

---

# 4. Product Goals

## 4.1 Primary Goals

Produk harus:

- Mendigitalisasi seluruh proses order laundry.
- Memberikan real-time visibility terhadap status laundry.
- Mengurangi human error.
- Mengintegrasikan pickup & delivery.
- Meningkatkan customer retention melalui CRM.
- Mengintegrasikan inventory.
- Mengotomatisasi payroll dan komisi.
- Menyediakan accounting/ERP.
- Mendukung single outlet hingga franchise.
- Dapat digunakan oleh banyak tenant dalam satu platform SaaS.

## 4.2 Business Goals

Produk harus memungkinkan perusahaan SaaS:

- Menjual subscription ke banyak owner laundry.
- Menawarkan tiga paket SaaS.
- Mengontrol feature entitlement berdasarkan paket.
- Mengelola billing dan subscription.
- Mendukung upgrade/downgrade.
- Meningkatkan MRR.
- Memiliki expansion revenue dari tenant yang berkembang.

---

# 5. Target Customers

## 5.1 Starter Laundry

Karakteristik:

- 1 outlet.
- Owner terlibat langsung dalam operasional.
- Membutuhkan POS dan order management.

## 5.2 Growing Laundry

Karakteristik:

- Beberapa outlet.
- Memiliki karyawan.
- Memiliki delivery.
- Membutuhkan CRM dan inventory.

## 5.3 Enterprise / Franchise Laundry

Karakteristik:

- Banyak outlet.
- Banyak karyawan.
- Membutuhkan payroll.
- Membutuhkan accounting/ERP.
- Membutuhkan centralized reporting.
- Memerlukan franchise management.

---

# 6. User Roles

Sistem menggunakan:

> **RBAC + Granular Permissions + Scope**

## 6.1 Platform Super Admin

Mengelola platform SaaS:

- Tenant.
- Subscription.
- Billing.
- Platform configuration.
- Support.
- Feature configuration.
- System monitoring.

## 6.2 Tenant Owner

Pemilik bisnis laundry:

- Semua outlet.
- Semua transaksi.
- Customer.
- Staff.
- Inventory.
- CRM.
- Payroll.
- Accounting.
- Reporting.

## 6.3 Tenant Admin

Mengelola operasional tenant.

## 6.4 Outlet Manager

Mengelola outlet yang ditugaskan.

## 6.5 Cashier

Mengelola:

- Order.
- Customer.
- Payment.
- Pickup/drop-off.

## 6.6 Production Staff

Mengelola:

- Washing.
- Drying.
- Ironing.
- Packing.
- Barcode scanning.

## 6.7 QC Staff

Mengelola:

- QC.
- Rewash.
- Reject.
- Quality complaint.

## 6.8 Courier

Mengelola:

- Pickup.
- Delivery.
- Delivery status.
- Proof of delivery.

## 6.9 Finance / Accounting

Mengelola:

- Accounting.
- Cash.
- Bank.
- AR.
- AP.
- Journal.
- Financial reports.

## 6.10 HR / Payroll

Mengelola:

- Employee.
- Attendance.
- Payroll.
- Commission.
- Bonus.

## 6.11 Inventory / Warehouse

Mengelola:

- Inventory.
- Supplier.
- Purchase.
- Stock opname.

## 6.12 Marketing / CRM

Mengelola:

- Customer segmentation.
- Membership.
- Loyalty.
- Voucher.
- Campaign.
- Referral.

## 6.13 Franchise Manager

Mengelola dan memonitor outlet franchise sesuai scope.

## 6.14 Customer

Menggunakan PWA untuk:

- Order.
- Pickup.
- Tracking.
- Payment.
- Membership.
- Loyalty.
- Voucher.
- Deposit.
- Referral.
- Complaint.
- Rating.

---

# 7. Multi-Tenant Architecture

Platform harus mendukung banyak tenant.

```text
Laundry SaaS Platform
│
├── Tenant A
│   ├── Outlet A1
│   ├── Outlet A2
│   └── Outlet A3
│
├── Tenant B
│   ├── Outlet B1
│   └── Outlet B2
│
└── Tenant C
    └── Outlet C1
```

## 7.1 Tenant Isolation

Tenant A tidak boleh:

- Melihat data Tenant B.
- Mengakses customer Tenant B.
- Mengakses order Tenant B.
- Mengakses inventory Tenant B.
- Mengakses finance Tenant B.

Tenant isolation harus diterapkan pada seluruh layer aplikasi dan database.

---

# 8. Outlet Management

Satu tenant dapat memiliki banyak outlet.

Setiap outlet dapat memiliki:

- Service catalog.
- Pricing.
- Staff.
- Courier.
- Inventory.
- Production workflow.
- Delivery zone.
- Operational hours.
- SLA.
- Payment configuration.
- Reports.

Harga dan layanan dapat berbeda antar outlet.

Contoh:

```text
Outlet Jakarta
Laundry Regular = Rp8.000/kg

Outlet Bekasi
Laundry Regular = Rp10.000/kg
```

---

# 9. Customer Identity

Customer memiliki satu akun pada level tenant.

Contoh:

```text
Tenant: Laundry Bersih Jaya

Customer: Budi

├── Order Outlet Jakarta
├── Order Outlet Bekasi
├── Membership
├── Loyalty Points
├── Deposit
└── Voucher
```

Customer dapat menggunakan akun yang sama untuk seluruh outlet dalam tenant tersebut.

---

# 10. Order Management

## 10.1 Walk-in Order

Flow:

```text
Customer datang
↓
Customer lookup / create
↓
Create Order
↓
Weigh / Count
↓
Select Service
↓
Calculate Price
↓
Discount / Voucher
↓
Payment
↓
Receipt
↓
Barcode / QR
↓
Production
```

## 10.2 Order Status

Default:

```text
Received
↓
Weighing
↓
Washing
↓
Drying
↓
Ironing
↓
QC
↓
Packing
↓
Ready
↓
Collected / Delivered
↓
Completed
```

Workflow dapat dikonfigurasi per outlet.

---

# 11. Pickup Order

Customer dapat membuat order melalui PWA.

Flow:

```text
Customer
↓
Create Pickup Order
↓
Select Address
↓
Select Date
↓
Select Time Slot
↓
Pickup Request
↓
Courier Assignment
↓
Courier Pickup
↓
Laundry Arrives at Outlet
↓
Weigh / Count
↓
Price Confirmation
↓
Production
```

---

# 12. Order Structure

Order menjadi parent transaction.

Satu order dapat memiliki banyak bag.

```text
Order
├── Bag 001
├── Bag 002
└── Bag 003
```

Setiap bag memiliki:

- Unique ID.
- Barcode.
- QR Code.
- Status.
- Location.
- Production history.

---

# 13. Barcode / QR

Barcode/QR digunakan untuk tracking.

Scan dilakukan pada:

- Receiving.
- Washing.
- Drying.
- Ironing.
- QC.
- Packing.
- Storage.
- Pickup.
- Delivery.
- Collection.

Setiap scan dicatat dalam audit trail.

---

# 14. Weight Management

Sistem mendukung:

- Initial weight.
- Reweighing.
- Final weight.
- Weight difference.
- Reason for adjustment.

Perubahan berat harus tercatat dalam audit log.

---

# 15. Service Catalog

Tenant dapat membuat layanan sendiri.

Contoh:

- Laundry Kiloan.
- Laundry Satuan.
- Sepatu.
- Karpet.
- Bed Cover.
- Boneka.
- Tas.
- Express.
- Same Day.

---

# 16. Pricing

Pricing model:

- Per kg.
- Per item.
- Fixed price.
- Tiered pricing.
- Express surcharge.
- Add-on.

Tenant dapat menentukan harga per outlet.

---

# 17. Promotion

Sistem mendukung:

- Percentage discount.
- Fixed discount.
- Voucher.
- Promo code.
- Minimum transaction.
- Service-specific promotion.
- Outlet-specific promotion.
- Customer-specific promotion.
- Membership pricing.

---

# 18. Payment

Metode pembayaran:

- Cash.
- Bank transfer.
- QRIS.
- E-wallet.
- Debit.
- Credit card.
- Payment gateway.
- Customer deposit.
- Partial payment.
- Pay at pickup.
- Pay at delivery.

Sistem harus mendukung:

- Partial payment.
- Refund.
- Payment correction.
- Payment reconciliation.
- Outstanding balance.

---

# 19. CRM

Customer profile menyimpan:

- Nama.
- Nomor telepon.
- Email.
- Alamat.
- Order history.
- Payment history.
- Membership.
- Loyalty points.
- Deposit.
- Voucher.
- Referral.
- Complaint.
- Review.
- Preferences.

---

# 20. Membership

Sistem mendukung level:

```text
Bronze
Silver
Gold
Platinum
```

Membership dapat berdasarkan:

- Total spending.
- Transaction frequency.
- Loyalty points.
- Lifetime value.

Membership dapat dikonfigurasi tenant/outlet.

---

# 21. Loyalty Points

Customer memperoleh point berdasarkan transaksi.

Contoh:

```text
Transaction
↓
Eligible Amount
↓
Point Calculation
↓
Points Added
```

Points dapat digunakan untuk:

- Discount.
- Voucher.
- Reward.
- Campaign.

---

# 22. Customer Deposit

Customer memiliki wallet/deposit.

Contoh:

```text
Initial Balance: Rp500.000

Order: Rp75.000

Remaining:
Rp425.000
```

Semua transaksi wallet harus memiliki ledger.

---

# 23. Referral

Customer memiliki referral code.

Contoh:

```text
Customer A
↓
Referral Code
↓
Customer B registers
↓
Customer B makes first order
↓
Reward A
↓
Reward B
```

Reward dapat berupa:

- Points.
- Voucher.
- Discount.
- Deposit.

---

# 24. CRM Campaign

Campaign:

- Birthday.
- Anniversary.
- Win-back.
- Inactive customer.
- Membership.
- Promotion.
- Referral.

Segmentasi berdasarkan:

- Recency.
- Frequency.
- Monetary value.
- Membership.
- Location.
- Service preference.
- Average order value.

---

# 25. Notification Center

Channel:

- WhatsApp.
- PWA Push Notification.
- Email.
- SMS.
- In-app notification.

Notifikasi:

- Order confirmation.
- Payment confirmation.
- Pickup reminder.
- Pickup status.
- Laundry status.
- Ready notification.
- Delivery status.
- Invoice.
- Payment reminder.
- Marketing campaign.

Tenant dapat menghubungkan WhatsApp Business Platform/API mereka sendiri.

---

# 26. Production Management

Setiap proses memiliki:

- Status.
- Timestamp.
- User.
- Outlet.
- Notes.

Sistem menghitung:

- Processing time.
- Queue time.
- SLA.
- Bottleneck.
- Staff performance.

---

# 27. SLA

Setiap service dapat memiliki SLA.

Contoh:

| Service | SLA |
|---|---:|
| Regular | 3 hari |
| Express | 24 jam |
| Same Day | 8 jam |

Sistem harus membuat:

- Due date.
- Expected completion time.
- Warning.
- Overdue status.

---

# 28. Quality Control

QC workflow:

```text
Production Complete
↓
QC Inspection
↓
Pass / Reject
```

Jika reject:

- Rewash.
- Reprocess.
- Repair.
- Complaint.
- Other resolution.

---

# 29. Complaint Management

Customer dapat mengajukan complaint.

Data:

- Order.
- Customer.
- Complaint type.
- Description.
- Photo.
- Assigned staff.
- Resolution.
- Status.

Status:

```text
Open
↓
Investigating
↓
Resolution Proposed
↓
Resolved
↓
Closed
```

Resolution:

- Rewash.
- Refund.
- Credit.
- Voucher.
- Replacement.
- Other.

---

# 30. Pickup & Delivery

## Pickup

```text
Requested
↓
Assigned
↓
On The Way
↓
Arrived
↓
Picked Up
↓
At Outlet
```

## Delivery

```text
Ready
↓
Assigned
↓
On The Way
↓
Arrived
↓
Delivered
```

Fitur:

- GPS.
- Location.
- Route.
- Delivery zone.
- Distance pricing.
- Time slot.
- Proof of delivery.
- OTP.
- Photo.
- Signature.
- Failed delivery.
- Reschedule.

---

# 31. Courier Dispatch

## Manual Assignment

Dispatcher memilih courier.

## Auto Assignment

Sistem mempertimbangkan:

- Location.
- Distance.
- Shift.
- Capacity.
- Workload.
- Delivery zone.
- Current jobs.

Manager dapat melakukan manual override.

---

# 32. Inventory Management

Inventory item:

- Detergent.
- Softener.
- Bleach.
- Perfume.
- Plastic.
- Packaging.
- Supplies.
- Spare parts.

Operations:

- Purchase.
- Receiving.
- Stock transfer.
- Stock adjustment.
- Stock opname.
- Consumption.
- Waste.
- Supplier management.

Inventory dapat dipisahkan berdasarkan outlet.

---

# 33. Supplier & Purchasing

Supplier management:

- Supplier profile.
- Contact.
- Products.
- Price.
- Payment terms.
- Purchase history.

Purchasing:

```text
Purchase Request
↓
Purchase Order
↓
Goods Received
↓
Inventory Updated
↓
Supplier Invoice
↓
Payment
```

---

# 34. Employee Management

Employee profile:

- Personal information.
- Employee ID.
- Position.
- Outlet.
- Employment status.
- Salary structure.
- Commission structure.

---

# 35. Attendance

Mendukung:

- Clock in.
- Clock out.
- Shift.
- Overtime.
- Absence.
- Leave.
- Attendance correction.

---

# 36. Payroll

Payroll components:

- Basic salary.
- Allowance.
- Overtime.
- Deduction.
- Bonus.
- Commission.
- Incentive.

Payroll cycle:

```text
Attendance
↓
Payroll Calculation
↓
Review
↓
Approval
↓
Payroll Posted
↓
Payment
```

---

# 37. Commission

Commission dapat berdasarkan:

- Order.
- Revenue.
- Service.
- Delivery.
- Employee role.
- Target achievement.

Contoh:

```text
Courier
Rp5.000 / successful delivery
```

atau:

```text
Cashier
1% eligible sales
```

---

# 38. Accounting / ERP

## Accounting Core

- Chart of Accounts.
- Double-entry bookkeeping.
- Journal.
- General Ledger.
- Trial Balance.

## Cash & Bank

- Cash account.
- Bank account.
- Transfer.
- Reconciliation.

## Accounts Receivable

- Customer receivable.
- Invoice.
- Outstanding.
- Payment tracking.
- Aging.

## Accounts Payable

- Supplier payable.
- Supplier invoice.
- Payment.
- Aging.

## Expenses

- Rent.
- Electricity.
- Water.
- Salary.
- Logistics.
- Supplies.
- Marketing.
- Other expenses.

## Fixed Assets

- Asset register.
- Acquisition.
- Depreciation.
- Disposal.

---

# 39. Financial Reports

Business plan menyediakan:

- Profit & Loss.
- Balance Sheet.
- Cash Flow.
- General Ledger.
- Trial Balance.
- AR Aging.
- AP Aging.
- Revenue by outlet.
- Revenue by service.
- Expense report.
- Profitability by outlet.

---

# 40. Indonesian Localization

Platform harus Indonesia-first.

Mendukung:

- IDR / Rupiah.
- QRIS.
- Indonesian payment methods.
- WhatsApp.
- PPN.
- Indonesian tax requirements.
- Indonesian accounting practices.
- Indonesian phone numbers.
- Indonesian addresses.
- Indonesian timezone.

Tax rules harus configurable agar dapat mengikuti perubahan regulasi.

---

# 41. Dashboard

## Owner Dashboard

KPI:

- Revenue.
- Orders.
- Customers.
- Average Order Value.
- Completed Orders.
- Pending Orders.
- Overdue Orders.
- Delivery Performance.
- Production Performance.
- Gross Profit.
- Net Profit.
- Customer Retention.

## Outlet Dashboard

- Sales.
- Orders.
- Production queue.
- SLA.
- Staff performance.
- Inventory.
- Courier jobs.

---

# 42. SaaS Subscription

Platform memiliki tiga paket:

## Starter

Target:

- Laundry kecil.
- Single outlet.

Fitur:

- POS.
- Order management.
- Basic customer management.
- Payment.
- Barcode / QR.
- Basic production tracking.
- Basic reporting.
- Basic notification.

## Growth

Target:

- Laundry berkembang.
- Multi-outlet.

Starter +

- Multiple outlets.
- CRM.
- Membership.
- Loyalty.
- Voucher.
- Referral.
- Pickup & delivery.
- Courier management.
- Inventory.
- Advanced analytics.
- WhatsApp integration.

## Business

Target:

- Laundry besar.
- Jaringan.
- Franchise.

Growth +

- Advanced multi-outlet.
- HR.
- Attendance.
- Payroll.
- Commission.
- Accounting.
- ERP.
- AP/AR.
- Financial reporting.
- Advanced permissions.
- Franchise management.
- Advanced analytics.
- API/integrations.

---

# 43. Usage-Based Entitlements

Feature dan usage limit dikontrol melalui subscription entitlement.

Contoh:

| Resource | Starter | Growth | Business |
|---|---:|---:|---:|
| Outlet | 1 | Higher | Higher |
| Users | Limited | Higher | Higher |
| Orders/month | Limited | Higher | Higher |
| Customers | Limited | Higher | Higher |
| Storage | Limited | Higher | Higher |
| WhatsApp Messages | Limited | Higher | Higher |
| CRM | Basic | Advanced | Advanced |
| Delivery | No | Yes | Yes |
| Inventory | No | Yes | Yes |
| Payroll | No | No | Yes |
| Accounting/ERP | No | No | Yes |

Limit harus configuration-driven dan tidak hard-coded.

---

# 44. Subscription Lifecycle

Tenant dapat:

- Start subscription.
- Upgrade.
- Downgrade.
- Renew.
- Cancel.
- View usage.
- View invoice.

Sistem harus mendukung:

- Billing cycle.
- Proration.
- Downgrade effective date.
- Feature entitlement.
- Usage limit.
- Grace period.
- Subscription status.

---

# 45. Tenant Onboarding

Flow:

```text
Register
↓
Verify Account
↓
Create Tenant
↓
Select Plan
↓
Payment
↓
Create First Outlet
↓
Configure Services
↓
Configure Pricing
↓
Invite Staff
↓
Configure WhatsApp
↓
Start Operating
```

Target:

> Tenant dapat mulai menggunakan sistem tanpa bantuan manual dari SaaS provider.

---

# 46. Core Domain Model

```text
Tenant
├── Subscription
├── Outlets
│   ├── Users
│   ├── Services
│   ├── Prices
│   ├── Inventory
│   └── Production Workflow
│
├── Customers
│   ├── Membership
│   ├── Loyalty
│   ├── Wallet
│   └── Referral
│
├── Orders
│   ├── Order Items
│   ├── Bags
│   ├── Payments
│   ├── Production Events
│   ├── Delivery Jobs
│   └── Complaints
│
├── Employees
│   ├── Attendance
│   ├── Payroll
│   └── Commission
│
├── Inventory
│   └── Suppliers
│
└── Accounting
    ├── Accounts
    ├── Journals
    ├── AR
    ├── AP
    └── Reports
```

---

# 47. Audit Log

Aktivitas penting harus dicatat.

Audit record:

- Actor.
- Action.
- Entity.
- Entity ID.
- Before value.
- After value.
- Timestamp.
- IP.
- Device/session bila diperlukan.

Contoh:

```text
User: Ahmad
Action: Refund Order
Order: ORD-10291
Amount: Rp150.000
Timestamp: 2026-08-22 10:30
```

---

# 48. Security Requirements

Sistem harus memiliki:

- Tenant isolation.
- RBAC.
- Granular permission.
- Secure authentication.
- Session management.
- Encryption.
- Secure API.
- Audit log.
- Backup.
- Data recovery.
- Rate limiting.
- Monitoring.

Data finansial dan data customer harus mendapatkan perlindungan khusus.

---

# 49. Non-Functional Requirements

## Availability

Target:

> 99.9% uptime.

## Scalability

Sistem harus dapat berkembang dari:

> 1 tenant / 1 outlet

hingga:

> Ribuan tenant / ribuan outlet.

## Performance

Target utama:

- Fast POS interaction.
- Fast order lookup.
- Near real-time production status.
- Near real-time delivery status.
- Dashboard response yang cepat.

## Mobile

PWA harus nyaman digunakan pada:

- Smartphone.
- Tablet.
- Desktop.

---

# 50. Recommended Product Architecture

```text
                    Customer PWA
                         │
                         ▼
Staff/Admin ───────► API / BFF ◄────── Courier PWA
                         │
             ┌───────────┼───────────┐
             │           │           │
             ▼           ▼           ▼
          Orders     Production   Delivery
             │           │           │
             └───────────┼───────────┘
                         │
                  Core Platform
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
      CRM            Inventory        HR/Payroll
       │                                   │
       └────────────────┬──────────────────┘
                        ▼
                   Accounting
                        │
                        ▼
                 Event / Queue
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
      WhatsApp       Payment       Analytics
```

---

# 51. MVP Roadmap

Produk sebaiknya tidak dibangun sekaligus.

## Phase 1 — Laundry Core

Prioritas:

- Multi-tenant.
- Tenant/outlet.
- Authentication.
- RBAC.
- Customer.
- Service catalog.
- Pricing.
- POS.
- Order.
- Payment.
- Barcode/QR.
- Production tracking.
- QC.
- Basic reporting.

## Phase 2 — Customer & Delivery

- Customer PWA.
- Pickup request.
- Courier PWA.
- Dispatch.
- Delivery.
- WhatsApp.
- Membership.
- Loyalty.
- Voucher.
- CRM.

## Phase 3 — Business Operations

- Inventory.
- Supplier.
- Purchasing.
- Employee.
- Attendance.
- Commission.
- Payroll.

## Phase 4 — Accounting / ERP

- COA.
- Journal.
- General Ledger.
- AR.
- AP.
- Cash & Bank.
- Tax.
- Financial reporting.
- Reconciliation.

## Phase 5 — Enterprise / Franchise

- Franchise management.
- Advanced analytics.
- API.
- Third-party integrations.
- Advanced automation.
- Enterprise scalability.

---

# 52. Success Metrics

## Operational

- >90% order tercatat secara digital.
- Penurunan transaction error.
- Penurunan order processing time.
- Penurunan overdue order.

## Customer

- Peningkatan repeat order.
- Peningkatan membership adoption.
- Peningkatan retention.
- Peningkatan customer satisfaction.

## Business

- Revenue per outlet meningkat.
- Cost per order menurun.
- Owner dapat melihat profitability secara real-time.
- Waktu pembuatan laporan berkurang.

## SaaS

- Tenant activation rate.
- Trial-to-paid conversion.
- MRR.
- ARR.
- Churn.
- ARPU.
- Expansion revenue.
- Feature adoption.

---

# 53. Product Principles

1. **Simple for small laundry, powerful for enterprise.**
2. **Mobile-first untuk operasional lapangan.**
3. **Tenant isolation by design.**
4. **Configuration over customization.**
5. **Audit everything financially important.**
6. **Real-time operational visibility.**
7. **Indonesia-first.**
8. **API-ready.**
9. **Automation wherever possible.**
10. **One customer identity across outlets within a tenant.**

---

# 54. Product Differentiation

Produk tidak diposisikan sebagai:

> "Aplikasi kasir laundry."

Tetapi sebagai:

> **"All-in-one Operating System untuk bisnis laundry Indonesia."**

Produk mengintegrasikan:

```text
POS
+
Order Management
+
Production
+
Pickup & Delivery
+
CRM
+
Membership
+
Loyalty
+
Inventory
+
HR
+
Payroll
+
Accounting
+
ERP
+
Analytics
```

dalam satu platform SaaS.

---

# 55. Final Product Definition

Produk adalah **multi-tenant SaaS platform untuk bisnis laundry Indonesia** yang dapat melayani:

- Single outlet.
- Multi-outlet.
- Jaringan laundry.
- Franchise.

Setiap tenant memiliki lingkungan bisnis yang terisolasi dan dapat mengelola:

- Outlet.
- Staff.
- Customer.
- Service.
- Pricing.
- Order.
- Production.
- Delivery.
- CRM.
- Inventory.
- Payroll.
- Accounting.

Platform menggunakan tiga paket:

**Starter → Growth → Business**

dan tenant dapat melakukan upgrade/downgrade sesuai pertumbuhan bisnis.

Fondasi arsitektur:

```text
Platform
  ↓
Tenant
  ↓
Outlet
  ↓
Users / Customers
  ↓
Orders
  ↓
Production / Delivery
  ↓
CRM / Inventory / HR
  ↓
Accounting / ERP
```

Tujuan akhirnya adalah membuat satu platform yang memungkinkan pemilik laundry mengelola **seluruh siklus bisnis laundry dari satu sistem**, sementara SaaS provider dapat menjual platform yang sama kepada ribuan bisnis laundry dengan data dan konfigurasi masing-masing yang tetap terisolasi.