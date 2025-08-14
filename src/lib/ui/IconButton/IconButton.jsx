import classNames from '../../helpers/classNames'
import Arrow from '~/assets/icons/arrowDown.svg?react'
import s from './IconButton.module.scss'

export const IconButton = (props) => {
    const {
        label,
        state
    } = props
    return (
        <div className={classNames(s.IconButton, {}, [])}>
            <div className={s.label}>{label}</div>
            {/* <img src={Arrow} className={classNames(s.icon, {}, [])} /> */}
            <Arrow className={classNames(s.icon, {}, [])} />
        </div>
    )
}

