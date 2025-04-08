
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/en/Header';
import Footer from '../../components/en/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Help = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-32 pb-20 bg-white">
        <div className="container max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Help & FAQ</h1>
          
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8">
            <p className="mb-8 text-lg text-center text-muted-foreground">
              Find answers to frequently asked questions about our poem generator and service.
            </p>
            
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-10 text-center">
              <p className="mb-4 text-muted-foreground">
                Didn't find what you were looking for?
              </p>
              <Link 
                to="/en/contact" 
                className="btn-primary py-2 px-6"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const faqs = [
  {
    question: "How does the poem generator work?",
    answer: "Our poem generator uses advanced AI technology to create personalized poems based on your inputs. You select options like occasion, audience, theme, and style, and our system crafts a unique poem tailored to your specifications."
  },
  {
    question: "Are the poems really unique?",
    answer: "Yes! Each poem is generated uniquely based on your specific inputs and requirements. Our AI creates original content for every request, ensuring your poem is personalized just for you."
  },
  {
    question: "Can I edit the generated poem?",
    answer: "Absolutely. After purchasing the full poem, you can edit it to add your personal touch or make any changes you'd like before sharing it with others."
  },
  {
    question: "How do I share my poem with others?",
    answer: "After purchasing, you'll have options to share your poem via email, social media, or as an image. You can also print it directly from the preview page."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We currently accept payments via PayPal and major credit cards. All transactions are secure and protected."
  },
  {
    question: "Can I generate poems in languages other than English?",
    answer: "Yes, we also offer German poems. You can switch between languages using the language selector in the header."
  },
  {
    question: "How many poems can I generate?",
    answer: "You can generate as many poems as you like! There's no limit to your creativity."
  }
];

export default Help;
