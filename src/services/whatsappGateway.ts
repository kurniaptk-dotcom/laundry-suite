/**
 * WhatsApp Gateway Service (Fonnte / Webhook API)
 * Allows sending automated headless WhatsApp notifications directly to customers
 * without needing manual click-to-chat links.
 */

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  status: 'sent' | 'pending' | 'failed';
  error?: string;
  provider: 'fonnte' | 'simulated' | 'direct_wa';
}

const STORAGE_KEY_TOKEN = 'ls_fonnte_token';
const STORAGE_KEY_AUTO_SEND = 'ls_wa_auto_send_enabled';

export class WhatsAppGatewayService {
  /**
   * Format Indonesian phone numbers to standard international or local formats (08xxx -> 628xxx or 08xxx)
   */
  static formatPhone(phone: string): string {
    let clean = phone.trim().replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    } else if (clean.startsWith('8')) {
      clean = '62' + clean;
    }
    return clean;
  }

  /**
   * Get active Fonnte API Token from localStorage or environment
   */
  static getToken(): string {
    try {
      const metaEnv = (import.meta as any)?.env;
      if (metaEnv && metaEnv.VITE_FONNTE_TOKEN) {
        return metaEnv.VITE_FONNTE_TOKEN;
      }
    } catch {}
    return localStorage.getItem(STORAGE_KEY_TOKEN) || '';
  }

  /**
   * Save Fonnte API Token
   */
  static setToken(token: string) {
    localStorage.setItem(STORAGE_KEY_TOKEN, token.trim());
  }

  /**
   * Check if automated background sending is enabled
   */
  static isAutoSendEnabled(): boolean {
    const saved = localStorage.getItem(STORAGE_KEY_AUTO_SEND);
    return saved === null ? true : saved === 'true';
  }

  static setAutoSendEnabled(enabled: boolean) {
    localStorage.setItem(STORAGE_KEY_AUTO_SEND, enabled ? 'true' : 'false');
  }

  /**
   * Check live connection & device status from Fonnte API
   */
  static async checkDeviceStatus(customToken?: string): Promise<{
    connected: boolean;
    device?: string;
    quota?: string;
    message: string;
  }> {
    const token = (customToken || this.getToken()).trim();
    if (!token) {
      return {
        connected: false,
        message: 'Token API Fonnte belum dikonfigurasi. Mode simulator & link wa.me aktif.',
      };
    }

    try {
      const response = await fetch('https://api.fonnte.com/device', {
        method: 'POST',
        headers: {
          Authorization: token,
        },
      });

      const data = await response.json();
      if (data && (data.status === true || data.device_status === 'connect')) {
        return {
          connected: true,
          device: data.device || data.name || 'WhatsApp Terhubung',
          quota: data.quota ? `${data.quota} pesan tersisa` : 'Aktif',
          message: `Device WhatsApp Terhubung: ${data.device || 'Online'} (${data.quota || 'Unlimited quota'})`,
        };
      }

      return {
        connected: false,
        message: data.reason || data.message || 'Device WhatsApp Fonnte sedang offline / belum scan QR.',
      };
    } catch (err: any) {
      return {
        connected: false,
        message: `Gagal menghubungi server Fonnte: ${err.message || 'Periksa koneksi internet'}`,
      };
    }
  }

  /**
   * Send WhatsApp message via Fonnte Gateway API
   */
  static async sendMessage(options: {
    target: string;
    message: string;
    customToken?: string;
  }): Promise<WhatsAppSendResult> {
    const token = (options.customToken || this.getToken()).trim();
    const formattedPhone = this.formatPhone(options.target);

    // If no token is provided, log and simulate success locally
    if (!token) {
      console.info('[WhatsApp Gateway] No Fonnte token configured. Running in Local Simulator mode for:', formattedPhone);
      return {
        success: true,
        status: 'sent',
        provider: 'simulated',
        messageId: `sim-${Date.now()}`,
      };
    }

    try {
      const formData = new FormData();
      formData.append('target', formattedPhone);
      formData.append('message', options.message);
      formData.append('countryCode', '62');

      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      const data = await response.json();

      if (data && (data.status === true || data.status === 'success' || data.id)) {
        return {
          success: true,
          status: 'sent',
          provider: 'fonnte',
          messageId: data.id?.[0] || `fonnte-${Date.now()}`,
        };
      }

      return {
        success: false,
        status: 'failed',
        provider: 'fonnte',
        error: data.reason || data.message || 'Gagal mengirim pesan via Fonnte',
      };
    } catch (err: any) {
      console.warn('[WhatsApp Gateway API Error]:', err);
      return {
        success: false,
        status: 'failed',
        provider: 'fonnte',
        error: err.message || 'Network error saat menghubungi Fonnte API',
      };
    }
  }

  /**
   * Open direct Click-to-Chat fallback link
   */
  static openDirectWhatsAppUrl(phone: string, text: string) {
    const formatted = this.formatPhone(phone);
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${formatted}?text=${encoded}`, '_blank');
  }
}
