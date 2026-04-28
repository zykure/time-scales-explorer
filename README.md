# Explore time scales between two timestamps

## Overview

This website shows the interval between two timestamps using a variety of scales.

- Standard scales from seconds, minutes, ... all the way to decades, centuries, millenia.
- Completed decades and centuries: only counts decades (e.g. 2000-2010) that fall completely within the interval.
- Number of encountered leap years and leap seconds; the latter uses a hard-coded list of leap second occurrences.
- Completed lunar, solar (sunspot) and Saros cycles.
- Completed Earth orbits (Earth around Sun) and Galactic orbits (Sun around around galactic center.)
- Number of (theoretically) observed lunar and global solar eclipses; calculated by approximation.
- Distance traveled of Earth around Sun, and Sun around galactic center.
- ... and more to come!?

![Screenshot of the Time Scales Explorer web app.](time-scales-app.png "Time Scales Explorer")

## Setup

Needs NVM/NPM to run. Written in TypeScript with Vite + React. Uses TailwindCSS for styling.

Setup script:

```sh
# Install nvm if you don't have it
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Close and reopen your terminal to start using nvm or run the following to use it now:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Then install latest LTS
nvm install --lts
nvm use --lts

# Create the project with Vite + React + TypeScript
npm create vite@latest time-scales-app -- --template react-ts

cd time-scales-app

# Install dependencies
npm install -D chart.js react-chartjs-2 react-datepicker luxon tailwindcss@3.4 postcss autoprefixer astronomy-engine

# Initialize Tailwind
npx tailwindcss init -p
```

## Run

To start serving the website on a local server:

```
npm run dev
```
