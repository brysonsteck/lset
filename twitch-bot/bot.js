/*
 * Created by Bryson Steck (@brysonsteck on GitHub)
 * Feel free to make changes and send a PR!
 * Open source under the MIT License:
 *
 * Copyright (c) 2022 Bryson Steck
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

const tmi = require('tmi.js');
const fs = require('fs');

// read settings and reactions json files
try {
  var settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));
  var reacts = JSON.parse(fs.readFileSync('./reacts.json', 'utf8'));
  var chat_commands = JSON.parse(fs.readFileSync('./commands.json', 'utf8'));
  var mod_commands = JSON.parse(fs.readFileSync('./mod_commands.json', 'utf8'));
} catch (err) {
  console.error("An error occured trying to read the files for the Twitch bot: " + err);
}

const opts = {
  identity: {
    username: settings.bot_username,
    password: settings.bot_token
  },
  channels: settings.channels
};

const linkProtection = settings.link_protection;
const bannedUrlEndings = settings.banned_endings;
var modString = "";
var mods;

try {
  modString = fs.readFileSync('mods.txt', 'utf8');
  trustedString = fs.readFileSync('trusted_users.txt', 'utf8');
  modString = modString.replace(/(\r\n|\n|\r)/gm, "");
  trustedString = trustedString.replace(/(\r\n|\n|\r)/gm, "");
  console.log('* Loaded mods and trusted users from file.');
  mods = modString.split(",");
  trustedUsers = trustedString.split(",");
} catch (err) {
  console.error(err)
}

var modCommand = false;
var message, fullMessage;

function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  const user = context.username;
  // save full message if adding/editing command
  fullMessage = msg.trim();
  msg = msg.toLowerCase();
  message = msg.trim();
  
  // link protection stuff, only enables when true in settings.json
	var findUrlEndings = false;
	if (linkProtection) {
  	for (var i=urlEndings.length; i--;) {
    	if (message.includes(urlEndings[i])) findUrlEndings = true;
    	else if (message.includes(urlEndings[i].replace('.', '*'))) findUrlEndings = true;
  	}
	}

  if (message.charAt(0) === settings.command_char) {
    message = message.substr(1);
    valid = commands(target, message, user, mods);
  } else {
    if (linkProtection && findUrlEndings)
      if (!linkProtect())
        reactions(target, message, user);
    else 
      reactions(target, message, user);
  }
}

function commands (target, commandName, user, mods) {
  modCommand = false;
  var valid = false;
  var isMod = false;
  if (mods.indexOf(user) >= 0) isMod = true;
  
  if (commandName === "help") {
    var finalString = settings.command_char + "help " + settings.command_char + "about ";
    chat_commands.forEach(command => {
      finalString = finalString + settings.command_char + command.command + " ";
    });
    client.say(target, `Here is the list of commands: ${finalString}`);
    valid = true;
  } else if (commandName === "about") {
    client.say(target, `This bot was stolen from https://github.com/brysonsteck/lset under the MIT License and configured by your streamer, ${settings.your_username}!`);
    valid = true;
  } else {
    chat_commands.forEach(command => {
      if (commandName.search(command.command) !== -1) {
        client.say(target, `${command.reply}`);
        valid = true;
        return true;
      }
    });
  }

  if (valid === false) {
    if (isMod) {
      valid = modCommands(target, commandName, isMod);
    }
  }

  if (valid) {
    console.log(`* ${user} executed !${commandName}`);
  } else {
    if (modCommand === false) {
      client.say(target, `@${user} Unknown command "${settings.command_char}${commandName}". Type ${settings.command_char}help for all commands.`);
    }
    console.warn(`! ${user} tried to execute unknown/banned command !${commandName}`);
  }
}

function modCommands(target, commandName, message, isMod) {
  var valid = false;
  test_mod_commands = ["addcommand", "editcommand"];
  test_mod_commands.forEach(command => {
    if (commandName.search(command) !== -1) {
      if (!isMod) {
        client.say(target, `Only moderators can run this command...`);
        return true;
      } else {
        if (command === "addcommand") {
          createCommand(target);
        } else if (command === "editcommand") {
          editCommand(target);
        }
        client.say(target, `${command.reply}`);
        valid = true;
        return true;
      }
    }
  });
  return valid;
}

function createCommand(target) {
  chat_commands.forEach(command => {
    if (fullMessage[1].search(command.command) !== -1) {
      client.say(target, `The command ${settings.command_char}${fullMessage[1]} already exists. Use !editcommand to change it's contents.`);
      return false;
    }
  });
  var command_reply = "";
  for (int i = 2; i < fullMessage.length; i++) {
    command_reply = command_reply + fullMessage[i] + " ";
  chat_commands.push(['command': fullMessage[1], 'reply': command_reply]);
  try {
    const data = JSON.stringify(chat_commands, null, 4);
    fs.writeFileSync('user.json', data);
    console.log('* Added command ' + settings.command_char + fullMessage[1]);
    client.say(target, `Successfully added command: ${settings.command_char}${fullMessage[1]}`);
  } catch (err) {
    console.error('An error occured trying to run !addcommand: ' + err);
    client.say(target, `Something went wrong adding this command, please try again later.`);
  }
}

function editCommand(target) {

}

function reactions (target, message, user) {
  reacts.forEach(react => {
    if (message.search(react.trigger) !== -1) {
      client.say(target, `${react.reply}`);
    }
  });
}

function linkProtect() {
  if (trustedUsers.indexOf(user) === -1) {
    if (message.search("http") !== -1 || message.search("www.") !== -1 || findUrlEndings) {
      urlAttempt = message;
      urlAttemptUser = user;
      console.log(`! ${user} tried to post a URL. Warned and timedout for 10 seconds. Message: "${urlAttempt}"`);
      client.say(target, `/timeout ${user} 10 Links from untrusted users are deleted as a protection against chat bots.`);
      client.say(target, `@${user} Your link was deleted because you haven't been in my chat before. If you have a legitimate link and aren't a bot, let me know!`);
      // is a bot, don't go farther
			return true;
    } else {
      trustedString = trustedString + `,${user}`;
      trustedString = trustedString.replace(/(\r\n|\n|\r)/gm, "");
      trustedUsers.push(user);
      fs.writeFile('trusted_users.txt', `${trustedString}`, function (err) {
        if (err) return console.log(err);
        console.log(`* ${user} is now a trusted chatter.`);
      });
      // not a bot, move on to reactions
			return false;
    }
  }
}

// Twitch bot initialization
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Notify when connected
function onConnectedHandler (addr, port) {
  console.log(`* Main Bot successfully connected to ${addr}:${port}`);
}


