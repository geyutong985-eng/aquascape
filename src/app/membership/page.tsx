import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "@/components/icons";
import { Footer, Header } from "@/components/layouts";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Basic",
    cnName: "基础定制",
    audience: "适合第一次尝试个性化鱼缸造景的用户。",
    annualPrice: "¥0",
    monthlyPrice: "¥0",
    cta: "开始免费定制",
    href: "/editor",
    tone: "standard",
    highlight: "",
    savings: "",
    features: [
      "浏览官方与社区灵感案例",
      "使用基础模板定制",
      "调整尺寸、基础材质和颜色",
      "查看基础价格区间",
      "按产品尺寸与材料支付基础费用",
    ],
  },
  {
    name: "Studio",
    cnName: "高级个性化",
    audience: "适合希望用 AI 更快得到完整造景方向的玩家。",
    annualPrice: "¥69",
    monthlyPrice: "¥9",
    cta: "选择 Studio",
    href: "/editor?plan=studio",
    tone: "popular",
    highlight: "常用选择",
    savings: "年付省 ¥39",
    features: [
      "包含 Basic 全部功能",
      "AI 辅助生成造景方向",
      "AI 材质与颜色搭配建议",
      "参数化调整建议",
      "每月 10 次 AI 方案生成",
      "每个订单 3 次方案微调建议",
      "保存多个方案版本",
    ],
  },
  {
    name: "Collectors",
    cnName: "旗舰全能档",
    audience: "适合追求联名系列、拓展包和设计师合作款的深度玩家。",
    annualPrice: "¥99",
    monthlyPrice: "¥15",
    cta: "选择 Collectors",
    href: "/editor?plan=collectors",
    tone: "premium",
    highlight: "合作系列权益",
    savings: "年付省 ¥81",
    features: [
      "包含 Studio 全部功能",
      "解锁全部联名系列",
      "解锁全部拓展包",
      "解锁设计师合作款",
      "合作款与限定款享会员专属价",
      "每月 30 次 AI 方案生成",
      "每月 2 次设计师方案点评",
      "新系列优先体验",
    ],
  },
];

const comparisonRows = [
  ["基础模板定制", "包含", "包含", "包含"],
  ["尺寸 / 材质 / 颜色调整", "基础", "高级建议", "高级建议"],
  ["AI 方案生成", "-", "10 次 / 月", "30 次 / 月"],
  ["AI 材质颜色建议", "-", "包含", "包含"],
  ["方案微调建议", "-", "每单 3 次", "每单 3 次"],
  ["联名系列", "-", "-", "全部解锁"],
  ["拓展包", "-", "-", "全部解锁"],
  ["设计师合作款", "-", "-", "全部解锁"],
  ["合作款与限定款权益", "标准价格", "标准价格", "会员专属价"],
  ["设计师方案点评", "-", "-", "2 次 / 月"],
];

