import { Badge, Button, Dialog, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, styled, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useAppUser } from "../context/AppUser.context"
import { useCallback, useEffect, useState } from "react";
import { getAllUsers } from "../api/user";
import IUser from "../interfaces/User.interface";
import { DayPicker } from "react-day-picker";
import dayjs, { Dayjs } from "dayjs";
import { getAllPayments, getPayments } from "../api/payments";
import { format, formatDistanceToNow } from 'date-fns';

interface Payment {
    id: string;
    user_id: string;
    description: string;
    amount: number;
    due_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

// Styled TableCell for Amount
const AmountCell = styled(TableCell)(({ theme }) => ({
    fontWeight: '500',
    textAlign: 'right',
}));

// Styled TableCell for Index
const IndexCell = styled(TableCell)(({ theme }) => ({
    fontWeight: '400',
    textAlign: 'left',
    width: '40px'
}));

// Styled Badge for Status
const StatusBadge = styled(Badge)(({ theme }) => {
    let backgroundColor = '';
    let color = '#fff';

    return {
        '& .MuiBadge-badge': {
            backgroundColor,
            color,
            borderRadius: '8px',
            padding: '0 8px',
            fontSize: '0.75rem',
            fontWeight: '500',
            height: '20px',
            minWidth: '40px',
            boxShadow: `0 1px 3px 0 rgba(0 0 0 / 0.1), 0 1px 2px -1px rgba(0 0 0 / 0.1)`,
        },
    };
});

const PaymentManagement = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [newPayment, setNewPayment] = useState<
        Omit<Payment, 'id' | 'created_at' | 'updated_at' | 'status'>
    >({
        user_id: '',
        description: '',
        amount: 0,
        due_date: '',
    });

    const { canEditPayments } = useAppUser();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();

                const data = response.data as any;
                if (response.status !== 200) {
                    throw new Error(data.message || 'Failed to fetch users');
                }

