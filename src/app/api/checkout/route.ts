import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Generate a unique order number (TMZ-YYYYMMDD-XXXX)
    const date = new Date();
    const prefix = "TMZ";
    const datePart = `${date.getFullYear()}${String(
      date.getMonth() + 1
    ).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
    const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random number

    const orderNumber = `${prefix}-${datePart}-${randomPart}`;

    // Calculate shipping fee (free for 3+ items)
    let totalQuantity = 0;
    body.items.forEach((item: any) => {
      totalQuantity += item.quantity;
    });

    const shippingFee = totalQuantity >= 3 ? 0 : 6000;

    // Calculate total
    const itemsTotal = body.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const total = itemsTotal + shippingFee;

    const orderData = {
      orderNumber,
      customer: body.customer,
      items: body.items,
      total,
      shippingFee,
      status: "pending",
      paymentMethod: "bankTransfer",
    };

    const order = new Order(orderData);
    await order.save();

    return NextResponse.json(
      {
        success: true,
        order: {
          orderNumber,
          total,
          shippingFee,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process checkout",
      },
      { status: 500 }
    );
  }
}
