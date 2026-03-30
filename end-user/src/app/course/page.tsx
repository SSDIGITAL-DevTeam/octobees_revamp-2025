import React from 'react';
import type { Metadata } from 'next';
import CourseList from './CourseList';

export const metadata: Metadata = {
  title: 'Octobees Course - Learn from the Best',
  description: 'Upgrade your digital marketing, SEO, and business skills with Octobees courses.',
};

export default function CoursePage() {
  return (
    <main className="w-full bg-white pt-24 md:pt-32 min-h-screen">
      <CourseList />
    </main>
  );
}
