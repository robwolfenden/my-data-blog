// Full and final code for: src/components/ContactForm.tsx

"use client";

import { useRef } from 'react';
import { Button, Checkbox, Group, Paper, Radio, Select, Stack, TextInput, Title } from '@mantine/core';
import { useTealium } from '../context/TealiumContext';

export default function ContactForm() {
    const { trackLink } = useTealium();
    const formRef = useRef<HTMLDivElement>(null);

    const handleInteraction = (event: React.MouseEvent | React.ChangeEvent<HTMLInputElement> | string | null, action: string, content: string) => {
        trackLink({
            event_action: action,
            event_content: content,
        });
    };
    
    // Generic handler for form inputs to get their associated label
    const getLabel = (element: HTMLElement | null): string => {
        if (!element) return 'N/A';
        const id = element.id;
        if (id) {
            const label = formRef.current?.querySelector(`label[for="${id}"]`);
            return label?.textContent || 'N/A';
        }
        return 'N/A';
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        const label = getLabel(target);
        
        if (target.type === 'checkbox') {
            handleInteraction(e, 'checkbox click', `${label}: ${target.checked}`);
        } else if (target.type === 'radio') {
            handleInteraction(e, 'radio button click', `${label}: ${target.value}`);
        }
    }

    return (
        <Paper ref={formRef} shadow="sm" p="xl" radius="md" withBorder mt="xl">
            <Title order={2} mb="lg">Contact Us</Title>
            <Stack>
                <TextInput
                    label="Full Name"
                    placeholder="John Doe"
                    id="full-name"
                />
                 <Select
                    label="Inquiry Type"
                    placeholder="Pick value"
                    data={['Sales', 'Support', 'General']}
                    onChange={(value) => handleInteraction(value, 'dropdown select', `Inquiry Type: ${value}`)}
                />
                <Radio.Group 
                    name="contactMethod" 
                    label="Preferred Contact Method"
                >
                    <Group mt="xs">
                        <Radio value="email" label="Email" id="contact-email" onChange={handleChange} />
                        <Radio value="phone" label="Phone" id="contact-phone" onChange={handleChange} />
                    </Group>
                </Radio.Group>
                <Checkbox
                    mt="md"
                    label="I agree to the terms and conditions"
                    id="terms-agree"
                    onChange={handleChange}
                />

                <Button 
                    mt="lg"
                    onClick={(e) => handleInteraction(e, 'button click', e.currentTarget.textContent || 'N/A')}
                >
                    Submit Inquiry
                </Button>
            </Stack>
        </Paper>
    );
}
