"use client"

import { useEffect, useState } from "react"

import { readCheckoutOrders, type CheckoutOrder } from "@/lib/checkout"
import { ProfileList } from "../components/list"

export default function OrdersPage() {
  const [orders, setOrders] = useState<CheckoutOrder[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    queueMicrotask(() => {
      setOrders(readCheckoutOrders())
      setReady(true)
    })
  }, [])

  const items = orders.map((order) => ({
    id: order.orderId,
    title: `订单 ${order.orderId}`,
    description: `${order.items.length} 个模型 · ${order.deliveryMethod} · ${order.paymentMethod}`,
    date: new Date(order.createdAt).toLocaleDateString("zh-CN"),
    status: order.status,
    price: `¥${order.total}`,
    href: "#",
  }))

  return (
    <ProfileList
      title="我的订单"
      description="查看你的订单历史"
      items={items}
      emptyText={ready ? "还没有订单记录" : "正在读取订单"}
    />
  )
}
