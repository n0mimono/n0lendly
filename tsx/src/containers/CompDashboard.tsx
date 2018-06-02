import * as React from 'react'

import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Input from 'material-ui/Input'

import SvgIcon from 'material-ui/SvgIcon'
import Modal from 'material-ui/Modal'

import Paper from 'material-ui/Paper';
import { List, ListItem, Divider } from 'material-ui';

import { Tab, Tabs } from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'

import { Tp } from './Common'
import * as utility from '../modules/utility'
import * as Dashboard from '../modules/dashboard'

export const LinkBlock: React.SFC<{}> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            display: "flex",
            justifyContent: "center"
        },
    }
    styles = !utility.issp() ? styles : {
        ...styles,
    }

    return (
        <div style={styles.root}>
            <div>
                {props.children}
            </div>
        </div>
    )
}

export const LinkDescription: React.SFC<{}> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            padding: "60px 0px 30px 0px"
        },
        typo: {
            fontSize: "20px"
        }
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        root: {
            padding: "20vw 0vw 10vw 0vw"
        },
        typo: {
            fontSize: "7vw"
        }
    }

    return (
        <div style={styles.root}>
            <Typography variant="display1" align="center" style={styles.typo}>
                アドレスを入力する
            </Typography>
        </div>
    )
}

interface LinkUpdateProps {
    form: Dashboard.FormInput
}

export const LinkUpdate: React.SFC<LinkUpdateProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            display: "flex"
        },
        outer1: {
            padding: "0px 10px 0px 0px"
        },
        input: {
        },
        outer2: {
        },
        button: {
        },
        helper: {
            padding: "10px 0px",
            color: "#888"
        }
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        root: {
        },
        outer1: {
            padding: "0vw 3vw 0vw 0vw"
        },
        input: {
            width: "80vw",
            fontSize: "4vw",
        },
        outer2: {
            padding: "2vw 0vw 1vw 0vw",
        },
        button: {
            padding: "2vw",
            fontSize: "4vw",
        },
        helper: {
            padding: "0vw 0vw 2vw 0vw",
            color: "#888"
        }
    }

    if (!props.form.isShort) {
        if (!utility.issp()) {
            styles = {
                ...styles,
                input: {
                    ...styles.input,
                    width: "320px",
                },
                button: {
                    ...styles.button,
                    top: "80px",
                    right: "100px",
                },
                outer2: {
                    ...styles.outer2,
                    padding: "0px 0px 60px 0px",
                },
            }    
        }
    }

    return (
        <div>
            <div style={styles.root}>
                <div style={styles.outer1}>
                    <Input
                        onChange={t => props.form.onChange(t.target.value)}
                        placeholder={"input me"}
                        value={props.form.value}
                        multiline={!props.form.isShort}
                        rows={3}
                        rowsMax={3}
                        style={styles.input}
                    />
                </div>
                <div style={styles.outer2}>
                    <Button variant="raised" color="primary"
                        onClick={_ => props.form.onEnter(props.form.value)}
                        style={styles.button} >
                        登録する
                        </Button>
                </div>
            </div>
            <div style={styles.helper}>
                {props.form.helper}
            </div>
        </div>
    )
}

interface BlockProps {
    title: string
}

export const Blocks: React.SFC<{}> = (props) => {
    return (
        <List>
            {props.children}
        </List>
    )
}

export const Block: React.SFC<BlockProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        outer: {
            display: "list-item",
            padding: "30px 5px 10px 5px",
        },
        mid1: {
            padding: "0px 12px",
            fontSize: "22px",
            fontWeight: 600,
        },
        mid2: {
            padding: "10px",
        },
        inner: {
            padding: "10px",
        }
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        outer: {
            display: "list-item",
            padding: "2vw 1vw 1vw 1vw",
        },
        mid1: {
            padding: "0vw 4vw",
            fontSize: "7vw",
            fontWeight: 600,
        },
        mid2: {
            padding: "3vw",
        },
        inner: {
            padding: "3vw",
        }
    }

    return (
        <ListItem style={styles.outer}>
            <div style={styles.mid1}>
                {props.title}
            </div>
            <div style={styles.mid2}>
                <Paper>
                    <div style={styles.inner}>
                        {props.children}
                    </div>
                </Paper>
            </div>
        </ListItem>
    )
}

interface MiniBlockProps {
    title: string
}

export const MiniBlock: React.SFC<MiniBlockProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            padding: "10px 10px",
        },
        title: {
            padding: "10px 0px",
            fontWeight: 600,
        }
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        root: {
            padding: "1vw",
        },
        title: {
            padding: "1vw 0vw",
            fontWeight: 600,
        }
    }

    return (
        <div style={styles.root}>
            <div style={styles.title}>
                {props.title}
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
}

export const BaseInfoItem: React.SFC<{}> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            display: "flex",
            alignItems: "center",
            padding: "10px 0px"
        },
        outer: {
            padding: "3px 5px 0px 0px"
        }
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        root: {
            display: "flex",
            alignItems: "center",
            padding: "1vw 1vw"
        },
        outer: {
            padding: "1vw 1vw 0vw 0vw",
        },
        icon: {
            width: 70,
            height: 70,
        },
    }

    return (
        <div style={styles.root}>
            <div style={styles.outer}>
                <SvgIcon style={styles.icon}>
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </SvgIcon>
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
}

export const TextClip: React.SFC<{}> = (props) => {
    let onClip = () => {
        let text = props.children as string

        let tmp = document.createElement('div')
        tmp.appendChild(document.createElement('pre')).textContent = text

        document.body.appendChild(tmp)
        document.getSelection().selectAllChildren(tmp)

        document.execCommand('copy')
        document.body.removeChild(tmp)
    }
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            display: "flex",
            alignItems: "center",
        },
        icon: {
            top: 0
        }
    }
    styles = !utility.issp() ? styles : {
        ...styles,
    }
    let size = !utility.issp() ? 20 : 60
    let description = !utility.issp() ? "クリップボードにコピー>" : ""

    return (
        <div style={styles.root}>
            <div>
                {props.children}
            </div>
            <div>
                <Button variant="flat" color="inherit" onClick={_ => onClip()} style={styles.icon}>
                    {description} <img src="/imgs/clip.png" width={size} height={size} />
                </Button>
            </div>
        </div>
    )
}

interface BaseInfoBtnsProps {
    onShowPage: () => void
    onLogout: () => void
}

export const BaseInfoBtns: React.SFC<BaseInfoBtnsProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            padding: "10px 0px",
            display: "flex"
        },
        sub1: {
            padding: "0px 10px 0px 0px"
        }
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        root: {
            padding: "2vw 0vw",
            display: "flex"
        },
        sub1: {
            padding: "0vw 3vw 0vw 1vw"
        },
        button: {
            padding: "2vw",
            fontSize: "4vw",
        }
    }

    return (
        <div style={styles.root}>
            <div style={styles.sub1}>
                <Button variant="raised" color="secondary" style={styles.button} onClick={_ => props.onShowPage()}>
                    リンクページの表示
                </Button>
            </div>
            <div>
                <Button variant="raised" color="primary" style={styles.button} onClick={_ => props.onLogout()}>
                    ログアウト
                </Button>
            </div>
        </div>
    )
}

interface AccountDeleteProps {
    onEnter: () => void
}

export const AccountDelete: React.SFC<AccountDeleteProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        button: {
            padding: "2vw",
            fontSize: "4vw",
        }
    }
    return (
        <div>
            <Button variant="raised" color="primary" style={styles.button} onClick={_ => props.onEnter()}>
                アカウントの削除
            </Button>
        </div>
    )
}
