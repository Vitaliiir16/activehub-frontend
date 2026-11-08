import { useEffect, useRef, useState, type FormEvent } from "react";
import { api, type Booking } from "../api/client";
import { Feedback, text, useFormState } from "../components/forms";
import { dateTime, money } from "./shared";
export function PaymentForm({
  booking,
  onPaid,
}: {
  booking: Booking;
  onPaid: () => void;
}) {
  const state = useFormState(),
    attempt = useRef<{ body: string; key: string } | null>(null),
    [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const expired = !booking.deadlineAt || now >= Date.parse(booking.deadlineAt);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const element = e.currentTarget,
      form = new FormData(element);
    void state.run(async () => {
      const body = {
        number: text(form, "number").replaceAll(/\s/g, ""),
        holder: text(form, "holder"),
        expiryMonth: Number(text(form, "expiryMonth")),
        expiryYear: Number(text(form, "expiryYear")),
        cvv: text(form, "cvv"),
      };
      const fingerprint = JSON.stringify(body);
      if (attempt.current?.body !== fingerprint)
        attempt.current = { body: fingerprint, key: crypto.randomUUID() };
      const payment = await api.payBooking(
        booking.id,
        body,
        attempt.current!.key,
      );
      attempt.current = null;
      element.reset();
      onPaid();
      if (payment.status === "FAILED")
        throw Error(
          "The simulated card was declined. No payment was taken. You can try another card before the deadline.",
        );
    }, "Payment successful");
  }
  return (
    <form className="panel section-space" onSubmit={submit}>
      <h2>Simulated card payment</h2>
      <p>
        No real money is charged. Use 4242 4242 4242 4242 for success or 4000
        0000 0000 0002 for a decline.
      </p>
      <p>
        Due: {money(booking.amountDueMinor)} · Deadline:{" "}
        {booking.deadlineAt ? dateTime(booking.deadlineAt) : "Elapsed"}
      </p>
      <div className="filter-grid">
        <label>
          Card number
          <input
            name="number"
            required
            inputMode="numeric"
            autoComplete="off"
            pattern="[0-9 ]{13,23}"
            maxLength={23}
          />
        </label>
        <label>
          Cardholder
          <input
            name="holder"
            required
            minLength={2}
            maxLength={100}
            autoComplete="off"
          />
        </label>
        <label>
          Expiry month
          <input
            name="expiryMonth"
            required
            type="number"
            min="1"
            max="12"
            autoComplete="off"
          />
        </label>
        <label>
          Expiry year
          <input
            name="expiryYear"
            required
            type="number"
            min={new Date().getUTCFullYear()}
            max="9999"
            autoComplete="off"
          />
        </label>
        <label>
          CVV
          <input
            name="cvv"
            type="password"
            required
            inputMode="numeric"
            pattern="[0-9]{3,4}"
            maxLength={4}
            autoComplete="off"
          />
        </label>
      </div>
      <Feedback state={state} />
      {expired && (
        <p role="alert">
          The payment deadline has passed. Refresh to see the final booking
          status.
        </p>
      )}
      <button disabled={state.busy || expired}>
        {state.busy ? "Processing payment..." : "Pay now"}
      </button>
    </form>
  );
}
export function Receipts({ booking }: { booking: Booking }) {
  return (
    <section className="panel section-space">
      <h2>Payments and receipts</h2>
      {booking.payments.length ? (
        booking.payments.map((p) => (
          <article key={p.id}>
            <h3>
              {p.status === "FAILED"
                ? "Declined attempt"
                : p.status === "REFUNDED"
                  ? "Refunded receipt"
                  : "Payment receipt"}
            </h3>
            <p>Reference: {p.id}</p>
            <p>
              {dateTime(p.createdAt)} · {money(p.amountMinor)} · Card ending{" "}
              {p.cardLast4}
            </p>
            {p.refundedAt && (
              <p>
                Full refund returned to the same simulated card on{" "}
                {dateTime(p.refundedAt)}.
              </p>
            )}
          </article>
        ))
      ) : (
        <p>
          {booking.paymentMethod === "SUBSCRIPTION" ? "Covered by subscription visits. No card payment is required." : booking.paymentMethod === "FREE"
            ? "This booking is free. No payment is needed."
            : "No payment attempts yet."}
        </p>
      )}
    </section>
  );
}
