# SkillSwap Decision Points

## DP1 · Rejection

### Decision

When a creator declines a client's booking request:

- The booking immediately changes to **Declined** and remains visible in the client's **My Bookings** dashboard.
- The creator can optionally provide a short reason for the rejection.
- The reason is shown directly to the client alongside the Declined status.
- The client receives an **Explore More Similar Gigs** action.
- This action returns the client to the marketplace with the same category already selected.
- The original gig becomes available again for new booking requests.

### Why

A rejection is an important moment in a service marketplace because the client still needs to complete their task.

We designed the experience around three principles:

**Transparency:**  
The client should understand why a request was declined rather than being left with an unexplained status.

**Continuity:**  
A declined request should not become a dead end. The client is immediately given relevant alternatives in the same service category.

**Creator flexibility:**  
Creators can decline requests that do not fit their availability, requirements, or capacity, while keeping the listing available for a better-fit request.

This keeps the interaction transparent for the client while allowing the marketplace relationship to continue.

---

## DP2 · Double Booking

### Decision

**Yes. Multiple clients can submit booking requests for the same gig while requests are still Pending.**

However, only one request can ultimately become **Accepted**.

When a creator accepts one request:

- That request becomes **Accepted**.
- All other Pending requests for the same gig are automatically changed to **Declined**.
- Those clients receive the standardized reason:
  **"Unfortunately, not available."**
- The accepted gig becomes unavailable for further bookings.

### Why

We chose a **multiple-interest, single-commitment** model.

A single Pending request should not block the creator from receiving other opportunities. A creator may receive several requests and reasonably need to choose the client whose requirements, timeline, or project fit is most suitable.

At the same time, the marketplace must prevent an actual double booking.

Therefore:

**Before acceptance:**  
Multiple clients can express interest.

**At acceptance:**  
Only one client becomes the confirmed booking.

**After acceptance:**  
The gig becomes unavailable.

This balances creator choice with a clear final commitment and prevents two clients from simultaneously receiving an accepted booking for the same gig.

---

## DP3 · Discovery

### Decision

Gigs are displayed **Newest First by default**, using their creation timestamp in descending order.

Clients can also change the ranking according to their current preference:

- Newest First
- Cheapest First
- Most Expensive First
- Highest Rated
- Most Reviewed
- Most Popular

Search and category filtering are applied before the selected ranking.

### Highest Rated

Gigs are ranked by:

1. Average rating
2. Review count as the tie-breaker
3. Recency as the final tie-breaker

### Most Popular

Popularity is calculated from actual marketplace activity rather than an arbitrary label:

**Popularity Score =**
Completed/recorded bookings × 3
+ Reviews × 2
+ Average Rating

### Why

There is no single "best" way for every client to discover a service.

A client with a limited budget may care most about price.  
Another may prioritize reputation.  
Another may want a recently published service.

Giving the client control over ranking makes discovery preference-driven rather than forcing one marketplace algorithm on everyone.

We chose **Newest First as the default** because it also gives newly published creators immediate visibility. If the marketplace always prioritized established listings through popularity or ratings, newer creators could struggle to receive their first opportunity.

The result is a marketplace that combines **fresh creator discovery with user-controlled search and ranking.**