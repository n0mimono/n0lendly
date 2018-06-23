import * as React from 'react'

import * as utility from '../modules/utility'
import { HostHeader, BaseButton } from './Common'

import styles from './styles'

interface PresenterProps {
    onStart: () => void
}

export const Presenter: React.SFC<PresenterProps> = (props) => {
    return (
        <div>
            <HostHeader />
            <div className={styles.top.root}>
                <div>
                    <BaseButton color="primary" onClick={props.onStart}>
                        GET STARTED
                    </BaseButton>
                </div>
            </div>
        </div>
    )
}
