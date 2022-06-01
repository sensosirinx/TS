import React from 'react'
import { Navigate, NavLink, useParams } from 'react-router-dom'
import { useTypedSelector } from '../hooks/useTypedSelector'
import _ from 'lodash'
import locale from '../locale/index.json'
import config from '../config.json'


const Pagination: React.FC = () => {

  const { totalCount, users } = useTypedSelector(state => state.user)
  const limit = config.limitUsersPerPage
  const totalPages = Math.ceil(totalCount / limit)
  const { pageId } = useParams<"pageId">()
  const currentPage = pageId && parseInt(pageId) || 1

  const leftSiblingIndex = Math.max(currentPage - 1, 1)
  const rightSiblingIndex = Math.min(currentPage + 1, totalPages)

  const shouldShowLeftDots = leftSiblingIndex > 2
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1

  if (currentPage > totalPages && totalPages > 0 && users.length === 0) {
    return (
      <Navigate to={"/contacts/" + totalPages} replace={true} />
    )
  }

  if (!totalPages) {
    return null
  }

  const dots = <div className={'dots'}>...</div>

  return (
    <nav className={'pagination'}>
      {currentPage > 1 ?
        <NavLink end to="/contacts/" className={"nav-link"}>{locale.nav.start}</NavLink> :
      <div className={"nav-link"}>{locale.nav.start}</div>}
      {shouldShowLeftDots ? dots : ''}
      {_.times(totalPages, (i) => {
        const number = i + 1
        let navClassName = 'nav-link'
        if (currentPage === 1 && number === 1) {
          navClassName = 'nav-link active'
        }
        if (number >= leftSiblingIndex && number <= rightSiblingIndex) {
          return (
            <NavLink key={number} end to={"/contacts/" + number} className={navClassName}>{number}</NavLink>
          )
        }
      })}
      {shouldShowRightDots ? dots : ''}
      {currentPage === totalPages ?
        <div className={"nav-link"}>{locale.nav.end}</div>:
        <NavLink end to={"/contacts/" + totalPages} className={"nav-link"}>{locale.nav.end}</NavLink>}
    </nav>
  )
}

export default Pagination
