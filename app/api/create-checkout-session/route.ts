import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { config } from "../../../lib/config";
import { createServerLogger } from "../../../lib/logger";

const logger = createServerLogger("create-checkout-session");

const stripe = new Stripe(config.stripe.secretKey);

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin") ?? config.app.url;
    const body = await request.json();
    const { uid, email } = body as { uid?: string; email?: string | null };

    if (!uid || !email) {
      return NextResponse.json(
        { error: "Missing uid or email" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: config.stripe.priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        firebaseUid: uid,
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/settings`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Could not create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });

  } catch (error) {
    logger.error("Failed to create checkout session", error, { action: "createCheckoutSession" });
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
