import { OtpPaymentForm } from '../OTP/OtpPaymentForm';

export const OtpPage = () => {
    return (
        <div className="space-y-6 p-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Pago con OTP (C2P)</h1>
                <p className="mt-2 text-gray-600">
                    Ingresa tus datos bancarios para procesar el débito automático.
                </p>
            </div>


            <OtpPaymentForm />
        </div>
    );
};