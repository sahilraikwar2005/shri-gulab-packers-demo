import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { toast } from 'sonner';
import api from '../api/client';
import { ButtonLoader } from '../components/common/States';
import { useSite } from '../context/SiteContext';

const MOVING_TYPES = [
  { value: 'home', label: 'Home Shifting' },
  { value: 'office', label: 'Office Shifting' },
  { value: 'fewItems', label: 'Few Items' },
  { value: 'vehicle', label: 'Vehicle Transport' },
];

export default function Quote() {
  const reduced = useReducedMotion();
  const { settings } = useSite();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const [form, setForm] = useState({
    movingType: 'home',
    shipmentType: 'local',
    pickup: { city: '', pincode: '', address: '', floor: '', lift: true },
    destination: { city: '', pincode: '', address: '', floor: '', lift: true },
    bhk: '2BHK',
    vehiclePreference: 'recommend',
    movingDate: '',
    fewItemsDescription: '',
    fewItemsPhotos: [],
    customer: { name: '', mobile: '' },
  });

  const setField = (path, value) => {
    setValidationErrors((current) => {
      if (!current[path]) return current;
      const updated = { ...current };
      delete updated[path];
      return updated;
    });
    setForm((f) => {
      const copy = JSON.parse(JSON.stringify(f));
      const parts = path.split('.');
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const localCity = settings?.officeAddress?.split(',')[0]?.trim() || 'Local move';
  const next = () => {
    if (step === 1) {
      const pickupField = form.shipmentType === 'local' ? 'pickup.address' : 'pickup.city';
      const destinationField = form.shipmentType === 'local' ? 'destination.address' : 'destination.city';
      const pickupValue = form.shipmentType === 'local' ? form.pickup.address : form.pickup.city;
      const destinationValue = form.shipmentType === 'local' ? form.destination.address : form.destination.city;
      const nextErrors = {};
      if (!pickupValue.trim()) nextErrors[pickupField] = form.shipmentType === 'local' ? 'Enter the pickup address' : 'Enter the pickup city';
      if (!destinationValue.trim()) nextErrors[destinationField] = form.shipmentType === 'local' ? 'Enter the drop address' : 'Enter the destination city';
      setValidationErrors(nextErrors);
      if (Object.keys(nextErrors).length) {
        setError('Complete the required pickup and destination fields to continue.');
        return;
      }
    }
    if (step === 3) {
      const nextErrors = {};
      if (!form.customer.name.trim()) nextErrors['customer.name'] = 'Enter your name';
      if (!form.customer.mobile.trim()) nextErrors['customer.mobile'] = 'Enter your mobile number';
      setValidationErrors(nextErrors);
      if (Object.keys(nextErrors).length) {
        setError('Enter your name and mobile number to continue.');
        return;
      }
    }
    setError('');
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const uploadPhoto = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const r = await api.post('/api/v1/upload/public', fd);
    return r.data.url;
  };

  const handlePhotoChange = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const f of files) {
      try {
        const url = await uploadPhoto(f);
        setForm((prev) => ({ ...prev, fewItemsPhotos: [...prev.fewItemsPhotos, url] }));
      } catch (uploadError) {
        setError(uploadError.response?.data?.message || uploadError.message || 'Photo upload failed');
      }
    }
  };

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        movingType: form.movingType,
        shipmentType: form.shipmentType,
        pickup: form.shipmentType === 'local' ? { ...form.pickup, city: localCity } : form.pickup,
        destination: form.shipmentType === 'local' ? { ...form.destination, city: localCity } : form.destination,
        bhk: form.movingType === 'home' ? form.bhk : undefined,
        vehiclePreference: form.vehiclePreference,
        movingDate: form.movingDate || undefined,
        fewItemsDescription: form.movingType === 'fewItems' ? form.fewItemsDescription : undefined,
        fewItemsPhotos: form.movingType === 'fewItems' ? form.fewItemsPhotos : undefined,
        customer: form.customer,
      };
      const r = await api.post('/api/v1/inquiries', payload);
      setResult(r.data);
      toast.success(`Inquiry saved: ${r.data.referenceId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const isHome = form.movingType === 'home';
  const isFew = form.movingType === 'fewItems';
  const isLocal = form.shipmentType === 'local';

  const steps = [
    {
      title: 'Moving Details',
      content: (
        <div className="space-y-4">
          <div>
            <label htmlFor="moving-type" className="block text-sm font-medium mb-1">Moving Type</label>
            <select id="moving-type" value={form.movingType} onChange={(e) => setField('movingType', e.target.value)} className="w-full border rounded-lg p-2.5">
              {MOVING_TYPES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Local or Outstation?</label>
            <div className="flex gap-3">
              {['local', 'outstation'].map((t) => (
                <button
                  type="button"
                  key={t}
                  aria-pressed={form.shipmentType === t}
                  onClick={() => {
                    setField('shipmentType', t);
                    setValidationErrors({});
                    setError('');
                  }}
                  className={`flex-1 py-2 rounded-lg border capitalize ${form.shipmentType === t ? 'bg-orange text-white' : ''}`}
                >
                  {t === 'local' ? 'Within Same City' : 'Outstation'}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Pickup & Destination',
      content: (
        <div className="space-y-6">
          {['pickup', 'destination'].map((loc) => (
            <div key={loc} className="border rounded-xl p-4">
              <h4 className="font-bold text-navy mb-3">{loc === 'pickup' ? 'Pickup Location' : 'Drop Location'}</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {!isLocal && (
                  <label className="block text-sm font-medium md:col-span-2">
                    {loc === 'pickup' ? 'From City *' : 'To City *'}
                    <input
                      aria-label={loc === 'pickup' ? 'Pickup city' : 'Destination city'}
                      aria-invalid={Boolean(validationErrors[`${loc}.city`])}
                      aria-describedby={validationErrors[`${loc}.city`] ? `${loc}-city-error` : undefined}
                      placeholder={loc === 'pickup' ? 'Enter pickup city' : 'Enter destination city'}
                      required
                      value={form[loc].city}
                      onChange={(e) => setField(`${loc}.city`, e.target.value)}
                      className="mt-1 w-full border rounded-lg p-2.5"
                    />
                    {validationErrors[`${loc}.city`] && (
                      <span id={`${loc}-city-error`} className="mt-1 block text-xs text-red-600" role="alert">{validationErrors[`${loc}.city`]}</span>
                    )}
                  </label>
                )}
                {isLocal && (
                  <label className="block text-sm font-medium md:col-span-2">
                    {loc === 'pickup' ? 'Full Pickup Address *' : 'Full Drop Address *'}
                    <input
                      aria-label={loc === 'pickup' ? 'Full pickup address' : 'Full drop address'}
                      aria-invalid={Boolean(validationErrors[`${loc}.address`])}
                      aria-describedby={validationErrors[`${loc}.address`] ? `${loc}-address-error` : undefined}
                      placeholder={loc === 'pickup'
                        ? 'Enter pickup area, street and house number'
                        : 'Enter drop area, street and house number'}
                      required
                      value={form[loc].address}
                      onChange={(e) => setField(`${loc}.address`, e.target.value)}
                      className="mt-1 w-full border rounded-lg p-2.5"
                    />
                    {validationErrors[`${loc}.address`] && (
                      <span id={`${loc}-address-error`} className="mt-1 block text-xs text-red-600" role="alert">{validationErrors[`${loc}.address`]}</span>
                    )}
                  </label>
                )}
                <label className="block text-sm font-medium">
                  PIN code
                  <input
                    placeholder="Enter PIN code (optional)"
                    value={form[loc].pincode}
                    onChange={(e) => setField(`${loc}.pincode`, e.target.value)}
                    className="mt-1 w-full border rounded-lg p-2.5"
                  />
                </label>
                {!isLocal && (
                  <label className="block text-sm font-medium md:col-span-2">
                    Full {loc === 'pickup' ? 'pickup' : 'drop'} address (optional)
                    <input
                      placeholder={loc === 'pickup' ? 'Enter pickup address' : 'Enter drop address'}
                      value={form[loc].address}
                      onChange={(e) => setField(`${loc}.address`, e.target.value)}
                      className="mt-1 w-full border rounded-lg p-2.5"
                    />
                  </label>
                )}
                <label className="block text-sm font-medium">
                  Floor
                  <input
                    placeholder="Floor (e.g. 3rd)"
                    value={form[loc].floor}
                    onChange={(e) => setField(`${loc}.floor`, e.target.value)}
                    className="mt-1 w-full border rounded-lg p-2.5"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form[loc].lift} onChange={(e) => setField(`${loc}.lift`, e.target.checked)} /> Lift available
                </label>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Details',
      content: (
        <div className="space-y-4">
          {isHome && (
            <div>
              <label className="block text-sm font-medium mb-1">BHK</label>
              <select value={form.bhk} onChange={(e) => setField('bhk', e.target.value)} className="w-full border rounded-lg p-2.5">
                {['1BHK', '2BHK', '3BHK', '4BHK', '5BHK+'].map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Vehicle Preference</label>
            <select value={form.vehiclePreference} onChange={(e) => setField('vehiclePreference', e.target.value)} className="w-full border rounded-lg p-2.5">
              <option value="mini">Mini</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="recommend">Recommend for Me</option>
            </select>
          </div>
          {isFew && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Describe items</label>
                <textarea value={form.fewItemsDescription} onChange={(e) => setField('fewItemsDescription', e.target.value)} className="w-full border rounded-lg p-2.5" rows={4} placeholder="e.g. 2 chairs, 1 table, 5 boxes" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Optional photos</label>
                <input type="file" multiple accept="image/*" onChange={handlePhotoChange} />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {form.fewItemsPhotos.map((u, i) => <img key={i} src={u} alt="photo" className="w-16 h-16 object-cover rounded" />)}
                </div>
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Schedule & Contact',
      content: (
        <div className="space-y-4">
          <div>
            <label htmlFor="moving-date" className="block text-sm font-medium mb-1">Preferred Moving Date</label>
            <input id="moving-date" type="date" value={form.movingDate} onChange={(e) => setField('movingDate', e.target.value)} className="w-full border rounded-lg p-2.5" />
          </div>
          <div>
            <label htmlFor="customer-name" className="block text-sm font-medium mb-1">Your Name *</label>
            <input id="customer-name" value={form.customer.name} onChange={(e) => setField('customer.name', e.target.value)} className="w-full border rounded-lg p-2.5" aria-invalid={Boolean(validationErrors['customer.name'])} aria-describedby={validationErrors['customer.name'] ? 'customer-name-error' : undefined} required />
            {validationErrors['customer.name'] && <span id="customer-name-error" className="mt-1 block text-xs text-red-600" role="alert">{validationErrors['customer.name']}</span>}
          </div>
          <div>
            <label htmlFor="customer-mobile" className="block text-sm font-medium mb-1">Mobile Number *</label>
            <input id="customer-mobile" type="tel" inputMode="tel" autoComplete="tel" value={form.customer.mobile} onChange={(e) => setField('customer.mobile', e.target.value)} className="w-full border rounded-lg p-2.5" aria-invalid={Boolean(validationErrors['customer.mobile'])} aria-describedby={validationErrors['customer.mobile'] ? 'customer-mobile-error' : undefined} required />
            {validationErrors['customer.mobile'] && <span id="customer-mobile-error" className="mt-1 block text-xs text-red-600" role="alert">{validationErrors['customer.mobile']}</span>}
          </div>
        </div>
      ),
    },
    {
      title: 'Review & Submit',
      content: (
        <div className="space-y-3 text-sm">
          <div className="bg-gray-50 rounded-lg p-4">
            <p><b>Type:</b> {form.movingType} • {form.shipmentType}</p>
            <p><b>Pickup:</b> {isLocal ? form.pickup.address : form.pickup.city}{form.pickup.pincode && ` • ${form.pickup.pincode}`}</p>
            {form.pickup.address && !isLocal && <p><b>Pickup address:</b> {form.pickup.address}</p>}
            <p><b>Destination:</b> {isLocal ? form.destination.address : form.destination.city}{form.destination.pincode && ` • ${form.destination.pincode}`}</p>
            {form.destination.address && !isLocal && <p><b>Drop address:</b> {form.destination.address}</p>}
            <p><b>Name:</b> {form.customer.name} • {form.customer.mobile}</p>
            {form.movingDate && <p><b>Date:</b> {form.movingDate}</p>}
          </div>
          <p className="text-gray-500">By submitting, you agree to be contacted. No fabricated quote will be shown; our team will send your quotation.</p>
        </div>
      ),
    },
  ];

  if (result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="card">
          <h2 className="text-2xl font-bold text-navy">Thank you!</h2>
          <p className="mt-3 text-gray-600">Your inquiry has been received.</p>
          <p className="mt-2">Reference ID: <b className="text-orange">{result.referenceId}</b></p>
          <p className="mt-1 text-sm text-gray-500">Status: Awaiting quotation. Our team will contact you shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-navy mb-6">Get Free Quote</h1>
      <div className="mb-4 flex gap-2">
        {steps.map((s, i) => (
          <div key={i} className={`flex-1 h-2 rounded ${i <= step ? 'bg-orange' : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="card">
        <h2 className="text-xl font-bold text-navy mb-4">{steps[step].title}</h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduced ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
          >
            {steps[step].content}
          </motion.div>
        </AnimatePresence>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        <div className="flex justify-between mt-6">
          <button onClick={prev} disabled={step === 0} className="btn-outline">Back</button>
          {step < steps.length - 1 ? (
            <button onClick={next} className="btn-primary">Next</button>
          ) : (
            <button type="button" onClick={submit} disabled={submitting} className="btn-primary disabled:opacity-60">{submitting ? <ButtonLoader label="Submitting..." /> : 'Submit Inquiry'}</button>
          )}
        </div>
      </div>
    </div>
  );
}