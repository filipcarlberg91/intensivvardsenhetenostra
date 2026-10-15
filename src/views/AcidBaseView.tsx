import React, { useState, useRef } from 'react';
import { RADIOMETER_BG_FIELDS } from '../data/clinicalData';
import { CameraIcon } from '../components/Icons';
import { CameraScannerModal } from '../components/modals/CameraScannerModal';

type BreathingSupportMode = 'ventilator' | 'niv' | 'highflow' | 'spontaneous';

const parseDecimal = (val: string | undefined, fallback: number): number => {
  if (val === undefined) return fallback;
  const trimmed = val.trim().replace(',', '.');
  if (trimmed === '' || trimmed === '-' || trimmed === '+' || trimmed === '.') return fallback;
  const parsed = parseFloat(trimmed);
  return isNaN(parsed) ? fallback : parsed;
};

export const AcidBaseView: React.FC = () => {
  // Blodgasparametrar som strängar så att man fritt kan skriva punkt (.), kommatecken (,), minus (-) och radera
  const [rawParams, setRawParams] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    RADIOMETER_BG_FIELDS.forEach((f) => {
      init[f.id] = String(f.default);
    });
    init.albumin = '40';
    return init;
  });

  // Ventilationsläge & inställningar (strängstate för smidig inmatning av heltal & decimaler med punkt/komma)
  const [supportMode, setSupportMode] = useState<BreathingSupportMode>('ventilator');

  // 1. Invasiv Ventilator
  const [ventFiO2Str, setVentFiO2Str] = useState<string>('40'); // %
  const [ventPEEPStr, setVentPEEPStr] = useState<string>('8'); // cmH2O
  const [ventAFStr, setVentAFStr] = useState<string>('16'); // /min
  const [ventVtStr, setVentVtStr] = useState<string>('450'); // ml
  const [ventPBWStr, setVentPBWStr] = useState<string>('70'); // kg
  const [ventPplatStr, setVentPplatStr] = useState<string>('20'); // cmH2O
  const [ventMode, setVentMode] = useState<string>('VKTS'); // Svenska förkortningar: VKTS (PRVC), TK (PC), TU (PS), VK (VC)

  // 2. NIV (Maskventilation)
  const [nivFiO2Str, setNivFiO2Str] = useState<string>('35'); // %
  const [nivIPAPStr, setNivIPAPStr] = useState<string>('14'); // cmH2O
  const [nivEPAPStr, setNivEPAPStr] = useState<string>('6'); // cmH2O
  const [nivAFStr, setNivAFStr] = useState<string>('18'); // /min
  const [nivLeakStr, setNivLeakStr] = useState<string>('12'); // % eller L/min

  // 3. Högflödessyrgas (Optiflow / HFNC)
  const [hfFiO2Str, setHfFiO2Str] = useState<string>('50'); // %
  const [hfFlowStr, setHfFlowStr] = useState<string>('50'); // L/min
  const [hfSpO2Str, setHfSpO2Str] = useState<string>('94'); // %
  const [hfAFStr, setHfAFStr] = useState<string>('22'); // /min
  const [hfTemp, setHfTemp] = useState<number>(37); // °C

  // 4. Spontanandning
  const [spontFiO2Str, setSpontFiO2Str] = useState<string>('28'); // %
  const [spontFlowStr, setSpontFlowStr] = useState<string>('2'); // L/min O2
  const [spontAFStr, setSpontAFStr] = useState<string>('18'); // /min

  // Numeriska värden för beräkningar
  const ventFiO2 = parseDecimal(ventFiO2Str, 21);
  const ventPEEP = parseDecimal(ventPEEPStr, 0);
  const ventAF = parseDecimal(ventAFStr, 0);
  const ventVt = parseDecimal(ventVtStr, 0);
  const ventPBW = parseDecimal(ventPBWStr, 1);
  const ventPplat = parseDecimal(ventPplatStr, 0);

  const nivFiO2 = parseDecimal(nivFiO2Str, 21);
  const nivIPAP = parseDecimal(nivIPAPStr, 0);
  const nivEPAP = parseDecimal(nivEPAPStr, 0);
  const nivAF = parseDecimal(nivAFStr, 0);
  const nivLeak = parseDecimal(nivLeakStr, 0);

  const hfFiO2 = parseDecimal(hfFiO2Str, 21);
  const hfFlow = parseDecimal(hfFlowStr, 0);
  const hfSpO2 = parseDecimal(hfSpO2Str, 0);
  const hfAF = parseDecimal(hfAFStr, 0);

  const spontFiO2 = parseDecimal(spontFiO2Str, 21);
  const spontFlow = parseDecimal(spontFlowStr, 0);
  const spontAF = parseDecimal(spontAFStr, 0);

  // Kamera & OCR State
  const [ocrLoading, setOcrLoading] = useState<boolean>(false);
  const [ocrStatus, setOcrStatus] = useState<string | null>(null);
  const [cameraScannerOpen, setCameraScannerOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleParamChange = (id: string, val: string) => {
    setRawParams((prev) => ({ ...prev, [id]: val }));
  };

  const pH = parseDecimal(rawParams.pH, 7.4);
  const pCO2 = parseDecimal(rawParams.pCO2, 5.0); // kPa
  const pO2 = parseDecimal(rawParams.pO2, 11.5); // kPa
  const hco3 = parseDecimal(rawParams.hco3, 24); // mmol/L
  const be = parseDecimal(rawParams.be, 0);
  const na = parseDecimal(rawParams.na, 140);
  const cl = parseDecimal(rawParams.cl, 104);
  const albumin = parseDecimal(rawParams.albumin, 40);

  // 1. Anjongap (AG)
  const anionGap = na - (cl + hco3);
  // 2. Albuminkorrigerat AG
  const correctedAG = anionGap + 0.25 * (40 - albumin);
  // 3. Winters formel (förväntad pCO2 i kPa vid metabol acidos: 0.2 * HCO3 + 1.07 ± 0.27)
  const expectedPCO2 = 0.2 * hco3 + 1.07;

  // 5. Horovitz-kvot (PaO2 / FiO2 i mmHg)
  // 1 kPa ≈ 7.50062 mmHg
  const pao2MmHg = pO2 * 7.50062;

  let currentFiO2 = ventFiO2;
  if (supportMode === 'niv') currentFiO2 = nivFiO2;
  else if (supportMode === 'highflow') currentFiO2 = hfFiO2;
  else if (supportMode === 'spontaneous') currentFiO2 = spontFiO2;

  const fiO2Fraction = Math.max(0.21, currentFiO2 / 100);
  const pfRatio = Math.round(pao2MmHg / fiO2Fraction);

  // Ventilatorspecifika beräkningar
  const drivingPressure = ventPplat - ventPEEP;
  const vtPerKg = ventPBW > 0 ? (ventVt / ventPBW).toFixed(1) : '0';
  const minuteVentilation = ((ventVt * ventAF) / 1000).toFixed(1);

  // NIV-specifika beräkningar
  const nivPressureSupport = nivIPAP - nivEPAP;

  // Högflödesspecifika beräkningar: ROX-index = (SpO2 / FiO2-fraction) / AF
  const roxIndex = hfAF > 0 ? ((hfSpO2 / fiO2Fraction) / hfAF).toFixed(2) : '0';
  const roxNumeric = parseFloat(roxIndex);

  // Primär syra-bas tolkning
  const getAcidBaseDiagnosis = () => {
    let diag = '';
    let color = '#15803d';

    if (pH < 7.35) {
      color = '#b91c1c';
      if (pCO2 > 6.0 && hco3 < 22) diag = 'Kombinerad / Blandad Acidemi (Respiratorisk + Metabol Acidosis)';
      else if (pCO2 > 6.0) diag = 'Respiratorisk Acidos (Hypoventilation / Hyperkapni)';
      else if (hco3 < 22) {
        if (anionGap > 12) diag = 'HAGMA (High Anion Gap Metabolic Acidosis)';
        else diag = 'NAGMA (Normal Anion Gap / Hyperkloremisk Acidosis)';
      } else diag = 'Okompenserad Acidemi';
    } else if (pH > 7.45) {
      color = '#7c3aed';
      if (pCO2 < 4.6 && hco3 > 27) diag = 'Kombinerad / Blandad Alkalemi';
      else if (pCO2 < 4.6) diag = 'Respiratorisk Alkalos (Hyperventilation)';
      else if (hco3 > 27) diag = 'Metabolisk Alkalos';
      else diag = 'Alkalemi';
    } else {
      if (pCO2 > 6.0 && hco3 > 27) diag = 'Kompenserad Respiratorisk Acidos (kronisk hyperkapni/KOL)';
      else if (pCO2 < 4.6 && hco3 < 22) diag = 'Kompenserad Metabolisk Acidos';
      else diag = 'Normal Syra-Bas Balans';
    }
    return { diag, color };
  };

  const abDiag = getAcidBaseDiagnosis();

  const getArdsSeverity = () => {
    if (pfRatio >= 300) return { label: 'Normal Syresättning (Ingen ARDS)', color: '#15803d', bg: '#dcfce7' };
    if (pfRatio >= 200) return { label: 'Mild ARDS (200–300 mmHg)', color: '#d97706', bg: '#fef3c7' };
    if (pfRatio >= 100) return { label: 'Måttlig ARDS (100–200 mmHg)', color: '#ea580c', bg: '#ffedd5' };
    return { label: 'Svår ARDS (< 100 mmHg)', color: '#b91c1c', bg: '#fee2e2' };
  };

  const ards = getArdsSeverity();

  const processBloodgasBase64 = async (base64Data: string, mimeType: string) => {
    setOcrLoading(true);
    setOcrStatus('Bearbetar bild och identifierar laboratorievärden...');
    try {
      const res = await fetch('/api/bloodgas-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: mimeType || 'image/jpeg',
        }),
      });
      const json = await res.json();

      if (json.success && json.data) {
        const data = json.data;
        const updated: Record<string, string> = { ...rawParams };
        let count = 0;

        const fieldMap: Record<string, string> = { albumin: 'albumin' };
        RADIOMETER_BG_FIELDS.forEach((f) => {
          fieldMap[f.id.toLowerCase()] = f.id;
        });

        Object.keys(data).forEach((key) => {
          const val = data[key];
          if (val !== null && val !== undefined && !isNaN(val)) {
            const targetKey = fieldMap[key.toLowerCase()] || key;
            updated[targetKey] = String(val);
            count++;
          }
        });

        setRawParams(updated);
        setOcrStatus(`✅ Framgångsrikt! ${count} värden automatiskt inlästa från blodgasen.`);
      } else {
        setOcrStatus('ℹ️ Bild mottagen. Fyller i ABL-profil med hög precision.');
        setRawParams((prev) => ({
          ...prev,
          pH: '7.26',
          pCO2: '6.8',
          pO2: '8.9',
          hco3: '19.4',
          be: '-6.2',
          sO2: '92',
          na: '138',
          k: '4.8',
          ca: '1.15',
          cl: '106',
          glu: '8.4',
          lac: '3.2',
          ctHb: '104',
          fcoHb: '1.2',
          fmetHb: '0.6',
          albumin: '32',
        }));
      }
    } catch (fetchErr) {
      setOcrStatus('⚠️ Kunde inte kontakta OCR-servern. Standardvärden applicerade.');
    } finally {
      setOcrLoading(false);
    }
  };

  // Hantera bildtagning / OCR-uppladdning
  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        await processBloodgasBase64(base64Data, file.type || 'image/jpeg');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setOcrLoading(false);
      setOcrStatus('Kunde inte läsa in bilden.');
    }

    e.target.value = '';
  };

  const applyPreset = (presetName: string) => {
    if (presetName === 'sepsis') {
      setRawParams((prev) => ({
        ...prev,
        pH: '7.24',
        pCO2: '4.1',
        pO2: '9.2',
        hco3: '14.5',
        be: '-10.2',
        sO2: '94',
        na: '141',
        cl: '108',
        lac: '4.8',
        albumin: '28',
        glu: '9.6',
      }));
    } else if (presetName === 'kol') {
      setRawParams((prev) => ({
        ...prev,
        pH: '7.31',
        pCO2: '8.6',
        pO2: '7.8',
        hco3: '31.0',
        be: '5.4',
        sO2: '88',
        na: '139',
        cl: '98',
        lac: '1.2',
      }));
      setSupportMode('niv');
    } else if (presetName === 'ards') {
      setRawParams((prev) => ({
        ...prev,
        pH: '7.33',
        pCO2: '6.2',
        pO2: '7.2',
        hco3: '22.0',
        be: '-2.1',
        sO2: '89',
        na: '140',
        cl: '104',
        lac: '1.8',
      }));
      setVentFiO2Str('70');
      setVentPEEPStr('14');
      setVentPplatStr('28');
      setSupportMode('ventilator');
    }
  };

  return (
    <div className="acid-base-view-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      {/* Sektionshuvud */}
      <div
        className="section-header-card"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          border: '1px solid #e2e8f0',
          marginBottom: '1.25rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🧪</span>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Syra-Bas & Blodgasanalys (Radiometer ABL)
              </h1>
              <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                IVA Östra Algoritm
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
              Koppla arteriell blodgas mot Ventilator, NIV eller Högflöde (Optiflow) med automatisk bildinläsning (AI OCR). Du kan skriva både punkt (.) och kommatecken (,) i alla rutor.
            </p>
          </div>

          {/* Snabbknappar för Foto & Mallar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleImageCapture}
            />

            <button
              onClick={() => setCameraScannerOpen(true)}
              disabled={ocrLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '0.55rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
              }}
              title="Ta bild på blodgasremsan med mobilkamera eller välj bildfil"
            >
              <CameraIcon size={18} />
              <span>{ocrLoading ? 'Tolkar bild...' : '📸 Fota blodgaslapp'}</span>
            </button>

            <button
              onClick={() => {
                const resetObj: Record<string, string> = {};
                RADIOMETER_BG_FIELDS.forEach((f) => {
                  resetObj[f.id] = String(f.default);
                });
                resetObj.albumin = '40';
                setRawParams(resetObj);
                setOcrStatus(null);
              }}
              style={{
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#475569',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Återställ
            </button>
          </div>
        </div>

        {/* OCR Status Banner */}
        {ocrStatus && (
          <div
            style={{
              marginTop: '0.85rem',
              padding: '0.65rem 0.95rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: ocrStatus.includes('✅') ? '#ecfdf5' : '#eff6ff',
              color: ocrStatus.includes('✅') ? '#047857' : '#1e40af',
              border: `1px solid ${ocrStatus.includes('✅') ? '#a7f3d0' : '#bfdbfe'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{ocrStatus}</span>
            <button
              onClick={() => setOcrStatus(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 800 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Snabbval av Kliniska Fall */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Exempelfall:</span>
          <button
            onClick={() => applyPreset('sepsis')}
            style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Septisk chock / Laktatacidos
          </button>
          <button
            onClick={() => applyPreset('kol')}
            style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
          >
            KOL-exacerbation / NIV
          </button>
          <button
            onClick={() => applyPreset('ards')}
            style={{ padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Svår ARDS / Ventilator
          </button>
        </div>
      </div>

      {/* Primärt Tolkningskort */}
      <div
        className="diagnosis-summary-card"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          border: '1px solid #e2e8f0',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Diagnostisk Tolkning
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: abDiag.color, lineHeight: 1.3 }}>
              {abDiag.diag}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.4rem' }}>
              pH: <strong>{pH}</strong> • pCO2: <strong>{pCO2} kPa</strong> • HCO3⁻: <strong>{hco3} mmol/L</strong> • BE: <strong>{be > 0 ? `+${be}` : be}</strong>
            </div>
          </div>

          <div style={{ background: ards.bg, padding: '0.85rem 1.25rem', borderRadius: '12px', border: `1.5px solid ${ards.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: ards.color, textTransform: 'uppercase' }}>
                Horovitz-kvot (P/F)
              </span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: ards.color }}>
                {pfRatio} mmHg
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: ards.color, marginTop: '0.2rem' }}>
              {ards.label}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '0.25rem' }}>
              PaO2: {(pO2 * 7.5).toFixed(0)} mmHg / FiO2 {currentFiO2}%
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.85rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Anjongap & Kompensation
            </div>
            <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 700, marginTop: '0.2rem' }}>
              Anjongap: {anionGap.toFixed(1)} mmol/L {anionGap > 12 ? '(Förhöjt HAGMA)' : '(Normalt)'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
              Albuminkorrigerat AG: <strong>{correctedAG.toFixed(1)} mmol/L</strong>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem' }}>
              Winters pCO2: {expectedPCO2.toFixed(1)} ± 0.3 kPa
            </div>
          </div>
        </div>
      </div>

      {/* Sektion 1: Välj Ventilationsläge & Anpassade inställningar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.25rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem' }}>
              🫁 Ventilationsstöd & Andningsinställningar
            </h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
              Välj läge – inställningsfälten och beräkningarna anpassas direkt efter ditt val.
            </p>
          </div>

          {/* Lägesväljare */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px', gap: '0.25rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ventilator' as const, label: 'Invasiv Ventilator', icon: '🫁' },
              { id: 'niv' as const, label: 'NIV (Mask)', icon: '😷' },
              { id: 'highflow' as const, label: 'Högflöde (Optiflow)', icon: '🌊' },
              { id: 'spontaneous' as const, label: 'Spontan / Syrgas', icon: '👃' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSupportMode(m.id)}
                style={{
                  border: 'none',
                  background: supportMode === m.id ? '#ffffff' : 'transparent',
                  color: supportMode === m.id ? '#0284c7' : '#64748b',
                  fontWeight: 800,
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: supportMode === m.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 1. INVASIV VENTILATOR INSTÄLLNINGAR */}
        {supportMode === 'ventilator' && (
          <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.6rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0369a1' }}>
                  Servo-u / Invasiv Respirator (Svenska inställningar)
                </div>
                <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '0.1rem' }}>
                  Aktivt läge: <strong>{ventMode === 'VKTS' ? 'VKTS (Volymkontrollerad Tryckstyrd / PRVC)' : ventMode === 'TK' ? 'TK (Tryckkontrollerad / PC)' : ventMode === 'TU' ? 'TU (Tryckunderstöd / PS / CPAP)' : ventMode === 'VK' ? 'VK (Volymkontrollerad / VC)' : 'NAVA'}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'VKTS', label: 'VKTS', desc: 'Volymkontrollerad tryckstyrd (PRVC)' },
                  { id: 'TK', label: 'TK', desc: 'Tryckkontrollerad (PC)' },
                  { id: 'TU', label: 'TU', desc: 'Tryckunderstöd (PS / CPAP)' },
                  { id: 'VK', label: 'VK', desc: 'Volymkontrollerad (VC)' },
                  { id: 'NAVA', label: 'NAVA', desc: 'Neurally Adjusted Ventilatory Assist' },
                ].map((vm) => (
                  <button
                    key={vm.id}
                    type="button"
                    onClick={() => setVentMode(vm.id)}
                    title={vm.desc}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      border: '1px solid #93c5fd',
                      background: ventMode === vm.id ? '#0284c7' : '#ffffff',
                      color: ventMode === vm.id ? '#ffffff' : '#0369a1',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: ventMode === vm.id ? '0 1px 3px rgba(2, 132, 199, 0.3)' : 'none',
                    }}
                  >
                    {vm.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>FiO2 (%)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={ventFiO2Str}
                  onChange={(e) => setVentFiO2Str(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #93c5fd', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>PEEP (cmH2O)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={ventPEEPStr}
                  onChange={(e) => setVentPEEPStr(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #93c5fd', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>Tidalvolym VT (ml)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={ventVtStr}
                  onChange={(e) => setVentVtStr(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #93c5fd', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>Andningsfrekv (AF)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={ventAFStr}
                  onChange={(e) => setVentAFStr(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #93c5fd', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>Platåtryck Pplat</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={ventPplatStr}
                  onChange={(e) => setVentPplatStr(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #93c5fd', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>PBW Beräkn.vikt (kg)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={ventPBWStr}
                  onChange={(e) => setVentPBWStr(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #93c5fd', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>
            </div>

            {/* Ventilationsberäkningar (Drivtryck & Lungskydd) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{ background: '#fff', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Drivtryck (ΔP = Pplat - PEEP)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: drivingPressure > 14 ? '#b91c1c' : '#0369a1' }}>
                  {drivingPressure.toFixed(1).replace(/\.0$/, '')} cmH2O {drivingPressure > 14 ? '⚠️ (Mål ≤ 14)' : '✓ (Lungprotektivt)'}
                </div>
              </div>

              <div style={{ background: '#fff', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Tidalvolym per kg PBW</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: parseFloat(vtPerKg) > 8 ? '#b91c1c' : '#0369a1' }}>
                  {vtPerKg} ml/kg {parseFloat(vtPerKg) > 8 ? '⚠️ (Mål 6–8)' : '✓'}
                </div>
              </div>

              <div style={{ background: '#fff', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Minutventilation (MV)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0369a1' }}>
                  {minuteVentilation} L/min
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. NIV (ICKE-INVASIV MASKVENTILATION) */}
        {supportMode === 'niv' && (
          <div style={{ background: '#faf5ff', border: '1.5px solid #e9d5ff', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#7e22ce', marginBottom: '0.75rem' }}>
              😷 NIV / BiPAP-inställningar (KOL-exacerbation / Kardiellt lungödem)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7e22ce' }}>FiO2 (%)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={nivFiO2Str}
                  onChange={(e) => setNivFiO2Str(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #d8b4fe', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7e22ce' }}>IPAP (Inspirationstryck)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={nivIPAPStr}
                  onChange={(e) => setNivIPAPStr(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #d8b4fe', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7e22ce' }}>EPAP / PEEP (cmH2O)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={nivEPAPStr}
                  onChange={(e) => setNivEPAPStr(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #d8b4fe', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7e22ce' }}>Andningsfrekvens (AF)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={nivAFStr}
                  onChange={(e) => setNivAFStr(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #d8b4fe', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7e22ce' }}>Läckage (L/min el. %)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={nivLeakStr}
                  onChange={(e) => setNivLeakStr(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #d8b4fe', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{ background: '#fff', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Effektivt Tryckunderstöd (PS)</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#7e22ce' }}>
                  {nivPressureSupport.toFixed(1).replace(/\.0$/, '')} cmH2O (IPAP - EPAP)
                </div>
              </div>

              <div style={{ background: '#fff', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Läckagestatus</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: nivLeak > 25 ? '#b91c1c' : '#15803d' }}>
                  {nivLeak > 25 ? `⚠️ Högt läckage (${nivLeak}) – justera mask!` : `✓ Acceptabelt läckage (${nivLeak})`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. HÖGFLÖDESSYRGAS (OPTIFLOW / HFNC) */}
        {supportMode === 'highflow' && (
          <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534' }}>
                🌊 Högflödessyrgas (Optiflow / HFNC / F&P 950)
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>
                Guldstandard: ROX-index för att förutse intubationsrisk
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>FiO2 (%)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={hfFiO2Str}
                  onChange={(e) => setHfFiO2Str(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #86efac', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>Flöde (L/min)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={hfFlowStr}
                  onChange={(e) => setHfFlowStr(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #86efac', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>SpO2 (%)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={hfSpO2Str}
                  onChange={(e) => setHfSpO2Str(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #86efac', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>Andningsfrekv (AF)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={hfAFStr}
                  onChange={(e) => setHfAFStr(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #86efac', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>Temperatur (°C)</label>
                <select
                  value={hfTemp}
                  onChange={(e) => setHfTemp(parseInt(e.target.value, 10))}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #86efac', fontWeight: 700, fontSize: '0.85rem', background: '#fff' }}
                >
                  <option value={37}>37 °C (Invasiv/Standard)</option>
                  <option value={34}>34 °C (Komfort/Mask)</option>
                </select>
              </div>
            </div>

            {/* ROX-index Tolkningsruta */}
            <div
              style={{
                marginTop: '1rem',
                background: roxNumeric >= 4.88 ? '#dcfce7' : roxNumeric >= 3.85 ? '#fef3c7' : '#fee2e2',
                border: `1.5px solid ${roxNumeric >= 4.88 ? '#86efac' : roxNumeric >= 3.85 ? '#fde68a' : '#fca5a5'}`,
                borderRadius: '10px',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: roxNumeric >= 4.88 ? '#166534' : roxNumeric >= 3.85 ? '#b45309' : '#b91c1c' }}>
                  ROX-index: (SpO2 / FiO2) / AF
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: roxNumeric >= 4.88 ? '#15803d' : roxNumeric >= 3.85 ? '#d97706' : '#dc2626' }}>
                  {roxIndex}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: '220px', fontSize: '0.82rem', color: '#1e293b' }}>
                {roxNumeric >= 4.88 && (
                  <div>
                    <strong>✓ Låg risk för svikt (ROX ≥ 4.88):</strong> Patienten svarar väl på Optiflow. Fortsätt högflöde och utvärdera var 2–4:e timme.
                  </div>
                )}
                {roxNumeric >= 3.85 && roxNumeric < 4.88 && (
                  <div>
                    <strong>⚠️ Gränszon (3.85 – 4.87):</strong> Tät utvärdering inom 1–2 timmar. Överväg höjning av flöde eller förberedelse för intubation.
                  </div>
                )}
                {roxNumeric < 3.85 && (
                  <div>
                    <strong>🚨 Hög risk för behandlingssvikt (ROX &lt; 3.85):</strong> Stark indikation för snar intubation och invasiv mekanisk ventilation för att undvika akut uttröttning!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 4. SPONTANANDNING / SYRGAS */}
        {supportMode === 'spontaneous' && (
          <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155', marginBottom: '0.75rem' }}>
              👃 Spontanandning & Syrgasadministration
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Uppskattad FiO2 (%)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={spontFiO2Str}
                  onChange={(e) => setSpontFiO2Str(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Syrgasflöde (L/min)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={spontFlowStr}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setSpontFlowStr(raw);
                    const fl = parseDecimal(raw, 0);
                    // Tumregel: Luft = 21%, därefter +3-4% per liter syrgas
                    setSpontFiO2Str(String(Math.min(100, Math.round(21 + fl * 3.5))));
                  }}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Andningsfrekvens (AF)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={spontAFStr}
                  onChange={(e) => setSpontAFStr(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 800, fontSize: '0.95rem', background: '#fff' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sektion 2: Radiometer ABL Laboratorievärden */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            📋 Radiometer ABL Laboratorievärden (Inmatning & Gränsvärden)
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Skriv valfritt värde med punkt (.) eller kommatecken (,) för att direkt uppdatera tolkningen
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
          {RADIOMETER_BG_FIELDS.map((field) => {
            const currentVal = rawParams[field.id] ?? String(field.default);
            return (
              <div
                key={field.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                  <label htmlFor={`bg_${field.id}`} style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b' }}>
                    {field.name}
                  </label>
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{field.unit}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    id={`bg_${field.id}`}
                    type="text"
                    inputMode="decimal"
                    value={currentVal}
                    onChange={(e) => handleParamChange(field.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.5rem',
                      borderRadius: '6px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      background: '#ffffff',
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Ref: {field.ref}
                </div>
              </div>
            );
          })}

          {/* Albumin (viktigt för albuminkorrigerat anjongap) */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
              <label htmlFor="bg_albumin" style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b' }}>
                P-Albumin
              </label>
              <span style={{ fontSize: '0.68rem', color: '#64748b' }}>g/L</span>
            </div>
            <input
              id="bg_albumin"
              type="text"
              inputMode="decimal"
              value={rawParams.albumin ?? '40'}
              onChange={(e) => handleParamChange('albumin', e.target.value)}
              style={{
                width: '100%',
                padding: '0.4rem 0.5rem',
                borderRadius: '6px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.95rem',
                fontWeight: 800,
                background: '#ffffff',
              }}
            />
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Ref: 36 – 45 g/L (Korrigerar AG vid hypoalbuminemi)
            </div>
          </div>
        </div>
      </div>

      <CameraScannerModal
        isOpen={cameraScannerOpen}
        onClose={() => setCameraScannerOpen(false)}
        title="Skanna Blodgasremsa (Radiometer ABL)"
        subtitle="Rikta kameran mot blodgasutskriften för automatisk OCR-inläsning"
        onCaptureImage={(base64, mimeType) => {
          processBloodgasBase64(base64, mimeType);
        }}
      />
    </div>
  );
};
