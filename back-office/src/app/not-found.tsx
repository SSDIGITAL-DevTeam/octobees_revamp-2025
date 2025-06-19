import React from 'react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-4">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl font-semibold mb-2">Halaman Tidak Ditemukan</p>
      <p className="text-gray-600 mb-6 text-center">
        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/dashboard"
        className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
};

export default NotFound;
