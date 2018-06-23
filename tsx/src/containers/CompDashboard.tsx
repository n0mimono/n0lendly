import * as React from 'react'

import { List, ListItem } from 'material-ui';
import Typography from 'material-ui/Typography'

import { Tp, BaseButton, BasePaper, BaseIcon, BaseInput } from './Common'
import * as utility from '../modules/utility'
import * as Dashboard from '../modules/dashboard'

import styles from './styles'

export const LinkBlock: React.SFC<{}> = (props) => {
    return (
        <div className={styles.dashboard.linkBlock}>
            <div>
                {props.children}
            </div>
        </div>
    )
}

export const LinkDescription: React.SFC<{}> = (props) => {
    return (
        <div className={styles.dashboard.linkDescription}>
            <Typography variant="display1" align="center" className={styles.dashboard.typo}>
                アドレスを入力する
            </Typography>
        </div>
    )
}

interface LinkUpdateProps {
    form: Dashboard.FormInput
}

export const LinkUpdate: React.SFC<LinkUpdateProps> = (props) => {
    return (
        <div>
            <div className={styles.dashboard.linkUpdate}>
                <div className={styles.dashboard.outer1}>
                    <BaseInput
                        onChange={t => props.form.onChange(t)}
                        placeholder={"input me"}
                        value={props.form.value}
                        multiline={!props.form.isShort}
                        rows={3}
                        rowsMax={3}
                    />
                </div>
                <div className={styles.dashboard.outer2}>
                    <BaseButton
                        color="primary"
                        onClick={() => props.form.onEnter(props.form.value)}
                    >
                        登録する
                    </BaseButton>
                </div>
            </div>
            <div className={styles.dashboard.helper}>
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
    return (
        <ListItem className={styles.dashboard.block}>
            <div className={styles.dashboard.mid1}>
                {props.title}
            </div>
            <div className={styles.dashboard.mid2}>
                <BasePaper>
                    {props.children}
                </BasePaper>
            </div>
        </ListItem>
    )
}

interface MiniBlockProps {
    title: string
}

export const MiniBlock: React.SFC<MiniBlockProps> = (props) => {
    return (
        <div className={styles.dashboard.miniBlock}>
            <div className={styles.dashboard.title}>
                {props.title}
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
}

export const BaseInfoItem: React.SFC<{}> = (props) => {
    return (
        <div className={styles.dashboard.baseInfoItem}>
            <div className={styles.dashboard.outer}>
                <BaseIcon path={"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"} />
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
}

interface TextClipProps {
    url: string
}

export const TextClip: React.SFC<TextClipProps> = (props) => {
    let onClip = () => {
        let text = props.url

        let tmp = document.createElement('div')
        tmp.appendChild(document.createElement('pre')).textContent = text

        document.body.appendChild(tmp)
        document.getSelection().selectAllChildren(tmp)

        document.execCommand('copy')
        document.body.removeChild(tmp)
    }

    let size = !utility.issp() ? 20 : 60
    let description = !utility.issp() ? "クリップボードにコピー>" : ""

    return (
        <div className={styles.dashboard.textClip}>
            <div>
                {props.children}
            </div>
            <div>
                <BaseButton color="inherit" onClick={() => onClip()} border={false}>
                    {description} <img src="/imgs/clip.png" width={size} height={size} />
                </BaseButton>
            </div>
        </div>
    )
}

interface BaseInfoBtnsProps {
    onShowPage: () => void
    onLogout: () => void
}

export const BaseInfoBtns: React.SFC<BaseInfoBtnsProps> = (props) => {
    return (
        <div className={styles.dashboard.baseInfoBtn}>
            <div className={styles.dashboard.sub1}>
                <BaseButton color="secondary" onClick={() => props.onShowPage()}>
                    リンクページの表示
                </BaseButton>
            </div>
            <div>
                <BaseButton color="primary" onClick={() => props.onLogout()}>
                    ログアウト
                </BaseButton>
            </div>
        </div>
    )
}

interface AccountDeleteProps {
    onEnter: () => void
}

export const AccountDelete: React.SFC<AccountDeleteProps> = (props) => {
    return (
        <div>
            <BaseButton color="primary" onClick={() => props.onEnter()}>
                アカウントの削除
            </BaseButton>
        </div>
    )
}
