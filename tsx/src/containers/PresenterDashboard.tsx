import * as React from 'react'

import { HostHeader, Tp, HostFooter } from './Common'

import * as Dashboard from '../modules/dashboard'

import {
    LinkBlock, LinkDescription, LinkUpdate, SettingUpdate,
    Blocks, Block, BaseInfoItem, BaseInfoBtns, AccountDelete,
    TextClip,
    MiniBlock
} from './CompDashboard'

interface LinkPageProps {
    addressForm: Dashboard.FormInput
}

export const LinkPage: React.SFC<LinkPageProps> = (props) => {
    return (
        <div>
            <HostHeader />
            <LinkBlock>
                <LinkDescription />
                <LinkUpdate form={props.addressForm} />
            </LinkBlock>
        </div>
    )
}

interface MainPageProps {
    name: string
    email: string
    address: string

    addressForm: Dashboard.FormInput
    settingForm: Dashboard.SettingFormInput

    onShowPage: () => void
    onLogout: () => void
    onDeleteAccout: () => void
}

export const MainPage: React.SFC<MainPageProps> = (props) => {
    return (
        <div>
            <HostHeader />
            <Blocks>
                <Block title={"基本情報"}>
                    <BaseInfoItem><Tp>{props.name}</Tp></BaseInfoItem>
                    <BaseInfoItem><Tp>{props.email}</Tp></BaseInfoItem>
                    <BaseInfoItem>
                        <TextClip url={window.location.host + "/" + props.address}
                            ><Tp>{window.location.host + "/" + props.address}</Tp></TextClip>            
                    </BaseInfoItem>
                    <BaseInfoBtns 
                        onShowPage={props.onShowPage}
                        onLogout={props.onLogout}
                    />
                </Block>

                <Block title={"リンク管理"}>
                    <MiniBlock title={"リンクの変更"} withLine={true}>
                        <LinkUpdate form={props.addressForm} />
                    </MiniBlock>
                    <MiniBlock title={"設定の変更"}>
                        <SettingUpdate form={props.settingForm}/>
                    </MiniBlock>
                </Block>

                <Block title={"アカウント管理"}>
                    <MiniBlock title={"アカウントを削除する"}>
                        <AccountDelete onEnter={props.onDeleteAccout} />
                    </MiniBlock>
                </Block>
            </Blocks>
            <HostFooter />
        </div>
    )
}
