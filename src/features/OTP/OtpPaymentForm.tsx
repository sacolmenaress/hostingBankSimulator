import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpRequestSchema, otpVerifySchema, type OtpRequestForm, type OtpVerifyForm } from './otp.schema';
import { otpService } from './otp.services';
import { CircleCheck } from 'lucide-react';

// UI Components reusable
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export const OtpPaymentForm = () => {
    const [step, setStep] = useState<'INIT' | 'VERIFY' | 'SUCCESS'>('INIT');
    const [isLoading, setIsLoading] = useState(false);
    const [transactionId, setTransactionId] = useState<string | null>(null);

    const requestForm = useForm<OtpRequestForm>({
        resolver: zodResolver(otpRequestSchema),
        defaultValues: {
            amount: 0,
            concept: '',
            bank_code: '0102',
            id_number: '',
            phone: '',
        }
    });


    // OTP Form
    const verifyForm = useForm<OtpVerifyForm>({
        resolver: zodResolver(otpVerifySchema)
    });

    const onRequestSubmit: SubmitHandler<OtpRequestForm> = async (data) => {
        setIsLoading(true);
        try {
            const result = await otpService.initiatePayment(data);
            if (result.success) {
                setTransactionId(result.transactionId);
                setStep('VERIFY');
            }
        } catch (error) {
            console.error('Error iniciando pago', error);
            alert('Error al iniciar la transacción');
        } finally {
            setIsLoading(false);
        }
    };

    const onVerifySubmit: SubmitHandler<OtpVerifyForm> = async (data) => {
        if (!transactionId) return;
        setIsLoading(true);
        try {
            const result = await otpService.confirmPayment(transactionId, data.otp_code);
            if (result.success) {
                setStep('SUCCESS');
            }
        } catch (error) {
            console.error('Error validando OTP', error);
            alert('Código OTP inválido');
        } finally {
            setIsLoading(false);
        }
    };


    if (step === 'SUCCESS') {
        return (
            <Card className="max-w-md mx-auto mt-10 border-green-500">
                <CardContent className="pt-6 text-center">
                    <CircleCheck />
                    <h2 className="text-2xl font-bold text-green-700">¡Pago Exitoso!</h2>
                    <p className="text-gray-600 mt-2">Tu transacción ha sido aprobada correctamente.</p>
                    <Button
                        variant="outline"
                        className="mt-6 w-full"
                        onClick={() => { setStep('INIT'); requestForm.reset(); }}
                    >
                        Nueva Operación
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-w-md mx-auto mt-6">
            <CardHeader>
                <CardTitle>{step === 'INIT' ? 'Pago Móvil C2P (OTP)' : 'Verificación de Seguridad'}</CardTitle>
            </CardHeader>
            <CardContent>

                {step === 'INIT' && (
                    <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Monto (Bs)"
                                type="number"
                                step="0.01"
                                {...requestForm.register('amount')}
                                error={requestForm.formState.errors.amount?.message}
                            />
                            <Input
                                label="Código Banco"
                                maxLength={4}
                                placeholder="0102"
                                {...requestForm.register('bank_code')}
                                error={requestForm.formState.errors.bank_code?.message}
                            />
                        </div>

                        <Input
                            label="Cédula de Identidad"
                            placeholder="V-12345678"
                            {...requestForm.register('id_number')}
                            error={requestForm.formState.errors.id_number?.message}
                        />

                        <Input
                            label="Teléfono Celular"
                            placeholder="04141234567"
                            maxLength={11}
                            {...requestForm.register('phone')}
                            error={requestForm.formState.errors.phone?.message}
                        />

                        <Input
                            label="Concepto"
                            placeholder="Pago de servicios"
                            {...requestForm.register('concept')}
                            error={requestForm.formState.errors.concept?.message}
                        />

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Solicitar Clave OTP
                        </Button>
                    </form>
                )}

                {step === 'VERIFY' && (
                    <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-6">
                        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                            Hemos enviado un código SMS a tu celular. Ingrésalo para confirmar el débito.
                        </div>

                        <Input
                            label="Código OTP recibido"
                            placeholder="123456"
                            className="text-center text-2xl tracking-widest"
                            maxLength={6}
                            {...verifyForm.register('otp_code')}
                            error={verifyForm.formState.errors.otp_code?.message}
                        />

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                className="w-1/3"
                                onClick={() => setStep('INIT')}
                                disabled={isLoading}
                            >
                                Atrás
                            </Button>
                            <Button type="submit" className="w-2/3" isLoading={isLoading}>
                                Confirmar Pago
                            </Button>
                        </div>
                    </form>
                )}

            </CardContent>
        </Card>
    );
};