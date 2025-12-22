import nodemailer from 'nodemailer';
import mjml2html from 'mjml';
import dotenv from 'dotenv';

dotenv.config();

// Configure Mailjet SMTP transporter
const transporter = nodemailer.createTranser({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Base template wrapper for all emails
function getEmailWrapper(content, title) {
  return `
    <mjml>
      <mj-head>
        <mj-title>${title}</mj-title>
        <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
        <mj-attributes>
          <mj-all font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" />
          <mj-text font-size="16px" color="#334155" line-height="1.7" />
          <mj-section padding="0" />
        </mj-attributes>
        <mj-style>
          .button-primary {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            border-radius: 12px;
            color: white !important;
            text-decoration: none;
            padding: 18px 40px;
            display: inline-block;
            font-weight: 600;
            font-size: 17px;
            box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5), 0 8px 10px -6px rgba(99, 102, 241, 0.4);
            letter-spacing: 0.3px;
          }
          .button-success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 12px;
            color: white !important;
            text-decoration: none;
            padding: 18px 40px;
            display: inline-block;
            font-weight: 600;
            font-size: 17px;
            box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.5), 0 8px 10px -6px rgba(16, 185, 129, 0.4);
            letter-spacing: 0.3px;
          }
          .code-box {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-left: 4px solid #6366f1;
            border-radius: 10px;
            padding: 20px 24px;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', 'Droid Sans Mono', 'Source Code Pro', monospace;
            font-size: 15px;
            color: #1e293b;
            letter-spacing: 0.5px;
            font-weight: 600;
          }
          .info-box {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-radius: 12px;
            padding: 24px;
            border: 2px solid #93c5fd;
          }
          .warning-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-radius: 12px;
            padding: 24px;
            border: 2px solid #fbbf24;
          }
          .emoji-header {
            font-size: 64px;
            line-height: 1;
            text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        </mj-style>
      </mj-head>
      <mj-body background-color="#f1f5f9">
        <!-- Header avec gradient et image de fond -->
        <mj-section padding="0">
          <mj-column>
            <mj-image
              src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=200&fit=crop&q=80"
              alt="Photo Manager Header"
              padding="0"
            />
          </mj-column>
        </mj-section>
        
        <!-- Logo et titre overlay sur l'image -->
        <mj-section padding="0" background-color="transparent" css-class="header-overlay">
          <mj-column>
            <mj-spacer height="40px" />
            <mj-text align="center" padding="0" css-class="emoji-header">
              📸
            </mj-text>
            <mj-text align="center" font-size="42px" font-weight="800" color="#1e293b" padding="16px 0 8px" letter-spacing="-0.5px">
              Photo Manager
            </mj-text>
            <mj-text align="center" font-size="16px" color="#64748b" padding="0 0 20px" font-weight="500">
              Gestion professionnelle de vos photos et souvenirs
            </mj-text>
          </mj-column>
        </mj-section>

        ${content}

        <!-- Footer moderne -->
        <mj-section padding="40px 20px 20px">
          <mj-column>
            <mj-divider border-color="#e2e8f0" border-width="2px" padding="0 0 32px" />
            
            <mj-text align="center" font-size="14px" color="#64748b" padding="0 0 16px" font-weight="500">
              <strong style="color: #1e293b;">Photo Manager</strong> • Votre solution de gestion de photos
            </mj-text>
            
            <mj-text align="center" font-size="13px" color="#94a3b8" padding="0 0 8px">
              © ${new Date().getFullYear()} Photo Manager. Tous droits réservés.
            </mj-text>
            
            <mj-text align="center" font-size="12px" color="#cbd5e1" padding="0">
              Cet email a été envoyé depuis une adresse automatique. Merci de ne pas y répondre.
            </mj-text>
            
            <mj-spacer height="20px" />
            
            <mj-social font-size="15px" icon-size="32px" mode="horizontal" padding="0" align="center">
              <mj-social-element name="web" href="https://photo-v1.c9.ooo.ovh" background-color="#6366f1">
              </mj-social-element>
            </mj-social>
          </mj-column>
        </mj-section>
        
        <mj-section padding="20px">
          <mj-column>
            <mj-text align="center" font-size="11px" color="#cbd5e1" padding="0">
              Photo Manager • https://photo-v1.c9.ooo.ovh
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `;
}

// Template Reset Password amélioré
function getResetPasswordTemplate(resetLink, userName) {
  const content = `
    <!-- Main Content Card -->
    <mj-section padding="20px">
      <mj-column>
        <mj-section background-color="#ffffff" border-radius="16px" padding="48px 40px">
          <!-- Icon animé -->
          <mj-section padding="0 0 32px">
            <mj-column>
              <mj-text align="center" padding="0" css-class="emoji-header" font-size="72px">
                🔐
              </mj-text>
            </mj-column>
          </mj-section>

          <!-- Titre principal -->
          <mj-section padding="0 0 20px">
            <mj-column>
              <mj-text align="center" font-size="32px" font-weight="700" color="#1e293b" padding="0" line-height="1.2">
                Réinitialisation de mot de passe
              </mj-text>
            </mj-column>
          </mj-section>

          <!-- Salutation -->
          <mj-section padding="0 0 32px">
            <mj-column>
              <mj-text align="center" font-size="18px" color="#64748b" padding="0" font-weight="500">
                Bonjour <strong style="color:#1e293b;">${userName}</strong>,
              </mj-text>
            </mj-column>
          </mj-section>

          <!-- Message principal -->
          <mj-section padding="0 0 36px">
            <mj-column>
              <mj-text align="center" padding="0" line-height="1.8">
                Vous avez demandé à réinitialiser votre mot de passe pour votre compte <strong>Photo Manager</strong>.
              </mj-text>
              <mj-text align="center" padding="16px 0 0" line-height="1.8">
                Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé.
              </mj-text>
            </mj-column>
          </mj-section>

          <!-- Bouton CTA principal -->
          <mj-section padding="0 0 36px">
            <mj-column>
              <mj-button href="${resetLink}" css-class="button-primary" inner-padding="18px 48px">
                🔑 Réinitialiser mon mot de passe
              </mj-button>
            </mj-column>
          </mj-section>

          <!-- Lien alternatif dans une box -->
          <mj-section padding="0 0 36px">
            <mj-column>
              <mj-text align="center" font-size="14px" color="#64748b" padding="0 0 16px" font-weight="500">
                Ou copiez-collez ce lien dans votre navigateur :
              </mj-text>
              <mj-text align="center" padding="0" css-class="code-box">
                ${resetLink}
              </mj-text>
            </mj-column>
          </mj-section>

          <mj-section padding="0">
            <mj-column>
              <mj-divider border-color="#e2e8f0" border-width="2px" padding="0 0 32px" />
            </mj-column>
          </mj-section>

          <!-- Warning box -->
          <mj-section padding="0">
            <mj-column>
              <mj-text padding="0" css-class="warning-box">
                <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #92400e;">
                  ⚠️ Important à savoir
                </p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #78350f;">
                  <strong>• Ce lien expire dans 1 heure</strong> pour votre sécurité
                </p>
                <p style="margin: 0; font-size: 14px; color: #78350f;">
                  • Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité
                </p>
              </mj-text>
            </mj-column>
          </mj-section>

        </mj-section>
      </mj-column>
    </mj-section>
  `;

  const mjmlTemplate = getEmailWrapper(content, 'Réinitialisation de mot de passe - Photo Manager');
  const { html, errors } = mjml2html(mjmlTemplate);

  if (errors && errors.length > 0) {
    console.error('MJML errors:', errors);
  }

  return html;
}

// Template Welcome Email amélioré
function getWelcomeTemplate(loginLink, email, temporaryPassword, userName) {
  const content = `
    <!-- Main Content Card -->
    <mj-section padding="20px">
      <mj-column>
        <mj-section background-color="#ffffff" border-radius="16px" padding="48px 40px">
          <!-- Icon célébration -->
          <mj-section padding="0 0 32px">
            <mj-column>
              <mj-text align="center" padding="0" css-class="emoji-header" font-size="72px">
                🎉
              </mj-text>
            </mj-column>
          </mj-section>

          <!-- Titre principal -->
          <mj-section padding="0 0 20px">
            <mj-column>
              <mj-text align="center" font-size="32px" font-weight="700" color="#1e293b" padding="0" line-height="1.2">
                Bienvenue sur Photo Manager !
              </mj-text>
            </mj-column>
          </mj-section>

          <!-- Salutation -->
          <mj-section padding="0 0 32px">
            <mj-column>
              <mj-text align="center" font-size="18px" color="#64748b" padding="0" font-weight="500">
                Bonjour <strong style="color:#1e293b;">${userName}</strong>,
              </mj-text>
            </mj-column>
          </mj-section>

          <!-- Message principal -->
          <mj-section padding="0 0 36px">
            <mj-column>
              <mj-text align="center" padding="0" line-height="1.8">
                Votre compte <strong>Photo Manager</strong> a été créé avec succès ! 🎊
              </mj-text>
              <mj-text align="center" padding="16px 0 0" line-height="1.8">
                Vous pouvez maintenant vous connecter et commencer à gérer vos photos avec notre plateforme professionnelle.
              </mj-text>
            </mj-column>
          </mj-section>

          <!-- Info box avec credentials -->
          <mj-section padding="0 0 36px">
            <mj-column>
              <mj-text padding="0" css-class="info-box">
                <p style="margin: 0 0 20px 0; font-size: 16px; font-weight: 600; color: #1e40af;">
                  🔑 Vos identifiants de connexion
                </p>
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #1e40af;">
                  <strong>Email :</strong>
                </p>
                <p style="margin: 0 0 20px 0; font-family: 'SF Mono', Monaco, monospace; font-size: 15px; color: #1e293b; background: white; padding: 12px 16px; border-radius: 8px; font-weight: 600;">
                  ${email}
                </p>
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #1e40af;">
                  <strong>Mot de passe temporaire :</strong>
                </p>
                <p style="margin: 0; font-family: 'SF Mono', Monaco, monospace; font-size: 18px; color: #1e293b; background: white; padding: 16px 20px; border-radius: 8px; font-weight: 700; letter-spacing: 2px;">
                  ${temporaryPassword}
                </p>
              </mj-text>
            </mj-column>
          </mj-section>

          <!-- Bouton CTA principal -->
          <mj-section padding="0 0 36px">
            <mj-column>
              <mj-button href="${loginLink}" css-class="button-success" inner-padding="18px 48px">
                🚀 Se connecter maintenant
              </mj-button>
            </mj-column>
          </mj-section>

          <!-- Lien alternatif -->
          <mj-section padding="0 0 36px">
            <mj-column>
              <mj-text align="center" font-size="14px" color="#64748b" padding="0 0 16px" font-weight="500">
                Ou accédez directement à :
              </mj-text>
              <mj-text align="center" padding="0" css-class="code-box">
                ${loginLink}
              </mj-text>
            </mj-column>
          </mj-section>

          <mj-section padding="0">
            <mj-column>
              <mj-divider border-color="#e2e8f0" border-width="2px" padding="0 0 32px" />
            </mj-column>
          </mj-section>

          <!-- Recommandation sécurité -->
          <mj-section padding="0">
            <mj-column>
              <mj-text padding="0" css-class="warning-box">
                <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #92400e;">
                  🔒 Recommandation de sécurité
                </p>
                <p style="margin: 0; font-size: 14px; color: #78350f; line-height: 1.6;">
                  Pour votre sécurité, nous vous recommandons fortement de <strong>changer ce mot de passe temporaire</strong> lors de votre première connexion.
                </p>
              </mj-text>
            </mj:column>
          </mj-section>

          <!-- Features highlights -->
          <mj-section padding="32px 0 0">
            <mj-column>
              <mj-text align="center" font-size="18px" font-weight="600" color="#1e293b" padding="0 0 24px">
                ✨ Ce que vous pouvez faire
              </mj-text>
            </mj-column>
          </mj-section>

          <mj-section padding="0">
            <mj-column>
              <mj-text padding="0 0 16px" font-size="15px">
                📤 <strong style="color: #1e293b;">Upload de photos</strong><br/>
                <span style="color: #64748b;">Téléchargez vos photos facilement</span>
              </mj-text>
              <mj-text padding="0 0 16px" font-size="15px">
                🤖 <strong style="color: #1e293b;">Tags automatiques IA</strong><br/>
                <span style="color: #64748b;">Intelligence artificielle pour organiser vos photos</span>
              </mj-text>
              <mj-text padding="0 0 16px" font-size="15px">
                🔍 <strong style="color: #1e293b;">Recherche avancée</strong><br/>
                <span style="color: #64748b;">Trouvez vos photos instantanément</span>
              </mj-text>
              <mj-text padding="0" font-size="15px">
                📥 <strong style="color: #1e293b;">Téléchargement</strong><br/>
                <span style="color: #64748b;">Récupérez vos photos en haute qualité</span>
              </mj-text>
            </mj-column>
          </mj-section>

        </mj-section>
      </mj-column>
    </mj-section>
  `;

  const mjmlTemplate = getEmailWrapper(content, 'Bienvenue sur Photo Manager !');
  const { html, errors } = mjml2html(mjmlTemplate);

  if (errors && errors.length > 0) {
    console.error('MJML errors:', errors);
  }

  return html;
}

// Template pour email de test
function getTestEmailTemplate(recipientEmail, testMessage) {
  const content = `
    <!-- Main Content Card -->
    <mj-section padding="20px">
      <mj-column>
        <mj-section background-color="#ffffff" border-radius="16px" padding="48px 40px">
          <!-- Icon test -->
          <mj-section padding="0 0 32px">
            <mj-column>
              <mj-text align="center" padding="0" css-class="emoji-header" font-size="72px">
                ✉️
              </mj-text>
            </mj-column>
          </mj-section>

          <!-- Titre -->
          <mj-section padding="0 0 20px">
            <mj-column>
              <mj-text align="center" font-size="32px" font-weight="700" color="#1e293b" padding="0" line-height="1.2">
                Email de Test
              </mj-text>
            </mj-column>
          </mj-section>

          <!-- Message -->
          <mj-section padding="0 0 32px">
            <mj-column>
              <mj-text align="center" font-size="18px" color="#64748b" padding="0" line-height="1.8">
                Félicitations ! Votre configuration email fonctionne parfaitement. 🎉
              </mj-text>
            </mj-column>
          </mj-section>

          <!-- Info box -->
          <mj-section padding="0 0 32px">
            <mj-column>
              <mj-text padding="0" css-class="info-box">
                <p style="margin: 0 0 12px 0; font-size="16px" font-weight: 600; color: #1e40af;">
                  📋 Informations de test
                </p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af;">
                  <strong>Email destinataire :</strong> ${recipientEmail}
                </p>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e40af;">
                  <strong>Date d'envoi :</strong> ${new Date().toLocaleString('fr-FR')}
                </p>
                <p style="margin: 0 0 16px 0; font-size: 14px; color: #1e40af;">
                  <strong>Service :</strong> Mailjet SMTP
                </p>
                ${testMessage ? `
                <p style="margin: 16px 0 0 0; padding-top: 16px; border-top: 2px solid #93c5fd; font-size: 14px; color: #1e293b;">
                  <strong>Message :</strong><br/>
                  ${testMessage}
                </p>
                ` : ''}
              </mj-text>
            </mj-column>
          </mj-section>

          <!-- Success message -->
          <mj-section padding="0">
            <mj-column>
              <mj-text padding="0" align="center">
                <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 12px; padding: 24px; border: 2px solid #10b981;">
                  <p style="margin: 0; font-size: 18px; font-weight: 600; color: #065f46;">
                    ✅ Configuration Email Validée
                  </p>
                  <p style="margin: 12px 0 0 0; font-size: 14px; color: #047857;">
                    Tous vos emails (bienvenue, reset password, notifications) seront envoyés correctement.
                  </p>
                </div>
              </mj-text>
            </mj-column>
          </mj-section>

        </mj-section>
      </mj-column>
    </mj-section>
  `;

  const mjmlTemplate = getEmailWrapper(content, 'Test Email - Photo Manager');
  const { html, errors } = mjml2html(mjmlTemplate);

  if (errors && errors.length > 0) {
    console.error('MJML errors:', errors);
  }

  return html;
}

// Fonctions d'envoi existantes
export async function sendPasswordResetEmail(email, resetToken, userName) {
  const resetLink = `${process.env.APP_URL || 'http://localhost:9999'}/reset-password?token=${resetToken}`;
  const html = getResetPasswordTemplate(resetLink, userName);

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: '🔐 Réinitialisation de votre mot de passe - Photo Manager',
      html: html,
    });

    console.log('✅ Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw error;
  }
}

export async function sendWelcomeEmail(email, temporaryPassword, userName) {
  const loginLink = `${process.env.APP_URL || 'http://localhost:9999'}/login`;
  const html = getWelcomeTemplate(loginLink, email, temporaryPassword, userName);

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: '🎉 Bienvenue sur Photo Manager - Vos identifiants',
      html: html,
    });

    console.log('✅ Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
}

// Nouvelle fonction : Envoyer email de test
export async function sendTestEmail(email, testMessage = '') {
  const html = getTestEmailTemplate(email, testMessage);

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: '✉️ Test Email - Photo Manager',
      html: html,
    });

    console.log('✅ Test email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    throw error;
  }
}

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready');
    return true;
  } catch (error) {
    console.error('❌ Email server error:', error);
    return false;
  }
}
