import * as React from 'react'

import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Input from 'material-ui/Input'
import Paper from 'material-ui/Paper';
import { List, ListItem, Divider } from 'material-ui';

import * as Visit from '../modules/visit'
import * as utility from '../modules/utility'

import { Loading, Tp, Views, ViewItem } from './Common';

interface VisitBaseProps {
    address: string
    valid: boolean
    name: string
    description: string

    onLeftClick?: () => void
    onRightClick?: () => void
}

export const VisitBase: React.SFC<VisitBaseProps> = (props) => {
    if (props.valid) {
        return (
            <div>
                <BaseSideButtons
                    onLeftClick={props.onLeftClick}
                    onRightClick={props.onRightClick}
                />
                <BaseBody
                    address={props.address}
                    valid={props.valid}
                    name={props.name}
                    description={props.description}
                >
                    {props.children}
                </BaseBody>
            </div>
        )
    } else {
        return (<BaseNotFound />)
    }
}

interface BaseBodyProps {
    address: string
    valid: boolean
    name: string
    description: string
}

const BaseBody: React.SFC<BaseBodyProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            display: "flex",
            justifyContent: "center",
        },
        inner1: {
            padding: "20px 0px 5px 0px"
        },
        inner2: {
        },
        child: {
            padding: "30px"
        },
        typoTitle: {
            fontSize: "20px"
        },
        typeSubTitle: {
            fontSize: "14px",
            whiteSpace: "pre",
        }
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        inner1: {
            padding: "7vw 0vw 1.5vw 0vw"
        },
        child: {
            padding: "10vw"
        },
        typoTitle: {
            fontSize: "7vw"
        },
        typeSubTitle: {
            fontSize: "4.5vw",
            whiteSpace: "pre",
        }
    }
    return (
        <div style={styles.root}>
            <div>
                <div style={styles.inner1}>
                    <Typography color="inherit" align="center" style={styles.typoTitle}>
                        {props.name}
                    </Typography>
                </div>
                <div style={styles.inner2}>
                    <Typography color="inherit" align="center" style={styles.typeSubTitle}>
                        {props.description}
                    </Typography>
                </div>

                <div style={styles.child}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}

interface BaseSideButtonsProps {
    onLeftClick?: () => void
    onRightClick?: () => void
}

const BaseSideButtons: React.SFC<BaseSideButtonsProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        leftClick: {
            width: 0,
            height: 0,
        },
        rightClick: {
            height: 0,
            display: "flex",
            justifyContent: "flex-end",
        },
        leftClickButton: {
            padding: "10px 10px",
            top: 40,
            left: 20
        },
        rightClickButton: {
            padding: "10px 10px",
            top: 40,
            right: 20
        },
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        leftClickButton: {
            padding: "3vw",
            left: "5vw",
            fontSize: "8vw"
        },
        rightClickButton: {
            padding: "3vw",
            right: "5vw",
            fontSize: "8vw"
        },
    }
    return (
        <div>
            {
                props.onLeftClick == undefined ? "" :
                    <div style={styles.leftClick}>
                        <Button color="inherit" onClick={_ => props.onLeftClick()} style={styles.leftClickButton}>
                            {"<"}
                        </Button>
                    </div>
            }
            {
                props.onRightClick == undefined ? "" :
                    <div style={styles.rightClick}>
                        <Button color="inherit" onClick={_ => props.onRightClick()} style={styles.rightClickButton}>
                            {">"}
                        </Button>
                    </div>
            }
        </div>
    )
}

const BaseNotFound: React.SFC<{}> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            display: "flex",
            justifyContent: "center",
        },
        inner: {
            padding: "50px"
        },
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        inner: {
            padding: "13vw"
        },
        typo: {
            fontSize: "5vw"
        }
    }
    return (
        <div style={styles.root}>
            <div style={styles.inner}>
                <Typography color="inherit" align="center" style={styles.typo}>
                    リンクが見つかりません。
                </Typography>
            </div>
        </div>
    )
}

