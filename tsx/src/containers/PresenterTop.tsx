import * as React from 'react'

import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography';

import * as utility from '../modules/utility'
import { HostHeader } from './Common'

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
        button: {
            padding: "20px",
        }
    }
    styles = !utility.issp() ? styles : { ...styles,
        root: {
            display: "flex",
            justifyContent: "center",
            padding: "20vw"
        },
        button: {
            fontSize: "4vw",
            padding: "3vw 3vw",
        }
    }

    return (
        <div>
            <HostHeader />
            <div style={styles.root}>
                <div>
                    <Button variant="raised" color="primary" onClick={_ => props.onStart()} style={styles.button}>
                        GET STARTED
                    </Button>
                </div>
            </div>
        </div>
    )
}
