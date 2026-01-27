# hostingBankSimulator - Simulador de pago ecommerce

### Estructura de carpetas 
``` bash 
src/
├── app/                  # Configuración global
│   ├── routes/
│   └── providers/
│
├── components/           # UI Reutilizable
│   ├── ui/
│   └── layout/
│
├── features/             # Casos de uso
│   ├── otp/              # Pago por OTP
│   ├── domiciliation/    # Domiciliación
│   ├── payment-link/     # Link de Pago
│   └── credit/           # Crédito
│
├── hooks/                # Hooks personalizados globales
├── lib/                  # Configuraciones de librerías
├── types/                # Interfaces de TypeScript globales
│
├── App.tsx
├── main.tsx
└── index.css
```
