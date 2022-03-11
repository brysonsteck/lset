const tmi = require('tmi.js');
const timed = require('./timedMessages.js');

const opts = {
  identity: {
    username: '',
    password: ''
  },
  channels: [
    ''
  ]
};

const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

const fs = require('fs')
var modString = "";
var mods;
var trustedString = "";
var trustedUsers;

try {
  modString = fs.readFileSync('', 'utf8');
  trustedString = fs.readFileSync('', 'utf8');
  console.log('');
  modString = modString.replace(/(\r\n|\n|\r)/gm, "");
  trustedString = trustedString.replace(/(\r\n|\n|\r)/gm, "");
  mods = modString.split(",");
  trustedUsers = trustedString.split(",");
} catch (err) {
  console.error(err)
}

var urlAttempt = "";
var urlAttemptUser = "";
const urlEndings = ['.com', '.org', '.edu', '.gov', '.gg', '.io', '.tv', '.uk', '.net', '.ca', '.de', '.jp', '.fr', '.au', '.us', '.ru', '.ch', '.it', '.nl', '.se', '.no', '.es', '.mil', '.xyz', '.top', '.info'];
var modCommand = false;

function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  //console.log(msg);
  //console.log(target);
  //console.log(context);
  var user = context.username;
  msg = msg.toLowerCase();
  var message = msg.trim();

  var findUrlEndings = false;
  for (var i=urlEndings.length; i--;) {
    if (message.includes(urlEndings[i])) findUrlEndings = true;
    else if (message.includes(urlEndings[i].replace('.', '*'))) findUrlEndings = true;
  }

  if (message.charAt(0) === '!') {
    message = message.substr(1);
    valid = commands(target, message, user, mods)
  }
  // Link protection
  if (trustedUsers.indexOf(user) === -1) {
    if (message.search("http") !== -1 || message.search("www.") !== -1 || findUrlEndings) {
      urlAttempt = message;
      urlAttemptUser = user;
      console.log(`! ${user} tried to post a URL. Warned and timedout for 10 seconds. Message: "${urlAttempt}"`);
      client.say(target, `/timeout ${user} 10 Links from untrusted users are deleted as a protection against chat bots.`);
      client.say(target, `@${user} Your link was deleted because you haven't been in my chat before. If you have a legitimate link, let me know!`);
    } else {
        trustedString = trustedString + `,${user}`;
        trustedString = trustedString.replace(/(\r\n|\n|\r)/gm, "");
        trustedUsers.push(user);
        fs.writeFile('', `${trustedString}`, function (err) {
          if (err) return console.log(err);
          console.log(`* ${user} is now a trusted chatter.`);
        });
    }
}

  // easter eggs
  if (message.search("") !== -1) {
    client.say(target, `You talkin' to me punk? WideHardo`);
  }
  if (message.search("you") !== -1 && message.search("good") !== -1) {
    client.say(target, `Thanks ~uwu~ AYAYA`);
  }
  if (message.search("bruh") !== -1) {
    client.say(target, `${user} is 12 years old and shouldn't be on Twitch.`);
  }
  if (message.search ("hi ") !== -1 && message.length <= 12) {
    client.say(target, `I'm new here.`);
  } 
}

