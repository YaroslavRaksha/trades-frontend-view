import styles from "../../../styles/Exchanger.module.css";
import {useState} from "react";

type Props = {
    id: number,
    amount: string | number,
    course: string | number,
    time: string,
}


const TradeRow = ({ amount, course, time, }: Props) => {

    const [tradeDataState, setTradeDataState] = useState<any>({
        amount: amount,
        course: course,
    });

    return (
        <div className={styles.rowWrapper}>
            {['amount', 'course'].map((key: any) => (
                <div key={key}>
                    {tradeDataState[key]}
                </div>
            ))}

            <div className={styles.rowAmount}>
                <span>
                    {(tradeDataState.amount * tradeDataState.course).toFixed(2)}
                </span>
                <span className={styles.rowTime}>
                    {time}
                </span>
            </div>
        </div>
    )
}

export default TradeRow;
