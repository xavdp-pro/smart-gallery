import bcrypt from 'bcryptjs';
import { createUser } from './server/database.js';

// Créer un administrateur par défaut
async function createAdmin() {
  try {
    const email = 'admin@photo-manager.local';
    const password = 'Admin123!';
    const name = 'Administrateur';
    const role = 'admin';

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const result = createUser(email, hashedPassword, name, role);

    console.log('\n✅ Administrateur créé avec succès!\n');
    console.log('📧 Email:', email);
    console.log('🔑 Mot de passe:', password);
    console.log('👤 Nom:', name);
    console.log('🛡️  Rôle:', role);
    console.log('🆔 ID:', result.id);
    console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après votre première connexion!\n');
    console.log('🌐 Connectez-vous sur: http://localhost:9999/login\n');
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
  }
}

createAdmin();
