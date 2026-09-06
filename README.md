# Sahakari (सहकारी) - Digital Cooperative Gig Services Platform
### Built for Smart India Hackathon (SIH) 2026

> **Theme**: Cooperative Gig Services Platform for Household & Community Services  
> **Target Audience**: Households / Residents, Local Gig Workers / Artisans, Housing Societies / RWAs (Resident Welfare Associations)

---

## 🌟 Executive Summary & Hackathon Pitch

**"Trusted Local Services. Fair Opportunities. Stronger Communities."**

In existing venture-backed aggregator apps (like Urban Company), gig workers are treated as dispensable algorithmic cogs, losing **25% to 35% of their daily wages** in predatory commission deductions and suffering sudden account deactivations without recourse. Meanwhile, households experience opaque surge pricing and housing societies lack any mechanism to coordinate neighborhood-level maintenance.

**Sahakari (सहकारी)** disrupts this extractive model with **India’s first community-owned digital gig cooperative**:
1. **0% Predatory Take-Rate**: The worker takes home **100% of the service fare** (₹450 for a plumbing visit = ₹450 to the worker).
2. **Transparent Cooperative Fee**: A nominal flat fee of ₹25 supports software upkeep and funds a **Community Medical Emergency & Tool Insurance Welfare Pool**.
3. **Portable Digital Identity**: Reputation, skill endorsements, and reviews belong permanently to the worker, not a private tech corporation.
4. **Doorstep Security OTP**: 4-digit verification code (`4928`) presented at society security gates ensures verified, trusted residential entry.
5. **RWA Bulk Maintenance Pooling**: Societies can commission bulk tasks (e.g. 24 apartments pre-monsoon plumbing inspection) directly employing local worker guilds.

---

## 🚀 Key Features by User Role

### 1. 🏠 Customer / Household Experience
- **Smart Cooperative Matching**: Recommends nearby verified service providers with clear explainability tags:
  - *✓ 1.8 km nearby*
  - *✓ Available today*
  - *✓ 4.8★ rating (84+ reviews)*
  - *✓ Transparent flat fare*
- **Transparent Booking Flow**: Date & time slot selection, doorstep address, and upfront breakdown.
- **Visual 5-Stage Live Tracker**: Real-time progression: `Requested` → `Accepted` → `On the way` → `Service Started` → `Completed`.
- **4-Digit Safety OTP**: Generated dynamically for safe home entry.
- **Emergency SOS Beacon**: 1-click urgent dispatch for emergency electricians, plumbers, and appliance technicians.
- **Transparent Mock Payment**: Direct worker payout vs. ₹25 cooperative platform contribution.
- **Portable 5★ Reviews**: Rate punctuality, courtesy, and craftsmanship.

### 2. 👷 Worker / Artisan Experience
- **Zero-Commission Job Feed**: Accept or decline incoming household requests with direct take-home earnings displayed prominently.
- **Earnings Hub & Ledger**: Daily, weekly, and monthly earnings breakdown with interactive **Recharts** area charts and cumulative savings compared to corporate apps.
- **Honest Demo Verification**: 3-tier vetting checklist:
  - *Tier 1: Aadhaar e-KYC (Demo)*
  - *Tier 2: Trade Skill Assessment (Guild test passed)*
  - *Tier 3: Community Peer Endorsement (Zero safety complaints)*
- **Society Bulk Contract Bidding**: Direct access to high-value RWA contracts.

### 3. 🏢 Community / Society RWA Experience
- **Society Command Center**: High-level overview of covered households, active local workers, and total neighborhood maintenance spent.
- **Post Bulk Maintenance**: Create society-wide service orders (e.g. common area LED lighting retrofits, water sump checks).
- **RWA Notice Board**: Digital directives on guard gate entry verification and health camps.

### 4. 🎯 SIH Judge Demo Assistant Widget
- An interactive **floating guide in the bottom-right corner** that allows judges to step through the complete 10-step leaking tap demonstration in one click!

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19 + Vite (Modern, modular, responsive)
- **Styling**: Tailwind CSS v4 (Glassmorphism cards, micro-animations, Plus Jakarta Sans typography)
- **Icons**: Lucide React
- **Charts**: Recharts (Dynamic worker earnings velocity area charts)
- **State Management**: Centralized reactive state in `AppContext.jsx` synchronized with `localStorage`.
- **Zero Cloud API Dependencies**: Runs 100% locally without paid API keys.

---

## 🏁 How to Run Locally

### Prerequisites
- Node.js LTS (v18 or v20+)
- npm or yarn

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

### 3. Open in Browser
Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🎭 Demo Credentials & Presentation Story

No passwords required! Use the **View As** switcher in the top navigation bar to switch between:
- **Customer Mode** (`customer@demo.com`)
- **Worker Hub** (`worker@demo.com` — Imran Khan, Master Plumber)
- **Society RWA Admin** (`admin@demo.com` — Shanti Vihar RWA)

### End-to-End Presentation Script (Leaking Tap Scenario):
1. **Customer View**: On the Customer Dashboard, select **Plumbing Services**. Observe that **Imran Khan** is ranked #1 with an explicit reason box: *1.8 km nearby, Available right now, 4.8★ rating*.
2. **Book Worker**: Click **Book Now →**. Observe the transparent fee breakdown: *₹450 service fare + ₹25 co-op fee = ₹475 total*. Click **Confirm Booking**.
3. **Tracking & OTP**: Note the generated **4-Digit Service Verification OTP** (`4928`).
4. **Switch to Worker**: Switch role to **Worker** via the top navbar. Imran Khan sees the pending job card with **₹450 Direct Take-Home**. Click **Accept Job Request**.
5. **Start & Finish Service**: Click **Arrived at Home & Start Service**, then **Service Finished & Request Settlement**.
6. **Switch to Customer**: Switch back to **Customer**. Notice the tracker reflects *Completed*. Click **Pay ₹475 (Demo Payment)**.
7. **Rate Worker**: Submit a 5-star review with compliments ("Punctual", "Clean Work").
8. **Inspect Worker Ledger**: Switch to **Worker → Earnings & Ledger**. Notice today's earnings and graph updated immediately.
9. **Inspect Society Admin**: Switch to **Society RWA**. See that total community payouts and the welfare emergency fund reflect the completed job!

---

## 🔮 Future Roadmap & Production Scaling
- **Government Portals Integration**: Integration with Skill India Digital and DigiLocker for automated Aadhaar e-KYC.
- **UPI Auto-Split Gateway**: Direct payment splitting via NPCI Bharat BillPay / UPI 2.0 (95% instant UPI transfer to worker VPA, 5% to collective cooperative account).
- **Multilingual Voice Search**: Bhashini AI integration for vernacular voice booking (Hindi, Kannada, Tamil, Marathi, etc.).
- **Worker Micro-Credit**: Interest-free emergency tool advances financed by the collective welfare pool.