function commands (target, commandName, user, mods) {
  modCommand = false;
  var valid = false;
  var isMod = false;
  if (mods.indexOf(user) >= 0) isMod = true;

  if (commandName === 'commands') {
    valid = true;
    client.say(target, `@${user} Here is the list of commands: !about !bttv !commands !discord !emotes !followage !hits !join !uptime`);
  } else if (commandName === 'about') {
    valid = true;
    client.say(target, `@${user} `);
//  } else if (commandName === 'pb') {
//    valid = true;
//    client.say(target, 'Mario Kart Wii PBs PogChamp \\\\ Nitro Tracks: 33:30:196 (IGT, 49th) \\\\ Retro Tracks: 31m 41s 540ms (IGT, 18th)');
  } else if (commandName === 'bttv') {
    valid = true;
    client.say(target, `@${user} If you can't see this emote on desktop (or Android I guess) -> WideHardo then install the BetterTTV browser extension here! -> https://betterttv.com/`);
  } else if (commandName === 'emotes') {
    valid = true;
    client.say(target, `@${user} (!bttv) Channel Emotes: EZ Clap pepeD HACKERMANS pepeJAM NODDERS Drake catJAM BOOBA funkyPls PauseChamp WAYTOODANK gachiGASM Cope TRUEING 4Weird 5Head AYAYA FeelsOkayMan FeelsWeirdMan HandsUp KEKW KKonaW LULW monkaW OMEGALUL Pepega PepegaPhone PepeLaugh PepoG PepoThink Pog POGGERS PogO PogU Sadge WideHardo widepeepoHappy widepeepoSad YEP`);
  } else if (commandName === 'followage') {
    valid = true;
    printHTML(`@${user} You have been following  for`, `followage//${user}`, '');
  } else if (commandName === 'uptime') {
    valid = true;
    printHTML(`@${user}  has been live for`, `uptime/`, '');
  } else if (commandName === 'join') {
    valid = true;
    client.say(target, `Friend Code: 3356-0850-0440 (To join a race simply add this friend code and join the game when it lets you! Requires CTGP or Wiimmfi-patched MKWii disc. You can only join when the "OPENHOST" message appears on stream lmao)`);
  } else if (commandName === 'discord') {
    valid = true;
    client.say(target, `The OFFICIAL  Discord is now live! Come join if you love steak. Or any meat for that matter. Or even if you don't like meat. If you're a vegetarian, we have those weird ass veggie options too. Just join pls lmao: https://discord.gg/c8BjmFPhJt`);
//  } else if (commandName === 'lounge') {
//    valid = true;
//    client.say(target, `Lounge is the biggest competetive gateway for Mario Kart Wii for both Nintendo and CTGP-R tracks. With ranks similar to VALORANT, the goal is to compete for the highest rank possible by earning LR and MMR before the season ends by playing "mogis". To learn more about mogis, type "!mogis".`);
//  } else if (commandName === 'mogis') {
//    valid = true;
//    client.say(target, `Mogis consist of 12 tracks seperated between 3 grands prix. Players vote to play either FFA, 2v2, 3v3, 4v4 or 6v6. The team/player with the highest amount of points overall wins.`);
  } else if (commandName === 'hits') {
    valid = true;
    client.say(target, `NOT IN EFFECT NOW, SMP HAS NOT STARTED -> Donate to start a hit on a player on the server! $3 minimum with the description containing the name of the streamer. To donate, click on the loon in my bio.`);
  }

  if (valid === false) {
    valid = modCommands(target, commandName, isMod);
  }
  if (valid) {
    console.log(`* ${user} executed !${commandName}`);
  } else {
    if (modCommand === false) {
      client.say(target, `@${user} Unknown command "!${commandName}". Type !commands for all commands. :)`);
    }
    console.warn(`! ${user} tried to execute unknown/banned command !${commandName}`);
  }
}

function modCommands(target, commandName, isMod) {
  var valid = false;
  commandName = commandName.split(" ");
  if (commandName[0] === 'allowurl') {
    valid = true;
    modCommand = true;
    if (isMod) {
      if (urlAttempt !== "") client.say(target, `Here was the message posted in chat by ${urlAttemptUser}: "${urlAttempt}"`);
      else client.say(target, `There hasn't been a link that was blocked at the moment.`);
    } else {
      valid = false;
      client.say(target, `Only mods can run this command. PepeLaugh`);
    }
  }
  return valid;
}


function onConnectedHandler (addr, port) {
  console.log(`* Main Bot successfully connected to ${addr}:${port}`);
}

// Get HTML contents ----------------------------------------------------------------------

const getScript = (url) => {
    return new Promise((resolve, reject) => {
        const http      = require('http'),
              https     = require('https');

        let client = http;

        if (url.toString().indexOf("https") === 0) {
            client = https;
        }

        client.get(url, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                return resolve(data);
            });

        }).on("error", (err) => {
            return reject(err);
        });
    });
};

function printHTML(beforeMsg, path, afterMsg) {
   (async (url) => {
       client.say('', `${beforeMsg} ${await getScript(url)} ${afterMsg}`);
   })(`https://api.crunchprank.net/twitch/${path}`);
}

