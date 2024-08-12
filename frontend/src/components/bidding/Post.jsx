import React, { useEffect, useState } from 'react';
import './Post.css'

const Post = ({ post }) => {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = new Date();
      const endTime = new Date(post.biddingEndTime);
      const difference = endTime - now;
      setRemainingTime(Math.max(0, Math.floor(difference / 1000)));
    };

    calculateRemainingTime();

    const timer = setInterval(() => {
      calculateRemainingTime();
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [post]);

  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = Math.floor(remainingTime % 60);

  return (
    <div className="countdown-container">
    <div className="countdown">
      <p className="countdown-text">Bidding ends in:</p>
      <div className="countdown-timer">
        <span className="countdown-unit">{hours}</span> hours{' '}
        <span className="countdown-unit">{minutes}</span> minutes{' '}
        <span className="countdown-unit">{seconds}</span> seconds
      </div>
    </div>
    {/* Other post details */}
  </div>
  );
};

export default Post;

