import readline from 'readline';

const TRAKT_OAUTH_URL = 'https://trakt.tv/oauth/authorize';
const TRAKT_TOKEN_URL = 'https://api.trakt.tv/oauth/token';

async function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  const clientId = process.env.TRAKT_CLIENT_ID;
  const clientSecret = process.env.TRAKT_CLIENT_SECRET;
  const redirectUri = process.env.TRAKT_REDIRECT_URI || 'urn:ietf:wg:oauth:2.0:oob';

  if (!clientId) {
    console.error('❌ TRAKT_CLIENT_ID environment variable is not set.');
    console.error('Please add it to your .env file.');
    console.error('\nTo get your credentials:');
    console.error('1. Go to https://trakt.tv/oauth/applications');
    console.error('2. Create a new application');
    console.error('3. Set Redirect URI to: urn:ietf:wg:oauth:2.0:oob');
    console.error('4. Copy your Client ID and Client Secret to .env');
    process.exit(1);
  }

  if (!clientSecret) {
    console.error('❌ TRAKT_CLIENT_SECRET environment variable is not set.');
    console.error('Please add it to your .env file.');
    process.exit(1);
  }

  console.log('\n🎬 Trakt OAuth Setup\n');
  console.log('Step 1: Visit this URL in your browser:\n');

  const authUrl = `${TRAKT_OAUTH_URL}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  console.log(authUrl);

  console.log('\nStep 2: Authorize the application');
  console.log('Step 3: Copy the authorization code from the redirect page\n');

  const code = await promptUser('Enter the authorization code: ');

  if (!code) {
    console.error('❌ No authorization code provided');
    process.exit(1);
  }

  console.log('\n🔄 Exchanging code for access token...');

  try {
    const response = await fetch(TRAKT_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${response.status} ${error}`);
    }

    const data = await response.json();

    console.log('\n✅ Success! Add this to your .env file:\n');
    console.log(`TRAKT_ACCESS_TOKEN=${data.access_token}`);

    if (data.refresh_token) {
      console.log(`TRAKT_REFRESH_TOKEN=${data.refresh_token}`);
    }

    console.log('\n💡 Access tokens expire after 3 months. Use the refresh token to get a new one.');
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main();
