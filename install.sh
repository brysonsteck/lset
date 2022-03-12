clear

# check if correct programs are installed
type git npm node python3 pip3 vim
ERROR="$?"

if [[ ERROR -ne 0 ]]; then 
  echo
  echo "install: one or more of the above programs are not installed. the programs in question have lines that end in \"not found\". please make sure that these programs are installed through your package manager"
  exit 0
else
  echo
  echo "install: required programs are installed, continuing"
fi

echo "install: installing requests python package for the source script"
pip3 install --user requests

echo
echo "install: installing tmi node module for the twitch bot"
cd twitch-bot
npm install tmi.js
cd ..

clear
echo "Done installing!"
echo "Now you can configure your scripts by editing the corresponding settings files."
USAGE="Would you like to go through the automated steps? [y/n]"
echo $USAGE

while read -rs -N 1 key; do
  case $key in
    y) break ;;
    n) echo "No worries! Just make sure you edit all the JSON files in both directories to your liking."; echo "Happy Streaming!"; exit 0 ;;
  esac
  printf "%b" $USAGE
done

echo "Cool! First let's set up the source script that you can use with OBS or another streaming tool. Before that, lets find an editor. The easiest editor to use is nano."
echo "If you want to use an editor besides nano (e.g. vim or emacs), type in the command for it now then press enter."
echo "Otherwise, press enter to use nano."
read INSTALL_EDITOR

if [[ $INSTALL_EDITOR ]]; then
  echo "Advanced are we? We will use $INSTALL_EDITOR to edit the files then."
  echo "If you entered it wrong, type ^C to exit and rerun the install.sh file."
else
  INSTALL_EDITOR="nano"
fi

echo "The first file we will edit is the settings file. You will need to enter the username of the Twitch channel to get the followers/subs from, then you can optionally change the other parameters. Press ENTER to open the file."
read

echo "executing: $INSTALL_EDITOR follow-src/settings.json"
$INSTALL_EDITOR follow-src/settings.json

echo "Cool! That's everything you need to get the Python bot working. Feel free to edit that file later."
echo "Now let's move on to the Twitch bot. There are more files we must edit in here."
echo "The first file to edit is the settings.json file for the Twitch bot. You will need to add the name of the bot's Twitch username, it's oauth code, and the names of the channels you want the bot to be present in."
echo "You can optionally change the command character. Press ENTER to open the file."
read

echo "executing: $INSTALL_EDITOR twitch-bot/settings.json"
$INSTALL_EDITOR twitch-bot/settings.json

echo "Next, let's add the commands you want your bot to do. Enter the name of the command in the \"command\" field, and the reply for that command in the \"reply\" field. You can add as many commands as you want."
echo "Press ENTER to open the file."
read

echo "executing: $INSTALL_EDITOR twitch-bot/commands.json"
$INSTALL_EDITOR twitch-bot/commands.json

echo "Finally, let's set up reactions for your bot. Reactions are messages that your bot sends when someone says a specific phrase, without any need for a command."
echo "For example, if someone in Twitch chat said exactly \"that was Pog\", the bot could reply \"yes that was!\""
echo "To add reactions, put the trigger phrase in the \"trigger\" field, then put the reply for that trigger inside the \"reply\" field."
echo "Press ENTER to open the file."
read

echo "executing: $INSTALL_EDITOR twitch-bot/reacts.json"
$INSTALL_EDITOR twitch-bot/reacts.json

echo "That's it! Everything should be set up and ready to go. You can optionally add mod commands for the Twitch bot by editing the twitch-bot/mod_commands.json file."
echo "To start the source script and the Twitch bot simultaneously, you can run the run.sh file that is present in this directory."
echo "If you ran into any issues during the install or running the bot/source script, feel free to create an issue on GitHub."
echo "Happy streaming!"

