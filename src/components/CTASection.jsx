import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-14">
      <div className="container mx-auto">
        <div className="rounded-xl md:rounded-2xl bg-primary text-primary-foreground px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
          <div className="text-lg md:text-xl text-white font-semibold">
            Secure your workplace with ACME Protection today!
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link href={"/contact"}>
            
            <Button className="rounded-full cursor-pointer bg-white text-primary hover:bg-white/90 w-full sm:w-auto">
              Contact Us
            </Button>
            </Link>
            <Link href={"/services"}>
           
            <Button
              variant="secondary"
              className="rounded-full cursor-pointer text-white border w-full sm:w-auto"
            >
               View Our Services
            </Button>
             </Link>
          </div>
        </div>
      </div>
    </section>
  );
}