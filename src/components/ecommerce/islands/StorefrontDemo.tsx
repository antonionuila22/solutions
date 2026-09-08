import { useMemo, useState } from "react";

/**
 * StorefrontDemo — a working mini store: add to cart, adjust quantity, watch
 * the free-shipping bar fill, and run a three-step checkout that ends in an
 * order confirmation. Everything is local state; nothing is sent anywhere.
 * SSR renders the products and an empty cart, so the section reads fine
 * before hydration and for crawlers.
 */

type Product = { id: string; name: string; price: number; tag: string; tone: string; initial: string };

const PRODUCTS: Product[] = [
  { id: "p1", name: "Trail Runner 2", price: 129, tag: "Best seller", tone: "bg-cyan-100 text-cyan-900", initial: "TR" },
  { id: "p2", name: "Merino crew socks, 3-pack", price: 32, tag: "Bundle", tone: "bg-amber-100 text-amber-900", initial: "MS" },
  { id: "p3", name: "Hydration vest 5L", price: 89, tag: "New", tone: "bg-emerald-100 text-emerald-900", initial: "HV" },
];

const FREE_SHIPPING_AT = 100;
const FLAT_SHIPPING = 8;
const TAX_RATE = 0.0825;

type Step = "cart" | "shipping" | "payment" | "done";
const STEPS: { key: Step; label: string }[] = [
  { key: "cart", label: "Cart" },
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
];

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function StorefrontDemo() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [step, setStep] = useState<Step>("cart");
  const [paying, setPaying] = useState(false);
  const [orderNo, setOrderNo] = useState<number | null>(null);

  const lines = useMemo(
    () => PRODUCTS.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] })),
    [cart],
  );
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : FLAT_SHIPPING;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = subtotal + shipping + tax;
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const toFree = Math.max(0, FREE_SHIPPING_AT - subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_AT) * 100));

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const setQty = (id: string, qty: number) =>
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });

  const placeOrder = () => {
    setPaying(true);
    window.setTimeout(() => {
      setPaying(false);
      setOrderNo(1000 + Math.floor(Math.random() * 900));
      setStep("done");
    }, 700);
  };

  const reset = () => {
    setCart({});
    setStep("cart");
    setOrderNo(null);
  };

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-cyan-900/5 lg:grid-cols-12">
      {/* Storefront */}
      <div className="border-b border-slate-200 p-5 sm:p-6 lg:col-span-7 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">Live demo · try it</p>
          <p className="text-xs text-slate-500" aria-live="polite">
            {count === 0 ? "Cart is empty" : `${count} item${count > 1 ? "s" : ""} in cart`}
          </p>
        </div>

        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {PRODUCTS.map((p) => (
            <li key={p.id} className="rounded-xl border border-slate-200 p-3">
              <div className={`flex aspect-[4/3] items-center justify-center rounded-lg text-2xl font-extrabold ${p.tone}`} aria-hidden="true">
                {p.initial}
              </div>
              <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-700">{p.tag}</p>
              <p className="mt-0.5 text-sm font-semibold leading-tight text-slate-900">{p.name}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900" style={{ fontVariantNumeric: "tabular-nums" }}>{usd(p.price)}</span>
                {cart[p.id] ? (
                  <div className="flex items-center rounded-lg border border-slate-300" role="group" aria-label={`Quantity of ${p.name}`}>
                    <button type="button" onClick={() => setQty(p.id, cart[p.id] - 1)} className="px-2 py-1 text-sm font-bold text-slate-700 hover:bg-slate-100" aria-label={`Remove one ${p.name}`}>−</button>
                    <span className="min-w-[1.5rem] text-center text-sm font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>{cart[p.id]}</span>
                    <button type="button" onClick={() => setQty(p.id, cart[p.id] + 1)} className="px-2 py-1 text-sm font-bold text-slate-700 hover:bg-slate-100" aria-label={`Add one more ${p.name}`}>+</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => add(p.id)} disabled={step === "done"} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-cyan-800 disabled:opacity-40">
                    Add to cart
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Free shipping bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">{toFree > 0 ? `${usd(toFree)} away from free shipping` : "You unlocked free shipping"}</span>
            <span className="text-slate-500" style={{ fontVariantNumeric: "tabular-nums" }}>{progress}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to free shipping">
            <div className="h-full rounded-full bg-cyan-600 transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Checkout */}
      <div className="bg-[#f7fbfc] p-5 sm:p-6 lg:col-span-5">
        <ol className="flex items-center gap-2 text-xs" aria-label="Checkout steps">
          {STEPS.map((s, i) => {
            const active = step === "done" ? true : i <= stepIndex;
            return (
              <li key={s.key} className="flex items-center gap-2">
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${active ? "bg-cyan-700 text-white" : "bg-slate-200 text-slate-500"}`}>{i + 1}</span>
                <span className={active ? "font-semibold text-slate-900" : "text-slate-500"}>{s.label}</span>
                {i < STEPS.length - 1 && <span className="h-px w-4 bg-slate-300" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>

        <div className="mt-5 min-h-[15rem]">
          {step === "cart" && (
            <div>
              {lines.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">Add a product on the left. Notice the cart updates without a page reload.</p>
              ) : (
                <ul className="divide-y divide-slate-200 text-sm">
                  {lines.map((l) => (
                    <li key={l.id} className="flex items-center justify-between py-2">
                      <span className="text-slate-700">{l.qty} × {l.name}</span>
                      <span className="font-semibold text-slate-900" style={{ fontVariantNumeric: "tabular-nums" }}>{usd(l.price * l.qty)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {step === "shipping" && (
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-slate-900">Where should it go?</p>
              <div className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-400">Jordan Reyes</div>
              <div className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-400">1420 Market St, Denver, CO 80202</div>
              <div className="rounded-lg border border-cyan-600 bg-cyan-50 px-3 py-2 text-slate-800">
                {shipping === 0 ? "Standard shipping · Free" : `Standard shipping · ${usd(FLAT_SHIPPING)}`} <span className="text-slate-500">· 3 to 5 days</span>
              </div>
              <p className="text-xs text-slate-500">Address autocomplete and saved addresses go here on a real store.</p>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-slate-900">Pay securely</p>
              <div className="flex gap-2">
                <div className="flex-1 rounded-lg border border-cyan-600 bg-cyan-50 px-3 py-2 text-center text-xs font-semibold text-slate-800">Card</div>
                <div className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-xs text-slate-500">Apple Pay</div>
                <div className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-xs text-slate-500">PayPal</div>
              </div>
              <div className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-400" style={{ fontVariantNumeric: "tabular-nums" }}>4242 4242 4242 4242</div>
              <div className="flex gap-2">
                <div className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-400">12 / 28</div>
                <div className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-400">CVC</div>
              </div>
              <p className="text-xs text-slate-500">This is a demo. No card is charged and nothing leaves your browser.</p>
            </div>
          )}

          {step === "done" && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
              <p className="text-base font-bold text-emerald-900">Order #{orderNo} confirmed</p>
              <p className="mt-1 text-emerald-800">Confirmation email sent. Tracking follows when the label prints.</p>
              <p className="mt-3 text-xs text-emerald-700">That is the whole flow: three screens, no account required, total visible the entire time.</p>
            </div>
          )}
        </div>

        {/* Totals */}
        <dl className="mt-4 space-y-1 border-t border-slate-200 pt-3 text-sm" style={{ fontVariantNumeric: "tabular-nums" }}>
          <div className="flex justify-between text-slate-600"><dt>Subtotal</dt><dd>{usd(subtotal)}</dd></div>
          <div className="flex justify-between text-slate-600"><dt>Shipping</dt><dd>{subtotal === 0 ? usd(0) : shipping === 0 ? "Free" : usd(shipping)}</dd></div>
          <div className="flex justify-between text-slate-600"><dt>Tax (8.25%)</dt><dd>{usd(tax)}</dd></div>
          <div className="flex justify-between text-base font-bold text-slate-900"><dt>Total</dt><dd>{usd(total)}</dd></div>
        </dl>

        <div className="mt-4 flex gap-2">
          {step === "cart" && (
            <button type="button" onClick={() => setStep("shipping")} disabled={lines.length === 0} className="w-full rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-40">
              Checkout
            </button>
          )}
          {step === "shipping" && (
            <>
              <button type="button" onClick={() => setStep("cart")} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back</button>
              <button type="button" onClick={() => setStep("payment")} className="flex-1 rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-strong">Continue to payment</button>
            </>
          )}
          {step === "payment" && (
            <>
              <button type="button" onClick={() => setStep("shipping")} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Back</button>
              <button type="button" onClick={placeOrder} disabled={paying} className="flex-1 rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand-strong disabled:opacity-60">
                {paying ? "Processing…" : `Place order · ${usd(total)}`}
              </button>
            </>
          )}
          {step === "done" && (
            <button type="button" onClick={reset} className="w-full rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 hover:bg-white">Start over</button>
          )}
        </div>
      </div>
    </div>
  );
}
