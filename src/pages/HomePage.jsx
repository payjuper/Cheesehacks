import React from "react";
import Feed from '../components/Feed';
import TrendingSidebar from '../components/TrendingSidebar';
import SortBar from '../components/SortBar';
import Pagination from '../components/Pagination';
import CreatePostButton from '../components/CreatePostButton';

export default function HomePage() {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8">
        <Feed />
        <Pagination />
      </div>
      <div className="col-span-4">
        <TrendingSidebar />
      </div>
      <CreatePostButton />
    </div>
  )
}