const SubHeader: React.SFC<{}> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        typo: {
            fontSize: "20px",
            textDecoration: "underline",
        },
        pad: {
            padding: "10px"
        },
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        typo: {
            fontSize: "7vw"
        },
        pad: {
            padding: "3vw"
        },
    }
    return (
        <div>
            <Typography color="inherit" align="center" style={styles.typo}>
                {props.children}
            </Typography>
            <div style={styles.pad}></div>
        </div>
    )
}

interface SubPaperProps {
    title: string
}

const SubPaper: React.SFC<SubPaperProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            padding: "10px"
        },
        head: {
            padding: "0px 0px 10px 0px",
            display: "flex",
            justifyContent: "center",
        },
        title: {
            fontSize: "18px"
        },
        page: {
            width: "330px",
            height: "330px"
        },
        inner: {
            padding: "10px"
        },
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        root: {
            padding: "3vw",
        },
        head: {
            padding: "0vw 0vw 3vw 0vw",
            display: "flex",
            justifyContent: "center",
        },
        title: {
            fontSize: "6vw"
        },
        page: {
        },
        inner: {
            padding: "3vw"
        },
    }

    return (
        <div style={styles.root}>
            <div style={styles.head}>
                <Typography color="inherit" style={styles.title}>
                    {props.title}
                </Typography>
            </div>
            <Paper style={styles.page}>
                <div style={styles.inner}>
                    {props.children}
                </div>
            </Paper>
        </div>
    )
}

interface VisitEnterProps {
    onClick: () => void
}

export const VisitEnter: React.SFC<VisitEnterProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        pad: {
            padding: "10px 0px"
        },
        button: {
            padding: "10px 10px",
        }
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        pad: {
            padding: "3vw 0vw"
        },
        button: {
            fontSize: "4vw",
            padding: "3vw 3vw",
        }
    }

    return (
        <div>
            <div style={styles.pad}></div>
            <Button variant="raised" color="secondary" onClick={_ => props.onClick()} style={styles.button}>
                Get Started
            </Button>
        </div>
    )
}

interface VisitCalenderProps {
    calender: Visit.Calender
    calenderPage: Visit.CalenderPage

    onLeftClick?: () => void
    onRightClick?: () => void

    onItemClick: (v: string) => void
}

export const VisitCalender: React.SFC<VisitCalenderProps> = (props) => {
    let events = props.calender.events
    let table = utility.createCalenderTable(props.calenderPage.offset)
    utility.calcCalenderTable(table, events)

    return (
        <div>
            <SubHeader>Select a Time</SubHeader>
            <CalenderClick onLeftClick={props.onLeftClick} onRightClick={props.onRightClick} />
            <CalenderBody table={table} onItemClick={props.onItemClick} />
        </div>
    )
}

interface CalenderBodyProps {
    table: utility.CalenderTable

    onItemClick: (v: string) => void
}

