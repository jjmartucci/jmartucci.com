/**
 * SIMKL OAuth Helper Script
 *
 * This script helps you obtain an access token from SIMKL.
 *
 * Steps:
 * 1. Run this script: npm run simkl:auth
 * 2. Visit the URL that gets printed
 * 3. Authorize the app
 * 4. Copy the code from the URL you're redirected to
 * 5. Run the script again with the code: npm run simkl:auth <code>
 * 6. Add the access token to your .env file as SIMKL_ACCESS_TOKEN
 */

const SIMKL_CLIENT_ID = process.env.SIMKL_ID;
const SIMKL_CLIENT_SECRET = process.env.SIMKL_SECRET;
const REDIRECT_URI = 'https://builtwith.coffee'; // Must match the redirect URI registered in your SIMKL app

if (!SIMKL_CLIENT_ID || !SIMKL_CLIENT_SECRET) {
  console.error('❌ Error: SIMKL_ID and SIMKL_SECRET must be set in .env file');
  process.exit(1);
}

const authCode = process.argv[2];

if (!authCode) {
  // Step 1: Generate authorization URL
  const authUrl = `https://simkl.com/oauth/authorize?response_type=code&client_id=${SIMKL_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  console.log('\n🔐 SIMKL OAuth Setup\n');
  console.log('Step 1: Visit this URL in your browser:\n');
  console.log(authUrl);
  console.log('\nStep 2: After authorizing, you\'ll be redirected to a URL like:');
  console.log(`${REDIRECT_URI}?code=XXXXX&state=\n`);
  console.log('Step 3: Copy the code value and run:');
  console.log('npm run simkl:auth <code>\n');
} else {
  // Step 2: Exchange code for access token
  console.log('🔄 Exchanging authorization code for access token...\n');

  const tokenUrl = 'https://api.simkl.com/oauth/token';
  const body = {
    code: authCode,
    client_id: SIMKL_CLIENT_ID,
    client_secret: SIMKL_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code'
  };

  fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to exchange code: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('✅ Success! Your access token is:\n');
      console.log(data.access_token);
      console.log('\n📝 Add this to your .env file:');
      console.log(`SIMKL_ACCESS_TOKEN=${data.access_token}\n`);
      console.log('This token does not expire unless you revoke app access.');
    })
    .catch(error => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
}
