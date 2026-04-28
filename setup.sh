#!/bin/bash

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
