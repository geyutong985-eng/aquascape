"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, CreditCard, PackageCheck, ShieldCheck, Sparkles } from "lucide-react"

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

const paymentOptions = [
  { id: "wechat", name: "微信支付" },
  { id: "alipay", name: "支付宝" },
  { id: "card", name: "银行卡" },
]

const membershipPlans = [
  { id: "basic", name: "Basic 基础定制", desc: "免费保留当前打印订单，适合先体验基础造景。", price: 0, billing: "当前基础档", badge: "免费" },
  { id: "studio", name: "Studio 高级个性化", desc: "解锁 AI 方案生成、材质建议和更多方案版本。", price: 69, billing: "年付", badge: "推荐升级" },
  { id: "collectors", name: "Collectors 旗舰全能档", desc: "解锁联名系列、拓展包和设计师权益。", price: 99, billing: "年付", badge: "高阶权益" },
]

const defaultCustomer = {
  name: "",
  phone: "",
  address: "",
  note: "",
}

function findMembershipPlan(planId: string | null) {
  return membershipPlans.find((plan) => plan.id === planId) ?? membershipPlans[0]
}

export default function CheckoutPage() {
  const router = useRouter()
  const [draft, setDraft] = useState<CheckoutDraft | null>(null)
  const [ready, setReady] = useState(false)
  const [checkoutKind, setCheckoutKind] = useState<"editor" | "membership" | "empty">("empty")
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0].id)
  const [membershipPlanId, setMembershipPlanId] = useState("basic")
  const [customer, setCustomer] = useState(defaultCustomer)

  useEffect(() => {
    queueMicrotask(() => {
      const params = new URLSearchParams(window.location.search)
      const planId = params.get("plan")
      const plan = findMembershipPlan(planId)

      if (planId) {
        setDraft({
          id: `membership-${Date.now()}`,
          source: "membership",
          createdAt: new Date().toISOString(),
          items: [],
          membershipPlan: {
            id: plan.id,
            name: plan.name,
            price: plan.price,
            billing: plan.billing,
          },
        })
        setCheckoutKind("membership")
        setMembershipPlanId(plan.id)
      } else {
        const storedDraft = readCheckoutDraft()
        if (storedDraft?.items.length) {
          setDraft(storedDraft)
          setCheckoutKind("editor")
          setMembershipPlanId("basic")
        } else {
          setCheckoutKind("empty")
        }
      }

      setReady(true)
    })
  }, [])

  const selectedPayment = paymentOptions.find((option) => option.id === paymentMethod) ?? paymentOptions[0]
  const selectedMembership = findMembershipPlan(membershipPlanId)
  const subtotal = useMemo(() => getCheckoutSubtotal(draft?.items ?? []), [draft])
  const productionFee = checkoutKind === "editor" && draft?.items.length ? Math.max(28, draft.items.length * 12) : 0
  const deliveryFee = 0
  const membershipFee = selectedMembership.price
  const total = subtotal + productionFee + deliveryFee + membershipFee
  const requiresAddress = checkoutKind === "editor"

  const submitOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draft) return
    const orderId = createOrderId()
    saveCheckoutOrder({
      ...draft,
      source: checkoutKind === "membership" ? "membership" : "editor",
      membershipPlan: {
        id: selectedMembership.id,
        name: selectedMembership.name,
        price: selectedMembership.price,
        billing: selectedMembership.billing,
      },
      orderId,
      status: "已提交",
      paymentMethod: selectedPayment.name,
      deliveryMethod: requiresAddress ? "打印完成后联系确认" : "无需配送",
      customer: requiresAddress ? customer : { ...defaultCustomer, name: customer.name, phone: customer.phone },
      subtotal,
      productionFee,
      deliveryFee,
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

  if (!draft || checkoutKind === "empty") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-24 md:px-8">
          <Link href="/editor" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            返回编辑器
          </Link>
          <section className="mt-8 rounded-lg border bg-card p-8">
            <h1 className="text-2xl font-heading font-medium text-foreground">还没有可结算的内容</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              购买会员可以从会员方案页进入；模型打印订单需要先在 3D 编辑器里添加模型。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/editor">去编辑器</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/membership">查看会员方案</Link>
              </Button>
            </div>
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
        <Link href={checkoutKind === "membership" ? "/membership" : "/editor"} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          {checkoutKind === "membership" ? "返回会员方案" : "返回编辑器"}
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <form id="checkout-form" onSubmit={submitOrder} className="space-y-6">
            <section className="rounded-lg border bg-card p-6">
              <div className="mb-5 flex items-center gap-3">
                <PackageCheck className="h-5 w-5 text-brand" />
                <div>
                  <h1 className="text-2xl font-heading font-medium text-foreground">
                    {checkoutKind === "membership" ? "确认会员付款" : "确认打印订单"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {checkoutKind === "membership" ? "会员服务不需要收货地址，只需确认联系方式与支付方式。" : "核对收货信息、配送方式和支付方式。"}
                  </p>
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

              {requiresAddress && (
                <>
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
                </>
              )}
            </section>

            {requiresAddress && (
              <section className="rounded-lg border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-brand" />
                  <h2 className="text-xl font-heading font-medium text-foreground">会员方案</h2>
                </div>
                <p className="mb-4 rounded-lg bg-brand/5 px-4 py-3 text-sm text-brand">
                  升级会员可解锁 AI 方案生成、更多模型库和设计师服务；Basic 就是免费基础档。
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  {membershipPlans.map((plan) => (
                    <label key={plan.id} className={`relative cursor-pointer rounded-lg border p-4 transition-colors ${membershipPlanId === plan.id ? "border-brand bg-brand/5" : "border-border hover:border-brand/50"} ${plan.id === "studio" ? "shadow-sm shadow-brand/10" : ""}`}>
                      <input className="sr-only" type="radio" name="membership" checked={membershipPlanId === plan.id} onChange={() => setMembershipPlanId(plan.id)} />
                      <span className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${plan.id === "studio" ? "bg-brand text-white" : "bg-muted text-muted-foreground"}`}>{plan.badge}</span>
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block font-medium text-foreground">{plan.name}</span>
                          <span className="mt-1 block text-xs leading-5 text-muted-foreground">{plan.desc}</span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold text-foreground">{plan.price ? `¥${plan.price}` : "¥0"}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {checkoutKind === "membership" && (
              <section className="rounded-lg border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-brand" />
                  <h2 className="text-xl font-heading font-medium text-foreground">会员方案</h2>
                </div>
                <p className="mb-4 rounded-lg bg-brand/5 px-4 py-3 text-sm text-brand">
                  推荐 Studio 年付方案，适合需要 AI 辅助快速出方案的造景用户。
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  {membershipPlans.map((plan) => (
                    <label key={plan.id} className={`relative cursor-pointer rounded-lg border p-4 transition-colors ${membershipPlanId === plan.id ? "border-brand bg-brand/5" : "border-border hover:border-brand/50"} ${plan.id === "studio" ? "shadow-sm shadow-brand/10" : ""}`}>
                      <input className="sr-only" type="radio" name="membership" checked={membershipPlanId === plan.id} onChange={() => setMembershipPlanId(plan.id)} />
                      <span className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${plan.id === "studio" ? "bg-brand text-white" : "bg-muted text-muted-foreground"}`}>{plan.badge}</span>
                      <span className="block font-medium text-foreground">{plan.name}</span>
                      <span className="mt-1 block text-xs leading-5 text-muted-foreground">{plan.desc}</span>
                      <span className="mt-3 block text-lg font-semibold text-foreground">{plan.price ? `¥${plan.price}` : "¥0"}</span>
                    </label>
                  ))}
                </div>
              </section>
            )}

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
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {checkoutKind === "membership" ? "会员服务" : `${draft.items.length} 个模型`}
              </span>
            </div>

            {draft.tankSize && (
              <div className="mb-4 rounded-lg bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                鱼缸尺寸：{draft.tankSize.length} × {draft.tankSize.width} × {draft.tankSize.height} cm
              </div>
            )}

            {checkoutKind === "membership" ? (
              <div className="rounded-lg border border-border/70 p-3">
                <p className="font-medium text-foreground">{selectedMembership.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{selectedMembership.billing || "免费方案"}</p>
              </div>
            ) : (
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
            )}

            <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
              {checkoutKind === "editor" && (
                <>
                  <div className="flex justify-between text-muted-foreground"><span>模型小计</span><span>¥{subtotal}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>打印处理</span><span>¥{productionFee}</span></div>
                </>
              )}
              <div className="flex justify-between text-muted-foreground"><span>会员方案</span><span>{membershipFee ? `¥${membershipFee}` : "免费"}</span></div>
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
          {checkoutKind === "membership" ? "会员订单不会要求填写收货地址。" : "打印订单会保留模型、材质、颜色和鱼缸尺寸，便于后续确认生产。"}
        </div>
      </main>
      <Footer />
    </div>
  )
}