const faqs = [
  {
    q: "会员费包含产品本身价格吗？",
    a: "不包含。会员费覆盖 AI、个性化服务和高级内容库权益；实际产品仍按尺寸、材料、打印和运输单独计价。",
  },
  {
    q: "Collectors 还需要支付什么费用？",
    a: "Collectors 可享联名系列、拓展包和设计师合作款的会员专属权益，但产品的基础制作费用仍按实际方案计算。",
  },
  {
    q: "AI 生成的方案可以直接下单吗？",
    a: "可以作为下单基础。最终价格会根据鱼缸尺寸、模型数量、材料和颜色工艺重新计算。",
  },
];

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-24 md:px-8">
        <section className="border-b border-border pb-6">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-sm font-medium text-brand">
              <Sparkles className="h-4 w-4" />
              Membership
            </p>
            <h1 className="mt-4 text-3xl font-heading leading-tight text-foreground md:text-5xl">
              让你的鱼缸造景走得更远
            </h1>
            <p className="mt-3 max-w-5xl text-base leading-relaxed text-muted-foreground xl:whitespace-nowrap">
              会员服务费用于解锁 AI 辅助、个性化方案和高级内容库；产品本身仍按尺寸、材料、打印和运输单独计价。
            </p>
          </div>
        </section>

        <section className="membership-billing py-8">
          <input id="billing-annual" className="billing-annual sr-only" type="radio" name="billing-cycle" defaultChecked />
          <input id="billing-monthly" className="billing-monthly sr-only" type="radio" name="billing-cycle" />

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-baseline lg:gap-4">
              <h2 className="text-xl font-heading text-foreground md:text-2xl">选择会员方案</h2>
              <p className="text-sm text-muted-foreground lg:whitespace-nowrap">默认年度会员，适合周期更长的造景项目。</p>
            </div>

            <div className="membership-toggle inline-flex w-fit rounded-lg border bg-card p-1">
              <label htmlFor="billing-monthly" className="monthly-toggle cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors">
                月度
              </label>
              <label htmlFor="billing-annual" className="annual-toggle cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-colors">
                年度
              </label>
            </div>
          </div>

          <div className="membership-pricing grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => {
              const emphasized = plan.tone === "popular" || plan.tone === "premium";

              return (
                <article
                  key={plan.name}
                  className={`flex min-h-[600px] flex-col rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${
                    emphasized ? "border-brand shadow-brand/10" : "border-border"
                  }`}
                >
                  <div className="flex min-h-[30px] items-center justify-between gap-3">
                    {plan.highlight ? (
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${emphasized ? "bg-brand/10 text-brand" : "bg-muted text-muted-foreground"}`}>
                        {plan.highlight}
                      </span>
                    ) : (
                      <span />
                    )}
                    {plan.savings ? (
                      <span className="annual-only rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{plan.savings}</span>
                    ) : null}
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-semibold tracking-[0.18em] text-brand">{plan.name}</p>
                    <h3 className="mt-2 text-2xl font-heading text-foreground">{plan.cnName}</h3>
                    <p className="mt-3 min-h-[48px] text-sm leading-relaxed text-muted-foreground">{plan.audience}</p>
                  </div>

                  <div className="mt-8 flex items-end gap-1">
                    <span className="annual-price">
                      <span className="text-5xl font-heading text-foreground">{plan.annualPrice}</span>
                      <span className="pb-2 text-sm text-muted-foreground">{plan.name === "Basic" ? "" : "/年"}</span>
                    </span>
                    <span className="monthly-price">
                      <span className="text-5xl font-heading text-foreground">{plan.monthlyPrice}</span>
                      <span className="pb-2 text-sm text-muted-foreground">{plan.name === "Basic" ? "" : "/月"}</span>
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {plan.name === "Basic" ? (
                      "产品基础费用按实际方案计算"
                    ) : (
                      <>
                        <span className="annual-price">默认推荐，产品基础费用另算</span>
                        <span className="monthly-price">灵活体验，产品基础费用另算</span>
                      </>
                    )}
                  </p>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button asChild variant={emphasized ? "brand" : "outline"} className="mt-auto">
                    <Link href={plan.href}>
                      {plan.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-t border-border py-14">
          <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-heading text-foreground">功能对比</h2>
              <p className="mt-2 text-sm text-muted-foreground">把基础定制、AI 服务和高级内容库的差异说明白。</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left">
                  <th className="px-5 py-4 font-medium text-foreground">功能</th>
                  <th className="px-5 py-4 font-medium text-foreground">Basic</th>
                  <th className="px-5 py-4 font-medium text-foreground">Studio</th>
                  <th className="px-5 py-4 font-medium text-foreground">Collectors</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([feature, basic, studio, collectors]) => (
                  <tr key={feature} className="border-b last:border-b-0">
                    <td className="px-5 py-4 font-medium text-foreground">{feature}</td>
                    <td className="px-5 py-4 text-muted-foreground">{basic}</td>
                    <td className="px-5 py-4 text-muted-foreground">{studio}</td>
                    <td className="px-5 py-4 text-foreground">{collectors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-5 border-t border-border py-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-heading text-foreground">从灵感到下单</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              从灵感浏览到方案确认，每一步都可以逐步推进；先免费试做基础方案，再按需要解锁 AI、设计服务和高级系列。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["浏览灵感案例", "免费体验基础定制", "解锁 AI / 个性化服务", "确认材质尺寸与价格", "下单打印生产", "配送到家"].map((step, index) => (
              <div key={step} className="rounded-lg border bg-card p-4">
                <p className="text-sm font-heading text-brand">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-2 font-medium text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border pt-14">
          <h2 className="text-3xl font-heading text-foreground">FAQ</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-lg border bg-card p-5">
                <h3 className="font-medium text-foreground">{faq.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
