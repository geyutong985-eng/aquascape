"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, CreditCard, PackageCheck, ShieldCheck, Truck } from "lucide-react"

import { Header, Footer } from "@/components/layouts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CheckoutDraft,
  clearCheckoutDraft,
  createOrderId,
  getCheckoutSubtotal,
  readCheckoutDraft,
  saveCheckoutOrder,
} from "@/lib/checkout"

const deliveryOptions = [
  { id: "standard", name: "标准配送", desc: "预计 5-7 天完成打印与发货", fee: 18 },
  { id: "studio", name: "到校自取", desc: "完成后在工作室确认取件", fee: 0 },
]

const paymentOptions = [
  { id: "wechat", name: "微信支付" },
  { id: "alipay", name: "支付宝" },
  { id: "card", name: "银行卡" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [draft, setDraft] = useState<CheckoutDraft | null>(null)
  const [ready, setReady] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState(deliveryOptions[0].id)
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0].id)
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  })

  useEffect(() => {
    queueMicrotask(() => {
      setDraft(readCheckoutDraft())
      setReady(true)
    })
  }, [])

  const selectedDelivery = deliveryOptions.find((option) => option.id === deliveryMethod) ?? deliveryOptions[0]
  const selectedPayment = paymentOptions.find((option) => option.id === paymentMethod) ?? paymentOptions[0]
  const subtotal = useMemo(() => getCheckoutSubtotal(draft?.items ?? []), [draft])
  const productionFee = draft?.items.length ? Math.max(28, draft.items.length * 12) : 0
  const total = subtotal + productionFee + selectedDelivery.fee

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draft) return
    const orderId = createOrderId()
    saveCheckoutOrder({
      ...draft,
      orderId,
      status: "已提交",
      paymentMethod: selectedPayment.name,
      deliveryMethod: selectedDelivery.name,
      customer,
      subtotal,
      productionFee,
      deliveryFee: selectedDelivery.fee,
      total,
    })
    clearCheckoutDraft()
    router.push(`/profile/orders?created=${orderId}`)
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-24 md:px-8">
          <div className="h-40 rounded-lg border bg-card" />
        </main>
      </div>
    )
  }

  if (!draft || draft.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-24 md:px-8">
          <Link href="/editor" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            返回编辑器
          </Link>
          <section className="mt-8 rounded-lg border bg-card p-8">
            <h1 className="text-2xl font-heading font-medium text-foreground">还没有可结算的方案</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              先在 3D 编辑器里添加模型、确认材质和颜色，再进入下单确认。
            </p>
            <Button asChild className="mt-6">
              <Link href="/editor">去编辑器</Link>
            </Button>
          </section>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 md:px-8">
        <Link href="/editor" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          返回编辑器
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <form id="checkout-form" onSubmit={submitOrder} className="space-y-6">
            <section className="rounded-lg border bg-card p-6">
              <div className="mb-5 flex items-center gap-3">
                <PackageCheck className="h-5 w-5 text-brand" />
                <div>
                  <h1 className="text-2xl font-heading font-medium text-foreground">确认订单信息</h1>
                  <p className="text-sm text-muted-foreground">核对收货信息、配送方式和支付方式。</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">联系人</span>
                  <Input required value={customer.name} onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))} placeholder="姓名" />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-foreground">手机号</span>
                  <Input required value={customer.phone} onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))} placeholder="用于订单确认" />
                </label>
              </div>

              <label className="mt-4 block space-y-2">
                <span className="text-sm font-medium text-foreground">收货地址</span>
                <Input required value={customer.address} onChange={(event) => setCustomer((current) => ({ ...current, address: event.target.value }))} placeholder="省市区、详细地址" />
              </label>

              <label className="mt-4 block space-y-2">
                <span className="text-sm font-medium text-foreground">备注</span>
                <textarea
                  value={customer.note}
                  onChange={(event) => setCustomer((current) => ({ ...current, note: event.target.value }))}
                  placeholder="对尺寸、颜色或打印效果的补充说明"
                  className="min-h-24 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
            </section>

            <section className="rounded-lg border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <Truck className="h-5 w-5 text-brand" />
                <h2 className="text-xl font-heading font-medium text-foreground">配送方式</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {deliveryOptions.map((option) => (
                  <label key={option.id} className={`cursor-pointer rounded-lg border p-4 transition-colors ${deliveryMethod === option.id ? "border-brand bg-brand/5" : "border-border hover:border-brand/50"}`}>
                    <input className="sr-only" type="radio" name="delivery" checked={deliveryMethod === option.id} onChange={() => setDeliveryMethod(option.id)} />
                    <span className="flex items-center justify-between gap-3">
                      <span>
                        <span className="block font-medium text-foreground">{option.name}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">{option.desc}</span>
                      </span>
                      <span className="text-sm font-semibold text-foreground">{option.fee ? `¥${option.fee}` : "免费"}</span>
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-lg border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-brand" />
                <h2 className="text-xl font-heading font-medium text-foreground">支付方式</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {paymentOptions.map((option) => (
                  <label key={option.id} className={`cursor-pointer rounded-lg border p-4 text-sm font-medium transition-colors ${paymentMethod === option.id ? "border-brand bg-brand/5 text-brand" : "border-border text-foreground hover:border-brand/50"}`}>
                    <input className="sr-only" type="radio" name="payment" checked={paymentMethod === option.id} onChange={() => setPaymentMethod(option.id)} />
                    {option.name}
                  </label>
                ))}
              </div>
            </section>
          </form>

          <aside className="h-fit rounded-lg border bg-card p-6 lg:sticky lg:top-24">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-heading font-medium text-foreground">订单清单</h2>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{draft.items.length} 个模型</span>
            </div>

            {draft.tankSize && (
              <div className="mb-4 rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                鱼缸尺寸：{draft.tankSize.length} × {draft.tankSize.width} × {draft.tankSize.height} cm
              </div>
            )}

            <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
              {draft.items.map((item) => (
                <div key={item.id} className="rounded-lg border border-border/70 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.material} · {item.color}</p>
                    </div>
                    <p className="font-semibold text-foreground">¥{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>模型小计</span><span>¥{subtotal}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>打印处理</span><span>¥{productionFee}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>配送</span><span>{selectedDelivery.fee ? `¥${selectedDelivery.fee}` : "免费"}</span></div>
              <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold text-foreground"><span>合计</span><span>¥{total}</span></div>
            </div>

            <Button type="submit" form="checkout-form" className="mt-5 w-full">
              确认支付 ¥{total}
            </Button>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              当前提交后进入订单确认，真实支付接口可在后续接入。
            </p>
          </aside>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-brand" />
          下单后会保留模型、材质、颜色和鱼缸尺寸，便于后续确认生产。
        </div>
      </main>
      <Footer />
    </div>
  )
}
