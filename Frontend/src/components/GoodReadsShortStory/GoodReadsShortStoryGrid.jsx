import React from "react";
import StoryCard from "../ShortStory/ShortStoryCard.jsx";
import { Bookmark } from "lucide-react";

const GoodReadsShortStoryGrid = () => {
    const stories = [
        {
            "id": 1,
            "title": "The Last Train at 2:17 AM",
            "author": "Arjun Malhotra",
            "authorPhoto": "https://randomuser.me/api/portraits/men/32.jpg",
            "coverPic": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
            "likes": 342
        },
        {
            "id": 2,
            "title": "Room 704",
            "author": "Meera Kapoor",
            "authorPhoto": "https://randomuser.me/api/portraits/women/45.jpg",
            "coverPic": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3",
            "likes": 521
        },
        {
            "id": 3,
            "title": "The Day the Sky Froze",
            "author": "Rohan Verma",
            "authorPhoto": "https://randomuser.me/api/portraits/men/54.jpg",
            "coverPic": "https://images.unsplash.com/photo-1519681393784-d120267933ba",
            "likes": 289
        },
        {
            "id": 4,
            "title": "Letters Never Sent",
            "author": "Ananya Singh",
            "authorPhoto": "https://randomuser.me/api/portraits/women/68.jpg",
            "coverPic": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
            "likes": 614
        },
        {
            "id": 5,
            "title": "Midnight on Platform Zero",
            "author": "Kunal Sharma",
            "authorPhoto": "https://randomuser.me/api/portraits/men/71.jpg",
            "coverPic": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
            "likes": 198
        },
        {
            "id": 6,
            "title": "The Silence Between Heartbeats",
            "author": "Ishita Rao",
            "authorPhoto": "https://randomuser.me/api/portraits/women/22.jpg",
            "coverPic": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe",
            "likes": 437
        },
        {
            "id": 7,
            "title": "Echoes in an Empty House",
            "author": "Dev Patel",
            "authorPhoto": "https://randomuser.me/api/portraits/men/19.jpg",
            "coverPic": "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
            "likes": 356
        },
        {
            "id": 8,
            "title": "A Map with No Destinations",
            "author": "Nisha Chatterjee",
            "authorPhoto": "https://randomuser.me/api/portraits/women/12.jpg",
            "coverPic": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
            "likes": 274
        },
        {
            "id": 9,
            "title": "When the Clock Stopped",
            "author": "Siddharth Jain",
            "authorPhoto": "https://randomuser.me/api/portraits/men/88.jpg",
            "coverPic": "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4",
            "likes": 483
        },
        {
            "id": 10,
            "title": "The Girl Who Borrowed Tomorrow",
            "author": "Pooja Mehta",
            "authorPhoto": "https://randomuser.me/api/portraits/women/39.jpg",
            "coverPic": "https://images.unsplash.com/photo-1516542076529-1ea3854896e1",
            "likes": 699
        }
    ]

    return (
        <section className="px-4 md:px-6 py-10 bg-[#141414] min-h-screen">

            {/* ================= HEADER ================= */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Bookmark size={18} className="text-yellow-400" />
                        <h2 className="text-xl font-semibold text-white">
                            Your Good Reads
                        </h2>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                        Stories you’ve saved to read again ✨
                    </p>
                </div>

                <span className="text-sm text-gray-300 bg-[#1f1f1f] px-3 py-1 rounded-full">
                    {stories.length} saved
                </span>
            </div>

            {/* ================= EMPTY STATE ================= */}
            {stories.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20">
                    <Bookmark size={40} className="text-gray-500 mb-4" />
                    <h3 className="text-white text-lg font-medium">
                        No saved stories yet
                    </h3>
                    <p className="text-gray-400 text-sm mt-2 max-w-sm">
                        Start exploring and save stories you love. They’ll appear here.
                    </p>
                </div>
            ) : (
                /* ================= GRID ================= */
                <div
                    className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
          "
                >
                    {stories.map((story) => (
                        <StoryCard
                            key={story.id}
                            story={story}
                            variant="goodRead"
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default GoodReadsShortStoryGrid;
