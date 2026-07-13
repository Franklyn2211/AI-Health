import { useMemo, useState } from 'react';
import { Check, MessageSquareText, Send, Sparkles, X } from 'lucide-react';
import { useHealth } from '../context/healthContextCore';

function parseTime(hourText, minuteText = '00') {
  const hour = Math.min(Number(hourText), 23);
  const minute = Math.min(Number(minuteText || 0), 59);
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function sleepDuration(bedtime, wakeTime) {
  const [bedHour, bedMinute] = bedtime.split(':').map(Number);
  const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
  let minutes = (wakeHour * 60 + wakeMinute) - (bedHour * 60 + bedMinute);
  if (minutes <= 0) minutes += 24 * 60;
  return minutes;
}

function parseQuickLog(text) {
  const normalized = text.toLowerCase();
  const entries = [];

  const waterMatch = normalized.match(/(\d+)\s*(?:gelas|glass)/);
  if (waterMatch || normalized.includes('minum air')) {
    entries.push({ type: 'water', value: waterMatch ? Number(waterMatch[1]) : 1, label: `${waterMatch ? waterMatch[1] : 1} gelas air` });
  }

  if (/(stres|stress|cemas|sedih|down|berat)/.test(normalized)) {
    entries.push({ type: 'mood', value: 1, label: 'Mood terasa berat' });
  } else if (/(senang|bahagia|mood baik|feeling good)/.test(normalized)) {
    entries.push({ type: 'mood', value: 3, label: 'Mood terasa baik' });
  } else if (/(biasa|netral|neutral)/.test(normalized)) {
    entries.push({ type: 'mood', value: 2, label: 'Mood terasa biasa' });
  }

  if (/(lelah|capek|tired|energi rendah)/.test(normalized)) {
    entries.push({ type: 'energy', value: 1, label: 'Energi rendah' });
  } else if (/(energi baik|energik|berenergi)/.test(normalized)) {
    entries.push({ type: 'energy', value: 3, label: 'Energi baik' });
  }

  const sleepMatch = normalized.match(/tidur(?:\s+jam)?\s*(\d{1,2})(?::(\d{2}))?.*bangun(?:\s+jam)?\s*(\d{1,2})(?::(\d{2}))?/);
  if (sleepMatch) {
    const bedtime = parseTime(sleepMatch[1], sleepMatch[2]);
    const wakeTime = parseTime(sleepMatch[3], sleepMatch[4]);
    entries.push({
      type: 'sleep',
      bedtime,
      wakeTime,
      durationMinutes: sleepDuration(bedtime, wakeTime),
      value: /(tidur buruk|tidur kurang|tidak nyenyak)/.test(normalized) ? 1 : /(tidur nyenyak|tidur baik)/.test(normalized) ? 3 : 2,
      label: `Tidur ${bedtime}–${wakeTime}`,
    });
  }

  const mealMatch = text.match(/(?:makan|sarapan|lunch|dinner)\s+([^,.]+)/i);
  if (mealMatch) {
    entries.push({ type: 'meal', name: mealMatch[1].trim(), label: `Makanan: ${mealMatch[1].trim()}` });
  }

  return entries;
}

export default function QuickLogComposer() {
  const { todayRecord, updateDailyRecord, addLoggedMeal, addDailyLog } = useHealth();
  const [text, setText] = useState('');
  const [preview, setPreview] = useState([]);
  const [saved, setSaved] = useState(false);

  const placeholder = useMemo(
    () => 'Contoh: Tidur jam 23, bangun jam 7, sarapan bubur, mood baik, minum 2 gelas air',
    [],
  );

  const analyze = () => {
    const entries = parseQuickLog(text);
    setPreview(entries);
    setSaved(false);
  };

  const removeEntry = (index) => {
    setPreview((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const confirm = () => {
    if (!preview.length) return;
    const nextCheckIn = { ...(todayRecord.checkIn || { energy: 2, mood: 2, sleep: 2 }) };
    const updates = {};

    preview.forEach((entry) => {
      if (entry.type === 'water') updates.water = (todayRecord.water || 0) + entry.value;
      if (entry.type === 'mood') {
        nextCheckIn.mood = entry.value;
        updates.moodDetails = {
          moodId: entry.value === 1 ? 'low' : entry.value === 3 ? 'good' : 'neutral',
          label: entry.label.replace('Mood terasa ', ''),
          value: entry.value,
          triggers: [],
          need: '',
          note: text,
          source: 'quick-log',
          recordedAt: new Date().toISOString(),
        };
      }
      if (entry.type === 'energy') nextCheckIn.energy = entry.value;
      if (entry.type === 'sleep') {
        nextCheckIn.sleep = entry.value;
        updates.sleepDetails = {
          bedtime: entry.bedtime,
          wakeTime: entry.wakeTime,
          durationMinutes: entry.durationMinutes,
          quality: entry.value,
          awakenings: 0,
          rested: nextCheckIn.energy,
          routine: [],
          source: 'quick-log',
          recordedAt: new Date().toISOString(),
        };
      }
      if (entry.type === 'meal') {
        addLoggedMeal({ name: entry.name, cal: 0, prot: 0, carbs: 0, fat: 0, source: 'quick-log' });
      }
    });

    updates.checkIn = nextCheckIn;
    updates.quickLogText = text;
    updateDailyRecord(updates);
    addDailyLog('quick-log', { label: text });
    setSaved(true);
    setText('');
    setPreview([]);
  };

  return (
    <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
          <MessageSquareText size={17} />
        </span>
        <div>
          <h2 className="text-sm font-extrabold text-slate-900">Tulis bebas</h2>
          <p className="mt-0.5 text-[10px] font-medium text-slate-500">AI akan ambil makanan, tidur, mood, dan air.</p>
        </div>
      </div>

      <div className="flex gap-2">
        <textarea value={text} onChange={(event) => setText(event.target.value)} rows={2} placeholder={placeholder} className="min-w-0 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed outline-none focus:border-teal-600" />
        <button type="button" onClick={analyze} disabled={!text.trim()} aria-label="Analisis catatan" className="flex w-11 shrink-0 items-center justify-center rounded-xl border-0 bg-slate-900 text-white disabled:bg-slate-200">
          <Send size={16} />
        </button>
      </div>

      {preview.length > 0 && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="mb-2 text-[10px] font-extrabold uppercase text-slate-500">Ditemukan</p>
          <div className="flex flex-wrap gap-2">
            {preview.map((entry, index) => (
              <span key={`${entry.type}-${index}`} className="flex items-center gap-1.5 rounded-xl bg-teal-50 px-2.5 py-2 text-[10px] font-bold text-teal-800">
                {entry.label}
                <button type="button" onClick={() => removeEntry(index)} aria-label={`Hapus ${entry.label}`} className="border-0 bg-transparent p-0 text-teal-600"><X size={12} /></button>
              </span>
            ))}
          </div>
          <button type="button" onClick={confirm} className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border-0 bg-slate-900 text-xs font-extrabold text-white">
            <Check size={14} /> Benar, simpan
          </button>
        </div>
      )}

      {!preview.length && text.trim() && !saved && (
        <p className="mt-2 text-[10px] font-medium text-slate-400">Tekan kirim untuk cek sebelum disimpan.</p>
      )}

      {saved && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-[10px] font-extrabold text-emerald-800">
          <Sparkles size={13} /> Catatan sudah masuk ke harimu.
        </div>
      )}
    </section>
  );
}
