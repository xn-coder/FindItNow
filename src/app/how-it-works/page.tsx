
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Edit, Bell, Users } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">How It Works</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Reuniting with your lost items is simple. Here’s a step-by-step guide.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
              <Search className="h-8 w-8" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-xl font-headline mb-2">1. Search or Report</CardTitle>
            <p className="text-muted-foreground">
              If you've lost something, start by searching our database. If you've found an item, create a detailed report in minutes.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
              <Edit className="h-8 w-8" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-xl font-headline mb-2">2. Provide Details</CardTitle>
            <p className="text-muted-foreground">
              Add key details like category, location, date, and a description. A clear photo significantly increases your chances of a match.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
              <Bell className="h-8 w-8" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-xl font-headline mb-2">3. Get Notified</CardTitle>
            <p className="text-muted-foreground">
              Our system and community get to work. We'll notify you via email when a potential match is found or when someone enquires about your item.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
              <Users className="h-8 w-8" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-xl font-headline mb-2">4. Connect & Reunite</CardTitle>
            <p className="text-muted-foreground">
              Communicate securely with the other party to verify ownership and arrange a safe reunion. Your personal info is kept private.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
