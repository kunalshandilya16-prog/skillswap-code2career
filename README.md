# SkillSwap

### A Creator Gig Marketplace for Discovering, Hiring & Collaborating with Young Talent

SkillSwap is a web-based creator marketplace designed to connect clients with young creators offering services such as design, video editing, programming, tutoring, music, and other creative skills.

Creators can publish gigs, showcase their portfolios, receive booking requests, and manage those requests.

Clients can discover creators, search and filter gigs, compare ratings and reviews, explore creator profiles, view portfolios, and submit booking requests.

---

## Hackathon

**Code2Career AI Hackathon**

### Track
**Track 2 — Real-World AI Products**

### Product
**SkillSwap — Creator Economy**

### Hackathon ID
AZIS-8JRGUP


## Links

**Live Application:**  


**GitHub Repository:**  


**Demo Video:**  




# About SkillSwap

SkillSwap is built around a simple idea:

> **Give young creators a place to turn their skills into opportunities, while helping clients discover the right creator for their needs.**

The platform supports both sides of the marketplace.

### For Clients

Clients can:

- Discover creator gigs
- Search by keywords
- Filter by category
- Sort gigs according to their preference
- Compare prices and ratings
- View creator profiles
- Explore creator portfolios
- Read reviews
- Submit booking requests
- Track booking status
- See creator decline reasons
- Discover similar gigs after a rejection

### For Creators

Creators can:

- Create and publish gigs
- Manage their gigs
- Receive booking requests
- Accept or decline requests
- Provide a decline reason
- Manage their public profile
- Add portfolio items
- View ratings and reviews
- Track booking activity



# ✨ Core Features

## 1. Post a Gig

Creators can publish a service by providing:

- Gig title
- Category
- Rate
- Description
- Creator information

Newly created gigs are immediately added to the marketplace.



## 2. Browse & Search

The Client Marketplace allows users to:

- Search gigs by title and description
- Filter gigs by category
- Browse creator services
- View ratings and review counts
- Compare pricing
- Open detailed gig pages



## 3. Client-Controlled Sorting

Clients can choose how they want gigs to be ranked.

Available options include:

- **Newest First**
- **Cheapest First**
- **Most Expensive First**
- **Highest Rated**
- **Most Reviewed**
- **Most Popular**

Search and category filters are applied before the selected ranking.

This allows different clients to discover services according to their current priorities, such as budget, reputation, freshness, or popularity.



## 4. Gig Ratings & Reviews

Each gig displays a compact rating summary.

Example:

★★★★★ 4.8
127 reviews

Detailed gig pages provide:

* Average rating
* Total review count
* Rating distribution
* Positive review percentage
* Individual review comments

Positive reviews are defined as **4-star and 5-star reviews**.

Ratings are updated when new reviews are submitted.

---

## 5. Creator Public Profiles

Every creator has a public profile that clients can explore before booking.

The profile includes:

* Creator name
* Profile image
* Professional headline
* Biography
* Specialization
* Contact information
* Average rating
* Review count
* Gigs posted
* Gigs completed
* Portfolio

The creator profile can be accessed directly from a gig.

---

## 6. Creator Portfolio

Creators can showcase their work through portfolio items.

Portfolio entries can contain:

* Image
* Project title
* Description
* Category

The portfolio gives clients additional context before they submit a booking request.

---

## 7. Book a Gig

Clients can submit a booking request containing:

* Client name
* Email
* Project/request message

A new booking starts with:

```text
Pending
```

The booking status is then updated according to the creator's decision.

---

## 8. Creator Dashboard

Creators have a dedicated management interface for:

* Incoming booking requests
* Gig management
* Profile management
* Portfolio management
* Booking status
* Reviews and creator statistics

Creators can accept or decline pending booking requests.

---

## 9. My Bookings

Clients have a dedicated booking history showing:

* Gig
* Creator
* Booking date
* Booking status
* Decline reason when applicable

Supported booking states include:

text
Pending
Accepted
Completed
Declined
A gig may have multiple Pending requests, but only one request can become Accepted.

---

# 🧠 Product Decision Points

The three Decision Points were intentionally treated as product-design decisions rather than simply implementing the most obvious default behavior.

