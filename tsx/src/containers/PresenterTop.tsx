import * as React from 'react'

import * as utility from '../modules/utility'
import { HostHeader, BaseButton } from './Common'

interface PresenterProps {
    onStart: () => void
}

export const Presenter: React.SFC<PresenterProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            display: "flex",
            justifyContent: "center",
            padding: "80px"
        },
    }
    styles = !utility.issp() ? styles : { ...styles,
        root: {
            display: "flex",
            justifyContent: "center",
            padding: "20vw"
        },
    }

    return (
        <div>
            <HostHeader />
            <div style={styles.root}>
                <div>
                    <BaseButton color="primary" onClick={props.onStart} style={styles.button}>
                        GET STARTED
                    </BaseButton>
                </div>
            </div>
        </div>
    )
}
