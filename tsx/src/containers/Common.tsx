import * as React from 'react'

import { CircularProgress } from 'material-ui'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'

import * as utility from '../modules/utility'

import SwipeableViews from 'react-swipeable-views'

export const Theme: React.SFC<{}> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            fontSize: "17px",
            fontWeight: 400,
            fontFamily: "Roboto, Helvetica, Arial sans-serif",
        },
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        root: {
            fontSize: "4vw",
            fontWeight: 400,
            fontFamily: "Roboto, Helvetica, Arial sans-serif",
        }
    }
    return (
        <div style={styles.root}>
            {props.children}
        </div>
    )
}

interface LoadingProps {
    isReady: boolean
}

export const Loading: React.SFC<LoadingProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            display: "flex",
            justifyContent: "center",
        },
    }
    styles = !utility.issp() ? styles : {
        ...styles,
    }
    let size = !utility.issp() ? undefined : 180

    if (props.isReady) {
        return (
            <div>
                {props.children}
            </div>
        )
    } else {
        return (
            <div style={styles.root}>
                <CircularProgress size={size} color="inherit" />
            </div>
        )
    }
}

export const HostHeader: React.SFC<{}> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        bar: {
            background: "#333"
        },
        typo: {
        },
        pad: {
            padding: "30px"
        }
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        bar: {
            background: "#333",
        },
        base: {
            display: "flex",
            justifyContent: "center",
            padding: "1vw",
        },
        typo: {
            fontSize: "10vw",
        },
        pad: {
            padding: "8vw"
        }
    }

    return (
        <div>
            <AppBar style={styles.bar}>
                <Toolbar style={styles.base}>
                    <Typography variant="title" color="inherit" style={styles.typo}>
                        {utility.AppName()}
                    </Typography>
                </Toolbar>
            </AppBar>
            <div style={styles.pad}>
            </div>
        </div>
    )
}

interface TpProps {
}

export const Tp: React.SFC<TpProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            padding: "5px 10px"
        },
    }
    styles = !utility.issp() ? styles : {
        ...styles,
    }

    return (
        <div style={styles.root}>
            {props.children}
        </div>
    )
}

interface ViewsProps {
    index: number
}

export const Views: React.SFC<ViewsProps> = (props) => {
    return (
        <SwipeableViews index={props.index}>
            {props.children}
        </SwipeableViews>
    )
}

export const ViewItem: React.SFC<{}> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            display: "flex",
            justifyContent: "center",
        },
    }
    return (
        <div style={styles.root}>
            {props.children}
        </div>
    )
}
