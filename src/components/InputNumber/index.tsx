import React, { useEffect, useState } from 'react';
import { Input, InputProps } from '@chakra-ui/react';
import { useFormContext, Controller, RegisterOptions, FieldValues } from 'react-hook-form';

interface InputNumberProps extends Omit<InputProps, 'onChange' | 'value'> {
    name?: string;
    isDecimal?: boolean;
    value?: number;
    onChange?: (value: number) => void;
    max?: number;
    min?: number;
    rules?: RegisterOptions;
    isFormInput?: boolean;
}

const InputNumber: React.FC<InputNumberProps> = ({
    name = '',
    isDecimal = false,
    value: propValue,
    onChange: propOnChange,
    max,
    min,
    rules,
    isFormInput = false,
    ...rest
}) => {
    const methods = useFormContext<FieldValues>();
    const [displayValue, setDisplayValue] = useState<string>('');

    // Efecto para sincronizar el valor inicial
    useEffect(() => {
        const initialValue = propValue !== undefined ? propValue : (isFormInput && methods?.getValues(name)) || 0;
        setDisplayValue(initialValue.toString().replace('.', ','));
    }, [propValue, isFormInput, methods, name]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;

        // Permitir números, punto o coma decimal si isDecimal es true
        const regex = isDecimal ? /^[0-9]*[.,]?[0-9]*$/ : /^[0-9]*$/;
        if (!regex.test(rawValue)) return;

        // Reemplazar punto por coma para visualización (opcional)
        const displayValue = rawValue.replace('.', ',');
        setDisplayValue(displayValue);

        if (rawValue === '') return;

        // Convertir a número (aceptando tanto punto como coma como decimal)
        const numericValue = rawValue.replace(',', '.');
        let num = numericValue === '' ? 0 : parseFloat(numericValue);

        // Aplicar límites si están definidos
        if (max !== undefined && num > max) num = max;
        if (min !== undefined && num < min) num = min;

        if (propOnChange) {
            propOnChange(num);
        }

        if (isFormInput && methods) {
            methods.setValue(name, num, { shouldValidate: true });
        }
    };

    const handleBlur = () => {
        // Convertir comas a puntos para el cálculo
        const numericValue = displayValue.replace(',', '.');
        let num = numericValue === '' ? 0 : parseFloat(numericValue);

        // Aplicar límites si están definidos
        if (max !== undefined && num > max) num = max;
        if (min !== undefined && num < min) num = min;

        // Si el valor no es válido, establecer 0
        if (isNaN(num)) num = 0;

        // Actualizar el valor mostrado (mostrar con coma si es decimal)
        const newDisplayValue = isDecimal
            ? num.toString().replace('.', ',')
            : num.toString();
        setDisplayValue(newDisplayValue);

        // Llamar a onChange con el valor final
        if (propOnChange) {
            propOnChange(num);
        }

        if (isFormInput && methods) {
            methods.setValue(name, num, { shouldValidate: true });
        }
    };

    const renderInput = (field?: any) => (
        <Input
            {...rest}
            {...field}
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            inputMode={isDecimal ? 'decimal' : 'numeric'}
            fontSize={'14px'}
        />
    );

    if (isFormInput && methods) {
        return (
            <Controller
                name={name}
                control={methods.control}
                rules={rules}
                render={({ field }) => renderInput(field)}
            />
        );
    }

    return renderInput();
};

export default InputNumber;