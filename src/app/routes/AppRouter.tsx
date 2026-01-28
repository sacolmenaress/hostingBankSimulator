import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';

// Import pages (Uses Cases)
import { HomePage } from '../../features/home/HomePage';
import { OtpPage } from '../../features/OTP/OtpPage';
import { DomiciliationPage } from '../../features/domiciliation/DomiciliationPage';
import { PaymentLinkPage } from '../../features/payment-link/PaymentLinkPage';
import { CreditPage } from '../../features/credit/CreditPage';
import { CheckoutPage } from '../../features/checkout/CheckoutPage';

export const AppRouter = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/otp" element={<OtpPage />} />
                <Route path="/domiciliation" element={<DomiciliationPage />} />
                <Route path="/payment-link" element={<PaymentLinkPage />} />
                <Route path="/credit" element={<CreditPage />} />

                {/* Default route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};