const CalenderBody: React.SFC<CalenderBodyProps> = (props) => {
    let table = props.table

    let styles: { [key: string]: React.CSSProperties } = {
        weeks: {
            display: "flex",
        },
        day: {
            width: "100px",
            padding: "5px",
            color: "#000",
        },
        dayDate: {
            padding: "0px 35px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        dayWeek: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        hours: {
            display: "flex",
            justifyContent: "center",
        },
        hour: {
            width: "100px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        hour: {
            width: "100px",
            height: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        item: {
            fontSize: "34px",
        }
    }

    let weekColors = ['#F44', '#000', '#000', '#000', '#000', '#000', '#44F']

    let xWeeks = []
    for (let i = 0; i < table.days.length; i++) {
        let day = table.days[i]

        let xHour = []
        for (let j = 0; j < day.hours.length; j++) {
            if (j < 9 || j >= 24) continue
            let hour = day.hours[j]

            xHour.push(
                <div key={j}>
                    <ListItem style={styles.hour}>
                        <Button color="inherit"
                            onClick={_ => props.onItemClick(hour.time)}
                            disabled={hour.isReserved}
                            style={styles.item}
                        >
                            {utility.toHourFormat(hour.time)}
                        </Button>
                    </ListItem>
                    <Divider />
                </div>
            )
        }

        let xDw = utility.weekName(day.time)
        let xDay = utility.toDateFormat(day.time)

        let styleDay: React.CSSProperties = {
            ...styles.day,
            color: weekColors[utility.weekIndex(day.time)]
        }

        xWeeks.push(
            <div key={i}>
                <div style={styleDay}>
                    <Paper>
                        <div style={styles.paperInner}>
                            <div style={styles.dayDate}>{xDay}</div>
                            <div style={styles.dayWeek}>{xDw}</div>
                        </div>
                    </Paper>
                </div>
                <div style={styles.hours}>
                    <List>
                        {xHour}
                    </List>
                </div>
            </div>
        )
    }

    return (
        <div style={styles.weeks}>
            {xWeeks}
        </div>
    )
}

interface CalenderClickProps {
    onLeftClick?: () => void
    onRightClick?: () => void
}

const CalenderClick: React.SFC<CalenderClickProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        leftClick: {
            width: 0,
            height: 0,
        },
        rightClick: {
            height: 0,
            display: "flex",
            justifyContent: "flex-end",
        },
        leftClickButton: {
            padding: "10px 10px",
            top: -40,
            left: 0
        },
        rightClickButton: {
            padding: "10px 10px",
            top: -40,
            right: 0
        },
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        leftClickButton: {
            padding: "3vw 3vw",
            top: "-17.5vw",
            left: "6vw",
            fontSize: "5vw",
        },
        rightClickButton: {
            padding: "3vw 3vw",
            top: "-17.5vw",
            right: "6vw",
            fontSize: "5vw",
        },
    }

    return (
        <div>
            {
                props.onLeftClick == undefined ? "" :
                    <div style={styles.leftClick}>
                        <Button color="inherit" onClick={_ => props.onLeftClick()} style={styles.leftClickButton}>
                            {"<"}
                        </Button>
                    </div>
            }
            {
                props.onRightClick == undefined ? "" :
                    <div style={styles.rightClick}>
                        <Button color="inherit" onClick={_ => props.onRightClick()} style={styles.rightClickButton}>
                            {">"}
                        </Button>
                    </div>
            }
        </div>
    )
}

interface VisitConfirmProps {
    address: string
    name: string
    time: string

    onConfirm: (req: Visit.CalenderRequest) => void
    confirm: Visit.Confirm
}

export class VisitConfirm extends React.Component<VisitConfirmProps> {
    formName: string
    formEmail: string
    formSummary: string
    formDescription: string

    render() {
        let props = this.props

        let styles: { [key: string]: React.CSSProperties } = {
            root: {
                display: "flex"
            },
        }
        styles = !utility.issp() ? styles : {
            ...styles,
            root: {
            },
        }

        return (
            <div>
                <SubHeader>Confirm Infomation</SubHeader>
                <div style={styles.root}>
                    <SubPaper title="予定の日時">
                        <ConfirmForm
                            title={"名前"}
                            value={props.name}
                            disabled={true}
                        />
                        <ConfirmForm
                            title={"日付"}
                            value={utility.toDateFullFormat(props.time)}
                            disabled={true}
                        />
                        <ConfirmForm
                            title={"時間"}
                            value={utility.toHourDurationFormat(props.time)}
                            disabled={true}
                        />
                    </SubPaper>
                    <SubPaper title="詳細の入力">
                        <ConfirmForm
                            title={"名前"}
                            onChange={t => this.formName = t}
                            placeholder={"Mio Maruyama"}
                        />
                        <ConfirmForm
                            title={"メール"}
                            onChange={t => this.formEmail = t}
                            placeholder={"example@gmail.com"}
                        />
                        <ConfirmForm
                            title={"予定名"}
                            onChange={t => this.formSummary = t}
                            placeholder={"MTG"}
                        />
                        <ConfirmForm
                            title={"詳細"}
                            onChange={t => this.formDescription = t}
                            placeholder={""}
                        />
                        <ConfirmButton
                            onClick={() => props.onConfirm({
                                address: props.address,
                                time: props.time,
                                senderName: this.formName,
                                senderEmail: this.formEmail,
                                summary: this.formSummary,
                                description: this.formDescription,
                            })}
                            isLoading={props.confirm.isLoading}
                            message={props.confirm.message}
                        />
                    </SubPaper>
                </div>
            </div>
        )
    }
}

