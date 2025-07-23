
import Link from "next/link"
import { Sprout } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white font-headline">
                    <Sprout className="h-6 w-6 text-primary" />
                    FindItNow
                </Link>
                <p className="text-sm text-gray-400">Reuniting people with their belongings.</p>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold text-white">Company</h4>
                <nav className="flex flex-col gap-1">
                    <Link href="#" className="text-sm text-gray-400 hover:text-white">About</Link>
                    <Link href="#" className="text-sm text-gray-400 hover:text-white">Press</Link>
                    <Link href="#" className="text-sm text-gray-400 hover:text-white">Careers</Link>
                </nav>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold text-white">Legal</h4>
                <nav className="flex flex-col gap-1">
                    <Link href="#" className="text-sm text-gray-400 hover:text-white">Privacy Policy</Link>
                    <Link href="#" className="text-sm text-gray-400 hover:text-white">Terms of Service</Link>
                </nav>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold text-white">Connect</h4>
                <nav className="flex flex-col gap-1">
                    <Link href="#" className="text-sm text-gray-400 hover:text-white">Contact</Link>
                    <Link href="#" className="text-sm text-gray-400 hover:text-white">Twitter</Link>
                    <Link href="#" className="text-sm text-gray-400 hover:text-white">LinkedIn</Link>
                </nav>
            </div>
        </div>
        <div className="mt-12 text-center text-sm text-gray-500 border-t border-gray-800 pt-8">
          <p>&copy; {new Date().getFullYear()} FindItNow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
