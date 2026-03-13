const { SDK } = require('@ringcentral/sdk');

const rcsdk = new SDK({
  server: process.env.RC_SERVER_URL,
  clientId: process.env.RC_CLIENT_ID,
  clientSecret: process.env.RC_CLIENT_SECRET,
});

const platform = rcsdk.platform();

async function ensureLoggedIn() {
  const loggedIn = await platform.loggedIn();
  if (!loggedIn) {
    await platform.login({ jwt: process.env.RC_JWT });
  }
  return platform;
}

module.exports = { platform, ensureLoggedIn };
