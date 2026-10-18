import React, { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '../../api/client';
import { useSite } from '../../context/SiteContext';
import { ButtonLoader } from '../common/States';
import { useNavigate } from 'react-router-dom';

const quoteSchema = z.object({
  movingType: z.enum(['home', 'office', 'fewItems', 'vehicle']),
  shipmentType: z.enum(['local', 'outstation']),
  pickupAddress: z.string(),
  destinationAddress: z.string(),
  pickupCity: z.string(),
  destinationCity: z.string(),
  mobile: z.string().trim().min(1, 'Enter your mobile number'),
  movingDate: z.string(),
}).superRefine((values, context) => {
  if (values.shipmentType === 'local') {
    if (!values.pickupAddress.trim()) {
      context.addIssue({ code: 'custom', path: ['pickupAddress'], message: 'Enter the pickup address' });
    }
    if (!values.destinationAddress.trim()) {
      context.addIssue({ code: 'custom', path: ['destinationAddress'], message: 'Enter the drop address' });
    }
    return;
  }

  if (!values.pickupCity.trim()) {
    context.addIssue({ code: 'custom', path: ['pickupCity'], message: 'Enter the pickup city' });
  }
  if (!values.destinationCity.trim()) {
    context.addIssue({ code: 'custom', path: ['destinationCity'], message: 'Enter the destination city' });
  }
});

const defaultValues = {
  movingType: 'home',
  shipmentType: 'local',
  pickupAddress: '',
  destinationAddress: '',
  pickupCity: '',
  destinationCity: '',
  mobile: '',
  movingDate: '',
};

function FieldError({ id, message }) {
  if (!message) return null;
  return <span className="hero-field-error" id={id} role="alert">{message}</span>;
}

export default function QuickQuoteInline() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const { settings } = useSite();
  const {
    register,
    control,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const shipmentType = useWatch({ control, name: 'shipmentType' });
  const localCity = settings?.officeAddress?.split(',')[0]?.trim() || 'Local move';

  useEffect(() => {
    clearErrors(['pickupAddress', 'destinationAddress', 'pickupCity', 'destinationCity']);
  }, [shipmentType, clearErrors]);

  const submitMutation = useMutation({
    mutationFn: async (values) => {
      const pickup = values.shipmentType === 'local'
        ? { city: localCity, address: values.pickupAddress.trim() }
        : { city: values.pickupCity.trim() };
      const destination = values.shipmentType === 'local'
        ? { city: localCity, address: values.destinationAddress.trim() }
        : { city: values.destinationCity.trim() };
      const payload = {
        movingType: values.movingType,
        shipmentType: values.shipmentType,
        pickup,
        destination,
        customer: { name: 'Guest', mobile: values.mobile.trim() },
        movingDate: values.movingDate || undefined,
      };
      const response = await api.post('/api/v1/inquiries', payload);
      return response.data;
    },
    onSuccess: (result) => {
      toast.success(`Inquiry saved: ${result.referenceId}`);
      navigate(`/quote?ref=${result.referenceId}`);
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Submission failed'),
  });

  const fieldProps = (name) => ({
    ...register(name),
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form onSubmit={handleSubmit((values) => submitMutation.mutate(values))} className="hero-quote-form" noValidate>
      <label className="hero-field">
        <span>What do you want to move?</span>
        <select {...register('movingType')}>
          <option value="home">Home Shifting</option>
          <option value="office">Office Shifting</option>
          <option value="fewItems">Few Items</option>
          <option value="vehicle">Vehicle Transport</option>
        </select>
      </label>

      <fieldset className="hero-shipment-options">
        <legend className="sr-only">Moving distance</legend>
        <label>
          <input type="radio" value="local" {...register('shipmentType')} />
          <span>Within Same City</span>
        </label>
        <label>
          <input type="radio" value="outstation" {...register('shipmentType')} />
          <span>Outstation</span>
        </label>
      </fieldset>

      <AnimatePresence mode="wait" initial={false}>
        {shipmentType === 'local' ? (
          <motion.div
            key="local-addresses"
            className="hero-city-fields hero-address-fields"
            initial={reduced ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: reduced ? 0 : 0.16 }}
          >
            <label className="hero-field">
              <span>Pickup Address</span>
              <input
                {...fieldProps('pickupAddress')}
                placeholder="House no., street, area, landmark"
                autoComplete="street-address"
              />
              <FieldError id="pickupAddress-error" message={errors.pickupAddress?.message} />
            </label>
            <label className="hero-field">
              <span>Drop Address</span>
              <input
                {...fieldProps('destinationAddress')}
                placeholder="House no., street, area, landmark"
                autoComplete="street-address"
              />
              <FieldError id="destinationAddress-error" message={errors.destinationAddress?.message} />
            </label>
          </motion.div>
        ) : (
          <motion.div
            key="outstation-cities"
            className="hero-city-fields"
            initial={reduced ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: reduced ? 0 : 0.16 }}
          >
            <label className="hero-field">
              <span>From City</span>
              <input
                {...fieldProps('pickupCity')}
                placeholder="Enter pickup city"
                autoComplete="address-level2"
              />
              <FieldError id="pickupCity-error" message={errors.pickupCity?.message} />
            </label>
            <label className="hero-field">
              <span>To City</span>
              <input
                {...fieldProps('destinationCity')}
                placeholder="Enter destination city"
                autoComplete="address-level2"
              />
              <FieldError id="destinationCity-error" message={errors.destinationCity?.message} />
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hero-contact-fields">
        <label className="hero-field">
          <span>Preferred Moving Date</span>
          <input {...register('movingDate')} type="date" />
        </label>

        <label className="hero-field">
          <span>Mobile Number</span>
          <input
            {...fieldProps('mobile')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Enter mobile number"
          />
          <FieldError id="mobile-error" message={errors.mobile?.message} />
        </label>
      </div>

      <button type="submit" disabled={submitMutation.isPending} className="hero-button hero-button-primary hero-submit">
        {submitMutation.isPending ? <ButtonLoader label="Submitting..." /> : <>Next Step <span aria-hidden="true">→</span></>}
      </button>
    </form>
  );
}
