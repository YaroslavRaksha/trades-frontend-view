import styles from '../../../styles/Exchanger.module.css';
import {TradesDataType} from "../../../helpers/customTypings";
import TradeRow from "./TradeRow";

type Props = {
    exchangerId: string | number,
    type: 'buy' | 'sale',
    title: string,
    currency?: any,
    data: TradesDataType[],
}

const TradesTable = ({ title, data, }: Props) => {

    const amountValues = data?.map((trade: any) => parseFloat(trade.amount));
    const totalAmount = amountValues?.reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0);

    const uahValues = data?.map((trade: any) => parseFloat(trade.amount) * parseFloat(trade.course));
    const uahAmount = uahValues?.reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0);

    const averageCourse = uahAmount / totalAmount;

    return (
        <div className={styles.tradesTable}>
            <div className={styles.tradesTableWrapper}>
                <h4>{title}</h4>
                {data?.length > 0 && data.map(({ id, amount, course, time }, index) => (
                    <TradeRow
                        id={id}
                        key={id}
                        amount={amount}
                        course={course}
                        time={time}
                    />
                ))}

            </div>

            <div className={styles.tradesTotal}>
                <div>{totalAmount ? totalAmount.toFixed(4) : '-'}</div>
                <div>{averageCourse ? averageCourse.toFixed(4) : '-'}</div>
                <div>{uahAmount ? uahAmount.toFixed(4) : '-'}</div>
            </div>
        </div>
    )
}

export default TradesTable;
