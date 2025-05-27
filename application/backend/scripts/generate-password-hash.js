const bcrypt = require('bcrypt');

const password = process.argv[2] || '0000';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
  
  console.log(`Password: "${password}"`);
  console.log(`Bcrypt hash: ${hash}`);
  console.log('\nSQL Update command:');
  console.log(`UPDATE merchant SET password_hash = '${hash}', login = 'testmerchant' WHERE id = '251dc2f0-f969-455f-aa7d-959a551eae67';`);
}); 