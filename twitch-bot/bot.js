const tmi = require('tmi.js');
const timed = require('./timedMessages.js');
const fs = require('fs');

// read settings and reactions json files
fs.readFile('./settings.json', 'utf8', (err, data) => {
  if (err) {
    console.log(`Error reading settings file from disk: ${err}`);
    process.exit(1);
	} else {
		// parse JSON string to JSON object
		const settings = JSON.parse(data);
	}
}

fs.readFile('./reacts.json', 'utf8', (err, data) => {
  if (err) {
    console.log(`Error reading reacts file from disk: ${err}`);
    process.exit(1);
	} else {
		// parse JSON string to JSON object
		const reacts = JSON.parse(data);
	}
}

fs.readFile('./commands.json', 'utf8', (err, data) => {
  if (err) {
    console.log(`Error reading commands file from disk: ${err}`);
    process.exit(1);
	} else {
		// parse JSON string to JSON object
		const commands = JSON.parse(data);
	}
}

fs.readFile('./mod_commands.json', 'utf8', (err, data) => {
  if (err) {
    console.log(`Error reading mod commands file from disk: ${err}`);
    process.exit(1);
	} else {
		// parse JSON string to JSON object
		const mod_commands = JSON.parse(data);
	}
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
  modString = fs.readFileSync('', 'utf8');
  modString = modString.replace(/(\r\n|\n|\r)/gm, "");
  mods = modString.split(",");
} catch (err) {
  console.error(err)
}

var modCommand = false;

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
    var allCommands = [];
    var finalString = "";
    commands.forEach(command => {
      allCommands.push(command.command);
    });
    allCommands.forEach(command => {
      finalString = finalString + command.command;
    });
    client.say(target, `Here is the list of commands: ${finalString}`);
  } else {
    commands.forEach(command => {
      if (message.search(command.command) !== -1) {
        client.say(target, `${command.reply}`);
        valid = true;
        break;
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
      } else {
        client.say(target, `${command.reply}`);
        valid = true;
        break;
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


