# Electron Forge: Running a Node Process

Example project that shows how to spawn a plain node (NOT Electron) process and run a script calling a node module from an Electron Forge app.  Shows communication via IPC between the node process and the main Electron process.

To run:

- Clone
- Make sure you have node and npm installed
- Start a command prompt/terminal in the my-app folder
- npm i
- npm start

An Electron window with a 'Run Test' button should appear.  Clicking the button runs the test.  Output is logged to files stdout.log and serverout.log in the myapp folder.

This has been tested on Windows and Ubuntu.  Electron Forge packaging of the app with 'npm run make' works on Windows.

