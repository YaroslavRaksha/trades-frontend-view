import styles from '../../../styles/Exchanger.module.css';
import {useEffect, useState} from "react";

type Props = {
    currency: string,
    amount: string,
    dataLength: number,
}

const Column = ({ currency, amount, dataLength }: Props) => {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if(typeof window?.innerWidth !== 'undefined') {
            setIsMobile(window.innerWidth < 600);
        }
    }, []);

    const [amountState, setAmountState] = useState(amount);

    useEffect(() => {
        setAmountState(amount)
    }, [amount]);

    return (
        <div className={styles.existenceColumn} style={{
            flexBasis: isMobile ? '33.333%' : (dataLength > 4 ? '20%' : `${100 / dataLength}%`)
        }}>
            <div className={styles.existenceCurrency}>
                {currency}
            </div>
            <div className={styles.existenceValue}>
                {amountState}
            </div>
        </div>
    )
}

export default Column;
