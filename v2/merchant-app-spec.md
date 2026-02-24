# Merchant App Spec

Business-facing app for the ePunch loyalty system. Desktop browser app — merchants manage everything from a computer behind the counter or in the back office.

## Roles

Two types of merchant users:

- **Owner** — sets up the shop, creates punch card programs, views analytics, manages staff
- **Staff** — scans customer QR codes to give punches and redeem rewards. That's it.

Staff should be able to do their job with zero training. Open the app, point camera, done.

## What the merchant needs to do

**Sign up and set up their shop (owner)**
- Self-serve signup — name, email, password
- Create their shop — name, address, logo (optional)
- 30-day free trial, no payment info upfront
- Must be possible to go from zero to working punch card system in minutes

**Create a punch card program (owner)**
- Set: program name, number of punches required (e.g. 8), reward description (e.g. "Free coffee")
- One active program is enough for MVP. Multiple programs are a future thing.
- The program generates a QR code that goes on the counter for customers to scan

**Print / display their QR code (owner)**
- The counter QR is how new customers join
- Customer scans it with their phone camera → gets an empty card
- Should be easy to print or show on a tablet at the counter

**Scan customers (staff + owner)**
- This is the most frequent action, must be fast
- Open scanner → point at customer's QR → punch is given
- If customer has no card yet, one is created automatically
- Clear feedback: who got punched, how many they have now

**Handle redemptions (staff + owner)**
- When a customer's card is full, they show a special redemption QR
- Staff scans it → sees what reward is being claimed → confirms
- Clear distinction between "giving a punch" and "redeeming a reward"

**See what's happening (owner)**
- How many customers, how many punches today/this week
- Recent activity feed — who got punched, who redeemed
- Don't need fancy charts for MVP. Simple numbers and a list.

**Manage staff (owner)**
- Add staff accounts (username + password, no email needed)
- Staff only see the scanner. Nothing else.
- Remove staff when they leave

## States

**Shop setup**
1. No shop yet — owner needs to create one
2. Shop exists, no program — needs to create a punch card program
3. Ready — shop + program exist, QR code available, can start scanning

**Program**
1. Active — accepting punches
2. Paused (future) — temporarily stopped

**Subscription**
1. Trial — 30 days free
2. Active — paying
3. Expired — trial ended, no payment. Read-only, can't give punches

## User flows

**Onboarding**
1. Owner signs up (name, email, password)
2. Creates shop (name, address)
3. Creates punch card program (name, punches needed, reward)
4. Gets their counter QR code → prints it or displays it
5. Done. Ready to start punching.

**Daily operation (staff)**
1. Staff opens app → sees scanner immediately
2. Customer shows their QR → staff scans → punch given
3. If customer shows redemption QR → staff scans → confirms reward → done

**Customer walks in for the first time**
1. Customer scans counter QR with phone camera → gets empty card
2. Next time they buy, they show their QR → staff scans → first punch

**Checking activity (owner)**
1. Owner opens app → sees dashboard with today's numbers
2. Scrolls down for recent activity
3. Can tap into details if needed

## Screens

**Staff sees:**
- Scanner (their entire world)

**Owner sees:**
- Dashboard (stats + recent activity)
- Scanner (same as staff)
- Program settings (edit punch card program)
- Shop settings (name, address, logo)
- Counter QR (view / print)
- Staff management (add/remove)

## What we're NOT building for MVP

- Multiple punch card programs per shop
- Bundle programs or benefit cards
- Fancy analytics or charts
- Customer list / customer details
- Card design customization (colors, icons)
- Email notifications
- Payment / billing (trial only for now)
