import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui/Button';
import { sypagoSimulation } from './sypago.simulation';
import { ShoppingCart } from 'lucide-react';
import { OtpModal } from '../../components/ui/OtpModal';
import { TransactionResultModal } from '../../components/ui/TransactionResultModal';

//Static cart items (for demo purposes)
const CART_ITEMS = [
    { id: 1, name: 'Producto Demo 1', desc: 'Producto de demostración integración SyPago.', price: 50.25 },
    { id: 2, name: 'Producto Demo 2', desc: 'Múltiples items en el carrito.', price: 26.74 },
];

export const CheckoutPage = () => {
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [txId, setTxId] = useState('');
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null); // Store form data
    const [transactionResult, setTransactionResult] = useState<{
        success: boolean;
        sypagoReference?: string;
        ibpReference?: string;
        amount?: number;
        recipientName?: string;
        recipientBank?: string;
        recipientPhone?: string;
        recipientId?: string;
        errorMessage?: string;
    }>({ success: false });

    const totalAmount = CART_ITEMS.reduce((acc, item) => acc + item.price, 0);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onInitiate = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await sypagoSimulation.initiatePayment({ ...data, amount: totalAmount });
            if (response.success) {
                setTxId(response.transactionId);
                setPaymentData(data); // Save form data for later use
                setIsOtpModalOpen(true);
            }
        } catch (error) {
            alert('Error al iniciar el pago');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmOtp = async (otpCode: string) => {
        setIsLoading(true);
        try {
            const response = await sypagoSimulation.confirmAndPoll(txId, otpCode);
            setIsOtpModalOpen(false); // Close OTP modal

            if (response.success) {
                setTransactionResult({
                    success: true,
                    sypagoReference: response.sypagoReference,
                    ibpReference: response.ibpReference,
                    amount: totalAmount,
                    recipientName: paymentData?.name,
                    recipientBank: paymentData?.bank_code,
                    recipientPhone: paymentData?.phone,
                    recipientId: `${paymentData?.id_type}-${paymentData?.cid}`
                });
            } else {
                setTransactionResult({
                    success: false,
                    errorMessage: response.message || 'Error en la transacción'
                });
            }
            setIsResultModalOpen(true);
        } catch (error) {
            setIsOtpModalOpen(false);
            setTransactionResult({
                success: false,
                errorMessage: 'Error al procesar la transacción. Intente nuevamente.'
            });
            setIsResultModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 flex justify-center items-start">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-4">
                    {CART_ITEMS.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-start">
                            <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-center h-24 w-24 flex-shrink-0">
                                <ShoppingCart className="w-8 h-8 text-slate-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                                <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                                <p className="text-gray-900 font-bold mt-2 text-xl">{item.price.toFixed(2)} Bs</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-[#0f172a] text-white rounded-xl shadow-xl overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Datos de pago</h2>
                                <div className="relative">
                                    <ShoppingCart className="w-6 h-6 text-white" />
                                    <span className="absolute -top-2 -right-2 bg-blue-500 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                        {CART_ITEMS.length}
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onInitiate)} className="space-y-5">
                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Nombre del pagador</label>
                                    <input
                                        {...register("name", { required: "El nombre es obligatorio" })}
                                        className={`w-full bg-white text-gray-900 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                                        placeholder="Ej: Juan Pérez"
                                    />
                                    {errors.name && <span className="text-red-400 text-xs mt-1 block">{errors.name.message as string}</span>}
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Banco</label>
                                    <select
                                        {...register("bank_code")}
                                        className="w-full bg-white text-gray-900 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="0105">0105 - Mercantil</option>
                                        <option value="0102">0102 - Venezuela</option>
                                        <option value="0134">0134 - Banesco</option>
                                    </select>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Teléfono</label>
                                        <span className="text-xs text-blue-400 cursor-pointer hover:underline">Cambiar a cuenta</span>
                                    </div>
                                    <input
                                        {...register("phone", {
                                            required: "El teléfono es obligatorio",
                                            maxLength: { value: 11, message: "Máximo 11 dígitos" },
                                            pattern: { value: /^[0-9]+$/, message: "Solo números" }
                                        })}
                                        placeholder="04141234567"
                                        className={`w-full bg-white text-gray-900 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
                                    />
                                    {errors.phone && <span className="text-red-400 text-xs mt-1 block">{errors.phone.message as string}</span>}
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Documento de Identidad</label>
                                    <div className="flex gap-2">
                                        <select
                                            {...register("id_type")}
                                            className="bg-white text-gray-900 rounded-md px-2 py-2 text-sm w-18 focus:outline-none"
                                        >
                                            <option value="V">V</option>
                                            <option value="J">J</option>
                                            <option value="E">E</option>
                                        </select>
                                        <input
                                            {...register("cid", { required: "La cédula es obligatoria" })}
                                            placeholder="12345678"
                                            className={`flex-1 bg-white text-gray-900 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.cid ? 'ring-2 ring-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.cid && <span className="text-red-400 text-xs mt-1 block">{errors.cid.message as string}</span>}
                                </div>

                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all border-none"
                                >
                                    Confirmar pago
                                </Button>
                            </form>
                        </div>

                        <div className="bg-[#0b1120] p-6 border-t border-gray-800">
                            <div className="flex justify-between items-center text-sm mb-2 text-gray-400">
                                <span>Productos ({CART_ITEMS.length})</span>
                                <span>{totalAmount.toFixed(2)} Bs</span>
                            </div>
                            <div className="flex justify-between items-center text-xl font-bold text-white mt-4">
                                <span>Total a pagar</span>
                                <span>{totalAmount.toFixed(2)} Bs</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* OTP Verification Modal */}
            <OtpModal
                isOpen={isOtpModalOpen}
                onClose={() => setIsOtpModalOpen(false)}
                onConfirm={handleConfirmOtp}
                isLoading={isLoading}
            />

            {/* Transaction Result Modal */}
            <TransactionResultModal
                isOpen={isResultModalOpen}
                onClose={() => setIsResultModalOpen(false)}
                success={transactionResult.success}
                sypagoReference={transactionResult.sypagoReference}
                ibpReference={transactionResult.ibpReference}
                amount={transactionResult.amount}
                recipientName={transactionResult.recipientName}
                recipientBank={transactionResult.recipientBank}
                recipientPhone={transactionResult.recipientPhone}
                recipientId={transactionResult.recipientId}
                errorMessage={transactionResult.errorMessage}
            />
        </div>
    );
};