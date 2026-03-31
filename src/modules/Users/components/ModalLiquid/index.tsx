import { useFetch } from "@/hooks/useFetch";
import { Payment } from "@/modules/Orders/components/BuyCartRigth";
import { ExchangeRates } from "@/modules/Orders/components/BuyCartRigth/ExchangeRates";
import { FormDataPayment } from "@/modules/Orders/components/BuyCartRigth/FormDataPayment";
import { PaymentsList } from "@/modules/Orders/components/BuyCartRigth/PaymentsList"
import { PaymentSummary } from "@/modules/Orders/components/BuyCartRigth/PaymentSummary";
import { CurrencyType } from "@/types/CurrencyType";
import { UserType } from "@/types/UserType";
import { Button, Divider, Stack, useToast } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";

export const ModalLiquid = ({
    user,
    totalUsd,
    onUpdate
}: {
    user: UserType;
    totalUsd: number
    onUpdate: () => void
}) => {
    const toast = useToast()
    const { handleFetch, isLoading } = useFetch();
    const [currencies, setCurrencies] = useState<CurrencyType[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);

    const handleLiquidAccount = async () => {
        const data = {
            userId: user.id,
            payments
        }

        const response = await handleFetch("/orders/liquid", "POST", data)
        if (response.status == 201) {
            const data = (await response.json())
            toast({
                description: data.message,
                status: 'success'
            })
            onUpdate()
        }
        else {
            toast({
                description: (await response.json()).error,
                status: 'error'
            })
        }
    }

    // Cargar monedas
    const handleLoadCurrencies = async () => {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '100');
        const res = await handleFetch(`/currencies?${params}`, "GET");
        if (res.status === 200) {
            const json = await res.json();
            setCurrencies(json.data);
            return json.data
        } else {
            toast({
                title: "Error Cargando",
                description: "Ha ocurrido un error al cargar las monedas",
                status: 'error',
                variant: 'subtle',
                position: 'top-right'
            });
        }
        return []
    };

    // Eliminar pago
    const handleRemovePayment = (index: number) => {
        setPayments(prev => prev.filter((_, i) => i !== index));
    };

    // Actualizar tarjeta de un pago existente
    const handleUpdateCard = (index: number, cardId: string | null) => {
        setPayments(prev => prev.map((p, i) => i === index ? { ...p, cardId } : p));
    };

    const handleLoadWallet = async (currencies: CurrencyType[]) => {
        if (currencies.length > 0) {
            const res = await handleFetch(`/users/${user.id}`, "GET");
            if (res.status == 200) {
                const data = await res.json()
                const wallet = parseFloat(data.wallet)

                const amount = wallet <= totalUsd ? wallet : totalUsd
                if (payments.find(e => e.isWallet == true) == undefined && amount > 0)
                    setPayments([
                        ...payments,
                        {
                            amount,
                            currencyId: currencies.find(e => e.code == 'USD').id,
                            cardId: undefined,
                            isWallet: true
                        }
                    ])
                else if (amount > 0) {
                    const temp = JSON.parse(JSON.stringify(payments))
                    temp.find(e => e.isWallet == true).amount = amount
                    setPayments(temp)
                }
            }
        }
    }

    useEffect(() => {
        const load = async () => {
            const currencies = await handleLoadCurrencies();
            await handleLoadWallet(currencies)
        }
        load()
    }, []);

    return (
        <Stack>
            {/* Lista de pagos agregados */}
            <PaymentsList
                isLoading={isLoading}
                currencies={currencies}
                payments={payments}
                handleUpdateCard={handleUpdateCard}
                handleRemovePayment={handleRemovePayment}
            />

            <Divider />

            {/* Tasas de cambio */}
            <ExchangeRates
                isLoading={isLoading}
                currencies={currencies}
            />

            <Divider />

            {/* Formulario para agregar pago */}
            <FormDataPayment
                totalUsd={totalUsd}
                currencies={currencies}
                payments={payments}
                setPayments={setPayments}
            />

            {/* Resumen de pagos */}
            <PaymentSummary
                totalUsd={totalUsd}
                payments={payments}
                currencies={currencies}
                showTotalPaid={false}
            />

            {/* Botón finalizar orden */}
            <Button
                colorScheme="primary.500"
                size="md"
                leftIcon={<FiShoppingCart />}
                onClick={() => handleLiquidAccount()}
                isDisabled={isLoading || payments.length === 0}
            >
                Liquidar Cuenta
            </Button>
        </Stack>
    )
}