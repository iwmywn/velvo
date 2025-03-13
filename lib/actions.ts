"use server";

import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";
import { revalidatePath } from "next/cache";
import {
  getCartCollection,
  getInvoiceListCollection,
  getProductCollection,
} from "@lib/collections";
import { InvoiceList } from "@lib/definitions";
import { verifySession } from "@lib/dal";

export async function sendEmail(
  email: string,
  token: string,
  mode: "resetPassword" | "verifyEmail",
) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const emailHandlerUrl = `${process.env.NEXT_PUBLIC_URL}/email-handler?mode=${
    mode === "verifyEmail" ? "verifyEmail" : "resetPassword"
  }&token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `${mode === "verifyEmail" ? "Verify your Velvo account" : "Reset your Velvo password"} `,
    html: `
      <table
      style="width: 100%; background-color: #e7f1ff; padding: 20px 40px; border-radius: 12px; text-align: center; font-family: Arial, sans-serif;">
      <tr>
        <td>
          <p style="font-size: 22px; font-weight: 600; margin-bottom: 20px; margin-top: 0px">Velvo</p>
          <p style="font-size: 16px; margin: 10px 0 20px 0; line-height: 1.6;">
            Hey there, <br>
            ${
              mode === "verifyEmail"
                ? "Thanks for joining Velvo! We just need one more thing you - a quick confirmation of your email address. Click the button below to verify your email and get started."
                : "Nobody likes being locked out of their account. We're coming to your rescue - just click the button below to get started. If you didn't request a password reset, you can safely ignore this email."
            }
          </p>
          <a href="${emailHandlerUrl}"
            style="display: inline-block; padding: 8px 20px; background-color: #3e71b8; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">${mode === "verifyEmail" ? "Verify" : "Reset your password"}</a>
          <p style="font-size: 14px; margin-top: 20px;">
            Cheers,
            <span style="margin-top: 8px; display: block"></span>
            Ngo Nguyen Viet Anh - Hoang Anh Tuan
          </p>
          <div style="height: 2px; background-color: #666; opacity: 0.2; margin: 30px 0"></div>
          <p style="color: #666; font-size: 12px">Alternatively, you can copy and paste the link below into your browser:
            <span style="margin: 6px 0; display: block"></span>
            <a href="${emailHandlerUrl}"
              style="display: inline-block; transition: background-color 0.3s ease;">${emailHandlerUrl}</a>
          </p>
        </td>
      </tr>
    </table>
    `,
  });
}

export async function addToCart(
  productId: string,
  color: string | null,
  size?: string | null,
  quantity: number = 1,
): Promise<string> {
  const { userId } = await verifySession();

  if (!userId || !productId || !color) {
    return "Invalid field!";
  }

  try {
    const cartCollection = await getCartCollection();
    const productCollection = await getProductCollection();
    const product = await productCollection.findOne({
      _id: new ObjectId(productId),
    });
    const withSize = typeof size === "string";
    const remainingQuantity: number = color
      ? size && typeof product!.colors[color] === "object"
        ? product!.colors[color].sizes[size]
        : typeof product!.colors[color] === "number"
          ? product!.colors[color]
          : 0
      : 0;
    const cart = await cartCollection.findOne({ userId: new ObjectId(userId) });
    let currentQuantityInCart: number = 0;

    if (cart) {
      const existingProduct = cart.products.find(
        (p) =>
          p.productId.toString() === productId &&
          p.color === color &&
          withSize &&
          p.size === size,
      );

      console.log(existingProduct);

      if (existingProduct) {
        currentQuantityInCart = existingProduct.quantity;
      }
    }

    if (currentQuantityInCart + quantity > remainingQuantity) {
      return `Cannot add more. You have added ${currentQuantityInCart} product(s). Only ${
        remainingQuantity - currentQuantityInCart
      } left in stock.`;
    }

    const existingProductIndex = cart!.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.color === color &&
        (!withSize || p.size === size),
    );

    if (existingProductIndex !== -1) {
      await cartCollection.updateOne(
        {
          userId: new ObjectId(userId),
          products: {
            $elemMatch: {
              productId: new ObjectId(productId),
              color,
              ...(withSize ? { size } : {}),
            },
          },
        },
        { $inc: { "products.$.quantity": quantity } },
      );
    } else {
      await cartCollection.updateOne(
        { userId: new ObjectId(userId) },
        {
          $push: {
            products: {
              $each: [
                {
                  productId: new ObjectId(productId),
                  quantity,
                  color,
                  ...(withSize ? { size } : {}),
                },
              ],
              $position: 0,
            },
          },
        },
      );
    }

    return "Done.";
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return "An error occurred while adding product to cart.";
  }
}

export async function removeFromCart(
  productId: string,
  color: string,
  size?: string,
): Promise<string> {
  const { userId } = await verifySession();

  if (!userId || !productId || !color) {
    return "Invalid field!";
  }

  try {
    const cartCollection = await getCartCollection();
    const withSize = typeof size === "string";
    const cart = await cartCollection.findOne({ userId: new ObjectId(userId) });

    const existingProduct = cart!.products.find(
      (p) =>
        p.productId.toString() === productId &&
        p.color === color &&
        withSize &&
        p.size === size,
    );

    if (existingProduct?.quantity === 1) {
      await cartCollection.updateOne(
        { userId: new ObjectId(userId) },
        {
          $pull: {
            products: {
              productId: new ObjectId(productId),
              color,
              ...(withSize ? { size } : {}),
            },
          },
        },
      );
      return "Product removed from cart.";
    } else {
      await cartCollection.updateOne(
        {
          userId: new ObjectId(userId),
          products: {
            $elemMatch: {
              productId: new ObjectId(productId),
              color,
              ...(withSize ? { size } : {}),
            },
          },
        },
        { $inc: { "products.$.quantity": -1 } },
      );
      return "Product quantity decreased.";
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return "An error occurred while removing product from cart.";
  }
}

export async function deleteFromCart(
  productId: string,
  color: string,
  size?: string,
): Promise<string> {
  const { userId } = await verifySession();

  if (!userId || !productId || !color) {
    return "Invalid field!";
  }

  try {
    const cartCollection = await getCartCollection();
    const withSize = typeof size === "string";

    const result = await cartCollection.updateOne(
      { userId: new ObjectId(userId) },
      {
        $pull: {
          products: {
            productId: new ObjectId(productId),
            color,
            ...(withSize ? { size } : {}),
          },
        },
      },
    );

    if (result.modifiedCount > 0) {
      return "Product removed from cart!";
    } else {
      return "Product not found in the cart!";
    }
  } catch (error) {
    console.error("Error deleting product from cart:", error);
    return "An error occurred while removing product from cart.";
  }
}

export async function cancelReceiveOrder(
  invoiceId: string,
  products: InvoiceList["invoices"][0]["products"],
  status: "completed" | "cancelled",
): Promise<string> {
  const { userId } = await verifySession();

  if (!userId || !invoiceId) {
    return "User ID or Product ID is missing!";
  }

  try {
    const [invoiceListCollection, productCollection] = await Promise.all([
      getInvoiceListCollection(),
      getProductCollection(),
    ]);

    const invoiceList = await invoiceListCollection.findOne(
      { userId: new ObjectId(userId) },
      {
        projection: {
          invoices: { $elemMatch: { invoiceId: new ObjectId(invoiceId) } },
        },
      },
    );
    const productNames: string[] = [];

    for (const { productId } of products) {
      const product = await productCollection.findOne(
        { _id: new ObjectId(productId) },
        { projection: { name: 1 } },
      );

      if (product) productNames.push(product.name);
    }

    if (!invoiceList) {
      return "Invoice not found!";
    }

    const fullInvoice = invoiceList.invoices[0];
    fullInvoice.status = status;

    await invoiceListCollection.updateOne(
      { userId: new ObjectId(userId) },
      {
        $pull: {
          invoices: { invoiceId: new ObjectId(invoiceId) },
        },
      },
    );

    await Promise.all([
      invoiceListCollection.updateOne(
        { userId: new ObjectId(userId) },
        {
          $push: {
            invoices: {
              $each: [fullInvoice],
              $position: 0,
            },
          },
        },
      ),
      ...(status === "cancelled"
        ? products.map(async ({ productId, quantity, color, size }) => {
            const updateField = size
              ? `colors.${color}.sizes.${size}`
              : `colors.${color}`;

            return await productCollection.updateOne(
              { _id: new ObjectId(productId) },
              { $inc: { [updateField]: quantity } },
            );
          })
        : []),
    ]);

    productNames.forEach((name) => {
      revalidatePath(`/products/${name}`);
    });
    return "Done.";
  } catch (error) {
    console.error("Error:", error);
    return "An error occurred.";
  }
}
