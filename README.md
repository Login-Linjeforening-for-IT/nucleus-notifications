# Nucleus Notifications
Nucleus notifications is a collection of functions to automate management of
notifications for the Login app.

## How it works
The repository fetches the API every minute, or 30 minutes depending on how
important the change is. Specifically, the link has high priority. Events coming
soon without a link posted yet has a high priority, and will be fetched every
minute, to make sure the user does not miss the link being posted. Otherwise,
the event will be fetched every 30 minutes, as we are not expecting any changes,
except possibly a location or time change. These are usually changed far in
advance, therefore this half hour wait time has no negative impact.

## How to set in production
1. Verify that the service runs correctly locally using `npm run test`
2. Verify that the service runs correctly in docker using `docker compose up`
3. Send the service to production using the `/deploy` command followed by the `/release` command of the TekKom Bot.
