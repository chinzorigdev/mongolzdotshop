import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

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

    body.orderNumber = `${prefix}-${datePart}-${randomPart}`;

    // Calculate shipping fee (free for 3+ items)
    const shippingFee = body.items && body.items.length >= 3 ? 0 : 6000;
    body.shippingFee = shippingFee;

    // Calculate total
    if (body.items) {
      const itemsTotal = body.items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );
      body.total = itemsTotal + shippingFee;
    }

    const order = new Order(body);
    await order.save();

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
