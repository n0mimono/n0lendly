import * as React from 'react'

import * as utility from '../modules/utility'
import { HostHeader, CustomButton, HostFooter } from './Common'

import styles from './styles'

interface PresenterProps {
    onStart: () => void
}

export const Presenter: React.SFC<PresenterProps> = (props) => {
    return (
        <div>
            <HostHeader />
            <div className={styles.top.root}>
                <div className={styles.top.content}>
                    <div className={styles.top.title}>
                        n0lendly
                    </div>
                    <div className={styles.top.sub}>
                        Make your calender open to your friends.
                    </div>
                    <div className={styles.top.start}>
                        <CustomButton color="primary" onClick={props.onStart}
                            className={styles.top.button}>
                            GET STARTED
                        </CustomButton>
                    </div>
                </div>
            </div>
            <HostFooter />
        </div>
    )
}
