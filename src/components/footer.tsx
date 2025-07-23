
import Link from "next/link"
import { Sprout } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary font-headline">
                    <Sprout className="h-6 w-6" />
                    FindItNow
                </Link>
                <p className="text-sm text-muted-foreground">Reuniting people with their belongings.</p>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold">Company</h4>
                <nav className="flex flex-col gap-1">
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">About</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Press</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Careers</Link>
                </nav>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold">Legal</h4>
                <nav className="flex flex-col gap-1">
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
                </nav>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold">Connect</h4>
                <nav className="flex flex-col gap-1">
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Twitter</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">LinkedIn</Link>
                </nav>
            </div>
        </div>
        <div className="mt-12 text-center text-sm text-muted-foreground border-t pt-8">
          <p>&copy; {new Date().getFullYear()} FindItNow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
