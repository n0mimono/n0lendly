import * as React from 'react'

import { CircularProgress } from 'material-ui'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper';
import Input from 'material-ui/Input'
import SvgIcon from 'material-ui/SvgIcon'

import * as utility from '../modules/utility'

import SwipeableViews from 'react-swipeable-views'

export const Theme: React.SFC<{}> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            color: "#555",
            fontSize: "17px",
            fontWeight: 400,
            fontFamily: "Roboto, Helvetica, Arial sans-serif",
        },
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        root: {
            color: "#555",
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
            background: "#333",
            boxShadow: "0px 0px 0px 0px",
        },
        typo: {
        },
        pad: {
            padding: "30px"
        }
    }
    styles = !utility.issp() ? styles : {
        ...styles,
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
        <SwipeableViews index={props.index} draggable={false}>
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

interface ButtonProps {
    onClick: () => void
    variant?: "raised" | "flat"
    color?: 'inherit' | 'primary' | 'secondary' | 'default'
    border?: boolean
    disabled?: boolean
    style?: React.CSSProperties
}

export const BaseButton: React.SFC<ButtonProps> = (props) => {
    let style: React.CSSProperties = {
        padding: "10px 20px",
        border: "solid 2px",
        borderRadius: "5px",
    }
    style = !utility.issp() ? style :
        {
            ...style,
            fontSize: "4vw",
            padding: "3vw 2vw",
        }
    style = Object.assign({ ...style }, props.style)

    if (props.border == false) {
        style['border'] = ""
    }

    return (
        <Button
            color={props.color}
            onClick={_ => props.onClick()}
            style={style}
            disabled={props.disabled}>
            {props.children}
        </Button>
    )
}

interface PaperProps {
    style?: React.CSSProperties
}

export const BasePaper: React.SFC<PaperProps> = (props) => {
    let style: React.CSSProperties = {
        padding: "10px",
        boxShadow: "0px 0px 0px 0px",
        border: "solid 1px",
        borderRadius: "3px",
        borderColor: "#BBB",
    }
    style = !utility.issp() ? style :
        {
            ...style,
           padding: "3vw",
        }
    style = Object.assign({ ...style }, props.style)

    return (
        <Paper style={style}>
            {props.children}
        </Paper>
    )
}

interface IconProps {
    style?: React.CSSProperties
    path: string
}

export const BaseIcon: React.SFC<IconProps> = (props) => {
    let style: React.CSSProperties = {
    }
    style = !utility.issp() ? style :
        {
            ...style,
            width: 70,
            height: 70,
        }
    style = Object.assign({ ...style }, props.style)

    return (
        <SvgIcon style={style}><path d={props.path} /></SvgIcon>
    )
}

interface InputProps {
    onChange?: (t: string) => void
    placeholder?: string
    value?: string
    multiline?: boolean
    rows?: number
    rowsMax?: number
    style?: React.CSSProperties
}

export const BaseInput: React.SFC<InputProps> = (props) => {
    let style: React.CSSProperties = {
    }
    style = !utility.issp() ? style :
        {
            ...style,
            fontSize: "4vw",
        }
    style = Object.assign({ ...style }, props.style)

    return (
        <Input
            onChange={t => props.onChange(t.target.value)}
            placeholder={props.placeholder}
            value={props.value}
            multiline={props.multiline}
            rows={props.rows}
            rowsMax={props.rowsMax}
            style={style}
        />
    )
}
