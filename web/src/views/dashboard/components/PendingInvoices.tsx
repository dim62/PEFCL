import { useAtom } from 'jotai';
import React from 'react';
import { pendingInvoicesAtom } from '../../../data/invoices';
import InvoiceItem from '@components/InvoiceItem';
import { Stack } from '@mui/material';

const PendingInvoices: React.FC = () => {
  const [invoices] = useAtom(pendingInvoicesAtom);

  return (
    <Stack spacing={2}>
      {invoices.map((invoice) => (
        <InvoiceItem key={invoice.id} invoice={invoice} />
      ))}
    </Stack>
  );
};

export default PendingInvoices;
