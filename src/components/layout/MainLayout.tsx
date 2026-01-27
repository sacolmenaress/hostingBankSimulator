import { Link, Outlet } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-blue-600">SyPago Bank Simulator</span>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {/* Navigation links */}
                                <Link to="/" className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600">
                                    Inicio
                                </Link>
                                <Link to="/otp" className="text-gray-500 px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600">
                                    OTP
                                </Link>
                                <Link to="/domiciliation" className="text-gray-500 px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600">
                                    Domiciliación
                                </Link>
                                <Link to="/payment-link" className="text-gray-500 px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600">
                                    Link de Pago
                                </Link>
                                <Link to="/credit" className="text-gray-500 px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600">
                                    Crédito
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 w-full">
                <Outlet />
            </main>
        </div>
    );
};