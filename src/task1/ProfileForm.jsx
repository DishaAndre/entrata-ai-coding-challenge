import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from './validation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProfileForm() {
  const [toast, setToast] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      displayName: '',
      phone: '',
      website: '',
      bio: '',
    },
  });

  const bioValue = watch('bio') || '';

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setToast({ type: 'success', message: 'Profile settings saved successfully!' });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 flex items-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Display Name */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
            Display Name <span className="text-red-500">*</span>
          </label>
          <input
            id="displayName"
            type="text"
            {...register('displayName')}
            aria-invalid={errors.displayName ? 'true' : 'false'}
            aria-describedby={errors.displayName ? 'displayName-error' : undefined}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none transition ${
              errors.displayName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
          {errors.displayName && (
            <p id="displayName-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 inline shrink-0" />
              <span>{errors.displayName.message}</span>
            </p>
          )}
        </div>

        {/* Website URL */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
            Website URL
          </label>
          <input
            id="website"
            type="url"
            placeholder="https://example.com"
            {...register('website')}
            aria-invalid={errors.website ? 'true' : 'false'}
            aria-describedby={errors.website ? 'website-error' : undefined}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none transition ${
              errors.website ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
          {errors.website && (
            <p id="website-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 inline shrink-0" />
              <span>{errors.website.message}</span>
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (with country code)
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+1 5551234567"
            {...register('phone')}
            aria-invalid={errors.phone ? 'true' : 'false'}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none transition ${
              errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 inline shrink-0" />
              <span>{errors.phone.message}</span>
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <span className={`text-xs ${bioValue.length > 160 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
              {bioValue.length}/160
            </span>
          </div>
          <textarea
            id="bio"
            rows="3"
            {...register('bio')}
            aria-invalid={errors.bio ? 'true' : 'false'}
            aria-describedby={errors.bio ? 'bio-error' : undefined}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none transition ${
              errors.bio ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
            }`}
          />
          {errors.bio && (
            <p id="bio-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 inline shrink-0" />
              <span>{errors.bio.message}</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}