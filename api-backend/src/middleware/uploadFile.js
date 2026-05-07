import multer from "multer";
import path from "path";
import fs from "fs";

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/"); // folder penyimpanan gambar
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const contentImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `content-${uniqueSuffix}${ext}`);
  },
});
// Konfigurasi penyimpanan
const storageResume = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "upload/resume/";
    fs.mkdirSync(uploadPath, { recursive: true }); // auto-create folder jika belum ada
    cb(null, uploadPath); // folder penyimpanan resume
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Konfigurasi penyimpanan video
const storageVideo = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "upload/videos/";
    fs.mkdirSync(uploadPath, { recursive: true }); // auto-create folder jika belum ada
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `video-${uniqueSuffix}${ext}`);
  },
});

// Filter file (opsional, cek hanya gambar)
const storagePdf = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "upload/pdf/";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `pdf-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const imageOnlyFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed"),
      false,
    );
  }
};

const docFileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF or Word documents are allowed"), false);
  }
};

const videoFileFilter = (req, file, cb) => {
  const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files (mp4, webm, ogg) are allowed"), false);
  }
};

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const contentImageUpload = multer({
  storage: contentImageStorage,
  fileFilter: imageOnlyFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadResume = multer({
  storage: storageResume,
  fileFilter: docFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export const uploadVideo = multer({
  storage: storageVideo,
  fileFilter: videoFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
});

const blogFileFilter = (req, file, cb) => {
  if (file.fieldname === "image" && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else if (file.fieldname === "pdf" && file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type for field: " + file.fieldname), false);
  }
};

export const uploadBlogFiles = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "pdf") {
        const uploadPath = "upload/pdf/";
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
      } else {
        cb(null, "upload/");
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: blogFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
