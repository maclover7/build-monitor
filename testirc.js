const irc = require('irc');
const client = new irc.Client('irc.freenode.net', process.env.IRC_NICKNAME, {
  userName: process.env.IRC_NICKNAME,
  password: process.env.IRC_PASSWORD
});

client.addListener('error', (err) => {
  console.log(`err: ${JSON.stringify(err)}`);
});

client.connect(() => {
  client.say('maclover7', "Test message");
  client.disconnect(() => { process.exit(0); });
});
