import React from 'react';
import { Mail } from 'lucide-react';

interface ThreadCardProps {
  title: string;
  author: string;
  time: string;
  content: string;
  replies: number;
}

export function ThreadCard({ title, author, time, content, replies }: ThreadCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 text-black">
      <h3 className="text-3xl font-bold">{title}</h3>
      <p className="text-sm text-[#4D4D4D] mt-1">Posted by {author} • {time}</p>
      <p className="text-xl font-semibold mt-4">{content}</p>
      <div className="mt-6 pt-4 border-t border-[#CDCDCD] flex items-center gap-2">
        <Mail className="w-5 h-5" />
        <span className="text-xl font-semibold">{replies} replies</span>
      </div>
    </div>
  );
}