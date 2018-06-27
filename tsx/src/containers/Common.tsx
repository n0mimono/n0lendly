import * as React from 'react'

import { CircularProgress, Divider, Checkbox } from 'material-ui'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper';
import Input from 'material-ui/Input'
import SvgIcon from 'material-ui/SvgIcon'

import * as utility from '../modules/utility'

import SwipeableViews from 'react-swipeable-views'

import styles from './styles'

interface CustomProps {
    className: string
}

export const Theme: React.SFC<{}> = (props) => {
    return (
        <div className={styles.common.theme}>
            {props.children}
        </div>
    )
}

interface LoadingProps {
    isReady: boolean
}

export const Loading: React.SFC<LoadingProps> = (props) => {
    let size = !utility.issp() ? undefined : 180
    if (props.isReady) {
        return (
            <div>
                {props.children}
            </div>
        )
    } else {
        return (
            <div className={styles.common.loading}>
                <CircularProgress size={size} color="inherit" />
            </div>
        )
    }
}

export const HostHeader: React.SFC<{}> = (props) => {
    return (
        <div className={styles.common.hostHeader}>
            <AppBar className={styles.common.bar}>
                <Toolbar className={styles.common.base}>
                    <Typography variant="title" color="inherit" className={styles.common.typo}>
                        {utility.AppName()}
                    </Typography>
                </Toolbar>
            </AppBar>
            <div className={styles.common.pad}>
            </div>
        </div>
    )
}

interface TpProps {
}

export const Tp: React.SFC<TpProps> = (props) => {
    return (
        <div className={styles.common.tp}>
            {props.children}
        </div>
    )
}

interface ViewsProps {
    index: number
    valid: boolean
}

export const Views: React.SFC<ViewsProps> = (props) => {
    return (
        <div>
        {
            !props.valid ? "" :
                <SwipeableViews index={props.index} draggable={false}>
                    {props.children}
                </SwipeableViews>
        }
        </div>
    )
}

export const ViewItem: React.SFC<{}> = (props) => {
    return (
        <div className={styles.common.viewItem}>
            {props.children}
        </div>
    )
}

interface ButtonProps {
    onClick: () => void
    color?: 'inherit' | 'primary' | 'secondary' | 'default'
    border?: boolean
    disabled?: boolean
}

export const BaseButton: React.SFC<ButtonProps> = (props) => {
    let cs = props.border == false ? 'baseButtonFlat' : 'baseButton'
    return (
        <CustomButton
            color={props.color}
            onClick={props.onClick}
            className={styles.common[cs]}
            disabled={props.disabled}>
            {props.children}
        </CustomButton>
    )
}

export const CustomButton: React.SFC<ButtonProps & CustomProps> = (props) => {
    return (
        <Button
            color={props.color}
            onClick={_ => props.onClick()}
            className={props.className}
            disabled={props.disabled}>
            {props.children}
        </Button>
    )
}

export const BasePaper: React.SFC<{}> = (props) => {
    return (
        <CustomPaper className={styles.common.basePaper}>
            {props.children}
        </CustomPaper>
    )
}

export const CustomPaper: React.SFC<CustomProps> = (props) => {
    return (
        <Paper className={props.className}>
            {props.children}
        </Paper>
    )
}

interface IconProps {
    path: string
}

export const BaseIcon: React.SFC<IconProps> = (props) => {
    return (
        <SvgIcon className={styles.common.baseIcon}><path d={props.path} /></SvgIcon>
    )
}

interface InputProps {
    onChange?: (t: string) => void
    placeholder?: string
    value?: string
    multiline?: boolean
    rows?: number
    rowsMax?: number
    defaultValue?: string
}

export const BaseInput: React.SFC<InputProps> = (props) => {
    return (
        <CustomInput
            onChange={props.onChange}
            placeholder={props.placeholder}
            value={props.value}
            multiline={props.multiline}
            rows={props.rows}
            rowsMax={props.rowsMax}
            defaultValue={props.defaultValue}
            className={styles.common.baseInput}
        />
    )
}

export const CustomInput: React.SFC<InputProps & CustomProps> = (props) => {
    return (
        <Input
            onChange={t => props.onChange(t.target.value)}
            placeholder={props.placeholder}
            value={props.value}
            multiline={props.multiline}
            rows={props.rows}
            rowsMax={props.rowsMax}
            defaultValue={props.defaultValue}
            className={props.className}
        />
    )
}

interface CheckboxProps {
    color?: 'inherit' | 'primary' | 'secondary' | 'default'
    onChange: (b: boolean) => void
    checked: boolean
}

export const BaseCheckbox: React.SFC<CheckboxProps> = (props) => {
    return (
        <CustomCheckbox
            color={props.color}
            onChange={props.onChange}
            checked={props.checked}
            className={styles.common.baseCheckbox}
        />
    )
}

export const CustomCheckbox: React.SFC<CheckboxProps & CustomProps> = (props) => {
    return (
        <Checkbox
            color={props.color}
            onChange={t => props.onChange(!props.checked)}
            checked={props.checked}
            className={props.className}
        />
    )
}
