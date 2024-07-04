'use client'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useHackathons } from "@/hooks/useHackathons";
import Card from "@/components/ui/card";


export default function Home() {
    const [page, setPage] = useState(1);
    const { hackathons, loading } = useHackathons(page, 9); 

    const nextPage = () => {
        setPage(page + 1);
    };

    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <>
            <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
                <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
                    <div className="flex flex-col justify-center gap-8">
                        <h1 className="h2-bold">
                            ITEventsAI — ваш надежный партнер на пути к успеху в IT!
                        </h1>
                        <p className="p-regular-16 md:p-regular-18">
                            ITEventsAI — это ваш персональный помощник, который самостоятельно ищет и предлагает IT ивенты, подходящие именно вам. Приложение автоматически добавляет выбранные события в ваш календарь и помогает организовать задачи до дедлайна.
                        </p>
                        <Button size="lg" asChild className="button w-full sm:w-fit">
                            <Link href="/search">
                                Начать
                            </Link>
                        </Button>
                    </div>

                    <Image
                        src="/assets/images/hero.png"
                        alt="hero"
                        width={1000}
                        height={1000}
                        className="max-h-[70vh] object-contain object-center 2xl:max-h-[70vh]"
                    />
                </div>
            </section>

            <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
                <h2 className="h2-bold">Не упусти свои возможности</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {hackathons.map((hackathon) => (
                                <Card
                                    key={hackathon.title}
                                    title={hackathon.title}
                                    location={hackathon.displayed_location.location}
                                    thumbnail={hackathon.thumbnail_url}
                                    url={hackathon.url}
                                    prize={hackathon.prize_amount}
                                />
                            ))}
                        </div>

                        <div className="flex justify-between mt-4">
                            <button
                                className={`px-4 py-2 bg-gray-200 rounded-md ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                                onClick={prevPage}
                                disabled={page === 1}
                            >
                                Previous
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                onClick={nextPage}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </section>
        </>
    );
}
