import nodemailer from 'nodemailer';
import mjml2html from 'mjml';
import dotenv from 'dotenv';

dotenv.config();

// Configure Mailjet SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// MJML Template for password reset email
function getResetPasswordTemplate(resetLink, userName) {
  const mjmlTemplate = `
    <mjml>
      <mj-head>
        <mj-title>Réinitialisation de votre mot de passe</mj-title>
        <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
        <mj-attributes>
          <mj-all font-family="Inter, Arial, sans-serif" />
          <mj-text font-size="16px" color="#334155" line-height="1.6" />
          <mj-section padding="0" />
        </mj-attributes>
        <mj-style>
          .button {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            border-radius: 12px;
            color: white !important;
            text-decoration: none;
            padding: 18px 36px;
            display: inline-block;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4), 0 8px 10px -6px rgba(99, 102, 241, 0.3);
            transition: all 0.3s ease;
          }
          .button:hover {
            box-shadow: 0 20px 30px -10px rgba(99, 102, 241, 0.5);
            transform: translateY(-2px);
          }
          .code-box {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border-left: 4px solid #6366f1;
            border-radius: 8px;
            padding: 16px 20px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: #1e293b;
            letter-spacing: 0.5px;
          }
          .footer-link {
            color: #64748b;
            text-decoration: none;
          }
        </mj-style>
      </mj-head>
      <mj-body background-color="#f1f5f9">
        <!-- Header -->
        <mj-section padding="40px 20px 20px">
          <mj-column>
            <mj-text align="center" font-size="32px" font-weight="700" color="#1e293b" padding="0">
              📸 Photo Manager
            </mj-text>
          </mj-column>
        </mj-section>

        <!-- Main Content -->
        <mj-section padding="20px">
          <mj-column>
            <mj-wrapper background-color="#ffffff" border-radius="12px" padding="40px">
              <!-- Icon -->
              <mj-section padding="0 0 24px">
                <mj-column>
                  <mj-text align="center" font-size="48px" padding="0">
                    🔐
                  </mj-text>
                </mj-column>
              </mj-section>

              <!-- Title -->
              <mj-section padding="0 0 16px">
                <mj-column>
                  <mj-text align="center" font-size="24px" font-weight="700" color="#1e293b" padding="0">
                    Réinitialisation de mot de passe
                  </mj-text>
                </mj-column>
              </mj-section>

              <!-- Greeting -->
              <mj-section padding="0 0 24px">
                <mj-column>
                  <mj-text align="center" color="#64748b" padding="0">
                    Bonjour ${userName},
                  </mj-text>
                </mj-column>
              </mj-section>

              <!-- Message -->
              <mj-section padding="0 0 32px">
                <mj-column>
                  <mj-text padding="0">
                    Vous avez demandé à réinitialiser votre mot de passe pour votre compte Photo Manager. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
                  </mj-text>
                </mj-column>
              </mj-section>

              <!-- Button -->
              <mj-section padding="0 0 32px">
                <mj-column>
                  <mj-button href="${resetLink}" css-class="button" padding="0">
                    Réinitialiser mon mot de passe
                  </mj-button>
                </mj-column>
              </mj-section>

              <!-- Link alternative -->
              <mj-section padding="0 0 24px">
                <mj-column>
                  <mj-text align="center" font-size="14px" color="#64748b" padding="0">
                    Ou copiez ce lien dans votre navigateur :
                  </mj-text>
                  <mj-text align="center" font-size="12px" color="#3b82f6" padding="8px 0 0" line-height="1.4">
                    ${resetLink}
                  </mj-text>
                </mj-column>
              </mj-section>

              <!-- Divider -->
              <mj-section padding="24px 0">
                <mj-column>
                  <mj-divider border-color="#e2e8f0" border-width="1px" />
                </mj-column>
              </mj-section>

              <!-- Warning -->
              <mj-section padding="0">
                <mj-column>
                  <mj-text font-size="14px" color="#64748b" padding="0">
                    ⚠️ <strong>Ce lien expire dans 1 heure.</strong>
                  </mj-text>
                  <mj-text font-size="14px" color="#64748b" padding="8px 0 0">
                    Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe actuel ne sera pas modifié.
                  </mj-text>
                </mj-column>
              </mj-section>
            </mj-wrapper>
          </mj-column>
        </mj-section>

        <!-- Footer -->
        <mj-section padding="20px">
          <mj-column>
            <mj-text align="center" font-size="14px" color="#94a3b8" padding="0">
              © ${new Date().getFullYear()} Photo Manager. Tous droits réservés.
            </mj-text>
            <mj-text align="center" font-size="12px" color="#94a3b8" padding="8px 0 0">
              Cet email a été envoyé depuis une adresse automatique. Merci de ne pas y répondre.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `;

  const { html, errors } = mjml2html(mjmlTemplate);

  if (errors && errors.length > 0) {
    console.error('MJML errors:', errors);
  }

  return html;
}