## DP1 — Rejection

### Decision

When a creator declines a client's booking:

* The booking immediately changes to **Declined**.
* The client continues to see the booking in **My Bookings**.
* The creator can provide an optional decline reason.
* The decline reason is displayed to the client.
* The client receives an **Explore More Similar Gigs** action.
* The action takes the client back to the marketplace with the same category selected.
* The original gig becomes available for new requests.

### Why?

A rejection should not become a dead end.

We designed the experience around three principles:

**Transparency**

Clients should understand why a request was declined instead of receiving an unexplained status.

**Continuity**

The client should be able to continue searching without having to restart their discovery process.

**Creator flexibility**

Creators should be able to reject requests that do not fit their availability, requirements, or capacity while keeping their gig available for other opportunities.

---

## DP2 — Double Booking

### Decision

Multiple clients can submit booking requests for the same gig while those requests remain **Pending**.

However, only one request can ultimately become **Accepted**.

When a creator accepts one request:

1. The selected request becomes **Accepted**.
2. Other pending requests for the same gig are automatically closed out.
3. Those clients receive a decline status with the standardized reason:
   **"Unfortunately, not available."**
4. The gig becomes unavailable for further bookings.

### Why?

We chose a **multiple-interest, single-commitment** model.

A single pending request should not freeze a creator's listing. A creator may need to compare several client requests and choose the one that best fits the project, requirements, or timeline.

At the same time, an actual double booking must never occur.

Therefore:

```text
Multiple Pending Requests
        ↓
Creator Evaluates Requests
        ↓
One Request Accepted
        ↓
Other Pending Requests Closed
        ↓
Gig Becomes Unavailable
```

This gives creators flexibility during the selection stage while maintaining a clear single commitment at the point of acceptance.

---

## DP3 — Discovery

### Decision

The default marketplace ranking is:

**Newest First**

New gigs are placed at the top using their creation timestamp.

Clients can also choose:

* Newest First
* Cheapest First
* Most Expensive First
* Highest Rated
* Most Reviewed
* Most Popular

### Highest Rated

Ranking is based on:

1. Average rating
2. Review count as a tie-breaker
3. Recency as the final tie-breaker

### Most Popular

Popularity is based on actual marketplace activity rather than an arbitrary label.

The current implementation uses a weighted score based on:

```text
Completed/recorded bookings × 3
+ Reviews × 2
+ Average Rating
```

### Why?

Different clients have different priorities.

One client may care about:

* Price

Another may care about:

* Reputation

Another may want:

* Newly published creators

Giving clients control over ranking makes discovery preference-driven.

We selected **Newest First as the default** because newly published creators should receive an opportunity to gain visibility rather than allowing established creators to permanently dominate the marketplace through historical ratings or popularity.

---

# 👥 Client & Creator Experiences

SkillSwap intentionally separates the two sides of the marketplace.

## Client View

The Client experience focuses on discovery and purchasing:

```text
Marketplace
   ↓
Search / Filter / Sort
   ↓
Gig Details
   ↓
Creator Profile
   ↓
Portfolio / Reviews
   ↓
Book Gig
   ↓
My Bookings
```

## Creator View

The Creator experience focuses on managing services and requests:

```text
Creator Dashboard
   ↓
My Gigs
   ↓
Booking Requests
   ↓
Accept / Decline
   ↓
Creator Profile
   ↓
Portfolio
```

No authentication system is used in the current hackathon prototype.

Instead, separate Client and Creator experiences are provided for demonstration and evaluation.

---

# 🔐 Booking Rules

SkillSwap follows several marketplace integrity rules.

### Creator cannot book their own gig

A creator cannot submit a booking request for a gig that belongs to them.

### Multiple pending requests are allowed

Several clients may express interest in the same gig while requests are pending.

### Only one request can be accepted

Once one request is accepted, competing pending requests are automatically closed.

### Accepted gig becomes unavailable

A gig with an accepted booking cannot receive additional booking requests.

### Declined gig becomes available again

If a request is declined and no other request has been accepted, the gig remains available for future clients.

---

# Reviews & Ratings

