# check if correct programs are installed
type git npm node python3 pip3

if [[ $! -ne 0 ]]; then 
  echo "install: one or more of the above programs are not installed. the programs in question have lines that end in \"not found\". please make sure that these programs are installed through your package manager"
  exit 0
else
  echo "install: required programs are installed, continuing"
fi

echo "install: installing requests python package for the source script"
pip3 install --user requests

echo "install: installing tmi node module for the twitch bot"
cd twitch-bot
npm install tmi.js

echo 
