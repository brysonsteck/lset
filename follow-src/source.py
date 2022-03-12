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

