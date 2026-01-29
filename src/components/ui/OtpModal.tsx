import React, { useState, useRef, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface OtpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (otp: string) => void;
    isLoading: boolean;
    otpLength?: number;
}

export const OtpModal: React.FC<OtpModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    otpLength = 8
}) => {
    const [otp, setOtp] = useState<string[]>(new Array(otpLength).fill(""));
    const [timer, setTimer] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        let interval: any;
        if (isOpen && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOpen, timer]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (element.value !== "" && index < otpLength - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (otp[index] === "" && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleResendCode = () => {
        // Simular el reenvío del código
        setTimer(60);
        setOtp(new Array(otpLength).fill(""));
        inputRefs.current[0]?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(otp.join(""));
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="md"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Código de verificación</h2>
                <p className="text-gray-500 mb-6 px-4">
                    Por favor ingrese el código de verificación enviado a su dispositivo ({otpLength} dígitos).
                </p>

                {timer > 0 ? (
                    <p className="text-sm text-gray-400 mb-6">
                        Puede solicitar un nuevo código en: <span className="font-semibold">{timer} segundos</span>
                    </p>
                ) : (
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={handleResendCode}
                            className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                        >
                            Volver a enviar código
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-center gap-2">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-10 h-12 border-2 rounded-lg text-center text-xl font-bold text-gray-900 focus:border-blue-500 focus:outline-none transition-colors border-gray-200"
                            />
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 py-3 text-gray-600 font-semibold"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className={`flex-1 py-3 font-semibold ${otp.join("").length === otpLength ? 'bg-gray-800' : 'bg-gray-400'} border-none text-white`}
                                disabled={otp.join("").length !== otpLength || isLoading}
                            >
                                {isLoading ? 'Procesando...' : 'Pagar'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
