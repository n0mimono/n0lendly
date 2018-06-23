import * as React from 'react'

import Typography from 'material-ui/Typography'
import Input from 'material-ui/Input'
import { List, ListItem, Divider } from 'material-ui';

import * as Visit from '../modules/visit'
import * as utility from '../modules/utility'

import {
    Loading, BaseButton,
    CustomPaper, CustomButton, CustomInput
} from './Common';

import styles from './styles'

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
    return (
        <div className={styles.visit.baseBody}>
            <div>
                <div className={styles.visit.inner1}>
                    <Typography color="inherit" align="center" className={styles.visit.typoTitle}>
                        {props.name}
                    </Typography>
                </div>
                <div className={styles.visit.inner2}>
                    <Typography color="inherit" align="center" className={styles.visit.typeSubTitle}>
                        {props.description}
                    </Typography>
                </div>
                <div>
                    <Divider className={styles.visit.divider} />
                </div>
                <div className={styles.visit.child}>
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
    return (
        <div className={styles.visit.baseSide}>
            {
                props.onLeftClick == undefined ? "" :
                    <div className={styles.visit.left}>
                        <CustomButton color="inherit" border={false} onClick={() => props.onLeftClick()}
                            className={styles.visit.button}>
                            {"<"}
                        </CustomButton>
                    </div>
            }
            {
                props.onRightClick == undefined ? "" :
                    <div className={styles.visit.right}>
                        <CustomButton color="inherit" border={false} onClick={() => props.onRightClick()}
                            className={styles.visit.button}>
                            {">"}
                        </CustomButton>
                    </div>
            }
        </div>
    )
}

const BaseNotFound: React.SFC<{}> = (props) => {
    return (
        <div className={styles.visit.baseNotFound}>
            <div className={styles.visit.inner}>
                <Typography color="inherit" align="center" className={styles.visit.typo}>
                    リンクが見つかりません。
                </Typography>
            </div>
        </div>
    )
}

const SubHeader: React.SFC<{}> = (props) => {
    return (
        <div className={styles.visit.subHeader}>
            <Typography variant="display1" align="center" className={styles.visit.typo}>
                {props.children}
            </Typography>
            <div className={styles.visit.pad}></div>
        </div>
    )
}

interface SubPaperProps {
    title: string
}

const SubPaper: React.SFC<SubPaperProps> = (props) => {
    return (
        <div className={styles.visit.subPaper}>
            <div className={styles.visit.head}>
                <Typography color="inherit" className={styles.visit.title}>
                    {props.title}
                </Typography>
            </div>
            <CustomPaper className={styles.visit.paper}>
                <div className={styles.visit.inner}>
                    {props.children}
                </div>
            </CustomPaper>
        </div>
    )
}

interface VisitEnterProps {
    onClick: () => void
}

export const VisitEnter: React.SFC<VisitEnterProps> = (props) => {
    return (
        <div className={styles.visit.enter}>
            <div className={styles.visit.pad}></div>
            <BaseButton color="secondary" onClick={() => props.onClick()}>
                Get Started
            </BaseButton>
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

    let xWeeks = []
    for (let i = 0; i < table.days.length; i++) {
        let day = table.days[i]

        let xHour = []
        for (let j = 0; j < day.hours.length; j++) {
            if (j < 9 || j >= 24) continue
            let hour = day.hours[j]

            xHour.push(
                <div key={j}>
                    <ListItem className={styles.visit.hour}>
                        <BaseButton color="inherit"
                            onClick={() => props.onItemClick(hour.time)}
                            border={false}
                            disabled={hour.isReserved}
                        >
                            {utility.toHourFormat(hour.time)}
                        </BaseButton>
                    </ListItem>
                    <Divider />
                </div>
            )
        }

        let xDw = utility.weekName(day.time)
        let xDay = utility.toDateFormat(day.time)

        let w = utility.weekIndex(day.time)
        let sd = w == 0 ? styles.visit.sunday :
            w == 6 ? styles.visit.saturday : styles.visit.weekday

        xWeeks.push(
            <div key={i}>
                <div className={styles.visit.day}>
                    <CustomPaper className={styles.visit.paper}>
                        <div className={styles.visit.inner}>
                            <div className={sd}>
                                <div className={styles.visit.dayDate}>{xDay}</div>
                                <div className={styles.visit.dayWeek}>{xDw}</div>
                            </div>
                        </div>
                    </CustomPaper>
                </div>
                <div className={styles.visit.hours}>
                    <List>
                        {xHour}
                    </List>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.visit.calenderBody}>
            {xWeeks}
        </div>
    )
}

interface CalenderClickProps {
    onLeftClick?: () => void
    onRightClick?: () => void
}

const CalenderClick: React.SFC<CalenderClickProps> = (props) => {
    return (
        <div className={styles.visit.calenderClick}>
            {
                props.onLeftClick == undefined ? "" :
                    <div className={styles.visit.left}>
                        <CustomButton color="inherit" border={false} onClick={() => props.onLeftClick()}
                            className={styles.visit.button}>
                            {"<"}
                        </CustomButton>
                    </div>
            }
            {
                props.onRightClick == undefined ? "" :
                    <div className={styles.visit.right}>
                        <CustomButton color="inherit" border={false} onClick={() => props.onRightClick()}
                            className={styles.visit.button}>
                            {">"}
                        </CustomButton>
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
    formName: string = ""
    formEmail: string = ""
    formSummary: string = ""
    formDescription: string = ""

    render() {
        let props = this.props
        
        return (
            <div>
                <SubHeader>Confirm Information</SubHeader>
                <div className={styles.visit.confirm}>
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
    return (
        <div className={styles.visit.confirmForm}>
            <div className={styles.visit.name}>
                {props.title}
            </div>
            <div className={styles.visit.form}>
                {
                    props.disabled ? <div>{props.value}</div> :
                        <CustomInput
                            onChange={props.onChange}
                            placeholder={props.placeholder}
                            className={styles.visit.input}
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
    return (
        <div className={styles.visit.confirmButton}>
            <Loading isReady={!props.isLoading}>
                <div className={styles.visit.comp}>
                    <div className={styles.visit.message}>
                        {props.message}
                    </div>
                    <div>
                        <BaseButton
                            color="primary"
                            onClick={() => props.onClick()}>
                            予定を入れる
                        </BaseButton>
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
    return (
        <div className={styles.visit.result}>
            <div>
                <SubHeader>Confirmed</SubHeader>
                <div className={styles.visit.sub}>
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
    return (
        <div className={styles.visit.resultMore}>
            <div className={styles.visit.next}>
                <BaseButton color="primary"
                    onClick={() => window.location.reload()}>
                    さらに予約をする
                </BaseButton>
            </div>
            <div className={styles.visit.next}>
                <BaseButton color="primary"
                    onClick={() => window.location.href = "/"}>
                    ホストとしてはじめる
                </BaseButton>
            </div>
        </div>
    )
}
