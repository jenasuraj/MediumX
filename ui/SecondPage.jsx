import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const SecondPage = () => {
    return (
        <div className="min-h-[80vh] w-full flex flex-col md:flex-row justify-center items-center  p-10">
            <Accordion 
                type="single" 
                collapsible 
                className="w-full md:w-2/5 p-6 rounded-2xl shadow-xl bg-white border border-gray-300 text-black cursor-pointer transition-all duration-300"
            >
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-lg font-semibold hover:text-blue-600 transition-all duration-300">
                        Is it accessible?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                        Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-lg font-semibold hover:text-green-600 transition-all duration-300">
                        Is it styled?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                        Yes. It comes with default styles that match the other components' aesthetic.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-lg font-semibold hover:text-purple-600 transition-all duration-300">
                        Is it animated?
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                        Yes. It's animated by default, but you can disable it if you prefer.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Vertical Divider */}
            <div className="w-[4px] h-[250px] bg-green-500 rounded-full mx-10 hidden md:block"></div>

            {/* Right-Side Content */}
            <div className="text-center md:text-left">
                <h1 className="text-6xl  text-gray-900 mb-2">Hello, This is <span className='text-green-700'>MediumX</span> </h1>
                <h2 className="text-2xl font-medium text-gray-700">Explore the AI Blog</h2>
                <p className="text-gray-600 mt-2 text-lg">Explore, write & publish the trends in MediumX.</p>
            </div>
        </div>
    );
};

export default SecondPage;
