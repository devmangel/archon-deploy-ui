import { TextareaHTMLAttributes, forwardRef } from 'react';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-zinc-200">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <textarea
          ref={ref}
          className={`w-full px-4 py-3 bg-zinc-900 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
            transition-all placeholder:text-zinc-600 resize-none
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

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
