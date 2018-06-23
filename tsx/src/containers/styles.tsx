import * as React from 'react'

import styles_sp from '../css/style_sp.css'
import styles_pc from '../css/style_pc.css'

import top_sp from '../css/top_sp.css'
import top_pc from '../css/top_pc.css'

import dashboard_sp from '../css/dashboard_sp.css'
import dashboard_pc from '../css/dashboard_pc.css'

import visit_sp from '../css/visit_sp.css'
import visit_pc from '../css/visit_pc.css'

import * as utility from '../modules/utility'

const styles = {
    common: utility.issp() ? styles_sp : styles_pc,
    top: utility.issp() ? top_sp : top_pc,
    dashboard: utility.issp() ? dashboard_sp : dashboard_pc,
    visit: utility.issp() ? visit_sp : visit_pc,
}
export default styles
