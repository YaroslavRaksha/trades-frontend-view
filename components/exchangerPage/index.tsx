import {useState, useEffect} from "react";
import styles from '../../styles/Exchanger.module.css';
import {ExchangerType} from "../../helpers/customTypings";
import CurrencyCard from "./CurrencyCard";
import TradesTable from "./tradesTable/index";
import ExistenceTable from "../exchangerPage/existenceTable";
import nextApiInstance from "../../utils/nextApiInstance";
import getErrorMessage from "../../helpers/getErrorMessage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formatDateWithTimeZone = (date: any) => {
    const options = { timeZone: 'Europe/Kiev' };
    return date.toLocaleString('en-US', options).split(',')[0];
};

const ExchangerPage = ({ exchangerData }: any) => {

    const { id, address, currencies }: ExchangerType = exchangerData;

    const [initialExchangerData, setInitialExchangerData] = useState({
        address: address,
        currencies: currencies,
    })

    const currentDate = formatDateWithTimeZone(new Date());

    const [currentExistence, setCurrentExistence] = useState<any>([]);
    const [morningExistence, setMorningExistence] = useState<any>([]);
    const [tradesData, setTradesData] = useState<any>([]);
    const [selectedDate, setSelectedDate] = useState<string>(currentDate);

    const [selectedCurrency, setSelectedCurrency] = useState(
        initialExchangerData?.currencies &&
        initialExchangerData?.currencies[0]);

    const handleDateChange = (date: any) => {
        const formattedDate = formatDateWithTimeZone(date);
        setSelectedDate(formattedDate);
    };

    const getCurrentExistence = ({ morningExistence, trades }: any) => {

        return morningExistence.map(({ currency, amount }: any) => {
            if (currency === 'uah') {
                const buySum = trades
                    .filter((trade: any) => trade.type === 'buy')
                    .reduce((sum: any, trade: any) => sum + parseFloat(trade.course) * parseFloat(trade.amount), 0);

                const saleSum = trades
                    .filter((trade: any) => trade.type === 'sale')
                    .reduce((sum: any, trade: any) => sum + parseFloat(trade.course) * parseFloat(trade.amount), 0);

                const buyMinusSaleAmount = buySum - saleSum;

                return {
                    currency: currency,
                    amount: parseFloat(amount) - buyMinusSaleAmount
                };
            } else {
                const buyAmountSum = trades
                    .filter((trade: any) => trade.type === 'buy' && trade.currency?.toLowerCase() === currency?.toLowerCase())
                    .reduce((sum: any, trade: any) => sum + parseFloat(trade.amount), 0);

                const saleAmountSum = trades
                    .filter((trade: any) => trade.type === 'sale' && trade.currency?.toLowerCase() === currency?.toLowerCase())
                    .reduce((sum: any, trade: any) => sum + parseFloat(trade.amount), 0);

                return {
                    currency: currency,
                    amount: parseFloat(amount) - saleAmountSum + buyAmountSum
                };
            }
        });
    };

    const getMorningExistenceData = async () => {
        const morningExistenceResponse = await nextApiInstance.get(
            `/api/morningExistence/${id}?date=${selectedDate}`
        );
        return morningExistenceResponse?.data || [];
    }

    const getTradesData = async () => {
        const tradesDataResponse = await nextApiInstance.get(
            `/api/trades?exchangerId=${id}&date=${selectedDate}`
        );

        return tradesDataResponse?.data || [];
    };

    useEffect(() => {
        const onDateUpdate = async () => {
            try {
                const morningExistenceData = await getMorningExistenceData();
                const tradesData = await getTradesData();

                const currentExistence = getCurrentExistence({
                    morningExistence: morningExistenceData,
                    trades: tradesData
                });

                setTradesData(tradesData);
                setMorningExistence(morningExistenceData);
                setCurrentExistence(currentExistence);
            }
            catch(err) {
                const errorMessage = getErrorMessage(err);
                setMorningExistence([]);
                setTradesData([]);
                setCurrentExistence([]);
                alert(errorMessage);
            }
        }
        onDateUpdate()
    }, [selectedDate]);

    useEffect(() => {
        const onCurrencyUpdate = async () => {
            const tradesData = await getTradesData();
            setTradesData(tradesData);
        };
        onCurrencyUpdate()
    }, [selectedCurrency]);


    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMobile(window.innerWidth < 1100);
        }
    }, [])

    const [selectedMobileType, setSelectedMobileType] = useState('buy');

    return (
        <>
            <main>
                <div className={styles.header}>
                    <h1>{initialExchangerData.address}</h1>
                    <div className={styles.headerExtra}>
                        <DatePicker
                            onChange={() => ''}
                            selected={new Date(selectedDate)}
                            onSelect={handleDateChange}
                            customInput={<button className={styles.datePicker}>{selectedDate}</button>}
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                </div>

                <div className={styles.existencesWrapper}>
                    <ExistenceTable
                        title='Наличие на утро'
                        data={morningExistence}
                    />
                    <ExistenceTable
                        title='Наличие'
                        data={currentExistence}
                    />

                </div>
                <div className={styles.currenciesWrapper}>
                    {currencies?.filter((currency) => currency !== 'uah')?.map((currency: string, index: number) =>
                        <CurrencyCard
                            key={index}
                            currency={currency}
                            selected={currency === selectedCurrency}
                            onClick={() => setSelectedCurrency(currency)}
                        />
                    )}
                </div>

                {(isMobile &&
                    <div className={styles.typesWrapper}>
                        <div
                            className={selectedMobileType === 'buy' ? styles.selected : undefined}
                            onClick={() => setSelectedMobileType('buy')}
                        >
                            Покупка
                        </div>
                        <div
                            className={selectedMobileType === 'sale' ? styles.selected : undefined}
                            onClick={() => setSelectedMobileType('sale')}
                        >
                            Продажа
                        </div>
                    </div>
                )}
                <div className={styles.currencyTablesWrapper}>
                    {((isMobile ? selectedMobileType === 'buy' : true) &&
                        <TradesTable
                            exchangerId={id}
                            type='buy'
                            title={`Покупка ${selectedCurrency}`}
                            currency={selectedCurrency}
                            data={tradesData?.filter((row: any) => row.type === 'buy' && row?.currency === selectedCurrency)}
                        />
                    )}

                    {((isMobile ? selectedMobileType === 'sale' : true) &&
                        <TradesTable
                            exchangerId={id}
                            type='sale'
                            title={`Продажа ${selectedCurrency}`}
                            currency={selectedCurrency}
                            data={tradesData?.filter((row: any) => row.type === 'sale' && row?.currency === selectedCurrency)}
                        />
                    )}
                </div>
            </main>
        </>
    )
};

export default ExchangerPage;
