import { Stepper, Step, StepLabel, StepIconProps, Box } from '@mui/material';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { Check } from '@mui/icons-material';

const steps = ['Learn', 'Connect', 'Join', 'Settle', 'Thrive'];

function CustomStepIcon(props: StepIconProps) {
    const { active, completed, icon } = props;
    return (
        <Box
            sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: completed ? '#4caf50' : active ? '#81c784' : '#c8e6c9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
            }}
        >
            {completed ? <Check fontSize="small" /> : icon}
        </Box>
    );
}

export default function OnboardingSteps() {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

    return (
        <Box ref={ref} sx={{ my: 8 }}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
            >
                <Stepper activeStep={4} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={label} completed={index < 4} >
                            <StepLabel sx={{color: 'white'}} StepIconComponent={CustomStepIcon}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </motion.div>
        </Box>
    );
}
