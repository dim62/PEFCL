import React, { useState } from 'react';
import { CompareArrows } from '@mui/icons-material';
import { Box, IconButton, LinearProgress, Stack } from '@mui/material';
import { useAtom } from 'jotai';
import { accountsAtom, defaultAccountAtom } from '../../data/accounts';
import { Heading2, Heading5 } from '../ui/Typography/Headings';
import AccountSelect from '../AccountSelect';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import PriceField from '../ui/Fields/PriceField';
import { fetchNui } from '../../utils/fetchNui';
import { transactionsAtom } from 'src/data/transactions';
import { TransactionEvents } from '@typings/Events';
import { Transfer } from '@typings/transactions';

const TransferFundsModal: React.FC<{ onClose(): void }> = ({ onClose }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [accounts, updateAccounts] = useAtom(accountsAtom);
  const [, updateTransactions] = useAtom(transactionsAtom);
  const [defaultAccount] = useAtom(defaultAccountAtom);
  const [fromAccountId, setFromAccountId] = useState(defaultAccount?.id ?? 0);
  const [toAccountId, setToAccountID] = useState(0);
  const [isTransfering, setIsTransfering] = useState(false);

  const parsedAmount = Number(amount.replace(/\D/g, ''));
  const fromAccount = accounts.find((account) => account.id === fromAccountId);

  const switchAccounts = () => {
    setFromAccountId(toAccountId);
    setToAccountID(fromAccountId);
  };

  const handleStartTransfer = async () => {
    setIsTransfering(true);

    const payload: Transfer = {
      amount: parsedAmount,
      message: t('Internal transfer'),
      fromAccountId,
      toAccountId,
    };

    await fetchNui(TransactionEvents.CreateTransfer, payload).finally(() => {});
    await updateAccounts();
    await updateTransactions();

    setIsTransfering(false);
    onClose();
  };

  const isAmountTooHigh = fromAccount && fromAccount.balance < parsedAmount;
  const isAmountTooLow = parsedAmount <= 0;
  const isToAccountSelected = toAccountId > 0;
  const isSameAccount = toAccountId === fromAccountId;
  const isDisabled =
    isSameAccount || !parsedAmount || !isToAccountSelected || isAmountTooHigh || isAmountTooLow;

  return (
    <>
      <Box p={5} display="flex" flexDirection="column">
        <Stack spacing={4}>
          <Heading2>{t('Transfer')}</Heading2>

          <Stack direction="row" spacing={4}>
            <Stack flex={1} spacing={1}>
              <Heading5>From account</Heading5>
              <AccountSelect
                onSelect={setFromAccountId}
                accounts={accounts}
                selectedId={fromAccountId}
              />
            </Stack>

            <IconButton onClick={switchAccounts} color="inherit" sx={{ alignSelf: 'center' }}>
              <CompareArrows />
            </IconButton>

            <Stack flex={1} spacing={1}>
              <Heading5>To account</Heading5>
              <AccountSelect
                onSelect={setToAccountID}
                accounts={accounts}
                selectedId={toAccountId}
              />
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Heading5>Amount</Heading5>
            <PriceField
              placeholder="amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </Stack>

          <Stack alignSelf="flex-end" direction="row" spacing={4}>
            <Button color="error" onClick={onClose}>
              {t('Cancel')}
            </Button>
            <Button disabled={isDisabled} onClick={handleStartTransfer}>
              {t('Transfer')}
            </Button>
          </Stack>
        </Stack>
      </Box>
      {isTransfering && <LinearProgress />}
    </>
  );
};

export default TransferFundsModal;