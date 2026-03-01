import React from 'react';
import { Link } from 'react-router-dom';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

export default function CreatePostButton() {
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <Link
        to="/submit"
        className="flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-200"
        title="Create a new post"
      >
        <PencilSquareIcon className="h-7 w-7" />
      </Link>
    </div>
  );
}
