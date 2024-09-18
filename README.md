# Project Details
Cookie Clicker is developed as a demo project for FullStack @ Brown.

# Front-End
The front end uses React and Next.js. It controls for the user interface that is seen and for keeping track of the upgrades, clicks, and cost. It also creates the saveIDs that are sent to the back-end database.

# Back-End
The back end uses Express and Firebase. The primary function of the backend is to store past user data. It saves the game state every 60s for the saveID, so users can return back to their most recent point at any time.