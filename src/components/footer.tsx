export default function Footer() {
  return (
    <footer className="bg-card/50 border-t">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FindItNow. All rights reserved.</p>
          <p className="mt-1">Helping communities one found item at a time.</p>
        </div>
      </div>
    </footer>
  );
}