interface ConfirmFormProps {
    title: string
    onChange?: (t: string) => void
    placeholder?: string
    disabled?: boolean
    value?: string
}

const ConfirmForm: React.SFC<ConfirmFormProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            display: "flex",
            alignItems: "center",
            padding: "10px",
        },
        name: {
            width: "80px",
        },
        form: {
            padding: "0px 0px 0px 0px",
            display: "flex",
        },
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        root: {
            display: "flex",
            padding: "3vw",
        },
        name: {
            width: "20vw",
        },
        form: {
            display: "flex",
        },
        input: {
            width: "40vw",
            fontSize: "4vw",
        }
    }

    return (
        <div style={styles.root}>
            <div style={styles.name}>
                {props.title}
            </div>
            <div style={styles.form}>
                {
                    props.disabled ? <div>{props.value}</div> :
                        <Input
                            onChange={t => props.onChange(t.target.value)}
                            placeholder={props.placeholder}
                            style={styles.input}
                        />
                }
            </div>
        </div>
    )
}

interface ConfirmButtonProps {
    onClick: () => void
    isLoading: boolean
    message: string
}

const ConfirmButton: React.SFC<ConfirmButtonProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            padding: "15px",
            display: "flex",
            justifyContent: "flex-end",
        },
        comp: {
            display: "flex",
            alignItems: "center",
        },
        message: {
            color: "#F44",
            padding: "0px 7px",
        }
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        root: {
            padding: "5vw",
            display: "flex",
            justifyContent: "flex-end",
        },
        message: {
            color: "#F44",
            padding: "0px 7px",
        },
        button: {
            padding: "3vw",
            fontSize: "4vw"
        }
    }

    return (
        <div style={styles.root}>
            <Loading isReady={!props.isLoading}>
                <div style={styles.comp}>
                    <div style={styles.message}>
                        {props.message}
                    </div>
                    <div>
                        <Button variant="raised" color="primary"
                            onClick={_ => props.onClick()} style={styles.button}>
                            予定を入れる
                            </Button>
                    </div>
                </div>
            </Loading>
        </div>
    )
}

interface VisitResultProps {
    time: string
    recvName: string
    sendName: string
}

export const VisitResult: React.SFC<VisitResultProps> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
            padding: "45px",
            display: "flex",
            justifyContent: "center",
        },
        sub: {
            display: "flex"
        },
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        sub: {
        },
    }

    return (
        <div style={styles.root}>
            <div>
                <SubHeader>Confirmed</SubHeader>
                <div style={styles.sub}>
                    <SubPaper title="予定の確認">
                        <ConfirmForm
                            title={""}
                            value={"カレンダーに予定が登録されました。"}
                            disabled={true}
                        />
                        <ConfirmForm
                            title={"日付"}
                            value={utility.toDateFullFormat(props.time)}
                            disabled={true}
                        />
                        <ConfirmForm
                            title={"時間"}
                            value={utility.toHourDurationFormat(props.time)}
                            disabled={true}
                        />
                        <ConfirmForm
                            title={"相手"}
                            value={props.recvName}
                            disabled={true}
                        />
                        <ConfirmForm
                            title={"自分"}
                            value={props.sendName}
                            disabled={true}
                        />
                    </SubPaper>
                    <SubPaper title="次に">
                        <ResultMore />
                    </SubPaper>
                </div>

            </div>
        </div>
    )
}

export const ResultMore: React.SFC<{}> = (props) => {
    let styles: { [key: string]: React.CSSProperties } = {
        root: {
        },
        next: {
            padding: "12px",
        },
    }
    styles = !utility.issp() ? styles : {
        ...styles,
        next: {
            padding: "4vw",
        },
        button: {
            padding: "3vw",
            fontSize: "4vw"
        }
    }

    return (
        <div style={styles.root}>
            <div style={styles.next}>
                <Button variant="raised" color="primary"
                    onClick={_ => window.location.reload()} style={styles.button}>
                    さらに予約をする
                </Button>
            </div>
            <div style={styles.next}>
                <Button variant="raised" color="primary"
                    onClick={_ => window.location.href = "/"} style={styles.button}>
                    ホストとしてはじめる
                </Button>
            </div>
        </div>
    )
}
