import voucherService from "./voucher.service.js";

const getAll = async (req, res) => {
  try {
    const data = await voucherService.getAllVouchers();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await voucherService.getVoucherById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const create = async (req, res) => {
  try {
    await voucherService.createVoucher(req.body);
    res.status(201).json({ message: "Voucher Created Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    await voucherService.updateVoucher(id, req.body);
    res.status(200).json({ message: "Voucher Updated Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const id = req.params.id;
    await voucherService.deleteVoucher(id);
    res.status(200).json({ message: "Voucher Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const validate = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) throw new Error("Voucher code is required");
    const data = await voucherService.validateVoucher(code);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  validate
};
