"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";


//Static target date {replace with desired date}
// Interpreted as October 20, 2026
const TARGET_DATE = new Date('2026-10-20T00:00:00'); 

//Function to calculate remaining time
function calculateTimeRemaining(targetDate: Date) {
  const now = new Date(); //Current date and time
  const difference = Math.max(Number(targetDate) - Number(now.getTime()), 0);

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)), //To get the days
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), //To get the hours
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)), //To get the minutes
    seconds: Math.floor((difference % (1000 * 60)) / 1000), //To get the seconds
  };
}

function DealCountdown() {
  const [timeRemaining, setTimeRemaining] = useState<ReturnType<typeof calculateTimeRemaining>>();

  useEffect(() => {
    //Calculate the initial time remaining
    setTimeRemaining(calculateTimeRemaining(TARGET_DATE));
    const timer = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining(TARGET_DATE);
      setTimeRemaining(newTimeRemaining);

      if(newTimeRemaining.days === 0 && newTimeRemaining.hours === 0 && newTimeRemaining.minutes === 0 && newTimeRemaining.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer); //Cleanup the interval on component unmount
  }, []);


  if (!timeRemaining) {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col justify-center gap-2">
        <h3 className="text-3xl font-bold">Loading CountDown</h3>
        </div>
        </section>
    )
  }

  if(timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes === 0 && timeRemaining.seconds === 0) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="text-3xl font-bold">Deal Has Ended</h3>
          <p>
            This  deal has ended. Please check back later for more exciting offers and promotions. We appreciate your interest and look forward to bringing you new deals in the future!
        </p>
        <div className="text-center">
          <Button
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary"
            asChild
          >
            <Link href="/search">View Products</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image src="/images/promo.jpg" alt="Deal of the Month" width={300} height={300} className="rounded-md" />
      </div>
    </section>
  );
}


  return (
    <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col justify-center gap-2">
        <h3 className="text-3xl font-bold">Deal Of The Month</h3>
        <p>
          Get ready for our exclusive deal of the month! For a limited time,
          enjoy unbeatable discounts on our top products. Don&rsquo;t miss out
          on this opportunity to save big and elevate your shopping experience.
          Act fast, as these deals won&rsquo;t last long! 🎁🛒
        </p>
        <ul className="grid grid-cols-4">
          <StatBox label="Days" value={timeRemaining.days} />
          <StatBox label="Hours" value={timeRemaining.hours} />
          <StatBox label="Minutes" value={timeRemaining.minutes} />
          <StatBox label="Seconds" value={timeRemaining.seconds} />
        </ul>
        <div className="text-center">
          <Button
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary"
            asChild
          >
            <Link href="/search">View Products</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image src="/images/promo.jpg" alt="Deal of the Month" width={300} height={300} className="rounded-md" />
      </div>
    </section>
  );
}

const StatBox = ({ label, value }: { label: string; value: number }) => (
    <li className="p-4 w-full text-center">
        <p className="text-3xl font-bold">{value}</p>
        <p>{label}</p>
    </li>
)


export default DealCountdown;
