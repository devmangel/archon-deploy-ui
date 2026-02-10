import { InputHTMLAttributes, forwardRef } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-zinc-200">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-zinc-900 border rounded-lg font-mono text-sm
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
            transition-all placeholder:text-zinc-600
            ${error ? 'border-red-500' : 'border-zinc-700 hover:border-zinc-600'}
            ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-400 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-xs text-zinc-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
