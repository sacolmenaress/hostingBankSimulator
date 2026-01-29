import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { CheckCircle, XCircle } from 'lucide-react';

interface TransactionResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    success: boolean;
    sypagoReference?: string;
    ibpReference?: string;
    amount?: number;
    recipientName?: string;
    recipientBank?: string;
    recipientPhone?: string;
    recipientId?: string;
    errorMessage?: string;
}

export const TransactionResultModal: React.FC<TransactionResultModalProps> = ({
    isOpen,
    onClose,
    success,
    sypagoReference,
    ibpReference,
    amount = 0,
    recipientName,
    recipientBank,
    recipientPhone,
    recipientId,
    errorMessage
}) => {
    const formatDate = () => {
        const now = new Date();
        return now.toLocaleDateString('es-VE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="lg"
        >
            <div className="py-4">
                {success ? (
                    <>
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="w-16 h-16 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">
                            ¡Pago Exitoso!
                        </h2>
                        <p className="text-gray-500 mb-6 text-center text-sm">
                            Su transacción ha sido procesada correctamente
                        </p>

                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-green-700 font-semibold mb-1">
                                        REF. SYPAGO
                                    </p>
                                    <p className="text-sm font-mono font-bold text-green-900">
                                        {sypagoReference}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-green-700 font-semibold mb-1">
                                        REF. IBP
                                    </p>
                                    <p className="text-sm font-mono font-bold text-green-900">
                                        {ibpReference}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900 text-white rounded-lg p-6 mb-6 text-center">
                            <p className="text-sm text-gray-400 mb-2">Monto</p>
                            <p className="text-4xl font-bold">{amount.toFixed(2)} Bs</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-5 mb-6 space-y-3">
                            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                                Detalles de la Transacción
                            </h3>

                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <span className="text-sm text-gray-600">Fecha y Hora</span>
                                <span className="text-sm font-semibold text-gray-900">{formatDate()}</span>
                            </div>

                            {recipientName && (
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-sm text-gray-600">Receptor</span>
                                    <span className="text-sm font-semibold text-gray-900">{recipientName}</span>
                                </div>
                            )}

                            {recipientId && (
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-sm text-gray-600">Cédula</span>
                                    <span className="text-sm font-semibold text-gray-900">{recipientId}</span>
                                </div>
                            )}

                            {recipientPhone && (
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-sm text-gray-600">Teléfono</span>
                                    <span className="text-sm font-semibold text-gray-900">{recipientPhone}</span>
                                </div>
                            )}

                            {recipientBank && (
                                <div className="flex justify-between py-2">
                                    <span className="text-sm text-gray-600">Banco</span>
                                    <span className="text-sm font-semibold text-gray-900">{recipientBank}</span>
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg border-none"
                        >
                            Continuar
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center mb-4">
                            <XCircle className="w-20 h-20 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                            Transacción Rechazada
                        </h2>
                        <p className="text-gray-500 mb-6 text-center">
                            {errorMessage || 'No se pudo procesar su pago. Por favor, intente nuevamente.'}
                        </p>

                        <Button
                            onClick={onClose}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg border-none"
                        >
                            Intentar de nuevo
                        </Button>
                    </>
                )}
            </div>
        </Modal>
    );
};
