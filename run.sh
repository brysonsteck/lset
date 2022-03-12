cd twitch-bot
node bot.js &
BOT_PID=$!
cd ../follow-src
python3 source.py &
SCRIPT_PID=$!

echo "The Twitch bot and Source script is now running. You can stop this script by typing \"stop\" or pressing ^C"

while read input; do
  case $input in
    stop) kill $BOT_PID; kill $SCRIPT_PID; break;;
  esac
  echo "You can stop this script by typing \"stop\""
done


