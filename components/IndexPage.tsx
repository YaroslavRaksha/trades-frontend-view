import { useState } from 'react';
import styles from '../styles/IndexPage.module.css';
import {ExchangerType} from "../helpers/customTypings";
import { useRouter } from 'next/router';

const IndexPage = ({ allExchangers }: any) => {

    const router = useRouter();
    const [allExchangersState, setAllExchangersState] = useState<any>(allExchangers);

    const navigateToExchanger = (id: number) => router.push('/exchanger/' + id);

    return (
        <>
            <main>
                <div className={styles.allExchangersWrapper}>
                    {allExchangersState?.map((exchanger: ExchangerType) => (
                        <div
                            className={styles.exchangerCard}
                            key={exchanger.id}
                            onClick={() => navigateToExchanger(exchanger.id)}
                        >
                            <div>{exchanger.address}</div>
                            <div className={styles.exchangerCurrencies}>
                                {exchanger.currencies}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    )
};

export default IndexPage;
