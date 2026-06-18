export const CHECKOUT_DRAFT_KEY = "finscape:checkout-draft"
export const CHECKOUT_ORDERS_KEY = "finscape:orders"

export type CheckoutItem = {
  id: string
  name: string
  material: string
  color: string
  price: number
  scale: number
  scaleX: number
  scaleY: number
  scaleZ: number
  modelPath?: string
}

export type CheckoutDraft = {
  id: string
  source: "editor" | "membership"
  createdAt: string
  tankSize?: {
    length: number
    width: number
    height: number
  }
  items: CheckoutItem[]
}

export type CheckoutCustomer = {
  name: string
  phone: string
  address: string
  note: string
}

export type CheckoutOrder = CheckoutDraft & {
  orderId: string
  status: "已提交" | "生产确认中" | "待支付"
  paymentMethod: string
  deliveryMethod: string
  customer: CheckoutCustomer
  subtotal: number
  productionFee: number
  deliveryFee: number
  total: number
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage)
}

export function createCheckoutDraftId() {
  return `draft-${Date.now()}`
}

export function createOrderId() {
  return `FS${new Date().toISOString().slice(2, 10).replaceAll("-", "")}${String(Date.now()).slice(-5)}`
}

export function getCheckoutSubtotal(items: CheckoutItem[]) {
  return items.reduce((sum, item) => sum + item.price, 0)
}

export function readCheckoutDraft() {
  if (!canUseStorage()) return null
  const raw = window.localStorage.getItem(CHECKOUT_DRAFT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as CheckoutDraft
  } catch {
    window.localStorage.removeItem(CHECKOUT_DRAFT_KEY)
    return null
  }
}

export function saveCheckoutDraft(draft: CheckoutDraft) {
  if (!canUseStorage()) return
  window.localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft))
}

export function clearCheckoutDraft() {
  if (!canUseStorage()) return
  window.localStorage.removeItem(CHECKOUT_DRAFT_KEY)
}

export function readCheckoutOrders() {
  if (!canUseStorage()) return []
  const raw = window.localStorage.getItem(CHECKOUT_ORDERS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as CheckoutOrder[]
  } catch {
    window.localStorage.removeItem(CHECKOUT_ORDERS_KEY)
    return []
  }
}

export function saveCheckoutOrder(order: CheckoutOrder) {
  if (!canUseStorage()) return
  const orders = readCheckoutOrders()
  window.localStorage.setItem(CHECKOUT_ORDERS_KEY, JSON.stringify([order, ...orders]))
}
