import type { OtpRequestForm } from './otp.schema';

export const otpService = {
    initiatePayment: async (data: OtpRequestForm) => {
        console.log('Enviando datos al backend:', data);
        await new Promise(resolve => setTimeout(resolve, 1500)); // False delay to simulate backend,meanwhile i will create the backend
        return {
            success: true,
            transactionId: 'TX-123456',
            message: 'OTP enviado a tu celular'
        };
    },



    confirmPayment: async (transactionId: string, otpCode: string) => {
        console.log(`Validando OTP ${otpCode} para TX ${transactionId}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { success: true, status: 'APPROVED' };
    }
};