// Test script để tạo hash cho password
const crypto = require('crypto');

function sha256(message) {
  return crypto.createHash('sha256').update(message).digest('hex');
}

// Test password của bạn
const password = 'ngannguyen@2025';
const hash = sha256(password);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('Expected:', 'df141b87d364e498dd0956c2877dba79fa9ba050775bbadd3f5827703caa8d21');
console.log('Match:', hash === 'df141b87d364e498dd0956c2877dba79fa9ba050775bbadd3f5827703caa8d21');
