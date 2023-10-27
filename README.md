# Automated Notifications
Automated notifications is a collection of functions to automate management of
notifications for the Login app.

## How it works
The repository fetches the API every minute, or 30 minutes depending on how
important the change is. Specifically, the link has high priority. Events coming
soon without a link posted yet has a high priority, and will be fetched every
minute, to make sure the user does not miss the link being posted. Otherwise,
the event will be fetched every 30 minutes, as we are not expecting any changes,
except possibly a location or time change. These are usually changed far in
advance, therefore this half hour wait time has no negative impact.
