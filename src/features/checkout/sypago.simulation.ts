//For now, this is a mock simulation of the backend/sypago
export const sypagoSimulation = {
    initiatePayment: async (data: any) => {
        console.log("Enviando datos al servidor simulado:", data);

        await new Promise(resolve => setTimeout(resolve, 1500));

        return {
            success: true,
            transactionId: "TX-MOCK-" + Math.floor(Math.random() * 1000000),
            message: "OTP Solicitado correctamente"
        };
    },

    confirmAndPoll: async (transactionId: string, otpCode: string) => {
        console.log(`Verificando OTP ${otpCode} para TX ${transactionId}...`);

        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log("Backend: Iniciando Polling a SyPago...");
        await new Promise(resolve => setTimeout(resolve, 4000));

        return {
            success: true,
            status: "APPROVED",
            message: "Pago debitado exitosamente"
        };
    }
};