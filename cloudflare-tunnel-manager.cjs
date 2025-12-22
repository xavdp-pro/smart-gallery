#!/usr/bin/env node

/**
 * Cloudflare Tunnel Manager
 * Gestion automatisée des tunnels Cloudflare
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG_FILE = path.join(__dirname, '.cloudflare-config.json');

class CloudflareTunnelManager {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
    return {
      accountId: '',
      apiToken: '',
      email: '',
      tunnels: []
    };
  }

  saveConfig() {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2));
    console.log('✅ Configuration sauvegardée');
  }

  // Configurer les credentials API
  configure(accountId, apiToken, email) {
    this.config.accountId = accountId;
    this.config.apiToken = apiToken;
    this.config.email = email;
    this.saveConfig();
    console.log('✅ Credentials configurés');
  }

  // Requête API Cloudflare
  async apiRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.cloudflare.com',
        path: endpoint,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            if (response.success) {
              resolve(response.result);
            } else {
              reject(new Error(response.errors?.[0]?.message || 'API Error'));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      if (data) req.write(JSON.stringify(data));
      req.end();
    });
  }

  // Générer un secret aléatoire pour le tunnel
  generateTunnelSecret() {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('base64');
  }

  // Créer un tunnel
  async createTunnel(name, hostname, localPort = 9999) {
    console.log(`\n🚀 Création du tunnel "${name}"...`);

    try {
      // 1. Créer le tunnel via API
      const tunnelSecret = this.generateTunnelSecret();
      const tunnel = await this.apiRequest(
        'POST',
        `/client/v4/accounts/${this.config.accountId}/cfd_tunnel`,
        {
          name: name,
          tunnel_secret: tunnelSecret
        }
      );

      console.log(`✅ Tunnel créé: ${tunnel.id}`);

      // 2. Créer le fichier credentials
      const credentialsPath = `/etc/cloudflared/${tunnel.id}.json`;
      const credentials = {
        AccountTag: this.config.accountId,
        TunnelSecret: tunnelSecret,
        TunnelID: tunnel.id
      };

      execSync(`sudo mkdir -p /etc/cloudflared`);
      execSync(`echo '${JSON.stringify(credentials)}' | sudo tee ${credentialsPath} > /dev/null`);
      console.log(`✅ Credentials créés: ${credentialsPath}`);

      // 3. Créer la configuration
      const configContent = `tunnel: ${tunnel.id}
credentials-file: ${credentialsPath}

ingress:
  - hostname: ${hostname}
    service: http://localhost:${localPort}
    originRequest:
      noTLSVerify: true
  - service: http_status:404
`;

      const configPath = `/etc/cloudflared/config.yml`;
      execSync(`echo '${configContent}' | sudo tee ${configPath} > /dev/null`);
      console.log(`✅ Configuration créée: ${configPath}`);

      // 4. Créer l'enregistrement DNS
      const domain = hostname.split('.').slice(-3).join('.');
      const subdomain = hostname.split('.').slice(0, -3).join('.');
      
      console.log(`\n📝 Création de l'enregistrement DNS...`);
      console.log(`   Domaine: ${domain}`);
      console.log(`   Sous-domaine: ${subdomain || '@'}`);

      // Récupérer la zone ID
      const zones = await this.apiRequest('GET', `/client/v4/zones?name=${domain}`);
      if (!zones || zones.length === 0) {
        throw new Error(`Zone ${domain} non trouvée`);
      }
      const zoneId = zones[0].id;

      // Créer le CNAME
      await this.apiRequest(
        'POST',
        `/client/v4/zones/${zoneId}/dns_records`,
        {
          type: 'CNAME',
          name: subdomain || '@',
          content: `${tunnel.id}.cfargotunnel.com`,
          ttl: 1,
          proxied: true
        }
      );

      console.log(`✅ DNS configuré: ${hostname} → ${tunnel.id}.cfargotunnel.com`);

      // 5. Installer et démarrer le service
      console.log(`\n🔧 Installation du service...`);
      execSync('sudo cloudflared service install', { stdio: 'inherit' });
      execSync('sudo systemctl enable cloudflared', { stdio: 'inherit' });
      execSync('sudo systemctl restart cloudflared', { stdio: 'inherit' });

      console.log(`✅ Service démarré`);

      // 6. Sauvegarder dans la config locale
      this.config.tunnels.push({
        id: tunnel.id,
        name: name,
        hostname: hostname,
        localPort: localPort,
        createdAt: new Date().toISOString()
      });
      this.saveConfig();

      console.log(`\n🎉 Tunnel "${name}" créé avec succès !`);
      console.log(`   URL: https://${hostname}`);
      console.log(`   Local: http://localhost:${localPort}`);
      console.log(`   ID: ${tunnel.id}`);

      return tunnel;

    } catch (error) {
      console.error(`❌ Erreur: ${error.message}`);
      throw error;
    }
  }

  // Lister les tunnels
  async listTunnels() {
    try {
      const tunnels = await this.apiRequest(
        'GET',
        `/client/v4/accounts/${this.config.accountId}/cfd_tunnel`
      );

      console.log(`\n📋 Tunnels Cloudflare:\n`);
      tunnels.forEach(tunnel => {
        const local = this.config.tunnels.find(t => t.id === tunnel.id);
        console.log(`   🔹 ${tunnel.name}`);
        console.log(`      ID: ${tunnel.id}`);
        console.log(`      Status: ${tunnel.status || 'unknown'}`);
        if (local) {
          console.log(`      Hostname: ${local.hostname}`);
          console.log(`      Port: ${local.localPort}`);
        }
        console.log('');
      });

      return tunnels;
    } catch (error) {
      console.error(`❌ Erreur: ${error.message}`);
      throw error;
    }
  }

  // Supprimer un tunnel
  async deleteTunnel(nameOrId) {
    try {
      // Trouver le tunnel
      const tunnels = await this.apiRequest(
        'GET',
        `/client/v4/accounts/${this.config.accountId}/cfd_tunnel`
      );

      const tunnel = tunnels.find(t => t.name === nameOrId || t.id === nameOrId);
      if (!tunnel) {
        throw new Error(`Tunnel "${nameOrId}" non trouvé`);
      }

      console.log(`\n🗑️  Suppression du tunnel "${tunnel.name}"...`);

      // Supprimer via API
      await this.apiRequest(
        'DELETE',
        `/client/v4/accounts/${this.config.accountId}/cfd_tunnel/${tunnel.id}`
      );

      console.log(`✅ Tunnel supprimé de Cloudflare`);

      // Nettoyer les fichiers locaux
      try {
        execSync(`sudo rm -f /etc/cloudflared/${tunnel.id}.json`);
        console.log(`✅ Credentials supprimés`);
      } catch (e) {}

      // Retirer de la config locale
      this.config.tunnels = this.config.tunnels.filter(t => t.id !== tunnel.id);
      this.saveConfig();

      console.log(`✅ Tunnel "${tunnel.name}" supprimé`);

    } catch (error) {
      console.error(`❌ Erreur: ${error.message}`);
      throw error;
    }
  }

  // Afficher le statut
  async status() {
    try {
      const status = execSync('sudo systemctl status cloudflared', { encoding: 'utf8' });
      console.log(status);
    } catch (error) {
      console.log('Service cloudflared non actif');
    }
  }

  // Afficher les logs
  logs() {
    try {
      execSync('sudo journalctl -u cloudflared -n 50 --no-pager', { stdio: 'inherit' });
    } catch (error) {
      console.error('Impossible de lire les logs');
    }
  }
}

// CLI
async function main() {
  const manager = new CloudflareTunnelManager();
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'configure':
        // Usage: node cloudflare-tunnel-manager.js configure <accountId> <apiToken> <email>
        if (args.length < 4) {
          console.log('Usage: configure <accountId> <apiToken> <email>');
          process.exit(1);
        }
        manager.configure(args[1], args[2], args[3]);
        break;

      case 'create':
        // Usage: node cloudflare-tunnel-manager.js create <name> <hostname> [port]
        if (args.length < 3) {
          console.log('Usage: create <name> <hostname> [port]');
          console.log('Exemple: create photo-app photo.example.com 9999');
          process.exit(1);
        }
        await manager.createTunnel(args[1], args[2], args[3] || 9999);
        break;

      case 'list':
        await manager.listTunnels();
        break;

      case 'delete':
        // Usage: node cloudflare-tunnel-manager.js delete <name|id>
        if (args.length < 2) {
          console.log('Usage: delete <name|id>');
          process.exit(1);
        }
        await manager.deleteTunnel(args[1]);
        break;

      case 'status':
        await manager.status();
        break;

      case 'logs':
        manager.logs();
        break;

      default:
        console.log(`
🌐 Cloudflare Tunnel Manager

Usage:
  configure <accountId> <apiToken> <email>  - Configurer les credentials API
  create <name> <hostname> [port]           - Créer un nouveau tunnel
  list                                      - Lister tous les tunnels
  delete <name|id>                          - Supprimer un tunnel
  status                                    - Voir le statut du service
  logs                                      - Voir les logs

Exemples:
  node cloudflare-tunnel-manager.js configure abc123 token_xyz email@example.com
  node cloudflare-tunnel-manager.js create photo-app photo.example.com 9999
  node cloudflare-tunnel-manager.js list
  node cloudflare-tunnel-manager.js delete photo-app
  node cloudflare-tunnel-manager.js status
  node cloudflare-tunnel-manager.js logs
        `);
    }
  } catch (error) {
    console.error(`\n❌ Erreur: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = CloudflareTunnelManager;