                setUsers(data.users);
                setSelectedUser(data.users[0])
            } catch (error: any) {
                setError(error.message);
            }
        };
        if (canEditPayments) {
            fetchUsers();
        }
    }, [canEditPayments]);


    // Fetch payments
    const fetchPayments = useCallback(async () => {
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
    }, [canEditPayments])

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const handleSelectedUser = (id: any) => {
        const user = users.find(u => u.id.trim() === id.trim())
        console.log({ user })

        if (user) {
            setSelectedUser(user)
            setNewPayment({ ...newPayment, user_id: id })
        }
    }

    const openDialog = () => setIsCreating(true);

    const handleDateChange = (date: any) => {
        setSelectedDate(date);
        setNewPayment({ ...newPayment, due_date: date ? date : '' });
    };


    const handleUpdateStatus = async (paymentId: string, status: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/payments/${paymentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token
                },
                body: JSON.stringify({ status }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update payment status');
            }
            const updatedPayment: Payment = await response.json();

            // setPayments(
            //     payments.map((p) =>
            //         p.id === paymentId ? { ...p, status: updatedPayment.status } : p,
            //     ),
            // );

        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const styleStatus = (status: string) => {
        let backgroundColor = '';
        let color = '#fff';

        switch (status) {
            case 'pending':
                backgroundColor = '#f59e0b'; // Amber
                color = '#000';
                break;
            case 'paid':
                backgroundColor = '#16a34a'; // Green
                break;
            case 'overdue':
                backgroundColor = '#dc2626'; // Red
                break;
            case 'cancelled':
                backgroundColor = '#6b7280'; // Gray
                break;
            default:
                backgroundColor = '#6b7280';
        }

        return { backgroundColor, color }
    }
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Payments</h2>


            {canEditPayments && (
                <Button onClick={openDialog} className="mb-4">
                    Create Payment Request
                </Button>
            )}


            <Dialog open={isCreating} onClose={() => setIsCreating(false)}>
                <DialogTitle>Create New Payment Request</DialogTitle>

                <DialogContent>

                    {users.length && selectedUser &&

                        <FormControl fullWidth>
                            <InputLabel id="user-select-label">User</InputLabel>
                            <Select
                                labelId="user-select-label"
                                id="user-select"
                                name="user"
                                defaultValue={users[0].first_name + ' ' + users[0].last_name}
                                value={selectedUser.first_name + ' ' + selectedUser.last_name}
                                onChange={(e) => handleSelectedUser(e.target.value)}
                            >
                                {users.map((u) => (
                                    <MenuItem key={u.id} value={u.id}>
                                        {u.first_name + ' ' + u.last_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    }
                    <div className="mb-3">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <TextField
                            type="text"
                            id="description"
                            value={newPayment.description}
                            onChange={(e) =>
                                setNewPayment({ ...newPayment, description: e.target.value })
                            }
                            className="mt-1 w-full"
                            label="Description"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Amount
                        </label>
                        <TextField
                            type="number"
                            id="amount"
                            value={newPayment.amount}
                            onChange={(e) =>
                                setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) })
                            }
                            className="mt-1 w-full"
                            label="Amount"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                            Due Date
                        </label>
                        <MyDatePicker selected={selectedDate} onChange={handleDateChange} />
                    </div>

                </DialogContent>
            </Dialog>


            {loading ? (
                <p>Loading payments...</p>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHead>#</TableHead>
                            {canEditPayments && <TableHead>User ID</TableHead>}
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            {canEditPayments && <TableHead>Actions</TableHead>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.length > 0 ? (
                            payments.map((payment, index) => (
                                <TableRow key={payment.id}>
                                    <IndexCell>{index + 1}.</IndexCell>
                                    {canEditPayments && <TableCell>{payment.user_id}</TableCell>}
                                    <TableCell>{payment.description}</TableCell>
                                    <AmountCell>${payment.amount.toLocaleString()}</AmountCell>
                                    <TableCell>{format(new Date(payment.due_date), 'PPP')}</TableCell>
                                    <TableCell>
                                        <StatusBadge style={styleStatus(payment.status)}>
                                            {payment.status}
                                        </StatusBadge>
                                    </TableCell>
                                    <TableCell>
                                        {formatDistanceToNow(new Date(payment.created_at), {
                                            addSuffix: true,
                                        })}
                                    </TableCell>
                                    {canEditPayments && (
                                        <TableCell>
                                            <Select
                                                onChange={(value: any) =>
                                                    handleUpdateStatus(payment.id, value)
                                                }
                                                value={payment.status}
                                            >
                                                <MenuItem value='pending'>
                                                    Pending
                                                </MenuItem>
                                                <MenuItem value='overdue'>
                                                    Overdue
                                                </MenuItem>
                                                <MenuItem value='cancelled'>
                                                    Cancelled
                                                </MenuItem>
                                                <MenuItem value='paid'>
                                                    Paid
                                                </MenuItem>
                                            </Select>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={canEditPayments ? 7 : 6}
                                    className="text-center"
                                >
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

export default PaymentManagement;

const StyledDayPicker = styled(DayPicker)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // border: `1.4px solid ${theme.palette.divider}`, // Use theme's divider
    borderRadius: '8px',
    padding: theme.spacing(2),
    // boxShadow: theme.shadows[2],              // Add shadow for depth
    backgroundColor: theme.palette.background.paper, // Use theme's background
    height: 'auto',
    width: 'auto',
    maxWidth: '450px',

    '.rdp-head': {
        color: theme.palette.text.primary,
        fontWeight: '600',
        paddingBottom: theme.spacing(1),
    },
    '.rdp-nav': {
        marginBottom: theme.spacing(1),
    },
    '.rdp-nav-button': {
        color: theme.palette.action.active,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    '.rdp-month': {
        padding: 0,
        backgroundColor: theme.palette.background.paper,
        borderRadius: '8px',
    },
    '.rdp-table': {
        borderCollapse: 'collapse',
        border: 'none',
        margin: 0,
    },

    '.rdp-tbody': {
        border: 'none'
    },
    '.rdp-day': {
        padding: '8px',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, color 0.3s',
        color: theme.palette.text.primary,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.primary.main,
        },
        '&[aria-selected="true"]': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        },
        '&:disabled': {
            color: theme.palette.text.disabled,
            backgroundColor: 'transparent',
            cursor: 'default',
            '&:hover': {
                backgroundColor: 'transparent',
                color: theme.palette.text.disabled,
            },
        },
    },
    '.rdp-caption': {
        paddingTop: theme.spacing(2),
        color: theme.palette.text.secondary,
        fontSize: '0.875rem',
        textAlign: 'center',
    },
}));

type MyDatePickerProps = {
    onChange: (day: any) => void
    selected: any
}
function MyDatePicker({ selected, onChange }: MyDatePickerProps) {

    return (
        <StyledDayPicker
            mode="single"
            selected={selected}
            onSelect={day => onChange(day)}
            footer={
                <Typography variant="caption" color="textSecondary">
                    {selected ? `Selected: ${selected}` : "Pick a day."}
                </Typography>
            }
        />
    );
}