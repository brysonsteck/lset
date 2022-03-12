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

import requests
import time
import json
import os

with open('settings.json') as f:
  settings = json.load(f)

FOLLOWER_GOAL = settings['follower_goal']
SUB_GOAL = settings['sub_goal']
WRITE_FILE = settings['write_file']
USER = settings['username']
UPDATE = settings['seconds_interval']

print("* Follower/sub goal is now running. To add to your stream, add a text source and open the file " + os.path.abspath(WRITE_FILE) + " to display on your stream.")
while(True):
    followers = open(WRITE_FILE, 'w')
    url_follows = "https://api.crunchprank.net/twitch/followcount/" + USER
    read_follows = requests.get(url_follows)
    url_subs = "https://decapi.me/twitch/subcount/" + USER
    read_subs = requests.get(url_subs)
    #if int(read_follows.text) > followerGoal:
    #    followerGoal += 50
    print(f"Subs: {read_subs.text}/{SUB_GOAL}\nFollower goal: {read_follows.text}/{FOLLOWER_GOAL}\n", end='', file=followers)
    followers.close()
    time.sleep(UPDATE)

