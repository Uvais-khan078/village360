import { db } from './server/db.js';
import { users } from './shared/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function resetPassword() {
  try {
    const newHash = await bcrypt.hash('123456', 10);
    await db.update(users).set({ password: newHash }).where(eq(users.username, 'testuser'));
    console.log('Password updated successfully for user "testuser"');
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    process.exit(0);
  }
}

resetPassword();
