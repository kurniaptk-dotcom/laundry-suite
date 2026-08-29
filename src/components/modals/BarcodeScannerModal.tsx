import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, X, Scan, Sparkles, Check, 
  RefreshCw, Flashlight, AlertCircle 
} from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
  title?: string;
  subtitle?: string;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  title = 'Scan Barcode & QR Resi / Kantong',
  subtitle = 'Arahkan kamera ke barcode struk atau stiker label kantong pakaian'
}) => {
  const [manualCode, setManualCode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      } else {
        setCameraError('Kamera tidak didukung pada browser ini.');
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Kamera belum diizinkan atau sedang digunakan aplikasi lain.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setTorchOn(false);
  };

  const toggleTorch = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        const capabilities = track.getCapabilities() as any;
        if (capabilities && capabilities.torch) {
          await track.applyConstraints({
            advanced: [{ torch: !torchOn }]
          } as any);
          setTorchOn(!torchOn);
        }
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScanSuccess(manualCode.trim().replace(/^#/, ''));
      onClose();
    }
  };

  const handleSimulateScan = (mockCode: string) => {
    onScanSuccess(mockCode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-400/30">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">{title}</h3>
              <p className="text-[10px] text-slate-400">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Viewport & Laser Scanner Animation */}
        <div className="relative bg-black h-64 flex items-center justify-center overflow-hidden">
          {cameraActive ? (
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6 text-slate-400 space-y-2">
              <Camera className="w-12 h-12 mx-auto text-slate-600 animate-pulse" />
              <p className="text-xs">{cameraError || 'Memulai viewfinder kamera...'}</p>
              <button
                type="button"
                onClick={startCamera}
                className="px-3 py-1 bg-white/15 hover:bg-white/25 rounded-xl text-white text-[11px] font-bold transition"
              >
                Coba Nyalakan Kamera Lagi
              </button>
            </div>
          )}

          {/* Target Reticle & Laser */}
          <div className="absolute inset-8 border-2 border-brand-400/80 rounded-2xl pointer-events-none flex flex-col justify-between p-2 shadow-inner">
            <div className="flex justify-between">
              <div className="w-4 h-4 border-t-2 border-l-2 border-brand-400" />
              <div className="w-4 h-4 border-t-2 border-r-2 border-brand-400" />
            </div>
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-lg shadow-red-500 animate-pulse" />
            <div className="flex justify-between">
              <div className="w-4 h-4 border-b-2 border-l-2 border-brand-400" />
              <div className="w-4 h-4 border-b-2 border-r-2 border-brand-400" />
            </div>
          </div>

          {/* Flashlight toggle if supported */}
          {cameraActive && (
            <button
              onClick={toggleTorch}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md text-white transition ${
                torchOn ? 'bg-amber-500 shadow-md shadow-amber-500/50' : 'bg-black/50 hover:bg-black/70'
              }`}
              title="Lampu Flash"
            >
              <Flashlight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Manual Input Form & Quick Test Chips */}
        <div className="p-5 space-y-4 bg-slate-50">
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Atau Ketik Nomor Resi / Kode Tag Manual:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Contoh: LS-9821 atau BAG-001"
                className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none uppercase font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Cari
              </button>
            </div>
          </form>

          {/* Quick Simulation Chips for Testing */}
          <div className="pt-2 border-t border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Simulasi Cepat (Klik untuk uji coba):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['LS-9821', 'LS-1044', 'LS-5520', 'BAG-001', 'BAG-002'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleSimulateScan(c)}
                  className="px-2.5 py-1 bg-white hover:bg-brand-50 hover:border-brand-300 border border-slate-200 rounded-lg text-[11px] font-mono font-bold text-slate-700 transition"
                >
                  #{c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
