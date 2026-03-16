'use client';

import * as React from 'react';
import { Controller, Control, ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { cn } from '@/lib/utils';

export interface FormFieldControllerProps<TFieldValues extends FieldValues = FieldValues> {
    name: FieldPath<TFieldValues>;
    control: Control<TFieldValues>;
    render: (props: {
        field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
        fieldState: { invalid: boolean; error?: { message?: string } };
    }) => React.ReactElement;
}

export interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
    id?: string;
    label: React.ReactNode;
    required?: boolean;
    hint?: React.ReactNode;
    hintClassName?: string;
    className?: string;
    labelClassName?: string;
    errorClassName?: string;
    /** Use for react-hook-form Controller fields */
    controller?: FormFieldControllerProps<TFieldValues>;
    /** Use for non-Controller fields (e.g. external state like exchange rate) */
    children?: React.ReactNode;
}

export function FormField<TFieldValues extends FieldValues = FieldValues>({
    id,
    label,
    required = false,
    hint,
    hintClassName,
    className,
    labelClassName,
    errorClassName,
    controller,
    children,
}: FormFieldProps<TFieldValues>) {
    const labelContent = (
        <>
            {label}
            {required && <span className="text-destructive"> *</span>}
        </>
    );

    if (controller) {
        return (
            <Controller
                name={controller.name}
                control={controller.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className={className}>
                        <FieldLabel htmlFor={id ?? String(controller.name)} className={labelClassName}>
                            {labelContent}
                        </FieldLabel>
                        {controller.render({ field, fieldState })}
                        {hint && (
                            <FieldDescription className={cn(hintClassName)}>
                                {hint}
                            </FieldDescription>
                        )}
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} className={errorClassName} />
                        )}
                    </Field>
                )}
            />
        );
    }

    return (
        <Field className={className}>
            <FieldLabel htmlFor={id} className={labelClassName}>
                {labelContent}
            </FieldLabel>
            {children}
            {hint && (
                <FieldDescription className={cn(hintClassName)}>
                    {hint}
                </FieldDescription>
            )}
        </Field>
    );
}
