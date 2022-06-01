import { Root } from 'react-dom/client'
import { UserFields } from './user'


export interface PopupInterface {
  type: string
  user: UserFields | null,
  pageId?: string
}

export interface ModalRootInterface {
  element: Root | null,
  pageId?: string
}

export interface PopupUC {
  user: UserFields | null
}
