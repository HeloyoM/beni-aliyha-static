import { Button, styled, Typography } from "@mui/material";
import { DayPicker } from "react-day-picker";

const StyledDayPicker = styled(DayPicker)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '8px',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
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
        transition: 'background-color 0.3s, color 0.3s, transform 0.2s',
        color: theme.palette.text.primary,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.primary.main,
            transform: 'scale(1.05)',
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

type Props = {
    onChange: (day: any) => void
    selected: any
}
function AppDatePicker({ selected, onChange }: Props) {

    return (
        <StyledDayPicker
            mode="single"
            selected={selected}
            onSelect={day => onChange(day)}
            footer={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="textSecondary">
                        {selected ? `Selected: ${selected}` : "Pick a day."}
                    </Typography>
                    <Button variant="text" onClick={() => onChange(null)}>
                        Clear
                    </Button>
                </div>
            }
        />
    );
}

export default AppDatePicker;