Reviews are connected to completed bookings.

A client can submit a review only after the relevant booking has reached the appropriate completed state.

Each review contains:

* Rating from 1–5 stars
* Written comment
* Reviewer
* Date

The platform dynamically calculates:

* Average rating
* Review count
* Rating distribution
* Positive review percentage

This information is surfaced both on gig pages and creator profiles.

---

# Demo Data

Because this is a hackathon prototype without authentication, SkillSwap contains seeded demo data to make the complete user journey testable immediately.

The application includes:

* Demo creator profiles
* Demo client profiles
* Example gigs
* Example bookings
* Example reviews
* Example portfolio content

Client profiles can be selected within the Client experience for demonstration purposes.

The data is persisted locally so actions performed during a demo remain available after page refresh.

---

# Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### UI

* Responsive component-based interface
* Lucide icons
* Modern marketplace-oriented design

### Data Persistence

* Browser localStorage
* Centralized application data/state management

### Architecture

The application uses separate models for:

* Creators
* Clients
* Gigs
* Bookings
* Reviews

Relationships are maintained using unique IDs such as:


creatorId
clientId
gigId
bookingId


This keeps profile, booking, review, and gig data consistent.

---

# Project Structure

skillswap/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── marketplace/
│   │   ├── gigs/
│   │   ├── bookings/
│   │   ├── dashboard/
│   │   └── common/
│   │
│   ├── context/
│   │
│   ├── data/
│   │
│   ├── pages/
│   │
│   ├── services/
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── README.md
├── DECISIONS.md
├── package.json
└── package-lock.json
```

---

# Data Persistence

SkillSwap currently uses browser-based persistence.

Important application data is stored locally, including:

* Client profiles
* Creator profiles
* Gigs
* Bookings
* Reviews
* Portfolio data
* Selected demo role
* Selected demo client

This allows the evaluator to test a complete flow without requiring an external database or authentication system.

---

# Local Development

## Prerequisites

Make sure Node.js and npm are installed.

## Installation

npm install --legacy-peer-deps


## Start Development Server


npm run dev


The development server will provide a local URL such as:


http://localhost:5173

## Production Build


npm run build

---

# Suggested Evaluation Flow

The complete product can be tested using the following workflow.

### Client


Open Client View
      ↓
Browse Marketplace
      ↓
Search / Filter / Sort
      ↓
Open Gig
      ↓
View Creator Profile
      ↓
View Portfolio
      ↓
Read Reviews
      ↓
Book Gig
      ↓
View My Bookings
```

### Creator

```text
Open Creator View
      ↓
Open Dashboard
      ↓
View Booking Requests
      ↓
Accept / Decline
      ↓
Manage Gigs
      ↓
Manage Profile
      ↓
Manage Portfolio
```

### Decision Point Demonstration

```text
Multiple clients submit requests
             ↓
Creator evaluates requests
             ↓
Creator accepts one
             ↓
Other requests are closed
             ↓
Accepted booking continues
             ↓
Gig becomes unavailable
```

---

# Hackathon Focus

SkillSwap was designed around the three primary Track 2 evaluation dimensions:

### Correctness

The required marketplace functionality works end-to-end:

* Gig creation
* Search
* Filtering
* Sorting
* Booking
* Creator management
* Booking status
* Reviews
* Profiles

### Judgment

The product includes explicit decisions around:

* Rejection handling
* Multiple booking requests
* Discovery and marketplace ranking

These decisions are documented separately in:

`DECISIONS.md`

### Craft

The interface focuses on:

* Clear client and creator experiences
* Responsive design
* Trust-building creator profiles
* Ratings and reviews
* Portfolio presentation
* Clear booking states
* Meaningful empty/error states
* Consistent visual hierarchy

---

# AI Development

AI tools were permitted for the hackathon development process.

AI was used as a development assistant during implementation, debugging, refinement, and iteration.

The final product decisions, interaction rules, marketplace behavior, and Decision Points were intentionally defined around the requirements of the SkillSwap product.

---

# Deployment

The production application is intended to be deployed to a publicly accessible URL for hackathon evaluation.

**Live Application:**


The source code is publicly available at:

**GitHub:**
