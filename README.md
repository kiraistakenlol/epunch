# E-PUNCH.io

A simple electronic punch card system.

Users have a personal QR code and digital punch cards for various businesses. Businesses scan the user's QR code to add punches. Accumulated punches lead to rewards.

## Core Entities

Based on the high-level user scenarios, the following essential entities are identified:

1.  **User:** The customer who collects punches and redeems rewards.
    *   *Key in scenario:* The "I" in the user stories, needs an "E-PUNCH identity."

2.  **Merchant:** The business offering the loyalty program (e.g., Cafe Central).
    *   *Key in scenario:* The "Cafe Central," the one whose "staff" interacts with the system.

3.  **Loyalty Program:** The specific offer a Merchant provides, defining the rules and the reward. 
    *   *Example:* "10 punches for a free coffee".
    *   *Key in scenario:* The "10 coffees get 1 free" offer, which implicitly includes the "Free Coffee" reward.

4.  **Punch Card:** An individual User's participation and progress in a specific Merchant's Loyalty Program.
    *   *Key in scenario:* The card that "appears in my E-PUNCH app," shows "1 out of 10 punches," and updates to "Reward Ready!" based on the Loyalty Program's terms.

5.  **Punch:** A single instance of a mark or credit given to a User on their Punch Card.
    *   *Key in scenario:* Each time the "punch count...increase[s]."

## User Journey

### Visiting "Pottery Cafe"

1.  I walk into "Pottery Cafe" and scan their QR code (or open `epunch.io` manually).
2.  I see my personal QR code on `epunch.io` and my list of punch cards.
    *   If it's my first time at Pottery Cafe:
        *   If I scanned their QR code: I might see a new "Pottery Punch Card" with 0/10 punches right away.
        *   If I opened `epunch.io` manually: The "Pottery Punch Card" will appear in my list only *after* the manager scans my QR code for the first time (usually showing 1/10 punches).
    *   If I've been here before, I see my existing "Pottery Punch Card" with its current punch count (e.g., n/10).
3.  I buy a coffee and show my QR code to the manager.
4.  The manager scans my QR code.
5.  I see my "Pottery Punch Card" on `epunch.io` update with +1 punch.
6.  When my card shows 10/10 punches ("Reward Ready!"):
    *   I tell the manager I want my free coffee and show my QR code.
    *   The manager scans it.
    *   I get my free coffee.
    *   I see my "Pottery Punch Card" reset to 0/10 punches on `epunch.io`.
    *   I see a note like "1 free coffee redeemed" for Pottery Cafe.

### Visiting a Different Cafe ("Cafe B")

1.  I visit "Cafe B" and scan their QR code (or open `epunch.io`).
2.  After buying something and the manager scans my QR code for the first time:
    *   I see a new "Cafe B Punch Card" appear in my list on `epunch.io`, starting with 1 punch (or 0). 