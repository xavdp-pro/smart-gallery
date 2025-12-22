#!/usr/bin/env node

/**
 * Cloudflare Tunnel Manager v2
 * Automatisation complète des tunnels Cloudflare via API
 * 
 * Basé sur la documentation officielle:
 * https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/get-started/create-remote-tunnel-api/
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

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
      tunnels: {}
    };
  }

  saveConfig() {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2));
  }

  // Configuration initiale
  configure(accountId, apiToken) {
    this.config.accountId = accountId;
    this.config.apiToken = apiToken;
    this.saveConfig();
    console.log('✅ Configuration sauvegardée');
  }

  // Requête API Cloudflare
  apiRequest(method, endpoint, data = null) {
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
              console.error('API Error:', JSON.stringify(response.errors, null, 2));
              reject(new Error(response.errors?.[0]?.message || 'API Error'));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  }

  // Récupérer la Zone ID d'un domaine
  async getZoneId(domain) {
    // Extraire le domaine principal (ex: xavdp.pro de smart-gallery.xavdp.pro)
    const parts = domain.split('.');
    const mainDomain = parts.slice(-2).join('.');

    console.log(`🔍 Recherche de la zone pour ${mainDomain}...`);

    const zones = await this.apiRequest('GET', `/client/v4/zones?name=${mainDomain}`);

    if (!zones || zones.length === 0) {
      throw new Error(`Zone ${mainDomain} non trouvée. Vérifie que le domaine est dans ton compte Cloudflare.`);
    }

    console.log(`✅ Zone trouvée: ${zones[0].id}`);
    return zones[0].id;
  }

  // Lister les tunnels
  async listTunnels() {
    console.log('\n📋 Récupération des tunnels...\n');

    const tunnels = await this.apiRequest(
      'GET',
      `/client/v4/accounts/${this.config.accountId}/cfd_tunnel?is_deleted=false`
    );

    if (!tunnels || tunnels.length === 0) {
      console.log('Aucun tunnel trouvé.');
      return [];
    }

    tunnels.forEach(tunnel => {
      const status = tunnel.status === 'healthy' ? '🟢' : tunnel.status === 'inactive' ? '🔴' : '🟡';
      console.log(`${status} ${tunnel.name}`);
      console.log(`   ID: ${tunnel.id}`);
      console.log(`   Status: ${tunnel.status}`);
      console.log(`   Créé: ${tunnel.created_at}`);
      if (tunnel.connections && tunnel.connections.length > 0) {
        console.log(`   Connexions: ${tunnel.connections.length}`);
      }
      console.log('');
    });

    return tunnels;
  }

  // Obtenir les infos d'un tunnel
  async getTunnel(tunnelNameOrId) {
    const tunnels = await this.apiRequest(
      'GET',
      `/client/v4/accounts/${this.config.accountId}/cfd_tunnel?is_deleted=false`
    );

    const tunnel = tunnels.find(t => t.name === tunnelNameOrId || t.id === tunnelNameOrId);
    if (!tunnel) {
      throw new Error(`Tunnel "${tunnelNameOrId}" non trouvé`);
    }
    return tunnel;
  }

  // Obtenir le token d'un tunnel existant
  async getTunnelToken(tunnelId) {
    const result = await this.apiRequest(
      'GET',
      `/client/v4/accounts/${this.config.accountId}/cfd_tunnel/${tunnelId}/token`
    );
    return result;
  }

  // Obtenir la configuration d'un tunnel
  async getTunnelConfig(tunnelId) {
    try {
      const result = await this.apiRequest(
        'GET',
        `/client/v4/accounts/${this.config.accountId}/cfd_tunnel/${tunnelId}/configurations`
      );
      return result;
    } catch (e) {
      return null;
    }
  }

  // Créer un nouveau tunnel (géré à distance par Cloudflare)
  async createTunnel(name) {
    console.log(`\n🚀 Création du tunnel "${name}"...`);

    const tunnel = await this.apiRequest(
      'POST',
      `/client/v4/accounts/${this.config.accountId}/cfd_tunnel`,
      {
        name: name,
        config_src: 'cloudflare'  // Important: gestion à distance
      }
    );

    console.log(`✅ Tunnel créé: ${tunnel.id}`);
    console.log(`   Token: ${tunnel.token ? tunnel.token.substring(0, 20) + '...' : 'N/A'}`);

    // Sauvegarder dans la config locale
    this.config.tunnels[name] = {
      id: tunnel.id,
      token: tunnel.token,
      createdAt: new Date().toISOString()
    };
    this.saveConfig();

    return tunnel;
  }

  // Configurer les ingress rules d'un tunnel (hostnames)
  async configureIngress(tunnelId, ingress) {
    console.log(`\n⚙️  Configuration des ingress rules...`);

    // S'assurer qu'il y a un catch-all à la fin
    const hasDefault = ingress.some(rule => !rule.hostname);
    if (!hasDefault) {
      ingress.push({ service: 'http_status:404' });
    }

    const config = await this.apiRequest(
      'PUT',
      `/client/v4/accounts/${this.config.accountId}/cfd_tunnel/${tunnelId}/configurations`,
      {
        config: {
          ingress: ingress
        }
      }
    );

    console.log(`✅ Configuration mise à jour`);
    return config;
  }

  // Ajouter un hostname à un tunnel existant
  async addHostname(tunnelNameOrId, hostname, service, options = {}) {
    console.log(`\n🌐 Ajout du hostname "${hostname}" au tunnel...`);

    // Récupérer le tunnel
    const tunnel = await this.getTunnel(tunnelNameOrId);
    console.log(`   Tunnel: ${tunnel.name} (${tunnel.id})`);

    // Récupérer la config existante
    let existingConfig = await this.getTunnelConfig(tunnel.id);
    let existingIngress = existingConfig?.config?.ingress || [];

    // Filtrer le catch-all existant
    existingIngress = existingIngress.filter(rule => rule.hostname);

    // Vérifier si le hostname existe déjà
    const existingRule = existingIngress.find(rule => rule.hostname === hostname);
    if (existingRule) {
      console.log(`⚠️  Le hostname ${hostname} existe déjà, mise à jour...`);
      existingIngress = existingIngress.filter(rule => rule.hostname !== hostname);
    }

    // Ajouter le nouveau hostname
    const newRule = {
      hostname: hostname,
      service: service,
      originRequest: options.originRequest || {}
    };

    if (options.noTLSVerify) {
      newRule.originRequest.noTLSVerify = true;
    }

    existingIngress.push(newRule);

    // Ajouter le catch-all
    existingIngress.push({ service: 'http_status:404' });

    // Mettre à jour la configuration
    await this.apiRequest(
      'PUT',
      `/client/v4/accounts/${this.config.accountId}/cfd_tunnel/${tunnel.id}/configurations`,
      {
        config: {
          ingress: existingIngress
        }
      }
    );

    console.log(`✅ Hostname configuré dans le tunnel`);

    // Créer l'enregistrement DNS
    await this.createDNSRecord(hostname, tunnel.id);

    return tunnel;
  }

  // Créer un enregistrement DNS CNAME
  async createDNSRecord(hostname, tunnelId) {
    console.log(`\n📝 Configuration DNS pour ${hostname}...`);

    try {
      // Récupérer la zone ID
      const zoneId = await this.getZoneId(hostname);

      // Vérifier si l'enregistrement existe déjà
      const existingRecords = await this.apiRequest(
        'GET',
        `/client/v4/zones/${zoneId}/dns_records?name=${hostname}&type=CNAME`
      );

      const tunnelCname = `${tunnelId}.cfargotunnel.com`;

      if (existingRecords && existingRecords.length > 0) {
        // Mettre à jour l'enregistrement existant
        const recordId = existingRecords[0].id;
        console.log(`   Mise à jour de l'enregistrement existant...`);

        await this.apiRequest(
          'PUT',
          `/client/v4/zones/${zoneId}/dns_records/${recordId}`,
          {
            type: 'CNAME',
            name: hostname,
            content: tunnelCname,
            proxied: true,
            ttl: 1
          }
        );
      } else {
        // Créer un nouvel enregistrement
        console.log(`   Création d'un nouvel enregistrement CNAME...`);

        await this.apiRequest(
          'POST',
          `/client/v4/zones/${zoneId}/dns_records`,
          {
            type: 'CNAME',
            name: hostname,
            content: tunnelCname,
            proxied: true,
            ttl: 1
          }
        );
      }

      console.log(`✅ DNS configuré: ${hostname} → ${tunnelCname}`);
    } catch (error) {
      console.error(`⚠️  Erreur DNS: ${error.message}`);
      console.log(`   Tu peux configurer manuellement le CNAME:`);
      console.log(`   ${hostname} → ${tunnelId}.cfargotunnel.com`);
    }
  }

  // Supprimer un hostname d'un tunnel
  async removeHostname(tunnelNameOrId, hostname) {
    console.log(`\n🗑️  Suppression du hostname "${hostname}"...`);

    const tunnel = await this.getTunnel(tunnelNameOrId);
    let existingConfig = await this.getTunnelConfig(tunnel.id);
    let existingIngress = existingConfig?.config?.ingress || [];

    // Filtrer le hostname à supprimer
    const newIngress = existingIngress.filter(rule => rule.hostname !== hostname);

    if (newIngress.length === existingIngress.length) {
      console.log(`⚠️  Hostname ${hostname} non trouvé dans le tunnel`);
      return;
    }

    // S'assurer qu'il y a un catch-all
    if (!newIngress.some(rule => !rule.hostname)) {
      newIngress.push({ service: 'http_status:404' });
    }

    await this.apiRequest(
      'PUT',
      `/client/v4/accounts/${this.config.accountId}/cfd_tunnel/${tunnel.id}/configurations`,
      {
        config: {
          ingress: newIngress
        }
      }
    );

    console.log(`✅ Hostname supprimé du tunnel`);

    // Supprimer l'enregistrement DNS
    try {
      const zoneId = await this.getZoneId(hostname);
      const records = await this.apiRequest(
        'GET',
        `/client/v4/zones/${zoneId}/dns_records?name=${hostname}&type=CNAME`
      );

      if (records && records.length > 0) {
        await this.apiRequest(
          'DELETE',
          `/client/v4/zones/${zoneId}/dns_records/${records[0].id}`
        );
        console.log(`✅ Enregistrement DNS supprimé`);
      }
    } catch (e) {
      console.log(`⚠️  Impossible de supprimer l'enregistrement DNS: ${e.message}`);
    }
  }

  // Afficher les hostnames d'un tunnel
  async showHostnames(tunnelNameOrId) {
    const tunnel = await this.getTunnel(tunnelNameOrId);
    const config = await this.getTunnelConfig(tunnel.id);

    console.log(`\n📋 Hostnames du tunnel "${tunnel.name}":\n`);

    if (!config?.config?.ingress) {
      console.log('   Aucun hostname configuré');
      return;
    }

    config.config.ingress.forEach((rule, index) => {
      if (rule.hostname) {
        console.log(`   🌐 ${rule.hostname}`);
        console.log(`      Service: ${rule.service}`);
        if (rule.originRequest?.noTLSVerify) {
          console.log(`      TLS Verify: disabled`);
        }
      } else {
        console.log(`   🔒 Catch-all: ${rule.service}`);
      }
    });
  }

  // Supprimer un tunnel
  async deleteTunnel(tunnelNameOrId) {
    const tunnel = await this.getTunnel(tunnelNameOrId);

    console.log(`\n🗑️  Suppression du tunnel "${tunnel.name}"...`);

    // Nettoyer les connexions actives d'abord
    if (tunnel.connections && tunnel.connections.length > 0) {
      console.log(`   Nettoyage des connexions...`);
      await this.apiRequest(
        'DELETE',
        `/client/v4/accounts/${this.config.accountId}/cfd_tunnel/${tunnel.id}/connections`
      );
    }

    // Supprimer le tunnel
    await this.apiRequest(
      'DELETE',
      `/client/v4/accounts/${this.config.accountId}/cfd_tunnel/${tunnel.id}`
    );

    // Retirer de la config locale
    delete this.config.tunnels[tunnel.name];
    this.saveConfig();

    console.log(`✅ Tunnel "${tunnel.name}" supprimé`);
  }

  // Installer et démarrer le service cloudflared
  async installService(tunnelNameOrId) {
    const tunnel = await this.getTunnel(tunnelNameOrId);

    console.log(`\n🔧 Installation du service pour "${tunnel.name}"...`);

    // Récupérer le token
    let token;
    if (this.config.tunnels[tunnel.name]?.token) {
      token = this.config.tunnels[tunnel.name].token;
    } else {
      token = await this.getTunnelToken(tunnel.id);
    }

    if (!token) {
      throw new Error('Token non trouvé. Le tunnel doit être créé avec config_src: cloudflare');
    }

    console.log(`   Token récupéré`);

    // Arrêter le service existant si présent
    try {
      execSync('sudo systemctl stop cloudflared 2>/dev/null || true', { stdio: 'pipe' });
      execSync('sudo cloudflared service uninstall 2>/dev/null || true', { stdio: 'pipe' });
    } catch (e) { }

    // Installer le nouveau service
    console.log(`   Installation du service...`);
    execSync(`sudo cloudflared service install ${token}`, { stdio: 'inherit' });

    // Démarrer le service
    console.log(`   Démarrage du service...`);
    execSync('sudo systemctl enable cloudflared', { stdio: 'pipe' });
    execSync('sudo systemctl start cloudflared', { stdio: 'pipe' });

    console.log(`✅ Service installé et démarré`);

    // Vérifier le statut
    setTimeout(() => {
      try {
        const status = execSync('sudo systemctl is-active cloudflared', { encoding: 'utf8' }).trim();
        if (status === 'active') {
          console.log(`✅ Service actif`);
        } else {
          console.log(`⚠️  Service status: ${status}`);
        }
      } catch (e) {
        console.log(`⚠️  Vérification du statut échouée`);
      }
    }, 2000);
  }

  // Afficher le statut du service
  status() {
    try {
      execSync('sudo systemctl status cloudflared --no-pager', { stdio: 'inherit' });
    } catch (e) {
      console.log('Service cloudflared non actif ou non installé');
    }
  }

  // Afficher les logs
  logs(lines = 50) {
    try {
      execSync(`sudo journalctl -u cloudflared -n ${lines} --no-pager`, { stdio: 'inherit' });
    } catch (e) {
      console.log('Impossible de lire les logs');
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
        if (args.length < 3) {
          console.log('Usage: configure <accountId> <apiToken>');
          process.exit(1);
        }
        manager.configure(args[1], args[2]);
        break;

      case 'list':
        await manager.listTunnels();
        break;

      case 'create':
        if (args.length < 2) {
          console.log('Usage: create <tunnelName>');
          process.exit(1);
        }
        await manager.createTunnel(args[1]);
        break;

      case 'add-hostname':
        // add-hostname <tunnel> <hostname> <service> [--no-tls-verify]
        if (args.length < 4) {
          console.log('Usage: add-hostname <tunnel> <hostname> <service> [--no-tls-verify]');
          console.log('Exemple: add-hostname c7 smart-gallery.xavdp.pro http://localhost:9999 --no-tls-verify');
          process.exit(1);
        }
        const noTLSVerify = args.includes('--no-tls-verify');
        await manager.addHostname(args[1], args[2], args[3], { noTLSVerify });
        break;

      case 'remove-hostname':
        if (args.length < 3) {
          console.log('Usage: remove-hostname <tunnel> <hostname>');
          process.exit(1);
        }
        await manager.removeHostname(args[1], args[2]);
        break;

      case 'hostnames':
        if (args.length < 2) {
          console.log('Usage: hostnames <tunnel>');
          process.exit(1);
        }
        await manager.showHostnames(args[1]);
        break;

      case 'delete':
        if (args.length < 2) {
          console.log('Usage: delete <tunnelName>');
          process.exit(1);
        }
        await manager.deleteTunnel(args[1]);
        break;

      case 'install':
        if (args.length < 2) {
          console.log('Usage: install <tunnel>');
          process.exit(1);
        }
        await manager.installService(args[1]);
        break;

      case 'status':
        manager.status();
        break;

      case 'logs':
        manager.logs(args[1] || 50);
        break;

      default:
        console.log(`
🌐 Cloudflare Tunnel Manager v2

Usage:
  configure <accountId> <apiToken>              - Configurer les credentials API
  list                                          - Lister tous les tunnels
  create <tunnelName>                           - Créer un nouveau tunnel
  add-hostname <tunnel> <hostname> <service>    - Ajouter un hostname à un tunnel
  remove-hostname <tunnel> <hostname>           - Supprimer un hostname
  hostnames <tunnel>                            - Afficher les hostnames d'un tunnel
  delete <tunnelName>                           - Supprimer un tunnel
  install <tunnel>                              - Installer le service cloudflared
  status                                        - Voir le statut du service
  logs [lines]                                  - Voir les logs

Exemples:
  # Configuration initiale
  node cf-tunnel.cjs configure b2cc670177cfa83dc058e83375a4df49 z15vIgyK_xxx

  # Lister les tunnels
  node cf-tunnel.cjs list

  # Ajouter un hostname au tunnel c7
  node cf-tunnel.cjs add-hostname c7 smart-gallery.xavdp.pro http://localhost:9999 --no-tls-verify

  # Voir les hostnames du tunnel c7
  node cf-tunnel.cjs hostnames c7

  # Supprimer un hostname
  node cf-tunnel.cjs remove-hostname c7 smart-gallery.xavdp.pro

  # Installer le service pour un tunnel
  node cf-tunnel.cjs install c7

  # Voir le statut
  node cf-tunnel.cjs status
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
