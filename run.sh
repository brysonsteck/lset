#
#  Created by Bryson Steck (@brysonsteck on GitHub)
#  Feel free to make changes and send a PR!
#  Open source under the MIT License:
#
#  Copyright (c) 2022 Bryson Steck
#
#  Permission is hereby granted, free of charge, to any person obtaining a copy
#  of this software and associated documentation files (the "Software"), to deal
#  in the Software without restriction, including without limitation the rights
#  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
#  copies of the Software, and to permit persons to whom the Software is
#  furnished to do so, subject to the following conditions:
#
#  The above copyright notice and this permission notice shall be included in all
#  copies or substantial portions of the Software.
#
#  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
#  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
#  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
#  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
#  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
#  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
#  SOFTWARE.
#

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


