import * as React from 'react'
import { VisitBase, VisitEnter, VisitCalender, VisitConfirm, VisitResult } from './CompVisit';

import * as Visit from '../modules/visit'
import { Loading, ViewItem, Views } from './Common'

interface PresenterProps {
    isReady: boolean
    pages: Visit.Pages
    user: Visit.UserData

    calender: Visit.Calender

    onPage0: (p: Visit.Page0) => void
    onPage1: (p: Visit.Page1) => void
    onPage2: (p: Visit.Page2) => void

    onRequest: (req: Visit.CalenderRequest) => void
    confirm: Visit.Confirm
}

export const Presenter: React.SFC<PresenterProps> = (props) => {
    return (
        <div>
            {
            props.pages.index == 3 ? undefined :
            <VisitBase
                address={props.user.address}
                valid={props.user.exist}
                name={props.user.name}
                description={props.user.description}
                onLeftClick={
                    props.pages.index == 1 ? () => props.onPage0({}) :
                    props.pages.index == 2 && !props.confirm.isLoading ? () => props.onPage1(props.pages.page1) :
                    undefined
                }
                onRightClick={
                    props.pages.index == 1 && props.pages.page2.isReady ? () => props.onPage2(props.pages.page2) :
                    undefined
                }
            />
            }
            <Views index={props.pages.index}>
                <ViewItem>
                    <VisitEnter onClick={() => props.onPage1(props.pages.page1)} />
                </ViewItem>
                <ViewItem>
                    <Loading isReady={props.calender.isReady}>
                        <VisitCalender
                            calender={props.calender}
                            calenderPage={props.pages.page1.cp}
                            onLeftClick={
                                props.pages.page1.cp.index == 0 ? undefined :
                                    () => {
                                        props.pages.page1.cp = Visit.updateCalenderPage(props.pages.page1.cp, -1)
                                        props.onPage1(props.pages.page1)
                                    }
                            }
                            onRightClick={
                                () => {
                                    props.pages.page1.cp = Visit.updateCalenderPage(props.pages.page1.cp, 1)
                                    props.onPage1(props.pages.page1)
                                }
                            }
                            onItemClick={v => props.onPage2({ isReady: true, time: v })}
                        />
                    </Loading>
                </ViewItem>
                <ViewItem>
                    <VisitConfirm
                        address={props.user.address}
                        name={props.user.name}
                        time={props.pages.page2.time}
                        onConfirm={props.onRequest}
                        confirm={props.confirm}
                    />
                </ViewItem>
                <ViewItem>
                    <VisitResult
                        time={props.pages.page2.time}
                        recvName={props.user.name}
                        sendName={props.pages.page3.name}
                    />
                </ViewItem>
            </Views>
        </div>
    )
}


