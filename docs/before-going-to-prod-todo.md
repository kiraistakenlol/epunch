Here's what has to be done before we launch with any client:

1. Secutiry fix: Currently any merchant can punch any other merchant's punch card.

2. deploy PROD epunch.app:
 * new postgres
 * cognito user pool (client id , secret, domain)
 * s3 bucket for merchant logos
 * separate terraform environment (prod)
 * google auth. figure out if we use the same app or we need to create a new one in google cloud console. what is the best practice? also there was sth about app verification when going to prod... (a note in google cloud console - check it!!!)
  
3. Localization (for Argentina):
  * what is the best practice to do it give out tech stack? (Brainstorm)