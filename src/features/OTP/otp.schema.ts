import { z } from 'zod';

// Schema to request OTP
export const otpRequestSchema = z.object({
    amount: z.number().min(0.50, 'El monto mínimo es 0.50'),
    concept: z.string().min(3, 'El concepto es obligatorio'),
    id_number: z.string().min(6, 'Cédula inválida (min 6 dígitos)').regex(/^\d+$/, 'Solo números'),
    phone: z.string().length(11, 'El teléfono debe tener 11 dígitos (ej: 0414...)').regex(/^\d+$/, 'Solo números'),
    bank_code: z.string().length(4, 'Código de banco inválido (4 dígitos)'),
});

// Validate OTP code
export const otpVerifySchema = z.object({
    otp_code: z.string().length(6, 'El código OTP debe tener 6 dígitos'),
});

export type OtpRequestForm = z.infer<typeof otpRequestSchema>;
export type OtpVerifyForm = z.infer<typeof otpVerifySchema>;