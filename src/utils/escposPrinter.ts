/**
 * Direct Web Bluetooth ESC/POS Thermal Printer Driver for Laundry Suite
 * Supports 58mm and 80mm Bluetooth Thermal Printers (Panda, Iware, Zywell, Mini POS, etc.)
 */

export interface ThermalPrintData {
  storeName: string;
  storeAddress?: string;
  storePhone?: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  items: Array<{
    name: string;
    qty: number;
    price: number;
    subtotal: number;
    unit?: string;
  }>;
  totalAmount: number;
  paymentStatus: string;
  notes?: string;
  footerMessage?: string;
}

export class BluetoothPrinterService {
  private static device: any = null;
  private static characteristic: any = null;

  public static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  /**
   * Request Bluetooth device connection
   */
  public static async connect(): Promise<boolean> {
    if (!this.isSupported()) {
      alert('Browser ini belum mendukung Web Bluetooth API. Gunakan Google Chrome di Android, Windows, atau Mac.');
      return false;
    }

    try {
      // Common thermal printer Bluetooth Service UUIDs
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [
          { namePrefix: 'MPT' },
          { namePrefix: 'POS' },
          { namePrefix: 'RPP' },
          { namePrefix: 'MTP' },
          { namePrefix: 'Bluetooth' },
          { namePrefix: 'Printer' },
          { namePrefix: 'EP' },
        ],
        optionalServices: [
          '000018f0-0000-1000-8000-00805f9b34fb',
          'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
          '49535343-fe7d-4ae5-8fa9-9fafd205e455',
          0x18f0,
        ],
      });

      const server = await device.gatt.connect();
      const services = await server.getPrimaryServices();

      for (const service of services) {
        const characteristics = await service.getCharacteristics();
        for (const char of characteristics) {
          if (char.properties.write || char.properties.writeWithoutResponse) {
            this.device = device;
            this.characteristic = char;
            return true;
          }
        }
      }

      alert('Terhubung ke perangkat tetapi karakteristik print tidak ditemukan.');
      return false;
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        console.error('Bluetooth connection error:', err);
        alert('Gagal menghubungkan printer bluetooth: ' + (err.message || 'Koneksi dibatalkan.'));
      }
      return false;
    }
  }

  /**
   * Send ESC/POS formatted byte buffer to connected thermal printer
   */
  public static async printReceipt(data: ThermalPrintData, is80mm: boolean = false): Promise<boolean> {
    const encoder = new TextEncoder();
    const lineWidth = is80mm ? 48 : 32;

    const ESC = 0x1B;
    const GS = 0x1D;

    const commands: number[] = [];

    // Initialize Printer
    commands.push(ESC, 0x40);

    // Center Align
    commands.push(ESC, 0x61, 0x01);

    // Bold Header Store Name
    commands.push(ESC, 0x45, 0x01); // Bold ON
    commands.push(GS, 0x21, 0x11);  // Double size
    commands.push(...encoder.encode(data.storeName + '\n'));
    commands.push(GS, 0x21, 0x00);  // Normal size
    commands.push(ESC, 0x45, 0x00); // Bold OFF

    if (data.storeAddress) {
      commands.push(...encoder.encode(data.storeAddress + '\n'));
    }
    if (data.storePhone) {
      commands.push(...encoder.encode('Telp: ' + data.storePhone + '\n'));
    }

    // Divider Line
    commands.push(...encoder.encode('-'.repeat(lineWidth) + '\n'));

    // Left Align for Details
    commands.push(ESC, 0x61, 0x00);
    commands.push(...encoder.encode(`No. Nota: ${data.invoiceNumber}\n`));
    commands.push(...encoder.encode(`Tgl/Waktu: ${data.date}\n`));
    commands.push(...encoder.encode(`Pelanggan: ${data.customerName}\n`));
    if (data.customerPhone) {
      commands.push(...encoder.encode(`WhatsApp : ${data.customerPhone}\n`));
    }
    commands.push(...encoder.encode('-'.repeat(lineWidth) + '\n'));

    // Items List
    data.items.forEach(item => {
      commands.push(...encoder.encode(`${item.name}\n`));
      const qtyStr = `${item.qty} ${item.unit || 'kg'} x ${item.price.toLocaleString('id-ID')}`;
      const subStr = `Rp ${item.subtotal.toLocaleString('id-ID')}`;
      const spaceCount = Math.max(1, lineWidth - qtyStr.length - subStr.length);
      commands.push(...encoder.encode(qtyStr + ' '.repeat(spaceCount) + subStr + '\n'));
    });

    commands.push(...encoder.encode('-'.repeat(lineWidth) + '\n'));

    // Total Amount (Bold Right)
    commands.push(ESC, 0x45, 0x01);
    const totalLabel = 'TOTAL BAYAR:';
    const totalVal = `Rp ${data.totalAmount.toLocaleString('id-ID')}`;
    const totalSpaces = Math.max(1, lineWidth - totalLabel.length - totalVal.length);
    commands.push(...encoder.encode(totalLabel + ' '.repeat(totalSpaces) + totalVal + '\n'));
    commands.push(ESC, 0x45, 0x00);

    const statusLabel = 'STATUS PEMBAYARAN:';
    const statusVal = data.paymentStatus.toUpperCase();
    const statusSpaces = Math.max(1, lineWidth - statusLabel.length - statusVal.length);
    commands.push(...encoder.encode(statusLabel + ' '.repeat(statusSpaces) + statusVal + '\n'));

    // Footer
    commands.push(ESC, 0x61, 0x01); // Center
    commands.push(...encoder.encode('\n'));
    commands.push(...encoder.encode((data.footerMessage || 'Terima kasih atas kunjungan Anda!\nBarang hilang/rusak diganti sesuai ketentuan.') + '\n'));
    commands.push(...encoder.encode('Powered by Laundry Suite SaaS\n\n\n\n'));

    // Cut paper (GS V 66 0)
    commands.push(GS, 0x56, 0x42, 0x00);

    const uint8Array = new Uint8Array(commands);

    // If connected via Bluetooth characteristic, write chunks
    if (this.characteristic) {
      try {
        const chunkSize = 100;
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.slice(i, i + chunkSize);
          await this.characteristic.writeValue(chunk);
        }
        return true;
      } catch (err) {
        console.error('Bluetooth print write error:', err);
      }
    }

    // Fallback: Web Print dialog
    window.print();
    return true;
  }
}
