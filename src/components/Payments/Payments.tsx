import React, { useEffect, useState } from "react";
import QuickAddPayment from "./QuickAddPayment";
import PaymentsTable from "./PaymentsTable";
import IPayment from "../../interfaces/IPayment.interface";
import { useAppUser } from "../../context/AppUser.context";
import { getAllPayments, getPayments } from "../../api/payments";
import { PlusCircle } from "lucide-react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { actionClicked } from "../../api/user";

const Payments = () => {
    const [payments, setPayments] = useState<IPayment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [setIsInsertingPayment, setInsertingPayment] = useState<Boolean>(false);

    const { canEditPayments } = useAppUser();

    const fetchPayments = async () => {
        try {

            const response = canEditPayments ? await getAllPayments() : await getPayments();

            const data = response.data as any;

            if (response.status !== 200) {
                throw new Error(data.message || 'Failed to fetch payments');
            }

            setPayments(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (canEditPayments) {
            fetchPayments();
        }
    }, [canEditPayments])


    const handleDonateClick = async () => {
        try {
            await actionClicked('donate');
        } catch (err) {
            console.error("Failed to record click", err);
        }

        // Redirect to Matara platform
        window.open("https://www.matara.pro/nedarimplus/online/?mosad=7009971", "_blank");
    };

    return (
        <React.Fragment>
            <Card sx={{ mb: 3, background: 'linear-gradient(to right, #ffe0e3, #fff6f0)', border: '1px solid #90caf9' }}>
                <CardContent>

                    <Typography variant="h6" gutterBottom>
                        💙 Support our Community via Matara!
                    </Typography>

                    <Typography variant="body2" mb={2}>
                        Secure online donations through a trusted non-profit platform. Every contribution helps us grow!
                    </Typography>

                    <Button
                        onClick={handleDonateClick}
                        variant="contained"
                        size="large"
                        // href="https://www.matara.pro/nedarimplus/online/?mosad=7009971"
                        // target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            mt: 2,
                            px: 5,
                            py: 1.5,
                            fontWeight: 600,
                            fontSize: '1rem',
                            borderRadius: 3,
                            background: 'linear-gradient(to right, #ff4081, #f50057)',
                            color: 'white',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                background: 'linear-gradient(to right, #f50057, #d500f9)',
                            },
                        }}
                    >
                        Donate Now
                    </Button>
                </CardContent>

            </Card>

            <Button
                variant="outlined"
                onClick={() => setInsertingPayment(!setIsInsertingPayment)}
                style={{ marginTop: '10px' }}
            >
                {setIsInsertingPayment ? 'Cancel' : 'Create New Payment'} <PlusCircle size={16} style={{ marginLeft: '5px' }} />
            </Button>

            {setIsInsertingPayment && (
                <React.Fragment>
                    <QuickAddPayment setPayments={setPayments} />
                    <PaymentsTable payments={payments} />
                </React.Fragment>
            )}


        </React.Fragment>
    )
}

export default Payments;