import {
  getLeadNotes,
  createLeadNote,
  updateLeadNote,
  deleteLeadNote,
  assertLeadBelongsToAffiliate,
  assertLeadExistsForBackOffice,
} from "./partner.service.js";

// ─── Partner Portal ──────────────────────────────────────────────

// GET /leads/:id/notes
export const partnerGetNotes = async (req, res) => {
  try {
    const affiliateId = req.affiliateUser.affiliateId;
    const { id: leadId } = req.params;
    await assertLeadBelongsToAffiliate(affiliateId, leadId);
    const notes = await getLeadNotes(leadId);
    res.status(200).json({ status: "success", data: notes });
  } catch (error) {
    res.status(error.statusCode || 400).json({ status: "error", message: error.message });
  }
};

// POST /leads/:id/notes
export const partnerCreateNote = async (req, res) => {
  try {
    const affiliateId = req.affiliateUser.affiliateId;
    const { id: leadId } = req.params;
    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ status: "error", message: "Note content is required" });
    }
    await assertLeadBelongsToAffiliate(affiliateId, leadId);
    const note = await createLeadNote(leadId, content.trim(), "partner");
    res.status(201).json({ status: "success", data: note });
  } catch (error) {
    res.status(error.statusCode || 400).json({ status: "error", message: error.message });
  }
};

// PUT /leads/:id/notes/:noteId
export const partnerUpdateNote = async (req, res) => {
  try {
    const affiliateId = req.affiliateUser.affiliateId;
    const { id: leadId, noteId } = req.params;
    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ status: "error", message: "Note content is required" });
    }
    await assertLeadBelongsToAffiliate(affiliateId, leadId);
    const note = await updateLeadNote(leadId, noteId, content.trim());
    res.status(200).json({ status: "success", data: note });
  } catch (error) {
    res.status(error.statusCode || 400).json({ status: "error", message: error.message });
  }
};

// DELETE /leads/:id/notes/:noteId
export const partnerDeleteNote = async (req, res) => {
  try {
    const affiliateId = req.affiliateUser.affiliateId;
    const { id: leadId, noteId } = req.params;
    await assertLeadBelongsToAffiliate(affiliateId, leadId);
    await deleteLeadNote(leadId, noteId);
    res.status(200).json({ status: "success", message: "Note deleted" });
  } catch (error) {
    res.status(error.statusCode || 400).json({ status: "error", message: error.message });
  }
};

// ─── Back-Office ─────────────────────────────────────────────────

// GET /back-office/leads/:id/notes
export const adminGetNotes = async (req, res) => {
  try {
    const { id: leadId } = req.params;
    await assertLeadExistsForBackOffice(leadId);
    const notes = await getLeadNotes(leadId);
    res.status(200).json({ statusCode: 200, data: notes });
  } catch (error) {
    res.status(error.statusCode || 400).json({ statusCode: 400, message: error.message });
  }
};

// POST /back-office/leads/:id/notes
export const adminCreateNote = async (req, res) => {
  try {
    const { id: leadId } = req.params;
    const { content } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ statusCode: 400, message: "Note content is required" });
    }
    await assertLeadExistsForBackOffice(leadId);
    const note = await createLeadNote(leadId, content.trim(), "admin");
    res.status(201).json({ statusCode: 201, data: note });
  } catch (error) {
    res.status(error.statusCode || 400).json({ statusCode: 400, message: error.message });
  }
};

// DELETE /back-office/leads/:id/notes/:noteId
export const adminDeleteNote = async (req, res) => {
  try {
    const { id: leadId, noteId } = req.params;
    await assertLeadExistsForBackOffice(leadId);
    await deleteLeadNote(leadId, noteId);
    res.status(200).json({ statusCode: 200, message: "Note deleted" });
  } catch (error) {
    res.status(error.statusCode || 400).json({ statusCode: 400, message: error.message });
  }
};
