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

var modString = "";
var mods;

try {
  modString = fs.readFileSync('mods.txt', 'utf8');
  modString = modString.replace(/(\r\n|\n|\r)/gm, "");
  mods = modString.split(",");
} catch (err) {
  console.error(err)
}

var modCommand = false;

function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  const user = context.username;
  msg = msg.toLowerCase();
  var message = msg.trim();

  if (message.charAt(0) === settings.command_char) {
    message = message.substr(1);
    valid = commands(target, message, user, mods);
  } else {
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

function modCommands(target, commandName, isMod) {
  var valid = false;
  mod_commands.forEach(command => {
    if (message.search(command.command) !== -1) {
      if (!isMod) {
        client.say(target, `Only moderators can run this command...`);
        return true;
      } else {
        client.say(target, `${command.reply}`);
        valid = true;
        return true;
      }
    }
  });
  return valid;
}

function reactions (target, message, user) {
  reacts.forEach(react => {
    if (message.search(react.trigger) !== -1) {
      client.say(target, `${react.reply}`);
    }
  });
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


