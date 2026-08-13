import { db } from "../../drizzle/db.js";
import { voucher } from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";

const getAllVouchers = async () => {
  try {
    const data = await db.select().from(voucher);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getVoucherById = async (id) => {
  try {
    const data = await db.select().from(voucher).where(eq(voucher.id, id));
    if (data.length === 0) throw new Error("Voucher not found");
    return data[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

const createVoucher = async (payload) => {
  try {
    await db.insert(voucher).values(payload);
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateVoucher = async (id, payload) => {
  try {
    await db.update(voucher).set(payload).where(eq(voucher.id, id));
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteVoucher = async (id) => {
  try {
    await db.delete(voucher).where(eq(voucher.id, id));
  } catch (error) {
    throw new Error(error.message);
  }
};

const validateVoucher = async (code) => {
  try {
    const data = await db.select().from(voucher).where(eq(voucher.code, code));
    if (data.length === 0) throw new Error("Voucher not found");
    
    const v = data[0];
    if (!v.isActive) throw new Error("Voucher is not active");
    if (v.maxUsage !== null && v.currentUsage >= v.maxUsage) throw new Error("Voucher usage limit reached");
    
    return {
      message: "Voucher applied successfully",
      voucher: v
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const incrementVoucherUsage = async (code) => {
  try {
    const data = await db.select().from(voucher).where(eq(voucher.code, code));
    if (data.length > 0) {
      const v = data[0];
      await db.update(voucher)
        .set({ currentUsage: v.currentUsage + 1 })
        .where(eq(voucher.id, v.id));
    }
  } catch (error) {
    console.error("Failed to increment voucher usage:", error);
  }
};
export default {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  validateVoucher,
  incrementVoucherUsage
};
