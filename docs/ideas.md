

# This doc outlines features and ideas that we might want to implement but all of them are open to discussion.

# Common functionality

## Assign merchant a new field 'type' from a list of pre-defined values (dictionary). 
For example "CAFE", "CAR_WASH", "BARBER_SHOP, etc.
It's going to allow more feature for the user-app, like filtering by card type etc...

## When I clicked on the address on a card it takes me to the default maps on my phone.

## We might proactively remind users via labels in the app/emails that, for example, some card is almost complete, 'Hey, you're almost completed your {} card!' 

# Design

## General user-app design.
Perhaps we don't want to stick to brownish colors and make it more neutral, cards on the other hand will get customized styles, which will make them stend out.

## Punch cards customization

### As a merchant I want to be able to style my cards using custom:
* punch icons
* colors
* fonts
* logo
* layout (header / body / footer proportions)
 And i want to do it globally (default styling) or per loyalty program.

 IDEA: (MAYBE WERE" TALKING HERE ABOUT SOME KIND OF TEMPLATE THAT CAN BE FLEXIBLE CUSTOMIZED via merchant-app page):

 Potenitally in the future it can look like a constructor of cards with an advanced card layout builder that allows great degree of flexibility when customizing cards for merchnat/loyalty program.

For now we're going to keep it simple and 
1. implement logo upload and experiment how to position it on the card.
2. add primry and secondary colors on the merchant level.

## Punch cards view
* grouping by merchant/ loyalty program
* as a user i might want to filter my cars by merchant/loyalty program/status

How to display cards when user has 100+ of them?
Do we implement filters and still display them as one row scrollable horizontally?
Even if we group cards by merchant and loyalty program in some cases it's going to be difficult to find a card if user has lots of them.
So maybe simple text seach input or filters is the way to go. 


# Merchant can send newsleters/ promost to clients.
 Via merchant-app or ther is a better way to do it?
 Sendgrid?


# 


