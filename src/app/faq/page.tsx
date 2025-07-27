
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FaqPage() {
  return (
    <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline">Frequently Asked Questions</h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Have questions? We've got answers.
            </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1">
                <AccordionTrigger className="font-semibold text-lg text-left p-4 bg-muted/50 rounded-lg">What items can I report?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground p-4">You can report any item you have lost or found. This includes electronics, wallets, keys, accessories, bags, clothing, bottles, toys, documents, and more. If it's lost, someone might find it!</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger className="font-semibold text-lg text-left p-4 bg-muted/50 rounded-lg">How does the matching work?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground p-4">Our system uses the details you provide—like item category, description, location, and date—to find potential matches. Our AI helps to identify similarities between lost and found reports to increase the chances of a successful reunion.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger className="font-semibold text-lg text-left p-4 bg-muted/50 rounded-lg">Is there a fee to use this service?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground p-4">No, our core service is completely free for individuals to report and search for lost and found items. Our goal is to help reunite people with their belongings.</AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
                <AccordionTrigger className="font-semibold text-lg text-left p-4 bg-muted/50 rounded-lg">How do I claim a found item?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground p-4">If you believe a listed found item is yours, open the item's detail page and use the 'Claim Item' form. Provide specific details that only the owner would know to prove your ownership. The person who found the item will be notified of your claim.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
                <AccordionTrigger className="font-semibold text-lg text-left p-4 bg-muted/50 rounded-lg">What if someone claims my item?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground p-4">You will receive an email notification with the claimant's message. It is your responsibility to review their proof of ownership and coordinate the return. Always meet in a public, safe location.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
                <AccordionTrigger className="font-semibold text-lg text-left p-4 bg-muted/50 rounded-lg">Is my personal information safe?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground p-4">Yes, we take your privacy seriously. Your contact information is only for verification and to connect you with a potential owner or finder. It is not displayed publicly on the website.</AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  );
}