// MJML Template for welcome email (when admin creates a user)
function getWelcomeTemplate(loginLink, email, temporaryPassword, userName) {
  const mjmlTemplate = `
    <mjml>
      <mj-head>
        <mj-title>Bienvenue sur Photo Manager</mj-title>
        <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
        <mj-attributes>
          <mj-all font-family="Inter, Arial, sans-serif" />
          <mj-text font-size="16px" color="#334155" line-height="1.6" />
          <mj-section padding="0" />
        </mj-attributes>
        <mj-style>
          .button {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 8px;
            color: white !important;
            text-decoration: none;
            padding: 16px 32px;
            display: inline-block;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
          }
          .credential-box {
            background: #f1f5f9;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
          }
        </mj-style>
      </mj-head>
      <mj-body background-color="#f8fafc">
        <!-- Header -->
        <mj-section padding="40px 20px 20px">
          <mj-column>
            <mj-text align="center" font-size="32px" font-weight="700" color="#1e293b" padding="0">
              📸 Photo Manager
            </mj-text>
          </mj-column>
        </mj-section>

        <!-- Main Content -->
        <mj-section padding="20px">
          <mj-column>
            <mj-wrapper background-color="#ffffff" border-radius="12px" padding="40px">
              <!-- Icon -->
              <mj-section padding="0 0 24px">
                <mj-column>
                  <mj-text align="center" font-size="48px" padding="0">
                    🎉
                  </mj-text>
                </mj-column>
              </mj-section>

              <!-- Title -->
              <mj-section padding="0 0 16px">
                <mj-column>
                  <mj-text align="center" font-size="24px" font-weight="700" color="#1e293b" padding="0">
                    Bienvenue sur Photo Manager !
                  </mj-text>
                </mj-column>
              </mj-section>

              <!-- Greeting -->
              <mj-section padding="0 0 24px">
                <mj-column>
                  <mj-text align="center" color="#64748b" padding="0">
                    Bonjour ${userName},
                  </mj-text>
                </mj-column>
              </mj-section>

              <!-- Message -->
              <mj-section padding="0 0 24px">
                <mj-column>
                  <mj-text padding="0">
                    Un compte a été créé pour vous sur Photo Manager, votre gestionnaire de photos avec intelligence artificielle. Voici vos identifiants de connexion :
                  </mj-text>
                </mj-column>
              </mj-section>

              <!-- Credentials Box -->
              <mj-section padding="0 0 24px">
                <mj-column>
                  <mj-wrapper background-color="#f1f5f9" border-radius="8px" padding="20px">
                    <mj-section padding="0">
                      <mj-column>
                        <mj-text padding="0" font-size="14px" color="#64748b" font-weight="600">
                          Email
                        </mj-text>
                        <mj-text padding="4px 0 0" font-family="monospace" color="#1e293b">
                          ${email}
                        </mj-text>
                      </mj-column>
                    </mj-section>
                    <mj-section padding="16px 0 0">
                      <mj-column>
                        <mj-text padding="0" font-size="14px" color="#64748b" font-weight="600">
                          Mot de passe temporaire
                        </mj-text>
                        <mj-text padding="4px 0 0" font-family="monospace" color="#1e293b">
                          ${temporaryPassword}
                        </mj-text>
                      </mj-column>
                    </mj-section>
                  </mj-wrapper>
                </mj-column>
              </mj-section>

              <!-- Button -->
              <mj-section padding="0 0 24px">
                <mj-column>
                  <mj-button href="${loginLink}" css-class="button" padding="0">
                    Se connecter
                  </mj-button>
                </mj-column>
              </mj-section>

              <!-- Security notice -->
              <mj-section padding="0">
                <mj-column>
                  <mj-text font-size="14px" color="#64748b" padding="0">
                    🔒 <strong>Pour votre sécurité :</strong>
                  </mj-text>
                  <mj-text font-size="14px" color="#64748b" padding="8px 0 0">
                    Nous vous recommandons vivement de changer ce mot de passe temporaire dès votre première connexion. Vous pouvez le faire depuis votre profil ou en utilisant la fonction "Mot de passe oublié".
                  </mj-text>
                </mj-column>
              </mj-section>
            </mj-wrapper>
          </mj-column>
        </mj-section>

        <!-- Footer -->
        <mj-section padding="20px">
          <mj-column>
            <mj-text align="center" font-size="14px" color="#94a3b8" padding="0">
              © ${new Date().getFullYear()} Photo Manager. Tous droits réservés.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `;

  const { html, errors } = mjml2html(mjmlTemplate);

  if (errors && errors.length > 0) {
    console.error('MJML errors:', errors);
  }

  return html;
}

// Send password reset email
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

// Send welcome email with temporary password
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
