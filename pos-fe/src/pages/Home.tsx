import { ChartAreaInteractive } from "@/components/home/ChartAreaInteractive";
import { MostCards } from "@/components/home/MostCards";
import { SectionCards } from "@/components/home/SectionCards";



export default function Home() {
    return (
        <>
            {/* <Card className="m-9 p-9 dark:bg-[#010d2b]"> */}
            <div className="mx-9 my-2  px-9 py-2">
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards />
                         <MostCards />
                        <div className="px-4 lg:px-6">
                            <ChartAreaInteractive />
                        </div>
                        </div>
                    </div>
                </div>
            {/* </Card> */}
            </div>
            
        </>
    );
}
