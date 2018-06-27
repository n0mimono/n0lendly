import * as Visit from './visit'

import * as moment from 'moment'
import { func } from 'prop-types';

export function AppName(): string {
    return "n0lendly"
}

export function issp(): boolean {
    let ua = navigator.userAgent
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
        return true
    } else {
        return false
    }
}

export class CalenderTable {
    today: string
    days: CalenderDay[]
}

export interface CalenderDay {
    time: string
    hours: CalenderHour[]
}

export interface CalenderHour {
    time: string
    isReserved: boolean
    summary: string
}

export function createCalenderTable(offset: number) : CalenderTable {
    let table = new CalenderTable

    let now = moment().add(offset, 'day')
    now = moment([now.year(), now.month(), now.date()])
    table.today = now.format()

    let days: CalenderDay[] = []
    for (let i = 0; i < 7; i++) {
        let dayTime = now.format()

        let hours: CalenderHour[] = []
        for (let j = 0; j < 24; j++) {
            let hour = {
                time: now.format(),
                isReserved: false,
                summary: ""
            }
            hours.push(hour)

            now.add(1, 'hour')
        }
        days.push({
            time: dayTime,
            hours: hours
        })
    }
    table.days = days

    return table
}

export function calcCalenderTable(table: CalenderTable, evs: Visit.CalenderEvent[]) {
    for (let i = 0; i < table.days.length; i++) {
        for (let j = 0; j < table.days[i].hours.length; j++) {
            let hour = table.days[i].hours[j]
            let start = moment(hour.time)
            let end = moment(hour.time).add(1, 'hour')

            let reserved = false
            let summary = ""
            for (let k = 0; k < evs.length; k++) {
                let s = moment(evs[k].start)
                let e = moment(evs[k].end)

                let ok = start.isSameOrAfter(e) || end.isSameOrBefore(s)
                if (!ok) {
                    reserved = true
                    summary = evs[k].summary
                    break
                }
            }

            if (reserved) {
                hour.isReserved = true
                hour.summary = summary
                table.days[i].hours[j] = hour
            }
        }
    }
}

export function weekNames(index: number): string {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]
}

export function weekIndex(time: string): number {
    let m = moment(time)
    return m.weekday()
}

export function weekName(time: string) {
    return weekNames(weekIndex(time))
}

export function isToday(time: string): boolean {
    let m = moment(time)
    let now = moment()
    return (m.date() == now.date())
}

export function toDateFormat(time: string): string {
    let m = moment(time)
    return  (m.month() + 1) + "/" + m.date()
}

export function toDateFullFormat(time: string): string {
    let m = moment(time)
    return m.year() + "/" + (m.month() + 1) + "/" + m.date() + " (" + weekNames(m.weekday()) + ")"    
}

export function toHourFormat(time: string): string {
    let m = moment(time)
    return m.hour() + ":00"
}

export function toHourDurationFormat(time: string): string {
    let m = moment(time)
    return m.hour() + ":00 - " + (m.hour() + 1) + ":00"
}

export function isValidName(v: string): boolean {
    return /.*/.test(v) && v != undefined
}

export function isValidEmail(v: string): boolean {
    return /.*.@.*.\...*/.test(v) && v != undefined
}
